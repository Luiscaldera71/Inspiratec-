import assert from 'node:assert';
import { 
  normalizeMathSyntax, 
  cleanMathToUnicodeText, 
  formatMathForWeb, 
  formatMathForExport 
} from './mathFormatter.js';
import { formatCurricularMarkdown } from '../services/export/curricularMarkdownFormatter.js';
import { useAppStore, INITIAL_WIZARD_DATA } from '../store/useAppStore.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: PLANIFICADOR & EDITOR ---');

// ==========================================
// PRUEBA 1: Normalización e Interpretación de Matemáticas y Fórmulas
// ==========================================
console.log('1. Verificando renderizado de fórmulas y normalización...');

// A. Operador \times y delimitadores inline
const rawMath1 = 'El área es $A = b \\times h$ y la división es $12 \\div 4 = 3$.';
const webMath1 = formatMathForWeb(rawMath1);
assert(webMath1.includes('katex'), 'Debe generar marcado KaTeX para fórmulas inline');
assert(!webMath1.includes('\\times'), 'No debe exponer sintaxis \\times sin interpretar');

// B. Doble escape de barras invertidas
const rawDoubleEscape = 'Cálculo con barras dobles: $10 \\\\times 5$ y $20 \\\\div 2$.';
const normalized = normalizeMathSyntax(rawDoubleEscape);
assert(!normalized.includes('\\\\times'), 'Debe normalizar barras invertidas duplicadas');

// C. Símbolos matemáticos en texto plano (sin delimitadores $)
const rawPlainTextMath = 'Multiplicar 12 \\times 5 y dividir 50 \\div 2.';
const webPlainTextMath = formatMathForWeb(rawPlainTextMath);
assert(webPlainTextMath.includes('12 × 5'), 'Debe convertir \\times fuera de delimitadores a ×');
assert(webPlainTextMath.includes('50 ÷ 2'), 'Debe convertir \\div fuera de delimitadores a ÷');

// D. Fórmulas complejas en bloque ($$...$$)
const blockMath = '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$';
const webBlockMath = formatMathForWeb(blockMath);
assert(webBlockMath.includes('inspiratec-math-block'), 'Debe envolver ecuaciones centradas en bloque inspiratec');

// E. Conversión limpia para exportaciones (PDF / Word)
const exportMath = formatMathForExport('Ecuación: $a \\times b = c$ y $x \\leq y$');
assert(exportMath.includes('a × b = c'), 'Exportación a PDF/Word debe tener símbolos Unicode limpios');
assert(exportMath.includes('x ≤ y'), 'Exportación a PDF/Word debe convertir \\leq a ≤');
assert(!exportMath.includes('$'), 'Exportación a PDF/Word no debe contener delimitadores $');

console.log('✓ Prueba 1 superada: Tratamiento de fórmulas y símbolos matemáticos validado con éxito.');

// ==========================================
// PRUEBA 2: Separación entre Borrador del Formulario y Documento Generado
// ==========================================
console.log('2. Verificando aislamiento entre borrador y documento cargado...');

const store = useAppStore.getState();

// Guardar progreso en el formulario
store.saveWizardProgress({
  tema: 'Algoritmos y Diagramas de Flujo',
  grado: '8°',
  materia: 'Tecnología e Informática',
  recursos: 'Sala de cómputo y Scratch'
}, 2);

const afterSaveState = useAppStore.getState();
assert.strictEqual(afterSaveState.wizardData.tema, 'Algoritmos y Diagramas de Flujo', 'Debe guardar el progreso del tema');
assert.strictEqual(afterSaveState.wizardStep, 2, 'Debe persistir la fase actual (Fase 2)');
assert(afterSaveState.wizardDraftSavedAt !== null, 'Debe registrar la fecha/hora de guardado del borrador');

// Cargar un documento guardado en el Editor (por ejemplo, desde Mis Planes)
const mockPlanAnterior = {
  id: 'plan_antiguo_123',
  tema: 'Ecosistemas Acuáticos',
  grado: '5°',
  materia: 'Ciencias Naturales',
  recursos: 'Microscopio y muestras de agua'
};
const mockMarkdownAnterior = '# PLAN DE CIENCIAS NATURALES\nContenido de ecosistemas...';

