/**
 * Gestor de descarga de archivos en el navegador para INSPIRATEC.
 * Normaliza nombres de archivo seguros sin caracteres especiales ni tildes,
 * crea enlaces temporales para blobs y libera los recursos de memoria.
 */

/**
 * Normaliza una cadena para su uso seguro como nombre de archivo en cualquier sistema operativo.
 * Convierte tildes y eñes a sus equivalentes sin alterar el significado.
 */
export const sanitizeFilenamePart = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remueve marcas diacríticas/tildes
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Sustituye caracteres especiales y espacios
    .replace(/_+/g, '_')            // Colapsa guiones bajos repetidos
    .replace(/^_+|_+$/g, '');        // Recorta guiones bajos iniciales o finales
};

/**
 * Construye el nombre canónico del archivo PDF:
 * INSPIRATEC_Secuencia_<tema>_<grado>_<fecha>.pdf
 */
export const buildPdfFilename = ({ tema, grado, fecha }) => {
  const cleanTema = sanitizeFilenamePart(tema) || 'Clase';
  const cleanGrado = sanitizeFilenamePart(grado) || 'General';
  
  // Fecha en formato YYYY-MM-DD
  let datePart = '';
  if (fecha) {
    const sanitizedDate = sanitizeFilenamePart(fecha);
    datePart = sanitizedDate ? `_${sanitizedDate}` : '';
  } else {
    const today = new Date().toISOString().split('T')[0];
    datePart = `_${today}`;
  }

  // Limitar longitud del nombre para compatibilidad con sistemas de archivos
  const truncatedTema = cleanTema.substring(0, 35);
  const truncatedGrado = cleanGrado.substring(0, 15);

  return `INSPIRATEC_Secuencia_${truncatedTema}_${truncatedGrado}${datePart}.pdf`;
};

/**
 * Construye el nombre canónico del archivo Word:
 * INSPIRATEC_Secuencia_<tema>_<grado>_<fecha>.doc
 */
export const buildWordFilename = ({ tema, grado, fecha }) => {
  const cleanTema = sanitizeFilenamePart(tema) || 'Clase';
  const cleanGrado = sanitizeFilenamePart(grado) || 'General';
  
  let datePart = '';
  if (fecha) {
    const sanitizedDate = sanitizeFilenamePart(fecha);
    datePart = sanitizedDate ? `_${sanitizedDate}` : '';
  } else {
    const today = new Date().toISOString().split('T')[0];
    datePart = `_${today}`;
  }

  const truncatedTema = cleanTema.substring(0, 35);
  const truncatedGrado = cleanGrado.substring(0, 15);

  return `INSPIRATEC_Secuencia_${truncatedTema}_${truncatedGrado}${datePart}.doc`;
};

/**
 * Ejecuta la descarga directa en el navegador de un Blob o archivo generado
 * y garantiza la liberación de memoria en URL.revokeObjectURL.
 *
 * @param {Blob} blob - El objeto Blob del archivo a descargar.
 * @param {string} filename - Nombre descriptivo del archivo.
 */
export const downloadBlob = (blob, filename) => {
  if (!blob || !(blob instanceof Blob)) {
    throw new Error('El objeto proporcionado para descarga no es un Blob válido.');
  }

  if (typeof window === 'undefined') {
    throw new Error('La descarga de archivos solo está disponible en el entorno del navegador.');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'INSPIRATEC_Documento.pdf';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Limpieza inmediata del DOM y liberación diferida de la URL para dar tiempo al navegador
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1200);
};
