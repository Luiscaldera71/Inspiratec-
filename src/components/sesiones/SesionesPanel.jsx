import { useCallback, useEffect, useState } from 'react';
import { QrCode, ClipboardCheck, Radio, Trash2, Lock, Unlock, Eye } from 'lucide-react';
import { Modal, colors, btnStyle } from './ui';
import EvaluacionBuilder from './EvaluacionBuilder';
import SesionMonitor from './SesionMonitor';
import { createSession, listMySessions, setSessionState, deleteSession } from '../../services/sessions/sessionService';

/** Quita los marcadores internos del plan para que los estudiantes lean un texto limpio. */
const limpiarPlan = (md = '') => md.replace(/\[GENERATE_IMAGE:\s*["'](.*?)["']\]/gi, '_Recurso: $1_');

function ClaseBuilder({ planGenerado, planId, tema, userId, recursosAnexos, onClose, onCreated }) {
  const [titulo, setTitulo] = useState(tema ? `Clase: ${tema}` : 'Clase en vivo');
  const [sel, setSel] = useState(() => new Set());
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  const lista = recursosAnexos.map((r, i) => ({ ...r, id: r.id || `r${i}` }));
  const toggle = (id) => setSel(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const crear = async () => {
    setCreando(true); setError('');
    try {
      const recursos = lista.filter(r => sel.has(r.id)).map(r => ({ id: r.id, titulo: r.title, html: r.html }));
      const code = await createSession({
        ownerId: userId, tipo: 'clase', titulo: titulo.trim() || 'Clase en vivo', planTema: tema, planId,
        contenido: limpiarPlan(planGenerado), recursos
      });
      onCreated(code);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  };

  return (
    <Modal title="Compartir la clase con los estudiantes" onClose={onClose} width={640}>
      <label style={{ fontWeight: 700, fontSize: 13 }}>Título
        <input style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.line}`, marginTop: 4 }} value={titulo} onChange={e => setTitulo(e.target.value)} />
      </label>
      <p style={{ fontSize: 13.5, color: colors.muted }}>Los estudiantes verán el plan de la clase y, cuando tú lo decidas, los recursos que elijas aquí. Cambias lo que ven en vivo desde el panel de la sesión.</p>
      <strong style={{ fontSize: 14 }}>Recursos para compartir</strong>
      {lista.length === 0 && <p style={{ color: colors.muted, fontSize: 13.5 }}>Este plan aún no tiene recursos. Genera alguno en la sección Recursos para poder proyectarlo en los celulares.</p>}
      {lista.map(r => (
        <label key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 14 }}>
          <input type="checkbox" checked={sel.has(r.id)} onChange={() => toggle(r.id)} /> {r.title}
        </label>
      ))}
      {error && <p role="alert" style={{ color: colors.red, fontWeight: 600 }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
        <button type="button" style={btnStyle('ghost')} onClick={onClose}>Cancelar</button>
        <button type="button" style={btnStyle()} disabled={creando} onClick={crear}>{creando ? 'Creando…' : 'Crear y mostrar QR'}</button>
      </div>
    </Modal>
  );
}

/**
 * SesionesPanel
 * Evaluaciones y clases en vivo con QR para este plan. Se muestra dentro de la sección Recursos.
 * `abrir` permite que el catálogo de recursos lance el constructor correspondiente.
 */
export default function SesionesPanel({ abrir, onCerrarConstructor, planGenerado, planId, tema, apiKey, userId, recursosAnexos }) {
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [monitor, setMonitor] = useState(null);
  const [confirmarBorrar, setConfirmarBorrar] = useState(null);

  const cargar = useCallback(async () => {
    if (!userId) return;
    setCargando(true); setError('');
    try {
      const todas = await listMySessions(userId);
      setSesiones(todas.filter(s => (planId ? s.planId === planId : s.planTema === tema)));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [userId, planId, tema]);

  useEffect(() => { cargar(); }, [cargar]);

  const creada = (code) => { onCerrarConstructor(); setMonitor(code); cargar(); };

  return (
    <section aria-labelledby="titulo-sesiones" style={{ marginTop: 28 }}>
      <h3 id="titulo-sesiones" style={{ margin: '0 0 10px', fontSize: 18, color: colors.dark, display: 'flex', alignItems: 'center', gap: 8 }}>
        <QrCode size={18} /> Sesiones en vivo de este plan
      </h3>
      {error && <p role="alert" style={{ color: colors.red }}>{error}</p>}
      {!cargando && sesiones.length === 0 && !error && <p style={{ color: colors.muted, fontSize: 13.5 }}>Aún no has creado evaluaciones ni clases en vivo para este plan.</p>}

      {sesiones.map(s => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, padding: '10px 14px', border: `1px solid ${colors.line}`, borderRadius: 12, background: '#fff', marginBottom: 8 }}>
          <div style={{ minWidth: 0, flex: '1 1 220px' }}>
            <div style={{ fontWeight: 700, color: colors.dark, overflowWrap: 'anywhere' }}>{s.titulo}</div>
            <div style={{ fontSize: 12, color: colors.muted }}>
              {s.tipo === 'evaluacion' ? <><ClipboardCheck size={12} /> Evaluación</> : <><Radio size={12} /> Clase en vivo</>} · Código {s.id} · {s.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" style={btnStyle()} onClick={() => setMonitor(s.id)}><Eye size={14} /> Abrir</button>
            <button type="button" style={btnStyle('ghost')} onClick={() => setSessionState(s.id, s.estado === 'abierta' ? 'cerrada' : 'abierta').then(cargar).catch(e => setError(e.message))}>
              {s.estado === 'abierta' ? <><Lock size={14} /> Cerrar</> : <><Unlock size={14} /> Reabrir</>}
            </button>
            <button type="button" aria-label={`Eliminar ${s.titulo}`} style={btnStyle('danger')} onClick={() => setConfirmarBorrar(s)}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}

      {abrir === 'evaluacion' && (
        <EvaluacionBuilder planGenerado={planGenerado} planId={planId} tema={tema} apiKey={apiKey} userId={userId} onClose={onCerrarConstructor} onCreated={creada} />
      )}
      {abrir === 'clase' && (
        <ClaseBuilder planGenerado={planGenerado} planId={planId} tema={tema} userId={userId} recursosAnexos={recursosAnexos} onClose={onCerrarConstructor} onCreated={creada} />
      )}
      {monitor && <SesionMonitor code={monitor} onClose={() => { setMonitor(null); cargar(); }} />}

      {confirmarBorrar && (
        <Modal title="Eliminar sesión" onClose={() => setConfirmarBorrar(null)} width={460}>
          <p>Se eliminará «{confirmarBorrar.titulo}» con todas las respuestas de los estudiantes. Esta acción no se puede deshacer.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" style={btnStyle('ghost')} onClick={() => setConfirmarBorrar(null)}>Cancelar</button>
            <button type="button" style={{ ...btnStyle(), background: colors.red }} onClick={() => deleteSession(confirmarBorrar.id).then(() => { setConfirmarBorrar(null); cargar(); }).catch(e => { setError(e.message); setConfirmarBorrar(null); })}>Eliminar</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
