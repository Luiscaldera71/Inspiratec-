import { resolveEffectiveTemplate } from './templates/genericTemplates';
import { resolveRealIdentification, injectRealIdentificationIntoPlan } from './templates/identificationResolver';
import { useAppStore } from '../store/useAppStore';
import { getPedagogicalDna, formatDnaPromptDirective } from './pedagogicalDnaService';
import { injectShareBarIntoHtml } from './materials/index.js';
import { generateCreativeHtml } from './materials/creativeHtml.js';
import { getResourceDef, resolveResourceKey } from './materials/resourceCatalog.js';
import { buildAulaInteractivaHtml, AULA_CONTENT_SCHEMA } from './materials/aulaInteractiva.js';
import { buildMenDirective, checkMenAlignment } from './templates/menFrameworks.js';
import { normalizeQuestions } from './sessions/sessionLogic.js';

/**
 * AI Service para INSPIRATEC
 * Gestión de llamadas a Google Gemini con cascada de modelos inteligente,
 * recuperación automática ante saturación (503), cuotas (429) y obsolescencia (404).
 */

// Cascada de modelos disponibles y soportados para v1beta
const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash'
];

let activeWorkingModel = CANDIDATE_MODELS[0];

/**
 * Llamada centralizada y resiliente a la API de Gemini.
 * Realiza fallback automático entre modelos soportados y reintentos ante fallas transitorias.
 */
export const callGeminiApi = async (apiKey, requestBody, maxRetriesPerModel = 2) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  // Ordenamos los modelos para probar primero el último que funcionó exitosamente
  const modelsToTry = [
    activeWorkingModel,
    ...CANDIDATE_MODELS.filter(m => m !== activeWorkingModel)
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        // Si el modelo no existe o no soporta el método (404), pasamos de inmediato al siguiente modelo
        if (response.status === 404) {
          console.warn(`[Inspiratec AI] El modelo ${model} no está disponible (404). Probando alternativa...`);
          break; // Salta al siguiente modelo
        }

        // Si hay congestión (503) o límite de tasa temporal (429)
        if (response.status === 503 || response.status === 429) {
          console.warn(`[Inspiratec AI] Modelo ${model} devolvió ${response.status} (intento ${attempt + 1}).`);
          if (attempt < maxRetriesPerModel - 1) {
            await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
            continue;
          }
          // Si agotamos intentos con este modelo, pasamos al siguiente candidato
          break;
        }

        const data = await response.json();

        if (!response.ok) {
          const apiMsg = data.error?.message || `Error HTTP ${response.status}`;
          lastError = new Error(apiMsg);
          
          // Si es error de API Key inválida, no tiene sentido seguir probando otros modelos
          if (response.status === 400 && apiMsg.includes('API_KEY_INVALID')) {
            throw new Error('La API Key proporcionada no es válida. Por favor, verifica tu clave de Google AI Studio.');
          }
          break; // Prueba siguiente modelo
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          // Guardamos el modelo funcional como preferido para llamadas futuras
          activeWorkingModel = model;
          return data.candidates[0].content.parts[0].text;
        }

        if (data.promptFeedback?.blockReason) {
          throw new Error(`El contenido fue bloqueado por políticas de seguridad: ${data.promptFeedback.blockReason}`);
        }

        lastError = new Error('Respuesta sin texto generado por el modelo.');
      } catch (err) {
        lastError = err;
        if (err.message.includes('API Key no configurada') || err.message.includes('no es válida')) {
          throw err;
        }
        // Error de red
        if (attempt < maxRetriesPerModel - 1) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }
  }

  throw new Error(`Error en el servicio de IA: ${lastError?.message || 'No fue posible conectar con ningún modelo de Gemini.'}`);
};

/**
 * Prueba de conexión a la API de Gemini
 */
