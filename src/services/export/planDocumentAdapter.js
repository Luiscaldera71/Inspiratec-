/**
 * Adaptador de datos del plan para exportación documental en INSPIRATEC.
 * Normaliza fuentes de datos heterogéneas (estado de Zustand, documentos de Firestore,
 * metadatos curriculares y perfil de docente) en un modelo canónico.
 */

/**
 * Extrae tablas estructuradas de un HTML de rúbrica de forma segura sin ejecutar scripts.
 */
export const extractRubricFromHtml = (htmlContent, title = 'Rúbrica de Evaluación') => {
  if (!htmlContent || typeof htmlContent !== 'string') return null;

  try {
    let headers = [];
    const rows = [];

    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      // text/html parseado en un documento inerte sin ejecución de scripts
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const table = doc.querySelector('table');

      if (table) {
        // Encabezados
        const thElements = table.querySelectorAll('thead th, tr:first-child th');
        if (thElements.length > 0) {
          headers = Array.from(thElements).map(th => th.textContent.trim());
        }

        const trElements = table.querySelectorAll('tbody tr, tr');
        trElements.forEach((tr, index) => {
          const cells = Array.from(tr.querySelectorAll('td'));
          if (cells.length > 0) {
            rows.push(cells.map(c => c.textContent.trim().replace(/\s+/g, ' ')));
          } else if (headers.length === 0 && index === 0) {
            // Si la primera fila eran celdas y no th
            const rowThs = Array.from(tr.querySelectorAll('th'));
            if (rowThs.length > 0) {
              headers = rowThs.map(c => c.textContent.trim());
            }
          }
        });
      }
    } else {
      // Fallback robusto con expresiones regulares para Node / SSR / entornos de prueba
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = trRegex.exec(htmlContent)) !== null) {
        const rowContent = trMatch[1];
        const ths = [];
        const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        let thMatch;
        while ((thMatch = thRegex.exec(rowContent)) !== null) {
          ths.push(thMatch[1].replace(/<[^>]+>/g, '').trim());
        }

        const tds = [];
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let tdMatch;
        while ((tdMatch = tdRegex.exec(rowContent)) !== null) {
          tds.push(tdMatch[1].replace(/<[^>]+>/g, '').trim());
        }

        if (ths.length > 0 && headers.length === 0) {
          headers = ths;
        }
        if (tds.length > 0) {
          rows.push(tds);
        }
      }
    }

    // Si encontramos una estructura tabular con al menos 1 fila y cabecera
    if (rows.length > 0) {
      if (headers.length === 0 && rows.length > 1) {
        headers = rows.shift();
      }
      return {
        title,
        headers,
        rows
      };
    }
  } catch (err) {
    console.warn('[INSPIRATEC PDF] No se pudo parsear la tabla HTML de rúbrica:', err);
  }

  return null;
};

/**
 * Adapta y normaliza los datos del plan y de la sesión en un modelo estructurado.
 *
 * @param {Object} rawPlan - Datos del plan (desde Zustand o Firestore).
 * @param {string} rawMarkdown - Contenido Markdown directo si se pasa separado.
 * @param {Object} userProfile - Perfil del usuario autenticado (si está disponible).
 * @param {string} planId - Identificador único del plan (si está guardado).
 * @returns {Object} Documento curricular canónico normalizado.
 */
