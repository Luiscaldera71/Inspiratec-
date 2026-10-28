/**
 * Ontología Curricular de Referentes y Prerrequisitos (MEN Colombia - Guía 30 & DBA)
 * 
 * Modela la progresión del aprendizaje en Tecnología e Informática y Pensamiento Computacional
 * como un Grafo Dirigido Acíclico (DAG). Cada nodo representa un aprendizaje o competencia clave,
 * vinculado a sus prerrequisitos formativos (nodos antecedentes) y a los aprendizajes que habilita.
 * 
 * Fuentes normativas:
 * - Ministerio de Educación Nacional (MEN). Guía 30: Orientaciones generales para la educación en tecnología.
 * - Marcos de Competencias en Pensamiento Computacional y Ciudadanía Digital (MEN / MinTIC).
 * - Tesis Caro (2015): "Modelo de Conocimiento del Dominio y Redes de Prerrequisitos en STI".
 */

export const CURRICULAR_GRADOS = [
  { id: '1-3', label: '1° a 3° (Básica Primaria Inicial)', nivel: 'Primaria Inicial' },
  { id: '4-5', label: '4° a 5° (Básica Primaria Avanzada)', nivel: 'Primaria Avanzada' },
  { id: '6-7', label: '6° a 7° (Básica Secundaria Inicial)', nivel: 'Secundaria Inicial' },
  { id: '8-9', label: '8° a 9° (Básica Secundaria Avanzada)', nivel: 'Secundaria Avanzada' },
  { id: '10-11', label: '10° a 11° (Educación Media)', nivel: 'Educación Media' },
];

export const CURRICULAR_EJES = {
  naturaleza: { id: 'naturaleza', nombre: 'Naturaleza y evolución de la tecnología', color: '#166534', lightColor: 'rgba(22, 101, 52, 0.12)' },
  apropiacion: { id: 'apropiacion', nombre: 'Apropiación y uso de la tecnología', color: '#1E40AF', lightColor: 'rgba(30, 64, 175, 0.12)' },
  solucion: { id: 'solucion', nombre: 'Solución de problemas con tecnología', color: '#315B54', lightColor: 'rgba(49, 91, 84, 0.15)' },
  sociedad: { id: 'sociedad', nombre: 'Tecnología y sociedad', color: '#92400E', lightColor: 'rgba(146, 64, 14, 0.12)' }
};

