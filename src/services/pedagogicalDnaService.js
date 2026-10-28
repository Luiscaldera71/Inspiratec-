import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { getMisPlanes } from './dbService.js';

export const DEFAULT_PEDAGOGICAL_DNA = {
  // 1. Memoria de Éxito Automática (Generada dinámicamente con los planes del usuario)
  memoriaExito: {
    totalPlanesAnalizados: 0,
    metodologiasFrecuentes: [],
    recursosPredilectos: [],
    areasFrecuentes: [],
    indiceInnovacion: 0
  },

  // 2. Caja de Herramientas Favorita (Personalizable con estrellas - Propuesta 1 y 3)
  cajaHerramientas: {
    dinamicasInicio: [
      'Dinámicas desconectadas (Unplugged) sin pantallas',
      'Pregunta socrática provocadora del entorno',
      'Rutina de pensamiento: Veo - Pienso - Me pregunto'
    ],
    dinamicasPersonalizadas: [],
    estilosEvaluacion: [
      'Evaluación formativa cualitativa con rúbrica analítica',
      'Coevaluación reflexiva entre pares',
      'Retroalimentación inmediata sin penalización'
    ],
    estilosEvaluacionPersonalizados: [],
    enfoquesDuaFavoritos: [
      'Múltiples formas de representación visual e interactiva',
      'Opciones para sostener el esfuerzo y la persistencia',
      'Flexibilidad en las formas de acción y expresión'
    ],
    enfoquesDuaPersonalizados: [],
    notasClave: 'Me funciona iniciar con dinámicas desconectadas y retos tangibles antes de pasar a la teoría. Priorizo el trabajo cooperativo y la evaluación formativa sin estrés.'
  },

  // 3. Matriz de Transversalidad & Proyectos Institucionales (Propuestas 1 y 3)
  matrizTransversalidad: {
    ejesInstitucionales: [
      'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)',
      'Educación Ambiental y Sostenibilidad (PRAE)',
      'Convivencia, Paz y Habilidades Ciudadanas',
      'Alfabetización Digital & Ciudadanía Crítica'
    ],
    ejesPersonalizados: [],
    areaSecundariaPredilecta: 'Matemáticas',
    retoEntornoHabitual: 'Sostenibilidad ambiental y optimización de recursos en la institución escolar'
  },

  // 4. Banco de Recursos Probados y Efectivos en Aula (Potenciador de la Propuesta 2)
  recursosProbados: [
    {
      id: 'rec_fav_1',
      title: 'Rúbrica Socioformativa para Proyectos STEAM',
      type: 'rubrica',
      efectividad: 'Alta efectividad',
      engagement: 5,
      notaDocente: 'Excelente para que los estudiantes se autoevalúen antes de la entrega final.'
    },
    {
      id: 'rec_fav_2',
      title: 'Trivia Gamificada con Efectos de Sonido',
      type: 'juegos',
      efectividad: 'Muy participativo',
      engagement: 5,
      notaDocente: 'Motivó al 100% del grupo al cierre de la sesión.'
    }
  ],

  // Switch de control para aplicar ADN en el generador
  aplicarAdnPorDefecto: true,
  ultimaSincronizacion: null
};

const STORAGE_PREFIX = 'inspiratec_pedagogical_dna_';

const withTimeout = (promise, ms = 2200) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const getLocalStorageSafe = () => {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return null;
};

/**
 * Obtiene el ADN pedagógico del usuario (desde Firestore con fallback a institucional, localStorage y defaults)
 */
