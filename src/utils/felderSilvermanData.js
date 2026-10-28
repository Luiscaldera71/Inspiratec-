/**
 * Modelo de Estilos de Aprendizaje y Enseñanza de Felder-Silverman (FSLSM)
 * 
 * NOTA DE RIGOR METODOLÓGICO Y CIENTÍFICO:
 * Este módulo contiene un instrumento exploratorio de autorreflexión pedagógica de 8 reactivos
 * estructurado sobre las 4 dimensiones continuas formuladas por Richard M. Felder y Linda K. Silverman (1988):
 * 1. Procesamiento: Activo / Reflexivo
 * 2. Percepción: Sensorial / Intuitivo
 * 3. Entrada: Visual / Verbal
 * 4. Comprensión: Secuencial / Global
 * 
 * ADVERTENCIA DE VALIDEZ PSICOMÉTRICA:
 * El instrumento formal y validado psicométricamente es el "Index of Learning Styles" (ILS) de 44 reactivos
 * desarrollado por Richard M. Felder y Barbara A. Soloman (1991/1997).
 * Esta versión de 8 reactivos es un PROTOTIPO FORMATIVO Y EXPLORATORIO para incentivar la autorreflexión
 * del docente sobre sus preferencias de mediación didáctica. No constituye un diagnóstico psicométrico formal
 * ni una evaluación cognitiva categórica, y sus resultados deben entenderse siempre como gradientes continuos
 * y flexibles dentro de los principios del Diseño Universal para el Aprendizaje (DUA).
 */

export const FELDER_SILVERMAN_META = {
  nombre: "Autodiagnóstico Exploratorio de Tendencias Pedagógicas (Felder-Silverman)",
  version: "1.0.0-prototipo-exploratorio",
  numPreguntas: 8,
  preguntasPorDimension: 2,
  referencias: [
    {
      autores: "Felder, R. M., & Silverman, L. K.",
      año: 1988,
      titulo: "Learning and Teaching Styles in Engineering Education",
      revista: "Engineering Education, 78(7), 674-681"
    },
    {
      autores: "Felder, R. M., & Soloman, B. A.",
      año: 1997,
      titulo: "Index of Learning Styles (ILS - 44 items)",
      fuente: "North Carolina State University"
    },
    {
      autores: "Caro, E.",
      año: 2015,
      titulo: "Sistema Tutor Inteligente Basado en Estilos de Aprendizaje y DUA",
      fuente: "Marco Teórico y Arquitectura Adaptativa"
    }
  ],
  avisoRigor: "Este cuestionario de 8 reactivos es un prototipo formativo de autorreflexión docente. No reemplaza el instrumento psicométrico formal ILS de 44 reactivos. Los resultados reflejan gradientes de preferencia flexibles, no capacidades cognitivas fijas ni etiquetas estáticas."
};

export const FELDER_META = FELDER_SILVERMAN_META;

export const FELDER_DIMENSIONES = {
  procesamiento: {
    id: "procesamiento",
    nombre: "Procesamiento de la Información",
    poloA: {
      id: "activo",
      nombre: "Activo",
      descripcion: "Aprende y enseña mediante la experimentación directa, el trabajo en equipo y la resolución colaborativa de retos prácticos.",
      estrategiaDUA: "Proporcionar opciones para la acción física y expresión multimodal (dinámicas en grupo, talleres aplicados)."
    },
    poloB: {
      id: "reflexivo",
      nombre: "Reflexivo",
      descripcion: "Aprende y enseña a través del análisis individual, la meditación previa y la formulación crítica antes de la ejecución.",
      estrategiaDUA: "Ofrecer pausas estructuradas de deliberación, autoevaluación guiada y bitácoras personales de aprendizaje."
    }
  },
  percepcion: {
    id: "percepcion",
    nombre: "Percepción de la Información",
    poloA: {
      id: "sensorial",
      nombre: "Sensorial",
      descripcion: "Inclinación hacia hechos tangibles, datos empíricos observables, procedimientos estructurados y casos reales.",
      estrategiaDUA: "Anclar los aprendizajes en contextos cotidianos auténticos y protocolos secuenciales comprobados."
    },
    poloB: {
      id: "intuitivo",
      nombre: "Intuitivo",
      descripcion: "Inclinación hacia la abstracción conceptual, la innovación metodológica, los principios teóricos y el descubrimiento de patrones.",
      estrategiaDUA: "Fomentar el pensamiento divergente, el planteamiento de hipótesis y la exploración de analogías conceptuales."
    }
  },
  entrada: {
    id: "entrada",
    nombre: "Canal de Entrada y Recepción",
    poloA: {
      id: "visual",
      nombre: "Visual",
      descripcion: "Recuerda y consolida saberes mediante diagramas, esquemas, mapas mentales, demostraciones y flujo gráfico.",
      estrategiaDUA: "Complementar con organizadores gráficos, infografías de síntesis y modelado visual de conceptos."
    },
    poloB: {
      id: "verbal",
      nombre: "Verbal",
      descripcion: "Recuerda y consolida saberes a través de la explicación oral, el diálogo discursivo, el debate y la lectura comentada.",
      estrategiaDUA: "Utilizar guías explicativas narradas, debates reflexivos y transcripciones enriquecidas."
    }
  },
  comprension: {
    id: "comprension",
    nombre: "Progresión de la Comprensión",
    poloA: {
      id: "secuencial",
      nombre: "Secuencial",
      descripcion: "Progresión lógica y lineal, construyendo el aprendizaje paso a paso asegurando cada premisa previa.",
      estrategiaDUA: "Desglosar metas en subobjetivos progresivos y listas de verificación metodológicas."
    },
    poloB: {
      id: "global",
      nombre: "Global",
      descripcion: "Comprensión holística y panorámica, captando primero el propósito general antes de detallar los componentes.",
      estrategiaDUA: "Exponer el marco general y el impacto del proyecto antes de abordar las fases particulares."
    }
  }
};