export const CURRICULAR_NODES = [
  // ==========================================
  // GRUPO 1° A 3° (PRIMARIA INICIAL)
  // ==========================================
  {
    id: 'tec_1_3_artefactos',
    codigo: 'MEN-NAT-1.1',
    titulo: 'Artefactos cotidianos y funciones básicas',
    descripcion: 'Identifico y describo artefactos que se utilizan hoy y que no se empleaban en épocas pasadas para satisfacer necesidades cotidianas.',
    gradoGrupo: '1-3',
    eje: 'naturaleza',
    prerrequisitos: [],
    x: 80,
    y: 90
  },
  {
    id: 'tec_1_3_seguridad',
    codigo: 'MEN-APR-1.1',
    titulo: 'Seguridad y exploración de herramientas',
    descripcion: 'Reconozco y utilizo normas de seguridad en el manejo de artefactos y herramientas cotidianas en el hogar y la escuela.',
    gradoGrupo: '1-3',
    eje: 'apropiacion',
    prerrequisitos: [],
    x: 80,
    y: 200
  },
  {
    id: 'tec_1_3_secuencias',
    codigo: 'MEN-SOL-1.1',
    titulo: 'Secuencias de pasos e instrucciones simples',
    descripcion: 'Sigo instrucciones y organizo secuencias lógicas para ensamblar objetos o resolver tareas concretas (iniciación al pensamiento algorítmico desenchufado).',
    gradoGrupo: '1-3',
    eje: 'solucion',
    prerrequisitos: [],
    x: 80,
    y: 310
  },
  {
    id: 'tec_1_3_cuidado',
    codigo: 'MEN-SOC-1.1',
    titulo: 'Cuidado de recursos y entorno escolar',
    descripcion: 'Identifico los recursos naturales y la importancia de su conservación al usar productos tecnológicos.',
    gradoGrupo: '1-3',
    eje: 'sociedad',
    prerrequisitos: [],
    x: 80,
    y: 420
  },

  // ==========================================
  // GRUPO 4° A 5° (PRIMARIA AVANZADA)
  // ==========================================
  {
    id: 'tec_4_5_innovacion',
    codigo: 'MEN-NAT-2.1',
    titulo: 'Evolución de artefactos y materiales',
    descripcion: 'Analizo cómo los avances tecnológicos y el uso de nuevos materiales transforman los artefactos y el trabajo humano.',
    gradoGrupo: '4-5',
    eje: 'naturaleza',
    prerrequisitos: ['tec_1_3_artefactos'],
    x: 270,
    y: 90
  },
  {
    id: 'tec_4_5_herramientas_digitales',
    codigo: 'MEN-APR-2.1',
    titulo: 'Operación básica de sistemas informáticos',
    descripcion: 'Empleo procesadores de texto, herramientas de dibujo digital y navegadores con fines comunicativos y académicos.',
    gradoGrupo: '4-5',
    eje: 'apropiacion',
    prerrequisitos: ['tec_1_3_seguridad'],
    x: 270,
    y: 200
  },
  {
    id: 'tec_4_5_descomposicion',
    codigo: 'MEN-SOL-2.1',
    titulo: 'Descomposición de problemas y algoritmos',
    descripcion: 'Diseño diagramas y algoritmos por bloques (Scratch) para automatizar historias interactivas y resolver problemas matemáticos.',
    gradoGrupo: '4-5',
    eje: 'solucion',
    prerrequisitos: ['tec_1_3_secuencias'],
    x: 270,
    y: 310
  },
  {
    id: 'tec_4_5_huella_ecologica',
    codigo: 'MEN-SOC-2.1',
    titulo: 'Gestión de residuos tecnológicos (RAEE)',
    descripcion: 'Reconozco el impacto ambiental de los desechos electrónicos y propongo acciones comunitarias para su reciclaje.',
    gradoGrupo: '4-5',
    eje: 'sociedad',
    prerrequisitos: ['tec_1_3_cuidado'],
    x: 270,
    y: 420
  },

  // ==========================================
  // GRUPO 6° A 7° (SECUNDARIA INICIAL)
  // ==========================================
  {
    id: 'tec_6_7_estructuras_mecanismos',
    codigo: 'MEN-NAT-3.1',
    titulo: 'Sistemas mecánicos y operadores tecnológicos',
    descripcion: 'Explico las funciones de operadores mecánicos simples (palancas, poleas, engranajes) y estructuras en artefactos del entorno.',
    gradoGrupo: '6-7',
    eje: 'naturaleza',
    prerrequisitos: ['tec_4_5_innovacion'],
    x: 470,
    y: 90
  },
  {
    id: 'tec_6_7_comunicacion_digital',
    codigo: 'MEN-APR-3.1',
    titulo: 'Búsqueda crítica de información y ofimática',
    descripcion: 'Aplico estrategias de búsqueda académica crítica, referenciación básica y herramientas colaborativas en la nube.',
    gradoGrupo: '6-7',
    eje: 'apropiacion',
    prerrequisitos: ['tec_4_5_herramientas_digitales'],
    x: 470,
    y: 200
  },
  {
    id: 'tec_6_7_pensamiento_computacional',
    codigo: 'MEN-SOL-3.1',
    titulo: 'Estructuras de control y programación visual',
    descripcion: 'Utilizo condicionales (si/entonces), bucles y variables en entornos de programación por bloques para simular fenómenos científicos.',
    gradoGrupo: '6-7',
    eje: 'solucion',
    prerrequisitos: ['tec_4_5_descomposicion'],
    x: 470,
    y: 310
  },
  {
    id: 'tec_6_7_ciudadania_digital',
    codigo: 'MEN-SOC-3.1',
    titulo: 'Ética digital, privacidad y ciberseguridad',
    descripcion: 'Ejerzo prácticas responsables de identidad digital, prevengo el ciberacoso y protejo datos personales bajo la Ley 1581 de 2012.',
    gradoGrupo: '6-7',
    eje: 'sociedad',
    prerrequisitos: ['tec_4_5_huella_ecologica', 'tec_4_5_herramientas_digitales'],
    x: 470,
    y: 420
  },

  // ==========================================
  // GRUPO 8° A 9° (SECUNDARIA AVANZADA)
  // ==========================================
  {
    id: 'tec_8_9_sistemas_electricos',
    codigo: 'MEN-NAT-4.1',
    titulo: 'Circuitos eléctricos y transformación energética',
    descripcion: 'Diseño e interpreto esquemas de circuitos eléctricos en serie y paralelo, analizando el aprovechamiento de energías limpias.',
    gradoGrupo: '8-9',
    eje: 'naturaleza',
    prerrequisitos: ['tec_6_7_estructuras_mecanismos'],
    x: 670,
    y: 90
  },
  {
    id: 'tec_8_9_diseno_3d',
    codigo: 'MEN-APR-4.1',
    titulo: 'Modelado CAD 3D y prototipado físico',
    descripcion: 'Utilizo software de modelado 3D y herramientas de fabricación digital para prototipar soluciones a necesidades comunitarias.',
    gradoGrupo: '8-9',
    eje: 'apropiacion',
    prerrequisitos: ['tec_6_7_comunicacion_digital'],
    x: 670,
    y: 200
  },
  {
    id: 'tec_8_9_robotica_educativa',
    codigo: 'MEN-SOL-4.1',
    titulo: 'Sensores, actuadores y robótica física',
    descripcion: 'Integro microcontroladores (Micro:bit / Arduino) con sensores de luz, temperatura y actuadores para automatizar soluciones en el aula.',
    gradoGrupo: '8-9',
    eje: 'solucion',
    prerrequisitos: ['tec_6_7_pensamiento_computacional'],
    x: 670,
    y: 310
  },
  {
    id: 'tec_8_9_impacto_social',
    codigo: 'MEN-SOC-4.1',
    titulo: 'Evaluación de impacto tecnológico y dilemas bioéticos',
    descripcion: 'Debato críticamente sobre el impacto de la inteligencia artificial, la automatización laboral y la neutralidad de la red.',
    gradoGrupo: '8-9',
    eje: 'sociedad',
    prerrequisitos: ['tec_6_7_ciudadania_digital'],
    x: 670,
    y: 420
  },

  // ==========================================
  // GRUPO 10° A 11° (EDUCACIÓN MEDIA)
  // ==========================================
  {
    id: 'tec_10_11_sistemas_complejos',
    codigo: 'MEN-NAT-5.1',
    titulo: 'Control automático y sistemas mecatrónicos',
    descripcion: 'Analizo sistemas tecnológicos complejos integrando lazos de realimentación, transductores y control en tiempo real.',
    gradoGrupo: '10-11',
    eje: 'naturaleza',
    prerrequisitos: ['tec_8_9_sistemas_electricos', 'tec_8_9_robotica_educativa'],
    x: 870,
    y: 90
  },
  {
    id: 'tec_10_11_desarrollo_software',
    codigo: 'MEN-APR-5.1',
    titulo: 'Programación estructurada y bases de datos',
    descripcion: 'Desarrollo aplicaciones de software funcionales empleando lenguajes basados en texto (Python/JavaScript) y persistencia de datos.',
    gradoGrupo: '10-11',
    eje: 'apropiacion',
    prerrequisitos: ['tec_8_9_robotica_educativa'],
    x: 870,
    y: 200
  },
  {
    id: 'tec_10_11_proyectos_steam',
    codigo: 'MEN-SOL-5.1',
    titulo: 'Formulación y gestión de proyectos de innovación STEAM',
    descripcion: 'Aplico metodologías de diseño ágil (Design Thinking / Scrum) para formular proyectos que resuelvan problemas reales del entorno.',
    gradoGrupo: '10-11',
    eje: 'solucion',
    prerrequisitos: ['tec_8_9_diseno_3d', 'tec_8_9_robotica_educativa'],
    x: 870,
    y: 310
  },
  {
    id: 'tec_10_11_propiedad_intelectual',
    codigo: 'MEN-SOC-5.1',
    titulo: 'Licenciamiento abierto, patentes y ética de la IA',
    descripcion: 'Comprendo los modelos de propiedad intelectual, licencias Creative Commons, sesgos algorítmicos en IA y responsabilidad profesional.',
    gradoGrupo: '10-11',
    eje: 'sociedad',
    prerrequisitos: ['tec_8_9_impacto_social'],
    x: 870,
    y: 420
  }
];

