/**
 * resourceCatalog.js
 * Catálogo de recursos HTML que la plataforma puede generar a partir del tema de una clase.
 * Es la única fuente de verdad: la interfaz lo lista y el generador lo usa para saber qué construir.
 *
 * Cada recurso se genera con IA a la medida del plan (ver creativeHtml.js). El tipo
 * "aula_interactiva" además parte de una plantilla base de pizarra (ver aulaInteractiva.js).
 */

export const RESOURCE_CATEGORIES = [
  { id: 'presentar', label: 'Presentar la clase' },
  { id: 'jugar', label: 'Jugar y practicar' },
  { id: 'explorar', label: 'Explorar y experimentar' },
  { id: 'colaborar', label: 'Trabajo en equipo' },
  { id: 'evaluar', label: 'Evaluar' },
  { id: 'estudiar', label: 'Estudiar y guiar' },
  { id: 'envivo', label: 'En vivo con QR' }
];

export const RESOURCE_CATALOG = [
  // ---- En vivo con QR (no son archivos HTML: crean una sesión a la que entran los estudiantes desde el celular)
  {
    typeKey: 'evaluacion_qr', categoria: 'envivo', icono: 'qr', accion: 'evaluacion',
    nombre: 'Evaluación con QR',
    descripcion: 'Preguntas con IA o escritas por ti. Los estudiantes entran desde el celular y recibes alertas si salen de la pestaña.'
  },
  {
    typeKey: 'clase_qr', categoria: 'envivo', icono: 'radio', accion: 'clase',
    nombre: 'Clase en vivo con QR',
    descripcion: 'Los estudiantes siguen la clase en su celular y ven el recurso que tú proyectas.'
  },

  // ---- Presentar la clase
  {
    typeKey: 'aula_interactiva', categoria: 'presentar', icono: 'presentation',
    nombre: 'Aula interactiva (pizarra)',
    descripcion: 'Pizarra digital lista para proyectar con lápiz, formas, temporizador, selector de estudiantes, equipos y los momentos de tu clase.',
    brief: 'Un aula interactiva: pizarra digital con el contenido de la clase organizado por momentos.',
    plantilla: true
  },
  {
    typeKey: 'diapositivas', categoria: 'presentar', icono: 'slides',
    nombre: 'Presentación interactiva',
    descripcion: 'Escenas a pantalla completa con preguntas al grupo y navegación por teclado.',
    brief: 'Una presentación interactiva para proyectar la clase (6 a 10 escenas) que acompañe los momentos del plan, con preguntas al grupo y navegación por teclado.'
  },
  {
    typeKey: 'linea_tiempo', categoria: 'presentar', icono: 'timeline',
    nombre: 'Línea de tiempo interactiva',
    descripcion: 'Hechos, etapas o pasos del tema ordenados en una línea que se recorre y se explora.',
    brief: 'Una línea de tiempo o de procesos interactiva con hitos que se expanden, imágenes en SVG/CSS y una actividad de ordenar al final.'
  },
  {
    typeKey: 'infografia', categoria: 'presentar', icono: 'chart',
    nombre: 'Infografía interactiva',
    descripcion: 'Explicación por capas con esquemas y zonas que se tocan para descubrir.',
    brief: 'Una infografía interactiva que explique el tema por capas, con esquemas hechos en SVG/CSS y zonas que se exploran.'
  },
  {
    typeKey: 'historia_interactiva', categoria: 'presentar', icono: 'book',
    nombre: 'Historia interactiva',
    descripcion: 'Un relato con decisiones donde el estudiante aprende el tema eligiendo caminos.',
    brief: 'Una historia interactiva con ramificaciones: el estudiante toma decisiones que dependen de los conceptos del tema y recibe consecuencias explicadas.'
  },

  // ---- Jugar y practicar
  {
    typeKey: 'juegos', categoria: 'jugar', icono: 'game',
    nombre: 'Juego de preguntas',
    descripcion: 'Competencia individual o por equipos con rondas, puntaje y comodines.',
    brief: 'Un juego educativo para jugar en clase, individual o por equipos, que practique los conceptos del plan con reglas claras, puntaje y cierre.'
  },
  {
    typeKey: 'sopa', categoria: 'jugar', icono: 'puzzle',
    nombre: 'Sopa de letras',
    descripcion: 'Términos del tema con pistas por definición y verificación.',
    brief: 'Una sopa de letras temática cuyos términos salgan del plan, con pistas por definición, temporizador opcional y verificación.'
  },
  {
    typeKey: 'crucigrama', categoria: 'jugar', icono: 'puzzle',
    nombre: 'Crucigrama',
    descripcion: 'Definiciones y conceptos que se cruzan; se resuelve en pantalla.',
    brief: 'Un crucigrama interactivo con pistas redactadas a partir del plan, validación por palabra y modo de ayuda.'
  },
  {
    typeKey: 'memoria', categoria: 'jugar', icono: 'cards',
    nombre: 'Memoria y emparejar',
    descripcion: 'Parejas de concepto y definición o problema y resultado.',
    brief: 'Un juego de memoria y emparejamiento donde se unen conceptos con definiciones, ejemplos o resultados, con modo individual y de parejas.'
  },
  {
    typeKey: 'ordenar_pasos', categoria: 'jugar', icono: 'steps',
    nombre: 'Ordenar la secuencia',
    descripcion: 'Arrastrar pasos o eventos hasta dejarlos en el orden correcto.',
    brief: 'Una actividad de arrastrar y ordenar los pasos de un proceso o procedimiento del tema, con validación y explicación de cada error.'
  },
  {
    typeKey: 'ruleta', categoria: 'jugar', icono: 'dice',
    nombre: 'Ruleta de retos',
    descripcion: 'Ruleta y dados con preguntas, retos y penitencias académicas del tema.',
    brief: 'Una ruleta o dado de retos con preguntas, mini desafíos y comodines del tema, con registro de puntos por equipo.'
  },
  {
    typeKey: 'tablero', categoria: 'jugar', icono: 'board',
    nombre: 'Juego de tablero',
    descripcion: 'Tablero con casillas, turnos y retos del tema para varios equipos.',
    brief: 'Un juego de tablero para varios equipos con casillas de retos del tema, turnos, dados y metas.'
  },
  {
    typeKey: 'flashcards', categoria: 'jugar', icono: 'cards',
    nombre: 'Tarjetas de estudio',
    descripcion: 'Conceptos y definiciones con repaso de las que cuestan más.',
    brief: 'Un conjunto de tarjetas de estudio del vocabulario y conceptos clave del plan, con modos de repaso y seguimiento de las que el estudiante domina.'
  },

  // ---- Explorar y experimentar
  {
    typeKey: 'simulacion', categoria: 'explorar', icono: 'flask',
    nombre: 'Simulador',
    descripcion: 'Modelo manipulable con parámetros, gráfica en vivo y preguntas de predicción.',
    brief: 'Una simulación manipulable con parámetros ajustables, visualización en vivo y preguntas de predicción y análisis.'
  },
  {
    typeKey: 'laboratorio', categoria: 'explorar', icono: 'flask',
    nombre: 'Laboratorio virtual',
    descripcion: 'Experimento guiado: hipótesis, variables, registro de datos y conclusiones.',
    brief: 'Un laboratorio virtual con un experimento guiado: formular hipótesis, controlar variables, registrar datos en tabla y gráfica y sacar conclusiones.'
  },
  {
    typeKey: 'mapa_conceptual', categoria: 'explorar', icono: 'map',
    nombre: 'Mapa conceptual interactivo',
    descripcion: 'Conceptos conectados que se despliegan y se reorganizan.',
    brief: 'Un mapa conceptual interactivo con nodos y relaciones del tema que se despliegan, y una actividad para completar conexiones.'
  },
  {
    typeKey: 'escape_room', categoria: 'explorar', icono: 'key',
    nombre: 'Escape room educativo',
    descripcion: 'Una sala con acertijos del tema que se resuelven para abrir la salida.',
    brief: 'Un escape room educativo con una ambientación, 4 a 6 acertijos encadenados basados en el tema, pistas con costo y cuenta regresiva.'
  },

  // ---- Trabajo en equipo
  {
    typeKey: 'estudio_caso', categoria: 'colaborar', icono: 'users',
    nombre: 'Estudio de caso',
    descripcion: 'Situación real con decisiones, roles de equipo y puesta en común.',
    brief: 'Un estudio de caso con una situación real, decisiones, roles de equipo y una puesta en común final.'
  },
  {
    typeKey: 'reto_equipos', categoria: 'colaborar', icono: 'users',
    nombre: 'Reto cooperativo por roles',
    descripcion: 'Misión grupal con roles rotativos, tarjetas de tarea y tablero de avance.',
    brief: 'Un reto cooperativo por roles (por ejemplo coordinador, investigador, constructor, vocero) con tarjetas de tarea, tablero de avance del equipo y coevaluación final.'
  },
  {
    typeKey: 'debate', categoria: 'colaborar', icono: 'chat',
    nombre: 'Debate guiado',
    descripcion: 'Posturas, argumentos de apoyo y turnos cronometrados.',
    brief: 'Un tablero de debate guiado con una pregunta polémica del tema, posturas, banco de argumentos y evidencias, turnos cronometrados y un cierre con balance.'
  },

  // ---- Evaluar
  {
    typeKey: 'preguntas', categoria: 'evaluar', icono: 'help',
    nombre: 'Cuestionario formativo',
    descripcion: 'Preguntas con pistas, retroalimentación que explica y resumen de desempeño.',
    brief: 'Un banco de preguntas formativas con pistas, retroalimentación que explica el porqué y resumen final de desempeño.'
  },
  {
    typeKey: 'rubrica', categoria: 'evaluar', icono: 'list',
    nombre: 'Rúbrica interactiva',
    descripcion: 'Criterios y niveles para autoevaluación, coevaluación y evaluación docente.',
    brief: 'Una rúbrica analítica interactiva (3 a 5 criterios con niveles de desempeño según el plan) para autoevaluación, coevaluación y evaluación docente, con cálculo de la valoración y resumen imprimible.'
  },
  {
    typeKey: 'ticket_salida', categoria: 'evaluar', icono: 'check',
    nombre: 'Ticket de salida y metacognición',
    descripcion: 'Cierre rápido: qué aprendí, qué dudas tengo y cómo me sentí.',
    brief: 'Un ticket de salida y bitácora metacognitiva con preguntas de comprobación, semáforo de comprensión y reflexión sobre el proceso, con resumen imprimible.'
  },

  // ---- Estudiar y guiar
  {
    typeKey: 'taller_contexto', categoria: 'estudiar', icono: 'file',
    nombre: 'Taller de aplicación',
    descripcion: 'Problemas de situaciones reales con pasos guiados y verificación inmediata.',
    brief: 'Un taller de problemas aplicados a situaciones reales cercanas al grupo, con datos manipulables, pasos guiados y verificación inmediata.'
  },
  {
    typeKey: 'guia_estudiante', categoria: 'estudiar', icono: 'file',
    nombre: 'Guía de trabajo del estudiante',
    descripcion: 'Ficha interactiva e imprimible para seguir la clase paso a paso.',
    brief: 'Una guía de trabajo del estudiante, interactiva e imprimible, que siga los momentos de la clase con espacios para responder, ejemplos resueltos y autoverificación.'
  },
  {
    typeKey: 'glosario', categoria: 'estudiar', icono: 'book',
    nombre: 'Glosario ilustrado',
    descripcion: 'Términos del tema con definición, ejemplo y buscador.',
    brief: 'Un glosario ilustrado con buscador de los términos del tema, cada uno con definición, ejemplo y un mini dibujo en SVG o emoji.'
  }
];

export const getResourceDef = (typeKey = '') =>
  RESOURCE_CATALOG.find(r => r.typeKey === String(typeKey).toLowerCase()) || null;

/** Equivalencias de claves antiguas para recursos ya anexados o llamadas previas. */
const LEGACY_KEYS = {
  presentacion: 'diapositivas', slides: 'diapositivas', ova: 'diapositivas',
  cuestionario: 'preguntas', juego: 'juegos', game: 'juegos', trivia: 'juegos', quiz: 'juegos',
  sopa_letras: 'sopa', wordsearch: 'sopa', rubricas: 'rubrica'
};

export const resolveResourceKey = (typeKey = '') => {
  const k = String(typeKey).toLowerCase();
  return LEGACY_KEYS[k] || k;
};
