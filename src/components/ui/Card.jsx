import React from 'react';

export const Card = ({ children, className = '', padding = 'normal', ...props }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`ui-card ${paddings[padding] || ''} ${className}`} {...props}>
      {children}
    </div>
  );
};
