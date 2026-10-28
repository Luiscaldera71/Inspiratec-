/**
 * Bloques visuales reutilizables de la plantilla PDF de InspiraTEC.
 */
import { THEME } from '../exportTheme.js';

/**
 * Encabezado de capítulo: tarjeta con número grande a la izquierda (estilo libro / guía).
 * `number` null → barra violeta simple. `id` permite referenciar la página en el índice.
 */
export const headingCard = (content, level = 2, { id, number = null } = {}) => ({
  table: {
    widths: [number !== null ? 38 : 5, '*'],
    body: [[
      number !== null
        ? { text: String(number).padStart(2, '0'), fillColor: THEME.indigo, color: '#FFFFFF', bold: true, fontSize: 14, alignment: 'center', margin: [0, 1, 0, 0] }
        : { text: '', fillColor: level <= 1 ? THEME.violet : THEME.indigo },
      { text: content, style: 'headingSectionText', fillColor: THEME.soft, ...(id ? { id } : {}) }
    ]]
  },
  layout: {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: (i) => (i === 1 ? 14 : 0),
    paddingRight: () => 10,
    paddingTop: () => 8,
    paddingBottom: () => 8
  },
  margin: [0, 18, 0, 9],
  headlineLevel: level,
  keepWithNext: true
});
/** Subtítulo con punto de color. */
export const headingDot = (content, level = 3) => ({
  columns: [
    { width: 10, canvas: [{ type: 'ellipse', x: 4, y: 17, r1: 3.2, r2: 3.2, color: THEME.violet }] },
    { width: '*', text: content, style: level === 3 ? 'headingSubsection' : 'headingMinor' }
  ],
  columnGap: 2,
  headlineLevel: level,
  keepWithNext: true
});