/**
 * Obtiene un nodo por su identificador
 */
export function getCurricularNodeById(nodeId) {
  return CURRICULAR_NODES.find(n => n.id === nodeId) || null;
}

/**
 * Retorna la lista de dependencias directas e indirectas (ancestros / prerrequisitos)
 */
export function getAncestors(nodeId, visited = new Set()) {
  const node = getCurricularNodeById(nodeId);
  if (!node) return [];

  const ancestors = [];
  node.prerrequisitos.forEach(prereqId => {
    if (!visited.has(prereqId)) {
      visited.add(prereqId);
      ancestors.push(prereqId);
      ancestors.push(...getAncestors(prereqId, visited));
    }
  });

  return Array.from(new Set(ancestors));
}

/**
 * Retorna los nodos que tienen como prerrequisito directo o indirecto al nodo dado (descendientes)
 */
export function getDescendants(nodeId) {
  const directDescendants = CURRICULAR_NODES
    .filter(n => n.prerrequisitos.includes(nodeId))
    .map(n => n.id);

  const allDescendants = [...directDescendants];
  directDescendants.forEach(childId => {
    allDescendants.push(...getDescendants(childId));
  });

  return Array.from(new Set(allDescendants));
}

/**
 * Mapea el grado escolar de la planeación al grupo de grado curricular
 */
export function mapearGradoAGrupo(gradoTexto = '') {
  const normalizado = String(gradoTexto).toLowerCase().trim();
  if (normalizado.includes('10') || normalizado.includes('11') || normalizado.includes('décimo') || normalizado.includes('once')) return '10-11';
  if (normalizado.includes('8') || normalizado.includes('9') || normalizado.includes('octavo') || normalizado.includes('noveno')) return '8-9';
  if (normalizado.includes('6') || normalizado.includes('7') || normalizado.includes('sexto') || normalizado.includes('séptimo') || normalizado.includes('septimo')) return '6-7';
  if (normalizado.includes('4') || normalizado.includes('5') || normalizado.includes('cuarto') || normalizado.includes('quinto')) return '4-5';
  if (normalizado.includes('1') || normalizado.includes('2') || normalizado.includes('3') || normalizado.includes('primero') || normalizado.includes('segundo') || normalizado.includes('tercero')) return '1-3';
  return '6-7'; // Por defecto secundaria
}
