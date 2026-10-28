import assert from 'node:assert/strict';
import { 
  buildPresentationHtml, 
  generateGamifiedQuizHTML, 
  generateWordsearchHTML,
  generateInteractiveRubricHTML,
  generateInteractiveFlashcardsHTML
} from '../services/materials/index.js';
import { formatCurricularMarkdown } from '../services/export/curricularMarkdownFormatter.js';

console.log('--- INICIO DE PRUEBAS: GENERACIÓN DE MATERIALES INTERACTIVOS Y COMPARTIBLES EN HTML ---');

// 1. Verificando generador de Diapositivas / OVA Interactivo en HTML
console.log('1. Verificando generador de Presentación / Diapositivas en HTML...');
const slidesHtml = buildPresentationHtml({
  title: 'Algoritmos y Pensamiento Computacional',
  subject: 'Tecnología e Informática',
  grade: '7°',
  slides: [
    { title: 'Introducción', subtitle: 'Concepto clave', content: ['Definición de algoritmo.'], notes: 'Nota docente.' },
    { title: 'Variables', subtitle: 'Estructuras', content: ['Tipos de variables.'], notes: 'Ejemplos en pizarra.' }
  ]
});

assert.ok(slidesHtml.includes('<!DOCTYPE html>'), 'Debe generar un documento HTML válido');
assert.ok(slidesHtml.includes('Algoritmos y Pensamiento Computacional'), 'Debe incluir el título de la clase');
assert.ok(slidesHtml.includes('Definición de algoritmo'), 'Debe incluir el contenido de las diapositivas');
assert.ok(slidesHtml.includes('requestFullscreen') || slidesHtml.includes('inspiratecBtnFullscreen'), 'Debe incluir soporte para pantalla completa');
assert.ok(slidesHtml.includes('keydown'), 'Debe incluir atajos de teclado para navegación');
assert.ok(slidesHtml.includes('inspiratec-share-bar'), 'Debe incluir la barra universal de compartir');
assert.ok(slidesHtml.includes('inspiratecBtnShare'), 'Debe incluir el botón de compartir interactivo');
console.log('✓ Prueba 1 superada: Presentación interactiva HTML portable generada con éxito con barra de compartir.');

// 2. Verificando generador de Trivia / Cuestionario Gamificado en HTML
console.log('2. Verificando generador de Trivia Gamificada en HTML...');
const quizHtml = generateGamifiedQuizHTML({
  title: 'Trivia de Programación',
  subject: 'Informática',
  questions: [
    {
      question: '¿Qué es un bucle?',
      options: ['Una repetición controlada', 'Un error fatal', 'Un cable de red', 'Un monitor'],
      correctIndex: 0,
      feedback: 'Un bucle ejecuta instrucciones mientras se cumpla una condición.'
    }
  ]
});

assert.ok(quizHtml.includes('<!DOCTYPE html>'), 'Debe ser un HTML completo');
assert.ok(quizHtml.includes('Trivia de Programación'), 'Debe contener el título');
assert.ok(quizHtml.includes('Una repetición controlada'), 'Debe contener las opciones');
assert.ok(quizHtml.includes('AudioContext'), 'Debe incluir sintetizador Web Audio para sonidos sin dependencias');
assert.ok(quizHtml.includes('timerInterval'), 'Debe incluir temporizador interactivo');
assert.ok(quizHtml.includes('inspiratec-share-bar'), 'Debe contener barra de compartir integrada');
console.log('✓ Prueba 2 superada: Trivia gamificada HTML con audio sintetizado y barra de compartir validada.');

// 3. Verificando generador de Sopa de Letras Interactiva en HTML
console.log('3. Verificando generador de Sopa de Letras en HTML...');
const wordsearchHtml = generateWordsearchHTML({
  title: 'Sopa de Letras de Algoritmos',
  subject: 'Informática',
  words: ['ALGORITMO', 'VARIABLE', 'FUNCION']
});

assert.ok(wordsearchHtml.includes('<!DOCTYPE html>'), 'Debe generar HTML completo');
assert.ok(wordsearchHtml.includes('Sopa de Letras de Algoritmos'), 'Debe incluir el título');
assert.ok(wordsearchHtml.includes('GRID_SIZE'), 'Debe contener la grilla de palabras');
assert.ok(wordsearchHtml.includes('window.print'), 'Debe permitir impresión');
assert.ok(wordsearchHtml.includes('touchstart'), 'Debe soportar interacción táctil y con ratón');
assert.ok(wordsearchHtml.includes('inspiratec-share-bar'), 'Debe contener barra de compartir');
console.log('✓ Prueba 3 superada: Sopa de letras interactiva HTML validada.');

