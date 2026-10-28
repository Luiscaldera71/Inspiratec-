import React from 'react';

/**
 * Gráfico Radial SVG para el Modelo de Felder-Silverman
 * 
 * Presenta 8 ejes radiales correspondientes a los dos polos de cada una
 * de las 4 dimensiones (organizados en pares diametralmente opuestos a 180°):
 * - Activo (Norte) <---> Reflexivo (Sur)
 * - Sensorial (Nororiente) <---> Intuitivo (Suroccidente)
 * - Visual (Oriente) <---> Verbal (Occidente)
 * - Secuencial (Suroriente) <---> Global (Noroccidente)
 * 
 * Accesible para lectores de pantalla y adaptable a dispositivos móviles.
 */
export default function FelderSilvermanRadar({ dimensiones, className = '' }) {
  const cx = 230;
  const cy = 230;
  const maxRadius = 135;

  // 8 Ejes radiales (cada 45 grados, empezando a -90° = Norte)
  // Cada par opuesto (i e i+4) representa los dos polos de una misma dimensión
  const ejes = [
    { id: 'activo', label: 'Activo', dim: 'procesamiento', polo: 'poloA', angle: -90 },
    { id: 'sensorial', label: 'Sensorial', dim: 'percepcion', polo: 'poloA', angle: -45 },
    { id: 'visual', label: 'Visual', dim: 'entrada', polo: 'poloA', angle: 0 },
    { id: 'secuencial', label: 'Secuencial', dim: 'comprension', polo: 'poloA', angle: 45 },
    { id: 'reflexivo', label: 'Reflexivo', dim: 'procesamiento', polo: 'poloB', angle: 90 },
    { id: 'intuitivo', label: 'Intuitivo', dim: 'percepcion', polo: 'poloB', angle: 135 },
    { id: 'verbal', label: 'Verbal', dim: 'entrada', polo: 'poloB', angle: 180 },
    { id: 'global', label: 'Global', dim: 'comprension', polo: 'poloB', angle: 225 },
  ];

  // Helper para convertir ángulo y radio a coordenadas cartesianas (x, y)
  const polarToCartesian = (angleDeg, r) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Obtener valor porcentual para cada eje (garantizando un mínimo del 10% para continuidad visual del polígono)
  const puntosPoligono = ejes.map((eje) => {
    const dimData = dimensiones?.[eje.dim];
    const rawPct = dimData ? (dimData[eje.polo]?.porcentaje ?? 50) : 50;
    // Escalamos entre 15% y 100% para evitar que un vértice colapse totalmente al centro
    const scaledPct = Math.max(15, rawPct);
    const r = (scaledPct / 100) * maxRadius;
    const coords = polarToCartesian(eje.angle, r);
    return {
      ...eje,
      rawPct,
      coords,
    };
  });

  const polygonPointsStr = puntosPoligono
    .map((p) => `${p.coords.x.toFixed(1)},${p.coords.y.toFixed(1)}`)
    .join(' ');

  // Anillos concéntricos de referencia (25%, 50%, 75%, 100%)
  const anillos = [25, 50, 75, 100];

  return (
    <div 
      className={`fs-radar-wrapper ${className}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%', 
        maxWidth: '440px', 
        margin: '0 auto',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <svg
        viewBox="-35 -20 530 500"
        role="img"
        aria-labelledby="fs-radar-title fs-radar-desc"
        style={{ width: '100%', height: 'auto', display: 'block', maxWidth: '100%' }}
      >
        <title id="fs-radar-title">Gráfico radial de gradientes pedagógicos (Felder-Silverman)</title>
        <desc id="fs-radar-desc">
          Muestra los porcentajes calculados en los 8 polos de las 4 dimensiones continuas de preferencias pedagógicas.
        </desc>

        <defs>
          {/* Gradiente radial de fondo del polígono */}
          <radialGradient id="radarAreaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#477A72" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#315B54" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#183630" stopOpacity="0.12" />
          </radialGradient>

          {/* Sombra suave para el polígono de resultados */}
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#183630" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Círculo central base */}
        <circle cx={cx} cy={cy} r={maxRadius} fill="rgba(255, 255, 255, 0.45)" />

        {/* Anillos concéntricos de referencia */}
        {anillos.map((pct) => {
          const r = (pct / 100) * maxRadius;
          return (
            <g key={`ring-${pct}`}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={pct === 50 ? 'rgba(49, 91, 84, 0.38)' : 'rgba(49, 91, 84, 0.16)'}
                strokeWidth={pct === 50 ? 1.5 : 1}
                strokeDasharray={pct === 50 ? 'none' : '3,3'}
              />
              {/* Etiqueta de porcentaje en el eje vertical norte */}
              <text
                x={cx + 4}
                y={cy - r + 11}
                fill="#477A72"
                fontSize="9.5"
                fontWeight={pct === 50 ? '700' : '500'}
                fontFamily="system-ui, -apple-system, sans-serif"
                opacity="0.8"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Ejes radiales (Spokes) */}
        {ejes.map((eje) => {
          const outer = polarToCartesian(eje.angle, maxRadius);
          return (
            <line
              key={`spoke-${eje.id}`}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(49, 91, 84, 0.22)"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Polígono del Perfil Docente */}
        <polygon
          points={polygonPointsStr}
          fill="url(#radarAreaGradient)"
          stroke="#244B43"
          strokeWidth="2.8"
          strokeLinejoin="round"
          filter="url(#radarGlow)"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Puntos y Etiquetas en los vértices */}
        {puntosPoligono.map((p) => {
          // Posicionamiento calculado para la etiqueta de texto exterior
          const labelDist = maxRadius + 26;
          const labelCoords = polarToCartesian(p.angle, labelDist);

          // Anclaje de texto según cuadrante
          let textAnchor = 'middle';
          if (p.angle > -60 && p.angle < 60) textAnchor = 'start';
          else if (p.angle > 120 && p.angle < 240) textAnchor = 'end';

          return (
            <g key={`vertex-${p.id}`}>
              {/* Vértice activo */}
              <circle
                cx={p.coords.x}
                cy={p.coords.y}
                r="5"
                fill="#183630"
                stroke="#FFFFFF"
                strokeWidth="2"
                style={{ transition: 'all 0.4s ease' }}
              />

              {/* Etiqueta del Polo con su porcentaje */}
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="#142B25"
                fontSize="12"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {p.label}
                <tspan
                  fill="#477A72"
                  fontSize="11"
                  fontWeight="600"
                  dx="4"
                >
                  {p.rawPct}%
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>

      {/* Alternativa textual accesible para tecnologías de asistencia (WCAG 2.2 AA) */}
      <div 
        className="sr-only" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        <h4>Resumen numérico accesible de gradientes pedagógicos:</h4>
        <table>
          <thead>
            <tr>
              <th>Dimensión</th>
              <th>Polo A</th>
              <th>Porcentaje A</th>
              <th>Polo B</th>
              <th>Porcentaje B</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {dimensiones && Object.values(dimensiones).map((dim) => (
              <tr key={dim.id}>
                <td>{dim.nombre}</td>
                <td>{dim.poloA.nombre}</td>
                <td>{dim.poloA.porcentaje}%</td>
                <td>{dim.poloB.nombre}</td>
                <td>{dim.poloB.porcentaje}%</td>
                <td>{dim.interpretacionGradiente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#477A72', fontWeight: 500 }}>
        <span>Línea central punteada: 50% (Equilibrio de preferencia pedagógica)</span>
      </div>
    </div>
  );
}
