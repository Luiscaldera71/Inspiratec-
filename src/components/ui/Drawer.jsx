import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Drawer = ({ isOpen, onClose, children, position = 'left', className = '' }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => drawerRef.current?.focus(), 10);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="ui-drawer-overlay" onClick={onClose}>
      <div 
        ref={drawerRef}
        className={`ui-drawer ui-drawer-${position} ${className}`} 
        role="dialog" 
        aria-modal="true" 
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
