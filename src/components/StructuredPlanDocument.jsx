import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { parsePlanToStructuredBlocks, serializeStructuredBlocksToMarkdown } from '../utils/planDocumentParser';
import { Plus, Trash2, Check, X, Table as TableIcon, ChevronDown, ChevronUp } from 'lucide-react';
import EmbeddedInteractiveResource from './EmbeddedInteractiveResource';

const GENERATE_IMAGE_REGEX = /\[GENERATE_IMAGE:\s*(?:&quot;|["'])(.*?)(?:&quot;|["'])\]/i;

function processInteractiveChildren(children) {
  if (!children) return children;

  if (typeof children === 'string') {
    if (!GENERATE_IMAGE_REGEX.test(children)) return children;
    const parts = [];
    let remaining = children;
    let match;
    let keyIdx = 0;

    while ((match = GENERATE_IMAGE_REGEX.exec(remaining)) !== null) {
      const matchIndex = match.index;
      const matchLength = match[0].length;
      const promptText = match[1];

      if (matchIndex > 0) {
        parts.push(remaining.substring(0, matchIndex));
      }

      parts.push(
        <EmbeddedInteractiveResource 
          key={`embed-res-${keyIdx++}`} 
          prompt={promptText} 
        />
      );

      remaining = remaining.substring(matchIndex + matchLength);
    }

    if (remaining) {
      parts.push(remaining);
    }

    return parts;
  }

  if (Array.isArray(children)) {
    let hasMatch = false;
    const newChildren = [];

    children.forEach((child, idx) => {
      if (typeof child === 'string' && GENERATE_IMAGE_REGEX.test(child)) {
        hasMatch = true;
        const processed = processInteractiveChildren(child);
        if (Array.isArray(processed)) {
          newChildren.push(...processed);
        } else {
          newChildren.push(processed);
        }
      } else if (React.isValidElement(child) && child.props && child.props.children) {
        const nestedProcessed = processInteractiveChildren(child.props.children);
        if (nestedProcessed !== child.props.children) {
          hasMatch = true;
          newChildren.push(React.cloneElement(child, { key: child.key || idx }, nestedProcessed));
        } else {
          newChildren.push(child);
        }
      } else {
        newChildren.push(child);
      }
    });

    return hasMatch ? newChildren : children;
  }

  return children;
}

/**
 * AutoResizingTextarea
 * Permite que los campos de párrafo y celdas de tabla crezcan fluidamente con el texto,
 * conservando la misma tipografía, interlineado y color de la vista de lectura.
 */
function AutoResizingTextarea({ value, onChange, placeholder, style, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 38)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(49, 91, 84, 0.20)',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        color: '#1C1917',
        fontFamily: 'inherit',
        resize: 'none',
        overflow: 'hidden',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#315B54';
        e.target.style.boxShadow = '0 0 0 3px rgba(49, 91, 84, 0.12)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'rgba(49, 91, 84, 0.20)';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
}

/**
 * CollapsibleMomentCard
 * Convierte cada fila de la matriz didáctica en una tarjeta colapsable táctil
 * para dispositivos móviles y pantallas estrechas (< 768px).
 */
function CollapsibleMomentCard({
  rIdx,
  row,
  headers,
  onCellChange,
  onRemove,
  canRemove
}) {
  const [isOpen, setIsOpen] = useState(true);
  const rawTitle = row[0] || `Momento ${rIdx + 1}`;
  const displayTitle = rawTitle.replace(/\*\*/g, '').trim();

  return (
    <div className="structured-moment-card">
      <div 
        className="structured-moment-header"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        <div className="structured-moment-title-wrap">
          <span className="structured-moment-badge">Fase {rIdx + 1}</span>
          <span className="structured-moment-title">{displayTitle || `Momento ${rIdx + 1}`}</span>
        </div>
        <div className="structured-moment-actions" onClick={(e) => e.stopPropagation()}>
          {canRemove && (
            <button
              type="button"
              className="structured-moment-del-btn"
              onClick={onRemove}
              title="Eliminar este momento"
              aria-label={`Eliminar momento ${rIdx + 1}`}
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            type="button"
            className="structured-moment-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Contraer momento" : "Expandir momento"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="structured-moment-body">
          {headers.map((h, cIdx) => (
            <div key={cIdx} className="structured-moment-field">
              <label className="structured-moment-label">
                {h}
              </label>
              <AutoResizingTextarea
                value={row[cIdx] || ''}
                onChange={(e) => onCellChange(cIdx, e.target.value)}
                placeholder={`Contenido de ${h}...`}
                style={{
                  fontSize: '13.5px',
                  lineHeight: '1.5',
                  padding: '9px 11px',
                  borderRadius: '9px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(49, 91, 84, 0.22)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * StructuredPlanDocument
 * Unifica la presentación visual y la edición estructurada del plan de clase.
 * Garantiza que tanto al consultar como al editar, el plan mantenga un estilo
 * académico homogéneo, legible y sin Markdown crudo (#, |, ---).
 */
export default function StructuredPlanDocument({
  markdown = '',
  isEditing = false,
  onBlocksChange,
  onSave,
  onCancel
}) {
  const [blocks, setBlocks] = useState(() => parsePlanToStructuredBlocks(markdown));

  // Sincronizar bloques cuando el markdown externo cambie y no estemos en edición activa
  useEffect(() => {
    if (!isEditing) {
      setBlocks(parsePlanToStructuredBlocks(markdown));
    }
  }, [markdown, isEditing]);

  const updateBlock = (index, updatedFields) => {
    setBlocks(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updatedFields };
      if (onBlocksChange) {
        const serialized = serializeStructuredBlocksToMarkdown(next);
        onBlocksChange(next, serialized);
      }
      return next;
    });
  };

  const removeBlock = (index) => {
    setBlocks(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      if (onBlocksChange) {
        const serialized = serializeStructuredBlocksToMarkdown(next);
        onBlocksChange(next, serialized);
      }
      return next;
    });
  };

  // ----------------------------------------------------
  // MANIPULACIÓN DE TABLAS ESTRUCTURADAS (Secuencia Didáctica)
  // ----------------------------------------------------
  const handleTableCellChange = (blockIndex, rowIndex, colIndex, val) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetTable = { ...next[blockIndex] };
      const updatedRows = targetTable.rows.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row;
        const newRow = [...row];
        newRow[colIndex] = val;
        return newRow;
      });
      targetTable.rows = updatedRows;
      next[blockIndex] = targetTable;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  const handleAddTableRow = (blockIndex) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetTable = { ...next[blockIndex] };
      const emptyRow = (targetTable.headers || []).map((_, i) => i === 0 ? '**Fase adicional**' : '');
      targetTable.rows = [...targetTable.rows, emptyRow];
      next[blockIndex] = targetTable;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  const handleRemoveTableRow = (blockIndex, rowIndex) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetTable = { ...next[blockIndex] };
      if (targetTable.rows.length <= 1) return prev; // Mantener al menos una fila
      targetTable.rows = targetTable.rows.filter((_, rIdx) => rIdx !== rowIndex);
      next[blockIndex] = targetTable;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  // ----------------------------------------------------
  // MANIPULACIÓN DE LISTAS ESTRUCTURADAS
  // ----------------------------------------------------
  const handleListItemChange = (blockIndex, itemIndex, val) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetList = { ...next[blockIndex] };
      const newItems = [...targetList.items];
      newItems[itemIndex] = val;
      targetList.items = newItems;
      next[blockIndex] = targetList;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  const handleAddListItem = (blockIndex) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetList = { ...next[blockIndex] };
      targetList.items = [...targetList.items, ''];
      next[blockIndex] = targetList;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  const handleRemoveListItem = (blockIndex, itemIndex) => {
    setBlocks(prev => {
      const next = [...prev];
      const targetList = { ...next[blockIndex] };
      if (targetList.items.length <= 1) return prev;
      targetList.items = targetList.items.filter((_, idx) => idx !== itemIndex);
      next[blockIndex] = targetList;
      if (onBlocksChange) {
        onBlocksChange(next, serializeStructuredBlocksToMarkdown(next));
      }
      return next;
    });
  };

  // ====================================================
  // MODO LECTURA: Presentación visual unificada con ReactMarkdown
  // ====================================================
  if (!isEditing) {
    return (
      <article className="markdown-content" id="plan-content-wrapper" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '12px 6px', boxSizing: 'border-box' }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ ...props }) => (
              <h1 
                style={{ 
                  color: '#142B25', 
                  fontSize: 'clamp(21px, 2.3vw, 25px)', 
                  fontWeight: 800, 
                  fontFamily: 'var(--font-heading)', 
                  borderBottom: '2px solid #315B54', 
                  paddingBottom: '10px', 
                  marginTop: '0px', 
                  marginBottom: '16px', 
                  letterSpacing: '-0.015em' 
                }} 
                {...props} 
              />
            ),
            h2: ({ ...props }) => (
              <h2 
                style={{ 
                  color: '#142B25', 
                  fontSize: '18.5px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-heading)', 
                  borderBottom: '1px solid rgba(49, 91, 84, 0.20)', 
                  paddingBottom: '6px', 
                  marginTop: '22px', 
                  marginBottom: '12px' 
                }} 
                {...props} 
              />
            ),
            h3: ({ ...props }) => (
              <h3 
                style={{ 
                  color: '#315B54', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-heading)', 
                  borderBottom: '1px solid rgba(49, 91, 84, 0.12)', 
                  paddingBottom: '4px', 
                  marginTop: '16px', 
                  marginBottom: '10px' 
                }} 
                {...props} 
              />
            ),
            h4: ({ ...props }) => (
              <h4 
                style={{ 
                  color: '#1E3B34', 
                  fontSize: '14.5px', 
                  fontWeight: 700, 
                  fontFamily: 'var(--font-heading)', 
                  marginTop: '12px', 
                  marginBottom: '6px' 
                }} 
                {...props} 
              />
            ),
            p: ({ children, node: _node, ...props }) => {
              const processed = processInteractiveChildren(children);
              // Un <div> (recurso embebido) no puede ir dentro de <p>
              const Tag = processed !== children ? 'div' : 'p';
              return (
                <Tag
                  style={{
                    fontSize: '14.5px',
                    lineHeight: '1.65',
                    color: '#1C1917',
                    marginBottom: '10px'
                  }}
                  {...props}
                >
                  {processed}
                </Tag>
              );
            },
            ul: ({ ...props }) => (
              <ul 
                style={{ 
                  paddingLeft: '20px', 
                  marginBottom: '12px', 
                  lineHeight: '1.6' 
                }} 
                {...props} 
              />
            ),
            ol: ({ ...props }) => (
              <ol 
                style={{ 
                  paddingLeft: '20px', 
                  marginBottom: '12px', 
                  lineHeight: '1.6' 
                }} 
                {...props} 
              />
            ),
            li: ({ children, ...props }) => (
              <li 
                style={{ 
                  fontSize: '14px', 
                  color: '#1C1917', 
                  marginBottom: '4px' 
                }} 
                {...props} 
              >
                {processInteractiveChildren(children)}
              </li>
            ),
            blockquote: ({ ...props }) => (
              <blockquote 
                style={{ 
                  borderLeft: '4px solid #477A72', 
                  backgroundColor: 'rgba(71, 122, 114, 0.08)', 
                  padding: '10px 16px', 
                  borderRadius: '0 10px 10px 0', 
                  margin: '14px 0', 
                  fontStyle: 'italic', 
                  color: '#234B43' 
                }} 
                {...props} 
              />
            ),
            hr: () => (
              <hr style={{ border: 'none', borderTop: '1px solid rgba(49, 91, 84, 0.16)', margin: '18px 0' }} />
            ),
            table: ({ ...props }) => (
              <div className="editor-doc-table-wrapper" style={{ overflowX: 'auto', margin: '16px 0', borderRadius: '12px', border: '1px solid rgba(49, 91, 84, 0.20)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <table className="plan-sequence-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }} {...props} />
              </div>
            ),
            th: ({ ...props }) => (
              <th style={{ backgroundColor: '#EDF3F1', color: '#142B25', fontWeight: 700, padding: '10px 14px', borderBottom: '1.5px solid #CBD5E1', textAlign: 'left' }} {...props} />
            ),
            td: ({ children, ...props }) => (
              <td style={{ padding: '10px 14px', borderBottom: '1px solid #E2E8F0', verticalAlign: 'top', color: '#1C1917', lineHeight: '1.55' }} {...props}>
                {processInteractiveChildren(children)}
              </td>
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    );
  }

  // ====================================================
  // MODO EDICIÓN ESTRUCTURADA: Documento in-situ sin Markdown crudo
  // ====================================================
  return (
    <div className="structured-plan-editor" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '8px 4px', boxSizing: 'border-box' }}>
      
      {/* Barra de estado y confirmación superior del editor */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 16px', 
          marginBottom: '24px', 
          borderRadius: '14px', 
          backgroundColor: 'rgba(49, 91, 84, 0.08)', 
          border: '1px solid rgba(49, 91, 84, 0.20)' 
        }}
      >
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#142B25', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#315B54' }}></span>
            Modo Edición Estructurada
          </span>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#576864' }}>
            Edita directamente los títulos, listas y celdas sin alterar la presentación académica ni la estructura del plan.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {onCancel && (
            <button 
              type="button" 
              className="btn-outline" 
              onClick={onCancel}
              style={{ padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <X size={14} /> Cancelar
            </button>
          )}
          {onSave && (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => onSave(serializeStructuredBlocksToMarkdown(blocks))}
              style={{ padding: '6px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={14} /> Aplicar cambios
            </button>
          )}
        </div>
      </div>

      {/* Renderizado de Bloques Estructurados */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case 'header': {
              const isH1 = block.level === 1;
              const isH2 = block.level === 2;
              const isH3 = block.level === 3;

              return (
                <div key={block.id || idx} style={{ marginTop: isH1 ? '10px' : isH2 ? '24px' : '18px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={block.text || ''}
                    onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    aria-label={`Encabezado nivel ${block.level}`}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      color: isH3 ? '#315B54' : '#142B25',
                      fontSize: isH1 ? 'clamp(22px, 2.5vw, 26px)' : isH2 ? '20px' : '17.5px',
                      fontWeight: isH1 ? 800 : 700,
                      fontFamily: 'var(--font-heading)',
                      border: 'none',
                      borderBottom: isH1 ? '2.5px solid #315B54' : isH2 ? '1px solid rgba(49, 91, 84, 0.22)' : '1px solid rgba(49, 91, 84, 0.14)',
                      padding: '4px 6px 8px 6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.65)',
                      borderRadius: '6px 6px 0 0',
                      outline: 'none',
                      transition: 'background-color 0.2s ease, border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#FFFFFF';
                      e.target.style.borderBottomColor = '#315B54';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.65)';
                    }}
                  />
                </div>
              );
            }

            case 'divider': {
              return (
                <div key={block.id || idx} style={{ margin: '20px 0' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(49, 91, 84, 0.16)' }} />
                </div>
              );
            }

            case 'table': {
              const headers = block.headers || [];
              const rows = block.rows || [];

              return (
                <div 
                  key={block.id || idx} 
                  className="editor-doc-table-wrapper"
                  style={{
                    margin: '20px 0',
                    borderRadius: '14px',
                    border: '1px solid rgba(49, 91, 84, 0.22)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: '#EDF3F1', borderBottom: '1.5px solid #CBD5E1', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#142B25', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TableIcon size={15} style={{ color: '#315B54' }} /> Secuencia Didáctica / Matriz Curricular
                    </span>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => handleAddTableRow(idx)}
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#FFFFFF', minHeight: '36px' }}
                      title="Agregar un nuevo momento o fila a la secuencia"
                    >
                      <Plus size={13} /> Añadir momento
                    </button>
                  </div>

                  {/* VISTA ESCRITORIO / TABLET: Tabla Clásica con Scroll Horizontal */}
                  <div className="structured-table-desktop-view" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr>
                          {headers.map((h, hIdx) => (
                            <th 
                              key={hIdx} 
                              style={{ 
                                backgroundColor: '#F8FAF9', 
                                color: '#142B25', 
                                fontWeight: 700, 
                                padding: '10px 14px', 
                                borderBottom: '1px solid #CBD5E1', 
                                textAlign: 'left' 
                              }}
                            >
                              {h}
                            </th>
                          ))}
                          <th style={{ width: '48px', backgroundColor: '#F8FAF9', borderBottom: '1px solid #CBD5E1' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            {headers.map((_, cIdx) => (
                              <td key={cIdx} style={{ padding: '8px 10px', verticalAlign: 'top' }}>
                                <AutoResizingTextarea
                                  value={row[cIdx] || ''}
                                  onChange={(e) => handleTableCellChange(idx, rIdx, cIdx, e.target.value)}
                                  placeholder={`Contenido...`}
                                  style={{
                                    fontSize: '13.5px',
                                    lineHeight: '1.55',
                                    fontWeight: cIdx === 0 ? 600 : 400,
                                    color: cIdx === 0 ? '#142B25' : '#1C1917',
                                    padding: '8px 10px'
                                  }}
                                />
                              </td>
                            ))}
                            <td style={{ padding: '8px 4px', textAlign: 'center', verticalAlign: 'middle' }}>
                              {rows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTableRow(idx, rIdx)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#DC2626',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s ease',
                                    minHeight: '36px',
                                    minWidth: '36px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                                  title="Eliminar fila"
                                  aria-label="Eliminar fila"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* VISTA MÓVIL: Tarjetas Colapsables Individuales por Momento Pedagógico */}
                  <div className="structured-table-mobile-view" style={{ padding: '12px' }}>
                    {rows.map((row, rIdx) => (
                      <CollapsibleMomentCard
                        key={rIdx}
                        rIdx={rIdx}
                        row={row}
                        headers={headers}
                        onCellChange={(cIdx, val) => handleTableCellChange(idx, rIdx, cIdx, val)}
                        onRemove={() => handleRemoveTableRow(idx, rIdx)}
                        canRemove={rows.length > 1}
                      />
                    ))}
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => handleAddTableRow(idx)}
                      style={{ 
                        marginTop: '10px', 
                        width: '100%', 
                        padding: '10px', 
                        fontSize: '13px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px', 
                        backgroundColor: '#FFFFFF',
                        minHeight: '44px',
                        borderRadius: '10px'
                      }}
                    >
                      <Plus size={15} /> Añadir momento a la secuencia
                    </button>
                  </div>
                </div>
              );
            }

            case 'list': {
              const items = block.items || [];

              return (
                <div key={block.id || idx} style={{ margin: '14px 0 16px 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, itIdx) => (
                      <div key={itIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span 
                          style={{ 
                            marginTop: '10px', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            color: '#315B54', 
                            minWidth: '20px', 
                            textAlign: 'right' 
                          }}
                        >
                          {block.ordered ? `${itIdx + 1}.` : '•'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <AutoResizingTextarea
                            value={item}
                            onChange={(e) => handleListItemChange(idx, itIdx, e.target.value)}
                            placeholder="Elemento de lista..."
                            style={{
                              fontSize: '15px',
                              lineHeight: '1.65',
                              padding: '8px 12px'
                            }}
                          />
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveListItem(idx, itIdx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9CA3AF',
                              cursor: 'pointer',
                              padding: '8px 4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                            title="Eliminar elemento de la lista"
                            aria-label="Eliminar elemento"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ paddingLeft: '28px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleAddListItem(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#315B54',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      <Plus size={13} /> Añadir elemento
                    </button>
                  </div>
                </div>
              );
            }

            case 'paragraph': {
              return (
                <div key={block.id || idx} style={{ marginBottom: '14px' }}>
                  <AutoResizingTextarea
                    value={block.text || ''}
                    onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    placeholder="Texto"
                    style={{
                      fontSize: '15px',
                      lineHeight: '1.7',
                      color: '#1C1917',
                      padding: '10px 14px'
                    }}
                  />
                </div>
              );
            }

            default:
              return null;
          }
        })}
      </div>

      {/* Botones de acción inferiores */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          marginTop: '32px', 
          paddingTop: '20px', 
          borderTop: '1px solid rgba(49, 91, 84, 0.16)' 
        }}
      >
        {onCancel && (
          <button type="button" className="btn-outline" onClick={onCancel} style={{ padding: '8px 20px' }}>
            <X size={15} /> Cancelar edición
          </button>
        )}
        {onSave && (
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => onSave(serializeStructuredBlocksToMarkdown(blocks))}
            style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={16} /> Guardar cambios del documento
          </button>
        )}
      </div>

    </div>
  );
}
