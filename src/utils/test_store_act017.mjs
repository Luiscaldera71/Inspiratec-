import assert from 'node:assert';
import { useAppStore, INITIAL_WIZARD_DATA } from '../store/useAppStore.js';

console.log('--- INICIO DE PRUEBAS DE ESTADO Y PERSISTENCIA ZUSTAND (ACT-017) ---');

const store = useAppStore.getState();

// =========================================================================
// 1. Conservación de borrador
// =========================================================================
console.log('1. Verificando persistencia y conservación del borrador...');

useAppStore.getState().updateWizardData({
  tema: 'Robótica Educativa con Micro:bit',
  materia: 'Tecnología e Informática',
  grado: '7mo Bachillerato',
  recursos: 'Kits micro:bit y cables USB'
});
useAppStore.getState().saveWizardProgress({
  tema: 'Robótica Educativa con Micro:bit'
}, 2);

let state = useAppStore.getState();
assert.strictEqual(state.wizardData.tema, 'Robótica Educativa con Micro:bit');
assert.strictEqual(state.wizardStep, 2);
assert.strictEqual(state.wizardData.grado, '7mo Bachillerato');
assert(state.wizardDraftSavedAt !== null);
console.log('✓ Estado de borrador conservado correctamente.');

// =========================================================================
// 2. Generación sin guardado automático en base de datos
// =========================================================================
console.log('2. Verificando estado tras generación (planStatus: generado, planId: null)...');

const mockMarkdown = '# SECUENCIA DIDÁCTICA: ROBÓTICA EDUCATIVA';
const mockMeta = { ...state.wizardData };

useAppStore.getState().completePlanGeneration(mockMarkdown, mockMeta, null);

state = useAppStore.getState();
assert.strictEqual(state.planGenerado, mockMarkdown, 'Editor debe tener el texto generado');
assert.strictEqual(state.planId, null, 'El plan generado NO debe tener un ID persistido en BD');
assert.strictEqual(state.planStatus, 'generado', 'El estado debe ser estrictamente "generado"');
assert.strictEqual(state.estadoCambios, true, 'Debe indicar cambios pendientes de confirmación');

// El formulario del wizard se resetea para que la próxima planificación inicie limpia
assert.strictEqual(state.wizardData.tema, '', 'El wizard debe quedar listo para el próximo plan');
assert.strictEqual(state.wizardStep, 1);
console.log('✓ Plan generado exitosamente en memoria sin persistencia prematura.');

// =========================================================================
// 3. Confirmación explícita de guardado
// =========================================================================
console.log('3. Verificando confirmación explícita de guardado...');

const simulatedNewId = 'doc_guardado_definitivo_101';
useAppStore.getState().setPlanId(simulatedNewId);
useAppStore.getState().setPlanStatus('guardado');
useAppStore.getState().setEstadoCambios(false);

state = useAppStore.getState();
assert.strictEqual(state.planId, simulatedNewId);
assert.strictEqual(state.planStatus, 'guardado');
assert.strictEqual(state.estadoCambios, false);
console.log('✓ Transición a estado "guardado" confirmada.');

// =========================================================================
// 4. Modificación posterior y estado "modificado"
// =========================================================================
console.log('4. Verificando edición de plan existente (estado modificado)...');

useAppStore.getState().setPlanGenerado(mockMarkdown + '\n\nModificación docente...');
useAppStore.getState().setPlanStatus('modificado');
useAppStore.getState().setEstadoCambios(true);

state = useAppStore.getState();
assert.strictEqual(state.planStatus, 'modificado');
assert.strictEqual(state.estadoCambios, true);
assert(state.planGenerado.includes('Modificación docente'));
console.log('✓ Transición a estado "modificado" con cambios pendientes confirmada.');

// =========================================================================
// 5. Desvinculación ante eliminación
// =========================================================================
console.log('5. Verificando desvinculación al eliminar plan...');

useAppStore.getState().clearActivePlanIfMatches(simulatedNewId);
state = useAppStore.getState();
assert.strictEqual(state.planId, null, 'planId debe ser null tras eliminar el plan activo');
assert.strictEqual(state.planGenerado, '', 'planGenerado debe limpiarse');
console.log('✓ Desvinculación de plan eliminado confirmada.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE ESTADO ACT-017 PASARON CON ÉXITO');
console.log('======================================================\n');
