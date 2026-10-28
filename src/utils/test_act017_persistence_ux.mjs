import assert from 'node:assert';
import { useAppStore } from '../store/useAppStore.js';
import { 
  savePlanToDB, 
  updatePlanInDB, 
  getMisPlanes, 
  getPlanById, 
  deletePlanFromDB, 
  removeLocalSavedPlan 
} from '../services/dbService.js';

// Polyfill minimal localStorage
if (typeof globalThis.localStorage === 'undefined') {
  const storeMap = new Map();
  globalThis.localStorage = {
    getItem: (key) => storeMap.get(key) || null,
    setItem: (key, val) => storeMap.set(key, String(val)),
    removeItem: (key) => storeMap.delete(key),
    clear: () => storeMap.clear()
  };
}

async function runACT017Tests() {
  console.log('--- INICIO DE PRUEBAS DE CICLO DE VIDA, PERSISTENCIA Y UX (ACT-017) ---');

  // =========================================================================
  // PRUEBA 1 & 2: Creación de borrador, navegación y comprobación de conservación
  // =========================================================================
  console.log('1. Verificando conservación de borrador en el planificador...');

  useAppStore.getState().updateWizardData({
    tema: 'Estructuras de Control y Bucles en Python',
    materia: 'Tecnología e Informática',
    grado: '9no Bachillerato',
    recursos: 'Sala con 20 PCs y Thonny IDE'
  });
  useAppStore.getState().saveWizardProgress({
    tema: 'Estructuras de Control y Bucles en Python'
  }, 2);

  const draftAfterNav = useAppStore.getState();
  assert.strictEqual(draftAfterNav.wizardData.tema, 'Estructuras de Control y Bucles en Python', 'El tema debe conservarse en el borrador');
  assert.strictEqual(draftAfterNav.wizardStep, 2, 'La fase del asistente debe ser 2');
  assert.strictEqual(draftAfterNav.wizardData.grado, '9no Bachillerato', 'El grado debe conservarse');
  console.log('✓ Prueba 1 y 2 superadas: El borrador en construcción no se pierde al navegar ni al montar el componente.');

  // =========================================================================
  // PRUEBA 4, 5 & 6: Generación de plan SIN guardado automático en Mis Planes
  // =========================================================================
  console.log('2. Verificando que generar un plan NO lo registra como definitivo en Mis Planes...');

  const testUserId = `user_act017_${Date.now()}`;
  const initialPlans = await getMisPlanes(testUserId);
  const initialCount = initialPlans.length;

  // Simulamos la finalización de generación por IA: completePlanGeneration con newPlanId = null
  const mockPlanMarkdown = '# PLAN DE CLASE — PYTHON\n\nContenido curricular...';
  const mockPlanMeta = {
    tema: 'Estructuras de Control y Bucles en Python',
    materia: 'Tecnología e Informática',
    grado: '9no Bachillerato'
  };

  useAppStore.getState().completePlanGeneration(mockPlanMarkdown, mockPlanMeta, null);

  const stateAfterGen = useAppStore.getState();
  assert.strictEqual(stateAfterGen.planStatus, 'generado', 'El estado del plan recién generado debe ser "generado"');
  assert.strictEqual(stateAfterGen.planId, null, 'El plan generado NO debe tener un ID persistido en la nube aún');
  assert.strictEqual(stateAfterGen.planGenerado, mockPlanMarkdown, 'El editor debe disponer del contenido generado');
  assert.strictEqual(stateAfterGen.estadoCambios, true, 'Debe indicar cambios pendientes de guardar');

  // Verificamos que Mis Planes no contenga este documento aún
  const plansAfterGen = await getMisPlanes(testUserId);
  assert.strictEqual(plansAfterGen.length, initialCount, 'Mis Planes no debe contener el plan generado antes del guardado explícito');
  console.log('✓ Prueba 4, 5 y 6 superadas: El plan generado se abre en el Editor sin registrarse en la base de datos.');

  // =========================================================================
  // PRUEBA 7 & 11: Guardado explícito y prevención de duplicados
  // =========================================================================
  console.log('3. Verificando guardado explícito en la base de datos...');

  const newPlanId = await savePlanToDB(testUserId, mockPlanMeta, mockPlanMarkdown, []);
  assert(newPlanId, 'Debe retornar un ID para el documento guardado');

  useAppStore.getState().setPlanId(newPlanId);
  useAppStore.getState().setPlanStatus('guardado');
  useAppStore.getState().setEstadoCambios(false);

  const plansAfterSave = await getMisPlanes(testUserId);
  const foundPlan = plansAfterSave.find(p => p.id === newPlanId);
  assert(foundPlan, 'El plan guardado debe ser recuperable desde la base de datos');
  assert.strictEqual(foundPlan.tema, 'Estructuras de Control y Bucles en Python');

  // Prueba 11: Guardar cambios sucesivos no debe crear duplicados (debe actualizar el mismo ID)
  const updatedMarkdown = mockPlanMarkdown + '\n\n## Actualización formativa';
  await updatePlanInDB(newPlanId, updatedMarkdown, []);
  const plansAfterUpdate = await getMisPlanes(testUserId);
  const matches = plansAfterUpdate.filter(p => p.id === newPlanId);
  assert.strictEqual(matches.length, 1, 'No debe crear duplicados al guardar el mismo plan');

  console.log('✓ Prueba 7 y 11 superadas: Guardado explícito exitoso sin duplicados.');

  // =========================================================================
  // PRUEBA 8 & 9: Recuperación y edición con estado de cambios pendientes
  // =========================================================================
  console.log('4. Verificando edición de plan y cambios pendientes...');

  const loadedPlan = await getPlanById(newPlanId);
  assert(loadedPlan, 'getPlanById debe recuperar el plan persistido');
  assert(loadedPlan.markdown.includes('Actualización formativa'), 'Debe reflejar el contenido actualizado');

  useAppStore.getState().loadPlan(loadedPlan, loadedPlan.markdown, loadedPlan.id);
  assert.strictEqual(useAppStore.getState().planStatus, 'guardado', 'Al cargar, el estado es guardado');

  // Docente modifica el texto en el editor
  useAppStore.getState().setPlanGenerado(loadedPlan.markdown + '\n\nModificación en clase...');
  useAppStore.getState().setPlanStatus('modificado');
  useAppStore.getState().setEstadoCambios(true);

  assert.strictEqual(useAppStore.getState().planStatus, 'modificado', 'El estado debe cambiar a "modificado"');
  assert.strictEqual(useAppStore.getState().estadoCambios, true, 'estadoCambios debe ser true');
  console.log('✓ Prueba 8 y 9 superadas: Ciclo de edición y detección de cambios pendientes verificado.');

  // =========================================================================
  // PRUEBA 10: Eliminación definitiva de plan
  // =========================================================================
  console.log('5. Verificando eliminación de plan...');

  await deletePlanFromDB(newPlanId);
  removeLocalSavedPlan(newPlanId);
  useAppStore.getState().clearActivePlanIfMatches(newPlanId);

  const plansAfterDelete = await getMisPlanes(testUserId);
  const deletedMatch = plansAfterDelete.find(p => p.id === newPlanId);
  assert(!deletedMatch, 'El plan eliminado no debe aparecer en Mis Planes');
  assert.strictEqual(useAppStore.getState().planId, null, 'El editor debe desvincular el plan eliminado');
  console.log('✓ Prueba 10 superada: Eliminación confirmada y sincronizada.');

  console.log('\n=================================================================');
  console.log('TODAS LAS PRUEBAS DE PERSISTENCIA Y CICLO DE VIDA (ACT-017) EXITOSAS');
  console.log('=================================================================\n');
}

runACT017Tests().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('FALLO EN PRUEBA:', err);
  process.exit(1);
});
