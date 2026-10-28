/**
 * identificationResolver.js
 * INSPIRATEC - Módulo de resolución de datos institucionales y docentes reales.
 * 
 * Garantiza que la sección '### Identificación' de las secuencias didácticas tome
 * la información real del perfil del usuario (institución, docente) o los valores predeterminados:
 * - Institución Educativa: Institución Educativa Técnica Distrital
 * - Docente: Equipo de Matemáticas
 * - Grado: 10° (sin grupo)
 * - Área / Asignatura: Matemáticas
 * - Duración: 90 minutos (1 sesión continua)
 * 
 * EXCLUSIÓN ESTRICTA: Se retiran por completo 'Grupo' y 'Periodo Académico'.
 */

export const DEFAULT_IDENTIFICATION = {
  institucion: '',
  docente: '',
  grado: '',
  area: '',
  duracionTexto: ''
};

/**
 * Formatea la fecha actual en español estándar colombiano (ej: "16 de octubre de 2026").
 */
export function formatCurrentDateSpanish(date = new Date()) {
  try {
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }
}

/**
 * Infiere la asignatura pertinente a partir del área y el tema si el usuario no la especificó.
 */
export function inferAsignatura(materia = '', tema = '') {
  const normMateria = (materia || '').trim().toLowerCase();
  const normTema = (tema || '').trim().toLowerCase();

  if (normMateria.includes('tecnolog') || normMateria.includes('informát') || normMateria.includes('informat')) {
    if (normTema.includes('desconectad') || normTema.includes('unplugged')) {
      return 'Informática (Pensamiento Computacional Desconectado)';
    }
    if (normTema.includes('program') || normTema.includes('bloque') || normTema.includes('scratch') || normTema.includes('algoritmo')) {
      return 'Informática (Pensamiento Computacional)';
    }
    return 'Informática';
  }

  if (normMateria.includes('matemát') || normMateria.includes('matemat')) {
    if (normTema.includes('geometr') || normTema.includes('figura') || normTema.includes('área') || normTema.includes('area')) {
      return 'Geometría';
    }
    if (normTema.includes('estadíst') || normTema.includes('probabilidad') || normTema.includes('gráfico')) {
      return 'Estadística';
    }
    return 'Matemáticas';
  }

  if (normMateria.includes('naturales') || normMateria.includes('ciencias')) {
    if (normTema.includes('físic') || normTema.includes('movimiento') || normTema.includes('fuerza')) {
      return 'Física';
    }
    if (normTema.includes('químic') || normTema.includes('reacción') || normTema.includes('átomo')) {
      return 'Química';
    }
    return 'Ciencias Naturales y Educación Ambiental';
  }

  if (normMateria.includes('sociales')) {
    return 'Ciencias Sociales (Historia y Geografía)';
  }

  if (normMateria.includes('lengu') || normMateria.includes('castell') || normMateria.includes('español')) {
    return 'Lengua Castellana';
  }

  if (normMateria.includes('inglés') || normMateria.includes('ingles')) {
    return 'Inglés (Lengua Extranjera)';
  }

  return materia || 'Matemáticas';
}

/**
 * Resuelve el conjunto consolidado de datos institucionales y docentes a partir de wizardData y userProfile.
 * Excluye explícitamente grupo y periodo.
 * 
 * @param {Object} wizardData - Datos del formulario del asistente.
 * @param {Object} [userProfile] - Perfil del usuario autenticado en la plataforma.
 * @returns {Object} Datos consolidados limpios y listos para inyección en plantillas y prompts.
 */