export const FELDER_PREGUNTAS = [
  // Dimensión: Procesamiento (Activo / Reflexivo)
  {
    id: 1,
    dimension: "procesamiento",
    enunciado: "Al abordar un nuevo marco conceptual o herramienta tecnológica en mi labor docente:",
    opciones: [
      {
        id: "1a",
        polo: "activo",
        texto: "Prefiero ensayar y experimentar directamente con la herramienta o discutirla con colegas de inmediato."
      },
      {
        id: "1b",
        polo: "reflexivo",
        texto: "Prefiero revisar la documentación a solas y analizar detenidamente sus implicaciones antes de probarla."
      }
    ]
  },
  {
    id: 2,
    dimension: "procesamiento",
    enunciado: "En la dinámica habitual que me resulta más fluida en el aula de clase:",
    opciones: [
      {
        id: "2a",
        polo: "activo",
        texto: "Priorizo actividades colaborativas donde los estudiantes debatan, construyan y ensayen en grupos activos."
      },
      {
        id: "2b",
        polo: "reflexivo",
        texto: "Priorizo momentos de reflexión pausada, lectura individual y análisis conceptual antes de debatir."
      }
    ]
  },

  // Dimensión: Percepción (Sensorial / Intuitivo)
  {
    id: 3,
    dimension: "percepcion",
    enunciado: "Al preparar o impartir una lección compleja a mis estudiantes:",
    opciones: [
      {
        id: "3a",
        polo: "sensorial",
        texto: "Me apoyo principalmente en datos concretos, hechos observables y procedimientos detallados del mundo real."
      },
      {
        id: "3b",
        polo: "intuitivo",
        texto: "Me apoyo principalmente en teorías generales, principios abstractos, interpretaciones y nuevos modelos."
      }
    ]
  },
  {
    id: 4,
    dimension: "percepcion",
    enunciado: "Ante un desafío o problema pedagógico imprevisto durante una clase:",
    opciones: [
      {
        id: "4a",
        polo: "sensorial",
        texto: "Recurro a soluciones prácticas previamente probadas y sustentadas en la experiencia directa."
      },
      {
        id: "4b",
        polo: "intuitivo",
        texto: "Busco idear un enfoque pedagógico novedoso y probar relaciones conceptuales no convencionales."
      }
    ]
  },

  // Dimensión: Canal de Entrada (Visual / Verbal)
  {
    id: 5,
    dimension: "entrada",
    enunciado: "Como recurso preferente para facilitar la comprensión de un concepto técnico:",
    opciones: [
      {
        id: "5a",
        polo: "visual",
        texto: "Prefiero usar infografías, esquemas conceptuales, diagramas de flujo y recursos gráficos ilustrativos."
      },
      {
        id: "5b",
        polo: "verbal",
        texto: "Prefiero basarme en explicaciones dialógicas estructuradas, lecturas dirigidas y argumentos verbales."
      }
    ]
  },
  {
    id: 6,
    dimension: "entrada",
    enunciado: "Al asistir a un taller o conferencia de actualización pedagógica, asimilo mejor:",
    opciones: [
      {
        id: "6a",
        polo: "visual",
        texto: "Las presentaciones con gráficos visuales, mapas conceptuales e imágenes demostrativas."
      },
      {
        id: "6b",
        polo: "verbal",
        texto: "La exposición oral elocuente del facilitador, los debates hablados y los textos escritos analizados."
      }
    ]
  },

  // Dimensión: Comprensión (Secuencial / Global)
  {
    id: 7,
    dimension: "comprension",
    enunciado: "Al planear y secuenciar las unidades de aprendizaje de mi asignatura:",
    opciones: [
      {
        id: "7a",
        polo: "secuencial",
        texto: "Diseño una ruta progresiva paso a paso, consolidando de manera lineal cada requisito antes del siguiente."
      },
      {
        id: "7b",
        polo: "global",
        texto: "Presento primero la visión panorámica general y el propósito holístico del proyecto antes de abordar partes."
      }
    ]
  },
  {
    id: 8,
    dimension: "comprension",
    enunciado: "Al evaluar la apropiación de un aprendizaje significativo en los estudiantes, me entusiasma cuando:",
    opciones: [
      {
        id: "8a",
        polo: "secuencial",
        texto: "Siguen el método lógico riguroso paso a paso, demostrando dominio ordenado de cada fase procedimental."
      },
      {
        id: "8b",
        polo: "global",
        texto: "Captan el cuadro completo y conectan espontáneamente el tema con saberes de otras asignaturas y contextos."
      }
    ]
  }
];

