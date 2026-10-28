import React, { useEffect, useRef } from 'react';
import * as hairline from '@lucasmarkes/hairline';

/**
 * Componente interactivo que renderiza figuras isométricas reactivas al puntero
 * usando la librería @lucasmarkes/hairline.
 */
export default function HairlineFigure({ name = 'laptop', className = '', style = {}, options = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Limpiar contenido previo si hubiese
    el.innerHTML = '';

    const figureFn = hairline[name] || hairline.laptop;
    if (typeof figureFn === 'function') {
      const instance = figureFn(el, options);
      return () => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        } else if (el) {
          el.innerHTML = '';
        }
      };
    }
  }, [name]);

  return (
    <div 
      ref={containerRef} 
      className={`hairline-wrapper ${className}`}
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '200px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...style 
      }} 
    />
  );
}
