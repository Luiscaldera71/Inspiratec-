import assert from 'node:assert';
import { 
  CURRICULAR_NODES, 
  CURRICULAR_EJES, 
  CURRICULAR_GRADOS, 
  getCurricularNodeById, 
  getAncestors, 
  getDescendants,
  mapearGradoAGrupo 
} from './curricularGraphData.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: GRAFO CURRICULAR Y PRERREQUISITOS (FASE 2) ---');

// ==========================================
// PRUEBA 1: Integridad Estructural y Existencia de Referencias
// ==========================================
console.log('1. Verificando integridad estructural del grafo ontológico...');

assert(CURRICULAR_NODES.length >= 20, 'El grafo debe contener al menos 20 nodos de competencias');
assert.strictEqual(CURRICULAR_GRADOS.length, 5, 'Deben existir 5 grupos de grado canónicos');
assert.strictEqual(Object.keys(CURRICULAR_EJES).length, 4, 'Deben existir los 4 ejes de la Guía 30 del MEN');

const nodeIds = new Set(CURRICULAR_NODES.map(n => n.id));
assert.strictEqual(nodeIds.size, CURRICULAR_NODES.length, 'Todos los identificadores de nodo deben ser únicos');

// Verificar que todo prerrequisito referenciado exista
CURRICULAR_NODES.forEach(node => {
  assert(node.codigo, `El nodo ${node.id} debe tener un código oficial`);
  assert(node.titulo, `El nodo ${node.id} debe tener un título`);
  assert(node.descripcion, `El nodo ${node.id} debe tener una descripción pedagógica`);
  assert(CURRICULAR_EJES[node.eje], `El nodo ${node.id} debe pertenecer a un eje curricular válido`);
  assert(typeof node.x === 'number' && typeof node.y === 'number', `El nodo ${node.id} debe tener coordenadas numéricas válidas`);

  node.prerrequisitos.forEach(prereqId => {
    assert(nodeIds.has(prereqId), `El prerrequisito '${prereqId}' referenciado en '${node.id}' debe existir en el grafo`);
  });
});

console.log('✓ Prueba 1 superada: Integridad de nodos y referencias confirmada sin enlaces rotos.');

// ==========================================
// PRUEBA 2: Grafo Dirigido Acíclico (DAG) - Ausencia de Ciclos Infinitos
// ==========================================
console.log('2. Verificando que el grafo es estrictamente acíclico (DAG)...');

// Algoritmo de detección de ciclos por DFS
const visiting = new Set();
const visited = new Set();

function detectCycle(nodeId) {
  visiting.add(nodeId);
  const node = getCurricularNodeById(nodeId);

  for (const prereqId of node.prerrequisitos) {
    if (visiting.has(prereqId)) {
      throw new Error(`¡Ciclo detectado entre ${nodeId} y ${prereqId}!`);
    }
    if (!visited.has(prereqId)) {
      detectCycle(prereqId);
    }
  }

  visiting.delete(nodeId);
  visited.add(nodeId);
}

CURRICULAR_NODES.forEach(node => {
  if (!visited.has(node.id)) {
    detectCycle(node.id);
  }
});

console.log('✓ Prueba 2 superada: El grafo es estrictamente acíclico, garantizando progresión formativa.');

// ==========================================
// PRUEBA 3: Progresión Transitiva de Ancestros y Prerrequisitos
// ==========================================
console.log('3. Verificando cálculo transitivo de prerrequisitos (Ancestros)...');

// Tomamos como prueba el nodo de pensamiento computacional de 6°-7°
const nodoPC = 'tec_6_7_pensamiento_computacional';
const ancestrosPC = getAncestors(nodoPC);

assert(ancestrosPC.includes('tec_4_5_descomposicion'), 'Debe incluir su prerrequisito directo de 4°-5°');
assert(ancestrosPC.includes('tec_1_3_secuencias'), 'Debe incluir transitivamente la competencia base de 1°-3°');

// Nodo fundacional sin prerrequisitos
const ancestrosBase = getAncestors('tec_1_3_artefactos');
assert.strictEqual(ancestrosBase.length, 0, 'Un nodo fundacional debe tener 0 ancestros');

console.log('✓ Prueba 3 superada: Resolución transitiva de prerrequisitos validada correctamente.');

// ==========================================
// PRUEBA 4: Cálculo Transitivo de Descendientes (Competencias Habilitadas)
// ==========================================
console.log('4. Verificando cálculo de competencias habilitadas (Descendientes)...');

const nodoSecuencias = 'tec_1_3_secuencias';
const descendientesSecuencias = getDescendants(nodoSecuencias);

assert(descendientesSecuencias.includes('tec_4_5_descomposicion'), 'Debe habilitar algoritmos en 4°-5°');
assert(descendientesSecuencias.includes('tec_6_7_pensamiento_computacional'), 'Debe habilitar programación en 6°-7°');
assert(descendientesSecuencias.includes('tec_8_9_robotica_educativa'), 'Debe habilitar robótica en 8°-9°');

console.log('✓ Prueba 4 superada: Proyección de competencias futuras validada correctamente.');

// ==========================================
// PRUEBA 5: Mapeo de Grado Escolar a Grupo Curricular
// ==========================================
console.log('5. Verificando función de mapeo de grado escolar...');

assert.strictEqual(mapearGradoAGrupo('1° Primaria'), '1-3');
assert.strictEqual(mapearGradoAGrupo('Grado 5°'), '4-5');
assert.strictEqual(mapearGradoAGrupo('7°'), '6-7');
assert.strictEqual(mapearGradoAGrupo('Octavo (8°)'), '8-9');
assert.strictEqual(mapearGradoAGrupo('11-A'), '10-11');
assert.strictEqual(mapearGradoAGrupo(''), '6-7', 'Debe ofrecer valor por defecto seguro');

console.log('✓ Prueba 5 superada: Mapeo de grados resiliente y verificado.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE LA FASE 2 SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