export async function getPedagogicalDna(userId, isAdmin = false) {
  const effectiveUid = userId || 'anon';
  const storageKey = `${STORAGE_PREFIX}${effectiveUid}`;
  const storage = getLocalStorageSafe();

  let localData = null;
  if (storage) {
    try {
      const raw = storage.getItem(storageKey);
      if (raw) localData = JSON.parse(raw);
    } catch (e) {
      console.warn("Error leyendo ADN de localStorage:", e);
    }
  }

  // 1. Si hay usuario autenticado, consultar su documento en Firestore
  if (userId && userId !== 'anon') {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await withTimeout(getDoc(userRef));
      if (userSnap.exists()) {
        const cloudDna = userSnap.data()?.adnPedagogico;
        if (cloudDna) {
          const merged = mergeWithDefaults(cloudDna);
          if (storage) storage.setItem(storageKey, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.warn("Firestore inaccesible para ADN de usuario, verificando institucional/local:", e);
    }
  }

  // 2. Si no tiene ADN propio aún, intentar leer plantilla institucional configurada por administradores
  try {
    const instRef = doc(db, 'configuracion', 'adn_institucional');
    const instSnap = await withTimeout(getDoc(instRef));
    if (instSnap.exists()) {
      const instDna = instSnap.data()?.adnPedagogico;
      if (instDna) {
        const mergedInst = mergeWithDefaults(instDna);
        if (storage) storage.setItem(storageKey, JSON.stringify(mergedInst));
        return mergedInst;
      }
    }
  } catch (e) {
    // Silencioso: si no existe institucional, continúa al local o defaults
  }

  if (localData) {
    return mergeWithDefaults(localData);
  }

  return JSON.parse(JSON.stringify(DEFAULT_PEDAGOGICAL_DNA));
}

/**
 * Guarda o actualiza el ADN pedagógico en Firestore y localStorage
 * Si saveAsInstitutional es true y el usuario es admin, también actualiza la plantilla institucional
 */
export async function savePedagogicalDna(userId, dnaData, saveAsInstitutional = false) {
  const effectiveUid = userId || 'anon';
  const storageKey = `${STORAGE_PREFIX}${effectiveUid}`;
  const storage = getLocalStorageSafe();

  const record = {
    ...mergeWithDefaults(dnaData),
    ultimaSincronizacion: new Date().toISOString()
  };

  // 1. Persistencia local inmediata
  if (storage) {
    try {
      storage.setItem(storageKey, JSON.stringify(record));
    } catch (e) {
      console.warn("Error guardando ADN en localStorage:", e);
    }
  }

  // 2. Persistencia en Firestore del usuario
  if (userId && userId !== 'anon') {
    try {
      const userRef = doc(db, 'users', userId);
      await withTimeout(setDoc(userRef, { 
        adnPedagogico: record,
        updatedAt: new Date().toISOString()
      }, { merge: true }));
    } catch (e) {
      console.warn("Error guardando ADN en Firestore de usuario:", e);
    }
  }

  // 3. Si se marcó como estándar institucional, guardar en nodo global
  if (saveAsInstitutional) {
    try {
      const instRef = doc(db, 'configuracion', 'adn_institucional');
      await withTimeout(setDoc(instRef, {
        adnPedagogico: record,
        autorUid: effectiveUid,
        actualizadoPorAdmin: true,
        updatedAt: new Date().toISOString()
      }, { merge: true }));
    } catch (e) {
      console.warn("Error guardando ADN institucional en Firestore:", e);
    }
  }

  return record;
}

/**
 * Auto-analiza los planes y experiencias del docente o administrador para enriquecer la Memoria de Éxito Automática
 */
export async function autoSyncDnaFromHistory(userId, currentDna = null, isAdmin = false) {
  const effectiveUid = userId || 'anon';
  const dna = currentDna ? { ...currentDna } : await getPedagogicalDna(effectiveUid, isAdmin);

  try {
    let planes = await getMisPlanes(effectiveUid);
    
    // Si es administrador o no tiene planes personales aún, consultar planes locales o institucionales
    if ((!planes || planes.length === 0) && isAdmin) {
      const storage = getLocalStorageSafe();
      if (storage) {
        try {
          const allPlanesRaw = storage.getItem('inspiratec_local_saved_plans') ||
                               storage.getItem('inspiratec_planes_docente_test_persistencia') || 
                               storage.getItem('mis_planes_db');
          if (allPlanesRaw) planes = JSON.parse(allPlanesRaw);
        } catch (_) {}
      }
    }

    if (!planes || planes.length === 0) {
      // Estado cero real: el usuario aún no tiene secuencias analizadas
      const zeroDna = {
        ...dna,
        memoriaExito: {
          totalPlanesAnalizados: 0,
          metodologiasFrecuentes: [],
          recursosPredilectos: [],
          areasFrecuentes: [],
          indiceInnovacion: 0
        }
      };
      await savePedagogicalDna(effectiveUid, zeroDna, isAdmin);
      return zeroDna;
    }

    const metCount = {};
    const resCount = {};
    const areaCount = {};
    const probados = Array.isArray(dna.recursosProbados) ? [...dna.recursosProbados] : [];

    planes.forEach(plan => {
      // 1. Detección y normalización de metodologías
      let met = plan.metodologiaSTEAM || plan.metodologia || plan.metodologiaSugerida;
      if (!met && plan.markdown) {
        const match = plan.markdown.match(/\*\*(?:Metodología|Enfoque|Metodología Principal):\*\*\s*([^\n\r]+)/i) ||
                      plan.markdown.match(/##\s*(?:Metodología|Enfoque Pedagógico)[^\n]*\n+([^\n\r]+)/i);
        if (match && match[1]) {
          met = match[1].replace(/[*_#]/g, '').trim();
        }
      }
      if (!met) met = 'Aprendizaje Activo y Significativo';
      metCount[met] = (metCount[met] || 0) + 1;

      // 2. Detección de áreas curriculares
      let area = plan.materia || plan.asignatura || plan.area;
      if (!area && plan.markdown) {
        const matchArea = plan.markdown.match(/\*\*(?:Área|Asignatura|Materia):\*\*\s*([^\n\r]+)/i);
        if (matchArea && matchArea[1]) area = matchArea[1].replace(/[*_#]/g, '').trim();
      }
      if (area) areaCount[area] = (areaCount[area] || 0) + 1;

      // 3. Detección y conteo de recursos didácticos anexos generados
      if (Array.isArray(plan.recursosAnexos)) {
        plan.recursosAnexos.forEach(rec => {
          const typeKey = (rec.typeKey || rec.type || rec.title || '').toLowerCase();
          let key = 'recurso';
          if (typeKey.includes('rubrica')) key = 'rubrica';
          else if (typeKey.includes('juego') || typeKey.includes('trivia')) key = 'juegos';
          else if (typeKey.includes('sopa')) key = 'sopa';
          else if (typeKey.includes('diapositiva') || typeKey.includes('presentacion')) key = 'presentacion';
          else if (typeKey.includes('pregunta') || typeKey.includes('cuestionario')) key = 'preguntas';
          else if (typeKey.includes('flashcard')) key = 'flashcards';

          resCount[key] = (resCount[key] || 0) + 1;

          // Si el plan está sistematizado o en biblioteca, registrar recurso como probado
          if ((plan.estado === 'Sistematizado' || plan.estado === 'Biblioteca' || (plan.calificacionDocente && plan.calificacionDocente >= 4)) && !probados.some(p => p.title === rec.title)) {
            probados.push({
              id: rec.id || `prob_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              title: rec.title,
              type: key,
              efectividad: 'Alta efectividad',
              engagement: 5,
              notaDocente: `Probado en la experiencia de aula: ${plan.tema || 'Clase aplicada'}`
            });
          }
        });
      }
    });

    const totalPlanes = planes.length;
    const sortedMet = Object.entries(metCount).map(([name, count]) => ({
      name,
      count,
      porcentaje: Math.min(100, Math.round((count / totalPlanes) * 100))
    })).sort((a, b) => b.count - a.count);

    const resourceLabels = {
      rubrica: 'Rúbrica socioformativa analítica',
      juegos: 'Trivia y juegos gamificados',
      presentacion: 'Diapositivas y presentación interactiva',
      sopa: 'Sopa de letras temática',
      preguntas: 'Banco de preguntas formativas',
      flashcards: 'Flashcards interactivas 3D',
      recurso: 'Material interactivo de aula'
    };

    const sortedRes = Object.entries(resCount).map(([key, count]) => ({
      name: resourceLabels[key] || key,
      count,
      key
    })).sort((a, b) => b.count - a.count);

    const sortedAreas = Object.keys(areaCount).sort((a, b) => areaCount[b] - areaCount[a]);

    // Cálculo dinámico real del índice de innovación pedagógica (0-100)
    // Basado en: número de secuencias sistematizadas, diversidad metodológica, inclusión DUA y variedad de recursos didácticos
    const diversidadMetodologica = Math.min(30, Object.keys(metCount).length * 10);
    const variedadRecursos = Math.min(30, Object.keys(resCount).length * 8);
    const volumenSecuencias = Math.min(25, totalPlanes * 5);
    const adherenciaDua = Array.isArray(dna.cajaHerramientas?.enfoquesDuaFavoritos) ? Math.min(15, dna.cajaHerramientas.enfoquesDuaFavoritos.length * 3) : 10;
    const computedIndice = Math.min(100, Math.max(15, diversidadMetodologica + variedadRecursos + volumenSecuencias + adherenciaDua));

    const updatedDna = {
      ...dna,
      memoriaExito: {
        totalPlanesAnalizados: totalPlanes,
        metodologiasFrecuentes: sortedMet.slice(0, 5),
        recursosPredilectos: sortedRes.slice(0, 6),
        areasFrecuentes: sortedAreas.slice(0, 3),
        indiceInnovacion: computedIndice
      },
      recursosProbados: probados
    };

    await savePedagogicalDna(effectiveUid, updatedDna, isAdmin);
    return updatedDna;
  } catch (e) {
    console.warn("Error en autoSyncDnaFromHistory:", e);
    return dna;
  }
}

/**
 * Agrega un recurso probado al banco del docente o institución
 */
export async function addRecursoProbado(userId, nuevoRecurso) {
  const current = await getPedagogicalDna(userId);
  const probados = Array.isArray(current.recursosProbados) ? [...current.recursosProbados] : [];
  probados.unshift({
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: nuevoRecurso.title || 'Recurso de aula',
    type: nuevoRecurso.type || 'recurso',
    efectividad: nuevoRecurso.efectividad || 'Alta efectividad',
    engagement: nuevoRecurso.engagement || 5,
    notaDocente: nuevoRecurso.notaDocente || 'Efectivo en dinámicas participativas'
  });
  const updated = { ...current, recursosProbados: probados };
  await savePedagogicalDna(userId, updated);
  return updated;
}

/**
 * Elimina un recurso probado del banco
 */
export async function removeRecursoProbado(userId, recursoId) {
  const current = await getPedagogicalDna(userId);
  const probados = (current.recursosProbados || []).filter(r => r.id !== recursoId);
  const updated = { ...current, recursosProbados: probados };
  await savePedagogicalDna(userId, updated);
  return updated;
}

/**
 * Genera la directiva de memoria contextual para el prompt de IA en Gemini
 */
export function formatDnaPromptDirective(dna, wizardData) {
  if (!dna || wizardData.aplicarAdnPedagógico === false) return '';

  const caja = dna.cajaHerramientas || {};
  const dinamicas = Array.isArray(caja.dinamicasInicio) && caja.dinamicasInicio.length > 0
    ? caja.dinamicasInicio.join('; ')
    : 'Dinámicas desconectadas y preguntas socráticas';

  const evaluacion = Array.isArray(caja.estilosEvaluacion) && caja.estilosEvaluacion.length > 0
    ? caja.estilosEvaluacion.join('; ')
    : 'Rúbrica formativa y coevaluación';

  const dua = Array.isArray(caja.enfoquesDuaFavoritos) && caja.enfoquesDuaFavoritos.length > 0
    ? caja.enfoquesDuaFavoritos.join('; ')
    : 'Múltiples formas de representación y expresión';

  const notas = (caja.notasClave || '').trim();

  let directive = `
MEMORIA CONTEXTUAL Y ADN PEDAGÓGICO DEL DOCENTE (PERSONALIZACIÓN INTELIGENTE):
- Dinámicas de Inicio Predilectas: ${dinamicas}.
- Estilo y Estrategia de Evaluación Favorita: ${evaluacion}.
- Principios DUA Prioritarios: ${dua}.
${notas ? `- Filosofía y Nota Pedagógica del Docente: "${notas}".` : ''}
* INSTRUCCIÓN: Articula el desarrollo de la secuencia y las actividades pedagógicas para que sintonicen fielmente con este ADN docente, adaptando las fases de inicio y evaluación al estilo pedagógico registrado sin perder la rigurosidad curricular del MEN.
`;

  // Transversalidad articulada si el docente la activó
  if (wizardData.esTransversal && wizardData.areaSecundaria) {
    directive += `
ESTUDIO Y ARTICULACIÓN TRANSVERSAL INTERDISCIPLINAR:
- Eje Transversal Institucional: ${wizardData.ejeTransversal || 'Enfoque STEAM / PRAE'}.
- Área Principal: ${wizardData.materia}.
- Área Secundaria Articulada: ${wizardData.areaSecundaria}.
${wizardData.retoContextual ? `- Pregunta Problémica o Reto del Entorno Guía: "${wizardData.retoContextual}".` : ''}
* DIRECTIVA INTERDISCIPLINAR: Diseña la secuencia de aprendizaje conectando de manera natural y explícita las competencias de ${wizardData.materia} con ${wizardData.areaSecundaria} a través del eje transversal y el reto contextual. Especifica en las actividades cómo los estudiantes aplican conceptos de ambas áreas de forma complementaria sin saturar la sesión.
`;
  }

  return directive;
}

function mergeWithDefaults(incoming = {}) {
  const incMemoria = incoming.memoriaExito || {};
  return {
    ...DEFAULT_PEDAGOGICAL_DNA,
    ...incoming,
    memoriaExito: {
      totalPlanesAnalizados: typeof incMemoria.totalPlanesAnalizados === 'number' 
        ? incMemoria.totalPlanesAnalizados 
        : DEFAULT_PEDAGOGICAL_DNA.memoriaExito.totalPlanesAnalizados,
      metodologiasFrecuentes: Array.isArray(incMemoria.metodologiasFrecuentes)
        ? incMemoria.metodologiasFrecuentes
        : DEFAULT_PEDAGOGICAL_DNA.memoriaExito.metodologiasFrecuentes,
      recursosPredilectos: Array.isArray(incMemoria.recursosPredilectos)
        ? incMemoria.recursosPredilectos
        : DEFAULT_PEDAGOGICAL_DNA.memoriaExito.recursosPredilectos,
      areasFrecuentes: Array.isArray(incMemoria.areasFrecuentes)
        ? incMemoria.areasFrecuentes
        : DEFAULT_PEDAGOGICAL_DNA.memoriaExito.areasFrecuentes,
      indiceInnovacion: typeof incMemoria.indiceInnovacion === 'number'
        ? incMemoria.indiceInnovacion
        : DEFAULT_PEDAGOGICAL_DNA.memoriaExito.indiceInnovacion
    },
    cajaHerramientas: {
      ...DEFAULT_PEDAGOGICAL_DNA.cajaHerramientas,
      ...(incoming.cajaHerramientas || {})
    },
    matrizTransversalidad: {
      ...DEFAULT_PEDAGOGICAL_DNA.matrizTransversalidad,
      ...(incoming.matrizTransversalidad || {})
    },
    recursosProbados: Array.isArray(incoming.recursosProbados)
      ? incoming.recursosProbados
      : DEFAULT_PEDAGOGICAL_DNA.recursosProbados,
    aplicarAdnPorDefecto: incoming.aplicarAdnPorDefecto !== undefined
      ? incoming.aplicarAdnPorDefecto
      : DEFAULT_PEDAGOGICAL_DNA.aplicarAdnPorDefecto
  };
}

/**
 * Genera el análisis general agregado del ADN Pedagógico e Identidad Curricular Institucional
 * a partir de todos los usuarios registrados y sus planes en la plataforma.
 */
export async function getInstitutionalDnaAnalysis(usuarios = [], planes = []) {
  let allUsers = Array.isArray(usuarios) && usuarios.length > 0 ? [...usuarios] : [];
  let allPlanes = Array.isArray(planes) && planes.length > 0 ? [...planes] : [];

  // Si no se pasaron usuarios o planes, intentar fallback a localStorage
  if (allPlanes.length === 0) {
    const storage = getLocalStorageSafe();
    if (storage) {
      try {
        const raw = storage.getItem('inspiratec_local_saved_plans') || 
                    storage.getItem('inspiratec_planes_docente_test_persistencia') ||
                    storage.getItem('mis_planes_db');
        if (raw) allPlanes = JSON.parse(raw);
      } catch (_) {}
    }
  }

  const metCount = {};
  const resCount = {};
  const areaCount = {};
  const transversalCount = {
    'Educación Ambiental y Sostenibilidad (PRAE)': 0,
    'Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)': 0,
    'Convivencia, Paz y Habilidades Ciudadanas': 0,
    'Alfabetización Digital & Ciudadanía Crítica': 0,
    'Inclusión y Diversidad Cultural': 0
  };

  const dinamicasCount = {
    'Dinámicas desconectadas (Unplugged) sin pantallas': 0,
    'Pregunta socrática provocadora del entorno': 0,
    'Rutina de pensamiento: Veo - Pienso - Me pregunto': 0,
    'Reto lúdico rompehielos (Icebreaker)': 0
  };

  const estilosEvaluacionCount = {
    'Evaluación formativa cualitativa con rúbrica analítica': 0,
    'Coevaluación reflexiva entre pares': 0,
    'Retroalimentación inmediata sin penalización': 0,
    'Portafolio de evidencias continuas': 0
  };

  const enfoquesDuaCount = {
    'Múltiples formas de representación visual e interactiva': 0,
    'Opciones para sostener el esfuerzo y la persistencia': 0,
    'Flexibilidad en las formas de acción y expresión': 0,
    'Optimización de la relevancia individual y autenticidad': 0
  };

  const allRecursosProbados = [];
  const teacherDnaList = [];
  let totalInnovacionSum = 0;
  let docentesAnalizadosCount = 0;

  // Analizar planes globales
  allPlanes.forEach(plan => {
    let met = plan.metodologiaSTEAM || plan.metodologia || plan.metodologiaSugerida;
    if (!met && plan.markdown) {
      const match = plan.markdown.match(/\*\*(?:Metodología|Enfoque|Metodología Principal):\*\*\s*([^\n\r]+)/i);
      if (match && match[1]) met = match[1].replace(/[*_#]/g, '').trim();
    }
    if (!met) met = 'Aprendizaje Basado en Proyectos (ABP)';
    metCount[met] = (metCount[met] || 0) + 1;

    let area = plan.materia || plan.asignatura || plan.area;
    if (area) areaCount[area] = (areaCount[area] || 0) + 1;

    if (plan.markdown) {
      const md = plan.markdown.toLowerCase();
      if (md.includes('ambiental') || md.includes('prae') || md.includes('sostenibil') || md.includes('ecolog')) transversalCount['Educación Ambiental y Sostenibilidad (PRAE)']++;
      if (md.includes('steam') || md.includes('ciencia') || md.includes('tecnolog') || md.includes('experimento')) transversalCount['Enfoque STEAM (Ciencia, Tecnología, Arte y Matemáticas)']++;
      if (md.includes('paz') || md.includes('ciudadan') || md.includes('convivenc') || md.includes('empat')) transversalCount['Convivencia, Paz y Habilidades Ciudadanas']++;
      if (md.includes('digital') || md.includes('tic') || md.includes('virtual') || md.includes('computac')) transversalCount['Alfabetización Digital & Ciudadanía Crítica']++;
      if (md.includes('dua') || md.includes('inclusi') || md.includes('diversid') || md.includes('ajuste razonable')) transversalCount['Inclusión y Diversidad Cultural']++;
    }

    if (Array.isArray(plan.recursosAnexos)) {
      plan.recursosAnexos.forEach(rec => {
        const typeKey = (rec.typeKey || rec.type || rec.title || '').toLowerCase();
        let key = 'Recurso didáctico interactivo';
        if (typeKey.includes('rubrica')) key = 'Rúbricas Socioformativas';
        else if (typeKey.includes('juego') || typeKey.includes('trivia')) key = 'Juegos y Trivias Gamificadas';
        else if (typeKey.includes('sopa')) key = 'Sopas de Letras y Retos Léxicos';
        else if (typeKey.includes('diapositiva') || typeKey.includes('presentacion')) key = 'Diapositivas y Presentaciones';
        else if (typeKey.includes('pregunta') || typeKey.includes('cuestionario')) key = 'Bancos de Preguntas Socráticas';
        else if (typeKey.includes('flashcard')) key = 'Flashcards Conceptuales';

        resCount[key] = (resCount[key] || 0) + 1;

        if (rec.title && !allRecursosProbados.some(p => p.title === rec.title)) {
          allRecursosProbados.push({
            id: rec.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: rec.title,
            type: key,
            efectividad: rec.efectividad || 'Alta efectividad',
            engagement: rec.engagement || 5,
            notaDocente: rec.notaDocente || `Comprobado en: ${plan.tema || 'Secuencia didáctica'}`
          });
        }
      });
    }
  });

  // Analizar ADN individual de cada docente (100% datos reales de Firestore)
  let docentesConInnovacionCount = 0;

  allUsers.forEach((u) => {
    const userDna = u.adnPedagogico;
    const userPlanes = allPlanes.filter(p => p.userId === u.id || p.autorId === u.id || (p.userEmail && p.userEmail === u.email));
    const planCount = userPlanes.length || u.planesCount || 0;

    // 1. Metodología: Priorizar declarada por el docente en su perfil institucional o deducir de secuencias reales
    let userMet = null;
    let hasRegisteredMetodologia = false;

    if (u.metodologiaInstitucional && u.metodologiaInstitucional.trim()) {
      userMet = u.metodologiaInstitucional.trim();
      hasRegisteredMetodologia = true;
    } else if (u.pedagogicalProfile?.metodologiaInstitucional && u.pedagogicalProfile.metodologiaInstitucional.trim()) {
      userMet = u.pedagogicalProfile.metodologiaInstitucional.trim();
      hasRegisteredMetodologia = true;
    } else if (userDna?.memoriaExito?.metodologiasFrecuentes?.length > 0) {
      userMet = userDna.memoriaExito.metodologiasFrecuentes[0].name;
      hasRegisteredMetodologia = true;
    } else if (userPlanes.length > 0) {
      const freq = {};
      userPlanes.forEach(p => {
        const m = p.metodologiaSTEAM || p.metodologia || p.metodologiaSugerida;
        if (m) freq[m] = (freq[m] || 0) + 1;
      });
      const topMet = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (topMet) {
        userMet = topMet;
        hasRegisteredMetodologia = true;
      }
    }

    // 2. Eje Transversal real
    let userEje = null;
    let hasRegisteredEje = false;

    if (u.ejeTransversal && u.ejeTransversal.trim()) {
      userEje = u.ejeTransversal.trim();
      hasRegisteredEje = true;
    } else if (u.pedagogicalProfile?.ejeTransversal && u.pedagogicalProfile.ejeTransversal.trim()) {
      userEje = u.pedagogicalProfile.ejeTransversal.trim();
      hasRegisteredEje = true;
    } else if (userDna?.matrizTransversalidad?.ejesInstitucionales?.length > 0) {
      userEje = userDna.matrizTransversalidad.ejesInstitucionales[0];
      hasRegisteredEje = true;
    }

    // 3. Índice de Innovación real (Solo si tiene planes creados o ADN activo)
    let userInnovacion = null;
    let hasInnovation = false;

    if (userDna) {
      docentesAnalizadosCount++;
      const mem = userDna.memoriaExito || {};
      if (typeof mem.indiceInnovacion === 'number' && mem.indiceInnovacion > 0) {
        userInnovacion = mem.indiceInnovacion;
        hasInnovation = true;
      } else if (planCount > 0) {
        userInnovacion = Math.min(95, 45 + (planCount * 12));
        hasInnovation = true;
      }

      const caja = userDna.cajaHerramientas || {};
      (caja.dinamicasInicio || []).forEach(d => { if (dinamicasCount[d] !== undefined) dinamicasCount[d]++; });
      (caja.estilosEvaluacion || []).forEach(e => { if (estilosEvaluacionCount[e] !== undefined) estilosEvaluacionCount[e]++; });
      (caja.enfoquesDuaFavoritos || []).forEach(f => { if (enfoquesDuaCount[f] !== undefined) enfoquesDuaCount[f]++; });

      (userDna.recursosProbados || []).forEach(r => {
        if (!allRecursosProbados.some(p => p.title === r.title)) allRecursosProbados.push(r);
      });
    } else if (planCount > 0) {
      userInnovacion = Math.min(88, 45 + (planCount * 12));
      hasInnovation = true;
    }

    if (hasInnovation && typeof userInnovacion === 'number') {
      totalInnovacionSum += userInnovacion;
      docentesConInnovacionCount++;
    }

    teacherDnaList.push({
      id: u.id,
      nombre: u.nombre || 'Docente',
      email: u.email || '',
      institucion: u.institucion || 'Colegio',
      nivel: u.nivel || 'Primaria',
      planesCount: planCount,
      metodologiaFavorita: userMet,
      hasRegisteredMetodologia,
      indiceInnovacion: userInnovacion,
      hasInnovation,
      ejeTransversal: userEje,
      hasRegisteredEje,
      hasCustomDna: Boolean(userDna)
    });
  });

  const totalMets = Object.values(metCount).reduce((a, b) => a + b, 0);
  const metodologiasRanking = Object.entries(metCount)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      pct: totalMets > 0 ? Math.round((count / totalMets) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const totalRes = Object.values(resCount).reduce((a, b) => a + b, 0);
  const recursosRanking = Object.entries(resCount)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      pct: totalRes > 0 ? Math.round((count / totalRes) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const totalTransversal = Object.values(transversalCount).reduce((a, b) => a + b, 0);
  const ejesRanking = Object.entries(transversalCount)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      count,
      pct: totalTransversal > 0 ? Math.round((count / totalTransversal) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const promedioInnovacionGlobal = docentesConInnovacionCount > 0 
    ? Math.round(totalInnovacionSum / docentesConInnovacionCount)
    : null;

  // Análisis comparativo: Metodología declarada por los docentes en su perfil vs Metodología aplicada en planes
  const metodologiasDeclaradasCount = {};
  allUsers.forEach((u) => {
    let decl = u.metodologiaInstitucional || u.pedagogicalProfile?.metodologiaInstitucional;
    if (!decl && u.adnPedagogico?.memoriaExito?.metodologiasFrecuentes?.length > 0) {
      decl = u.adnPedagogico.memoriaExito.metodologiasFrecuentes[0].name;
    }
    if (decl && decl.trim()) {
      metodologiasDeclaradasCount[decl.trim()] = (metodologiasDeclaradasCount[decl.trim()] || 0) + 1;
    }
  });

  const totalDeclaradas = Object.values(metodologiasDeclaradasCount).reduce((a, b) => a + b, 0);
  const rankingDeclaradas = Object.entries(metodologiasDeclaradasCount)
    .map(([name, count]) => ({
      name,
      count,
      pct: totalDeclaradas > 0 ? Math.round((count / totalDeclaradas) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const topDeclarada = rankingDeclaradas[0]?.name || null;
  const topAplicada = metodologiasRanking[0]?.name || null;

  let indiceAlineacionCurricular = null;
  let observacionAlineacion = '';

  if (!topDeclarada && !topAplicada) {
    observacionAlineacion = 'Aún no se registran metodologías institucionales declaradas ni planes creados. Los docentes calibrarán su metodología al ingresar.';
  } else if (!topDeclarada) {
    observacionAlineacion = `Se han creado secuencias aplicando '${topAplicada}', pero los docentes aún no han registrado su metodología institucional en el perfil.`;
  } else if (!topAplicada) {
    observacionAlineacion = `El claustro ha declarado prioritariamente '${topDeclarada}'. Aún no hay secuencias didácticas generadas para contrastar su ejecución en aula.`;
  } else {
    const matchDirecto = topDeclarada === topAplicada;
    indiceAlineacionCurricular = matchDirecto ? 92 : 65;
    observacionAlineacion = matchDirecto
      ? `Alta concordancia pedagógica: La metodología oficial declarada por el claustro (${topDeclarada}) coincide con el enfoque didáctico más implementado en las secuencias creadas en aula.`
      : `Oportunidad de articulación curricular: El claustro declara prioritariamente '${topDeclarada}', mientras que en las secuencias planificadas predomina '${topAplicada}'.`;
  }

  const diagnosticoComparativo = {
    rankingDeclaradas,
    rankingAplicadas: metodologiasRanking,
    indiceAlineacionCurricular,
    topDeclarada,
    topAplicada,
    observacionAlineacion
  };

  return {
    totalDocentesRegistrados: allUsers.length,
    docentesConAdnActivo: docentesAnalizadosCount,
    totalPlanesAnalizados: allPlanes.length,
    promedioInnovacionGlobal,
    metodologiaPredominante: topAplicada || topDeclarada || 'Pendiente por registrar',
    recursoMasPopular: recursosRanking[0]?.name || 'Sin recursos anexados aún',
    metodologiasRanking,
    recursosRanking,
    ejesRanking,
    dinamicasFrecuentes: Object.entries(dinamicasCount).filter(([_, c]) => c > 0).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    estilosEvaluacion: Object.entries(estilosEvaluacionCount).filter(([_, c]) => c > 0).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    enfoquesDua: Object.entries(enfoquesDuaCount).filter(([_, c]) => c > 0).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    recursosProbados: allRecursosProbados,
    resumenDocentes: teacherDnaList,
    diagnosticoComparativo,
    timestampSincronizacion: new Date().toISOString()
  };
}
