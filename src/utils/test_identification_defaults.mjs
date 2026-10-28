import assert from 'node:assert';
import fs from 'node:fs';
import { 
  resolveRealIdentification, 
  formatIdentificationMarkdown, 
  injectRealIdentificationIntoPlan,
  DEFAULT_IDENTIFICATION 
} from '../services/templates/identificationResolver.js';

console.log('--- PRUEBAS: IDENTIFICACIÓN SIN DATOS INVENTADOS Y EXCLUSIÓN DE GRUPO/PERIODO ---');

// 1. Sin perfil ni formulario NO se inventa ningún dato
console.log('1. Verificando que no se inventan datos cuando faltan...');
const resDefault = resolveRealIdentification({}, null);
assert.strictEqual(resDefault.institucion, '');
assert.strictEqual(resDefault.docente, '');
assert.strictEqual(resDefault.grado, '');
assert.strictEqual(resDefault.area, '');
assert.strictEqual(resDefault.duracionTexto, '');
assert.strictEqual(DEFAULT_IDENTIFICATION.institucion, '');
assert.strictEqual(resDefault.grupo, undefined);
assert.strictEqual(resDefault.periodo, undefined);
console.log('✓ Prueba 1 superada.');

// 2. El bloque Markdown solo contiene los datos proporcionados
console.log('2. Verificando bloque Markdown solo con datos reales...');
const mdVacio = formatIdentificationMarkdown(resDefault);
assert.strictEqual(mdVacio, '### Identificación');
const mdParcial = formatIdentificationMarkdown({ ...resDefault, docente: 'Ana Pérez', grado: '11mo' });
assert(mdParcial.includes('- **Docente:** Ana Pérez'));
assert(mdParcial.includes('- **Grado:** 11mo'));
assert(!mdParcial.includes('Institución'));
assert(!mdParcial.includes('Grupo') && !mdParcial.includes('Periodo'));
console.log('✓ Prueba 2 superada.');

// 3. Limpieza de residuos de grupo y periodo con datos reales
console.log('3. Verificando limpieza de grupo y periodo...');
const planConResiduos = `
# PLAN DE CLASE

### Identificación
- **Institución:** Colegio X | Sede: Principal
- **Grado y Grupo:** 10° (10-A) — 36 estudiantes
- **Tutor (IE):** Docente Titular | Docente en formación: Docente Planificador
- **Periodo Académico:** Segundo Periodo
- **Fecha de aplicación:** 16 de octubre de 2026 | Duración: 90 minutos, 1 sesión

### B. Fundamentación curricular
- **Objetivo de aprendizaje:** Comprender sistemas de ecuaciones lineales...
`;
const datosReales = { institucion: 'Colegio Real', docente: 'Ana Pérez', grado: '10°', area: 'Matemáticas', duracionTexto: '90 minutos', metodologia: '', recursos: '' };
const planLimpio = injectRealIdentificationIntoPlan(planConResiduos, datosReales);
['Grupo', '10-A', 'Periodo', 'Sede', 'Tutor', 'Docente en formación', 'Fecha de aplicación'].forEach(w => assert(!planLimpio.includes(w), `No debe quedar ${w}`));
assert(planLimpio.includes('- **Institución Educativa:** Colegio Real'));
assert(planLimpio.includes('- **Docente:** Ana Pérez'));
assert(planLimpio.includes('### B. Fundamentación curricular'));
console.log('✓ Prueba 3 superada.');


// 4. Verificación de respeto a datos reales del perfil del usuario cuando están presentes
console.log('4. Verificando que prevalece la información registrada por el usuario si la tiene...');

const userProfileRegistrado = {
  nombre: 'Dra. Carmen Solano',
  institucion: 'Colegio Distrital San José',
  area: 'Física y Matemáticas'
};

const resConPerfil = resolveRealIdentification({ grado: '11mo', duracion: '120 minutos' }, userProfileRegistrado);

assert.strictEqual(resConPerfil.institucion, 'Colegio Distrital San José');
assert.strictEqual(resConPerfil.docente, 'Dra. Carmen Solano');
assert.strictEqual(resConPerfil.area, 'Física y Matemáticas');
assert.strictEqual(resConPerfil.grado, '11mo');
assert(!resConPerfil.duracionTexto.includes('Grupo'));

