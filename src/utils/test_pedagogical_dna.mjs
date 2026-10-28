import assert from 'node:assert';
import { 
  DEFAULT_PEDAGOGICAL_DNA, 
  getPedagogicalDna, 
  savePedagogicalDna, 
  formatDnaPromptDirective 
} from '../services/pedagogicalDnaService.js';

console.log('🧪 Iniciando pruebas de ADN Pedagógico & Estudio Transversal...');

// 1. Estructura de defaults
assert(DEFAULT_PEDAGOGICAL_DNA.memoriaExito, 'Debe incluir memoria de éxito');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.metodologiasFrecuentes), 'Metodologías debe ser array');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.memoriaExito.recursosPredilectos), 'Recursos predilectos debe ser array');
assert(DEFAULT_PEDAGOGICAL_DNA.cajaHerramientas, 'Debe incluir caja de herramientas');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.cajaHerramientas.dinamicasInicio), 'Dinámicas de inicio debe ser array');
assert(DEFAULT_PEDAGOGICAL_DNA.matrizTransversalidad, 'Debe incluir matriz de transversalidad');
assert(Array.isArray(DEFAULT_PEDAGOGICAL_DNA.recursosProbados), 'Debe incluir banco de recursos probados');
console.log('✓ Verificación de estructura por defecto completada');

// 2. Directiva para Gemini con ADN activo
const mockDna = {
  cajaHerramientas: {
    dinamicasInicio: ['Dinámicas desconectadas (Unplugged)', 'Pregunta socrática'],
    estilosEvaluacion: ['Rúbrica formativa analítica'],
    enfoquesDuaFavoritos: ['Múltiples formas de representación'],
    notasClave: 'Iniciar siempre con retos manipulables sin pantallas.'
  }
};

const wizardData1 = {
  materia: 'Tecnología e Informática',
  aplicarAdnPedagógico: true,
  esTransversal: false
};

const directive1 = formatDnaPromptDirective(mockDna, wizardData1);
assert(directive1.includes('MEMORIA CONTEXTUAL Y ADN PEDAGÓGICO'), 'Debe incluir encabezado de ADN');
assert(directive1.includes('Dinámicas desconectadas (Unplugged)'), 'Debe incluir dinámicas');
assert(directive1.includes('Iniciar siempre con retos manipulables sin pantallas'), 'Debe incluir notas del docente');
console.log('✓ Directiva de ADN pedagógico generada correctamente');

// 3. Directiva con articulación transversal
const wizardData2 = {
  materia: 'Tecnología e Informática',
  aplicarAdnPedagógico: true,
  esTransversal: true,
  ejeTransversal: 'Educación Ambiental y Sostenibilidad (PRAE)',
  areaSecundaria: 'Ciencias Naturales',
  retoContextual: '¿Cómo medir la calidad del aire escolar usando sensores y tablas de dispersión?'
};

const directive2 = formatDnaPromptDirective(mockDna, wizardData2);
assert(directive2.includes('ESTUDIO Y ARTICULACIÓN TRANSVERSAL INTERDISCIPLINAR'), 'Debe incluir sección transversal');
assert(directive2.includes('Educación Ambiental y Sostenibilidad (PRAE)'), 'Debe incluir eje PRAE');
assert(directive2.includes('Ciencias Naturales'), 'Debe incluir área secundaria');
assert(directive2.includes('¿Cómo medir la calidad del aire escolar usando sensores y tablas de dispersión?'), 'Debe incluir reto del entorno');
console.log('✓ Directiva transversal interdisciplinar generada correctamente');

// 4. Si aplicarAdnPedagógico es false, la directiva no debe generarse
const wizardData3 = {
  materia: 'Matemáticas',
  aplicarAdnPedagógico: false
};
const directive3 = formatDnaPromptDirective(mockDna, wizardData3);
assert.strictEqual(directive3, '', 'No debe generar directiva si aplicarAdnPedagógico es false');
console.log('✓ Interruptor de ADN respetado cuando está inactivo');

console.log('🎉 Todas las pruebas del ADN Pedagógico pasaron exitosamente.');
