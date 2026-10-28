import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Dialog = ({ isOpen, onClose, title, children, actions, className = '' }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Mover foco al diálogo
      setTimeout(() => dialogRef.current?.focus(), 10);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="ui-dialog-overlay" onClick={onClose}>
      <div 
        ref={dialogRef}
        className={`ui-dialog ${className}`} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="dialog-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-dialog-header">
          <h2 id="dialog-title" className="ui-dialog-title">{title}</h2>
          <button className="ui-dialog-close" onClick={onClose} aria-label="Cerrar diálogo">×</button>
        </div>
        <div className="ui-dialog-content">
          {children}
        </div>
        {actions && (
          <div className="ui-dialog-actions">
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
