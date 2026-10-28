import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Toast UI Component
 * Renderiza en un portal o directamente
 */
export const Toast = ({ message, variant = 'success', onClose, duration = 5000, className = '' }) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variants = {
    success: 'ui-toast-success',
    error: 'ui-toast-error',
    info: 'ui-toast-info',
  };

  const toastContent = (
    <div className={`ui-toast ${variants[variant] || ''} ${className}`} role="status" aria-live="polite">
      <div className="ui-toast-message">{message}</div>
      {onClose && (
        <button className="ui-toast-close" onClick={onClose} aria-label="Cerrar notificación">
          ×
        </button>
      )}
    </div>
  );

  // Intentar renderizar en un contenedor portal, de lo contrario en el lugar
  const portalRoot = document.getElementById('toast-root');
  if (portalRoot) {
    return createPortal(toastContent, portalRoot);
  }
  
  return toastContent;
};
