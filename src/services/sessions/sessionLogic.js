/**
 * sessionLogic.js
 * Lógica pura (sin Firebase ni DOM) de las sesiones en vivo: evaluaciones y clases que los
 * estudiantes abren desde el celular con un código QR. Al ser pura se puede probar en Node.
 */

// Sin caracteres que se confundan (0/O, 1/I/L)
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateSessionCode(length = 6, rnd = Math.random) {
  let out = '';
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[Math.floor(rnd() * CODE_ALPHABET.length)];
  return out;
}

export const normalizeCode = (code = '') => String(code).toUpperCase().replace(/[^A-Z0-9]/g, '');

export function buildJoinUrl(baseUrl = '', code = '') {
  const base = String(baseUrl).trim().replace(/\/+$/, '');
  return `${base}/s/${normalizeCode(code)}`;
}

/** Un celular no puede abrir "localhost": se avisa al docente para que use la dirección pública. */
export const isLocalOnlyUrl = (url = '') => /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(String(url).trim());

export const QUESTION_TYPES = ['opcion', 'vf', 'abierta'];

const asText = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Valida y normaliza preguntas (manuales o generadas por IA).
 * Devuelve las preguntas SIN la respuesta correcta y la clave por separado: a los estudiantes
 * solo se les publican las preguntas.
 */
export function normalizeQuestions(raw = []) {
  const preguntas = [];
  const clave = {};
  (Array.isArray(raw) ? raw : []).forEach((q, i) => {
    const enunciado = asText(q?.enunciado || q?.pregunta);
    if (!enunciado) return;
    const tipo = QUESTION_TYPES.includes(q?.tipo) ? q.tipo : 'opcion';
    const id = asText(q?.id) || `q${i + 1}`;
    const puntos = Math.max(1, Math.min(20, parseInt(q?.puntos, 10) || 1));

    if (tipo === 'vf') {
      if (typeof q.correcta !== 'boolean') return;
      preguntas.push({ id, tipo, enunciado, opciones: ['Verdadero', 'Falso'], puntos });
      clave[id] = q.correcta ? 0 : 1;
    } else if (tipo === 'opcion') {
      const opciones = (Array.isArray(q.opciones) ? q.opciones : []).map(asText).filter(Boolean);
      if (opciones.length < 2 || !Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta >= opciones.length) return;
      preguntas.push({ id, tipo, enunciado, opciones, puntos });
      clave[id] = q.correcta;
    } else {
      preguntas.push({ id, tipo, enunciado, opciones: [], puntos });
      if (asText(q.criterio)) clave[id] = asText(q.criterio);
    }
  });
  if (preguntas.length === 0) throw new Error('La evaluación necesita al menos una pregunta válida.');
  return { preguntas, clave };
}

/**
 * Califica las respuestas de un estudiante. Las preguntas abiertas no se califican solas:
 * quedan como "pendientes" para revisión del docente.
 */
export function gradeSubmission(preguntas = [], clave = {}, respuestas = {}) {
  let puntaje = 0;
  let maximo = 0;
  const detalle = [];
  const pendientes = [];

  preguntas.forEach((q) => {
    const dada = respuestas?.[q.id];
    if (q.tipo === 'abierta') {
      pendientes.push(q.id);
      detalle.push({ id: q.id, correcta: null, esperada: clave?.[q.id] ?? null, dada: dada ?? null });
      return;
    }
    maximo += q.puntos;
    const correcta = dada !== undefined && dada !== null && dada === clave?.[q.id];
    if (correcta) puntaje += q.puntos;
    detalle.push({ id: q.id, correcta, esperada: clave?.[q.id], dada: dada ?? null });
  });

  const porcentaje = maximo > 0 ? Math.round((puntaje / maximo) * 100) : 0;
  return { puntaje, maximo, porcentaje, nota: Math.round(porcentaje / 100 * 50) / 10, detalle, pendientes };
}

/** Resume las salidas de pestaña reportadas por el estudiante. */
export function summarizeLeaves(eventos = []) {
  const salidas = eventos.filter(e => e?.tipo === 'salio').length;
  const msFuera = eventos.reduce((acc, e) => acc + (e?.tipo === 'volvio' ? (e.duracionMs || 0) : 0), 0);
  return { salidas, msFuera };
}

/** Decide qué hacer según el número de salidas: 'ok' | 'advertir' | 'bloquear'. */
export function evaluateLeavePolicy(salidas = 0, maxSalidas = 3) {
  if (maxSalidas > 0 && salidas >= maxSalidas) return 'bloquear';
  return salidas > 0 ? 'advertir' : 'ok';
}

// ---------- Orden aleatorio estable por estudiante ----------
function hashSeed(str) {
  let h = 1779033703 ^ String(str).length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, seed) {
  const rnd = mulberry32(hashSeed(seed));
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Vista de la evaluación para un estudiante. Si se baraja, el orden de preguntas y opciones es
 * distinto por estudiante pero estable si recarga. Cada opción conserva su índice original.
 */
export function buildExamView(preguntas = [], seed = '', barajar = true) {
  const ordered = barajar ? seededShuffle(preguntas, `${seed}:q`) : preguntas.slice();
  return ordered.map((q) => {
    const base = q.opciones.map((texto, idx) => ({ texto, idx }));
    // Verdadero/Falso conserva su orden natural
    const opcionesView = barajar && q.tipo === 'opcion' ? seededShuffle(base, `${seed}:${q.id}`) : base;
    return { ...q, opcionesView };
  });
}

/** CSV de resultados para el docente. */
export function buildResultsCsv(preguntas = [], clave = {}, participantes = []) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = ['Estudiante', 'Estado', 'Aciertos (puntos)', 'Máximo', 'Porcentaje', 'Nota (0-5)', 'Salidas de pestaña', 'Segundos fuera', 'Preguntas abiertas pendientes'];
  const rows = participantes.map((p) => {
    const g = gradeSubmission(preguntas, clave, p.respuestas || {});
    const { salidas, msFuera } = summarizeLeaves(p.eventos || []);
    return [p.nombre, p.estado, g.puntaje, g.maximo, `${g.porcentaje}%`, g.nota, Math.max(salidas, p.salidas || 0), Math.round(msFuera / 1000), g.pendientes.length];
  });
  return [head, ...rows].map(r => r.map(esc).join(',')).join('\n');
}