console.log('✓ Prueba 4 superada: Se respetan los datos del perfil cuando el docente los ha registrado.');

// 5. Verificación de especificidades propias de cada área en genericTemplates
console.log('5. Verificando que cada área conserva su estructura disciplinar propia...');
import { 
  FORMATO_MATEMATICAS, 
  FORMATO_CIENCIAS_NATURALES, 
  FORMATO_CIENCIAS_SOCIALES, 
  FORMATO_INGLES 
} from '../services/templates/genericTemplates.js';

const mockWizardMat = { tema: 'Teorema de Pitágoras', materia: 'Matemáticas', metodologiaSTEAM: 'ABP', recursos: 'Calculadoras y reglas' };
const promptMat = FORMATO_MATEMATICAS.generarPromptInstrucciones(mockWizardMat, null);
assert(promptMat.includes('Pensamiento matemático predominante'), 'Matemáticas debe incluir pensamiento matemático');
assert(promptMat.includes('numérico, espacial, métrico, aleatorio o variacional'), 'Matemáticas debe incluir los tipos de pensamiento');
assert(promptMat.includes('Tema y situación contextual de aprendizaje'), 'Matemáticas debe incluir tema y situación contextual');
assert(promptMat.includes('- **Metodología:** ABP'), 'Matemáticas debe incluir Metodología en identificación');
assert(promptMat.includes('- **Recursos:** Calculadoras y reglas'), 'Matemáticas debe incluir Recursos en identificación');

const mockWizardNat = { tema: 'Ciclo del Agua', materia: 'Ciencias Naturales', metodologiaSTEAM: 'Indagación', recursos: 'Termómetros y recipientes' };
const promptNat = FORMATO_CIENCIAS_NATURALES.generarPromptInstrucciones(mockWizardNat, null);
assert(promptNat.includes('Eje temático o fenómeno por estudiar'), 'Ciencias Naturales debe incluir eje temático o fenómeno');
assert(promptNat.includes('Contexto ambiental, biológico, físico o químico relacionado con la clase'), 'Ciencias Naturales debe incluir contexto ambiental/biológico/físico/químico');
assert(promptNat.includes('- **Metodología:** Indagación'), 'Ciencias Naturales debe incluir Metodología en identificación');

const mockWizardSoc = { tema: 'La Revolución Industrial', materia: 'Ciencias Sociales', metodologiaSTEAM: 'Debate Crítico', recursos: 'Fuentes primarias y mapas' };
const promptSoc = FORMATO_CIENCIAS_SOCIALES.generarPromptInstrucciones(mockWizardSoc, null);
assert(promptSoc.includes('Eje temático y problema de indagación social'), 'Ciencias Sociales debe incluir eje temático y problema de indagación social');
assert(promptSoc.includes('Contexto sociocultural, histórico o geográfico relevante'), 'Ciencias Sociales debe incluir contexto sociocultural, histórico o geográfico relevante');
assert(promptSoc.includes('- **Metodología:** Debate Crítico'), 'Ciencias Sociales debe incluir Metodología en identificación');

const mockWizardIng = { tema: 'Daily Routines', materia: 'Inglés', metodologiaSTEAM: 'Communicative Approach', recursos: 'Flashcards y audios' };
const promptIng = FORMATO_INGLES.generarPromptInstrucciones(mockWizardIng, null);
assert(promptIng.includes('Unidad temática o situación comunicativa'), 'Inglés debe incluir unidad temática o situación comunicativa');
assert(promptIng.includes('Tema y contexto de uso del inglés'), 'Inglés debe incluir tema y contexto de uso del inglés');
assert(promptIng.includes('Nivel MCER esperado'), 'Inglés debe incluir nivel de competencia esperado');
assert(promptIng.includes('- **Metodología:** Communicative Approach'), 'Inglés debe incluir Metodología en identificación');

console.log('✓ Prueba 5 superada: Estructuras y especificidades disciplinares de cada área estrictamente conservadas.');

console.log('\n========================================================================');
console.log('TODAS LAS PRUEBAS DE IDENTIFICACIÓN Y ESTRUCTURAS POR ÁREA PASARON');
console.log('========================================================================\n');
