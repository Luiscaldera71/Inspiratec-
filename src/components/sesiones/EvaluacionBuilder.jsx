import { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Modal, colors, inputStyle, btnStyle } from './ui';
import { generateEvaluationQuestions } from '../../services/aiService';
import { normalizeQuestions } from '../../services/sessions/sessionLogic';
import { createSession } from '../../services/sessions/sessionService';

let uidCounter = 0;
const uid = () => `u${Date.now().toString(36)}${uidCounter++}`;

const blank = (tipo = 'opcion') => ({
  uid: uid(), tipo, enunciado: '', puntos: 1,
  opciones: tipo === 'opcion' ? ['', '', '', ''] : [],
  correcta: tipo === 'vf' ? true : 0, criterio: ''
});

const TIPOS = { opcion: 'Selección múltiple', vf: 'Verdadero o falso', abierta: 'Respuesta abierta' };

/**
 * EvaluacionBuilder
 * El docente arma la evaluación: preguntas generadas con IA a partir de su plan, escritas a mano,
 * o ambas. Al publicar se crea una sesión con QR; las respuestas correctas se guardan aparte.
 */
export default function EvaluacionBuilder({ planGenerado, planId, tema, apiKey, userId, onClose, onCreated }) {
  const [titulo, setTitulo] = useState(tema ? `Evaluación: ${tema}` : 'Evaluación');
  const [cfg, setCfg] = useState({ tiempoMin: 20, antiTrampa: true, maxSalidas: 3, barajar: true });
  const [preguntas, setPreguntas] = useState([]);
  const [ia, setIa] = useState({ cantidad: 8, tipos: ['opcion', 'vf'], dificultad: 'mixta' });
  const [generando, setGenerando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState('');

  const update = (id, patch) => setPreguntas(prev => prev.map(q => (q.uid === id ? { ...q, ...patch } : q)));
  const remove = (id) => setPreguntas(prev => prev.filter(q => q.uid !== id));
  const move = (id, dir) => setPreguntas(prev => {
    const i = prev.findIndex(q => q.uid === id); const j = i + dir;
    if (i < 0 || j < 0 || j >= prev.length) return prev;
    const next = prev.slice(); [next[i], next[j]] = [next[j], next[i]]; return next;
  });

  const generar = async () => {
    if (!apiKey) { setError('Configura tu API Key en Configuración para generar preguntas con IA.'); return; }
    if (ia.tipos.length === 0) { setError('Elige al menos un tipo de pregunta.'); return; }
    setGenerando(true); setError('');
    try {
      const nuevas = await generateEvaluationQuestions(apiKey, planGenerado, ia);
      setPreguntas(prev => [...prev, ...nuevas.map(q => ({ ...blank(q.tipo), ...q, uid: uid(), opciones: q.opciones || [] }))]);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerando(false);
    }
  };

  const publicar = async () => {
    setError('');
    let normalizadas;
    try {
      normalizadas = normalizeQuestions(preguntas.map(({ uid: _u, ...q }, i) => ({ ...q, id: `q${i + 1}` })));
    } catch (e) { setError(e.message); return; }
    if (normalizadas.preguntas.length !== preguntas.length) {
      setError(`Hay ${preguntas.length - normalizadas.preguntas.length} pregunta(s) incompletas: revisa el enunciado, las opciones (mínimo 2) y la respuesta correcta.`);
      return;
    }
    setPublicando(true);
    try {
      const code = await createSession({
        ownerId: userId, tipo: 'evaluacion', titulo: titulo.trim() || 'Evaluación', planTema: tema, planId,
        config: { ...cfg, tiempoMin: Number(cfg.tiempoMin) || 0, maxSalidas: Number(cfg.maxSalidas) || 0 },
        preguntas: normalizadas.preguntas, clave: normalizadas.clave
      });
      onCreated(code);
    } catch (e) {
      setError(e.message);
    } finally {
      setPublicando(false);
    }
  };

  const total = preguntas.reduce((a, q) => a + (q.tipo === 'abierta' ? 0 : Number(q.puntos) || 1), 0);

  return (
    <Modal title="Nueva evaluación" onClose={onClose}>
      <label style={{ fontWeight: 700, fontSize: 13 }}>Título
        <input style={{ ...inputStyle, marginTop: 4 }} value={titulo} onChange={e => setTitulo(e.target.value)} />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, margin: '14px 0' }}>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Tiempo (minutos, 0 = sin límite)
          <input type="number" min="0" max="240" style={{ ...inputStyle, marginTop: 4 }} value={cfg.tiempoMin} onChange={e => setCfg({ ...cfg, tiempoMin: e.target.value })} />
        </label>
        <label style={{ fontSize: 13, fontWeight: 700 }}>Salidas permitidas (0 = solo avisar)
          <input type="number" min="0" max="10" style={{ ...inputStyle, marginTop: 4 }} value={cfg.maxSalidas} onChange={e => setCfg({ ...cfg, maxSalidas: e.target.value })} disabled={!cfg.antiTrampa} />
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13.5 }}>
          <label><input type="checkbox" checked={cfg.antiTrampa} onChange={e => setCfg({ ...cfg, antiTrampa: e.target.checked })} /> Control de salida de pestaña</label>
          <label><input type="checkbox" checked={cfg.barajar} onChange={e => setCfg({ ...cfg, barajar: e.target.checked })} /> Barajar preguntas y opciones</label>
        </div>
      </div>

      <div style={{ background: colors.soft, borderRadius: 14, padding: 14, margin: '8px 0 16px' }}>
        <strong style={{ fontSize: 14 }}>Generar preguntas con IA desde tu plan</strong>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginTop: 10 }}>
          <label style={{ fontSize: 13 }}>Cantidad
            <input type="number" min="1" max="30" style={{ ...inputStyle, width: 80, display: 'block', marginTop: 4 }} value={ia.cantidad} onChange={e => setIa({ ...ia, cantidad: e.target.value })} />
          </label>
          <label style={{ fontSize: 13 }}>Dificultad
            <select style={{ ...inputStyle, display: 'block', marginTop: 4 }} value={ia.dificultad} onChange={e => setIa({ ...ia, dificultad: e.target.value })}>
              <option value="mixta">Mixta</option><option value="básica">Básica</option><option value="intermedia">Intermedia</option><option value="avanzada">Avanzada</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13.5 }}>
            {Object.entries(TIPOS).map(([k, v]) => (
              <label key={k}><input type="checkbox" checked={ia.tipos.includes(k)} onChange={e => setIa({ ...ia, tipos: e.target.checked ? [...ia.tipos, k] : ia.tipos.filter(t => t !== k) })} /> {v}</label>
            ))}
          </div>
          <button type="button" style={btnStyle()} onClick={generar} disabled={generando}>
            {generando ? <Loader2 size={15} className="spin" /> : <Sparkles size={15} />} {generando ? 'Generando…' : 'Generar con IA'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <strong>{preguntas.length} pregunta{preguntas.length === 1 ? '' : 's'} · {total} puntos calificables</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(TIPOS).map(([k, v]) => (
            <button key={k} type="button" style={btnStyle('ghost')} onClick={() => setPreguntas(p => [...p, blank(k)])}><Plus size={14} /> {v}</button>
          ))}
        </div>
      </div>

      {preguntas.length === 0 && <p style={{ color: colors.muted }}>Genera preguntas con IA o agrega las tuyas manualmente.</p>}

      {preguntas.map((q, i) => (
        <div key={q.uid} style={{ border: `1px solid ${colors.line}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8, flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 13 }}>{i + 1}. {TIPOS[q.tipo]}</strong>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {q.tipo !== 'abierta' && (
                <label style={{ fontSize: 12 }}>Puntos <input type="number" min="1" max="20" style={{ ...inputStyle, width: 60, display: 'inline-block' }} value={q.puntos} onChange={e => update(q.uid, { puntos: e.target.value })} /></label>
              )}
              <button type="button" aria-label="Subir" style={btnStyle('ghost')} onClick={() => move(q.uid, -1)}><ArrowUp size={14} /></button>
              <button type="button" aria-label="Bajar" style={btnStyle('ghost')} onClick={() => move(q.uid, 1)}><ArrowDown size={14} /></button>
              <button type="button" aria-label="Eliminar pregunta" style={btnStyle('danger')} onClick={() => remove(q.uid)}><Trash2 size={14} /></button>
            </div>
          </div>
          <textarea style={{ ...inputStyle, minHeight: 56 }} aria-label={`Enunciado de la pregunta ${i + 1}`} value={q.enunciado} onChange={e => update(q.uid, { enunciado: e.target.value })} />

          {q.tipo === 'opcion' && (
            <div style={{ marginTop: 8 }}>
              {q.opciones.map((o, k) => (
                <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <input type="radio" name={`ok-${q.uid}`} checked={q.correcta === k} onChange={() => update(q.uid, { correcta: k })} aria-label={`Marcar la opción ${k + 1} como correcta`} />
                  <input style={inputStyle} value={o} aria-label={`Opción ${k + 1}`} onChange={e => update(q.uid, { opciones: q.opciones.map((x, n) => (n === k ? e.target.value : x)) })} />
                  {q.opciones.length > 2 && (
                    <button type="button" aria-label="Quitar opción" style={btnStyle('ghost')} onClick={() => update(q.uid, { opciones: q.opciones.filter((_, n) => n !== k), correcta: q.correcta === k ? 0 : (q.correcta > k ? q.correcta - 1 : q.correcta) })}><Trash2 size={13} /></button>
                  )}
                </div>
              ))}
              {q.opciones.length < 6 && <button type="button" style={btnStyle('ghost')} onClick={() => update(q.uid, { opciones: [...q.opciones, ''] })}><Plus size={13} /> Opción</button>}
              <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>El círculo marca la respuesta correcta.</div>
            </div>
          )}

          {q.tipo === 'vf' && (
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 14 }}>
              <label><input type="radio" name={`vf-${q.uid}`} checked={q.correcta === true} onChange={() => update(q.uid, { correcta: true })} /> Verdadero</label>
              <label><input type="radio" name={`vf-${q.uid}`} checked={q.correcta === false} onChange={() => update(q.uid, { correcta: false })} /> Falso</label>
            </div>
          )}

          {q.tipo === 'abierta' && (
            <input style={{ ...inputStyle, marginTop: 8 }} placeholder="Criterio de revisión (opcional, solo lo ves tú)" value={q.criterio || ''} onChange={e => update(q.uid, { criterio: e.target.value })} />
          )}
        </div>
      ))}

      {error && <p role="alert" style={{ color: colors.red, fontWeight: 600 }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
        <button type="button" style={btnStyle('ghost')} onClick={onClose}>Cancelar</button>
        <button type="button" style={btnStyle()} disabled={publicando || preguntas.length === 0} onClick={publicar}>
          {publicando ? 'Publicando…' : 'Publicar y mostrar QR'}
        </button>
      </div>
    </Modal>
  );
}
