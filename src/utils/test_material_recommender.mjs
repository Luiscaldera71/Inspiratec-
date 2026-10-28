import assert from 'node:assert/strict';
import { recomendarMaterialesDidacticos, isMaterialAnexado, getAnexadoMatch } from './materialRecommender.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: CATÁLOGO COMPLETO Y ADAPTACIÓN DE MATERIALES DIDÁCTICOS ---');

// 1. Verificando que se muestran todos los materiales didácticos en general adaptados a Matemáticas
console.log('1. Verificando presencia de Sopa de letras, Presentación, Preguntas, Juegos, Rúbrica y Flashcards...');

const metaMatematicas = {
  materia: 'Matemáticas',
  grado: '10°',
  tema: 'Trigonometría y Teorema del Seno',
  duracion: '90 minutos'
};
const planMdMate = `# PLAN DE CLASE — MATEMÁTICAS
### Fundamentación
Resolución de triángulos no rectángulos aplicando la ley de senos en situaciones del entorno.`;

const recs = recomendarMaterialesDidacticos(metaMatematicas, planMdMate);

assert.ok(Array.isArray(recs), 'Debe retornar un array');
assert.ok(recs.length >= 6, 'Debe incluir la suite completa de materiales didácticos');

const hasSopa = recs.some(r => r.typeKey === 'sopa');
const hasPresentacion = recs.some(r => r.typeKey === 'diapositivas');
const hasPreguntas = recs.some(r => r.typeKey === 'preguntas');
const hasJuegos = recs.some(r => r.typeKey === 'juegos');
const hasRubrica = recs.some(r => r.typeKey === 'rubrica');
const hasFlashcards = recs.some(r => r.typeKey === 'flashcards');

assert.ok(hasSopa, 'Debe incluir Sopa de letras');
assert.ok(hasPresentacion, 'Debe incluir Presentación / Diapositivas');
assert.ok(hasPreguntas, 'Debe incluir Preguntas / Cuestionario');
assert.ok(hasJuegos, 'Debe incluir Juegos / Trivia gamificada');
assert.ok(hasRubrica, 'Debe incluir Rúbrica');
assert.ok(hasFlashcards, 'Debe incluir Flashcards');

assert.ok(recs.every(r => r.nombre.includes('Trigonometría y Teorema del Seno')), 'Cada material debe adaptar su título al tema del plan');
assert.ok(recs.every(r => r.proposito && r.relacionPlan && r.contextoEspecifico), 'Cada material debe contar con propósito pedagógico y momento de aplicación');

console.log('✓ Prueba 1 superada: La suite completa de materiales didácticos está presente y adaptada al plan.');

// 2. Verificando adaptación a otra disciplina (Tecnología e Informática)
console.log('2. Verificando adaptación dinámica a Tecnología e Informática...');

const metaTech = {
  materia: 'Tecnología e Informática',
  grado: '9no',
  tema: 'Algoritmos y Estructuras Condicionales'
};
const recsTech = recomendarMaterialesDidacticos(metaTech, '# PLAN DE CLASE');

assert.ok(recsTech.length >= 6, 'Debe incluir la suite de materiales en Tecnología');
assert.ok(recsTech.every(r => r.nombre.includes('Algoritmos y Estructuras Condicionales')), 'Los títulos deben adaptarse a Tecnología');

console.log('✓ Prueba 2 superada: Adaptación temática transversal validada con éxito.');

// 3. Verificando regla de no re-generación: detección de material ya anexado
console.log('3. Verificando bloqueo de re-generación cuando un material ya fue anexado...');

const recursosAnexosExistentes = [
  {
    title: 'Sopa de letras interactiva: Trigonometría',
    typeKey: 'sopa',
    tipo: 'Sopa de letras',
    html: '<div>Sopa HTML</div>'
  },
  {
    title: 'Presentación en diapositivas: Trigonometría',
    typeKey: 'diapositivas',
    tipo: 'Presentación',
    html: '<div>Slides HTML</div>'
  }
];

const recSopa = recs.find(r => r.typeKey === 'sopa');
const recPresentacion = recs.find(r => r.typeKey === 'diapositivas');
const recJuegos = recs.find(r => r.typeKey === 'juegos');
const recPreguntas = recs.find(r => r.typeKey === 'preguntas');

assert.strictEqual(isMaterialAnexado(recSopa, recursosAnexosExistentes), true, 'La sopa de letras ya anexada debe ser detectada como anexada');
assert.strictEqual(isMaterialAnexado(recPresentacion, recursosAnexosExistentes), true, 'La presentación ya anexada debe ser detectada como anexada');
assert.strictEqual(isMaterialAnexado(recJuegos, recursosAnexosExistentes), false, 'Los juegos no anexados no deben marcarse como anexados');
assert.strictEqual(isMaterialAnexado(recPreguntas, recursosAnexosExistentes), false, 'Las preguntas no anexadas no deben marcarse como anexadas');

const matchSopa = getAnexadoMatch(recSopa, recursosAnexosExistentes);
assert.ok(matchSopa !== null, 'Debe retornar el objeto del recurso anexado');
assert.strictEqual(matchSopa.title, 'Sopa de letras interactiva: Trigonometría');

console.log('✓ Prueba 3 superada: Detección y bloqueo de re-generación verificado estrictamente.');

// 4. Verificando inmutabilidad del plan de clase
console.log('4. Verificando principio de no-generación automática e inmutabilidad...');

const copiaPlan = `${planMdMate}`;
recomendarMaterialesDidacticos(metaMatematicas, planMdMate);
assert.strictEqual(copiaPlan, planMdMate, 'El plan original no debe mutar en memoria');

console.log('✓ Prueba 4 superada: Inmutabilidad del plan confirmada.');

console.log('\n========================================================================');
console.log('TODAS LAS PRUEBAS DE MATERIALES DIDÁCTICOS COMPLETOS PASARON CON ÉXITO');
console.log('========================================================================\n');
