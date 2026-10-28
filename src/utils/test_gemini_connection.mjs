import assert from 'node:assert';
import { callGeminiApi, testApiConnection } from '../services/geminiClient.js';

console.log('--- PRUEBAS: VALIDACIÓN DE LA CLAVE DE GEMINI (respuestas simuladas de Google) ---');

const json = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });
const MODELS = { models: [
  { name: 'models/gemini-flash-latest', supportedGenerationMethods: ['generateContent'] },
  { name: 'models/gemini-2.5-flash', supportedGenerationMethods: ['generateContent'] },
  { name: 'models/gemini-2.5-flash-image', supportedGenerationMethods: ['generateContent'] },
  { name: 'models/text-embedding-004', supportedGenerationMethods: ['embedContent'] }
] };
const OK_TEXT = { candidates: [{ content: { parts: [{ text: 'OK' }] } }] };
let calls = [];
const setFetch = (handler) => { calls = []; globalThis.fetch = async (url, opts) => { calls.push({ url, opts }); return handler(String(url), opts); }; };
const isList = (u) => u.includes('/models?');

// 1. Clave válida: lista de modelos + respuesta de la IA; la clave viaja en la cabecera, no en la URL
setFetch((u) => (isList(u) ? json(200, MODELS) : json(200, OK_TEXT)));
let r = await testApiConnection('AIzaGOOD1');
assert.deepStrictEqual({ ok: r.ok, warning: r.warning }, { ok: true, warning: undefined });
assert(calls.every(c => !c.url.includes('AIzaGOOD1')), 'La clave no debe ir en la URL');
assert(calls.every(c => c.opts.headers['x-goog-api-key'] === 'AIzaGOOD1'));
assert(calls.some(c => c.url.includes('gemini-flash-latest:generateContent')), 'Usa un modelo descubierto de la cuenta');
assert(!calls.some(c => /image/.test(c.url)), 'Excluye modelos de imagen');
console.log('✓ 1. Clave válida.');

// 2. Clave inválida (400) y revocada (401): mensaje claro, un solo intento
for (const [status, body, esperado] of [
  [400, { error: { message: 'API key not valid. Please pass a valid API key.' } }, /no es válida/],
  [401, { error: { message: 'API keys are not supported' } }, /rechazó la clave/]
]) {
  setFetch(() => json(status, body));
  r = await testApiConnection('AQ.malaclave');
  assert.strictEqual(r.ok, false);
  assert.match(r.message, esperado);
  assert.strictEqual(calls.length, 1, 'No se insiste con otros modelos si la clave es inválida');
}
console.log('✓ 2. Clave inválida o revocada.');

// 3. Sin internet / bloqueo de red: termina y lo explica
setFetch(() => { throw new TypeError('Failed to fetch'); });
r = await testApiConnection('AIzaNET');
assert.strictEqual(r.ok, false);
assert.match(r.message, /No hay conexión con Google/);
console.log('✓ 3. Sin conexión.');

// 4. Google no responde a tiempo (AbortError): no se queda "validando"
setFetch(() => { const e = new Error('aborted'); e.name = 'AbortError'; throw e; });
r = await testApiConnection('AIzaSLOW');
assert.strictEqual(r.ok, false);
assert.match(r.message, /no respondió/);
console.log('✓ 4. Tiempo de espera.');

// 5. Clave válida pero límite de uso (429): se permite guardar y se avisa
setFetch((u) => (isList(u) ? json(200, MODELS) : json(429, { error: { message: 'quota' } })));
r = await testApiConnection('AIzaQUOTA');
assert.strictEqual(r.ok, true);
assert.match(r.warning, /límite de uso/);
console.log('✓ 5. Límite de uso: clave válida con aviso.');

// 6. Modelo "pensante" que gasta los tokens y no devuelve texto: pasa al siguiente modelo
setFetch((u) => {
  if (isList(u)) return json(200, MODELS);
  if (u.includes('gemini-flash-latest')) return json(200, { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ thought: true }] } }] });
  return json(200, OK_TEXT);
});
r = await testApiConnection('AIzaTHINK');
assert.strictEqual(r.ok, true);
assert.strictEqual(r.warning, undefined);
console.log('✓ 6. Respuesta sin texto: usa otro modelo.');

// 7. callGeminiApi sin clave
await assert.rejects(() => callGeminiApi('', {}), /API Key no configurada/);
console.log('✓ 7. Sin clave.');

console.log('\nTODAS LAS PRUEBAS DE LA CLAVE DE GEMINI PASARON');
