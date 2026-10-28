/**
 * sessionService.js
 * Sesiones en vivo en Firestore: evaluaciones y clases que los estudiantes abren con un QR.
 *
 * Estructura:
 *   sesiones/{CODIGO}                       preguntas SIN respuesta, config, contenido de la clase
 *   sesiones/{CODIGO}/claves/clave          respuestas correctas (solo lee el docente dueño)
 *   sesiones/{CODIGO}/participantes/{pid}   un documento por estudiante: respuestas, salidas, eventos
 *
 * No hay datos de respaldo locales: una sesión compartida entre dispositivos solo existe si Firestore
 * responde. Si falla, se informa el error en vez de simular.
 */
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, collection, query, where,
  onSnapshot, serverTimestamp, arrayUnion, increment
} from 'firebase/firestore';
import { db } from '../../firebase';
import { generateSessionCode, normalizeCode } from './sessionLogic';

const MAX_DOC_BYTES = 900000; // Firestore admite 1 MiB por documento

const sessionRef = (code) => doc(db, 'sesiones', normalizeCode(code));
const keyRef = (code) => doc(db, 'sesiones', normalizeCode(code), 'claves', 'clave');
const partRef = (code, pid) => doc(db, 'sesiones', normalizeCode(code), 'participantes', pid);

const explain = (error, action) => {
  const msg = error?.code === 'permission-denied'
    ? 'Firestore rechazó la operación: publica las reglas de seguridad actualizadas (firebase deploy --only firestore:rules).'
    : (error?.message || 'Error desconocido');
  return new Error(`No se pudo ${action}. ${msg}`);
};

// ----------------------------------------------------------------- Docente

export async function createSession({
  ownerId, tipo, titulo, planTema = '', planId = null, config = {}, preguntas = [], clave = {},
  contenido = '', recursos = []
}) {
  if (!ownerId) throw new Error('Inicia sesión para crear una sesión.');

  const payload = {
    ownerId,
    tipo,
    titulo,
    planTema,
    planId,
    estado: 'abierta',
    config,
    preguntas,
    contenido,
    recursos,
    activo: { tipo: 'plan', id: null },
    creadaEn: serverTimestamp(),
    cerradaEn: null
  };
  if (JSON.stringify(payload).length > MAX_DOC_BYTES) {
    throw new Error('El contenido es demasiado grande para compartirlo. Comparte menos recursos a la vez.');
  }

  try {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const candidate = generateSessionCode();
      if (!(await getDoc(sessionRef(candidate))).exists()) { code = candidate; break; }
    }
    if (!code) throw new Error('No se pudo generar un código único. Inténtalo de nuevo.');

    await setDoc(sessionRef(code), payload);
    if (tipo === 'evaluacion') await setDoc(keyRef(code), { ownerId, respuestas: clave });
    return code;
  } catch (e) {
    throw explain(e, 'crear la sesión');
  }
}

export async function getSession(code) {
  try {
    const snap = await getDoc(sessionRef(code));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (e) {
    throw explain(e, 'abrir la sesión');
  }
}

export async function getSessionKey(code) {
  try {
    const snap = await getDoc(keyRef(code));
    return snap.exists() ? (snap.data().respuestas || {}) : {};
  } catch (e) {
    throw explain(e, 'leer la clave de respuestas');
  }
}

export function subscribeSession(code, onData, onError) {
  return onSnapshot(sessionRef(code), (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null), (e) => onError?.(explain(e, 'seguir la sesión')));
}

export function subscribeParticipants(code, onData, onError) {
  return onSnapshot(
    collection(db, 'sesiones', normalizeCode(code), 'participantes'),
    (snap) => onData(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    (e) => onError?.(explain(e, 'ver a los participantes'))
  );
}

export async function listMySessions(ownerId) {
  try {
    const snap = await getDocs(query(collection(db, 'sesiones'), where('ownerId', '==', ownerId)));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.creadaEn?.toMillis?.() || 0) - (a.creadaEn?.toMillis?.() || 0));
  } catch (e) {
    throw explain(e, 'listar tus sesiones');
  }
}

export async function setSessionState(code, estado) {
  try {
    await updateDoc(sessionRef(code), { estado, cerradaEn: estado === 'cerrada' ? serverTimestamp() : null });
  } catch (e) {
    throw explain(e, 'cambiar el estado de la sesión');
  }
}

export async function setActiveContent(code, activo) {
  try {
    await updateDoc(sessionRef(code), { activo });
  } catch (e) {
    throw explain(e, 'actualizar lo que ven los estudiantes');
  }
}

export async function deleteSession(code) {
  try {
    const parts = await getDocs(collection(db, 'sesiones', normalizeCode(code), 'participantes'));
    await Promise.all(parts.docs.map(d => deleteDoc(d.ref)));
    await deleteDoc(keyRef(code)).catch(() => {});
    await deleteDoc(sessionRef(code));
  } catch (e) {
    throw explain(e, 'eliminar la sesión');
  }
}

// -------------------------------------------------------------- Estudiante

const newId = () => (globalThis.crypto?.randomUUID?.() || `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`);

export async function joinSession(code, nombre) {
  const pid = newId();
  try {
    await setDoc(partRef(code, pid), {
      nombre,
      estado: 'activo',
      entroEn: serverTimestamp(),
      ultimaActividad: serverTimestamp(),
      salidas: 0,
      tiempoFuera: 0,
      eventos: [],
      respuestas: {},
      envioAutomatico: false,
      motivo: ''
    });
    return pid;
  } catch (e) {
    throw explain(e, 'entrar a la sesión');
  }
}

export async function getParticipant(code, pid) {
  try {
    const snap = await getDoc(partRef(code, pid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (e) {
    throw explain(e, 'recuperar tu sesión');
  }
}

export async function saveAnswers(code, pid, respuestas) {
  await updateDoc(partRef(code, pid), { respuestas, ultimaActividad: serverTimestamp() });
}

/** Registra una salida ('salio') o un regreso ('volvio') de la pestaña de la evaluación. */
export async function reportLeaveEvent(code, pid, evento) {
  const update = { eventos: arrayUnion(evento), ultimaActividad: serverTimestamp() };
  if (evento.tipo === 'salio') update.salidas = increment(1);
  if (evento.tipo === 'volvio' && evento.duracionMs) update.tiempoFuera = increment(evento.duracionMs);
  await updateDoc(partRef(code, pid), update);
}

export async function submitAnswers(code, pid, respuestas, { automatico = false, motivo = '' } = {}) {
  try {
    await updateDoc(partRef(code, pid), {
      respuestas,
      estado: 'enviado',
      enviadoEn: serverTimestamp(),
      ultimaActividad: serverTimestamp(),
      envioAutomatico: automatico,
      motivo
    });
  } catch (e) {
    throw explain(e, 'enviar tus respuestas');
  }
}
