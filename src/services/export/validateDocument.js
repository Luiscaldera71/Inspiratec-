/**
 * Validador de documentos curriculares para exportación PDF en INSPIRATEC.
 * Verifica que existan datos suficientes y consistentes antes de iniciar el motor.
 */

export const validatePlanForExport = (planData, markdownContent) => {
  const warnings = [];

  if (!planData && !markdownContent) {
    return {
      isValid: false,
      error: 'No se encontraron datos ni contenido de la secuencia didáctica para exportar.',
      warnings
    };
  }

  const rawMarkdown = typeof markdownContent === 'string' 
    ? markdownContent 
    : (planData?.markdown || '');

  const cleanMarkdown = rawMarkdown
    .replace(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/g, '')
    .trim();

  if (!cleanMarkdown || cleanMarkdown.length < 15) {
    return {
      isValid: false,
      error: 'El contenido del plan está vacío o no contiene suficiente texto curricular estructurado.',
      warnings
    };
  }

  const tema = (planData?.tema || planData?.wizardData?.tema || '').trim();
  if (!tema) {
    warnings.push('El plan no tiene un tema o título explícito; se inferirá del contenido.');
  }

  const grado = (planData?.grado || planData?.wizardData?.grado || '').trim();
  if (!grado) {
    warnings.push('No se especificó el grado académico en los metadatos.');
  }

  const materia = (planData?.materia || planData?.wizardData?.materia || '').trim();
  if (!materia) {
    warnings.push('No se especificó la materia o área curricular.');
  }

  return {
    isValid: true,
    error: null,
    warnings
  };
};
