import React from 'react';

/**
 * Banner UI Component
 * @param {string} variant - 'info' | 'warn' | 'danger' | 'success'
 */
export const Banner = ({ children, variant = 'info', icon: Icon, onDismiss, className = '' }) => {
  const variants = {
    info: 'ui-banner-info',
    warn: 'ui-banner-warn',
    danger: 'ui-banner-danger',
    success: 'ui-banner-success',
  };

  return (
    <div className={`ui-banner ${variants[variant] || ''} ${className}`} role="alert">
      {Icon && <div className="ui-banner-icon"><Icon size={20} /></div>}
      <div className="ui-banner-content">{children}</div>
      {onDismiss && (
        <button className="ui-banner-dismiss" onClick={onDismiss} aria-label="Cerrar aviso">
          ×
        </button>
      )}
    </div>
  );
};
