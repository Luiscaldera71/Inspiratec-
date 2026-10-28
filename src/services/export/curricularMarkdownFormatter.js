/**
 * Formateador y normalizador curricular para INSPIRATEC.
 * Asegura que todas las secciones institucionales, etiquetas curriculares,
 * momentos pedagógicos (Inicio, Desarrollo, Cierre) y criterios tengan la
 * negrilla adecuada (**) tanto para la exportación a PDF como a Word y vista web.
 */

import { formatMathForExport } from '../../utils/mathFormatter.js';

/**
 * Lista canónica de etiquetas pedagógicas y apartados institucionales que deben
 * destacarse en negrilla en los documentos generados.
 */
const CANONICAL_LABELS = [
  'Institución', 'Sede', 'Área', 'Asignatura', 'Grado', 'Grupo\\(s\\)', 'Grupo', 'Grupos',
  'Tutor \\(IE\\)', 'Tutor', 'Docente en formación', 'Docente',
  'Fecha de aplicación', 'Fecha', 'Duración \\(sesiones y horas\\)', 'Duración', 'Sesiones',
  'Componente', 'Competencia', 'Competencias', 'Evidencia de aprendizaje', 'Evidencias de aprendizaje',
  'Evidencia', 'Evidencias', 'Contenidos', 'Contenido',
  'Criterios de evaluación', 'Criterio de evaluación', 'Criterios',
  'Observaciones', 'Observación', 'Notas pedagógicas',
  'Objetivo de aprendizaje', 'Objetivos de aprendizaje', 'Objetivo', 'Objetivos',
  'Estándar de competencia', 'Estándar', 'Estándares', 'DBA',
  'Saberes previos', 'Desempeños esperados', 'Desempeños', 'Desempeño', 'Criterios de logro',
  'Conceptos', 'Representaciones', 'Errores frecuentes', 'Conexiones',
  'Momentos de la clase', 'Actividades', 'Mediación \\(Recursos\\)', 'Mediación', 'Recursos',
  'Adaptaciones DUA', 'Ajustes razonables', 'Estrategias DUA', 'Atención a la diversidad',
  'Evaluación formativa', 'Instrumento de evaluación',
  'Unidad temática o situación comunicativa', 'Tema y contexto de uso del inglés', 'Nivel de competencia esperado',
  'Objetivo comunicativo de la clase', 'Competencia o aprendizaje esperado', 'Referente curricular pertinente',
  'DBA de Inglés', 'Nivel de referencia del MCER', 'Función comunicativa',
  'Vocabulario clave \\(vocabulary\\)', 'Vocabulario clave',
  'Estructuras gramaticales \\(grammar structures\\)', 'Estructuras gramaticales',
  'Expresiones y frases funcionales \\(useful expressions\\)', 'Expresiones y frases funcionales',
  'Pronunciación, entonación y aspectos fonológicos pertinentes', 'Contexto y propósito comunicativo',
  'Modelo de lenguaje o ejemplos de referencia',
  'Activación de conocimientos previos', 'Presentación del tema y del objetivo comunicativo',
  'Pregunta, imagen, diálogo o situación motivadora',
  'Introducción contextualizada del vocabulario y las expresiones', 'Modelado de estructuras lingüísticas',
  'Ejemplos de uso en situaciones significativas', 'Comprensión inicial',
  'Ejercicios de comprensión y uso del lenguaje', 'Actividades para reconocer y emplear vocabulario y estructuras',
  'Corrección orientadora y retroalimentación', 'Modalidad de trabajo',
  'Tarea comunicativa o producción', 'Uso del inglés en una situación con propósito definido',
  'Uso del inglés en situación con propósito definido', 'Interacción entre estudiantes',
  'Síntesis de expresiones y aprendizajes', 'Verificación del objetivo comunicativo', 'Autoevaluación breve',
  'Actividad de transferencia o práctica posterior',
  'Listening \\(Comprensión auditiva\\)', 'Listening',
  'Speaking \\(Producción e interacción oral\\)', 'Speaking',
  'Reading \\(Comprensión lectora\\)', 'Reading',
  'Writing \\(Producción escrita\\)', 'Writing',
  'Mediation \\(Mediación lingüística\\)', 'Mediation',
  'Evidencia comunicativa esperada', 'Criterios de comprensión y producción',
  'Uso apropiado del vocabulario y las estructuras', 'Comprensibilidad, pronunciación e interacción',
  'Retroalimentación y oportunidades de mejora',
  'Materiales y medios didácticos', 'Herramientas digitales o desconectadas',
  'Apoyos visuales, modelos lingüísticos y glosarios', 'Actividades diferenciadas según el nivel de competencia',
  'Alternativas para estudiantes con ritmos diversos \\(DUA\\)',
  'Logro del objetivo comunicativo', 'Dificultades lingüísticas observadas',
  'Habilidades que requieren refuerzo', 'Ajustes para la próxima sesión',
  'Razón', 'Contexto', 'Actividad'
];

