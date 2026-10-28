import assert from 'node:assert';
import { 
  DEFAULT_PEDAGOGICAL_DNA, 
  getPedagogicalDna, 
  savePedagogicalDna, 
  autoSyncDnaFromHistory,
  addRecursoProbado,
  removeRecursoProbado,
  formatDnaPromptDirective 
} from '../services/pedagogicalDnaService.js';
import { savePlanToDB, getMisPlanes, removeLocalSavedPlan } from '../services/dbService.js';

console.log('🧪 Iniciando prueba E2E completa del ADN Pedagógico & Backend Sincronizado...');

// Test 1: Verificación de Defaults limpios
assert(DEFAULT_PEDAGOGICAL_DNA.memoriaExito, 'Debe incluir memoria de éxito');
assert.strictEqual(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.totalPlanesAnalizados, 0, 'Total de planes inicial debe ser 0');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.metodologiasFrecuentes), 'Metodologías debe ser array');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.recursosPredilectos), 'Recursos predilectos debe ser array');
assert.strictEqual(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.metodologiasFrecuentes.length, 0, 'Metodologías iniciales deben estar vacías');
console.log('✓ 1. Defaults de ADN pedagógico verificados');

// Test 2: Sincronización con 0 planes retorna estado cero honesto
const zeroDna = await autoSyncDnaFromHistory('test_user_empty');
assert.strictEqual(zeroDna.memoriaExito.totalPlanesAnalizados, 0, 'Planes analizados debe ser 0');
assert.strictEqual(zeroDna.memoriaExito.indiceInnovacion, 0, 'Índice de innovación debe ser 0 cuando no hay planes');
assert.strictEqual(zeroDna.memoriaExito.metodologiasFrecuentes.length, 0, 'No debe haber metodologías ficticias');
console.log('✓ 2. Sincronización en estado cero validada');

// Test 3: Sincronización con planes reales del usuario
const testUser = 'docente_e2e_real_' + Date.now();
const plan1 = {
  tema: 'Ecosistemas y Robótica',
  materia: 'Ciencias Naturales',
  metodologiaSTEAM: 'Aprendizaje Basado en Proyectos (ABP)',
  recursosAnexos: [
    { title: 'Rúbrica de Biodiversidad', typeKey: 'rubrica' },
    { title: 'Trivia Gamificada del Ecosistema', typeKey: 'juegos' }
  ]
};
const plan2 = {
  tema: 'Sensores de Humedad y Micro:bit',
  materia: 'Tecnología e Informática',
  metodologiaSTEAM: 'Aprendizaje Basado en Proyectos (ABP)',
  recursosAnexos: [
    { title: 'Presentación Interactiva de Circuitos', typeKey: 'presentacion' }
  ]
};

const id1 = await savePlanToDB(testUser, plan1, '# Plan 1 Markdown');
const id2 = await savePlanToDB(testUser, plan2, '# Plan 2 Markdown');

// Ejecutar sincronización real desde historial
const syncedDna = await autoSyncDnaFromHistory(testUser);
assert.strictEqual(syncedDna.memoriaExito.totalPlanesAnalizados, 2, 'Debe haber analizado exactamente 2 planes');
assert(syncedDna.memoriaExito.indiceInnovacion > 0, 'El índice de innovación debe ser positivo');
assert.strictEqual(syncedDna.memoriaExito.metodologiasFrecuentes[0].name, 'Aprendizaje Basado en Proyectos (ABP)');
assert.strictEqual(syncedDna.memoriaExito.metodologiasFrecuentes[0].count, 2);
assert.strictEqual(syncedDna.memoriaExito.metodologiasFrecuentes[0].porcentaje, 100);

// Verificar recursos didácticos
const resKeys = syncedDna.memoriaExito.recursosPredilectos.map(r => r.key);
assert(resKeys.includes('rubrica'), 'Debe incluir rúbrica');
assert(resKeys.includes('juegos'), 'Debe incluir juegos');
assert(resKeys.includes('presentacion'), 'Debe incluir presentación');
console.log('✓ 3. Sincronización dinámica con planes reales comprobada con éxito');

// Test 4: Banco de recursos probados (Añadir y Eliminar)
const recursoPrueba = {
  title: 'Rúbrica Socioformativa de Cierre',
  type: 'rubrica',
  engagement: 5,
  notaDocente: 'Muy efectiva en aula'
};
const updatedWithResource = await addRecursoProbado(testUser, recursoPrueba);
assert(updatedWithResource.recursosProbados.some(r => r.title === recursoPrueba.title), 'Debe contener el recurso recién añadido');

const addedId = updatedWithResource.recursosProbados.find(r => r.title === recursoPrueba.title).id;
const updatedAfterDelete = await removeRecursoProbado(testUser, addedId);
assert(!updatedAfterDelete.recursosProbados.some(r => r.id === addedId), 'El recurso debe haber sido eliminado');
console.log('✓ 4. Operaciones de Banco de Recursos probados (Añadir/Eliminar) funcionales');

// Test 5: Directiva de Gemini
const directive = formatDnaPromptDirective(syncedDna, {
  materia: 'Tecnología',
  aplicarAdnPedagógico: true,
  esTransversal: true,
  ejeTransversal: 'PRAE',
  areaSecundaria: 'Ciencias',
  retoContextual: '¿Cómo reciclar plásticos?'
});
assert(directive.includes('MEMORIA CONTEXTUAL Y ADN PEDAGÓGICO'));
assert(directive.includes('ESTUDIO Y ARTICULACIÓN TRANSVERSAL INTERDISCIPLINAR'));
console.log('✓ 5. Directivas de prompt para Gemini correctamente articuladas');

// Limpieza
removeLocalSavedPlan(id1);
removeLocalSavedPlan(id2);

console.log('🎉 TODAS las pruebas E2E del ADN Pedagógico pasaron al 100%. Backend y Frontend funcionales.');
