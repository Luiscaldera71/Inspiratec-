import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X } from 'lucide-react';

export const colors = { green: '#315B54', dark: '#142B25', muted: '#576864', line: 'rgba(49, 91, 84, 0.22)', red: '#C0392B', gold: '#B7791F', soft: '#EDF3F1' };

export const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 8,
  border: '1px solid rgba(49, 91, 84, 0.3)', fontSize: 14, fontFamily: 'inherit', background: '#fff'
};

export const btnStyle = (kind = 'primary') => ({
  padding: '8px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
  border: kind === 'primary' ? 'none' : `1px solid ${colors.line}`,
  background: kind === 'primary' ? colors.green : kind === 'danger' ? '#fff' : '#fff',
  color: kind === 'primary' ? '#fff' : kind === 'danger' ? colors.red : colors.dark,
  display: 'inline-flex', alignItems: 'center', gap: 6
});

/** Ventana modal montada en <body>. */
export function Modal({ title, onClose, children, width = 880 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(16, 36, 32, 0.72)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '24px 12px' }}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: width, boxShadow: '0 20px 60px rgba(0,0,0,.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${colors.line}` }}>
          <h3 style={{ margin: 0, fontSize: 18, color: colors.dark }}>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" style={{ ...btnStyle('ghost'), padding: 6 }}><X size={18} /></button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** Código QR generado en el navegador (sin enviar el enlace a ningún servicio externo). */
export function QrImage({ value, size = 240 }) {
  const [src, setSrc] = useState('');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    QRCode.toDataURL(value, { width: size * 2, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => { if (alive) setSrc(url); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [value, size]);

  if (failed) return <div role="alert">No se pudo generar el QR. Comparte el enlace.</div>;
  return src ? <img src={src} alt={`Código QR para entrar: ${value}`} width={size} height={size} style={{ display: 'block', borderRadius: 12, border: `1px solid ${colors.line}` }} /> : <div style={{ width: size, height: size }} />;
}