/**
 * Calcula los resultados de las respuestas seleccionadas
 * @param {Record<number, string>} respuestas - Objeto con { [preguntaId]: "poloId" }
 * @returns {Object} Diagnóstico calculado con dimensiones, porcentajes y gradientes
 */
export function calcularResultadosFelder(respuestas = {}) {
  const contestadas = Object.keys(respuestas).length;
  const esCompleto = contestadas === FELDER_PREGUNTAS.length;

  const dimensionesResultado = {};

  Object.entries(FELDER_DIMENSIONES).forEach(([dimKey, dimData]) => {
    const poloAId = dimData.poloA.id;
    const poloBId = dimData.poloB.id;

    let votosA = 0;
    let votosB = 0;

    FELDER_PREGUNTAS.filter(p => p.dimension === dimKey).forEach(p => {
      const seleccion = respuestas[p.id];
      if (seleccion === poloAId) votosA += 1;
      if (seleccion === poloBId) votosB += 1;
    });

    const totalDim = votosA + votosB;
    const porcentajeA = totalDim > 0 ? Math.round((votosA / totalDim) * 100) : 50;
    const porcentajeB = totalDim > 0 ? Math.round((votosB / totalDim) * 100) : 50;

    // Gradiente numérico de -2 a +2 (-2: poloB total, 0: balance, +2: poloA total)
    const balanceDiferencial = votosA - votosB;

    let interpretacionGradiente = "";
    let poloDominante = "equilibrado";

    if (balanceDiferencial === 0) {
      poloDominante = "equilibrado";
      interpretacionGradiente = `Preferencia balanceada (${porcentajeA}% - ${porcentajeB}%). Demuestras flexibilidad para alternar fluidamente entre estrategias ${dimData.poloA.nombre.toLowerCase()}s y ${dimData.poloB.nombre.toLowerCase()}s según el contexto pedagógico.`;
    } else if (balanceDiferencial > 0) {
      poloDominante = poloAId;
      const intensidad = balanceDiferencial === 2 ? "notoria" : "moderada";
      interpretacionGradiente = `Inclinación ${intensidad} hacia el enfoque ${dimData.poloA.nombre} (${porcentajeA}%). Es una valiosa fortaleza que puedes complementar integrando momentos ${dimData.poloB.nombre.toLowerCase()}s para atender la diversidad de tu aula.`;
    } else {
      poloDominante = poloBId;
      const intensidad = balanceDiferencial === -2 ? "notoria" : "moderada";
      interpretacionGradiente = `Inclinación ${intensidad} hacia el enfoque ${dimData.poloB.nombre} (${porcentajeB}%). Constituye una fortaleza de mediación que puedes enriquecer incorporando actividades ${dimData.poloA.nombre.toLowerCase()}s en articulación con el DUA.`;
    }

    dimensionesResultado[dimKey] = {
      id: dimKey,
      nombre: dimData.nombre,
      poloA: {
        id: poloAId,
        nombre: dimData.poloA.nombre,
        votos: votosA,
        porcentaje: porcentajeA,
        descripcion: dimData.poloA.descripcion,
        estrategiaDUA: dimData.poloA.estrategiaDUA
      },
      poloB: {
        id: poloBId,
        nombre: dimData.poloB.nombre,
        votos: votosB,
        porcentaje: porcentajeB,
        descripcion: dimData.poloB.descripcion,
        estrategiaDUA: dimData.poloB.estrategiaDUA
      },
      balanceDiferencial,
      poloDominante,
      interpretacionGradiente
    };
  });

  return {
    contestadas,
    totalPreguntas: FELDER_PREGUNTAS.length,
    esCompleto,
    dimensiones: dimensionesResultado,
    timestamp: new Date().toISOString()
  };
}
