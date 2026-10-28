/**
 * materialRecommender.js
 * INSPIRATEC - Motor contextual de materiales didácticos generables.
 * 
 * Presenta el catálogo integral de materiales pedagógicos interactivos
 * adaptados dinámicamente según el área curricular, grado, tema y momentos
 * de la secuencia didáctica del plan de clase.
 * 
 * Incluye:
 * 1. Presentación / Diapositivas interactivas
 * 2. Sopa de letras temática interactiva
 * 3. Banco de preguntas formativas con pistas DUA
 * 4. Juego / Trivia gamificada con sonido y retos
 * 5. Rúbrica socioformativa analítica
 * 6. Tarjetas de estudio 3D (Flashcards)
 * 
 * Regla de soberanía docente:
 * Ningún material se genera automáticamente. El docente decide cuáles y cuándo generarlos.
 * Si un material ya fue generado y anexado al plan, no se permite volver a generarlo en el mismo plan.
 */

/**
 * Comprueba si un material sugerido ya fue generado y anexado a este plan.
 * 
 * @param {Object} rec - Recomendación de material con typeKey o id.
 * @param {Array} recursosAnexos - Arreglo de recursos anexados al plan activo.
 * @returns {boolean} True si ya está anexado al plan.
 */
export function isMaterialAnexado(rec, recursosAnexos = []) {
  if (!rec || !Array.isArray(recursosAnexos) || recursosAnexos.length === 0) return false;

  const recKey = (rec.typeKey || '').toLowerCase();
  const recNombre = (rec.nombre || '').toLowerCase();
  const recId = (rec.id || '').toLowerCase();

  return recursosAnexos.some(anexo => {
    if (!anexo) return false;
    const aKey = (anexo.typeKey || '').toLowerCase();
    const aTitle = (anexo.title || anexo.nombre || '').toLowerCase();
    const aTipo = (anexo.tipo || '').toLowerCase();

    // 1. Coincidencia directa por typeKey
    if (aKey && recKey && aKey === recKey) return true;

    // 2. Coincidencia por categoría de material
    if (recKey === 'sopa' && (aTitle.includes('sopa') || aKey.includes('sopa') || aTipo.includes('sopa') || aKey.includes('wordsearch'))) return true;
    if (recKey === 'diapositivas' && (aTitle.includes('diapositiva') || aTitle.includes('presentación') || aTitle.includes('presentacion') || aKey.includes('slides') || aTipo.includes('diapositiva'))) return true;
    if (recKey === 'preguntas' && (aTitle.includes('pregunta') || aTitle.includes('cuestionario') || aKey.includes('preguntas') || aKey.includes('cuestionario'))) return true;
    if (recKey === 'juegos' && (aTitle.includes('trivia') || aTitle.includes('juego') || aKey.includes('juegos') || aKey.includes('game'))) return true;
    if (recKey === 'rubrica' && (aTitle.includes('rúbrica') || aTitle.includes('rubrica') || aKey.includes('rubrica'))) return true;
    if (recKey === 'flashcards' && (aTitle.includes('flashcard') || aTitle.includes('tarjeta') || aKey.includes('flashcards'))) return true;
    if (recKey === 'taller_contexto' && (aTitle.includes('taller') || aTitle.includes('guía de práctica') || aKey.includes('taller'))) return true;
    if (recKey === 'estudio_caso' && (aTitle.includes('estudio de caso') || aTitle.includes('caso') || aKey.includes('caso'))) return true;

    // 3. Coincidencia por ID o título
    if (anexo.id && anexo.id === recId) return true;
    if (aTitle === recNombre) return true;

    return false;
  });
}

/**
 * Obtiene el recurso anexado correspondiente a una recomendación si ya existe.
 * 
 * @param {Object} rec - Recomendación de material.
 * @param {Array} recursosAnexos - Arreglo de recursos anexados al plan activo.
 * @returns {Object|null} El recurso anexado o null si no existe.
 */
