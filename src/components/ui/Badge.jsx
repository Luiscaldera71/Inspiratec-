import React from 'react';

/**
 * Badge UI Component
 * @param {string} variant - 'ia' | 'verificado' | 'editado'
 */
export const Badge = ({ children, variant = 'ia', className = '', ...props }) => {
  const variants = {
    ia: 'ui-badge-ia',
    verificado: 'ui-badge-verificado',
    editado: 'ui-badge-editado',
  };

  return (
    <span className={`ui-badge ${variants[variant] || ''} ${className}`} {...props}>
      {children}
    </span>
  );
};
