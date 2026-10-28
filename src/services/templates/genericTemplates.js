/**
 * Plantillas y Formatos Genéricos Estructurados de INSPIRATEC.
 * 
 * Define las estructuras curriculares canónicas por área (Matemáticas,
 * Ciencias Naturales, Lengua Castellana y Tecnología e Informática) con sus secciones,
 * campos ordenados, orientaciones didácticas disciplinares y fundamentos del MEN/DBA.
 */

import { resolveRealIdentification, formatIdentificationMarkdown } from './identificationResolver.js';

export const FORMATO_INFORMATICA = {
  id: 'generico_tecnologia_informatica',
  titulo: 'Estructura estándar INSPIRATEC',
  area: 'Tecnología e Informática',
  aliasAreas: ['Tecnología e Informática', 'Tecnología', 'Informática'],
  subtitulo: 'Estructura curricular por momentos pedagógicos y mediación de recursos',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Orientaciones Generales para la Educación en Tecnología (Guía 30 MEN). Desarrolla componentes, competencias tecnológicas, momentos de la clase y mediación con recursos.',
  referenciaUrl: 'https://www.mineducacion.gov.co/1621/articles-160915_archivo_pdf.pdf',
  secciones: [
    {
      id: '1',
      titulo: 'Identificación',
      campos: [
        'Institución:',
        'Área:',
        'Grado:',
        'Docente:',
        'Duración:'
      ]
    },
    {
      id: '2',
      titulo: 'Fundamentación Curricular',
      campos: [
        'Componente:',
        'Competencia:',
        'Evidencia de aprendizaje:',
        'Contenidos:',
        'Criterios de evaluación:'
      ]
    },
    {
      id: '3',
      titulo: 'Secuencia didáctica',
      subsecciones: [
        {
          titulo: '1. Momento de Inicio',
          campos: [
            'Duración estimada',
            'Actividades del docente',
            'Actividades de los estudiantes',
            'Mediación y recursos didácticos'
          ]
        },
        {
          titulo: '2. Momento de Desarrollo',
          campos: [
            'Duración estimada',
            'Actividades del docente',
            'Actividades de los estudiantes',
            'Mediación y recursos didácticos'
          ]
        },
        {
          titulo: '3. Momento de Cierre',
          campos: [
            'Duración estimada',
            'Actividades del docente',
            'Actividades de los estudiantes',
            'Mediación y recursos didácticos'
          ]
        }
      ]
    },
    {
      id: '4',
      titulo: 'Observaciones',
      campos: [
        'Observaciones pedagógicas y adaptaciones inclusivas DUA'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura exacta en Markdown:

# PLAN DE CLASE — TECNOLOGÍA E INFORMÁTICA

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Eje o componente tecnológico:** (Naturaleza y evolución de la tecnología, Apropiación y uso de la tecnología, Solución de problemas con tecnología, o Tecnología y sociedad)
- **Tema y situación de aprendizaje tecnológico / computacional:** ${wizardData.tema}

---

### Fundamentación Curricular
- **Componente:** (Indicar el componente según las Orientaciones del MEN: Naturaleza y evolución de la tecnología, Apropiación y uso de la tecnología, Solución de problemas con tecnología, o Tecnología y sociedad)
- **Competencia del componente:** (Competencia que el MEN plantea para ese componente, tomada internamente del grupo de grados oficial que incluye el grado de la clase y redactada para ese grado)
- **Articulación con otros componentes:** (Los componentes son interconectados: indica qué otro componente se toca, si aplica)
- **Evidencia de aprendizaje:** (Desempeño o manifestación observable del aprendizaje)
- **Proceso de diseño o pensamiento computacional:** (Si el componente es Solución de problemas: necesidad o problema, búsqueda de información, ideas y selección, prototipo o simulación, evaluación y mejora. Si es informática: problema, descomposición, algoritmo, prueba y depuración, con o sin computador)
- **Dimensión ética, de seguridad y ambiental:** (Responsabilidad, privacidad, seguridad, sostenibilidad o equidad de acceso pertinentes al tema)
- **Contenidos:** (Contenidos conceptuales, procedimentales y actitudinales abordados en la clase)
- **Criterios de evaluación:** (Criterios claros de valoración del aprendizaje y desempeño)

---

### Secuencia Didáctica

#### 1. Momento de Inicio
- **Duración estimada:** [15 minutos o según distribución de tiempo]
- **Actividades del docente:** (Describe la bienvenida, motivación, presentación del propósito, activación de saberes previos o planteamiento del reto inicial)
- **Actividades de los estudiantes:** (Participación activa en activación de saberes previos, formulación de preguntas o hipótesis)
- **Mediación y recursos didácticos:** (Materiales físicos, guías impresas, preguntas orientadoras o recursos disponibles: ${wizardData.recursos || 'según disponibilidad'})

#### 2. Momento de Desarrollo
- **Duración estimada:** [Tiempo central de la sesión, ej: 60-65 minutos]
- **Actividades del docente:** (Introducción y modelación conceptual de tecnología/pensamiento computacional, organización de equipos, entrega de retos prácticos y acompañamiento formativo)
- **Actividades de los estudiantes:** (Trabajo colaborativo o individual, aplicación práctica en software, hardware o retos desconectados, resolución de problemas y depuración)
- **Mediación y recursos didácticos:** (Tarjetas de instrucciones, guías de trabajo, computadores, tablets o materiales de laboratorio)

#### 3. Momento de Cierre
- **Duración estimada:** [10-15 minutos]
- **Actividades del docente:** (Moderación de la puesta en común, síntesis pedagógica de conceptos clave, retroalimentación formativa y reflexión)
- **Actividades de los estudiantes:** (Socialización de resultados, autoevaluación, coevaluación y reflexión sobre el impacto tecnológico)
- **Mediación y recursos didácticos:** (Plenaria guiada, rúbrica o formato breve de autoevaluación formativa)

---

### Observaciones
- **Adaptaciones inclusivas DUA (PIAR aplicable):**
  - **Para estudiantes con dificultades motoras o de movilidad:** (Estrategias específicas, roles dentro del equipo o apoyos de accesibilidad)
  - **Para estudiantes con necesidades de apoyo visual o cognitivo:** (Apoyos visuales concretos, tarjetas con pictogramas o codificación por colores)
  - **Ritmo de trabajo y ajustes razonables:** (Flexibilidad en el tiempo de ejecución de los retos y andamiajes graduales acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'las necesidades del aula'})

---

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**Razón:** Por qué este material es el más adecuado para el tema.
**Objetivo:** Qué logrará el estudiante con él.
**Contexto:** En qué momento exacto de la clase debe usarse.
**Actividad:** Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

export const FORMATO_MATEMATICAS = {
  id: 'generico_matematicas',
  titulo: 'Formato genérico de Matemáticas',
  area: 'Matemáticas',
  aliasAreas: ['Matemáticas', 'Matematica', 'Pensamiento Matemático'],
  subtitulo: 'Razonamiento, resolución de problemas y pensamiento matemático',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Los referentes del MEN y los DBA de Matemáticas enfatizan el razonamiento, la resolución de problemas y la aplicación del pensamiento matemático.',
  referenciaUrl: 'https://colombiaaprende.edu.co/recurso-coleccion/derechos-basicos-de-aprendizaje-matematicas',
  secciones: [
    {
      id: 'A',
      titulo: 'A. Identificación',
      campos: [
        'Institución educativa.',
        'Docente y grado escolar.',
        'Área curricular y duración.',
        'Pensamiento matemático predominante: numérico, espacial, métrico, aleatorio o variacional.',
        'Tema y situación contextual de aprendizaje.'
      ]
    },
    {
      id: 'B',
      titulo: 'B. Fundamentación curricular',
      campos: [
        'Objetivo de aprendizaje.',
        'Competencias matemáticas por desarrollar.',
        'Estándar de competencia pertinente.',
        'DBA correspondiente al grado, cuando aplique.',
        'Saberes previos necesarios.',
        'Desempeños o evidencias esperadas.',
        'Criterios de logro.'
      ]
    },
    {
      id: 'C',
      titulo: 'C. Conceptualización matemática',
      campos: [
        'Conceptos, propiedades y procedimientos.',
        'Representaciones que se utilizarán: numéricas, gráficas, geométricas, algebraicas o tabulares.',
        'Errores frecuentes o dificultades previsibles.',
        'Conexiones con otras áreas o situaciones cotidianas, cuando sean pertinentes.'
      ]
    },
    {
      id: 'D',
      titulo: 'D. Secuencia didáctica',
      subsecciones: [
        {
          titulo: '1. Inicio',
          campos: [
            'Situación problema o pregunta detonante.',
            'Exploración de conocimientos previos.',
            'Presentación del propósito.'
          ]
        },
        {
          titulo: '2. Desarrollo',
          campos: [
            'Exploración de estrategias de solución.',
            'Construcción o explicación del concepto.',
            'Modelación de procedimientos y ejemplos.',
            'Resolución de problemas individuales o colaborativos.',
            'Uso de material manipulativo o herramientas digitales, cuando corresponda.'
          ]
        },
        {
          titulo: '3. Cierre',
          campos: [
            'Socialización y comparación de estrategias.',
            'Justificación de los procedimientos.',
            'Síntesis de los aprendizajes.',
            'Problema de transferencia a una nueva situación.'
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'E. Evaluación del aprendizaje',
      campos: [
        'Evidencias de razonamiento y resolución.',
        'Criterios de precisión, procedimiento, argumentación y representación.',
        'Instrumento de evaluación.',
        'Pregunta o ejercicio de comprobación.',
        'Retroalimentación y acciones de mejora.'
      ]
    },
    {
      id: 'F',
      titulo: 'F. Recursos y atención a la diversidad',
      campos: [
        'Materiales, instrumentos, calculadoras o software.',
        'Adaptaciones y apoyos según las necesidades del grupo.',
        'Alternativas para estudiantes con dificultades o diferentes ritmos de aprendizaje.'
      ]
    },
    {
      id: 'G',
      titulo: 'G. Reflexión docente',
      campos: [
        'Dificultades observadas.',
        'Logros alcanzados.',
        'Ajustes para la próxima sesión.'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura con los mismos encabezados y secciones en Markdown:

# PLAN DE CLASE — MATEMÁTICAS
## Razonamiento, resolución de problemas y pensamiento matemático

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Pensamiento matemático predominante:** (Selecciona y justifica el predominante según el tema: numérico, espacial, métrico, aleatorio o variacional)
- **Tema y situación contextual de aprendizaje:** ${wizardData.tema} (Describe la situación contextual o problema de la vida cotidiana que enmarca el aprendizaje)

### B. Fundamentación curricular
- **Objetivo de aprendizaje**: (Redacta el objetivo formativo matemático con claridad y precisión)
- **Competencias matemáticas por desarrollar**: (Comunicación, razonamiento, modelación, formulación/resolución de problemas, ejercitación de procedimientos)
- **Estándar de competencia pertinente**: (Estándar oficial real del MEN del pensamiento matemático, tomado internamente del grupo de grados oficial que incluye el grado de la clase; no escribas el rango de grados, solo el estándar, sin inventar códigos)
- **Procesos generales de la actividad matemática**: (Cuáles se desarrollan y en qué momento: formular y resolver problemas, modelar, comunicar, razonar, formular/comparar/ejercitar procedimientos)
- **Contexto de la situación problema**: (De la vida diaria, de otras ciencias o de las matemáticas mismas)
- **DBA correspondiente al grado, cuando aplique**: (DBA oficial de Matemáticas si es pertinente al grado y tema, o "No aplica / No especificado". NO inventes códigos DBA ficticios)
- **Saberes previos necesarios**: (Conocimientos matemáticos anteriores indispensables)
- **Desempeños o evidencias esperadas**: (Acciones observables donde el estudiante evidencia su razonamiento y comprensión)
- **Criterios de logro**: (Pautas de desempeño que indican el alcance del aprendizaje)

### C. Conceptualización matemática
- **Conceptos, propiedades y procedimientos**: (Formalización conceptual, propiedades matemáticas y algoritmos a trabajar)
- **Representaciones que se utilizarán**: (Selecciona las pertinentes al tema: numéricas, gráficas, geométricas, algebraicas o tabulares)
- **Errores frecuentes o dificultades previsibles**: (Obstáculos cognitivos o errores habituales de los estudiantes en este contenido)
- **Conexiones con otras áreas o situaciones cotidianas, cuando sean pertinentes**: (Vínculos significativos con la ciencia, arte, economía o vida cotidiana)

### D. Secuencia didáctica
#### 1. Inicio
- **Situación problema o pregunta detonante**: (Problema contextualizado o reto desafiante que motive la indagación matemática)
- **Exploración de conocimientos previos**: (Dinámica interactiva o preguntas para activar y diagnosticar saberes previos)
- **Presentación del propósito**: (Socialización clara y explícita del objetivo de la sesión a los estudiantes)

#### 2. Desarrollo
- **Exploración de estrategias de solución**: (Espacio para que los estudiantes propongan y ensayen rutas intuitivas de solución)
- **Construcción o explicación del concepto**: (Formalización matemática rigurosa guiada por el docente a partir de lo explorado)
- **Modelación de procedimientos y ejemplos**: (Ejemplos resueltos paso a paso demostrando el uso de propiedades y representaciones)
- **Resolución de problemas individuales o colaborativos**: (Actividad práctica central de aplicación individual o en equipos)
- **Uso de material manipulativo o herramientas digitales, cuando corresponda**: (Uso de material concreto, GeoGebra, calculadoras o software disponible: ${wizardData.recursos || 'según disponibilidad'})

#### 3. Cierre
- **Socialización y comparación de estrategias**: (Puesta en común donde los estudiantes contrastan sus diversos caminos de solución)
- **Justificación de los procedimientos**: (Argumentación matemática de por qué funcionan los métodos y respuestas obtenidas)
- **Síntesis de los aprendizajes**: (Recapitulación y conclusiones de los conceptos e ideas clave consolidadas)
- **Problema de transferencia a una nueva situación**: (Problema breve que rete a aplicar lo aprendido en un contexto diferente)

### E. Evaluación del aprendizaje
- **Evidencias de razonamiento y resolución**: (Producciones, registros y argumentaciones que demostrarán los estudiantes)
- **Criterios de precisión, procedimiento, argumentación y representación**: (Criterios formativos de calidad matemática)
- **Instrumento de evaluación**: (Rúbrica analítica, lista de cotejo formativa o escala de valoración)
- **Pregunta o ejercicio de comprobación**: (Ejercicio puntual para verificar la comprensión conceptual individual inmediata)
- **Retroalimentación y acciones de mejora**: (Estrategias pedagógicas de devolución y apoyo a estudiantes con dificultades)

### F. Recursos y atención a la diversidad
- **Materiales, instrumentos, calculadoras o software**: (Recursos físicos y tecnológicos coherentes con: ${wizardData.recursos || 'el aula'})
- **Adaptaciones y apoyos según las necesidades del grupo**: (Ajustes DUA en representación y expresión acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'el grupo'})
- **Alternativas para estudiantes con dificultades o diferentes ritmos de aprendizaje**: (Andamiajes graduados y desafíos de profundización)

### G. Reflexión docente
- **Dificultades observadas**: (Puntos críticos previstos donde los estudiantes suelen requerir mediación docente)
- **Logros alcanzados**: (Resultados formativos que se espera constatar al concluir la sesión)
- **Ajustes para la próxima sesión**: (Decisiones pedagógicas proyectadas para la continuidad de la enseñanza)

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

export const FORMATO_CIENCIAS_NATURALES = {
  id: 'generico_ciencias_naturales',
  titulo: 'Formato genérico de Ciencias Naturales',
  area: 'Ciencias Naturales',
  aliasAreas: ['Ciencias Naturales', 'Ciencias Naturales y Educación Ambiental', 'Ciencias', 'Biología', 'Física', 'Química'],
  subtitulo: 'Indagación científica, comprensión de fenómenos y análisis de evidencias',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Los DBA de Ciencias Naturales promueven el desarrollo de competencias científicas y el uso de evidencias para comprender el entorno. Las actividades experimentales deben incorporarse solo cuando el propósito y los recursos lo permitan.',
  referenciaUrl: 'https://colombiaaprende.edu.co/recurso-coleccion/derechos-basicos-de-aprendizaje-dba-ciencias-naturales',
  secciones: [
    {
      id: 'A',
      titulo: 'A. Identificación y contexto',
      campos: [
        'Institución educativa.',
        'Docente y grado escolar.',
        'Área curricular y duración.',
        'Eje temático o fenómeno por estudiar.',
        'Contexto ambiental, biológico, físico o químico relacionado con la clase.'
      ]
    },
    {
      id: 'B',
      titulo: 'B. Fundamentación curricular',
      campos: [
        'Propósito de aprendizaje.',
        'Competencias científicas pertinentes.',
        'Estándar de competencia.',
        'DBA correspondiente al grado, cuando aplique.',
        'Aprendizajes previos.',
        'Evidencias de aprendizaje.',
        'Criterios de logro.'
      ]
    },
    {
      id: 'C',
      titulo: 'C. Fundamentación científica',
      campos: [
        'Conceptos y principios científicos.',
        'Fenómeno, sistema o problema por comprender.',
        'Explicaciones científicas relevantes.',
        'Relaciones entre conceptos.',
        'Ideas previas o concepciones alternativas que conviene explorar.',
        'Precauciones y medidas de seguridad, si hay experimentación.'
      ]
    },
    {
      id: 'D',
      titulo: 'D. Secuencia didáctica de indagación',
      subsecciones: [
        {
          titulo: '1. Exploración inicial',
          campos: [
            'Observación de un fenómeno, imagen, objeto o situación.',
            'Pregunta investigable.',
            'Exploración de ideas previas y predicciones.'
          ]
        },
        {
          titulo: '2. Construcción y exploración',
          campos: [
            'Formulación de hipótesis o explicaciones provisionales, cuando corresponda.',
            'Diseño o realización de una observación, experiencia o actividad de indagación.',
            'Identificación de variables, cuando sean pertinentes.',
            'Registro de observaciones y datos.',
            'Consulta de fuentes científicas o análisis de información.'
          ]
        },
        {
          titulo: '3. Análisis y explicación',
          campos: [
            'Interpretación de resultados.',
            'Contraste entre predicciones y evidencias.',
            'Elaboración de explicaciones científicas.',
            'Discusión de conclusiones y posibles limitaciones.'
          ]
        },
        {
          titulo: '4. Aplicación y cierre',
          campos: [
            'Aplicación de lo aprendido a un contexto real.',
            'Comunicación de resultados.',
            'Síntesis conceptual y reflexión final.'
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'E. Evaluación científica',
      campos: [
        'Evidencias de observación, análisis y explicación.',
        'Criterios para interpretar datos y argumentar conclusiones.',
        'Instrumento de evaluación.',
        'Preguntas de comprobación conceptual.',
        'Retroalimentación sobre los procedimientos y las explicaciones.'
      ]
    },
    {
      id: 'F',
      titulo: 'F. Recursos, seguridad e inclusión',
      campos: [
        'Materiales, instrumentos, muestras y recursos digitales.',
        'Protocolo de seguridad, si corresponde.',
        'Alternativas para aulas sin laboratorio.',
        'Ajustes para garantizar participación y acceso al aprendizaje.'
      ]
    },
    {
      id: 'G',
      titulo: 'G. Reflexión docente',
      campos: [
        'Comprensiones alcanzadas.',
        'Dificultades conceptuales detectadas.',
        'Calidad de las evidencias obtenidas.',
        'Ajustes para futuras experiencias.'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura con los mismos encabezados y secciones en Markdown:

# PLAN DE CLASE — CIENCIAS NATURALES
## Indagación científica, comprensión de fenómenos y análisis de evidencias

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Eje temático o fenómeno por estudiar:** ${wizardData.tema}
- **Contexto ambiental, biológico, físico o químico relacionado con la clase:** (Contextualización del fenómeno en el entorno natural, salud, comunidad o planeta)

### B. Fundamentación curricular
- **Propósito de aprendizaje**: (Propósito científico y formativo claro de la clase)
- **Competencias científicas pertinentes**: (Uso comprensivo del conocimiento científico, explicación de fenómenos, indagación)
- **Estándar de competencia**: (Estándar oficial del MEN para Ciencias Naturales tomado internamente del grupo de grados oficial que incluye el grado de la clase y del entorno; no escribas el rango de grados, sin inventar códigos)
- **Entorno de los conocimientos propios**: (Entorno vivo, entorno físico o Ciencia, tecnología y sociedad)
- **Me aproximo al conocimiento como científico(a) natural**: (Capacidades de indagación que se ejercitan: observar, preguntar, formular hipótesis, registrar, analizar, comunicar)
- **Compromisos personales y sociales**: (Acción de cuidado de sí mismo, de los demás o del ambiente, o uso responsable del conocimiento científico)
- **DBA correspondiente al grado, cuando aplique**: (DBA oficial de Ciencias Naturales si aplica al grado y tema, o "No aplica / No especificado". NO inventes códigos DBA ficticios)
- **Aprendizajes previos**: (Conocimientos y vivencias previas que fundamentan el nuevo aprendizaje)
- **Evidencias de aprendizaje**: (Desempeños observables donde el estudiante razona sobre evidencias científicas)
- **Criterios de logro**: (Criterios de valoración del rigor y comprensión científica)

### C. Fundamentación científica
- **Conceptos y principios científicos**: (Marco conceptual disciplinar riguroso y leyes o principios científicos aplicados)
- **Fenómeno, sistema o problema por comprender**: (Descripción clara y objetiva del fenómeno natural o problema científico estudiado)
- **Explicaciones científicas relevantes**: (Modelos teóricos y explicaciones respaldadas por la ciencia)
- **Relaciones entre conceptos**: (Articulación y coherencia entre conceptos del tema, e.g. causa-efecto, estructura-función)
- **Ideas previas o concepciones alternativas que conviene explorar**: (Concepciones intuitivas o errores conceptuales típicos del alumnado)
- **Precauciones y medidas de seguridad, si hay experimentación**: (Protocolos de bioseguridad escolar. Si no hay laboratorio, especificar alternativas seguras con material cotidiano)

### D. Secuencia didáctica de indagación
#### 1. Exploración inicial
- **Observación de un fenómeno, imagen, objeto o situación**: (Evento discrepante, muestra o fenómeno observable que despierta la curiosidad)
- **Pregunta investigable**: (Pregunta central susceptible de ser indagada empíricamente o mediante análisis de datos)
- **Exploración de ideas previas y predicciones**: (Registro de lo que los estudiantes anticipan y creen que ocurrirá)

#### 2. Construcción y exploración
- **Formulación de hipótesis o explicaciones provisionales, cuando corresponda**: (Hipótesis tentativas formuladas por los estudiantes)
- **Diseño o realización de una observación, experiencia o actividad de indagación**: (Procedimiento de indagación o experiencia práctica adaptada a: ${wizardData.recursos || 'los recursos del aula'})
- **Identificación de variables, cuando sean pertinentes**: (Variables independientes, dependientes o factores constantes relevantes)
- **Registro de observaciones y datos**: (Formatos, tablas o métodos para consignar datos empíricos o evidencia cualitativa)
- **Consulta de fuentes científicas o análisis de información**: (Revisión de textos informativos, gráficos o datos contrastables)

#### 3. Análisis y explicación
- **Interpretación de resultados**: (Organización y análisis de los datos u observaciones recolectadas)
- **Contraste entre predicciones y evidencias**: (Comparación argumentada entre las ideas iniciales y los hallazgos reales)
- **Elaboración de explicaciones científicas**: (Construcción de explicaciones fundamentadas en los datos y la teoría científica)
- **Discusión de conclusiones y posibles limitaciones**: (Debate colectivo sobre el alcance de las conclusiones y posibles fuentes de error)

#### 4. Aplicación y cierre
- **Aplicación de lo aprendido a un contexto real**: (Transferencia de los principios científicos aprendidos a problemáticas cotidianas o ambientales)
- **Comunicación de resultados**: (Estrategia para divulgar y compartir los hallazgos entre pares)
- **Síntesis conceptual y reflexión final**: (Consolidación de las ideas clave y metacognición del proceso investigativo)

### E. Evaluación científica
- **Evidencias de observación, análisis y explicación**: (Informes, diagramas, registros o argumentos elaborados por los estudiantes)
- **Criterios para interpretar datos y argumentar conclusiones**: (Pautas formativas para valorar el uso de evidencias)
- **Instrumento de evaluación**: (Rúbrica de indagación científica, lista de cotejo o informe de observación)
- **Preguntas de comprobación conceptual**: (Preguntas reflexivas clave para verificar la comprensión del fenómeno estudiado)
- **Retroalimentación sobre los procedimientos y las explicaciones**: (Devolución constructiva sobre el método y las conclusiones)

### F. Recursos, seguridad e inclusión
- **Materiales, instrumentos, muestras y recursos digitales**: (Recursos necesarios y accesibles para la sesión)
- **Protocolo de seguridad, si corresponde**: (Pautas de prevención y cuidado en el aula o espacio escolar)
- **Alternativas para aulas sin laboratorio**: (Adaptaciones concretas con recursos del entorno o simulaciones virtuales)
- **Ajustes para garantizar participación y acceso al aprendizaje**: (Ajustes DUA acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'el grupo'})

### G. Reflexión docente
- **Comprensiones alcanzadas**: (Nivel de apropiación conceptual y procedimental evidenciado por los estudiantes)
- **Dificultades conceptuales detectadas**: (Concepciones alternativas que persisten o aspectos que requieren refuerzo)
- **Calidad de las evidencias obtenidas**: (Evaluación de la pertinencia y rigurosidad de los datos recolectados)
- **Ajustes para futuras experiencias**: (Mejoras metodológicas y organizativas para próximas sesiones de indagación)

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

export const FORMATO_LENGUA_CASTELLANA = {
  id: 'generico_lengua_castellana',
  titulo: 'Formato genérico de Lengua Castellana',
  area: 'Lengua Castellana',
  aliasAreas: ['Lengua Castellana', 'Lenguaje (Español)', 'Lenguaje', 'Español', 'Castellano'],
  subtitulo: 'Comprensión, producción textual, oralidad y reflexión sobre el lenguaje',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Los referentes de Lengua Castellana y los DBA de Lenguaje contemplan procesos de lectura, escritura, oralidad, comprensión e interpretación textual. El componente discursivo debe ajustarse al objetivo concreto de cada clase.',
  referenciaUrl: 'https://colombiaaprende.edu.co/recurso-coleccion/derechos-basicos-de-aprendizaje-dba-lenguaje',
  secciones: [
    {
      id: 'A',
      titulo: 'A. Identificación y contexto comunicativo',
      campos: [
        'Institución educativa.',
        'Docente y grado escolar.',
        'Área curricular y duración.',
        'Eje o componente de trabajo.',
        'Tema, género textual o situación comunicativa.',
        'Contexto y necesidades comunicativas del grupo.'
      ]
    },
    {
      id: 'B',
      titulo: 'B. Fundamentación curricular',
      campos: [
        'Propósito comunicativo y de aprendizaje.',
        'Competencias o procesos del lenguaje.',
        'Estándar de competencia pertinente.',
        'DBA correspondiente al grado, cuando aplique.',
        'Saberes previos.',
        'Evidencias de aprendizaje.',
        'Criterios de logro.'
      ]
    },
    {
      id: 'C',
      titulo: 'C. Componente lingüístico y discursivo',
      campos: [
        'Texto, género, discurso o situación comunicativa.',
        'Características y estructura del texto.',
        'Propósito, destinatario y contexto.',
        'Recursos lingüísticos, gramaticales o discursivos relevantes.',
        'Vocabulario y conceptos clave.',
        'Estrategias de comprensión o producción que se enseñarán explícitamente.'
      ]
    },
    {
      id: 'D',
      titulo: 'D. Secuencia didáctica comunicativa',
      subsecciones: [
        {
          titulo: '1. Antes de leer, escribir o comunicar',
          campos: [
            'Activación de conocimientos previos.',
            'Presentación del propósito y del destinatario.',
            'Exploración de textos, preguntas o situaciones.'
          ]
        },
        {
          titulo: '2. Durante el proceso',
          campos: [
            'Lectura guiada, escucha, conversación o análisis de modelos.',
            'Identificación de ideas principales, estructura e intención comunicativa.',
            'Enseñanza explícita de estrategias lingüísticas o discursivas.',
            'Producción oral o escrita, según el objetivo.',
            'Interacción, discusión, revisión o trabajo colaborativo.'
          ]
        },
        {
          titulo: '3. Después del proceso',
          campos: [
            'Revisión y mejora de la producción.',
            'Socialización o publicación.',
            'Interpretación y reflexión sobre lo aprendido.',
            'Transferencia a otra situación comunicativa.'
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'E. Producción y evidencias',
      campos: [
        'Producto o desempeño esperado: texto, exposición, conversación, análisis u otro.',
        'Características que debe cumplir el producto.',
        'Evidencias de comprensión, interpretación o comunicación.',
        'Criterios de coherencia, cohesión, adecuación y corrección, cuando correspondan.',
        'Instrumento de evaluación.',
        'Retroalimentación y oportunidad de revisión.'
      ]
    },
    {
      id: 'F',
      titulo: 'F. Recursos y atención a la diversidad',
      campos: [
        'Textos literarios, informativos, argumentativos u otros.',
        'Recursos impresos, audiovisuales o digitales.',
        'Apoyos de lectura, escritura y comunicación oral.',
        'Adaptaciones para distintos niveles de comprensión y expresión.'
      ]
    },
    {
      id: 'G',
      titulo: 'G. Reflexión docente',
      campos: [
        'Avances en los procesos comunicativos.',
        'Dificultades observadas.',
        'Necesidades de refuerzo.',
        'Ajustes para la siguiente sesión.'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura con los mismos encabezados y secciones en Markdown:

# PLAN DE CLASE — LENGUA CASTELLANA
## Comprensión, producción textual, oralidad y reflexión sobre el lenguaje

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Eje o componente de trabajo**: (Producción textual, comprensión e interpretación textual, literatura, medios de comunicación o ética de la comunicación)
- **Tema, género textual o situación comunicativa**: ${wizardData.tema} (Especificar con precisión el género textual o la situación comunicativa abordada)
- **Contexto y necesidades comunicativas del grupo**: (Diagnóstico situacional de las necesidades de expresión y comprensión de los estudiantes)

### B. Fundamentación curricular
- **Propósito comunicativo y de aprendizaje**: (Intención formativa y comunicativa explícita de la clase)
- **Competencias o procesos del lenguaje**: (Semántica, sintáctica, pragmática, discursiva o literaria)
- **Factor y estándar de competencia**: (Factor de los Estándares Básicos del Lenguaje —producción textual, comprensión e interpretación textual, literatura, medios de comunicación y otros sistemas simbólicos, o ética de la comunicación— y estándar tomado internamente del grupo de grados oficial que incluye el grado de la clase; no escribas el rango de grados, sin inventar códigos)
- **Situación comunicativa real**: (Quién comunica, a quién, para qué y en qué situación de uso; enfoque semántico-comunicativo)
- **DBA correspondiente al grado, cuando aplique**: (DBA oficial de Lenguaje correspondiente al grado, o "No aplica / No especificado". NO inventes códigos DBA ficticios)
- **Saberes previos**: (Experiencias lectoras, saberes discursivos y conocimientos de lengua previos)
- **Evidencias de aprendizaje**: (Manifestaciones comunicativas y producciones observables)
- **Criterios de logro**: (Pautas de calidad comunicativa, discursiva y formal)

### C. Componente lingüístico y discursivo
- **Texto, género, discurso o situación comunicativa**: (Definición y rasgos tipológicos del texto, género o acto comunicativo)
- **Características y estructura del texto**: (Silueta textual, superestructura, macroestructura y partes esenciales)
- **Propósito, destinatario y contexto**: (Audiencia a la que se dirige el texto/discurso y su intencionalidad pragmática)
- **Recursos lingüísticos, gramaticales o discursivos relevantes**: (Conectores, figuras retóricas, tiempos verbales, vocabulario técnico o concordancia)
- **Vocabulario y conceptos clave**: (Términos esenciales para enriquecer el léxico de los estudiantes)
- **Estrategias de comprensión o producción que se enseñarán explícitamente**: (Modelado explícito, lectura dialógica, planificación guiada, borradores)

### D. Secuencia didáctica comunicativa
#### 1. Antes de leer, escribir o comunicar
- **Activación de conocimientos previos**: (Conversación inicial, lluvia de ideas o evocación de experiencias lectoras/orales)
- **Presentación del propósito y del destinatario**: (Explicitar a los estudiantes para qué, por qué y para quién se lee, escribe o dialoga)
- **Exploración de textos, preguntas o situaciones**: (Aproximación inicial al texto o contexto, anticipaciones e hipótesis de lectura)

#### 2. Durante el proceso
- **Lectura guiada, escucha, conversación o análisis de modelos**: (Interacción guiada con textos de calidad o discursos modelo)
- **Identificación de ideas principales, estructura e intención comunicativa**: (Análisis compartido del sentido global y recursos discursivos)
- **Enseñanza explícita de estrategias lingüísticas o discursivas**: (Explicación docente directa sobre conectores, cohesión, registro o voz)
- **Producción oral o escrita, según el objetivo**: (Elaboración activa de borradores o preparación de intervenciones orales)
- **Interacción, discusión, revisión o trabajo colaborativo**: (Intercambio dialógico y retroalimentación entre pares)

#### 3. Después del proceso
- **Revisión y mejora de la producción**: (Criterios de corrección, coevaluación y reescritura consciente)
- **Socialización o publicación**: (Lectura en voz alta, muestra de textos, mural, grabación o publicación)
- **Interpretación y reflexión sobre lo aprendido**: (Metacognición y balance del aprendizaje lingüístico)
- **Transferencia a otra situación comunicativa**: (Aplicación de las estrategias aprendidas a una nueva situación o formato)

### E. Producción y evidencias
- **Producto o desempeño esperado: texto, exposición, conversación, análisis u otro**: (Producto comunicativo tangible o actuación verbal)
- **Características que debe cumplir el producto**: (Pautas de extensión, silueta, adecuación y contenido)
- **Evidencias de comprensión, interpretación o comunicación**: (Muestras concretas de desempeño comunicativo)
- **Criterios de coherencia, cohesión, adecuación y corrección, cuando correspondan**: (Rigor lingüístico y discursivo)
- **Instrumento de evaluación**: (Rúbrica analítica de escritura/oralidad, lista de cotejo o escala descriptiva)
- **Retroalimentación y oportunidad de revisión**: (Mecanismos de devolución pedagógica oportuna para la mejora continua)

### F. Recursos y atención a la diversidad
- **Textos literarios, informativos, argumentativos u otros**: (Corpus textual y lecturas seleccionadas para la clase)
- **Recursos impresos, audiovisuales o digitales**: (Materiales y medios coherentes con: ${wizardData.recursos || 'el aula'})
- **Apoyos de lectura, escritura y comunicación oral**: (Organizadores gráficos, andamios textuales, bancos de conectores)
- **Adaptaciones para distintos niveles de comprensión y expresión**: (Estrategias DUA acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'el grupo'})

### G. Reflexión docente
- **Avances en los procesos comunicativos**: (Progresos detectados en fluidez, comprensión o producción)
- **Dificultades observadas**: (Obstáculos de comprensión, ortografía, coherencia o argumentación detectados)
- **Necesidades de refuerzo**: (Aspectos lingüísticos prioritarios a reforzar en sesiones posteriores)
- **Ajustes para la siguiente sesión**: (Acciones pedagógicas para consolidar las competencias comunicativas)

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

export const FORMATO_INGLES = {
  id: 'generico_ingles',
  titulo: 'Formato genérico de Inglés',
  area: 'Inglés',
  aliasAreas: ['Inglés', 'Ingles', 'Idioma Extranjero Inglés', 'English', 'Lengua Extranjera (Inglés)', 'Lengua Extranjera: Inglés', 'Humanidades: Inglés'],
  subtitulo: 'Competencia comunicativa, comprensión y producción en lengua extranjera',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Los referentes del MEN (Guía 22), los DBA de Inglés y el Marco Común Europeo de Referencia para las Lenguas (MCER) orientan el desarrollo de la competencia comunicativa en sus dimensiones lingüística, pragmática y sociolingüística, articulando las habilidades de comprensión y producción: Listening, Speaking, Reading y Writing según el nivel formativo de los estudiantes.',
  referenciaUrl: 'https://www.mineducacion.gov.co/portal/Preescolar-basica-y-media/Referentes-de-calidad/',
  mcerUrl: 'https://www.coe.int/en/web/common-european-framework-reference-languages',
  secciones: [
    {
      id: 'A',
      titulo: 'A. Identificación y contexto',
      campos: [
        'Institución educativa.',
        'Docente y grado escolar.',
        'Área curricular y duración.',
        'Unidad temática o situación comunicativa.',
        'Tema y contexto de uso del inglés.',
        'Nivel de competencia esperado, cuando esté definido.'
      ]
    },
    {
      id: 'B',
      titulo: 'B. Fundamentación curricular',
      campos: [
        'Objetivo comunicativo de la clase.',
        'Competencia o aprendizaje esperado.',
        'Referente curricular pertinente.',
        'DBA de Inglés, cuando corresponda al grado y esté disponible.',
        'Nivel de referencia del MCER, cuando sea aplicable.',
        'Conocimientos previos.',
        'Evidencias de aprendizaje.',
        'Criterios de logro.'
      ]
    },
    {
      id: 'C',
      titulo: 'C. Componente lingüístico y comunicativo',
      campos: [
        'Función comunicativa: describir, preguntar, narrar, expresar opiniones, dar instrucciones, entre otras.',
        'Vocabulario clave (vocabulary).',
        'Estructuras gramaticales (grammar structures).',
        'Expresiones y frases funcionales (useful expressions).',
        'Pronunciación, entonación y aspectos fonológicos pertinentes.',
        'Contexto y propósito comunicativo.',
        'Modelo de lenguaje o ejemplos de referencia.'
      ]
    },
    {
      id: 'D',
      titulo: 'D. Secuencia didáctica',
      subsecciones: [
        {
          titulo: '1. Inicio — Warm-up',
          campos: [
            'Activación de conocimientos previos.',
            'Presentación del tema y del objetivo comunicativo.',
            'Pregunta, imagen, diálogo o situación motivadora.'
          ]
        },
        {
          titulo: '2. Presentación — Presentation',
          campos: [
            'Introducción contextualizada del vocabulario y las expresiones.',
            'Modelado de estructuras lingüísticas.',
            'Ejemplos de uso en situaciones significativas.',
            'Comprensión inicial mediante escucha, lectura u observación.'
          ]
        },
        {
          titulo: '3. Práctica guiada — Practice',
          campos: [
            'Ejercicios de comprensión y uso del lenguaje.',
            'Actividades para reconocer y emplear vocabulario y estructuras.',
            'Corrección orientadora y retroalimentación.',
            'Práctica individual, por parejas o grupal.'
          ]
        },
        {
          titulo: '4. Producción comunicativa — Production',
          campos: [
            'Diálogo, descripción, presentación, texto breve, dramatización o tarea comunicativa.',
            'Uso del inglés en una situación con propósito definido.',
            'Interacción entre estudiantes cuando corresponda.'
          ]
        },
        {
          titulo: '5. Cierre — Wrap-up',
          campos: [
            'Síntesis de expresiones y aprendizajes.',
            'Verificación del objetivo comunicativo.',
            'Autoevaluación breve.',
            'Actividad de transferencia o práctica posterior.'
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'E. Habilidades comunicativas',
      campos: [
        'Listening: comprensión auditiva.',
        'Speaking: producción e interacción oral.',
        'Reading: comprensión lectora.',
        'Writing: producción escrita.',
        'Mediation: mediación lingüística, cuando sea pertinente al enfoque y al nivel.'
      ]
    },
    {
      id: 'F',
      titulo: 'F. Evaluación del aprendizaje',
      campos: [
        'Evidencia comunicativa esperada.',
        'Criterios de comprensión y producción.',
        'Uso apropiado del vocabulario y las estructuras.',
        'Comprensibilidad, pronunciación e interacción, según la tarea.',
        'Instrumento de evaluación: lista de cotejo, rúbrica, observación o producción.',
        'Retroalimentación y oportunidades de mejora.'
      ]
    },
    {
      id: 'G',
      titulo: 'G. Recursos y atención a la diversidad',
      campos: [
        'Textos, imágenes, audios, videos y diálogos.',
        'Tarjetas de vocabulario y materiales didácticos.',
        'Herramientas digitales, si están disponibles.',
        'Apoyos visuales, modelos lingüísticos y glosarios.',
        'Actividades diferenciadas según el nivel de competencia.',
        'Alternativas para estudiantes con diferentes ritmos de aprendizaje o acceso limitado a recursos.'
      ]
    },
    {
      id: 'H',
      titulo: 'H. Reflexión docente',
      campos: [
        'Logro del objetivo comunicativo.',
        'Dificultades lingüísticas observadas.',
        'Habilidades que requieren refuerzo.',
        'Ajustes para la próxima sesión.'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura con los mismos encabezados y secciones en Markdown:

# PLAN DE CLASE — INGLÉS
## Competencia comunicativa, comprensión y producción en lengua extranjera

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Unidad temática o situación comunicativa:** (Especificar la situación comunicativa en contexto, ej: Describing daily routines, Ordering food at a restaurant, Talking about past vacations, etc.)
- **Tema y contexto de uso del inglés:** ${wizardData.tema} (Definir el propósito y contexto de uso comunicativo real)
- **Nivel MCER esperado:** (Obligatorio: A1, A2 o B1 coherente con el grado de la clase según la progresión de la Guía 22; la meta nacional es B1 en grado 11)
- **Habilidades que se desarrollan:** (Listening, speaking, reading, writing e interacción, con el objetivo "can do")

### B. Fundamentación curricular
- **Objetivo comunicativo de la clase**: (Qué podrán comunicar o expresar los estudiantes en inglés al finalizar la sesión en situaciones contextualizadas)
- **Competencia o aprendizaje esperado**: (Desarrollo de la competencia comunicativa: dimensiones lingüística, pragmática y sociolingüística)
- **Referente curricular pertinente**: (Estándar Básico de Competencias en Lenguas Extranjeras: Inglés - Guía 22 MEN para el ciclo o grado, sin inventar códigos)
- **DBA de Inglés, cuando corresponda al grado y esté disponible**: (DBA oficial de Inglés correspondiente al grado, o "No aplica / No especificado". NO inventes códigos DBA ficticios)
- **Nivel de referencia del MCER, cuando sea aplicable**: (Descriptores ilustrativos de logro del MCER pertinentes al nivel de los estudiantes)
- **Conocimientos previos**: (Vocabulario, estructuras básicas o saberes discursivos previos requeridos)
- **Evidencias de aprendizaje**: (Manifestaciones comunicativas, diálogos o producciones observables)
- **Criterios de logro**: (Indicadores concretos de éxito comunicativo)

### C. Componente lingüístico y comunicativo
- **Función comunicativa**: (Describir personas/lugares, formular preguntas, narrar secuencias, expresar opiniones, dar instrucciones, etc.)
- **Vocabulario clave (vocabulary)**: (Lista estructurada de palabras, expresiones léxicas y colocaciones esenciales en inglés)
- **Estructuras gramaticales (grammar structures)**: (Patrones morfosintácticos modelados y practicados, ej: Simple Present, modal verbs, wh- questions, etc.)
- **Expresiones y frases funcionales (useful expressions)**: (Frases hechas, chunks comunicativos y fórmulas conversacionales auténticas)
- **Pronunciación, entonación y aspectos fonológicos pertinentes**: (Foco fonológico específico: entonación ascendente/descendente en preguntas, sonidos contrastivos, acentuación o contracciones)
- **Contexto y propósito comunicativo**: (Razón auténtica por la cual se utiliza este repertorio lingüístico)
- **Modelo de lenguaje o ejemplos de referencia**: (Mini-diálogo modelo, oraciones de ejemplo o plantilla de producción)

### D. Secuencia didáctica

#### 1. Inicio — Warm-up
- **Activación de conocimientos previos**: (Dinámica lúdica corta, juego comunicativo, brainstorming o icebreaker en inglés)
- **Presentación del tema y del objetivo comunicativo**: (Explicación motivadora de lo que los estudiantes lograrán comunicar hoy)
- **Pregunta, imagen, diálogo o situación motivadora**: (Estímulo detonante visual, auditivo o situacional)

#### 2. Presentación — Presentation
- **Introducción contextualizada del vocabulario y las expresiones**: (Presentación significativa mediante imágenes, mímica, realia o contexto)
- **Modelado de estructuras lingüísticas**: (Modelado explícito del patrón por parte del docente con claridad)
- **Ejemplos de uso en situaciones significativas**: (Demostración de uso en oraciones y diálogos auténticos)
- **Comprensión inicial**: (Verificación rápida de comprensión mediante preguntas guía - CCQs, escucha activa u observación)

#### 3. Práctica guiada — Practice
- **Ejercicios de comprensión y uso del lenguaje**: (Actividades controladas y semicontroladas de práctica lingüística)
- **Actividades para reconocer y emplear vocabulario y estructuras**: (Ejercicios en parejas, drills comunicativos, tarjetas o juegos de roles guiados)
- **Corrección orientadora y retroalimentación**: (Corrección formativa oportuna y positiva de pronunciación y uso del idioma)
- **Modalidad de trabajo**: (Individual, parejas o trabajo cooperativo grupal)

#### 4. Producción comunicativa — Production
- **Tarea comunicativa o producción**: (Role-play auténtico, creación de diálogo, presentación breve, texto descriptivo o dramatización)
- **Uso del inglés en una situación con propósito definido**: (Uso autónomo del idioma para resolver un reto o comunicar un mensaje real)
- **Interacción entre estudiantes**: (Espacio de interacción dinámica y colaborativa entre pares)

#### 5. Cierre — Wrap-up
- **Síntesis de expresiones y aprendizajes**: (Recapitulación colectiva de las expresiones, vocabulario y estructuras claves)
- **Verificación del objetivo comunicativo**: (Ticket de salida, check-in o comprobación rápida de logro)
- **Autoevaluación breve**: (Reflexión de los estudiantes sobre su propia confianza y desempeño)
- **Actividad de transferencia o práctica posterior**: (Desafío de práctica autónoma para el hogar o el entorno cotidiano)

### E. Habilidades comunicativas
(Selecciona y describe únicamente las habilidades pertinentes al objetivo de esta sesión:
- **Listening (Comprensión auditiva)**: [Describe la actividad auditiva guiada o "No es foco principal en esta sesión"]
- **Speaking (Producción e interacción oral)**: [Describe la interacción comunicativa oral o "No es foco principal en esta sesión"]
- **Reading (Comprensión lectora)**: [Describe el texto breve y las estrategias lectoras o "No es foco principal en esta sesión"]
- **Writing (Producción escrita)**: [Describe la tarea de escritura guiada/libre o "No es foco principal en esta sesión"]
- **Mediation (Mediación lingüística)**: [Describe la mediación de mensajes o apoyo entre pares cuando corresponda])

### F. Evaluación del aprendizaje
- **Evidencia comunicativa esperada**: (Producto oral o escrito o desempeño comunicativo observable)
- **Criterios de comprensión y producción**: (Criterios formativos de inteligibilidad, coherencia y adecuación)
- **Uso apropiado del vocabulario y las estructuras**: (Valoración de la precisión y riqueza comunicativa empleada)
- **Comprensibilidad, pronunciación e interacción**: (Capacidad de hacerse entender e interactuar significativamente)
- **Instrumento de evaluación**: (Rúbrica formativa, lista de cotejo o registro de desempeño comunicativo)
- **Retroalimentación y oportunidades de mejora**: (Estrategia constructiva de feedback para los estudiantes)

### G. Recursos y atención a la diversidad
- **Textos, imágenes, audios, videos y diálogos**: (Recursos auditivos y visuales disponibles: ${wizardData.recursos || 'según disponibilidad'})
- **Tarjetas de vocabulario y materiales didácticos**: (Flashcards, láminas, organizadores o guías de apoyo)
- **Herramientas digitales o desconectadas**: (Uso de plataformas, audios digitales o alternativas desconectadas)
- **Apoyos visuales, modelos lingüísticos y glosarios**: (Scaffolding visual y lingüístico para facilitar la comprensión)
- **Actividades diferenciadas según el nivel de competencia**: (Adaptaciones para diferentes ritmos y niveles en lengua extranjera)
- **Alternativas para estudiantes con ritmos diversos (DUA)**: (Estrategias inclusivas acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'las necesidades del aula'})

### H. Reflexión docente
- **Logro del objetivo comunicativo**: (Preguntas de auto-reflexión docente para evaluar si se alcanzó el propósito formativo)
- **Dificultades lingüísticas observadas**: (Registro de dudas frecuentes, interferencia de la lengua materna o dificultades fonéticas)
- **Habilidades que requieren refuerzo**: (Habilidades que ameritan mayor ejercitación en clases venideras)
- **Ajustes para la próxima sesión**: (Decisiones pedagógicas para la continuidad didáctica)

---

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema de inglés.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase (Warm-up, Practice, Production o Wrap-up) debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

export const FORMATO_CIENCIAS_SOCIALES = {
  id: 'generico_ciencias_sociales',
  titulo: 'Formato genérico de Ciencias Sociales',
  area: 'Ciencias Sociales',
  aliasAreas: ['Ciencias Sociales', 'Sociales', 'Historia', 'Geografía', 'Constitución y Democracia', 'Cátedra de Paz', 'Ciencias Sociales y Competencias Ciudadanas'],
  subtitulo: 'Pensamiento social, análisis crítico de fuentes y formación ciudadana',
  formato: 'Estructura predeterminada',
  publico: true,
  fundamento: 'Los Estándares Básicos de Competencias en Ciencias Sociales (Guía 7 MEN) articulan tres ejes formativos: relaciones con la historia y las culturas, relaciones espaciales y ambientales, y relaciones ético-políticas. Promueven el análisis crítico de fuentes, la empatía histórica, la comprensión territorial y el ejercicio de la ciudadanía activa.',
  referenciaUrl: 'https://www.mineducacion.gov.co/1621/articles-116042_archivo_pdf3.pdf',
  secciones: [
    {
      id: 'A',
      titulo: 'A. Identificación y contexto',
      campos: [
        'Institución educativa.',
        'Docente y grado escolar.',
        'Área curricular y duración.',
        'Eje temático y problema de indagación social.',
        'Contexto sociocultural, histórico o geográfico relevante.'
      ]
    },
    {
      id: 'B',
      titulo: 'B. Fundamentación curricular',
      campos: [
        'Eje articulador MEN (Historia y culturas / Espacio y ambiente / Ético-político).',
        'Competencia o desempeño esperado.',
        'Estándar básico de competencia.',
        'DBA de Ciencias Sociales correspondiente al grado.',
        'Saberes previos.',
        'Evidencias de aprendizaje.',
        'Criterios de logro y pensamiento crítico.'
      ]
    },
    {
      id: 'C',
      titulo: 'C. Conceptos y fuentes de indagación social',
      campos: [
        'Conceptos clave y categorías de análisis (tiempo histórico, espacio geográfico, poder, cultura).',
        'Fuentes primarias o secundarias (textos históricos, testimonios, mapas, estadísticas, prensa).',
        'Preguntas problematizadoras centrales.'
      ]
    },
    {
      id: 'D',
      titulo: 'D. Secuencia didáctica de indagación social',
      subsecciones: [
        {
          titulo: '1. Momento Inicial / Indagación',
          campos: [
            'Pregunta problematizadora, dilema moral o situación detonante.',
            'Activación de ideas previas y contraste de nociones cotidianas.',
            'Presentación del propósito de aprendizaje y contexto de la indagación.'
          ]
        },
        {
          titulo: '2. Momento Central / Análisis y Confrontación',
          campos: [
            'Lectura e interpretación de fuentes históricas, geográficas o estadísticas.',
            'Análisis espacial en mapas o reconstrucción cronológica.',
            'Trabajo colaborativo, contrastación de perspectivas o debate guiado.',
            'Modelación y conceptualización acompañada por el docente.'
          ]
        },
        {
          titulo: '3. Momento de Cierre / Síntesis y Postura Crítica',
          campos: [
            'Construcción de conclusiones fundamentadas y síntesis conceptual.',
            'Argumentación de posturas ciudadanas o propuestas de solución.',
            'Metacognición y verificación formativa del aprendizaje.'
          ]
        }
      ]
    },
    {
      id: 'E',
      titulo: 'E. Evaluación del aprendizaje',
      campos: [
        'Evidencias de pensamiento crítico y análisis social.',
        'Criterios de argumentación, uso riguroso de fuentes y empatía histórica.',
        'Instrumento de evaluación formativa (rúbrica analítica, guía de cotejo o debate).',
        'Retroalimentación orientadora y acciones de refuerzo.'
      ]
    },
    {
      id: 'F',
      titulo: 'F. Recursos y atención a la diversidad',
      campos: [
        'Fuentes documentales, mapas, atlas, medios digitales o archivos patrimoniales.',
        'Adaptaciones inclusivas DUA (apoyos visuales, glosarios históricos, opciones múltiples de expresión).',
        'Estrategias diferenciadas según ritmos de aprendizaje.'
      ]
    },
    {
      id: 'G',
      titulo: 'G. Reflexión docente',
      campos: [
        'Desafíos conceptuales o interpretativos observados.',
        'Logros formativos y participación del estudiantado.',
        'Ajustes pedagógicos para la siguiente sesión.'
      ]
    }
  ],
  generarPromptInstrucciones: (wizardData, userProfile) => `Formatea la respuesta siguiendo estrictamente esta estructura exacta en Markdown:

# PLAN DE CLASE — CIENCIAS SOCIALES

${formatIdentificationMarkdown(resolveRealIdentification(wizardData, userProfile))}
- **Eje temático y problema de indagación social:** ${wizardData.tema || '[Tema central y problema de indagación social]'}
- **Contexto sociocultural, histórico o geográfico relevante:** (Describe el entorno sociocultural, los actores sociales y la relevancia histórica, territorial o comunitaria para el grupo)

---

### B. Fundamentación curricular
- **Eje articulador MEN:** (Indicar: Relaciones con la historia y las culturas, Relaciones espaciales y ambientales, o Relaciones ético-políticas)
- **Competencia o aprendizaje esperado:** (Competencia curricular de Ciencias Sociales a desarrollar)
- **Estándar básico de competencia:** (Estándar pertinente de la Guía 7 del MEN tomado internamente del grupo de grados oficial que incluye el grado de la clase; no escribas el rango de grados, sin inventar códigos)
- **Me aproximo al conocimiento como científico(a) social:** (Habilidades de indagación social que se ejercitan: formular preguntas, usar fuentes, contrastar perspectivas, argumentar)
- **Competencias a desarrollar:** (Cognitivas, procedimentales, interpersonales e integradoras)
- **Compromisos personales y sociales / competencias ciudadanas:** (Convivencia y paz, participación y responsabilidad democrática, pluralidad e identidad; Cátedra de la Paz cuando el tema lo permita)
- **DBA de Ciencias Sociales:** (Derecho Básico de Aprendizaje aplicable a este grado)
- **Saberes previos:** (Nociones previas o representaciones cotidianas que se activarán)
- **Evidencias de aprendizaje:** (Desempeño o manifestación observable del pensamiento social)
- **Criterios de logro:** (Criterios claros de valoración formativa)

---

### C. Conceptos y fuentes de indagación social
- **Conceptos clave:** (Conceptos sociales, históricos o geográficos fundamentales)
- **Fuentes de indagación:** (Fuentes primarias o secundarias, testimonios, mapas, cartografía o archivos históricos a emplear)
- **Pregunta problematizadora:** (Pregunta central que guía la indagación y estimula el debate reflexivo)

---

### D. Secuencia didáctica de indagación social

#### 1. Momento Inicial / Indagación
- **Pregunta o situación detonante:** (Situación problema, dilema, imagen histórica o mapa para despertar interés y motivar)
- **Activación de conocimientos previos:** (Preguntas dialógicas para explorar lo que los estudiantes saben o intuyen)
- **Presentación del propósito:** (Socialización explícita del objetivo de aprendizaje y la ruta de indagación)

#### 2. Momento Central / Análisis y Confrontación
- **Lectura e interpretación de fuentes:** (Análisis de documentos, relatos, cartografía o datos geográficos)
- **Construcción o explicación del concepto:** (Conceptualización y contextualización histórica/social guiada por el docente)
- **Trabajo colaborativo y debate:** (Actividad práctica central donde contrastan posturas, causas y consecuencias)
- **Uso de recursos y mediación:** (Uso de mapas, fuentes impresas o recursos disponibles: ${wizardData.recursos || 'según disponibilidad'})

#### 3. Momento de Cierre / Síntesis y Postura Crítica
- **Socialización y síntesis:** (Puesta en común de conclusiones y elaboración colectiva de síntesis)
- **Argumentación de posturas:** (Expresión razonada de puntos de vista o propuestas ciudadanas transformadoras)
- **Comprobación y conclusiones:** (Verificación formativa breve del aprendizaje alcanzado)

---

### E. Evaluación del aprendizaje
- **Evidencias de pensamiento crítico:** (Producciones, debates o mapas conceptuales que evidencian el aprendizaje)
- **Criterios de valoración:** (Criterios de rigurosidad en fuentes, argumentación y empatía social)
- **Instrumento formativo:** (Rúbrica analítica, escala de observación o lista de cotejo)
- **Retroalimentación formativa:** (Estrategias de devolución orientadora y refuerzo)

---

### F. Recursos y atención a la diversidad
- **Materiales y fuentes:** (Recursos coherentes con: ${wizardData.recursos || 'el aula'})
- **Adaptaciones DUA:** (Ajustes inclusivos acordes a: ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : 'las necesidades del grupo'})
- **Alternativas metodológicas:** (Andamiajes para ritmos diversos y profundización)

---

### G. Reflexión docente
- **Dificultades previstas:** (Aspectos conceptuales donde se anticipa mayor necesidad de mediación)
- **Logros esperados:** (Resultados formativos que se aspira evidenciar al finalizar)
- **Ajustes futuros:** (Proyecciones para la siguiente sesión)

---

### 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema de ciencias sociales.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`
};

/**
 * Catálogo completo de plantillas genéricas oficiales
 */
export const GENERIC_TEMPLATES = [
  FORMATO_INFORMATICA,
  FORMATO_MATEMATICAS,
  FORMATO_CIENCIAS_NATURALES,
  FORMATO_CIENCIAS_SOCIALES,
  FORMATO_LENGUA_CASTELLANA,
  FORMATO_INGLES
];

/**
 * Normaliza y empareja un nombre de área con las plantillas oficiales
 */
export const normalizeAreaName = (areaString = '') => {
  const normalized = (areaString || '').trim().toLowerCase();
  if (normalized.includes('social') || normalized.includes('histori') || normalized.includes('geograf') || normalized.includes('ciudadan')) return 'Ciencias Sociales';
  if (normalized.includes('matemát') || normalized.includes('matemat')) return 'Matemáticas';
  if (normalized.includes('natural') || normalized.includes('biolog') || normalized.includes('quimic') || normalized.includes('fisic') || (normalized.includes('ciencia') && !normalized.includes('social'))) return 'Ciencias Naturales';
  if (normalized.includes('lengua') || normalized.includes('lenguaje') || normalized.includes('español') || normalized.includes('castellano') || normalized.includes('literatura')) return 'Lengua Castellana';
  if (normalized.includes('inglés') || normalized.includes('ingles') || normalized.includes('english')) return 'Inglés';
  if (normalized.includes('tecnolog') || normalized.includes('informát') || normalized.includes('computac')) return 'Tecnología e Informática';
  return areaString;
};

/**
 * Obtiene la plantilla genérica correspondiente para una materia dada
 */
export const getGenericTemplateForArea = (areaString = '') => {
  const canonicalArea = normalizeAreaName(areaString);
  const found = GENERIC_TEMPLATES.find(t => 
    t.area === canonicalArea || 
    (t.aliasAreas && t.aliasAreas.some(alias => alias.toLowerCase() === canonicalArea.toLowerCase() || areaString.toLowerCase().includes(alias.toLowerCase())))
  );
  return found || FORMATO_INFORMATICA;
};

/**
 * Obtiene una plantilla genérica por su título o ID
 */
export const getGenericTemplateByTitleOrId = (identifier = '') => {
  if (!identifier) return null;
  const match = GENERIC_TEMPLATES.find(t => 
    t.id === identifier || 
    t.titulo.toLowerCase() === identifier.toLowerCase()
  );
  return match || null;
};

/**
 * Genera el texto con la estructura para visualización de una plantilla genérica
 */
export const getTemplateStructureSummary = (template) => {
  if (!template || !template.secciones) return '';
  return template.secciones.map(sec => {
    let text = `${sec.titulo}\n`;
    if (sec.subsecciones) {
      sec.subsecciones.forEach(sub => {
        text += `  • ${sub.titulo}\n`;
        sub.campos.forEach(c => {
          text += `    - ${c}\n`;
        });
      });
    } else if (sec.campos) {
      sec.campos.forEach(c => {
        text += `  • ${c}\n`;
      });
    }
    return text;
  }).join('\n');
};

/**
 * Resuelve la plantilla efectiva que debe gobernar la generación del plan.
 * Regla de prevalencia:
 * Si el docente configuró o seleccionó una plantilla propia personalizada (con formatoInstrucciones),
 * dicho formato propio PREVALECE estructuralmente sobre cualquier formato genérico.
 */
export const resolveEffectiveTemplate = (wizardData = {}, customTemplates = [], userProfile = null) => {
  // 1. Prevalencia de Formato Propio del Docente
  const hasCustomInstructions = typeof wizardData.formatoInstrucciones === 'string' && wizardData.formatoInstrucciones.trim() !== '';
  
  // Buscar si el título seleccionado corresponde a una plantilla personalizada del docente
  const matchedCustomTemplate = customTemplates.find(ct => 
    ct.titulo && 
    wizardData.formato && 
    ct.titulo.toLowerCase() === wizardData.formato.toLowerCase() &&
    !GENERIC_TEMPLATES.some(gt => gt.titulo.toLowerCase() === ct.titulo.toLowerCase())
  );

  if (hasCustomInstructions || (matchedCustomTemplate && matchedCustomTemplate.instrucciones)) {
    return {
      isCustom: true,
      titulo: wizardData.formato || matchedCustomTemplate?.titulo || 'Formato Institucional Personalizado',
      instrucciones: wizardData.formatoInstrucciones || matchedCustomTemplate?.instrucciones || '',
      templateObj: null
    };
  }

  // 2. Si el usuario seleccionó explícitamente un formato genérico por título
  if (wizardData.formato) {
    const directGeneric = getGenericTemplateByTitleOrId(wizardData.formato);
    if (directGeneric) {
      return {
        isCustom: false,
        titulo: directGeneric.titulo,
        instrucciones: directGeneric.generarPromptInstrucciones(wizardData, userProfile),
        templateObj: directGeneric
      };
    }
  }

  // 3. Fallback inteligente según el Área Curricular seleccionada
  const genericForArea = getGenericTemplateForArea(wizardData.materia);
  return {
    isCustom: false,
    titulo: genericForArea.titulo,
    instrucciones: genericForArea.generarPromptInstrucciones(wizardData, userProfile),
    templateObj: genericForArea
  };
};
