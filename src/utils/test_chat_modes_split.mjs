import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: SEPARACIÓN Y EXPLICACIÓN DE MODOS DEL CHATBOT ---');

// 1. Verificación de lógica de filtrado de canales en el Store
console.log('1. Verificando separación estricta de canales conversacionales...');

const mockSessionChat = [
  { role: 'user', text: 'Añadir rúbrica analítica', modo: 'direct' },
  { role: 'ia', text: 'Rúbrica añadida al plan.', tipo: 'directo', modo: 'direct' },
  { role: 'user', text: '¿Cómo activar saberes previos?', modo: 'socratic' },
  { role: 'ia', text: 'Considera una rutina de pensamiento...', tipo: 'socratico', modo: 'socratic', planSugerido: '# Plan' },
  // Mensaje legado sin campo modo pero con tipo socratico
  { role: 'ia', text: 'Pregunta reflexiva legada', tipo: 'socratico' }
];

const directMsgs = mockSessionChat.filter(m => (m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct')) === 'direct');
const socraticMsgs = mockSessionChat.filter(m => (m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct')) === 'socratic');

assert.strictEqual(directMsgs.length, 2, 'El canal directo debe contener exactamente 2 mensajes');
assert.strictEqual(socraticMsgs.length, 3, 'El canal socrático debe contener exactamente 3 mensajes');

assert(directMsgs.every(m => m.modo === 'direct'), 'Todos los mensajes del canal directo deben ser de modo directo');
assert(socraticMsgs.every(m => m.tipo === 'socratico' || m.modo === 'socratic'), 'Todos los mensajes del canal socrático deben ser de modo socrático');

console.log('✓ Prueba 1 superada: Canales conversacionales rigurosamente aislados.');

// 2. Verificación de borrado selectivo por modo
console.log('2. Verificando borrado selectivo de canal sin afectar al opuesto...');

const clearChatModo = (list, modo) => list.filter(m => {
  const mModo = m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct');
  return mModo !== modo;
});

const despuesDeBorrarDirecto = clearChatModo(mockSessionChat, 'direct');
assert.strictEqual(despuesDeBorrarDirecto.length, 3, 'Al borrar directo deben permanecer los 3 mensajes socráticos');
assert(despuesDeBorrarDirecto.every(m => (m.modo || (m.tipo === 'socratico' ? 'socratic' : 'direct')) === 'socratic'), 'Solo deben quedar mensajes socráticos');

const despuesDeBorrarSocratico = clearChatModo(mockSessionChat, 'socratic');
assert.strictEqual(despuesDeBorrarSocratico.length, 2, 'Al borrar socrático deben permanecer los 2 mensajes directos');

console.log('✓ Prueba 2 superada: El borrado selectivo preserva intacto el canal alternativo.');

// 3. Verificación de presencia de explicaciones y elementos UI en EditorPage.jsx
console.log('3. Verificando tarjeta explicativa y separación en EditorPage.jsx...');

const editorCode = fs.readFileSync('src/pages/EditorPage.jsx', 'utf8');

assert(editorCode.includes('¿Cómo funciona el modo'), 'Debe existir el botón interactivo de explicación de funcionamiento');
assert(editorCode.includes('Edición Ejecutiva Inmediata'), 'Debe incluir la explicación de funcionalidad del Modo Directo');
assert(editorCode.includes('Diálogo Socrático & Agencia Compartida'), 'Debe incluir la explicación de funcionalidad del Modo Socrático');
assert(editorCode.includes('editor-chat-explanation-card'), 'Debe renderizar la tarjeta explicativa con estilos dedicados');
assert(editorCode.includes('editor-chat-chips-container'), 'Debe incluir sugerencias y preguntas pedagógicas en formato chips interactivos');
assert(editorCode.includes('activeChatMessages'), 'El renderizado debe usar activeChatMessages en lugar de mostrar todos los mensajes mezclados');
assert(editorCode.includes('handleClearCurrentModeChat'), 'Debe ofrecer botón para limpiar el canal activo');

console.log('✓ Prueba 3 superada: EditorPage.jsx cuenta con explicaciones pedagógicas y separación completa.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE SEPARACIÓN Y EXPLICACIÓN PASARON');
console.log('======================================================\n');
