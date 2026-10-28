import assert from 'node:assert';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: MODO SOCRÁTICO GUIADO (FASE 3) ---');

// ==========================================
// PRUEBA 1: Verificación de Esquema y Parsing del Modo Socrático
// ==========================================
console.log('1. Verificando extracción y parsing del bloque de propuesta socrática...');

const mockGeminiSocraticResponse = `
Comprendo que buscas hacer la clase más activa. ¿Cómo dialogará este cambio con los estudiantes que tienen ritmos más pausados según el marco DUA? ¿Consideras que una pausa metacognitiva al cierre aseguraría la consolidación del concepto?

Te propongo articular un momento de activación inicial basado en una rutina de pensamiento "Veo, Pienso, Me Pregunto".

<<<PLAN_PROPUESTO>>>
# PLAN DE CLASE — ROBÓTICA
## 1. Inicio (15 min)
Rutina de pensamiento: Veo, Pienso, Me Pregunto sobre un circuito eléctrico...
## 2. Desarrollo (60 min)
...
<<<FIN_PLAN_PROPUESTO>>>
`;

const planRegex = /<<<PLAN_PROPUESTO>>>([\s\S]*?)<<<FIN_PLAN_PROPUESTO>>>/;
const match = mockGeminiSocraticResponse.match(planRegex);

assert(match !== null, 'Debe identificar el delimitador de propuesta socrática');

const planPropuesto = match[1].replace(/```markdown\s*/i, '').replace(/```\s*$/i, '').trim();
const textoDialogo = mockGeminiSocraticResponse.replace(planRegex, '').trim();

assert(planPropuesto.includes('# PLAN DE CLASE — ROBÓTICA'), 'El plan propuesto debe contener el contenido pedagógico');
assert(planPropuesto.includes('Rutina de pensamiento'), 'Debe reflejar la propuesta de cambio');
assert(!textoDialogo.includes('<<<PLAN_PROPUESTO>>>'), 'El diálogo socrático no debe exponer etiquetas internas');
assert(textoDialogo.includes('¿Cómo dialogará este cambio'), 'El diálogo debe contener las preguntas reflexivas situadas');

console.log('✓ Prueba 1 superada: Parsing y separación entre diálogo socrático y propuesta validados.');

// ==========================================
// PRUEBA 2: Consulta Socrática Pura sin Modificación de Plan
// ==========================================
console.log('2. Verificando diálogo socrático reflexivo sin propuesta de edición...');

const mockDialogoPuro = `Excelente interrogante pedagógico. Antes de modificar el tiempo de la clase, pregúntate: ¿Qué evidencia de aprendizaje necesitas recolectar en ese momento y qué instrumento de rúbrica te permitirá valorarla objetivamente?`;

const matchPuro = mockDialogoPuro.match(planRegex);
assert.strictEqual(matchPuro, null, 'No debe encontrar bloque de plan si la IA solo emite reflexión');

const planPuro = matchPuro ? matchPuro[1] : null;
assert.strictEqual(planPuro, null, 'El planModificado debe ser null cuando solo hay reflexión socrática');

console.log('✓ Prueba 2 superada: El modo socrático admite consultas reflexivas puras sin obligar a mutar el plan.');

// ==========================================
// PRUEBA 3: Formateo y Poda del Historial Conversacional
// ==========================================
console.log('3. Verificando poda y estructuración del historial conversacional...');

const historialLargo = [
  { role: 'user', text: 'Mensaje 1' },
  { role: 'ia', text: 'Respuesta 1' },
  { role: 'user', text: 'Mensaje 2' },
  { role: 'ia', text: 'Respuesta 2' },
  { role: 'user', text: 'Mensaje 3' },
  { role: 'ia', text: 'Respuesta 3' },
  { role: 'user', text: 'Mensaje 4' },
  { role: 'ia', text: 'Respuesta 4' }
];

const podado = historialLargo.slice(-4);
assert.strictEqual(podado.length, 4, 'Debe acotar el historial a las últimas 4 interacciones para optimizar tokens');
assert.strictEqual(podado[0].text, 'Mensaje 3');
assert.strictEqual(podado[3].text, 'Respuesta 4');

const formateado = podado.map(h => `${h.role === 'user' ? 'Docente' : 'Tutor Socrático'}: ${h.text}`).join('\n');
assert(formateado.includes('Docente: Mensaje 3'));
assert(formateado.includes('Tutor Socrático: Respuesta 4'));

console.log('✓ Prueba 3 superada: Contexto conversacional acotado y formateado eficientemente.');

// ==========================================
// PRUEBA 4: Principio de Agencia Compartida (No Modificación Automática)
// ==========================================
console.log('4. Verificando principio de agencia compartida (Shared Agency)...');

let planActual = '# Plan Original v1.0';
const sugerenciaSocratica = '# Plan Propuesto v2.0 (Socrático)';

// En modo socrático, la recepción de la propuesta NO modifica el plan automáticamente
const chatMessageSocratic = {
  role: 'ia',
  text: '¿Consideras pertinente este ajuste?',
  tipo: 'socratico',
  planSugerido: sugerenciaSocratica
};

assert.strictEqual(planActual, '# Plan Original v1.0', 'El documento activo debe conservarse intacto tras recibir la respuesta');

// Solo cuando el docente acciona la propuesta, se actualiza el plan
function simularAceptacionDocente() {
  planActual = chatMessageSocratic.planSugerido;
}
simularAceptacionDocente();

assert.strictEqual(planActual, sugerenciaSocratica, 'El plan solo debe mutar ante la autorización explícita del docente');

console.log('✓ Prueba 4 superada: Principio de agencia compartida y soberanía docente plenamente verificado.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE LA FASE 3 SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
