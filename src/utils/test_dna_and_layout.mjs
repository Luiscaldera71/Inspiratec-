import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getPedagogicalDna, 
  savePedagogicalDna, 
  autoSyncDnaFromHistory, 
  addRecursoProbado,
  removeRecursoProbado,
  DEFAULT_PEDAGOGICAL_DNA 
} from '../services/pedagogicalDnaService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log('--- INICIO DE PRUEBAS: ADN PEDAGÓGICO, SINCRONIZACIÓN Y LAYOUT SIN SOLAPAMIENTOS ---');

  // Test 1: Comprobar defaults y lectura
  console.log('1. Verificando lectura y estructura base de ADN pedagógico...');
  const dnaDefault = await getPedagogicalDna('usuario_test_docente');
  assert(dnaDefault !== null, 'El ADN no debe ser nulo');
  assert(dnaDefault.memoriaExito, 'Debe incluir memoria de éxito');
  assert(dnaDefault.cajaHerramientas, 'Debe incluir caja de herramientas');
  assert(dnaDefault.matrizTransversalidad, 'Debe incluir matriz de transversalidad');
  assert(Array.isArray(dnaDefault.recursosProbados), 'Recursos probados debe ser un arreglo');
  console.log('✓ Prueba 1 superada: Estructura base validada con éxito.');

  // Test 2: Guardado para docente y administrador
  console.log('2. Verificando guardado para docente y administrador...');
  const modifiedDna = {
    ...dnaDefault,
    cajaHerramientas: {
      ...dnaDefault.cajaHerramientas,
      notasClave: 'Nota de prueba docente y admin'
    }
  };
  const savedDocente = await savePedagogicalDna('usuario_test_docente', modifiedDna, false);
  assert.strictEqual(savedDocente.cajaHerramientas.notasClave, 'Nota de prueba docente y admin');

  // Guardado como institucional para administrador
  const savedAdmin = await savePedagogicalDna('admin_uid_123', modifiedDna, true);
  assert(savedAdmin !== null, 'El guardado institucional para admin debe ejecutarse');
  console.log('✓ Prueba 2 superada: Guardado dual (Docente + Admin Institucional) verificado.');

  // Test 3: Gestión de Recursos Probados
  console.log('3. Verificando adición y remoción de recursos probados...');
  const added = await addRecursoProbado('usuario_test_docente', {
    title: 'Sopa de letras matemática con temporizador',
    type: 'sopa',
    engagement: 5,
    notaDocente: 'Muy motivante en clase'
  });
  const found = added.recursosProbados.find(r => r.title === 'Sopa de letras matemática con temporizador');
  assert(found, 'El recurso debe haberse agregado a recursosProbados');
  assert.strictEqual(found.engagement, 5);

  const removed = await removeRecursoProbado('usuario_test_docente', found.id);
  const stillExists = removed.recursosProbados.some(r => r.id === found.id);
  assert(!stillExists, 'El recurso debe haberse eliminado correctamente');
  console.log('✓ Prueba 3 superada: Ciclo de vida de Recursos Probados validado.');

  // Test 4: Comprobar CSS del Editor (Eliminación de position: fixed invasivo y adición de flex)
  console.log('4. Verificando que index.css previene solapamiento entre el editor y el chatbot...');
  const css = fs.readFileSync(path.resolve(__dirname, '../index.css'), 'utf8');
  
  // Asegurarse de que el chat base no tenga position: fixed !important
  const chatBaseSnippet = css.match(/\.editor-chat-pane\s*\{[\s\S]*?\}/);
  assert(chatBaseSnippet, 'Debe existir .editor-chat-pane');
  assert(!chatBaseSnippet[0].includes('position: fixed !important'), 'El chat base no debe tener position: fixed !important');

  // Asegurarse de que en desktop el workspace sea display: flex y el chat sea position: sticky
  const hasWorkspaceFlex = /\.editor-workspace\s*\{[\s\S]*?display:\s*flex\s*!important;[\s\S]*?flex-direction:\s*row\s*!important;/.test(css);
  assert(hasWorkspaceFlex, 'El workspace debe ser display: flex en desktop');
  
  assert(css.includes('position: sticky !important;'), 'El chat debe ser position: sticky en desktop');
  assert(css.includes('.adn-hero-card'), 'Deben existir los estilos para Mi ADN Pedagógico');
  console.log('✓ Prueba 4 superada: Layout CSS del Editor y estilos de ADN confirmados sin solapamientos.');

  // Test 5: Comprobar que AdministracionPage tiene enlace a ADN Pedagógico
  console.log('5. Verificando integración en el panel de Administración...');
  const adminPageCode = fs.readFileSync(path.resolve(__dirname, '../pages/AdministracionPage.jsx'), 'utf8');
  assert(adminPageCode.includes('/adn-pedagogico'), 'AdministracionPage debe contener enlace a /adn-pedagogico');
  assert(adminPageCode.includes('Identidad & ADN Pedagógico'), 'Debe tener el texto de navegación');
  console.log('✓ Prueba 5 superada: El Administrador tiene acceso directo a ADN Pedagógico.');

  console.log('\n======================================================');
  console.log('TODAS LAS PRUEBAS DE ADN PEDAGÓGICO Y LAYOUT PASARON CON ÉXITO');
  console.log('======================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('FALLO EN TEST:', err);
  process.exit(1);
});