export function resolveRealIdentification(wizardData = {}, userProfile = null) {
  // 1. Institución Educativa
  const rawInstitucion = wizardData.institucion || userProfile?.institucion || '';
  const institucion = rawInstitucion.trim() !== '' 
    ? rawInstitucion.trim() 
    : (userProfile?.institucion || DEFAULT_IDENTIFICATION.institucion);

  // 2. Área Curricular / Asignatura
  const rawArea = wizardData.materia || wizardData.area || userProfile?.area || '';
  const area = rawArea.trim() !== '' ? rawArea.trim() : DEFAULT_IDENTIFICATION.area;

  // 3. Grado (Estrictamente sin grupo)
  const rawGrado = (wizardData.grado || '').trim();
  let grado = rawGrado !== '' ? rawGrado : DEFAULT_IDENTIFICATION.grado;
  if (grado.toLowerCase().includes('10mo') || grado === '10' || grado.toLowerCase().includes('10°')) {
    grado = '10°';
  }
  // Eliminar cualquier mención de grupo pegada al grado (ej. '10° (10-A)' -> '10°')
  grado = grado.replace(/\s*\([^\)]*\)/g, '').replace(/—.*$/g, '').trim();

  // 4. Docente
  const rawDocente = wizardData.docente || userProfile?.nombre || '';
  const docente = rawDocente.trim() !== '' && rawDocente !== 'Docente' && rawDocente !== 'Docente Planificador'
    ? rawDocente.trim()
    : (userProfile?.nombre || DEFAULT_IDENTIFICATION.docente);

  // 5. Duración de la clase
  const rawDuracion = (wizardData.duracion || '').trim();
  let duracionTexto = '';
  if (rawDuracion !== '') {
    duracionTexto = rawDuracion;
    if (!duracionTexto.toLowerCase().includes('sesión') && !duracionTexto.toLowerCase().includes('sesiones')) {
      const sesionesRaw = wizardData.sesiones ? String(wizardData.sesiones).trim() : '1';
      const sesionMatch = sesionesRaw.match(/\d+/);
      const numSesiones = sesionMatch ? sesionMatch[0] : (sesionesRaw || '1');
      const sesionWord = numSesiones === '1' ? '1 sesión continua' : `${numSesiones} sesiones`;
      duracionTexto = `${duracionTexto} (${sesionWord})`;
    }
  } else {
    duracionTexto = DEFAULT_IDENTIFICATION.duracionTexto;
  }

  const metodologia = (wizardData.metodologiaSTEAM || wizardData.metodologia || '').trim() || '';
  const recursos = (wizardData.recursos || '').trim();

  return {
    institucion,
    area,
    grado,
    docente,
    duracionTexto,
    metodologia,
    recursos,
    // Propiedades normalizadas (grupo y periodo eliminados)
    duracion: duracionTexto,
    sesiones: '1'
  };
}

/**
 * Genera el bloque canónico Markdown para la sección '### Identificación'.
 * Contiene estrictamente: Institución Educativa, Docente, Grado, Área / Asignatura, Duración, Metodología y Recursos.
 * Grupo y Periodo quedan completamente excluidos.
 * 
 * @param {Object} realData - Datos resueltos con resolveRealIdentification.
 * @returns {string} Bloque Markdown formateado con negrillas uniformes.
 */
export function formatIdentificationMarkdown(realData) {
  // Solo se escriben los datos que el docente realmente proporcionó
  const rows = [
    ['Institución Educativa', realData.institucion],
    ['Docente', realData.docente],
    ['Grado', realData.grado],
    ['Área / Asignatura', realData.area],
    ['Duración', realData.duracionTexto],
    ['Metodología', realData.metodologia],
    ['Recursos', realData.recursos]
  ].filter(([, v]) => v && String(v).trim() !== '');
  return ['### Identificación', ...rows.map(([k, v]) => `- **${k}:** ${v}`)].join('\n');
}

/**
 * Reemplaza marcadores de posición genéricos o residuales en el plan generado con los datos reales.
 * Elimina cualquier rastro antiguo de Grupo, Periodo, Sede, Tutor, Docente en formación y Fecha de aplicación.
 * 
 * @param {string} planMarkdown - Texto Markdown del plan generado por IA.
 * @param {Object} realData - Datos consolidados reales.
 * @returns {string} Plan Markdown con los datos reales inyectados rigurosamente.
 */
