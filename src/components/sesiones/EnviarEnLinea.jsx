import { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal, colors, btnStyle } from './ui';
import SesionMonitor from './SesionMonitor';
import { createSession } from '../../services/sessions/sessionService';
import { useAppStore } from '../../store/useAppStore';

/**
 * EnviarEnLinea
 * Botón para publicar un recurso interactivo (HTML) y que los estudiantes lo abran desde el
 * celular con un enlace o QR, sin cuenta. Al abrirlo escriben su nombre y el panel del docente
 * muestra en tiempo real quién entró, cuánto avanzó y la nota (0-5) de quien lo termina.
 */
export default function EnviarEnLinea({ titulo = 'Recurso interactivo', html = '', block = false, light = false }) {
  const { userId, planId, activePlanMetadata } = useAppStore();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState(null);

  if (!html) return null;

  const abrirModal = () => {
    setNombre(String(titulo).slice(0, 80));
    setError('');
    setAbierto(true);
  };

  const crear = async () => {
    setCreando(true);
    setError('');
    try {
      const nuevo = await createSession({
        ownerId: userId,
        tipo: 'recurso',
        titulo: nombre.trim() || titulo,
        planTema: activePlanMetadata?.tema || '',
        planId: planId || null,
        recursos: [{ id: 'r1', titulo: nombre.trim() || titulo, html }]
      });
      setAbierto(false);
      setCode(nuevo);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  };

  const estiloBoton = light
    ? { padding: '8px 14px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,.5)', borderRadius: 8, cursor: 'pointer' }
    : { padding: block ? '7px 12px' : '8px 14px', fontSize: block ? 12 : 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: block ? '100%' : 'auto', background: 'linear-gradient(90deg,#3B82F6,#7C5CFF)', color: '#fff', border: 'none', borderRadius: block ? 10 : 8, cursor: 'pointer', boxShadow: '0 8px 18px -8px rgba(79,70,229,.7)' };

  return (
    <>
      <button type="button" onClick={abrirModal} style={estiloBoton} title="Crea un enlace y un QR para que los estudiantes lo usen en su celular y ver sus resultados">
        <Send size={14} /> Enviar a estudiantes
      </button>

      {abierto && (
        <Modal title="Enviar a estudiantes" onClose={() => setAbierto(false)} width={560}>
          <p style={{ marginTop: 0, fontSize: 14, color: colors.muted, lineHeight: 1.55 }}>
            Se creará un <strong>enlace y un código QR</strong>. Tus estudiantes lo abren en el celular, escriben su nombre y usan el recurso.
            Verás en tiempo real <strong>quién entró, cuánto avanzó y su nota (0-5)</strong> cuando lo terminen.
          </p>
          <label style={{ fontWeight: 700, fontSize: 13 }}>Nombre que verán los estudiantes
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={80}
              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.line}`, marginTop: 4 }}
            />
          </label>
          {error && <p role="alert" style={{ color: colors.red, fontWeight: 600 }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" style={btnStyle('ghost')} onClick={() => setAbierto(false)}>Cancelar</button>
            <button type="button" style={btnStyle()} disabled={creando} onClick={crear}>{creando ? 'Creando…' : 'Crear enlace y QR'}</button>
          </div>
        </Modal>
      )}

      {code && <SesionMonitor code={code} onClose={() => setCode(null)} />}
    </>
  );
}
