import assert from 'node:assert';
import { 
  FELDER_PREGUNTAS, 
  FELDER_DIMENSIONES, 
  FELDER_META, 
  calcularResultadosFelder 
} from './felderSilvermanData.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: AUTODIAGNÓSTICO FELDER-SILVERMAN (FASE 1) ---');

// ==========================================
// PRUEBA 1: Verificación del Instrumento y Metadatos de Rigor
// ==========================================
console.log('1. Verificando estructura del instrumento y metadatos de rigor...');

assert.strictEqual(FELDER_PREGUNTAS.length, 8, 'El cuestionario debe contener exactamente 8 preguntas');
assert.strictEqual(Object.keys(FELDER_DIMENSIONES).length, 4, 'Deben existir exactamente 4 dimensiones');

const dims = ['procesamiento', 'percepcion', 'entrada', 'comprension'];
dims.forEach(dimKey => {
  const preguntasDim = FELDER_PREGUNTAS.filter(p => p.dimension === dimKey);
  assert.strictEqual(preguntasDim.length, 2, `La dimensión ${dimKey} debe tener exactamente 2 reactivos`);
  assert(FELDER_DIMENSIONES[dimKey], `La definición de dimensión ${dimKey} debe existir`);
});

// Verificación de rigor científico: no atribuir falsamente validación psicométrica
assert(FELDER_META.avisoRigor.toLowerCase().includes('no reemplaza el instrumento psicométrico formal ils de 44 reactivos'), 'Debe documentar explícitamente que no reemplaza el ILS de 44 reactivos');

console.log('✓ Prueba 1 superada: Instrumento de 8 reactivos y metadatos de rigor verificados.');

// ==========================================
// PRUEBA 2: Cálculo Matemático y Gradientes en Caso Extremo A
// ==========================================
console.log('2. Verificando cálculo para perfil totalmente orientado al Polo A...');

const respuestasTodoA = {
  1: 'activo',
  2: 'activo',
  3: 'sensorial',
  4: 'sensorial',
  5: 'visual',
  6: 'visual',
  7: 'secuencial',
  8: 'secuencial'
};

const resA = calcularResultadosFelder(respuestasTodoA);
assert.strictEqual(resA.contestadas, 8);
assert.strictEqual(resA.esCompleto, true);

// Procesamiento (Activo)
assert.strictEqual(resA.dimensiones.procesamiento.poloA.porcentaje, 100);
assert.strictEqual(resA.dimensiones.procesamiento.poloB.porcentaje, 0);
assert.strictEqual(resA.dimensiones.procesamiento.balanceDiferencial, 2);
assert.strictEqual(resA.dimensiones.procesamiento.poloDominante, 'activo');
assert(resA.dimensiones.procesamiento.interpretacionGradiente.includes('notoria'), 'Debe calificar como inclinación notoria');

// Percepción (Sensorial)
assert.strictEqual(resA.dimensiones.percepcion.poloA.porcentaje, 100);
assert.strictEqual(resA.dimensiones.percepcion.poloB.porcentaje, 0);

// Entrada (Visual)
assert.strictEqual(resA.dimensiones.entrada.poloA.porcentaje, 100);
assert.strictEqual(resA.dimensiones.entrada.poloB.porcentaje, 0);

// Comprensión (Secuencial)
assert.strictEqual(resA.dimensiones.comprension.poloA.porcentaje, 100);
assert.strictEqual(resA.dimensiones.comprension.poloB.porcentaje, 0);

console.log('✓ Prueba 2 superada: Cálculo extremo Polo A validado con éxito.');

// ==========================================
// PRUEBA 3: Cálculo Matemático y Gradientes en Caso Extremo B
// ==========================================
console.log('3. Verificando cálculo para perfil totalmente orientado al Polo B...');

const respuestasTodoB = {
  1: 'reflexivo',
  2: 'reflexivo',
  3: 'intuitivo',
  4: 'intuitivo',
  5: 'verbal',
  6: 'verbal',
  7: 'global',
  8: 'global'
};

