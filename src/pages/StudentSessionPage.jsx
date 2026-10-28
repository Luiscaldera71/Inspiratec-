import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getSession, subscribeSession, joinSession, getParticipant, saveAnswers, reportLeaveEvent, submitAnswers
} from '../services/sessions/sessionService';
import { buildExamView, evaluateLeavePolicy, normalizeCode } from '../services/sessions/sessionLogic';

/**
 * StudentSessionPage
 * Pantalla pública (sin cuenta) que abre el estudiante al escanear el QR:
 *  - evaluación: responde las preguntas con control de salida de pestaña;
 *  - clase: sigue en vivo lo que el docente muestra (plan o recurso).
 *
 * Importante: ningún navegador permite IMPEDIR que se cambie de pestaña o aplicación. Lo que sí se
 * puede (y se hace) es detectarlo, avisar al estudiante, reportarlo al docente en tiempo real y,
 * si el docente lo configuró, enviar la evaluación automáticamente al superar el máximo de salidas.
 */

const C = { bg: '#0F2A25', card: '#FFFFFF', ink: '#142B25', green: '#315B54', gold: '#F2B84B', red: '#C0392B', muted: '#576864' };
const page = { minHeight: '100dvh', background: C.bg, color: C.ink, fontFamily: '"Segoe UI", system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', boxSizing: 'border-box' };
const card = { background: C.card, borderRadius: 18, padding: '20px', width: '100%', maxWidth: 560, boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,.25)' };
const btn = (bg = C.green, color = '#fff') => ({ background: bg, color, border: 0, borderRadius: 12, padding: '14px 18px', fontSize: 17, fontWeight: 700, width: '100%', cursor: 'pointer' });

