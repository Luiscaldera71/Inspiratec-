import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * PageLoadingState - Componente visual institucional para estados de carga intermedios.
 * Diseñado con glassmorphism, orbe animado y contraste nítido sobre cualquier fondo ambiental.
 */
export default function PageLoadingState({
  title = "Cargando información...",
  subtitle = "Sincronizando registros curriculares y datos pedagógicos...",
  badge = "INSPIRATEC",
  icon: Icon = Sparkles,
  fullPage = false,
  compact = false,
  minHeight,
  className = "",
  style = {}
}) {
  return (
    <div 
      className={`page-loading-wrapper ${fullPage ? 'is-full-page' : ''} ${className}`}
      style={{ ...(minHeight ? { minHeight } : {}), ...style }}
      role="status"
      aria-live="polite"
    >
      <div className={`page-loading-card ${compact ? 'is-compact' : ''}`}>
        {/* Orbe Institucional Animado con Anillos y Brillo */}
        <div className="page-loading-orb-container" aria-hidden="true">
          <div className="page-loading-orb-ring-outer" />
          <div className="page-loading-orb-ring" />
          <div className="page-loading-orb">
            <Icon size={compact ? 22 : 26} />
          </div>
        </div>

        {/* Badge Pill de Estado */}
        {badge && (
          <div className="page-loading-badge">
            <span className="page-loading-pulse-dot" />
            <span>{badge}</span>
          </div>
        )}

        {/* Título de Alto Contraste */}
        <h3 className="page-loading-title">{title}</h3>

        {/* Subtítulo Descriptivo */}
        {subtitle && <p className="page-loading-subtitle">{subtitle}</p>}

        {/* Barra de Progreso Indeterminada Dinámica */}
        <div className="page-loading-progress-track" aria-hidden="true">
          <div className="page-loading-progress-bar" />
        </div>
      </div>
    </div>
  );
}
