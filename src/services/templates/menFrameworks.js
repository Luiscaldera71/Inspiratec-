/**
 * menFrameworks.js
 * Marco de referencia del Ministerio de Educación Nacional (MEN) de Colombia por área.
 *
 * Cada área declara los documentos rectores, la estructura que el MEN exige a un plan
 * pertinente y los elementos que el plan generado debe evidenciar. Con ello:
 *  1. el prompt recibe una directiva específica del área y del grupo de grados (sin inventar códigos);
 *  2. el plan generado se verifica contra esos elementos y, si falta alguno, se corrige.
 *
 * Referentes consultados: Guía 30 (2008) y Orientaciones curriculares de Tecnología e Informática (2022),
 * Estándares Básicos de Competencias (Matemáticas, Lenguaje, Ciencias Naturales y Sociales),
 * Lineamientos curriculares, Guía 22 (Inglés), Derechos Básicos de Aprendizaje (DBA).
 */

/** Grupo de grados que usan los Estándares Básicos de Competencias y la Guía 30. */
export function getGradeGroup(grado = '') {
  const m = String(grado).match(/\d{1,2}/);
  if (!m) return '';
  const n = parseInt(m[0], 10);
  if (n >= 1 && n <= 3) return '1° a 3°';
  if (n <= 5) return '4° a 5°';
  if (n <= 7) return '6° a 7°';
  if (n <= 9) return '8° a 9°';
  if (n <= 11) return '10° a 11°';
  return '';
}

const NO_INVENTAR = 'No inventes códigos, números de DBA ni textos de estándares: si no recuerdas con certeza el estándar o DBA exacto, descríbelo con tus palabras indicando el grupo de grados y escribe "verificar en el documento oficial del MEN".';