export const testApiConnection = async (apiKey) => {
  try {
    const result = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: "Responde únicamente con: OK" }] }],
      generationConfig: { maxOutputTokens: 10 }
    });
    return Boolean(result && result.length > 0);
  } catch (error) {
    console.warn("[Inspiratec AI] Error al probar conexión:", error.message);
    return false;
  }
};

/**
 * Sugerencia de objetivos de aprendizaje basada en el contexto curricular
 */
export const suggestObjectives = async (apiKey, wizardData) => {
  const reglas = buildMenDirective(wizardData.materia, wizardData.grado);
  const prompt = `Como experto pedagogo alineado con los lineamientos oficiales del MEN de Colombia, sugiere propósitos y objetivos de aprendizaje (1 o 2 párrafos cortos y precisos) para una clase con el siguiente contexto:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales y Pedagógicos: ${reglas}
Metodología: ${wizardData.metodologiaSTEAM}
Recursos: ${wizardData.recursos}
Responde SOLO con el texto de los objetivos formativos coherentes con las orientaciones, sin saludos ni formato markdown adicional.`;

  try {
    const text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    });
    return text.trim();
  } catch (error) {
    throw new Error('Error al sugerir objetivos: ' + error.message);
  }
};

/**
 * Sugerencia de estándares MEN y DBA
 */
export const suggestStandards = async (apiKey, wizardData) => {
  const reglas = buildMenDirective(wizardData.materia, wizardData.grado);
  const prompt = `Como experto curricular en Colombia, sugiere qué competencias, estándares MEN y DBA aplican para esta clase:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales: ${reglas}
Objetivos: ${wizardData.objetivos}

INSTRUCCIÓN CRÍTICA DE RIGOR: No inventes códigos ni números ficticios de estándares o DBA. Cita únicamente referentes curriculares reales y pertinentes del Ministerio de Educación Nacional de Colombia (MEN) y Colombia Aprende. Si un DBA no aplica de forma exacta al grado o tema, no lo fuerces ni inventes numeraciones.
Responde SOLO con la lista de componentes y estándares aplicables, sin saludos.`;

  try {
    const text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
    });
    return text.trim();
  } catch (error) {
    throw new Error('Error al sugerir estándares: ' + error.message);
  }
};

/**
 * Generación completa del plan de clase
 */
