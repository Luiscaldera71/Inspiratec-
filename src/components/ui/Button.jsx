import React from 'react';

/**
 * Button UI Component
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  fullWidth = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60';
  
  // Asumiendo que usaremos utility classes en nuestro CSS o style attributes
  // Ya que B2 dice "Solo tokens, sin estilos en línea", lo mapearemos a clases CSS
  // que implementaremos en ui.css o tokens.css
  const variants = {
    primary: 'ui-btn-primary',
    secondary: 'ui-btn-secondary',
    outline: 'ui-btn-outline',
    ghost: 'ui-btn-ghost',
  };

  const sizes = {
    sm: 'ui-btn-sm',
    md: 'ui-btn-md',
    lg: 'ui-btn-lg',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'ui-btn-full' : ''} ${className}`;

  return (
    <button ref={ref} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
