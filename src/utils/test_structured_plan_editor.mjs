import assert from 'node:assert/strict';
import { parsePlanToStructuredBlocks, serializeStructuredBlocksToMarkdown } from './planDocumentParser.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: EDITOR ESTRUCTURADO Y UNIFICADO ---');

// 1. Verificando parsing de plan de clase canónico con tablas y listas
console.log('1. Verificando parsing de plan canónico con tabla de secuencia didáctica...');

const samplePlanMarkdown = `# PLAN DE CLASE — TECNOLOGÍA E INFORMÁTICA

### 1. DATOS DE IDENTIFICACIÓN
- **Institución:** IE República de Colombia
- **Área:** Tecnología e Informática | **Grado:** 7°
- **Docente:** Profe Daniel | **Duración:** 2 horas

---

### 2. FUNDAMENTACIÓN CURRICULAR
- **Componente:** Apropiación y uso de la tecnología
- **Competencia:** Reconozco principios de algoritmos en la vida cotidiana
- **Contenidos:** Algoritmos secuenciales y condicionales

---

### 3. SECUENCIA DIDÁCTICA

| Momentos de la clase | Actividades | Mediación (Recursos) |
| :--- | :--- | :--- |
| **Inicio** | Activación de saberes previos sobre recetas de cocina | Tablero y marcadores |
| **Desarrollo** | Programación de algoritmos en bloques con Scratch | Sala de cómputo (1 PC por estudiante) |
| **Cierre** | Socialización y debate reflexivo sobre errores comunes | Proyector y rúbrica formativa |

---

### 4. OBSERVACIONES Y AJUSTES DUA
Se disponen apoyos visuales y guía con capturas de pantalla para estudiantes que requieren refuerzo en la comprensión secuencial.`;

const blocks = parsePlanToStructuredBlocks(samplePlanMarkdown);

assert.ok(Array.isArray(blocks) && blocks.length > 0, 'El parser debe retornar un array de bloques no vacío');

const headerBlocks = blocks.filter(b => b.type === 'header');
assert.strictEqual(headerBlocks.length, 5, 'Debe haber 5 encabezados en el documento de muestra (1 H1 + 4 H3)');
assert.strictEqual(headerBlocks[0].level, 1, 'El primer encabezado debe ser H1');
assert.strictEqual(headerBlocks[0].text, 'PLAN DE CLASE — TECNOLOGÍA E INFORMÁTICA');

const tableBlocks = blocks.filter(b => b.type === 'table');
assert.strictEqual(tableBlocks.length, 1, 'Debe identificar exactamente 1 tabla de secuencia didáctica');
assert.strictEqual(tableBlocks[0].headers.length, 3, 'La tabla debe tener 3 columnas');
assert.strictEqual(tableBlocks[0].rows.length, 3, 'La tabla debe tener 3 filas (Inicio, Desarrollo, Cierre)');
assert.ok(tableBlocks[0].rows[0][0].includes('Inicio'), 'La primera fila debe ser Inicio');

console.log('✓ Prueba 1 superada: Documento descompuesto con éxito en bloques tipados.');

// 2. Verificando modificación estructurada in-situ de una celda de tabla
console.log('2. Verificando modificación estructurada de una celda sin alterar la estructura...');

const clonedBlocks = JSON.parse(JSON.stringify(blocks));
const targetTable = clonedBlocks.find(b => b.type === 'table');

// Modificamos la actividad del Inicio
targetTable.rows[0][1] = 'Desafío unplugged de laberintos en cuadrícula de papel';

const modifiedMarkdown = serializeStructuredBlocksToMarkdown(clonedBlocks);

assert.ok(modifiedMarkdown.includes('Desafío unplugged de laberintos en cuadrícula de papel'), 'El Markdown serializado debe incluir el texto editado');
assert.ok(modifiedMarkdown.includes('| Momentos de la clase | Actividades | Mediación (Recursos) |'), 'La cabecera de la tabla debe permanecer intacta');
assert.ok(modifiedMarkdown.includes('| **Inicio** | Desafío unplugged de laberintos en cuadrícula de papel | Tablero y marcadores |'), 'La fila debe formatearse como tabla GFM válida');

console.log('✓ Prueba 2 superada: Modificación de celda de tabla serializada fielmente en Markdown GFM.');

// 3. Verificando edición de títulos y listas sin símbolos Markdown crudos
console.log('3. Verificando edición de encabezados y listas sin símbolos crudos...');

const titleBlock = clonedBlocks.find(b => b.type === 'header' && b.level === 1);
titleBlock.text = 'PLAN DE CLASE — ROBÓTICA Y PENSAMIENTO COMPUTACIONAL';

const listBlock = clonedBlocks.find(b => b.type === 'list');
listBlock.items.push('**Modalidad:** Trabajo colaborativo por parejas');

const updatedMd = serializeStructuredBlocksToMarkdown(clonedBlocks);

assert.ok(updatedMd.startsWith('# PLAN DE CLASE — ROBÓTICA Y PENSAMIENTO COMPUTACIONAL'), 'El H1 editado debe serializarse con # sin duplicaciones');
assert.ok(updatedMd.includes('- **Modalidad:** Trabajo colaborativo por parejas'), 'El nuevo ítem de lista debe serializarse con guion de lista');

console.log('✓ Prueba 3 superada: Edición de encabezados y listas validada.');

// 4. Verificando resiliencia ante entradas vacías o nulas
console.log('4. Verificando resiliencia del parser ante entradas vacías...');

assert.deepStrictEqual(parsePlanToStructuredBlocks(''), [], 'Cadena vacía debe retornar array vacío');
assert.deepStrictEqual(parsePlanToStructuredBlocks(null), [], 'Null debe retornar array vacío');
assert.strictEqual(serializeStructuredBlocksToMarkdown([]), '', 'Array vacío debe serializar a cadena vacía');

console.log('✓ Prueba 4 superada: Resiliencia ante valores nulos comprobada.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DEL EDITOR ESTRUCTURADO SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