const storageKey = (code) => `inspiratec_sesion_${code}`;
const readStore = (code) => { try { return JSON.parse(localStorage.getItem(storageKey(code)) || 'null'); } catch { return null; } };
const writeStore = (code, data) => { try { localStorage.setItem(storageKey(code), JSON.stringify(data)); } catch { /* sin almacenamiento */ } };

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function StudentSessionPage() {
  const { code: rawCode } = useParams();
  const code = normalizeCode(rawCode);

  const [session, setSession] = useState(undefined); // undefined = cargando, null = no existe
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [pid, setPid] = useState(null);
  const [joining, setJoining] = useState(false);

  // Cargar sesión y mantenerla sincronizada (modo clase y cierre de evaluación)
  useEffect(() => {
    let unsub = () => {};
    getSession(code)
      .then((s) => {
        setSession(s);
        if (s) unsub = subscribeSession(code, (live) => setSession(live), (e) => setError(e.message));
      })
      .catch((e) => { setSession(null); setError(e.message); });
    return () => unsub();
  }, [code]);

  // Recuperar al estudiante si recarga la página
  useEffect(() => {
    const saved = readStore(code);
    if (saved?.pid) { setPid(saved.pid); setNombre(saved.nombre || ''); }
  }, [code]);

  const entrar = async () => {
    if (!nombre.trim()) return;
    setJoining(true);
    setError('');
    try {
      const id = await joinSession(code, nombre.trim());
      writeStore(code, { pid: id, nombre: nombre.trim() });
      setPid(id);
    } catch (e) {
      setError(e.message);
    } finally {
      setJoining(false);
    }
  };

  if (session === undefined) return <div style={page}><p style={{ color: '#fff', marginTop: 60 }}>Cargando…</p></div>;

  if (!session) {
    return (
      <div style={page}>
        <div style={{ ...card, marginTop: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22 }}>Sesión no encontrada</h1>
          <p style={{ color: C.muted }}>{error || `El código ${code} no existe o fue eliminado. Revisa el QR o pide el código al docente.`}</p>
        </div>
      </div>
    );
  }

  if (!pid) {
    return (
      <div style={page}>
        <div style={{ ...card, marginTop: 30 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {session.tipo === 'evaluacion' ? 'Evaluación' : 'Clase en vivo'}
          </div>
          <h1 style={{ fontSize: 24, margin: '6px 0 4px' }}>{session.titulo}</h1>
          {session.planTema && <p style={{ margin: 0, color: C.muted }}>{session.planTema}</p>}

          {session.estado !== 'abierta' ? (
            <p style={{ marginTop: 18, color: C.red, fontWeight: 700 }}>Esta sesión está cerrada.</p>
          ) : (
            <>
              <label htmlFor="nombre" style={{ display: 'block', margin: '18px 0 6px', fontWeight: 700 }}>Tu nombre y apellido</label>
              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={60}
                autoComplete="name"
                style={{ width: '100%', boxSizing: 'border-box', fontSize: 18, padding: 12, borderRadius: 10, border: '2px solid #CBD5E1' }}
              />
              {session.tipo === 'evaluacion' && session.config?.antiTrampa !== false && (
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>
                  Durante la evaluación no puedes salir de esta pestaña. Si sales, tu docente recibe el aviso al instante
                  {session.config?.maxSalidas > 0 ? ` y con ${session.config.maxSalidas} salidas tu evaluación se envía automáticamente` : ''}.
                </p>
              )}
              {error && <p role="alert" style={{ color: C.red }}>{error}</p>}
              <button type="button" onClick={entrar} disabled={joining || !nombre.trim()} style={{ ...btn(), marginTop: 8, opacity: joining || !nombre.trim() ? .6 : 1 }}>
                {joining ? 'Entrando…' : 'Entrar'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return session.tipo === 'evaluacion'
    ? <Evaluacion code={code} pid={pid} session={session} nombre={nombre} />
    : <ClaseEnVivo session={session} nombre={nombre} />;
}

// ------------------------------------------------------------------ Evaluación

function Evaluacion({ code, pid, session, nombre }) {
  const cfg = session.config || {};
  const antiTrampa = cfg.antiTrampa !== false;
  const maxSalidas = Number.isInteger(cfg.maxSalidas) ? cfg.maxSalidas : 3;
  const tiempoMin = cfg.tiempoMin > 0 ? cfg.tiempoMin : 0;

  const view = useMemo(() => buildExamView(session.preguntas || [], pid, cfg.barajar !== false), [session.preguntas, pid, cfg.barajar]);

  const [fase, setFase] = useState('inicio'); // inicio | haciendo | enviado
  const [respuestas, setRespuestas] = useState({});
  const [salidas, setSalidas] = useState(0);
  const [aviso, setAviso] = useState('');
  const [restante, setRestante] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const respRef = useRef({});
  const salidasRef = useRef(0);
  const outSince = useRef(null);
  const faseRef = useRef('inicio');
  const sendingRef = useRef(false);
  useEffect(() => { respRef.current = respuestas; }, [respuestas]);
  useEffect(() => { faseRef.current = fase; }, [fase]);

  // Estado previo si recargó la página
  useEffect(() => {
    getParticipant(code, pid).then((p) => {
      if (!p) return;
      setRespuestas(p.respuestas || {});
      setSalidas(p.salidas || 0);
      salidasRef.current = p.salidas || 0;
      if (p.estado === 'enviado') setFase('enviado');
      else if (readStore(code)?.iniciada) {
        setFase('haciendo');
        // Una recarga durante la evaluación se registra como salida
        reportLeaveEvent(code, pid, { tipo: 'salio', t: Date.now(), motivo: 'Recargó o reabrió la página' }).catch(() => {});
        setAviso('Se detectó que recargaste la página. Tu docente fue notificado.');
      }
    }).catch((e) => setError(e.message));
  }, [code, pid]);

  const enviar = useCallback(async ({ automatico = false, motivo = '' } = {}) => {
    if (sendingRef.current || faseRef.current === 'enviado') return;
    sendingRef.current = true;
    setEnviando(true);
    try {
      await submitAnswers(code, pid, respRef.current, { automatico, motivo });
      setFase('enviado');
      writeStore(code, { pid, nombre, iniciada: false });
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    } catch (e) {
      setError(e.message);
      sendingRef.current = false;
    } finally {
      setEnviando(false);
    }
  }, [code, pid, nombre]);

  // Temporizador
  useEffect(() => {
    if (fase !== 'haciendo' || !tiempoMin) return undefined;
    const saved = readStore(code) || {};
    const inicio = saved.inicio || Date.now();
    if (!saved.inicio) writeStore(code, { ...saved, inicio });
    const tick = () => {
      const left = Math.max(0, tiempoMin * 60 - Math.floor((Date.now() - inicio) / 1000));
      setRestante(left);
      if (left <= 0) enviar({ automatico: true, motivo: 'Se acabó el tiempo' });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fase, tiempoMin, code, enviar]);

  // Control de salida de pestaña
  useEffect(() => {
    if (fase !== 'haciendo' || !antiTrampa) return undefined;

    const salio = (motivo) => {
      if (outSince.current) return; // ya se registró esta salida
      outSince.current = Date.now();
      salidasRef.current += 1;
      setSalidas(salidasRef.current);
      reportLeaveEvent(code, pid, { tipo: 'salio', t: outSince.current, motivo }).catch(() => {});
    };
    const volvio = () => {
      if (!outSince.current) return;
      const duracionMs = Date.now() - outSince.current;
      outSince.current = null;
      reportLeaveEvent(code, pid, { tipo: 'volvio', t: Date.now(), duracionMs }).catch(() => {});
      const accion = evaluateLeavePolicy(salidasRef.current, maxSalidas);
      if (accion === 'bloquear') {
        enviar({ automatico: true, motivo: `Superó el máximo de salidas (${maxSalidas})` });
      } else {
        const resto = maxSalidas > 0 ? ` Te quedan ${Math.max(0, maxSalidas - salidasRef.current)} antes del envío automático.` : '';
        setAviso(`Saliste de la evaluación (${salidasRef.current} ${salidasRef.current === 1 ? 'vez' : 'veces'}). Tu docente fue notificado.${resto}`);
      }
    };

    const onVisibility = () => (document.hidden ? salio('Cambió de pestaña o aplicación') : volvio());
    const onBlur = () => salio('La ventana perdió el foco');
    const onFocus = () => { if (!document.hidden) volvio(); };
    const onFullscreen = () => { if (!document.fullscreenElement && faseRef.current === 'haciendo') setAviso('Saliste de la pantalla completa. Vuelve a activarla para continuar.'); };
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    const stop = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('fullscreenchange', onFullscreen);
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('contextmenu', stop);
    document.addEventListener('copy', stop);
    document.addEventListener('paste', stop);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('fullscreenchange', onFullscreen);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('contextmenu', stop);
      document.removeEventListener('copy', stop);
      document.removeEventListener('paste', stop);
    };
  }, [fase, antiTrampa, maxSalidas, code, pid, enviar]);

  // Si el docente cierra la evaluación mientras se responde, se intenta enviar lo que haya
  useEffect(() => {
    if (session.estado === 'cerrada' && fase === 'haciendo') enviar({ automatico: true, motivo: 'El docente cerró la evaluación' });
  }, [session.estado, fase, enviar]);

  const comenzar = async () => {
    writeStore(code, { pid, nombre, iniciada: true, inicio: Date.now() });
    if (antiTrampa) { try { await document.documentElement.requestFullscreen?.(); } catch { /* no disponible en este celular */ } }
    setFase('haciendo');
  };

  const responder = (qid, valor) => {
    const next = { ...respRef.current, [qid]: valor };
    respRef.current = next;
    setRespuestas(next);
    saveAnswers(code, pid, next).catch(() => {});
  };

  const contestadas = view.filter(q => respuestas[q.id] !== undefined && respuestas[q.id] !== '').length;

  if (fase === 'enviado') {
    return (
      <div style={page}>
        <div style={{ ...card, marginTop: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 54 }}>✅</div>
          <h1 style={{ fontSize: 24 }}>¡Respuestas enviadas!</h1>
          <p style={{ color: C.muted }}>{nombre}, tu docente ya recibió tu evaluación. Puedes cerrar esta página.</p>
        </div>
      </div>
    );
  }

  if (fase === 'inicio') {
    return (
      <div style={page}>
        <div style={{ ...card, marginTop: 30 }}>
          <h1 style={{ fontSize: 24, marginTop: 0 }}>{session.titulo}</h1>
          <ul style={{ lineHeight: 1.8, paddingLeft: 20, color: C.muted }}>
            <li>{view.length} preguntas</li>
            {tiempoMin > 0 && <li>Tiempo: {tiempoMin} minutos</li>}
            {antiTrampa && <li>No salgas de esta pestaña: se avisa a tu docente.</li>}
          </ul>
          {error && <p role="alert" style={{ color: C.red }}>{error}</p>}
          <button type="button" onClick={comenzar} style={btn(C.green)}>Comenzar evaluación</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...page, paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, width: '100%', maxWidth: 560, background: C.bg, padding: '4px 0 10px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
        <span>{contestadas}/{view.length} respondidas</span>
        {restante !== null && <span style={{ color: restante <= 60 ? C.gold : '#fff' }}>⏱ {fmt(restante)}</span>}
        {antiTrampa && salidas > 0 && <span style={{ color: C.gold }}>Salidas: {salidas}</span>}
      </div>

      {aviso && (
        <div role="alert" style={{ ...card, background: '#FFF4E5', border: `2px solid ${C.gold}`, marginBottom: 12 }}>
          <strong>⚠️ {aviso}</strong>
          <button type="button" onClick={() => setAviso('')} style={{ ...btn(C.gold, C.ink), marginTop: 10, padding: 10 }}>Entendido, continuar</button>
        </div>
      )}

      {view.map((q, i) => (
        <div key={q.id} style={{ ...card, marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: C.muted, fontWeight: 700 }}>Pregunta {i + 1}</div>
          <p style={{ fontSize: 18, lineHeight: 1.45, margin: '6px 0 12px' }}>{q.enunciado}</p>
          {q.tipo === 'abierta' ? (
            <textarea
              value={respuestas[q.id] || ''}
              onChange={(e) => responder(q.id, e.target.value)}
              rows={4}
              maxLength={1200}
              style={{ width: '100%', boxSizing: 'border-box', fontSize: 16, padding: 10, borderRadius: 10, border: '2px solid #CBD5E1' }}
            />
          ) : (
            q.opcionesView.map((o) => {
              const sel = respuestas[q.id] === o.idx;
              return (
                <button
                  key={o.idx}
                  type="button"
                  onClick={() => responder(q.id, o.idx)}
                  aria-pressed={sel}
                  style={{ display: 'block', width: '100%', textAlign: 'left', margin: '8px 0', padding: '13px 14px', fontSize: 17, borderRadius: 12, cursor: 'pointer', border: `2px solid ${sel ? C.green : '#CBD5E1'}`, background: sel ? '#E6F2EE' : '#fff', fontWeight: sel ? 700 : 400 }}
                >
                  {o.texto}
                </button>
              );
            })
          )}
        </div>
      ))}

      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: 12, background: C.bg, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          {error && <p role="alert" style={{ color: C.gold, margin: '0 0 6px' }}>{error}</p>}
          <button
            type="button"
            disabled={enviando}
            onClick={() => {
              const faltan = view.length - contestadas;
              if (faltan > 0 && !window.confirm(`Te faltan ${faltan} preguntas por responder. ¿Enviar de todos modos?`)) return;
              enviar();
            }}
            style={btn(C.gold, C.ink)}
          >
            {enviando ? 'Enviando…' : 'Enviar evaluación'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Clase en vivo

function ClaseEnVivo({ session, nombre }) {
  const activo = session.activo || { tipo: 'plan', id: null };
  const recurso = activo.tipo === 'recurso' ? (session.recursos || []).find(r => r.id === activo.id) : null;

  return (
    <div style={{ ...page, padding: 0 }}>
      <div style={{ width: '100%', background: C.bg, color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
        <strong style={{ fontSize: 15 }}>{session.titulo}</strong>
        <span style={{ fontSize: 12, opacity: .8 }}>{nombre}</span>
      </div>
      {session.estado !== 'abierta' && <div style={{ width: '100%', background: C.gold, padding: 8, textAlign: 'center', fontWeight: 700 }}>La clase terminó</div>}

      {recurso ? (
        <iframe
          key={recurso.id}
          title={recurso.titulo}
          srcDoc={recurso.html}
          sandbox="allow-scripts"
          style={{ flex: 1, width: '100%', border: 0, background: '#fff', minHeight: '80dvh' }}
        />
      ) : (
        <div style={{ ...card, maxWidth: 760, margin: 16, borderRadius: 12 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{session.contenido || 'El docente aún no ha compartido contenido.'}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
