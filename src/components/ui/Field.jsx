import React, { useId } from 'react';

/**
 * Field UI Component
 * Wrapper para inputs, selects, textareas con label y soporte para errores/aria
 */
export const Field = React.forwardRef(({ 
  label, 
  error, 
  helpText, 
  className = '', 
  children,
  id: externalId,
  ...props 
}, ref) => {
  const generatedId = useId();
  const id = externalId || generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const childProps = {
    ref,
    id,
    'aria-invalid': !!error,
    'aria-describedby': `${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined,
    className: `ui-input ${error ? 'ui-input-error' : ''}`,
    ...props
  };

  const styledChild = React.isValidElement(children) 
    ? React.cloneElement(children, childProps)
    : <input {...childProps} />;

  return (
    <div className={`ui-field-group ${className}`}>
      {label && <label htmlFor={id} className="ui-field-label">{label}</label>}
      {styledChild}
      {helpText && !error && <div id={helpId} className="ui-field-help">{helpText}</div>}
      {error && (
        <div id={errorId} className="ui-field-error" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
});

Field.displayName = 'Field';
