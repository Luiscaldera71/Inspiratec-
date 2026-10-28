import React from 'react';

export const Stepper = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`ui-stepper ${className}`} aria-label="Progreso">
      <div className="ui-stepper-progress" aria-hidden="true">
        <div 
          className="ui-stepper-progress-bar" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
        />
      </div>
      <div className="ui-stepper-items">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div 
              key={index} 
              className={`ui-stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="ui-stepper-circle">
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className="ui-stepper-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
