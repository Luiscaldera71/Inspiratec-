import assert from 'node:assert/strict';
import { injectTrackingBridge, parseTrackMessage } from '../services/sessions/trackingBridge.js';
import { buildResourceResult, summarizeResourceParticipant, buildResourceCsv, percentToGrade } from '../services/sessions/sessionLogic.js';
import { generateGamifiedQuizHTML } from '../services/materials/quizGameGenerator.js';
import { generateWordsearchHTML } from '../services/materials/wordsearchGenerator.js';

console.log('🧪 Seguimiento de recursos enviados en línea...');

// 1. Puente: se inyecta una sola vez y antes del contenido
const base = '<!doctype html><html><head><title>x</title></head><body>Hola</body></html>';
const inj = injectTrackingBridge(base);
assert(inj.includes('window.InspiraTrack = {'), 'Debe inyectar el puente');
assert(inj.indexOf('window.InspiraTrack') < inj.indexOf('<body>'), 'El puente va en <head>');
assert.equal(injectTrackingBridge(inj), inj, 'No se duplica');
assert(injectTrackingBridge('<p>solo</p>').startsWith('<script>'), 'HTML sin <head> también funciona');
console.log('✓ Puente de seguimiento');

// 2. Mensajes del recurso
assert.equal(parseTrackMessage({ foo: 1 }), null);
assert.deepEqual(parseTrackMessage({ inspiratec: 'track', type: 'progress', done: 3, total: 10 }), { type: 'progress', avance: 3, total: 10 });
assert.deepEqual(parseTrackMessage({ inspiratec: 'track', type: 'progress', done: 99, total: 10 }), { type: 'progress', avance: 10, total: 10 });
assert.deepEqual(parseTrackMessage({ inspiratec: 'track', type: 'finish', score: 7, total: 10 }), { type: 'finish', aciertos: 7, total: 10 });
assert.deepEqual(parseTrackMessage({ inspiratec: 'track', type: 'done' }), { type: 'done' });
assert.equal(parseTrackMessage({ inspiratec: 'track', type: 'progress', done: 1, total: 0 }), null);
console.log('✓ Mensajes del recurso');

// 3. Nota
assert.equal(percentToGrade(100), 5);
assert.equal(percentToGrade(70), 3.5);
assert.equal(percentToGrade(0), 0);
const fin = buildResourceResult({ type: 'finish', aciertos: 7, total: 10 });
assert.deepEqual(fin, { completado: true, aciertos: 7, total: 10, avance: 10, porcentaje: 70, nota: 3.5 });
assert.equal(buildResourceResult({ type: 'done' }).nota, null);
console.log('✓ Cálculo de la nota (0-5)');

// 4. Resumen y CSV para el docente
const ok = { nombre: 'Ana "A" Pérez', estado: 'enviado', entroEn: 1000, enviadoEn: 61000, respuestas: fin };
const enCurso = { nombre: 'Luis', estado: 'activo', respuestas: { completado: false, avance: 3, total: 10 } };
const sOk = summarizeResourceParticipant(ok);
assert.equal(sOk.terminado, true); assert.equal(sOk.duracionSeg, 60); assert.equal(sOk.nota, 3.5);
const sCur = summarizeResourceParticipant(enCurso);
assert.equal(sCur.terminado, false); assert.equal(sCur.avancePct, 30);
const csv = buildResourceCsv([ok, enCurso]);
assert(csv.includes('"Ana ""A"" Pérez"') && csv.includes('"Terminó"') && csv.includes('"En curso"') && csv.includes('"3.5"'));
console.log('✓ Resumen y CSV');

// 5. Los generadores reportan al puente y funcionan sin él (descarga normal)
const quiz = generateGamifiedQuizHTML({ title: 'T', questions: [{ question: 'a', options: ['1', '2', '3', '4'], correctIndex: 0 }] });
assert(quiz.includes('InspiraTrack.finish(score, questions.length)') && quiz.includes('InspiraTrack.register()'), 'Trivia reporta');
assert(quiz.includes('window.InspiraTrack &&') || quiz.includes('if (window.InspiraTrack)'), 'Protegido si no existe el puente');
const ws = generateWordsearchHTML({ title: 'T', words: ['SOL', 'LUNA', 'MAR'] });
assert(ws.includes('InspiraTrack.finish(WORDS.length, WORDS.length)'), 'Sopa de letras reporta');
console.log('✓ Generadores instrumentados');

console.log('\nTODAS LAS PRUEBAS DE SEGUIMIENTO DE RECURSOS PASARON');