/**
 * Normaliza una cadena Markdown para asegurar el resaltado en negrilla en todos los apartados
 * correspondientes sin duplicar asteriscos existentes.
 *
 * @param {string} rawMarkdown - Texto original en Markdown.
 * @returns {string} Markdown normalizado con negrillas uniformes.
 */
export const formatCurricularMarkdown = (rawMarkdown, { forExport = false } = {}) => {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') return '';

  let text = formatMathForExport(rawMarkdown);

  // 1. Limpieza de marcadores de IA que no deben salir en el documento
  text = text.replace(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/g, '');

  // Si es para exportar a PDF o Word, convertimos la etiqueta a nota pedagógica legible
  if (forExport) {
    text = text.replace(/\[GENERATE_IMAGE:\s*(?:&quot;|["'])(.*?)(?:&quot;|["'])\]/gi, (match, prompt) => {
      return `*(Recurso visual sugerido: ${prompt.trim()})*`;
    });
  }

  // 2. Normalización de momentos de la clase dentro de tablas Markdown GFM
  // Ejemplo: | Inicio | -> | **Inicio** |
  //          | Desarrollo | -> | **Desarrollo** |
  //          | Cierre | -> | **Cierre** |
  text = text.replace(
    /(\|\s*)(?!\*\*)(Inicio|Desarrollo|Cierre|Apertura|Fase inicial|Fase central|Fase final|Momento inicial|Momento de desarrollo|Momento de cierre)(\s*\|)/gi,
    (match, p1, moment, p3) => {
      const formattedMoment = moment.trim();
      return `${p1}**${formattedMoment}**${p3}`;
    }
  );

  // 3. Normalización de cabeceras de tabla comunes si no tienen negrilla
  // | Momentos de la clase | Actividades | Mediación (Recursos) |
  text = text.replace(
    /(\|\s*)(?!\*\*)(Momentos de la clase|Momento)(\s*\|)/gi,
    '$1**$2**$3'
  );
  text = text.replace(
    /(\|\s*)(?!\*\*)(Actividades|Actividad)(\s*\|)/gi,
    '$1**$2**$3'
  );
  text = text.replace(
    /(\|\s*)(?!\*\*)(Mediación \(Recursos\)|Mediación|Recursos)(\s*\|)/gi,
    '$1**$2**$3'
  );

  // 4. Normalización de etiquetas canónicas (ej: "Institución:", "Sede:", "Componente:", etc.)
  const labelsPattern = CANONICAL_LABELS.join('|');

  // Caso A: Etiqueta al inicio de línea, después de salto de línea, guion de lista o barra separadora
  // Evita re-envolver si ya tiene ** o # o `
  const labelRegex = new RegExp(
    `(^|[\\n\\r]|\\||[-*]\\s*)(?!\\*\\*)(?!#)(${labelsPattern}):(?=[ \\t]|$)`,
    'g'
  );

  text = text.replace(labelRegex, (match, prefix, label) => {
    return `${prefix}**${label}:**`;
  });

  // Caso B: Líneas de lista que comienzan con un término pedagógico en mayúscula seguido de dos puntos
  // Ejemplo: "- Metodología: Aprendizaje basado en retos" -> "- **Metodología:** Aprendizaje..."
  text = text.replace(
    /(^|[\n\r])([-*]\s*)(?!\\*\\*)([A-ZÁÉÍÓÚÑ][a-zA-ZÁÉÍÓÚÑáéíóúñ\s()]{2,35}):\s*/g,
    (match, nl, bullet, label) => {
      // Si la etiqueta ya contiene asteriscos o formato markdown, mantener intacto
      if (label.includes('*') || label.includes('`')) return match;
      return `${nl}${bullet}**${label.trim()}:** `;
    }
  );

  // Caso C: Enumeraciones de fases de actividades
  // Ejemplo: "1. Motivación y saberes previos:" -> "**1. Motivación y saberes previos:**"
  text = text.replace(
    /(^|[\n\r]|[-*]\s*)(\d+\.\s+[A-ZÁÉÍÓÚÑ][a-zA-ZÁÉÍÓÚÑáéíóúñ\s()]{2,40}:)(?!\*\*)/g,
    (match, prefix, phase) => {
      if (phase.includes('*')) return match;
      return `${prefix}**${phase.trim()}** `;
    }
  );

  return text;
};