export function injectRealIdentificationIntoPlan(planMarkdown = '', realData) {
  if (!planMarkdown || typeof planMarkdown !== 'string') return planMarkdown;

  let text = planMarkdown;
  const newIdentBlock = formatIdentificationMarkdown(realData);

  // 1. Reemplazo de bloques tipo encabezado de Identificación (### Identificación, ## 1. Identificación, etc.)
  const identHeaderRegex = /(#{1,4}\s*(?:[A-Z0-9IVX]+\.\s*)?Identificación[^\n]*\n)([\s\S]*?)(?=\n---|###|\n##|\n#|$|\n\*\*Momento|\n\*\*Objetivo)/i;
  
  if (identHeaderRegex.test(text)) {
    text = text.replace(identHeaderRegex, `${newIdentBlock}\n`);
  } else {
    // 2. Si no tiene encabezado pero tiene las líneas con pipes de identificación
    const pipedBlockRegex = /(?:Institución:[^\n]+(?:\||\n)[^\n]*?(?:Docente|Tutor|Duración)[^\n]+)/i;
    if (pipedBlockRegex.test(text)) {
      text = text.replace(pipedBlockRegex, newIdentBlock);
    } else {
      // 3. Reemplazos de marcadores genéricos
      text = text
        .replace(/\[(?:Nombre de la Institución|Institución educativa|Institución)[^\]]*\]/gi, realData.institucion)
        .replace(/\[(?:Nombre del Docente en Formación|Docente en Formación|Docente)[^\]]*\]/gi, realData.docente)
        .replace(/\[(?:Área|Materia|Área \/ Asignatura)[^\]]*\]/gi, realData.area)
        .replace(/\[(?:Grado)[^\]]*\]/gi, realData.grado)
        .replace(/\[(?:Duración)[^\]]*\]/gi, realData.duracionTexto);
    }
  }

  // 4. Limpieza estricta de residuos de Grupo, Periodo, Sede, Tutor, Docente en formación y Fecha de aplicación
  text = text
    .replace(/(?:-\s*)?\*\*(?:Grupo(?:\(s\))?|Grado y Grupo|Periodo(?:\s*Académico)?|Periodo|Sede|Tutor(?:\s*\(IE\))?|Docente en formación|Fecha de aplicación):\*\*?[^\n]*\n?/gi, '')
    .replace(/\|\s*(?:Grupo(?:\(s\))?|Grado y Grupo|Periodo(?:\s*Académico)?|Periodo|Sede|Tutor(?:\s*\(IE\))?|Docente en formación|Fecha de aplicación):[^\n|]+\|?/gi, '')
    // Reemplazo de mención residual de (10-A) o 36 estudiantes pegados al grado
    .replace(/(\*\*Grado:\*\*\s*10°?)\s*\([^\)]*\)(?:\s*—\s*\d+\s*estudiantes)?/gi, '$1')
    .replace(/(\*\*Grado:\*\*[^\n]*?)\s*\|\s*Grupo:[^\n]*/gi, '$1');

  return text;
}

/**
 * Actualiza todos los planes de clase guardados (localmente y en Firestore) con la
 * información institucional y docente real del perfil del usuario actual o los valores por defecto,
 * retirando cualquier remanente de Grupo y Periodo.
 * 
 * @param {Object} [userProfile] - Perfil registrado del usuario.
 * @param {string} [userId] - UID del usuario autenticado.
 * @returns {Promise<{ updatedCount: number }>}
 */