export const generatePlan = async (apiKey, wizardData, customTemplates = [], userProfile = null) => {
  // Obtener perfil del usuario del store si no fue provisto como argumento
  const effectiveProfile = userProfile || useAppStore?.getState?.()?.userProfile || null;
  const realData = resolveRealIdentification(wizardData, effectiveProfile);

  // Resuelve la plantilla efectiva respetando que los formatos propios de docentes prevalecen estructuralmente
  const effectiveTemplate = resolveEffectiveTemplate(wizardData, customTemplates, effectiveProfile);
  const formatInstructions = effectiveTemplate.instrucciones;

  // Carga del ADN Pedagógico y memoria contextual si está habilitado
  let directivaAdn = '';
  if (wizardData?.aplicarAdnPedagógico !== false) {
    try {
      const targetUid = effectiveProfile?.uid || useAppStore?.getState?.()?.userId || 'anon';
      const dna = await getPedagogicalDna(targetUid);
      directivaAdn = formatDnaPromptDirective(dna, wizardData);
    } catch (e) {
      console.warn("No se pudo cargar el ADN pedagógico para el prompt:", e);
    }
  }

  const orientacionDisciplinar = `
ORIENTACIÓN DIDÁCTICA Y DISCIPLINAR CRÍTICA:
1. SELECCIÓN PERTINENTE: Los elementos exigidos en la ALINEACIÓN CON EL MEN son obligatorios y deben verse en el plan. Los demás apartados disciplinares (por ejemplo: DBA cuando no exista para el grado, representaciones matemáticas específicas, errores frecuentes, precauciones de seguridad de laboratorio, género textual, tipos de evidencias o herramientas digitales/manipulativas) NO deben ser campos obligatorios universales mecánicos. Selecciona y desarrolla ÚNICAMENTE los apartados que sean directamente pertinentes al objetivo formativo de la clase, el grado escolar (${realData.grado || 'del nivel'}), el contexto real y los recursos disponibles (${wizardData.recursos || 'especificados'}). Si un apartado no aplica al tema concreto, no lo fuerces.
2. RIGOR CURRICULAR SIN INVENTAR: NO inventes estándares ni códigos ficticios de DBA. Fundaméntate estrictamente en los referentes reales y vigentes del Ministerio de Educación Nacional de Colombia (MEN) y Colombia Aprende. Si no dispones del código exacto de un DBA, describe el aprendizaje formativo real sin crear números inventados.
3. DATOS DE IDENTIFICACIÓN REALES: En la sección '### Identificación', debes transcribir fielmente los datos reales provistos sin modificarlos ni reemplazarlos por texto ficticio o nombres de ejemplo.
4. ORGANIZACIÓN PEDAGÓGICA Y TIEMPOS: Presenta una estructura coherente y jerárquica con instrucciones concretas, diferenciando las orientaciones del docente y las acciones esperadas de los estudiantes. Si se indican tiempos por fase, asegúrate de que sean realistas y que la suma de los momentos corresponda exactamente a la duración disponible (${realData.duracionTexto}).
5. NOTACIÓN MATEMÁTICA Y FÓRMULAS: En caso de incluir fórmulas, ecuaciones o expresiones de cálculo, utiliza delimitadores estándar ($...$ o $$...$$) o símbolos matemáticos directos (×, ÷, ±, ², ³). No utilices barras invertidas duplicadas ni escapes de código innecesarios.
5b. INNOVACIÓN Y CREATIVIDAD (OBLIGATORIO): Diseña una clase original, no una plantilla repetida. Elige una situación-reto, historia o misión que enganche al grupo y proponla desde el inicio; evita el esquema predecible "explicación del docente, ejercicio y cierre". Propón al menos una experiencia distinta (por ejemplo: investigación de campo, juego de roles, laboratorio casero, reto de diseño, debate, creación de un producto, estaciones, aprendizaje desconectado o gamificado) acorde al tema, al grado y a los recursos disponibles. Incluye trabajo en equipo real: define roles rotativos con funciones concretas, un producto o decisión colectiva y una forma de evaluar tanto el resultado como la colaboración. Si el docente indicó metodología, recursos u objetivos, respétalos y llévalos a un diseño creativo; no inventes datos que el docente no dio.
6. FORMATO DE RESPUESTA: Entrega directamente el documento pedagógico estructurado en Markdown legible. NO envuelvas todo el plan en bloques de código con triple comilla invertida (\`\`\`markdown).
7. RECURSOS GENERABLES POR LA IA (OBLIGATORIO): Cada vez que el plan indique que se va a usar, proyectar, mostrar o sugerir un recurso digital o visual (por ejemplo: un paso a paso, una animación, un simulador, un diagrama, una infografía, un juego, un OVA, una línea de tiempo, una actividad interactiva), debes escribir justo en esa celda o línea el marcador [GENERATE_IMAGE: "descripción detallada del recurso"]. La plataforma lo convertirá en un botón para que el docente genere ese recurso en HTML, CSS y JavaScript, lo vea en pantalla y lo descargue. Incluye entre 1 y 3 marcadores por plan, en los momentos de la secuencia donde más aporten (inicio/motivación, desarrollo y práctica). Prefiere recursos tipo OVA o simulador que funcionen en un solo archivo HTML y sirvan para proyectar y compartir con estudiantes. NO sugieras videos externos, imágenes de internet ni software que requiera instalación. La descripción dentro del marcador debe explicar qué muestra, qué pasos o interacciones tiene y qué debe aprender el estudiante (ejemplo: [GENERATE_IMAGE: "Simulador paso a paso de cómo preparar un sándwich para explicar algoritmos: el estudiante ordena los pasos, ve el resultado y descubre qué pasa si cambia el orden"]). No uses comillas dobles dentro de la descripción.
`;

  const reglas = buildMenDirective(wizardData.materia, realData.grado || wizardData.grado);
  const prompt = `Actúa como un planificador experto en el área de ${wizardData.materia}. Tus lineamientos legales son: ${reglas}. Genera un plan de clase estructurado en formato Markdown con la siguiente información:
Tema: ${wizardData.tema}
Institución: ${realData.institucion}
Área: ${realData.area}
Grado: ${realData.grado}
Docente: ${realData.docente}
Duración: ${realData.duracionTexto}
Estudiantes: ${wizardData.numEstudiantes || 'No especificado'}
Recursos: ${wizardData.recursos}
Metodología: ${wizardData.metodologiaSTEAM || 'Libre: elige la más pertinente y creativa para el tema'}
Objetivos: ${wizardData.objetivos}
Estándares MEN: ${Array.isArray(wizardData.estandaresMEN) ? wizardData.estandaresMEN.join(', ') : (wizardData.estandaresMEN || '')}
Inclusión (DUA): ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : ''} ${wizardData.otrasNecesidades || ''}

${directivaAdn}
${orientacionDisciplinar}

${formatInstructions}`;

  try {
    const planText = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1, maxOutputTokens: 16384 }
    });

    const stripFences = (txt) => {
      let out = (txt || '').trim();
      if (out.startsWith('```markdown')) {
        out = out.replace(/^```markdown\s*/i, '').replace(/```\s*$/i, '');
      } else if (out.startsWith('```')) {
        out = out.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
      }
      return out;
    };

    let cleaned = stripFences(planText);

    // Verificación de alineación con el MEN: si faltan elementos exigidos para el área, se corrige una vez
    const { faltantes } = checkMenAlignment(cleaned, wizardData.materia);
    if (faltantes.length > 0) {
      try {
        const repairPrompt = `Eres un revisor curricular del Ministerio de Educación Nacional de Colombia. El siguiente plan de clase de ${wizardData.materia} (grado ${realData.grado || wizardData.grado}) no evidencia estos elementos exigidos por los referentes oficiales: ${faltantes.join('; ')}.

${reglas}

Devuelve el plan COMPLETO integrando esos elementos dentro de la estructura y los encabezados existentes (no cambies el orden de las secciones ni elimines contenido, marcadores [GENERATE_IMAGE: "..."] ni datos de identificación). Responde solo con el plan en Markdown, sin bloques de código.

PLAN:
${cleaned}`;
        const repaired = stripFences(await callGeminiApi(apiKey, {
          contents: [{ parts: [{ text: repairPrompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 16384 }
        }));
        // Solo se acepta la corrección si conserva la extensión del plan y reduce las carencias
        if (repaired.length >= cleaned.length * 0.85 && checkMenAlignment(repaired, wizardData.materia).faltantes.length < faltantes.length) {
          cleaned = repaired;
        }
      } catch (repairError) {
        console.warn('[INSPIRATEC] No se pudo completar la alineación con el MEN:', repairError.message);
      }
    }

    // Inyección de garantía: asegura que la sección de Identificación refleje los datos reales del usuario
    cleaned = injectRealIdentificationIntoPlan(cleaned, realData);

    return cleaned.trim();
  } catch (error) {
    throw new Error('Error al generar el plan: ' + error.message);
  }
};

/**
 * Modificación del plan existente mediante chat (Soporta Modo Directo y Modo Socrático Guiado)
 * @param {string} apiKey - Clave API de Gemini
 * @param {string} planActual - Texto markdown del plan actual
 * @param {string} instruccion - Mensaje o comando del docente
 * @param {'direct' | 'socratic'} [modo='direct'] - Modo de mediación pedagógica
 * @param {Array} [historial=[]] - Historial reciente de la conversación
 * @returns {Promise<{ tipo: string, planModificado: string|null, textoDialogo: string }>}
 */
export const modifyPlan = async (apiKey, planActual, instruccion, modo = 'direct', historial = []) => {
  if (modo === 'socratic') {
    const formattedHistory = (historial || [])
      .slice(-4)
      .map(h => `${h.role === 'user' ? 'Docente' : 'Tutor Socrático'}: ${h.text}`)
      .join('\n');

    const prompt = `Actúa como un Tutor Pedagógico y Co-docente Experto aplicando la Táctica Socrática y el Modelo de Agencia Compartida (Caro 2015, Zimmerman & Nkambou).
Tu rol en este modo NO es reescribir ciegamente el plan ante una orden escueta, sino dialogar reflexivamente con el docente para potenciar su criterio didáctico antes o durante la modificación.

PLAN DE CLASE ACTUAL:
${planActual}

${formattedHistory ? `HISTORIAL DE DIÁLOGO PREVIO:\n${formattedHistory}\n` : ''}

NUEVA INTERVENCIÓN DEL DOCENTE:
"${instruccion}"

INSTRUCCIONES DE RESPUESTA:
1. Realiza una intervención dialogal reflexiva (máximo 2 párrafos concisos) donde:
   - Valides el propósito pedagógico de la solicitud.
   - Formules 1 o 2 preguntas reflexivas socráticas (por ejemplo: articulación con conocimientos previos, mitigación de barreras DUA/PIAR, dosificación del tiempo o evaluación formativa).
   - Sugieras cómo se puede concretar el ajuste en la secuencia didáctica.
2. Si la solicitud amerita un ajuste concreto al plan de clase, incluye al final una propuesta de plan actualizado delimitada EXACTAMENTE entre las etiquetas:
<<<PLAN_PROPUESTO>>>
[Aquí el plan completo en Markdown actualizado con tu sugerencia integrada]
<<<FIN_PLAN_PROPUESTO>>>
Si la intervención del docente es una consulta conceptual o no amerita cambiar el texto aún, omite las etiquetas delimitadas.`;

    try {
      let text = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 8192 }
      });

      const planRegex = /<<<PLAN_PROPUESTO>>>([\s\S]*?)<<<FIN_PLAN_PROPUESTO>>>/;
      const match = text.match(planRegex);
      let planPropuesto = null;
      let textoDialogo = text;

      if (match) {
        planPropuesto = match[1].replace(/```markdown\s*/i, '').replace(/```\s*$/i, '').trim();
        textoDialogo = text.replace(planRegex, '').trim();
      }

      return {
        tipo: 'socratic',
        textoDialogo,
        planModificado: planPropuesto
      };
    } catch (error) {
      throw new Error('Error en el diálogo socrático: ' + error.message);
    }
  }

  // Modo Directo (Comportamiento rápido tradicional)
  const prompt = `Eres un asistente experto en la edición de planes de clase. El usuario te proporcionará un plan en formato Markdown y te dará instrucciones para modificarlo. Tu respuesta DEBE SER ÚNICAMENTE el plan de clase completo y actualizado en formato Markdown. No incluyas saludos ni explicaciones. Solo el código Markdown.

Este es el plan actual:
${planActual}

Aplica esta instrucción: ${instruccion}`;

  try {
    let text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 8192 }
    });
    if (text.startsWith('```markdown')) {
      text = text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    const cleanMarkdown = text.trim();
    return {
      tipo: 'direct',
      planModificado: cleanMarkdown,
      textoDialogo: 'He actualizado el plan de clase según tu indicación directa. Revisa los cambios reflejados en el documento.'
    };
  } catch (error) {
    throw new Error('Error al modificar el plan: ' + error.message);
  }
};


