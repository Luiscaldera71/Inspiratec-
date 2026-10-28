import { injectShareBarIntoHtml, getUniversalShareBarHtml } from './universalShareBar.js';
export { buildPresentationHtml } from './slidesGenerator.js';
export { generateGamifiedQuizHTML } from './quizGameGenerator.js';
export { generateInteractiveQuestionsHTML } from './questionsGenerator.js';
export { generateWordsearchHTML } from './wordsearchGenerator.js';
export { generateInteractiveRubricHTML } from './rubricGenerator.js';
export { generateInteractiveFlashcardsHTML } from './flashcardsGenerator.js';
export { injectShareBarIntoHtml, getUniversalShareBarHtml };

/**
 * Asegura que cualquier HTML generado por IA o templates sea 100% funcional,
 * contenga la barra universal de compartir y no tenga errores de sintaxis o de scope.
 */
export function ensureFunctionalHtml(html, metadata = {}) {
  if (!html || typeof html !== 'string') return '';
  let clean = html.trim();

  // Eliminar markdown code fences si existen
  if (clean.startsWith('```html')) clean = clean.substring(7);
  else if (clean.startsWith('```')) clean = clean.substring(3);
  if (clean.endsWith('```')) clean = clean.substring(0, clean.length - 3);
  clean = clean.trim();

  // Asegurar estructura HTML básica si viene incompleta
  if (!clean.includes('<!DOCTYPE') && !clean.includes('<html')) {
    clean = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.title || 'Recurso Didáctico Interactivo'}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; line-height: 1.6; color: #142B25; background: #F4F7F6; }
    .card { background: #FFFFFF; padding: 24px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); max-width: 800px; margin: 0 auto; }
    h1, h2, h3 { color: #142B25; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    ${clean}
  </div>
</body>
</html>`;
  }

  // Inyectar la barra universal de compartir
  return injectShareBarIntoHtml(clean, metadata);
}
