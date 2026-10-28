import { getForoMessages, addForoMessage, addForoReply, deleteForoMessage, getLocalForoMessages } from '../services/dbService.js';

// Polyfill minimal localStorage for Node environment testing
if (typeof globalThis.localStorage === 'undefined') {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, val) => storage.set(key, String(val)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear()
  };
}

async function runForoAcceptanceTests() {
  console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: REDISEÑO DEL FORO DOCENTE ---');

  // Prueba 1: Carga y normalización de discusiones
  console.log('1. Verificando carga y normalización de discusiones...');
  const initialMessages = await getForoMessages();
  if (!Array.isArray(initialMessages) || initialMessages.length === 0) {
    throw new Error('FALLO: No se cargaron las discusiones del foro.');
  }

  const first = initialMessages[0];
  if (!first.titulo || !first.categoria || !first.texto || !Array.isArray(first.respuestas)) {
    throw new Error('FALLO: El mensaje no contiene la estructura normalizada requerida (titulo, categoria, texto, respuestas).');
  }
  console.log(`✓ Prueba 1 superada: Se cargaron ${initialMessages.length} discusiones con estructura completa.`);

  // Prueba 2: Creación de nueva discusión
  console.log('2. Verificando creación y persistencia de una nueva discusión...');
  const testPayload = {
    titulo: 'Discusión de prueba automatizada sobre Robótica Educativa',
    categoria: 'Tecnología educativa',
    texto: '¿Cómo evalúan el trabajo colaborativo en proyectos de programación por bloques?',
    etiquetas: ['Robótica', 'Programación', 'Evaluación'],
    destacado: false
  };

  const newId = await addForoMessage('test_docente_99', 'Profesor de Prueba', 'Docente', testPayload);
  if (!newId) {
    throw new Error('FALLO: No se retornó un ID al crear la discusión.');
  }

  const updatedMessages = await getForoMessages();
  const createdMsg = updatedMessages.find(m => m.id === newId);
  if (!createdMsg) {
    throw new Error('FALLO: La discusión creada no se encuentra en la lista persistida.');
  }
  if (createdMsg.titulo !== testPayload.titulo || createdMsg.categoria !== testPayload.categoria) {
    throw new Error('FALLO: Los metadatos de la discusión creada no coinciden.');
  }
  console.log(`✓ Prueba 2 superada: Discusión "${createdMsg.titulo}" creada y persistida con ID ${newId}.`);

  // Prueba 3: Publicación de respuesta a la discusión
  console.log('3. Verificando publicación de respuesta...');
  const replyObj = await addForoReply(
    newId, 
    'test_docente_100', 
    'Colega Validador', 
    'Docente', 
    'Utilizamos rúbricas coevaluativas con matrices de roles definidos.'
  );

  if (!replyObj || !replyObj.texto || replyObj.nombre !== 'Colega Validador') {
    throw new Error('FALLO: La respuesta no se generó adecuadamente.');
  }

  const messagesAfterReply = await getForoMessages();
  const msgWithReply = messagesAfterReply.find(m => m.id === newId);
  if (!msgWithReply || msgWithReply.respuestas.length === 0) {
    throw new Error('FALLO: La respuesta no se reflejó en las respuestas de la discusión.');
  }
  console.log(`✓ Prueba 3 superada: Respuesta registrada exitosamente (${msgWithReply.respuestas.length} aportes en la discusión).`);

  // Prueba 4: Eliminación de discusión
  console.log('4. Verificando eliminación de discusión...');
  await deleteForoMessage(newId);
  const messagesAfterDelete = await getForoMessages();
  const deletedStillExists = messagesAfterDelete.some(m => m.id === newId);
  if (deletedStillExists) {
    throw new Error('FALLO: La discusión eliminada aún permanece en la lista.');
  }
  console.log('✓ Prueba 4 superada: Discusión eliminada satisfactoriamente.');

  console.log('\n======================================================');
  console.log('TODAS LAS PRUEBAS DE ACEPTACIÓN DEL FORO FUERON EXITOSAS');
  console.log('======================================================\n');
  process.exit(0);
}

runForoAcceptanceTests().catch(err => {
  console.error('ERROR EN PRUEBAS:', err);
  process.exit(1);
});