store.loadPlan(mockPlanAnterior, mockMarkdownAnterior, mockPlanAnterior.id);

const stateAfterLoad = useAppStore.getState();

// VERIFICACIÓN CRÍTICA:
// El Editor debe tener el plan cargado
assert.strictEqual(stateAfterLoad.planId, 'plan_antiguo_123', 'Editor debe tener el ID del plan cargado');
assert.strictEqual(stateAfterLoad.planGenerado, mockMarkdownAnterior, 'Editor debe tener el markdown cargado');
assert.strictEqual(stateAfterLoad.activePlanMetadata.tema, 'Ecosistemas Acuáticos', 'Metadatos activos deben reflejar el plan cargado');

// Pero el Formulario del Wizard NO debe haber sido contaminado
assert.strictEqual(stateAfterLoad.wizardData.tema, 'Algoritmos y Diagramas de Flujo', 'El borrador del Wizard debe permanecer intacto');
assert.strictEqual(stateAfterLoad.wizardStep, 2, 'La fase del Wizard debe conservarse');

console.log('✓ Prueba 2 superada: El borrador del formulario y el documento activo están rigurosamente separados.');

// ==========================================
// PRUEBA 3: Persistencia y Generación de Plan Nuevo sin Colisiones
// ==========================================
console.log('3. Verificando generación y ciclo de vida de persistencia...');

// Supongamos que se genera un plan nuevo
const newPlanMetadata = {
  tema: 'Algoritmos y Diagramas de Flujo',
  grado: '8°',
  materia: 'Tecnología e Informática'
};
const newGeneratedMarkdown = '# PLAN DE CLASE — TECNOLOGÍA E INFORMÁTICA\n\n### Identificación\n...';
const newGeneratedPlanId = 'plan_nuevo_999';

// Al completar la persistencia:
store.completePlanGeneration(newGeneratedMarkdown, newPlanMetadata, newGeneratedPlanId);

const stateAfterGen = useAppStore.getState();

// El editor tiene el nuevo plan y su nuevo ID
assert.strictEqual(stateAfterGen.planId, 'plan_nuevo_999', 'El planId debe ser exactamente el nuevo plan persistido');
assert.strictEqual(stateAfterGen.planGenerado, newGeneratedMarkdown, 'El planGenerado debe ser el recién generado');
assert.strictEqual(stateAfterGen.planStatus, 'guardado', 'El estado del plan debe ser guardado');

// El formulario del wizard ha quedado limpio para una nueva planeación
assert.strictEqual(stateAfterGen.wizardData.tema, '', 'El tema en el wizard debe estar vacío');
assert.strictEqual(stateAfterGen.wizardStep, 1, 'La fase del wizard debe volver a 1');
assert.strictEqual(stateAfterGen.wizardDraftSavedAt, null, 'El borrador anterior debe haberse limpiado');

console.log('✓ Prueba 3 superada: Persistencia y limpieza tras generación verificadas.');

// ==========================================
// PRUEBA 4: Creación de dos planes distintos sin sobrescritura
// ==========================================
console.log('4. Verificando creación secuencial de dos planes distintos...');

const plan1Id = 'doc_alpha_1';
const plan2Id = 'doc_beta_2';

store.completePlanGeneration('# Plan 1', { tema: 'Plan 1' }, plan1Id);
assert.strictEqual(useAppStore.getState().planId, plan1Id);

store.completePlanGeneration('# Plan 2', { tema: 'Plan 2' }, plan2Id);
assert.strictEqual(useAppStore.getState().planId, plan2Id);
assert.notStrictEqual(useAppStore.getState().planId, plan1Id, 'El segundo plan no debe conservar el ID anterior');

console.log('✓ Prueba 4 superada: Dos planes sucesivos tienen identificadores independientes.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE ACEPTACIÓN SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