export function getAnexadoMatch(rec, recursosAnexos = []) {
  if (!rec || !Array.isArray(recursosAnexos) || recursosAnexos.length === 0) return null;

  const recKey = (rec.typeKey || '').toLowerCase();
  const recNombre = (rec.nombre || '').toLowerCase();

  return recursosAnexos.find(anexo => {
    if (!anexo) return false;
    const aKey = (anexo.typeKey || '').toLowerCase();
    const aTitle = (anexo.title || anexo.nombre || '').toLowerCase();
    const aTipo = (anexo.tipo || '').toLowerCase();

    if (aKey && recKey && aKey === recKey) return true;
    if (recKey === 'sopa' && (aTitle.includes('sopa') || aKey.includes('wordsearch') || aTipo.includes('sopa'))) return true;
    if (recKey === 'diapositivas' && (aTitle.includes('diapositiva') || aTitle.includes('presentación') || aTitle.includes('presentacion') || aKey.includes('slides'))) return true;
    if (recKey === 'preguntas' && (aTitle.includes('pregunta') || aTitle.includes('cuestionario'))) return true;
    if (recKey === 'juegos' && (aTitle.includes('trivia') || aTitle.includes('juego') || aKey.includes('game'))) return true;
    if (recKey === 'rubrica' && (aTitle.includes('rúbrica') || aTitle.includes('rubrica'))) return true;
    if (recKey === 'flashcards' && (aTitle.includes('flashcard') || aTitle.includes('tarjeta'))) return true;
    if (recKey === 'taller_contexto' && (aTitle.includes('taller') || aTitle.includes('guía de práctica') || aKey.includes('taller'))) return true;
    if (recKey === 'estudio_caso' && (aTitle.includes('estudio de caso') || aTitle.includes('caso') || aKey.includes('caso'))) return true;
    if (aTitle === recNombre) return true;

    return false;
  }) || null;
}

/**
 * Genera el catálogo completo de materiales didácticos adaptados específicamente al plan de clase.
 * 
 * @param {Object} metadata - Metadatos curriculares del plan (materia, grado, tema, duracion).
 * @param {string} planMarkdown - Contenido del plan de clase.
 * @returns {Array<Object>} Catálogo integral de materiales contextualizados.
 */
