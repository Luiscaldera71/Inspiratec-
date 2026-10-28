import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true,
  confirmLoading = false,
  icon: CustomIcon
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !confirmLoading) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, confirmLoading]);

  if (!isOpen) return null;

  const IconComponent = CustomIcon || (isDestructive ? Trash2 : AlertTriangle);

  return createPortal(
    <AnimatePresence>
      <div 
        className="modal-glass-backdrop"
        onClick={(e) => { if (e.target === e.currentTarget && !confirmLoading) onClose(); }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="modal-glass-card"
          style={{ maxWidth: '480px' }}
        >
          {/* Header */}
          <div className="modal-glass-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(71, 122, 114, 0.14)',
                border: isDestructive ? '1px solid rgba(239, 68, 68, 0.24)' : '1px solid rgba(71, 122, 114, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDestructive ? '#DC2626' : '#1C3D36',
                flexShrink: 0
              }}>
                <IconComponent size={20} />
              </div>
              <h3 id="confirm-modal-title" className="modal-glass-title" style={{ fontSize: '17px' }}>
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={confirmLoading}
              className="modal-glass-close-btn"
              aria-label="Cerrar ventana de confirmación"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-glass-body" style={{ padding: '22px 28px' }}>
            <p id="confirm-modal-desc" style={{ 
              margin: 0, 
              fontSize: '14.5px', 
              lineHeight: '1.6', 
              color: '#26423A' 
            }}>
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="modal-glass-footer">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={confirmLoading}
              style={{ padding: '8px 18px', fontSize: '13.5px' }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmLoading}
              className={isDestructive ? "btn" : "btn btn-primary"}
              style={{
                padding: '8px 22px',
                fontSize: '13.5px',
                backgroundColor: isDestructive ? '#DC2626' : undefined,
                borderColor: isDestructive ? '#B91C1C' : undefined,
                color: '#FFFFFF',
                boxShadow: isDestructive ? '0 4px 12px rgba(220, 38, 38, 0.25)' : undefined
              }}
            >
              {confirmLoading ? 'Procesando...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
