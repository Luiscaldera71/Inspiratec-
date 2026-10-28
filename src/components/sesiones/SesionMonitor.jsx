import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Lock, Unlock, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal, QrImage, colors, inputStyle, btnStyle } from './ui';
import {
  subscribeSession, subscribeParticipants, getSessionKey, setSessionState, setActiveContent
} from '../../services/sessions/sessionService';
import {
  buildJoinUrl, isLocalOnlyUrl, gradeSubmission, summarizeLeaves, buildResultsCsv
} from '../../services/sessions/sessionLogic';

const URL_KEY = 'inspiratec_public_url';
const readBaseUrl = () => { try { return localStorage.getItem(URL_KEY) || window.location.origin; } catch { return window.location.origin; } };

const ESTADOS = { activo: ['En curso', '#1A73E8'], enviado: ['Enviada', '#188038'] };
const fmtHora = (t) => new Date(t).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function alertTone() {
  try {
    const A = window.AudioContext || window.webkitAudioContext; const a = new A();
    const o = a.createOscillator(); const g = a.createGain(); o.type = 'square'; o.frequency.value = 660;
    o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(0.08, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.35);
    o.start(); o.stop(a.currentTime + 0.4); setTimeout(() => a.close(), 600);
  } catch { /* sin audio */ }
}

/**
 * SesionMonitor
 * Panel del docente para una sesión: QR y código para entrar, estado de cada estudiante en
 * tiempo real, alertas cuando alguien sale de la evaluación, calificación y exportación.
 */