export const recomendarMaterialesDidacticos = (metadata = {}, planMarkdown = '') => {
  const materia = (metadata?.materia || metadata?.area || 'Matemáticas').trim();
  const tema = (metadata?.tema || 'Contenido de la clase').trim();
  const grado = (metadata?.grado || '10°').trim();

  const isMath = materia.toLowerCase().includes('matemát') || materia.toLowerCase().includes('algebra') || materia.toLowerCase().includes('geometr');
  const isTech = materia.toLowerCase().includes('tecnolog') || materia.toLowerCase().includes('informát');
  const isScience = materia.toLowerCase().includes('natural') || materia.toLowerCase().includes('ciencias');
  const isSocial = materia.toLowerCase().includes('social') || materia.toLowerCase().includes('historia');
  const isLanguage = materia.toLowerCase().includes('lengua') || materia.toLowerCase().includes('castell') || materia.toLowerCase().includes('español');
  const isEnglish = materia.toLowerCase().includes('inglés') || materia.toLowerCase().includes('ingles');

  // 1. PRESENTACIÓN / DIAPOSITIVAS INTERACTIVAS
  const presentacion = {
    id: 'rec_presentacion',
    typeKey: 'diapositivas',
    tipo: 'Presentación pedagógica',
    nombre: `Presentación en diapositivas: ${tema}`,
    proposito: isMath
      ? 'Modelar visualmente las fórmulas, teoremas y procedimientos paso a paso con ejemplos de aplicación guiada.'
      : isTech
      ? 'Explicar los conceptos tecnológicos, diagramas lógicos y especificaciones del reto de programación.'
      : 'Estructurar la explicación visual de los conceptos centrales, preguntas orientadoras y síntesis formativa de la clase.',
    relacionPlan: 'Apoya al docente durante los momentos de inicio (motivación) y desarrollo (modelación conceptual).',
    contextoEspecifico: `Generar entre 4 y 6 diapositivas interactivas estructuradas para ${tema} en ${materia} (Grado ${grado}).`
  };

  // 2. SOPA DE LETRAS INTERACTIVA
  const sopaLetras = {
    id: 'rec_sopa_letras',
    typeKey: 'sopa',
    tipo: 'Sopa de letras temática',
    nombre: `Sopa de letras interactiva: ${tema}`,
    proposito: 'Afianzar el vocabulario técnico, terminología clave y conceptos esenciales mediante un reto lúdico de búsqueda activa y discriminación visual.',
    relacionPlan: 'Ideal como actividad de activación previa en el inicio o como pausa activa y consolidación en el momento de desarrollo.',
    contextoEspecifico: `Sopa de letras interactiva en HTML5 con entre 8 y 10 términos fundamentales de ${tema} (${materia}, Grado ${grado}).`
  };

  // 3. PREGUNTAS / CUESTIONARIO FORMATIVO CON PISTAS DUA
  const preguntas = {
    id: 'rec_preguntas',
    typeKey: 'preguntas',
    tipo: 'Banco de preguntas formativas',
    nombre: `Cuestionario de comprobación formativa: ${tema}`,
    proposito: 'Valorar la comprensión conceptual y el razonamiento crítico sin estrés de tiempo, ofreciendo pistas pedagógicas DUA y retroalimentación paso a paso.',
    relacionPlan: 'Permite verificar las evidencias de aprendizaje esperadas y recolectar datos de evaluación diagnóstica o de cierre.',
    contextoEspecifico: `Banco de 4 a 5 preguntas de selección múltiple con pistas pedagógicas y explicación detallada sobre ${tema}.`
  };

  // 4. JUEGOS / TRIVIA GAMIFICADA
  const juegos = {
    id: 'rec_juegos',
    typeKey: 'juegos',
    tipo: 'Juego / Trivia gamificada',
    nombre: `Trivia gamificada con sonido y retos: ${tema}`,
    proposito: 'Dinamizar la participación activa mediante mecánicas lúdicas por rondas con temporizador, efectos sonoros sintetizados (Web Audio API) y marcador de puntuación.',
    relacionPlan: 'Transforma la evaluación de cierre o la consolidación en una experiencia colaborativa, dinámica y motivadora.',
    contextoEspecifico: `Trivia gamificada interactiva con temporizador, efectos de audio y sistema de puntuación para ${tema} (${materia}).`
  };

  // 5. RÚBRICA SOCIOFORMATIVA ANALÍTICA
  const rubrica = {
    id: 'rec_rubrica',
    typeKey: 'rubrica',
    tipo: 'Rúbrica analítica formativa',
    nombre: `Rúbrica socioformativa de valoración: ${tema}`,
    proposito: 'Proveer a los estudiantes y al docente descriptores de desempeño claros (Superior, Alto, Básico, Bajo) con ponderación porcentual y calculadora interactiva en tiempo real.',
    relacionPlan: 'Estructura la evaluación de los aprendizajes esperados y facilita la autoevaluación y coevaluación en el cierre.',
    contextoEspecifico: `Rúbrica analítica interactiva con 3 a 4 criterios adaptados a ${grado} para valorar los productos de ${tema}.`
  };

  // 6. FLASHCARDS / TARJETAS DIDÁCTICAS 3D
  const flashcards = {
    id: 'rec_flashcards',
    typeKey: 'flashcards',
    tipo: 'Flashcards interactivas 3D',
    nombre: `Tarjetas didácticas 3D de estudio: ${tema}`,
    proposito: 'Fomentar la recuperación activa y la consolidación de conceptos mediante tarjetas tridimensionales interactivas que alternan concepto y definición.',
    relacionPlan: 'Sirve como recurso de refuerzo para trabajo autónomo y apoyo inclusivo DUA para estudiantes que requieren andamiajes visuales.',
    contextoEspecifico: `Set de 6 a 8 flashcards 3D interactivas con conceptos y definiciones clave de ${tema}.`
  };

  // 7. GUÍA DE PRÁCTICA / TALLER DE CONTEXTO REAL
  const tallerContexto = {
    id: 'rec_taller_contexto',
    typeKey: 'taller_contexto',
    tipo: 'Taller de aplicación práctica',
    nombre: isTech 
      ? `Guía de práctica y taller digital: ${tema}` 
      : isMath 
      ? `Taller de modelación y contexto real: ${tema}` 
      : isScience
      ? `Guía de indagación y laboratorio: ${tema}`
      : `Taller de contexto real aplicado: ${tema}`,
    proposito: 'Ejercitar la aplicación práctica de conceptos en situaciones reales con ejercicios guiados y problemas contextualizados.',
    relacionPlan: 'Desarrolla el momento central de trabajo individual o colaborativo de los estudiantes.',
    contextoEspecifico: `Taller práctico con 4 o 5 retos aplicados sobre ${tema} (${materia}, Grado ${grado}).`
  };

  // 8. ESTUDIO DE CASO / ANÁLISIS SITUACIONAL
  const estudioCaso = {
    id: 'rec_estudio_caso',
    typeKey: 'estudio_caso',
    tipo: 'Estudio de caso y dilema',
    nombre: isTech 
      ? `Estudio de caso tecnológico y dilema: ${tema}` 
      : isSocial 
      ? `Estudio de caso sociocultural: ${tema}` 
      : `Estudio de caso y análisis de entorno: ${tema}`,
    proposito: 'Promover el pensamiento crítico y la toma de decisiones éticas frente a un problema o desafío contextualizado del entorno.',
    relacionPlan: 'Fomenta la discusión socrática, el debate grupal y la resolución de problemas auténticos.',
    contextoEspecifico: `Estudio de caso con antecedentes, pregunta problémica central y 3 preguntas de análisis sobre ${tema}.`
  };

  // Retorna todos los 8 materiales didácticos de la suite en su totalidad
  return [
    sopaLetras,
    presentacion,
    juegos,
    preguntas,
    rubrica,
    flashcards,
    tallerContexto,
    estudioCaso
  ];
};
