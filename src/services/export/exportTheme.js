/**
 * Identidad visual de los documentos de InspiraTEC (PDF y Word).
 * Paleta azul/índigo/violeta alineada con la interfaz de la plataforma.
 */
export const THEME = {
  navy: '#142057',        // Títulos y bandas oscuras
  indigo: '#3556E0',      // Color principal
  blue: '#4F7DF5',        // Acentos
  violet: '#7C5CFF',      // Acento secundario
  cyan: '#38BDF8',
  soft: '#EEF2FF',        // Fondos suaves de tarjetas
  softer: '#F6F8FF',      // Filas alternas
  moment: '#E7ECFF',      // Filas de momento (Inicio / Desarrollo / Cierre)
  border: '#D6DEFF',
  text: '#1B2145',
  muted: '#5B6595',
  white: '#FFFFFF',
  // Degradado de la franja decorativa (azul → violeta)
  stripe: ['#3B82F6', '#4A6FF3', '#5A64F0', '#6A5CF5', '#7C5CFF']
};

/**
 * Íconos lineales (estilo Lucide) como SVG para pdfmake.
 * @param {string} name - Nombre del ícono.
 * @param {string} color - Color del trazo.
 */
const ICON_PATHS = {
  user: '<circle cx="12" cy="7" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
  school: '<path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/><path d="M12 9v2"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<circle cx="9" cy="7" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="3"/><path d="M17 15a5 5 0 0 1 5 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-5"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 17v4M17 19h4"/>',
  grade: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'
};

export const svgIcon = (name, color = THEME.indigo, size = 16) => ({
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ICON_PATHS.spark}</svg>`,
  width: size,
  height: size
});
