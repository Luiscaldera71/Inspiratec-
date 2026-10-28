import { savePlanToDB, getMisPlanes, deletePlanFromDB, getLocalSavedPlans } from '../services/dbService.js';

// Polyfill minimal localStorage for standalone Node test execution
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

async function runAcceptanceTests() {
  console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: MENÚ Y ELIMINACIÓN PERSISTENTE ---');

  // Test 1: Crear dos planes de prueba distintos
  console.log('1. Creando dos planes independientes en persistencia...');
  const planData1 = {
    tema: 'Plan de Prueba A - Robótica Submarina',
    materia: 'Tecnología e Informática',
    grado: '8° Grado',
    estado: 'Guardado'
  };
  const planData2 = {
    tema: 'Plan de Prueba B - Inteligencia Artificial en Aula',
    materia: 'Ciencias Naturales',
    grado: '10° Grado',
    estado: 'Guardado'
  };

  const id1 = await savePlanToDB('docente_test_persistencia', planData1, '# Contenido Plan A');
  const id2 = await savePlanToDB('docente_test_persistencia', planData2, '# Contenido Plan B');

  if (!id1 || !id2) {
    throw new Error('FALLO: No se pudieron generar los IDs de los planes de prueba.');
  }
  console.log(`✓ Prueba 1 superada: Plan 1 (${id1}) y Plan 2 (${id2}) creados.`);

  // Test 2: Comprobar que ambos planes se recuperan en getMisPlanes
  console.log('2. Verificando que ambos planes aparecen en getMisPlanes...');
  const initialPlanes = await getMisPlanes('docente_test_persistencia');
  const found1 = initialPlanes.find(p => p.id === id1);
  const found2 = initialPlanes.find(p => p.id === id2);

  if (!found1 || !found2) {
    throw new Error('FALLO: Uno o ambos planes no fueron recuperados en getMisPlanes.');
  }
  console.log('✓ Prueba 2 superada: Ambos planes figuran correctamente en la lista.');

  // Test 3: Simular que el Plan 1 estaba cargado en la sesión activa del editor
  console.log('3. Simulando plan cargado en sesión activa del editor (inspiratec_active_session)...');
  globalThis.localStorage.setItem('inspiratec_active_session', JSON.stringify({
    state: {
      planId: id1,
      planGenerado: '# Contenido Plan A (en memoria activa del editor)',
      activePlanMetadata: { tema: planData1.tema },
      planStatus: 'guardado'
    }
  }));

  // Test 4: Eliminar el Plan 1 y comprobar persistencia
  console.log(`4. Ejecutando deletePlanFromDB sobre Plan 1 (${id1})...`);
  await deletePlanFromDB(id1);

  // Test 5: Simular recarga de página (consultar getMisPlanes de nuevo)
  console.log('5. Simulando recarga completa de página y consultando almacenamiento real...');
  const reloadedPlanes = await getMisPlanes('docente_test_persistencia');
  const stillFound1 = reloadedPlanes.find(p => p.id === id1);
  const stillFound2 = reloadedPlanes.find(p => p.id === id2);

  if (stillFound1) {
    throw new Error('FALLO CRÍTICO: El Plan 1 reapareció tras la recarga (resurrección de plan detectada).');
  }
  if (!stillFound2) {
    throw new Error('FALLO CRÍTICO: El Plan 2 fue eliminado o afectado accidentalmente.');
  }
  console.log('✓ Prueba 5 superada: Plan 1 eliminado de forma permanente y Plan 2 conservado intacto.');

  // Test 6: Verificar que la sesión activa fue desvinculada del plan eliminado
  console.log('6. Verificando desvinculación de sesión activa para evitar residuos...');
  const activeAfterDelete = JSON.parse(globalThis.localStorage.getItem('inspiratec_active_session') || '{}');
  const stateAfter = activeAfterDelete?.state || {};
  if (stateAfter.planId === id1) {
    throw new Error('FALLO: La sesión activa aún conserva el ID del plan eliminado.');
  }
  console.log('✓ Prueba 6 superada: Sesión activa saneada correctamente.');

  // Limpieza final de prueba
  await deletePlanFromDB(id2);
  console.log('\n======================================================');
  console.log('TODAS LAS PRUEBAS DE PERSISTENCIA Y LIMPIEZA PASARON');
  console.log('======================================================\n');
  process.exit(0);
}

runAcceptanceTests().catch(err => {
  console.error('ERROR EN PRUEBAS:', err);
  process.exit(1);
});