export default function SesionMonitor({ code, onClose }) {
  const [session, setSession] = useState(null);
  const [parts, setParts] = useState([]);
  const [clave, setClave] = useState({});
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState(readBaseUrl);
  const [copiado, setCopiado] = useState(false);
  const [abierto, setAbierto] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [sonido, setSonido] = useState(true);
  const prevSalidas = useRef({});
  const primera = useRef(true);

  useEffect(() => {
    const u1 = subscribeSession(code, setSession, (e) => setError(e.message));
    const u2 = subscribeParticipants(code, setParts, (e) => setError(e.message));
    return () => { u1(); u2(); };
  }, [code]);

  useEffect(() => {
    if (session?.tipo === 'evaluacion') getSessionKey(code).then(setClave).catch((e) => setError(e.message));
  }, [code, session?.tipo]);

  // Alertas en vivo cuando un estudiante sale de la pestaña
  useEffect(() => {
    const nuevas = [];
    parts.forEach((p) => {
      const antes = prevSalidas.current[p.id] ?? 0;
      const ahora = p.salidas || 0;
      if (!primera.current && ahora > antes) {
        const ultimo = [...(p.eventos || [])].reverse().find(e => e.tipo === 'salio');
        nuevas.push({ id: `${p.id}-${ahora}`, texto: `${p.nombre} salió de la evaluación (${ahora} ${ahora === 1 ? 'vez' : 'veces'})${ultimo?.motivo ? `: ${ultimo.motivo}` : ''}`, t: Date.now() });
      }
      prevSalidas.current[p.id] = ahora;
    });
    primera.current = false;
    if (nuevas.length) {
      setAlertas(prev => [...nuevas, ...prev].slice(0, 6));
      if (sonido) alertTone();
    }
  }, [parts, sonido]);

  const joinUrl = buildJoinUrl(baseUrl, code);
  const soloLocal = isLocalOnlyUrl(baseUrl);
  const esEval = session?.tipo === 'evaluacion';

  const filas = useMemo(() => parts.map((p) => {
    const g = esEval ? gradeSubmission(session?.preguntas || [], clave, p.respuestas || {}) : null;
    const { msFuera } = summarizeLeaves(p.eventos || []);
    const respondidas = Object.values(p.respuestas || {}).filter(v => v !== '' && v !== undefined && v !== null).length;
    return { p, g, msFuera, respondidas };
  }).sort((a, b) => (b.p.salidas || 0) - (a.p.salidas || 0) || String(a.p.nombre).localeCompare(String(b.p.nombre))), [parts, session, clave, esEval]);

  const enviadas = parts.filter(p => p.estado === 'enviado');
  const promedio = esEval && enviadas.length
    ? (enviadas.reduce((acc, p) => acc + gradeSubmission(session.preguntas, clave, p.respuestas || {}).nota, 0) / enviadas.length).toFixed(1)
    : '—';

  const guardarUrl = (v) => { setBaseUrl(v); try { localStorage.setItem(URL_KEY, v); } catch { /* sin almacenamiento */ } };
  const copiar = async () => { try { await navigator.clipboard.writeText(joinUrl); setCopiado(true); setTimeout(() => setCopiado(false), 1800); } catch { setError('No se pudo copiar. Selecciona el enlace y cópialo.'); } };
  const cambiarEstado = (estado) => setSessionState(code, estado).catch(e => setError(e.message));

  const descargarCsv = () => {
    const csv = buildResultsCsv(session.preguntas, clave, parts);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `resultados-${code}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  if (!session) {
    return <Modal title="Sesión" onClose={onClose}><p>{error || 'Cargando sesión…'}</p></Modal>;
  }

  const activo = session.activo || { tipo: 'plan', id: null };

  return (
    <Modal title={`${esEval ? 'Evaluación' : 'Clase en vivo'}: ${session.titulo}`} onClose={onClose} width={1000}>
      {error && <p role="alert" style={{ color: colors.red, fontWeight: 600 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center' }}>
          <QrImage value={joinUrl} size={220} />
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '.18em', margin: '8px 0 0', color: colors.dark }}>{code}</div>
          <div style={{ fontSize: 12, color: colors.muted }}>Código para entrar</div>
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontWeight: 700, fontSize: 13, background: session.estado === 'abierta' ? '#E6F4EA' : '#FDECEA', color: session.estado === 'abierta' ? '#188038' : colors.red }}>
              {session.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
            </span>
            {session.estado === 'abierta'
              ? <button type="button" style={btnStyle('danger')} onClick={() => cambiarEstado('cerrada')}><Lock size={14} /> {esEval ? 'Cerrar evaluación' : 'Terminar clase'}</button>
              : <button type="button" style={btnStyle('ghost')} onClick={() => cambiarEstado('abierta')}><Unlock size={14} /> Reabrir</button>}
          </div>

          <label style={{ fontSize: 12, fontWeight: 700 }}>Dirección que abren los celulares
            <input style={{ ...inputStyle, marginTop: 4 }} value={baseUrl} onChange={e => guardarUrl(e.target.value)} />
          </label>
          {soloLocal && (
            <p role="alert" style={{ color: colors.gold, fontSize: 13, margin: '6px 0' }}>
              Estás en «localhost»: los celulares no pueden abrir esa dirección. Escribe aquí la dirección pública de Inspiratec
              (o la IP de tu computador en la red WiFi, por ejemplo http://192.168.1.20:5173) y el QR se actualiza solo.
            </p>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <code style={{ background: colors.soft, padding: '6px 10px', borderRadius: 8, fontSize: 13, overflowWrap: 'anywhere' }}>{joinUrl}</code>
            <button type="button" style={btnStyle('ghost')} onClick={copiar}><Copy size={14} /> {copiado ? '¡Copiado!' : 'Copiar'}</button>
          </div>

          {esEval && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
              {[['Conectados', parts.length], ['Enviadas', enviadas.length], ['Con salidas', parts.filter(p => (p.salidas || 0) > 0).length], ['Promedio (0-5)', promedio]].map(([k, v]) => (
                <div key={k} style={{ background: colors.soft, borderRadius: 12, padding: '8px 14px', minWidth: 90 }}>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 12, color: colors.muted }}>{k}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!esEval && (
        <div style={{ marginTop: 18 }}>
          <strong style={{ fontSize: 14 }}>Lo que ven los estudiantes ahora</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <button type="button" style={{ ...btnStyle(activo.tipo === 'plan' ? 'primary' : 'ghost') }} onClick={() => setActiveContent(code, { tipo: 'plan', id: null }).catch(e => setError(e.message))}>Plan de clase</button>
            {(session.recursos || []).map(r => (
              <button key={r.id} type="button" style={btnStyle(activo.tipo === 'recurso' && activo.id === r.id ? 'primary' : 'ghost')} onClick={() => setActiveContent(code, { tipo: 'recurso', id: r.id }).catch(e => setError(e.message))}>{r.titulo}</button>
            ))}
          </div>
        </div>
      )}

      {esEval && alertas.length > 0 && (
        <div role="status" aria-live="polite" style={{ marginTop: 16, border: `2px solid ${colors.gold}`, background: '#FFF8E6', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={15} /> Alertas de salida</strong>
            <label style={{ fontSize: 12 }}><input type="checkbox" checked={sonido} onChange={e => setSonido(e.target.checked)} /> Sonido</label>
          </div>
          {alertas.map(a => <div key={a.id} style={{ fontSize: 13.5, padding: '2px 0' }}>⚠️ {fmtHora(a.t)} · {a.texto}</div>)}
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <strong>{esEval ? 'Estudiantes' : `Asistentes (${parts.length})`}</strong>
        {esEval && parts.length > 0 && <button type="button" style={btnStyle('ghost')} onClick={descargarCsv}><Download size={14} /> Descargar CSV</button>}
      </div>

      {parts.length === 0 && <p style={{ color: colors.muted }}>Aún no ha entrado nadie. Muestra el QR en el tablero o comparte el enlace.</p>}

      <div style={{ overflowX: 'auto' }}>
        {filas.map(({ p, g, msFuera, respondidas }) => {
          const [etq, col] = ESTADOS[p.estado] || ['—', colors.muted];
          const salidas = p.salidas || 0;
          const open = abierto === p.id;
          return (
            <div key={p.id} style={{ border: `1px solid ${salidas > 0 ? colors.gold : colors.line}`, borderRadius: 12, padding: '10px 12px', marginTop: 8, background: salidas > 0 ? '#FFFBF0' : '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong style={{ flex: '1 1 150px' }}>{p.nombre}</strong>
                {esEval && (
                  <>
                    <span style={{ color: col, fontWeight: 700, fontSize: 13 }}>{etq}{p.envioAutomatico ? ' (automática)' : ''}</span>
                    <span style={{ fontSize: 13 }}>{respondidas}/{session.preguntas.length} resp.</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: salidas > 0 ? colors.red : colors.muted }}>⚠ {salidas} salida{salidas === 1 ? '' : 's'}{msFuera ? ` · ${Math.round(msFuera / 1000)} s fuera` : ''}</span>
                    {p.estado === 'enviado' && g && <span style={{ fontWeight: 800 }}>{g.nota} / 5 <span style={{ fontWeight: 400, color: colors.muted }}>({g.puntaje}/{g.maximo})</span></span>}
                    <button type="button" aria-label="Ver detalle" style={btnStyle('ghost')} onClick={() => setAbierto(open ? null : p.id)}>{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                  </>
                )}
              </div>
              {open && esEval && (
                <div style={{ marginTop: 10, fontSize: 13.5 }}>
                  {p.motivo && <div style={{ color: colors.red, fontWeight: 700 }}>Motivo del envío: {p.motivo}</div>}
                  {(p.eventos || []).length > 0 && (
                    <div style={{ margin: '6px 0' }}>
                      <strong>Eventos</strong>
                      {p.eventos.map((e, i) => <div key={i}>{fmtHora(e.t)} · {e.tipo === 'salio' ? `Salió${e.motivo ? ` (${e.motivo})` : ''}` : `Volvió tras ${Math.round((e.duracionMs || 0) / 1000)} s`}</div>)}
                    </div>
                  )}
                  <strong>Respuestas</strong>
                  {session.preguntas.map((q, i) => {
                    const dada = (p.respuestas || {})[q.id];
                    const det = g?.detalle.find(d => d.id === q.id);
                    return (
                      <div key={q.id} style={{ padding: '4px 0', borderBottom: `1px dashed ${colors.line}` }}>
                        <div>{i + 1}. {q.enunciado}</div>
                        {q.tipo === 'abierta'
                          ? <div style={{ color: colors.dark }}>✍️ {dada || <em>Sin respuesta</em>}{det?.esperada ? <div style={{ color: colors.muted }}>Criterio: {det.esperada}</div> : null}</div>
                          : <div style={{ color: det?.correcta ? '#188038' : colors.red }}>
                              {dada === undefined ? 'Sin responder' : `${q.opciones[dada]} ${det?.correcta ? '✓' : '✗'}`}
                              {!det?.correcta && det?.esperada !== undefined ? <span style={{ color: colors.muted }}> · Correcta: {q.opciones[det.esperada]}</span> : null}
                            </div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