/**
 * Extrae metadatos pedagógicos del plan de clase para contextualizar materiales
 */
const extractPlanMetadata = (planMarkdown = '') => {
  let title = '';
  let subject = '';
  let grade = '';

  const titleMatch = planMarkdown.match(/#\s*(?:Plan de Clase:?|Secuencia Didáctica:?)\s*([^\n\r]+)/i) ||
                     planMarkdown.match(/\*\*Tema(?:\s*o\s*Contenido)?:\*\*\s*([^\n\r|]+)/i) ||
                     planMarkdown.match(/Tema:\s*([^\n\r|]+)/i);
  if (titleMatch && titleMatch[1]) title = titleMatch[1].trim();

  const subjectMatch = planMarkdown.match(/\*\*Área(?:\/Asignatura)?:\*\*\s*([^\n\r|]+)/i) ||
                       planMarkdown.match(/Área:\s*([^\n\r|]+)/i);
  if (subjectMatch && subjectMatch[1]) subject = subjectMatch[1].trim();

  const gradeMatch = planMarkdown.match(/\*\*Grado:\*\*\s*([^\n\r|]+)/i) ||
                     planMarkdown.match(/Grado:\s*([^\n\r|]+)/i);
  if (gradeMatch && gradeMatch[1]) grade = gradeMatch[1].trim();

  return { title, subject, grade };
};

/**
 * Generación de un recurso HTML del catálogo (ver materials/resourceCatalog.js).
 * Todo recurso es diseñado a medida por la IA a partir del plan de clase; si la IA falla se
 * informa el error y NO se entrega contenido de reemplazo.
 * El tipo "aula_interactiva" parte de una plantilla base de pizarra que la IA solo llena con contenido.
 */
export const generateComplementaryMaterial = async (apiKey, planActual, type, contextoEspecifico = '') => {
  const meta = extractPlanMetadata(planActual);
  const typeKey = resolveResourceKey(type);
  const def = getResourceDef(typeKey);
  const brief = def?.brief
    || `Un recurso interactivo con una función didáctica clara para el tema de la clase${typeKey ? ` (tipo: ${typeKey})` : ''}.`;

  const context = [
    meta.title && `Tema: ${meta.title}`,
    meta.subject && `Área: ${meta.subject}`,
    meta.grade && `Grado: ${meta.grade}`,
    contextoEspecifico && `Indicaciones específicas: ${contextoEspecifico}`,
    `PLAN DE CLASE:\n${planActual}`
  ].filter(Boolean).join('\n');

  try {
    let html;
    if (def?.plantilla && typeKey === 'aula_interactiva') {
      html = await generateAulaInteractiva(apiKey, context, meta);
    } else {
      html = await generateCreativeHtml({ callApi: callGeminiApi, apiKey, brief, typeKey, context });
    }
    return injectShareBarIntoHtml(html, { title: meta.title, subject: meta.subject, grade: meta.grade });
  } catch (error) {
    throw new Error('Error al generar el recurso: ' + error.message);
  }
};

/** Pide a la IA solo el contenido del aula (JSON) y lo vuelca en la plantilla de pizarra. */
async function generateAulaInteractiva(apiKey, context, meta) {
  const prompt = `Eres diseñador instruccional. A partir del plan de clase, prepara el CONTENIDO de un aula interactiva (pizarra digital para proyectar). No escribas HTML.
${AULA_CONTENT_SCHEMA}

${context}`;

  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192, responseMimeType: 'application/json' }
    });
    try {
      const json = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim());
      return buildAulaInteractivaHtml({
        ...json,
        titulo: json.titulo || meta.title,
        area: meta.subject,
        grado: meta.grade
      });
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error(`La IA no entregó un contenido válido para el aula (${lastError?.message}). Intenta de nuevo.`);
}