const resB = calcularResultadosFelder(respuestasTodoB);
assert.strictEqual(resB.contestadas, 8);
assert.strictEqual(resB.esCompleto, true);

assert.strictEqual(resB.dimensiones.procesamiento.poloA.porcentaje, 0);
assert.strictEqual(resB.dimensiones.procesamiento.poloB.porcentaje, 100);
assert.strictEqual(resB.dimensiones.procesamiento.balanceDiferencial, -2);
assert.strictEqual(resB.dimensiones.procesamiento.poloDominante, 'reflexivo');

assert.strictEqual(resB.dimensiones.percepcion.poloB.porcentaje, 100);
assert.strictEqual(resB.dimensiones.entrada.poloB.porcentaje, 100);
assert.strictEqual(resB.dimensiones.comprension.poloB.porcentaje, 100);

console.log('✓ Prueba 3 superada: Cálculo extremo Polo B validado con éxito.');

// ==========================================
// PRUEBA 4: Cálculo Matemático y Gradientes en Caso Balanceado (Equilibrio)
// ==========================================
console.log('4. Verificando cálculo para perfil con balance en las 4 dimensiones...');

const respuestasBalance = {
  1: 'activo',
  2: 'reflexivo',
  3: 'sensorial',
  4: 'intuitivo',
  5: 'visual',
  6: 'verbal',
  7: 'secuencial',
  8: 'global'
};

const resBal = calcularResultadosFelder(respuestasBalance);
assert.strictEqual(resBal.contestadas, 8);
assert.strictEqual(resBal.esCompleto, true);

dims.forEach(dimKey => {
  const d = resBal.dimensiones[dimKey];
  assert.strictEqual(d.poloA.porcentaje, 50, `El polo A de ${dimKey} debe ser 50%`);
  assert.strictEqual(d.poloB.porcentaje, 50, `El polo B de ${dimKey} debe ser 50%`);
  assert.strictEqual(d.balanceDiferencial, 0, `El balance de ${dimKey} debe ser 0`);
  assert.strictEqual(d.poloDominante, 'equilibrado', `El polo dominante de ${dimKey} debe ser 'equilibrado'`);
  assert(d.interpretacionGradiente.includes('Preferencia balanceada'), `La interpretación debe destacar balance en ${dimKey}`);
});

console.log('✓ Prueba 4 superada: Gradiente de equilibrio y no encasillamiento verificado.');

// ==========================================
// PRUEBA 5: Resiliencia ante Respuestas Parciales
// ==========================================
console.log('5. Verificando cálculo con cuestionario incompleto (sin arrojar NaN)...');

const respuestasParciales = {
  1: 'activo',
  5: 'visual'
};

const resParcial = calcularResultadosFelder(respuestasParciales);
assert.strictEqual(resParcial.contestadas, 2);
assert.strictEqual(resParcial.esCompleto, false);

// Las dimensiones sin responder deben arrojar 50%-50% por defecto sin romper la UI
assert.strictEqual(resParcial.dimensiones.percepcion.poloA.porcentaje, 50);
assert.strictEqual(resParcial.dimensiones.percepcion.poloB.porcentaje, 50);
assert(!Number.isNaN(resParcial.dimensiones.percepcion.poloA.porcentaje));

console.log('✓ Prueba 5 superada: Resiliencia y cálculo parcial validados sin excepciones.');

// ==========================================
// PRUEBA 6: No Persistencia Automática ni Modificación de Planes
// ==========================================
console.log('6. Verificando que el cálculo es una función pura sin efectos colaterales...');

const estadoAntes = JSON.stringify(respuestasBalance);
calcularResultadosFelder(respuestasBalance);
const estadoDespues = JSON.stringify(respuestasBalance);

assert.strictEqual(estadoAntes, estadoDespues, 'El objeto de respuestas no debe ser mutado');
console.log('✓ Prueba 6 superada: Función de cálculo es estrictamente pura.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE LA FASE 1 SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
