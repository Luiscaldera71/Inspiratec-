/**
 * geminiClient.js
 * Cliente de Google Gemini: usa la clave personal de cada docente (Google AI Studio).
 * Sin dependencias de la aplicacion para poder probarlo de forma aislada.
 */

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GENERATION_TIMEOUT_MS = 120000; // una generación larga (plan, recurso HTML) puede tardar
const CHECK_TIMEOUT_MS = 20000;       // validar la clave debe responder rápido

// Modelos de respaldo si Google no devuelve la lista de la cuenta
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];

let activeWorkingModel = null;
const modelsByKey = new Map();

/** Error cuyo motivo no mejora probando otro modelo (clave inválida, sin permisos, sin red). */
export const fatalError = (message) => Object.assign(new Error(message), { fatal: true });

/** fetch con límite de tiempo y mensajes claros: nunca se queda esperando para siempre. */
async function fetchWithTimeout(url, options = {}, timeoutMs = GENERATION_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw fatalError(`Google no respondió en ${Math.round(timeoutMs / 1000)} segundos. Revisa tu conexión a internet e inténtalo de nuevo.`);
    }
    throw fatalError('No hay conexión con Google. Revisa tu internet, la VPN, el antivirus o el bloqueador de anuncios (generativelanguage.googleapis.com debe estar permitido).');
  } finally {
    clearTimeout(timer);
  }
}

const headersFor = (apiKey) => ({ 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() });

/** Traduce los errores de autenticación de Google a un mensaje que el docente entienda. */
function authError(status, apiMsg = '') {
  if (status === 401) {
    return fatalError('Google rechazó la clave (401): está desactivada, vencida o es de un tipo no admitido. Crea una clave nueva en Google AI Studio (debe empezar por "AIza").');
  }
  if (status === 400 && /API[_ ]KEY/i.test(apiMsg)) {
    return fatalError('La clave no es válida. Cópiala de nuevo desde Google AI Studio, completa y sin espacios.');
  }
  if (status === 403) {
    return fatalError(`Google negó el permiso (403). ${/location|region|country/i.test(apiMsg) ? 'El servicio no está disponible en tu país o red.' : 'La clave tiene restricciones o la API de Gemini no está habilitada para ella.'}`);
  }
  return null;
}

async function readJson(response) {
  try { return await response.json(); } catch { return {}; }
}

/**
 * Pide a Google los modelos que esta clave puede usar, para no depender de nombres fijos.
 * Si la clave es inválida lanza un error claro; si la lista no se puede leer usa el respaldo.
 */
export async function listUsableModels(apiKey) {
  const key = apiKey.trim();
  if (modelsByKey.has(key)) return modelsByKey.get(key);

  const response = await fetchWithTimeout(`${API_BASE}/models?pageSize=200`, { headers: headersFor(key) }, CHECK_TIMEOUT_MS);
  const data = await readJson(response);
  if (!response.ok) {
    const msg = data?.error?.message || `Error HTTP ${response.status}`;
    const auth = authError(response.status, msg);
    if (auth) throw auth;
    return FALLBACK_MODELS; // error temporal del listado: se intenta con los modelos de respaldo
  }

  const names = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => String(m.name || '').replace(/^models\//, ''))
    .filter(n => /^gemini-/.test(n) && /flash/.test(n) && !/image|tts|live|audio|robotics|computer|embedding|learnlm/i.test(n));

  // El alias "latest" primero; luego versiones nuevas antes que antiguas
  const ordered = [
    ...names.filter(n => /latest/.test(n)),
    ...names.filter(n => !/latest/.test(n)).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  ];
  const result = ordered.length ? ordered : FALLBACK_MODELS;
  modelsByKey.set(key, result);
  return result;
}

/**
 * Llamada centralizada a la API de Gemini.
 * Descubre los modelos de la cuenta, reintenta ante saturación (503/429) y pasa al siguiente
 * modelo si uno falla. Los errores de clave o de red se informan de inmediato.
 */
export const callGeminiApi = async (apiKey, requestBody, maxRetriesPerModel = 2, timeoutMs = GENERATION_TIMEOUT_MS) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  const available = await listUsableModels(apiKey);
  const modelsToTry = activeWorkingModel && available.includes(activeWorkingModel)
    ? [activeWorkingModel, ...available.filter(m => m !== activeWorkingModel)]
    : available;

  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const response = await fetchWithTimeout(
          `${API_BASE}/models/${model}:generateContent`,
          { method: 'POST', headers: headersFor(apiKey), body: JSON.stringify(requestBody) },
          timeoutMs
        );

        // Modelo inexistente para esta cuenta: se prueba el siguiente
        if (response.status === 404) break;

        // Saturación o límite de uso: se reintenta y luego se cambia de modelo
        if (response.status === 503 || response.status === 429) {
          const data = await readJson(response);
          lastError = new Error(response.status === 429
            ? 'Se alcanzó el límite de uso gratuito de tu clave. Espera unos minutos e inténtalo de nuevo.'
            : (data?.error?.message || 'El servicio de Google está saturado.'));
          if (attempt < maxRetriesPerModel - 1) {
            await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
            continue;
          }
          break;
        }

        const data = await readJson(response);

        if (!response.ok) {
          const apiMsg = data?.error?.message || `Error HTTP ${response.status}`;
          const auth = authError(response.status, apiMsg);
          if (auth) throw auth;
          lastError = new Error(apiMsg);
          break;
        }

        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.map(p => p.text || '').join('') || '';
        if (text) {
          activeWorkingModel = model;
          return text;
        }

        if (data.promptFeedback?.blockReason) {
          throw fatalError(`El contenido fue bloqueado por políticas de seguridad: ${data.promptFeedback.blockReason}`);
        }

        lastError = new Error(candidate?.finishReason === 'MAX_TOKENS'
          ? 'La respuesta se cortó antes de terminar.'
          : 'El modelo no devolvió texto.');
      } catch (err) {
        if (err.fatal) throw err;
        lastError = err;
        if (attempt < maxRetriesPerModel - 1) await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  throw new Error(`Error en el servicio de IA: ${lastError?.message || 'No fue posible conectar con ningún modelo de Gemini.'}`);
};

/**
 * Valida la clave del docente: 1) pregunta a Google qué modelos puede usar (rápido y sin gastar
 * cuota) y 2) hace una consulta mínima. Siempre termina y explica el motivo si falla.
 * @returns {Promise<{ ok: boolean, message: string, warning?: string }>}
 */
export const testApiConnection = async (apiKey) => {
  const key = String(apiKey || '').trim();
  if (!key) return { ok: false, message: 'Escribe tu clave de API de Gemini.' };
  modelsByKey.delete(key);

  try {
    await listUsableModels(key);
  } catch (error) {
    return { ok: false, message: error.message };
  }

  try {
    const text = await callGeminiApi(key, {
      contents: [{ parts: [{ text: 'Responde únicamente con: OK' }] }],
      generationConfig: { maxOutputTokens: 512 }
    }, 1, CHECK_TIMEOUT_MS);
    return text ? { ok: true, message: 'La clave es válida y la IA respondió.' } : { ok: false, message: 'La IA no respondió.' };
  } catch (error) {
    if (error.fatal) return { ok: false, message: error.message };
    // La clave es válida pero la prueba falló por saturación o límite de uso: se permite guardarla
    return { ok: true, message: 'La clave es válida.', warning: error.message };
  }
};