export const MEN_FRAMEWORKS = {
  tecnologia: {
    area: 'Tecnología e Informática',
    aliases: ['tecnolog', 'informát', 'informat'],
    referentes: [
      'Orientaciones generales para la educación en tecnología, Guía 30 (MEN, 2008)',
      'Orientaciones curriculares para el área de Tecnología e Informática en educación básica y media (MEN, 2022)'
    ],
    directiva: `El plan debe ser coherente con la Guía 30 y las Orientaciones curriculares de Tecnología e Informática (MEN, 2022):
- Declara UNO o más de los cuatro componentes de la Guía 30 con su nombre oficial: "Naturaleza y evolución de la tecnología", "Apropiación y uso de la tecnología", "Solución de problemas con tecnología" y "Tecnología y sociedad". Los componentes son interconectados: si la actividad toca otro, señálalo.
- Redacta la competencia del componente para el grupo de grados indicado (la estructura del MEN es competencia + desempeños por componente y grupo de grados) y define evidencias de desempeño observables.
- La educación en tecnología es alfabetización tecnológica: comprender, evaluar, usar y transformar artefactos, procesos y sistemas; no es solo manejar herramientas.
- Si trabajas "Solución de problemas con tecnología", la secuencia debe recorrer el proceso de diseño: identificar la necesidad o problema, buscar y seleccionar información, generar y jerarquizar ideas, construir o simular el prototipo y evaluarlo para proponer mejoras.
- Si trabajas informática o pensamiento computacional, puede hacerse con o sin computador (actividades desconectadas) y debe vincularse a un problema con sentido.
- Incluye la dimensión ética y de responsabilidad (seguridad, privacidad, ambiente, equidad de acceso) pertinente al tema.
- Evalúa de manera formativa por competencias, con evidencias y criterios claros. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'componente', etiqueta: 'componente oficial de la Guía 30', re: /naturaleza y evoluci[oó]n|apropiaci[oó]n y uso|soluci[oó]n de problemas con tecnolog|tecnolog[ií]a y sociedad/i },
      { id: 'competencia', etiqueta: 'competencia', re: /competencia/i },
      { id: 'evidencia', etiqueta: 'evidencias de desempeño', re: /evidencia|desempe[nñ]o/i },
      { id: 'etica', etiqueta: 'dimensión ética, de seguridad o ambiental', re: /[eé]tic|responsab|seguridad|privacidad|sostenib|ambient|equidad/i },
      { id: 'evaluacion', etiqueta: 'criterios de evaluación', re: /criterios? de (evaluaci[oó]n|logro)|r[uú]brica|evaluaci[oó]n/i }
    ]
  },

  matematicas: {
    area: 'Matemáticas',
    aliases: ['matem'],
    referentes: [
      'Lineamientos Curriculares de Matemáticas (MEN, 1998)',
      'Estándares Básicos de Competencias en Matemáticas (MEN, 2006)',
      'Derechos Básicos de Aprendizaje de Matemáticas (MEN)'
    ],
    directiva: `El plan debe ser coherente con los Estándares Básicos de Competencias en Matemáticas y los Lineamientos Curriculares:
- Identifica el pensamiento predominante entre los cinco del MEN: numérico, espacial, métrico, aleatorio (probabilístico) o variacional, y su sistema asociado; articula otro pensamiento solo si el tema lo exige.
- Los procesos generales de la actividad matemática deben verse en la secuencia: formular y resolver problemas, modelar procesos y fenómenos de la realidad, comunicar, razonar, y formular, comparar y ejercitar procedimientos y algoritmos. Indica cuáles se desarrollan y en qué momento.
- Parte de una situación problema contextualizada (de la vida cotidiana, de otras ciencias o de las matemáticas mismas), no de un algoritmo presentado sin sentido.
- Redacta el estándar para el grupo de grados indicado (los estándares se formulan por grupos de grados: 1° a 3°, 4° a 5°, 6° a 7°, 8° a 9° y 10° a 11°) y el DBA solo si existe con certeza para ese grado y tema.
- Prevé errores frecuentes, varias representaciones (verbal, tabular, gráfica, simbólica) y evaluación formativa del razonamiento y la argumentación, no solo del resultado. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'pensamiento', etiqueta: 'pensamiento matemático (numérico, espacial, métrico, aleatorio o variacional)', re: /num[eé]rico|espacial|m[eé]trico|aleatorio|variacional|probabil/i },
      { id: 'problema', etiqueta: 'situación problema contextualizada', re: /situaci[oó]n[- ]problema|situaci[oó]n problema|problema/i },
      { id: 'procesos', etiqueta: 'procesos generales (resolución, modelación, comunicación, razonamiento, procedimientos)', re: /modelaci[oó]n|modelar|razonamiento|razonar|comunicaci[oó]n|comunicar|resoluci[oó]n de problemas|resolver problemas/i },
      { id: 'estandar', etiqueta: 'estándar de competencia', re: /est[aá]ndar/i },
      { id: 'evaluacion', etiqueta: 'evaluación del razonamiento y la argumentación', re: /argumentaci[oó]n|justific|evaluaci[oó]n/i }
    ]
  },

  naturales: {
    area: 'Ciencias Naturales',
    aliases: ['natural', 'ciencias'],
    referentes: [
      'Estándares Básicos de Competencias en Ciencias Naturales y Ciencias Sociales (MEN, 2004)',
      'Lineamientos Curriculares de Ciencias Naturales y Educación Ambiental (MEN, 1998)',
      'Derechos Básicos de Aprendizaje de Ciencias Naturales (MEN)'
    ],
    directiva: `El plan debe ser coherente con los Estándares Básicos de Competencias en Ciencias Naturales, que se organizan en tres grandes ámbitos:
- "Me aproximo al conocimiento como científico(a) natural": indagar, observar, formular preguntas e hipótesis, registrar y analizar datos, comunicar. La secuencia debe incluir una pregunta investigable y trabajo con evidencias.
- "Manejo conocimientos propios de las ciencias naturales": indica a cuál entorno pertenece el tema: entorno vivo, entorno físico o Ciencia, tecnología y sociedad (CTS).
- "Desarrollo compromisos personales y sociales": incluye una acción de cuidado de sí mismo, de los demás y del ambiente, o de uso responsable del conocimiento.
- Redacta el estándar para el grupo de grados indicado y el DBA solo si existe con certeza para ese grado y tema.
- Si hay experimentación, incluye medidas de seguridad y alternativas cuando no haya laboratorio. Prefiere la indagación guiada a la transmisión de definiciones. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'indagacion', etiqueta: 'aproximación como científico natural (pregunta investigable, hipótesis, evidencias)', re: /pregunta investigable|hip[oó]tesis|indagaci[oó]n|evidencias?/i },
      { id: 'entorno', etiqueta: 'entorno (vivo, físico o ciencia, tecnología y sociedad)', re: /entorno vivo|entorno f[ií]sico|ciencia,? tecnolog[ií]a y sociedad|CTS/i },
      { id: 'compromisos', etiqueta: 'compromisos personales y sociales', re: /compromisos? personales?|compromiso social|cuidado del ambiente|cuidado de s[ií]|responsab/i },
      { id: 'estandar', etiqueta: 'estándar de competencia', re: /est[aá]ndar/i },
      { id: 'evaluacion', etiqueta: 'evaluación de la explicación con evidencias', re: /evaluaci[oó]n|r[uú]brica|criterios/i }
    ]
  },

  sociales: {
    area: 'Ciencias Sociales',
    aliases: ['social'],
    referentes: [
      'Estándares Básicos de Competencias en Ciencias Sociales (MEN, 2004)',
      'Lineamientos Curriculares de Ciencias Sociales (MEN, 2002)',
      'Estándares de Competencias Ciudadanas (MEN, 2004) y Cátedra de la Paz (Ley 1732 de 2014)',
      'Derechos Básicos de Aprendizaje de Ciencias Sociales (MEN)'
    ],
    directiva: `El plan debe ser coherente con los Estándares Básicos de Competencias en Ciencias Sociales:
- Los estándares se organizan en "Me aproximo al conocimiento como científico(a) social", "Manejo conocimientos propios de las ciencias sociales" y "Desarrollo compromisos personales y sociales".
- En el manejo de conocimientos, declara el eje del tema: "Relaciones con la historia y las culturas", "Relaciones espaciales y ambientales" o "Relaciones ético-políticas" (pueden articularse).
- Formula una pregunta problematizadora que oriente la indagación y trabaja con fuentes (primarias y secundarias, mapas, testimonios, datos), contrastando perspectivas.
- Desarrolla competencias cognitivas, procedimentales, interpersonales e integradoras, y articula las competencias ciudadanas cuando el tema lo permita (convivencia y paz, participación y responsabilidad democrática, pluralidad e identidad).
- Redacta el estándar para el grupo de grados indicado y el DBA solo si existe con certeza para ese grado y tema. Contextualiza con la realidad local o nacional. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'eje', etiqueta: 'eje de los estándares (historia y culturas, espacial y ambiental, ético-político)', re: /relaciones con la historia|relaciones espaciales|relaciones [eé]tico|historia y las culturas|espaciales y ambientales|[eé]tico-pol[ií]tic/i },
      { id: 'pregunta', etiqueta: 'pregunta problematizadora', re: /pregunta problematizadora|pregunta (gu[ií]a|orientadora|de indagaci[oó]n|central)/i },
      { id: 'fuentes', etiqueta: 'trabajo con fuentes y perspectivas', re: /fuentes?|perspectivas?|testimonios?|documentos?/i },
      { id: 'estandar', etiqueta: 'estándar de competencia', re: /est[aá]ndar/i },
      { id: 'ciudadania', etiqueta: 'compromisos personales y sociales / competencias ciudadanas', re: /ciudadan|compromisos? personales|convivencia|participaci[oó]n/i }
    ]
  },

  lenguaje: {
    area: 'Lengua Castellana',
    aliases: ['lengu', 'castell', 'español', 'lenguaje'],
    referentes: [
      'Lineamientos Curriculares de Lengua Castellana (MEN, 1998)',
      'Estándares Básicos de Competencias del Lenguaje (MEN, 2006)',
      'Derechos Básicos de Aprendizaje de Lenguaje (MEN)'
    ],
    directiva: `El plan debe ser coherente con los Lineamientos Curriculares y los Estándares Básicos de Competencias del Lenguaje, con enfoque semántico-comunicativo (el lenguaje como construcción de significado en situaciones reales de uso, no como memorización de gramática):
- Declara el factor de los estándares que se trabaja: "Producción textual", "Comprensión e interpretación textual", "Literatura", "Medios de comunicación y otros sistemas simbólicos" o "Ética de la comunicación".
- Las actividades deben partir de textos auténticos y de propósitos comunicativos reales (para quién, para qué, en qué situación), integrando oralidad, lectura y escritura.
- Si hay lectura, organiza antes, durante y después de leer, con niveles de comprensión literal, inferencial y crítico-intertextual. Si hay escritura, incluye planeación, textualización, revisión y reescritura.
- Redacta el estándar para el grupo de grados indicado y el DBA solo si existe con certeza para ese grado y tema. La gramática y la ortografía se trabajan en función de la producción y comprensión textual. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'factor', etiqueta: 'factor de los estándares (producción, comprensión, literatura, medios, ética de la comunicación)', re: /producci[oó]n textual|comprensi[oó]n e interpretaci[oó]n|literatura|medios de comunicaci[oó]n|[eé]tica de la comunicaci[oó]n/i },
      { id: 'proposito', etiqueta: 'propósito y situación comunicativa real', re: /prop[oó]sito comunicativo|situaci[oó]n comunicativa|destinatario|audiencia|para qu[eé]|interlocutor/i },
      { id: 'proceso', etiqueta: 'proceso lector o escritor (antes, durante, después / planeación, revisión)', re: /antes de|durante|despu[eé]s de|planeaci[oó]n|revisi[oó]n|reescritura|textualizaci[oó]n/i },
      { id: 'estandar', etiqueta: 'estándar de competencia', re: /est[aá]ndar/i },
      { id: 'evaluacion', etiqueta: 'evidencias y criterios de evaluación', re: /evidencias?|criterios?|r[uú]brica/i }
    ]
  },

  ingles: {
    area: 'Inglés',
    aliases: ['ingl', 'english', 'extranjera'],
    referentes: [
      'Estándares Básicos de Competencias en Lenguas Extranjeras: Inglés, Guía 22 (MEN, 2006)',
      'Derechos Básicos de Aprendizaje de Inglés (MEN) y Currículo Sugerido de Inglés',
      'Marco Común Europeo de Referencia para las Lenguas (MCER)'
    ],
    directiva: `El plan debe ser coherente con la Guía 22 (la meta nacional es que el estudiante de grado 11 alcance el nivel B1 del MCER) y con los DBA de Inglés:
- Declara el nivel MCER esperado para el grupo de grados indicado, coherente con una progresión que llega a B1 en grado 11 (A1 al inicio, A2 en el tránsito, B1 al final de la media); no pidas desempeños de un nivel muy superior al del grupo.
- Trabaja la competencia comunicativa en sus tres componentes: lingüístico, pragmático y sociolingüístico, mediante tareas comunicativas con propósito real, no listas descontextualizadas de vocabulario.
- Indica las habilidades que se desarrollan (listening, speaking, reading, writing, y la interacción) y el objetivo comunicativo en términos de "can do" (el estudiante puede...).
- Usa la lengua de forma predominante en el aula y ofrece apoyos (visuales, gestos, modelos de lenguaje, andamiajes) para el nivel.
- Los DBA de Inglés cubren los grados superiores; si no existe DBA para el grado, cita el estándar de la Guía 22 para el grupo de grados. ${NO_INVENTAR}`,
    chequeos: [
      { id: 'mcer', etiqueta: 'nivel MCER (A1, A2, B1…)', re: /\b(A1|A2|B1|B2)\b/ },
      { id: 'habilidades', etiqueta: 'habilidades comunicativas (listening, speaking, reading, writing)', re: /listening|speaking|reading|writing|escucha|habla|lectura|escritura/i },
      { id: 'objetivo', etiqueta: 'objetivo comunicativo (can do / el estudiante podrá)', re: /can do|puede|podr[aá]|will be able|objetivo comunicativo|communicative/i },
      { id: 'referente', etiqueta: 'referente Guía 22 / DBA', re: /gu[ií]a 22|DBA|est[aá]ndar/i },
      { id: 'evaluacion', etiqueta: 'evaluación formativa', re: /evaluaci[oó]n|assessment|r[uú]brica|criterios/i }
    ]
  }
};

/** Resuelve el marco MEN a partir del nombre de área del formulario. */
export function getMenFramework(areaName = '') {
  const norm = String(areaName).toLowerCase();
  if (!norm) return null;
  // Sociales y Naturales comparten la palabra "ciencias": se resuelve por la especificidad
  if (norm.includes('social')) return MEN_FRAMEWORKS.sociales;
  if (norm.includes('natural')) return MEN_FRAMEWORKS.naturales;
  return Object.values(MEN_FRAMEWORKS).find(f => f.aliases.some(a => norm.includes(a))) || null;
}

/** Directiva textual para el prompt del plan (o de las sugerencias curriculares). */
export function buildMenDirective(areaName = '', grado = '') {
  const fw = getMenFramework(areaName);
  if (!fw) {
    return 'Debes basarte en los lineamientos curriculares, estándares básicos de competencias y DBA vigentes del Ministerio de Educación Nacional de Colombia que correspondan al área y grado indicados, sin inventar códigos.';
  }
  const grupo = getGradeGroup(grado);
  return `ALINEACIÓN CON EL MEN (${fw.area}). Referentes: ${fw.referentes.join('; ')}.
${grupo ? `GRADO DE LA CLASE: ${grado}. Internamente trabaja con el grupo de grados oficial del MEN que lo incluye (${grupo}) para elegir estándares, desempeños y DBA, pero en el plan escribe SIEMPRE el grado ${grado} que pidió el docente (identificación, objetivos, actividades). Nunca presentes "${grupo}" como el grado de la clase.` : 'Usa internamente el grupo de grados oficial del MEN que incluya el grado de la clase, pero escribe en el plan solo el grado que pidió el docente.'}
${fw.directiva}`;
}

/**
 * Verifica que el plan generado evidencie los elementos que el MEN exige para el área.
 * @returns {{ framework: object|null, faltantes: string[] }}
 */
export function checkMenAlignment(planMarkdown = '', areaName = '') {
  const fw = getMenFramework(areaName);
  if (!fw) return { framework: null, faltantes: [] };
  const faltantes = fw.chequeos.filter(c => !c.re.test(planMarkdown)).map(c => c.etiqueta);
  return { framework: fw, faltantes };
}