// 4. Verificando generador de Rúbrica Analítica Interactiva con cálculo en tiempo real
console.log('4. Verificando generador de Rúbrica Analítica Interactiva...');
const rubricHtml = generateInteractiveRubricHTML({
  title: 'Rúbrica de Pensamiento Computacional',
  subject: 'Informática',
  criteria: [
    {
      name: 'Descomposición del problema',
      weight: 50,
      levels: {
        superior: 'Descompone perfectamente el problema.',
        alto: 'Descompone adecuadamente.',
        basico: 'Descompone con ayuda.',
        bajo: 'No descompone el problema.'
      }
    }
  ]
});

assert.ok(rubricHtml.includes('<!DOCTYPE html>'), 'Debe generar HTML completo');
assert.ok(rubricHtml.includes('Rúbrica de Pensamiento Computacional'), 'Debe contener el título');
assert.ok(rubricHtml.includes('finalScoreText'), 'Debe incluir cálculo en tiempo real de puntuación');
assert.ok(rubricHtml.includes('calculateTotal'), 'Debe contener la lógica interactiva de cálculo');
assert.ok(rubricHtml.includes('inspiratec-share-bar'), 'Debe contener barra de compartir');
console.log('✓ Prueba 4 superada: Rúbrica interactiva con cálculo en tiempo real validada.');

// 5. Verificando generador de Flashcards 3D Interactivas
console.log('5. Verificando generador de Flashcards 3D...');
const flashcardsHtml = generateInteractiveFlashcardsHTML({
  title: 'Tarjetas de Algoritmos',
  subject: 'Informática',
  cards: [
    { front: 'Variable', back: 'Espacio de memoria reservado para almacenar un valor.', category: 'Programación' }
  ]
});

assert.ok(flashcardsHtml.includes('<!DOCTYPE html>'), 'Debe generar HTML completo');
assert.ok(flashcardsHtml.includes('is-flipped'), 'Debe contener lógica de volteo 3D');
assert.ok(flashcardsHtml.includes('keydown'), 'Debe permitir navegación por teclado');
assert.ok(flashcardsHtml.includes('inspiratec-share-bar'), 'Debe contener barra de compartir');
console.log('✓ Prueba 5 superada: Flashcards 3D interactivas validadas.');

// 6. Verificando tratamiento de etiqueta [GENERATE_IMAGE: "..."] para web vs exportación
console.log('6. Verificando manejo de [GENERATE_IMAGE: "..."] en web y exportación...');
const samplePlanWithTag = `### Recursos y Mediación
Para explicar el funcionamiento interno, se utilizará [GENERATE_IMAGE: "un diagrama interactivo que muestre el flujo de datos entre la CPU, la RAM y el disco duro"].`;

// En web (forExport: false), la etiqueta debe preservarse intacta para que EmbeddedInteractiveResource la monte:
const webFormatted = formatCurricularMarkdown(samplePlanWithTag, { forExport: false });
assert.ok(
  webFormatted.includes('[GENERATE_IMAGE: "un diagrama interactivo que muestre el flujo de datos entre la CPU, la RAM y el disco duro"]'),
  'En vista web la etiqueta debe permanecer intacta para renderizar el widget interactivo'
);

// En exportación (forExport: true), debe transformarse a nota legible elegante sin sintaxis cruda:
const exportFormatted = formatCurricularMarkdown(samplePlanWithTag, { forExport: true });
assert.ok(!exportFormatted.includes('[GENERATE_IMAGE:'), 'En exportación no deben figurar corchetes crudos');
assert.ok(exportFormatted.includes('Recurso visual sugerido:'), 'En exportación debe figurar como nota pedagógica limpia');

console.log('✓ Prueba 6 superada: Tratamiento dual web/exportación de [GENERATE_IMAGE] verificado.');

console.log('\n========================================================================');
console.log('TODAS LAS PRUEBAS DE MATERIALES DIDÁCTICOS FUNCIONALES Y COMPARTIBLES PASARON');
console.log('========================================================================');
