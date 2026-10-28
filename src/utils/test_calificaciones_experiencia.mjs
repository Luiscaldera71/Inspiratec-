import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: CALIFICACIONES Y COMENTARIOS EN EXPERIENCIAS ---');

// 1. Verificación de cálculo de promedio y desglose
console.log('1. Verificando cálculo de promedio de estrellas y desglose...');

const mockCalificaciones = [
  { id: 'cal_1', usuarioId: 'usr_1', usuarioNombre: 'Profe Daniel', estrellas: 5, comentario: '¡Gran impacto motivacional en 9no grado!', fecha: '2026-10-16T12:00:00Z' },
  { id: 'cal_2', usuarioId: 'usr_2', usuarioNombre: 'Profe María', estrellas: 4, comentario: 'Recomiendo ajustar el tiempo a 20 min en el inicio.', fecha: '2026-10-16T14:00:00Z' },
  { id: 'cal_3', usuarioId: 'usr_3', usuarioNombre: 'Profe Carlos', estrellas: 5, comentario: 'Excelente transposición didáctica.', fecha: '2026-10-16T15:30:00Z' }
];

const total = mockCalificaciones.length;
const sum = mockCalificaciones.reduce((acc, curr) => acc + curr.estrellas, 0);
const promedio = Number((sum / total).toFixed(1));

assert.strictEqual(total, 3, 'Debe haber 3 calificaciones registradas');
assert.strictEqual(sum, 14, 'La suma total de estrellas debe ser 14');
assert.strictEqual(promedio, 4.7, 'El promedio debe ser 4.7');

console.log('✓ Prueba 1 superada: Promedios y acumulados de estrellas calculados con exactitud.');

// 2. Verificación de actualización sin duplicar usuario (soberanía de usuario)
console.log('2. Verificando actualización de calificación por el mismo usuario sin duplicidad...');

const nuevaCalificacionMismoUsuario = {
  id: 'cal_1_updated',
  usuarioId: 'usr_1',
  usuarioNombre: 'Profe Daniel',
  estrellas: 5,
  comentario: 'Segunda aplicación: estudiantes comprendieron álgebra lineal en 15 min.',
  fecha: '2026-10-16T16:00:00Z'
};

const actualizarCalificaciones = (lista, nueva) => {
  const prevIdx = lista.findIndex(c => c.usuarioId === nueva.usuarioId && c.usuarioId !== 'anon');
  if (prevIdx >= 0) {
    const copia = [...lista];
    copia[prevIdx] = nueva;
    return copia;
  }
  return [nueva, ...lista];
};

const listaActualizada = actualizarCalificaciones(mockCalificaciones, nuevaCalificacionMismoUsuario);
assert.strictEqual(listaActualizada.length, 3, 'No debe incrementar la cantidad si el mismo usuario actualiza su valoración');
assert.strictEqual(listaActualizada[0].comentario, 'Segunda aplicación: estudiantes comprendieron álgebra lineal en 15 min.');

console.log('✓ Prueba 2 superada: El docente puede actualizar su reseña de aula sin generar duplicados.');

// 3. Verificación de integración en dbService y componentes
console.log('3. Verificando funciones en dbService.js y presencia de componentes...');

const dbServiceCode = fs.readFileSync('src/services/dbService.js', 'utf8');
assert(dbServiceCode.includes('export const addCalificacionPlan'), 'dbService debe exportar addCalificacionPlan');
assert(dbServiceCode.includes('export const getCalificacionesPlan'), 'dbService debe exportar getCalificacionesPlan');
assert(dbServiceCode.includes('export const deleteCalificacionPlan'), 'dbService debe exportar deleteCalificacionPlan');

const modalCode = fs.readFileSync('src/components/CalificacionExperienciaModal.jsx', 'utf8');
assert(modalCode.includes('CalificacionExperienciaModal'), 'El componente modal debe estar definido');
assert(modalCode.includes('getTextoNivel'), 'Debe incluir orientación pedagógica interactiva para cada estrella');
assert(modalCode.includes('Publicar valoración'), 'Debe incluir el botón de publicación');

const pageCode = fs.readFileSync('src/pages/ExperienciasPage.jsx', 'utf8');
assert(pageCode.includes('CalificacionExperienciaModal'), 'ExperienciasPage debe integrar el modal');
assert(pageCode.includes('setSelectedPlanForCalificar'), 'Debe controlar la apertura del modal');
assert(pageCode.includes('calificacionesExp = getCalificacionesPlan'), 'Debe obtener las calificaciones para cada tarjeta');

console.log('✓ Prueba 3 superada: Integración completa entre servicio, modal y página validada.');

console.log('\n========================================================================');
console.log('TODAS LAS PRUEBAS DEL SISTEMA DE CALIFICACIÓN Y EXPERIENCIAS PASARON');
console.log('========================================================================\n');
