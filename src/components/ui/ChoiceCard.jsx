import React from 'react';

export const ChoiceCard = ({ title, description, icon: Icon, selected = false, onClick, className = '' }) => {
  return (
    <div 
      className={`ui-choice-card ${selected ? 'ui-choice-card-selected' : ''} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {Icon && <div className="ui-choice-card-icon"><Icon size={24} /></div>}
      <div className="ui-choice-card-content">
        <h4 className="ui-choice-card-title">{title}</h4>
        {description && <p className="ui-choice-card-desc">{description}</p>}
      </div>
    </div>
  );
};