export const adaptPlanDocument = ({
  plan = {},
  markdown = '',
  userProfile = null,
  planId = null
}) => {
  const wizard = plan.wizardData || plan;

  // 1. Markdown base y limpieza de marcadores internos
  const sourceMarkdown = typeof markdown === 'string' && markdown.trim() !== ''
    ? markdown
    : (plan.markdown || plan.planGenerado || '');

  // Limpieza de marcadores de Gemini que no deben imprimirse nunca
  let cleanMarkdown = sourceMarkdown
    .replace(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/g, '')
    // Exclusión estricta de Grupo y Periodo Académico
    .replace(/(?:-\s*)?\*\*(?:Grupo(?:\(s\))?|Grado y Grupo|Periodo(?:\s*Académico)?|Periodo|Sede|Tutor(?:\s*\(IE\))?|Docente en formación|Fecha de aplicación):\*\*?[^\n]*\n?/gi, '')
    .replace(/\|\s*(?:Grupo(?:\(s\))?|Grado y Grupo|Periodo(?:\s*Académico)?|Periodo|Sede|Tutor(?:\s*\(IE\))?|Docente en formación|Fecha de aplicación):[^\n|]+\|?/gi, '')
    .replace(/(\*\*Grado:\*\*\s*10°?)\s*\([^\)]*\)(?:\s*—\s*\d+\s*estudiantes)?/gi, '$1')
    .trim();

  // 2. Título de la secuencia
  let tema = (wizard.tema || plan.tema || '').trim();
  if (!tema) {
    const titleMatch = cleanMarkdown.match(/^#+\s*(.+)$/m);
    if (titleMatch) {
      tema = titleMatch[1].replace(/^[0-9.\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+/u, '').trim();
    } else {
      tema = 'Secuencia Didáctica Curricular';
    }
  }

  // 3. Metadatos del docente e institución (reales)
  let docente = (wizard.docente || plan.docente || userProfile?.nombre || '').trim();
  if (docente === 'Docente' || docente === 'Docente Planificador') {
    docente = '';
  }

  let institucion = (wizard.institucion || plan.institucion || userProfile?.institucion || '').trim();

  let sede = (wizard.sede || plan.sede || userProfile?.sede || '').trim();
  let tutor = (wizard.tutor || plan.tutor || userProfile?.tutor || '').trim();
  let asignatura = (wizard.asignatura || plan.asignatura || '').trim();
  let grupo = '';

  // 4. Fecha de elaboración
  let fecha = (wizard.fecha || plan.fecha || '').trim();
  if (!fecha) {
    if (plan.createdAt?.toDate) {
      fecha = plan.createdAt.toDate().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (plan.createdAt && typeof plan.createdAt === 'string') {
      try {
        fecha = new Date(plan.createdAt).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        fecha = null;
      }
    }
  }

  // 5. Metadatos pedagógicos
  const grado = wizard.grado || plan.grado || '10°';
  const materia = wizard.materia || plan.materia || 'Matemáticas';
  const duracion = wizard.duracion || plan.duracion || '90 minutos (1 sesión continua)';
  const sesiones = wizard.sesiones || plan.sesiones || '';
  const numEstudiantes = wizard.numEstudiantes || plan.numEstudiantes || '';
  const recursos = wizard.recursos || plan.recursos || '';
  const metodologiaSTEAM = wizard.metodologiaSTEAM || plan.metodologiaSTEAM || '';
  const objetivos = wizard.objetivos || plan.objetivos || '';

  const estandaresMEN = Array.isArray(wizard.estandaresMEN)
    ? wizard.estandaresMEN.filter(Boolean)
    : (Array.isArray(plan.estandaresMEN) ? plan.estandaresMEN.filter(Boolean) : []);

  const inclusion = Array.isArray(wizard.inclusion)
    ? wizard.inclusion.filter(Boolean)
    : (Array.isArray(plan.inclusion) ? plan.inclusion.filter(Boolean) : []);

  const otrasNecesidades = (wizard.otrasNecesidades || plan.otrasNecesidades || '').trim();
  const formato = wizard.formato || plan.formato || 'Estructura estándar INSPIRATEC';

  // 6. Tratamiento de materiales complementarios
  const rawAnexos = Array.isArray(plan.recursosAnexos) 
    ? plan.recursosAnexos 
    : (Array.isArray(wizard.recursosAnexos) ? wizard.recursosAnexos : []);

  const rubricasTextuales = [];
  const materialesGenerados = [];

  const effectivePlanId = planId || plan.id || null;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  rawAnexos.forEach((recurso, index) => {
    if (!recurso || !recurso.title) return;

    const lowerTitle = (recurso.title || '').toLowerCase();
    const isRubrica = lowerTitle.includes('rúbrica') || lowerTitle.includes('rubrica') || recurso.tipo === 'rubrica';

    if (isRubrica && recurso.html) {
      const parsedRubric = extractRubricFromHtml(recurso.html, recurso.title);
      if (parsedRubric && parsedRubric.rows.length > 0) {
        rubricasTextuales.push(parsedRubric);
        return; // Incluida como sección de tabla
      }
    }

    // Material complementario con enlace funcional
    let accessUrl = null;
    let accessAction = 'Consultar en INSPIRATEC';

    if (effectivePlanId && baseUrl) {
      accessUrl = `${baseUrl}/editor?id=${encodeURIComponent(effectivePlanId)}`;
      accessAction = 'Abrir recurso en el Editor de INSPIRATEC';
    }

    materialesGenerados.push({
      id: index + 1,
      title: recurso.title,
      tipo: recurso.tipo || 'Recurso interactivo',
      accessUrl,
      accessAction,
      description: 'Recurso educativo interactivo generado por el co-docente de IA. Diseñado para ejecución y visualización activa en la plataforma INSPIRATEC.'
    });
  });

  return {
    id: effectivePlanId,
    tema,
    materia,
    grado,
    duracion,
    sesiones,
    numEstudiantes,
    recursos,
    metodologiaSTEAM,
    objetivos,
    estandaresMEN,
    inclusion,
    otrasNecesidades,
    formato,
    docente,
    institucion,
    sede,
    tutor,
    asignatura,
    grupo,
    fecha,
    cleanMarkdown,
    rubricasTextuales,
    materialesGenerados,
    hasCoverPageJustified: cleanMarkdown.length > 1800 || (rubricasTextuales.length > 0 && cleanMarkdown.length > 1200)
  };
};
