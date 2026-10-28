import assert from 'node:assert';
import { getGradeGroup, getMenFramework, buildMenDirective, checkMenAlignment } from '../services/templates/menFrameworks.js';
import { GENERIC_TEMPLATES } from '../services/templates/genericTemplates.js';

console.log('--- PRUEBAS: ALINEACIÓN CON EL MEN POR ÁREA ---');

// 1. Grupos de grados de los estándares
assert.strictEqual(getGradeGroup('1ro'), '1° a 3°');
assert.strictEqual(getGradeGroup('5to'), '4° a 5°');
assert.strictEqual(getGradeGroup('7mo'), '6° a 7°');
assert.strictEqual(getGradeGroup('9no'), '8° a 9°');
assert.strictEqual(getGradeGroup('10mo'), '10° a 11°');
assert.strictEqual(getGradeGroup(''), '');
console.log('✓ 1. Grupos de grados correctos.');

// 2. Cada área del planificador resuelve su propio marco (Sociales ya no cae en Tecnología)
const areas = ['Tecnología e Informática', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales', 'Lengua Castellana', 'Inglés'];
const nombres = areas.map(a => getMenFramework(a)?.area);
assert.deepStrictEqual(nombres, areas);
areas.forEach(a => assert(buildMenDirective(a, '8vo').includes('8° a 9°'), `${a}: debe indicar el grupo de grados`));
console.log('✓ 2. Las 6 áreas tienen marco propio.');

// 3. La directiva de cada área cita sus referentes oficiales
assert(buildMenDirective('Tecnología e Informática', '6to').includes('Naturaleza y evolución de la tecnología'));
assert(buildMenDirective('Matemáticas', '6to').includes('numérico, espacial, métrico, aleatorio'));
assert(buildMenDirective('Ciencias Naturales', '6to').includes('Me aproximo al conocimiento'));
assert(buildMenDirective('Ciencias Sociales', '6to').includes('Relaciones ético-políticas'));
assert(buildMenDirective('Lengua Castellana', '6to').includes('Producción textual'));
assert(buildMenDirective('Inglés', '11mo').includes('B1'));
console.log('✓ 3. Directivas con los elementos oficiales.');

// 4. La verificación detecta carencias y acepta planes alineados
const vacio = checkMenAlignment('# Plan\nLa clase trata de un tema.', 'Matemáticas');
assert(vacio.faltantes.length >= 3, 'Un plan sin elementos MEN debe reportar carencias');

const planTec = 'Componente: Solución de problemas con tecnología. Competencia del componente. Evidencia de desempeño. Dimensión ética y de seguridad. Criterios de evaluación.';
assert.strictEqual(checkMenAlignment(planTec, 'Tecnología e Informática').faltantes.length, 0);

const planIng = 'Nivel MCER A2. Habilidades: speaking y listening. Objetivo comunicativo: el estudiante podrá pedir comida. Guía 22. Evaluación formativa.';
assert.strictEqual(checkMenAlignment(planIng, 'Inglés').faltantes.length, 0);
assert(checkMenAlignment('Plan de inglés sin niveles.', 'Inglés').faltantes.includes('nivel MCER (A1, A2, B1…)'));
console.log('✓ 4. Verificación de alineación funcional.');

// 5. Las plantillas piden los elementos que el MEN exige
const mock = { tema: 'Tema', materia: 'X', recursos: 'r', inclusion: [] };
const prompt = (titulo) => GENERIC_TEMPLATES.find(t => t.titulo.includes(titulo)).generarPromptInstrucciones(mock, null);
assert(prompt('estándar INSPIRATEC').includes('Competencia del componente'));
assert(prompt('Matemáticas').includes('Procesos generales'));
assert(prompt('Naturales').includes('Compromisos personales y sociales'));
assert(prompt('Lengua').includes('Situación comunicativa real'));
assert(prompt('Sociales').includes('Competencias a desarrollar'));
assert(prompt('Inglés').includes('Nivel MCER esperado'));
console.log('✓ 5. Plantillas con los elementos del MEN.');

console.log('\nTODAS LAS PRUEBAS DE ALINEACIÓN CON EL MEN PASARON');