export async function updateSavedPlansWithRealProfile(userProfile = null, userId = null) {
  let updatedCount = 0;

  // 1. Actualizar en almacenamiento local (inspiratec_local_saved_plans)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const LOCAL_PLANS_KEY = 'inspiratec_local_saved_plans';
      const raw = localStorage.getItem(LOCAL_PLANS_KEY);
      if (raw) {
        const plans = JSON.parse(raw);
        if (Array.isArray(plans)) {
          const updatedPlans = plans.map(p => {
            const realData = resolveRealIdentification({
              materia: p.materia || p.area || '',
              grado: p.grado || '',
              duracion: p.duracion || '',
              sesiones: p.sesiones || '1',
              institucion: userProfile?.institucion || p.institucion || '',
              docente: userProfile?.nombre || p.docente || ''
            }, userProfile);

            const updatedMarkdown = p.markdown ? injectRealIdentificationIntoPlan(p.markdown, realData) : p.markdown;
            updatedCount++;
            return {
              ...p,
              institucion: realData.institucion,
              docente: realData.docente,
              area: realData.area,
              grado: realData.grado,
              duracionTexto: realData.duracionTexto,
              grupo: '',
              periodo: '',
              markdown: updatedMarkdown,
              updatedAt: new Date().toISOString()
            };
          });
          localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(updatedPlans));
        }
      }

      // 2. Actualizar sesión activa en localStorage si existe (inspiratec_active_session)
      const activeRaw = localStorage.getItem('inspiratec_active_session');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        const state = active?.state || active;
        if (state?.planGenerado) {
          const realData = resolveRealIdentification({
            materia: state.wizardData?.materia || '',
            grado: state.wizardData?.grado || '',
            duracion: state.wizardData?.duracion || '',
            sesiones: state.wizardData?.sesiones || '1',
            institucion: userProfile?.institucion || '',
            docente: userProfile?.nombre || ''
          }, userProfile);

          state.planGenerado = injectRealIdentificationIntoPlan(state.planGenerado, realData);
          if (state.activePlanMetadata) {
            state.activePlanMetadata.institucion = realData.institucion;
            state.activePlanMetadata.docente = realData.docente;
            state.activePlanMetadata.area = realData.area;
            state.activePlanMetadata.grado = realData.grado;
            state.activePlanMetadata.duracionTexto = realData.duracionTexto;
            delete state.activePlanMetadata.grupo;
            delete state.activePlanMetadata.periodo;
          }
          if (state.wizardData) {
            state.wizardData.institucion = realData.institucion;
            state.wizardData.docente = realData.docente;
            state.wizardData.materia = realData.area;
            state.wizardData.grado = realData.grado;
            delete state.wizardData.grupo;
            delete state.wizardData.periodo;
          }
          localStorage.setItem('inspiratec_active_session', JSON.stringify(active));
        }
      }
    } catch (e) {
      console.warn('[INSPIRATEC] Error al actualizar planes locales con perfil real:', e);
    }
  }

  // 3. Actualizar en Firestore para los planes del usuario
  try {
    const { db } = await import('../../firebase.js');
    const { collection, getDocs, query, where, updateDoc, doc } = await import('firebase/firestore');
    
    const targetUserId = userId || userProfile?.uid || userProfile?.id;
    if (targetUserId) {
      const q = query(collection(db, 'planes'), where('userId', '==', targetUserId));
      const snap = await getDocs(q);
      const updates = [];
      snap.forEach(d => {
        const data = d.data();
        const realData = resolveRealIdentification({
          materia: data.materia || data.area || '',
          grado: data.grado || '',
          duracion: data.duracion || '',
          sesiones: data.sesiones || '1',
          institucion: userProfile?.institucion || data.institucion || '',
          docente: userProfile?.nombre || data.docente || ''
        }, userProfile);

        const updatedMarkdown = data.markdown ? injectRealIdentificationIntoPlan(data.markdown, realData) : data.markdown;
        updates.push(updateDoc(doc(db, 'planes', d.id), {
          institucion: realData.institucion,
          docente: realData.docente,
          area: realData.area,
          grado: realData.grado,
          duracionTexto: realData.duracionTexto,
          grupo: '',
          periodo: '',
          markdown: updatedMarkdown
        }));
      });
      await Promise.allSettled(updates);
    }
  } catch (err) {
    console.warn('[INSPIRATEC] Firestore no disponible o sin conexión para actualización remota:', err);
  }

  return { updatedCount };
}