/**
 * Genera un recurso educativo interactivo a medida (OVA, simulador, juego, infografía) a partir
 * de la descripción que la IA dejó en el plan de clase.
 *
 * @param {string} apiKey - Clave API de Google AI Studio / Gemini
 * @param {string} prompt - Descripción del recurso pedagógico interactivo a generar
 * @param {Object} [planContext] - tema, grado y área del plan
 * @returns {Promise<string>} HTML completo listo para embeber en un iframe o descargar
 */
export const generateHtmlResource = async (apiKey, prompt, planContext = {}) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  const context = [
    planContext.tema && `Tema de la clase: ${planContext.tema}`,
    planContext.grado && `Grado: ${planContext.grado}`,
    planContext.area && `Área: ${planContext.area}`
  ].filter(Boolean).join('\n');

  try {
    const html = await generateCreativeHtml({ callApi: callGeminiApi, apiKey, brief: prompt, context });
    return injectShareBarIntoHtml(html, {
      title: prompt.slice(0, 45),
      subject: planContext.area || ''
    });
  } catch (error) {
    throw new Error('Error al generar recurso interactivo: ' + error.message);
  }
};

/**
 * Genera las preguntas de una evaluación a partir del plan de clase.
 * Devuelve preguntas en el formato del constructor (con la respuesta correcta); si la IA falla
 * se lanza un error, nunca se entregan preguntas de relleno.
 *
 * @param {Object} opciones - { cantidad, tipos: ['opcion','vf','abierta'], dificultad }
 */
