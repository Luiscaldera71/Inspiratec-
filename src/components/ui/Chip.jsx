import React from 'react';

export const Chip = ({ label, selected = false, onClick, onRemove, className = '' }) => {
  return (
    <div 
      className={`ui-chip ${selected ? 'ui-chip-selected' : ''} ${onClick ? 'ui-chip-clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="ui-chip-label">{label}</span>
      {onRemove && (
        <button 
          className="ui-chip-remove" 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label={`Quitar ${label}`}
        >
          ×
        </button>
      )}
    </div>
  );
};
