import assert from 'node:assert';
import {
  generateSessionCode, normalizeCode, buildJoinUrl, isLocalOnlyUrl, normalizeQuestions,
  gradeSubmission, summarizeLeaves, evaluateLeavePolicy, buildExamView, buildResultsCsv
} from '../services/sessions/sessionLogic.js';

console.log('--- PRUEBAS: SESIONES EN VIVO (EVALUACIÓN / CLASE POR QR) ---');

// 1. Códigos y enlaces
const code = generateSessionCode();
assert.match(code, /^[A-HJKMNP-Z2-9]{6}$/, 'Código de 6 caracteres sin ambiguos');
assert.strictEqual(normalizeCode(' ab-c12 '), 'ABC12');
assert.strictEqual(buildJoinUrl('https://inspiratec.app/', 'k7p2qd'), 'https://inspiratec.app/s/K7P2QD');
assert(isLocalOnlyUrl('http://localhost:5173'));
assert(!isLocalOnlyUrl('https://inspiratec.vercel.app'));
console.log('✓ 1. Códigos y enlaces.');

// 2. Las preguntas publicadas NO llevan la respuesta; la clave va aparte
const { preguntas, clave } = normalizeQuestions([
  { tipo: 'opcion', enunciado: '¿Qué es un algoritmo?', opciones: ['Un dibujo', 'Una secuencia de pasos', 'Un número'], correcta: 1, puntos: 2 },
  { tipo: 'vf', enunciado: 'Un algoritmo puede tener pasos desordenados.', correcta: false },
  { tipo: 'abierta', enunciado: 'Explica con tus palabras qué es depurar.' },
  { tipo: 'opcion', enunciado: 'Sin respuesta válida', opciones: ['A', 'B'], correcta: 9 },
  { enunciado: '' }
]);
assert.strictEqual(preguntas.length, 3, 'Se descartan las preguntas inválidas');
assert(!JSON.stringify(preguntas).includes('correcta'), 'Las preguntas no deben exponer la respuesta');
assert.strictEqual(clave.q1, 1);
assert.strictEqual(clave.q2, 1);
assert.throws(() => normalizeQuestions([]), /al menos una pregunta/);
console.log('✓ 2. Preguntas normalizadas y clave separada.');

// 3. Calificación
const g = gradeSubmission(preguntas, clave, { q1: 1, q2: 0, q3: 'Corregir errores' });
assert.strictEqual(g.puntaje, 2);
assert.strictEqual(g.maximo, 3);
assert.strictEqual(g.porcentaje, 67);
assert.strictEqual(g.nota, 3.4);
assert.deepStrictEqual(g.pendientes, ['q3']);
assert.strictEqual(gradeSubmission(preguntas, clave, {}).puntaje, 0);
console.log('✓ 3. Calificación correcta con abiertas pendientes.');

// 4. Control de salida de pestaña
const ev = [{ tipo: 'salio', t: 1 }, { tipo: 'volvio', t: 2, duracionMs: 4000 }, { tipo: 'salio', t: 3 }, { tipo: 'volvio', t: 4, duracionMs: 1500 }];
assert.deepStrictEqual(summarizeLeaves(ev), { salidas: 2, msFuera: 5500 });
assert.strictEqual(evaluateLeavePolicy(0, 3), 'ok');
assert.strictEqual(evaluateLeavePolicy(1, 3), 'advertir');
assert.strictEqual(evaluateLeavePolicy(3, 3), 'bloquear');
assert.strictEqual(evaluateLeavePolicy(10, 0), 'advertir', 'maxSalidas 0 = solo advertir, nunca bloquear');
console.log('✓ 4. Política de salidas.');

// 5. Barajado estable y que conserva los índices originales
const v1 = buildExamView(preguntas, 'estudiante-1', true);
const v2 = buildExamView(preguntas, 'estudiante-1', true);
assert.deepStrictEqual(v1, v2, 'Estable si el estudiante recarga');
const q1 = v1.find(q => q.id === 'q1');
assert.strictEqual(q1.opcionesView.find(o => o.idx === 1).texto, 'Una secuencia de pasos', 'Cada opción conserva su índice original');
assert.deepStrictEqual(buildExamView(preguntas, 'x', false).map(q => q.id), ['q1', 'q2', 'q3']);
assert.deepStrictEqual(buildExamView(preguntas, 'x', true).find(q => q.id === 'q2').opcionesView.map(o => o.texto), ['Verdadero', 'Falso']);
console.log('✓ 5. Barajado estable.');

// 6. CSV
const csv = buildResultsCsv(preguntas, clave, [{ nombre: 'Ana "la mejor"', estado: 'enviado', respuestas: { q1: 1, q2: 1 }, eventos: ev, salidas: 2 }]);
assert(csv.includes('"Ana ""la mejor"""'));
assert(csv.split('\n')[1].includes('"3"') && csv.split('\n')[1].includes('"2"'));
console.log('✓ 6. CSV de resultados.');

console.log('\nTODAS LAS PRUEBAS DE SESIONES PASARON');