export const generateEvaluationQuestions = async (apiKey, planActual, opciones = {}) => {
  const cantidad = Math.max(1, Math.min(30, parseInt(opciones.cantidad, 10) || 8));
  const tipos = (opciones.tipos && opciones.tipos.length ? opciones.tipos : ['opcion', 'vf']);
  const dificultad = opciones.dificultad || 'mixta';
  const meta = extractPlanMetadata(planActual);

  const prompt = `Eres un docente experto en evaluación formativa. Con base EXCLUSIVAMENTE en el siguiente plan de clase, redacta ${cantidad} preguntas para evaluar si los estudiantes comprendieron lo que se trabajó en la clase.
Tipos permitidos: ${tipos.join(', ')} (opcion = selección múltiple con una sola respuesta correcta; vf = verdadero o falso; abierta = respuesta escrita corta).
Dificultad: ${dificultad}. Nivel adecuado al grado${meta.grade ? ` ${meta.grade}` : ''}. Varía las preguntas: recordar, comprender, aplicar y analizar. Evita ambigüedades, las opciones incorrectas deben ser plausibles y no inventes datos que no estén en el plan.
Devuelve ÚNICAMENTE un arreglo JSON (sin markdown) con objetos así:
[
  { "tipo": "opcion", "enunciado": "texto", "opciones": ["A", "B", "C", "D"], "correcta": 0, "puntos": 1 },
  { "tipo": "vf", "enunciado": "afirmación", "correcta": true, "puntos": 1 },
  { "tipo": "abierta", "enunciado": "pregunta", "criterio": "qué debería incluir una buena respuesta", "puntos": 2 }
]
"correcta" en opcion es el índice de la opción correcta (desde 0).

PLAN DE CLASE:
${planActual}`;

  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192, responseMimeType: 'application/json' }
      });
      const json = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim());
      const lista = Array.isArray(json) ? json : (Array.isArray(json?.preguntas) ? json.preguntas : []);
      const { preguntas, clave } = normalizeQuestions(lista.filter(q => tipos.includes(q?.tipo)));
      // Se devuelve en el formato editable (con la respuesta) para que el docente pueda revisar y ajustar
      return preguntas.map(q => ({
        ...q,
        correcta: q.tipo === 'vf' ? clave[q.id] === 0 : (q.tipo === 'opcion' ? clave[q.id] : undefined),
        criterio: q.tipo === 'abierta' ? (clave[q.id] || '') : undefined
      }));
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error(`La IA no entregó preguntas válidas (${lastError?.message}). Intenta de nuevo.`);
};