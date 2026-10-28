import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ items, className = '' }) => {
  return (
    <nav className={`ui-breadcrumbs ${className}`} aria-label="Ruta de navegación">
      <ol className="ui-breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="ui-breadcrumbs-item">
              {isLast ? (
                <span className="ui-breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <a href={item.href} className="ui-breadcrumbs-link" onClick={item.onClick}>
                    {item.label}
                  </a>
                  <ChevronRight size={13} className="ui-breadcrumbs-separator" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
