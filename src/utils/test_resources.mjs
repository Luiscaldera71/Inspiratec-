import assert from 'node:assert';
import { RESOURCE_CATALOG, RESOURCE_CATEGORIES, getResourceDef, resolveResourceKey } from '../services/materials/resourceCatalog.js';
import { buildAulaInteractivaHtml, normalizeAulaContent } from '../services/materials/aulaInteractiva.js';
import { validateGeneratedHtml } from '../services/materials/creativeHtml.js';

console.log('--- PRUEBAS: CATÁLOGO DE RECURSOS Y AULA INTERACTIVA ---');

// 1. Catálogo consistente
const keys = RESOURCE_CATALOG.map(r => r.typeKey);
assert.strictEqual(new Set(keys).size, keys.length, 'Las claves del catálogo deben ser únicas');
assert(RESOURCE_CATALOG.length >= 20, 'El catálogo debe ofrecer una gama amplia');
const cats = new Set(RESOURCE_CATEGORIES.map(c => c.id));
RESOURCE_CATALOG.forEach(r => {
  assert(cats.has(r.categoria), `${r.typeKey}: categoría inválida`);
  assert(r.nombre && r.descripcion && (r.brief || r.accion), `${r.typeKey}: debe tener nombre, descripción y brief`);
});
assert.strictEqual(getResourceDef('aula_interactiva').plantilla, true);
assert.strictEqual(resolveResourceKey('quiz'), 'juegos');
assert.strictEqual(resolveResourceKey('SOPA_LETRAS'), 'sopa');
console.log(`✓ 1. Catálogo con ${RESOURCE_CATALOG.length} recursos en ${RESOURCE_CATEGORIES.length} categorías.`);

// 2. El aula interactiva se construye con el contenido y es un HTML válido
const contenido = {
  titulo: 'Algoritmos: hacer un sándwich',
  objetivo: 'Reconocer que un algoritmo es una secuencia ordenada de pasos',
  area: 'Tecnología e Informática',
  grado: '6°',
  momentos: [
    { nombre: 'Inicio: el robot hambriento', duracion: 10, instruccion: 'Presenta el reto', contenido: ['Un robot sigue instrucciones al pie de la letra'], pregunta: '¿Qué pasa si falta un paso?' },
    { nombre: 'Desarrollo: escribe el algoritmo', duracion: 25, contenido: ['Paso a paso'], actividad: { titulo: 'Ordena los pasos', pasos: ['Escribir', 'Probar', 'Depurar'] } }
  ],
  vocabulario: [{ termino: 'Algoritmo', definicion: 'Secuencia ordenada de pasos para resolver un problema' }],
  preguntas: [{ pregunta: '¿Qué es un algoritmo?', opciones: ['Un dibujo', 'Una secuencia de pasos', 'Un número'], correcta: 1, explicacion: 'Son pasos ordenados.' }],
  roles: [{ rol: 'Coordinador', funcion: 'Organiza al equipo' }]
};
const html = buildAulaInteractivaHtml(contenido);
assert.deepStrictEqual(validateGeneratedHtml(html), [], 'El aula debe pasar la validación estructural y de sintaxis JS');
assert(html.includes('Algoritmos: hacer un sándwich'));
assert(html.includes('id="board"') && html.includes('btnTeams') && html.includes('clock'), 'Debe traer pizarra, equipos y temporizador');
console.log('✓ 2. Aula interactiva generada y válida.');

// 3. El contenido no puede romper la página (inyección de etiquetas)
const malicioso = buildAulaInteractivaHtml({
  ...contenido,
  titulo: 'Clase </script><script>alert(1)</script>',
  momentos: [{ nombre: 'Inicio', contenido: ['</script><img src=x onerror=alert(1)>'] }, contenido.momentos[1]]
});
assert.strictEqual((malicioso.match(/<\/script>/g) || []).length, 2, 'Solo los dos cierres de script legítimos');
assert(!malicioso.includes('<script>alert(1)'));
console.log('✓ 3. El contenido se inserta de forma segura.');

// 4. Contenido insuficiente se rechaza (no se rellena con datos inventados)
assert.throws(() => normalizeAulaContent({ momentos: [{ nombre: 'Solo uno', contenido: ['x'] }] }), /al menos dos momentos/);
assert.throws(() => normalizeAulaContent(null));
console.log('✓ 4. Contenido insuficiente rechazado.');

console.log('\nTODAS LAS PRUEBAS DE RECURSOS PASARON');
