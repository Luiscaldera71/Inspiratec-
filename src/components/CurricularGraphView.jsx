import React, { useState, useMemo } from 'react';
import { 
  CURRICULAR_NODES, 
  CURRICULAR_EJES, 
  CURRICULAR_GRADOS, 
  getCurricularNodeById, 
  getAncestors, 
  getDescendants 
} from '../utils/curricularGraphData';
import { 
  Compass, 
  ArrowRight, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  PlusCircle, 
  GitFork
} from 'lucide-react';

export default function CurricularGraphView({ 
  onSelectReferente = null,
  initialGradoGrupo = null,
  className = '' 
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [activeEjeFilter, setActiveEjeFilter] = useState('todos');
  const [activeGradoFilter, setActiveGradoFilter] = useState(initialGradoGrupo || 'todos');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Nodo actualmente seleccionado
  const selectedNode = useMemo(() => {
    return selectedNodeId ? getCurricularNodeById(selectedNodeId) : null;
  }, [selectedNodeId]);

  // Ancestros y descendientes del nodo seleccionado
  const activeAncestors = useMemo(() => {
    return selectedNodeId ? new Set(getAncestors(selectedNodeId)) : new Set();
  }, [selectedNodeId]);

  const activeDescendants = useMemo(() => {
    return selectedNodeId ? new Set(getDescendants(selectedNodeId)) : new Set();
  }, [selectedNodeId]);

  // Nodos filtrados según criterios
  const visibleNodes = useMemo(() => {
    return CURRICULAR_NODES.filter(node => {
      if (activeEjeFilter !== 'todos' && node.eje !== activeEjeFilter) return false;
      if (activeGradoFilter !== 'todos' && node.gradoGrupo !== activeGradoFilter) return false;
      return true;
    });
  }, [activeEjeFilter, activeGradoFilter]);

  // Generar lista de aristas (relaciones dirigidas de prerrequisito)
  const edges = useMemo(() => {
    const list = [];
    CURRICULAR_NODES.forEach(targetNode => {
      targetNode.prerrequisitos.forEach(sourceId => {
        const sourceNode = getCurricularNodeById(sourceId);
        if (sourceNode) {
          const isHighlighted = selectedNodeId && (
            (selectedNodeId === targetNode.id && activeAncestors.has(sourceId)) ||
            (selectedNodeId === sourceId && activeDescendants.has(targetNode.id))
          );
          const isDimmed = selectedNodeId && !isHighlighted;

          list.push({
            id: `${sourceId}->${targetNode.id}`,
            source: sourceNode,
            target: targetNode,
            isHighlighted,
            isDimmed
          });
        }
      });
    });
    return list;
  }, [selectedNodeId, activeAncestors, activeDescendants]);

  // Manejar selección de nodo
  const handleNodeClick = (nodeId) => {
    setSelectedNodeId(prev => (prev === nodeId ? null : nodeId));
  };

  // Controles de zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(1.4, prev + 0.15));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.65, prev - 0.15));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedNodeId(null);
  };

  const svgWidth = 1000;
  const svgHeight = 520;
  const nodeWidth = 150;
  const nodeHeight = 65;

  return (
    <div 
      className={`curricular-graph-container ${className}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        width: '100%'
      }}
    >
      
      {/* 1. Barra de Controles y Filtros */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px',
          padding: '12px 18px',
          backgroundColor: 'rgba(255, 254, 250, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(49, 91, 84, 0.16)',
          boxShadow: '0 4px 12px rgba(16, 36, 32, 0.04)'
        }}
      >
        {/* Filtros de Grado y Eje */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#1E3B33' }}>
            <Layers size={14} color="#315B54" />
            <span>Grado:</span>
          </div>

          <select 
            value={activeGradoFilter} 
            onChange={(e) => setActiveGradoFilter(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              fontSize: '13px', 
              borderRadius: '10px', 
              border: '1.5px solid rgba(49, 91, 84, 0.22)',
              backgroundColor: '#FFFFFF',
              color: '#142B25',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todos los Grados (1° a 11°)</option>
            {CURRICULAR_GRADOS.map(g => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#1E3B33', marginLeft: '6px' }}>
            <Compass size={14} color="#315B54" />
            <span>Eje:</span>
          </div>

          <select 
            value={activeEjeFilter} 
            onChange={(e) => setActiveEjeFilter(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              fontSize: '13px', 
              borderRadius: '10px', 
              border: '1.5px solid rgba(49, 91, 84, 0.22)',
              backgroundColor: '#FFFFFF',
              color: '#142B25',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todos los Ejes Temáticos</option>
            {Object.values(CURRICULAR_EJES).map(eje => (
              <option key={eje.id} value={eje.id}>{eje.nombre}</option>
            ))}
          </select>
        </div>

        {/* Botones de Zoom y Navegación */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={handleZoomOut} 
            className="btn-outline" 
            style={{ padding: '6px 10px', borderRadius: '8px' }} 
            title="Reducir vista"
            aria-label="Reducir zoom del grafo"
          >
            <ZoomOut size={15} />
          </button>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#315B54', minWidth: '38px', textAlign: 'center' }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            type="button" 
            onClick={handleZoomIn} 
            className="btn-outline" 
            style={{ padding: '6px 10px', borderRadius: '8px' }} 
            title="Aumentar vista"
            aria-label="Aumentar zoom del grafo"
          >
            <ZoomIn size={15} />
          </button>
          <button 
            type="button" 
            onClick={handleResetZoom} 
            className="btn-outline" 
            style={{ padding: '6px 10px', borderRadius: '8px' }} 
            title="Restablecer vista"
            aria-label="Restablecer escala y selección"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 2. Lienzo SVG del Grafo Curricular */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          overflowX: 'auto', 
          borderRadius: '20px', 
          border: '1px solid rgba(49, 91, 84, 0.20)',
          backgroundColor: 'rgba(255, 254, 250, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 30px rgba(16, 36, 32, 0.08)'
        }}
        role="region"
        aria-label="Grafo interactivo de prerrequisitos curriculares"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{
            width: `${100 * zoomLevel}%`,
            minWidth: `${svgWidth * 0.8}px`,
            height: 'auto',
            display: 'block',
            transition: 'width 0.25s ease'
          }}
        >
          <defs>
            {/* Marcadores de flechas para las aristas */}
            <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(49, 91, 84, 0.40)" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#315B54" />
            </marker>
            <marker id="arrow-prereq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#D97706" />
            </marker>
          </defs>

          {/* Columnas de fondo por grupo de grado */}
          {CURRICULAR_GRADOS.map((g, idx) => {
            const colX = 50 + idx * 195;
            const isTargetCol = activeGradoFilter === g.id;

            return (
              <g key={`col-${g.id}`}>
                <rect
                  x={colX - 10}
                  y={20}
                  width={185}
                  height={svgHeight - 40}
                  rx={12}
                  fill={isTargetCol ? 'rgba(49, 91, 84, 0.08)' : 'rgba(255, 255, 255, 0.45)'}
                  stroke={isTargetCol ? '#315B54' : 'rgba(49, 91, 84, 0.10)'}
                  strokeWidth={isTargetCol ? 1.5 : 1}
                />
                <text
                  x={colX + 82}
                  y={46}
                  textAnchor="middle"
                  fill="#142B25"
                  fontSize="12.5"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  {g.label.split('(')[0].trim()}
                </text>
                <text
                  x={colX + 82}
                  y={60}
                  textAnchor="middle"
                  fill="#477A72"
                  fontSize="10"
                  fontWeight="500"
                  fontFamily="system-ui, sans-serif"
                >
                  {g.nivel}
                </text>
              </g>
            );
          })}

          {/* Aristas del Grafo (Curvas Bézier dirigidas) */}
          {edges.map(edge => {
            const sx = edge.source.x + nodeWidth;
            const sy = edge.source.y + nodeHeight / 2;
            const tx = edge.target.x;
            const ty = edge.target.y + nodeHeight / 2;

            const dx = Math.max(40, (tx - sx) / 2);
            const pathData = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

            let strokeColor = 'rgba(49, 91, 84, 0.28)';
            let strokeWidth = 1.6;
            let marker = 'url(#arrow-default)';

            if (edge.isHighlighted) {
              const isPrereqEdge = activeAncestors.has(edge.source.id);
              strokeColor = isPrereqEdge ? '#D97706' : '#315B54';
              strokeWidth = 3;
              marker = isPrereqEdge ? 'url(#arrow-prereq)' : 'url(#arrow-active)';
            } else if (edge.isDimmed) {
              strokeColor = 'rgba(49, 91, 84, 0.08)';
              strokeWidth = 1;
            }

            return (
              <path
                key={edge.id}
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                markerEnd={marker}
                style={{ transition: 'all 0.3s ease' }}
              />
            );
          })}

          {/* Nodos Curriculares */}
          {CURRICULAR_NODES.map(node => {
            const isVisible = visibleNodes.some(vn => vn.id === node.id);
            const isSelected = selectedNodeId === node.id;
            const isPrerequisite = activeAncestors.has(node.id);
            const isDescendant = activeDescendants.has(node.id);
            const isDimmed = selectedNodeId && !isSelected && !isPrerequisite && !isDescendant;

            const ejeInfo = CURRICULAR_EJES[node.eje] || CURRICULAR_EJES.solucion;

            let bgColor = isSelected ? 'rgba(224, 237, 233, 0.96)' : '#FFFFFF';
            let strokeColor = isSelected ? '#183630' : (isPrerequisite ? '#D97706' : (isDescendant ? '#1E40AF' : 'rgba(49, 91, 84, 0.25)'));
            let strokeWidth = isSelected ? 2.8 : (isPrerequisite || isDescendant ? 2.2 : 1.2);
            let opacity = isVisible ? (isDimmed ? 0.35 : 1) : 0.15;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node.id)}
                style={{ cursor: 'pointer', opacity, transition: 'all 0.3s ease' }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Competencia ${node.codigo}: ${node.titulo}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeClick(node.id);
                  }
                }}
              >
                {/* Resplandor decorativo para nodo seleccionado */}
                {isSelected && (
                  <rect
                    x={-4}
                    y={-4}
                    width={nodeWidth + 8}
                    height={nodeHeight + 8}
                    rx={14}
                    fill="none"
                    stroke="#315B54"
                    strokeWidth={1.5}
                    opacity={0.5}
                  />
                )}

                {/* Caja principal del nodo */}
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={10}
                  fill={bgColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter="drop-shadow(0 2px 4px rgba(16, 36, 32, 0.06))"
                />

                {/* Franja vertical indicadora del Eje Curricular */}
                <rect
                  x={0}
                  y={0}
                  width={6}
                  height={nodeHeight}
                  rx={3}
                  fill={ejeInfo.color}
                />

                {/* Código MEN */}
                <text
                  x={12}
                  y={18}
                  fill={ejeInfo.color}
                  fontSize="10"
                  fontWeight="800"
                  fontFamily="system-ui, sans-serif"
                >
                  {node.codigo}
                </text>

                {/* Indicador de rol en la red si hay selección */}
                {isPrerequisite && (
                  <text x={nodeWidth - 10} y={18} textAnchor="end" fill="#D97706" fontSize="9" fontWeight="700">
                    Prerrequisito
                  </text>
                )}
                {isDescendant && (
                  <text x={nodeWidth - 10} y={18} textAnchor="end" fill="#1E40AF" fontSize="9" fontWeight="700">
                    Siguiente
                  </text>
                )}

                {/* Título truncado a 2 líneas */}
                <foreignObject x={12} y={22} width={nodeWidth - 18} height={40}>
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      fontSize: '11px',
                      color: '#142B25',
                      fontWeight: isSelected ? 700 : 600,
                      lineHeight: '1.25',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {node.titulo}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 3. Panel de Detalle del Nodo Seleccionado */}
      {selectedNode ? (
        <div 
          style={{ 
            padding: '22px 26px', 
            backgroundColor: 'rgba(255, 254, 250, 0.95)',
            border: '1.5px solid #315B54',
            borderRadius: '18px',
            boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span 
                  style={{ 
                    padding: '3px 9px', 
                    borderRadius: '8px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    backgroundColor: CURRICULAR_EJES[selectedNode.eje]?.lightColor,
                    color: CURRICULAR_EJES[selectedNode.eje]?.color 
                  }}
                >
                  {selectedNode.codigo}
                </span>
                <span style={{ fontSize: '12px', color: '#477A72', fontWeight: 600 }}>
                  Eje: {CURRICULAR_EJES[selectedNode.eje]?.nombre} • Grados: {CURRICULAR_GRADOS.find(g => g.id === selectedNode.gradoGrupo)?.label}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: 0, fontWeight: 700 }}>
                {selectedNode.titulo}
              </h3>
            </div>

            {onSelectReferente && (
              <button
                type="button"
                onClick={() => onSelectReferente(selectedNode)}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '13.5px' }}
              >
                <PlusCircle size={16} />
                <span>Incorporar al Plan de Clase</span>
              </button>
            )}
          </div>

          <p style={{ fontSize: '14px', color: '#2B453E', lineHeight: '1.6', margin: 0 }}>
            {selectedNode.descripcion}
          </p>

          {/* Relaciones: Prerrequisitos previos y aprendizajes posteriores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '6px' }}>
            {/* Prerrequisitos */}
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(254, 243, 199, 0.60)', borderRadius: '12px', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
              <strong style={{ fontSize: '12.5px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <GitFork size={14} />
                Prerrequisitos formativos previos ({selectedNode.prerrequisitos.length}):
              </strong>
              {selectedNode.prerrequisitos.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#78350F', lineHeight: '1.5' }}>
                  {selectedNode.prerrequisitos.map(prId => {
                    const pr = getCurricularNodeById(prId);
                    return <li key={prId} style={{ cursor: 'pointer' }} onClick={() => handleNodeClick(prId)}><strong>{pr?.codigo}:</strong> {pr?.titulo}</li>;
                  })}
                </ul>
              ) : (
                <span style={{ fontSize: '12px', color: '#B45309' }}>Competencia fundacional (sin prerrequisitos obligatorios en este ciclo).</span>
              )}
            </div>

            {/* Competencias habilitadas */}
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(219, 234, 254, 0.60)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
              <strong style={{ fontSize: '12.5px', color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ArrowRight size={14} />
                Habilita en grados superiores ({Array.from(activeDescendants).length}):
              </strong>
              {Array.from(activeDescendants).length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#1E3A8A', lineHeight: '1.5' }}>
                  {CURRICULAR_NODES.filter(n => n.prerrequisitos.includes(selectedNode.id)).map(nxt => (
                    <li key={nxt.id} style={{ cursor: 'pointer' }} onClick={() => handleNodeClick(nxt.id)}><strong>{nxt.codigo}:</strong> {nxt.titulo}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: '12px', color: '#2563EB' }}>Nodo culmen de ciclo en Educación Media.</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#477A72', padding: '6px 12px' }}>
          <Info size={15} />
          <span>Haz clic sobre cualquier nodo para explorar sus prerrequisitos y transferirlo a tu planeación.</span>
        </div>
      )}

      {/* 4. Resumen accesible para lectores de pantalla */}
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
        <h4>Catálogo de competencias y grafo curricular MEN:</h4>
        <ul>
          {CURRICULAR_NODES.map(n => (
            <li key={n.id}>
              Código: {n.codigo}. Título: {n.titulo}. Eje: {n.eje}. Grado: {n.gradoGrupo}. Prerrequisitos: {n.prerrequisitos.join(', ') || 'Ninguno'}.
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
