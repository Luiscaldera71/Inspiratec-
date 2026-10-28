import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const BottomSheet = ({ isOpen, onClose, title, children, className = '' }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => sheetRef.current?.focus(), 10);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="ui-bottomsheet-overlay" onClick={onClose}>
      <div 
        ref={sheetRef}
        className={`ui-bottomsheet ${className}`} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="bottomsheet-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ui-bottomsheet-handle"></div>
        <div className="ui-bottomsheet-header">
          <h2 id="bottomsheet-title" className="ui-bottomsheet-title">{title}</h2>
          <button className="ui-bottomsheet-close" onClick={onClose} aria-label="Cerrar panel">×</button>
        </div>
        <div className="ui-bottomsheet-content">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
