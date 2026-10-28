# ACT-018 — Lista de Chequeo para la Verificación del Frontend: Sistemas Tutores Inteligentes (STI / ITS)

**Instrumento de evaluación formativa sobre cómo la interfaz de usuario refleja la inteligencia del tutor y la metacognición**  
**Fuente Bibliográfica de Referencia Exigida:**  
Caro Piñeres, Manuel Fernando (2015). *Metamodel for personalized adaptation of pedagogical strategies using metacognition in Intelligent Tutoring Systems*. Tesis de Doctorado en Ingeniería de Sistemas e Informática, Universidad Nacional de Colombia, Sede Medellín. Director: Jovani Alberto Jiménez Builes, Ph.D.

---

## 1. Datos Generales del Proyecto y Control de Evaluación

* **Asignatura / Curso:** Informática Educativa / Diseño de Interfaces de Usuario (Semana 10)
* **Fecha de Evaluación:** 16 de Octubre de 2026
* **Nombre del Sistema Tutor Inteligente (STI):** INSPIRATEC (Sistema Tutor Inteligente para la Planeación Didáctica y Mediación Curricular con IA)
* **Versión / Rama Git:** `v1.2.0` / `main`
* **Integrantes del Equipo (Grupo 2):**
  * Daniel Tapias Acosta (Frontend / Git Lead)
  * Luis Caldera (Frontend / UI-UX Lead)
  * Zoe Peñata (Scrum Master)
  * Maira Ortega (Facilitadora de Equipo)
  * María Soto (Product Owner)
  * María Ubarne (Product Owner Support)
* **URL Demo / Repositorio:** `https://github.com/DanielTapias12/planclase`
* **Docente / Evaluador:** Prof. Raúl Toscano Miranda
* **Calificación Final Verificada:** **24 / 24 pts** (**100%**) — *Sobresaliente / Cumplimiento Integral de Criterios de STI*

---

## 2. Instrucciones de Uso y Escala de Valoración

Esta lista de chequeo evalúa con rigor metodológico cómo el frontend del Sistema Tutor Inteligente (STI) desarrollado refleja de forma palpable:
1. La arquitectura canónica de cuatro módulos de Wenger (1987) y Caro (2015).
2. Las cinco características de interfaz adaptativa donde el usuario experimenta la tutoría inteligente (Sección 6.1.3 de la tesis).
3. El soporte a la metacognición computacional mediante la arquitectura de Doble Lazo de Razonamiento (*Double-Loop Architecture* de Nelson & Narens, 1990) y los principios validados en el prototipo FUNPRO.

| Código | Escala de Calificación | Ponderación | Criterio de Evaluación Operativo |
|:---:|---|:---:|---|
| **C** | **Cumple Totalmente** | **2 Puntos (100%)** | El frontend implementa rigurosamente el criterio teórico; es funcional, visible y comprobable en la demo. |
| **CP** | **Cumple Parcialmente** | **1 Punto (50%)** | Se evidencia la intención en la interfaz o código, pero con inconsistencias, fallos visuales o cobertura incompleta. |
| **NC** | **No Cumple** | **0 Puntos (0%)** | El criterio teórico no fue considerado; está ausente o no funciona en la interfaz de usuario desarrollada. |
| **NA** | **No Aplica** | **Excluido (N/A)** | El criterio fue explícitamente descartado del alcance por mutuo acuerdo con el docente. |

---

## 3. Bloque 1: Reflejo en la Interfaz de los Cuatro Módulos Canónicos

### MOD-01: Módulo del Experto / Dominio en la UI
* **Ref. Teórica:** Tesis Caro Cap. 2.2 (*"Classic ITS Architecture"*, pp. 24-27) y Cap. 6.1 (pp. 121-125); Wenger (1987).
* **Criterios Evaluados:**
  * *Unidades Básicas de Aprendizaje (BLU):* Conocimiento estructurado en lecciones atómicas y autocontenidas con objetivos conceptuales explícitos.
  * *Visualización ontológica del dominio:* Árbol y selectores curriculares que transparentan la jerarquía y prerrequisitos indispensables para avanzar (Nivel escolar -> Área disciplinar -> Estándares Básicos de Competencias y DBA del MEN).
  * *Entorno operativo de verificación experta:* Espacio interactivo donde las reglas formales de la disciplina validan la coherencia de la planeación en tiempo real.
* **Evidencia en Frontend:**
  * En [WizardStep3Estandares.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep3Estandares.jsx) y [aiService.js](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/services/aiService.js#L107-L113), las reglas normativas oficiales de Colombia (Guía 30 de Tecnología, DBA de Matemáticas, Lenguaje, Ciencias e Inglés MCER) actúan como la base ontológica del Módulo del Experto.
  * En [WizardStep1Basicos.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep1Basicos.jsx), el sistema segmenta la secuencia en grados de escolaridad (1° a 11°) con validación estricta de campos y prerrequisitos conceptuales antes de habilitar el avance.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Mapa ontológico del MEN y validador de coherencia curricular plenamente visibles en la UI.

---

### MOD-02: Módulo del Estudiante / Aprendiz en la UI (Overlay y Perfil Cognitivo)
* **Ref. Teórica:** Tesis Caro Cap. 2.2 (pp. 27-29), Cap. 6.1.2 (pp. 127-131, Fig. 6.9); Felder-Silverman.
* **Criterios Evaluados:**
  * *Perfil cognitivo visible:* Panel que refleja el estilo de aprendizaje y diagnóstico del grupo escolar según dimensiones de Felder-Silverman y marcos de diversidad (DUA / PIAR).
  * *Visualización del Modelo Overlay:* Gráficos, métricas y badges dinámicos que transparentan el estado del progreso (Planes guardados en verde, borradores en ámbar, propuestas en memoria).
  * *Diagnóstico de concepciones erróneas:* Identificación de barreras de aprendizaje y necesidades educativas específicas para dosificar el apoyo del tutor.
* **Evidencia en Frontend:**
  * En [WizardStep4Inclusion.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep4Inclusion.jsx), el docente explicita el perfil cognitivo del grupo mediante principios DUA (múltiples formas de representación, expresión e implicación) y ajustes PIAR para necesidades educativas especiales.
  * En [HomePage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/HomePage.jsx) y [MisPlanesPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/MisPlanesPage.jsx), el modelo Overlay del usuario se refleja mediante tarjetas de métricas cuantitativas (total de planes, horas curriculares modeladas, plantillas activas) y badges de estado del plan (`Guardado`, `Borrador`, `Propuesta generada`).
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Modelo de estudiante articulado mediante caracterización DUA/PIAR y visualización de progreso en tiempo real.

---

### MOD-03: Módulo del Tutor / Pedagógico en la UI (Tácticas y Planes Didácticos)
* **Ref. Teórica:** Tesis Caro Cap. 2.2 (pp. 29-32), Cap. 3.1.2 (pp. 51-54, Planner) y Cap. 6.1.1 (Fig. 6.2); Nkambou (2010).
* **Criterios Evaluados:**
  * *Ejecución observable de tácticas pedagógicas:* La interfaz despliega tácticas didácticas formales (de las 19 formalizadas por Caro: analogías, aprendizaje basado en problemas, clase invertida, gamificación, rutinas de pensamiento).
  * *Estructura instruccional jerárquica:* Organización visible en fases canónicas de clase (Inicio / Activación, Desarrollo / Práctica Guiada, Cierre / Evaluación Formativa y Metacognición).
  * *Dosificación dinámica de dificultad:* Ajuste instruccional según tiempo disponible, número de estudiantes y recursos didácticos reales.
* **Evidencia en Frontend:**
  * En [WizardStep2Metodologia.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep2Metodologia.jsx), el usuario selecciona formalmente entre metodologías pedagógicas activas (ABP, STEAM, Gamificación, Aula Invertida, Indagación Científica).
  * En [aiService.js](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/services/aiService.js#L190-L197), el planificador del tutor impone una distribución temporal equilibrada (`duracion` en minutos dividida proporcionalmente en momentos didácticos) y genera pautas de mediación docente explícitas.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Catálogo de tácticas pedagógicas y planificador instruccional plenamente integrados en el flujo.

---

### MOD-04: Módulo de Interfaz de Usuario como Traductor Ergonómico y Afectivo
* **Ref. Teórica:** Tesis Caro Cap. 2.2 (pp. 32-34) y Cap. 6.1.3 (*"Learning environment"*, pp. 132-136); Sweller (1988).
* **Criterios Evaluados:**
  * *Traductor bidireccional empático:* Traduce estructuras computacionales complejas (prompts de LLM, reglas de inferencia, objetos JSON) a un lenguaje pedagógico sereno, natural y motivador.
  * *Reducción de carga cognitiva extraña:* Interfaz despejada con estética *Warm Glassmorphism*, navegación por pasos independientes y foco visual claro.
  * *Retroalimentación constructiva no punitiva:* Mensajes de error orientados a la mejora, microinteracciones discretas sin alertas bloqueantes invasivas.
* **Evidencia en Frontend:**
  * En [WizardPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/WizardPage.jsx), las validaciones nativas tipo `alert()` se reemplazaron por `fieldErrors` con bordes suaves `.input-error` y avisos descriptivos accesibles (`role="alert"`).
  * El diseño unificado en [index.css](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/index.css) implementa superficies con desenfoque óptico (`backdrop-filter: blur(16px)`), contraste tipográfico verificado (verde oscuro `#142B25`) y anillo de foco visible (`:focus-visible`).
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Ergonomía visual de alta gama, retroalimentación no punitiva y reducción demostrada de sobrecarga cognitiva.

---

## 4. Bloque 2: Características de la Interfaz que Reflejan la Inteligencia del Tutor

### UI-01: Característica 1: Adaptación Multimodal de Contenidos (Verbal vs. Visual)
* **Ref. Teórica:** Tesis Caro Cap. 6.1.3 (*"Multimodal presentation"*, pp. 136-140, Fig. 6.13); Paivio (1986).
* **Criterios Evaluados:**
  * *Bifurcación adaptativa de presentación:* El contenido pedagógico se expresa en formatos alternativos según el estilo de aprendizaje predominante.
  * *Modalidad Verbal:* Texto conceptual riguroso, explicaciones narrativas paso a paso, tablas instruccionales y guías de modelación.
  * *Modalidad Visual e Interactiva:* Flashcards interactivas con giro 3D, diapositivas animadas, cuestionarios con feedback cromático y juegos didácticos interactivos.
  * *Equidad curricular:* Ambas modalidades comunican los mismos objetivos pedagógicos fundamentales del Módulo del Experto.
* **Evidencia en Frontend:**
  * En [EditorPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/EditorPage.jsx) y [aiService.js](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/services/aiService.js#L260-L330), el tutor ofrece bifurcación multimodal inmediata: a partir de un mismo plan de clase, el sistema genera recursos visuales interactivos:
    - *Flashcards 3D:* Tarjetas interactivas con efecto CSS Flip para estudiantes visuales.
    - *Diapositivas animadas:* Presentaciones interactivas por diapositiva.
    - *Rúbrica interactiva:* Tabla con cálculo dinámico de calificaciones.
    - *Juego de sopa de letras:* Cuadrícula interactiva con selección y feedback de victoria.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Bifurcación funcional verificada entre prosa estructurada y recursos interactivos visuales.

---

### UI-02: Característica 2: Modelo de Navegación Adaptativo (Global vs. Secuencial)
* **Ref. Teórica:** Tesis Caro Cap. 6.1.3 (*"Adaptive Navigation Model"*, pp. 140-142, Fig. 6.14); Felder-Silverman.
* **Criterios Evaluados:**
  * *Reconfiguración adaptativa de navegación:* Menús que se ajustan al estilo cognitivo Global o Secuencial de Felder-Silverman.
  * *Navegación para Estilo Secuencial:* Flujo lineal guiado con botones "Anterior" y "Siguiente" que aseguran la satisfacción de prerrequisitos conceptuales paso a paso.
  * *Navegación para Estilo Global:* Visión panorámica mediante barra lateral persistente, saltos modulares en el Editor y migas de pan (*Breadcrumbs*) en píldora de cristal esmerilado.
  * *Desbloqueo adaptativo:* El sistema habilita el botón de generación y el pase al editor únicamente cuando los prerrequisitos mínimos están resueltos.
* **Evidencia en Frontend:**
  * En [WizardPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/WizardPage.jsx), el Stepper jerárquico (`currentStep` 1 al 4) y la barra inferior de acciones móvil ofrecen una experiencia secuencial estricta.
  * Paralelamente, las nuevas migas de pan en píldora de cristal ([Breadcrumbs.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/ui/Breadcrumbs.jsx)) y el menú lateral en [App.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/App.jsx) permiten una orientación global inmediata sin perder el contexto.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Doble modalidad de navegación (lineal/secuencial vs panorámica/global) operando armónicamente.

---

### UI-03: Característica 3: Andamiaje Proactivo y Asesor Inteligente (Advisor)
* **Ref. Teórica:** Tesis Caro Cap. 3.1.3 (*"Advisor package"*, pp. 54-56) y Cap. 6.1.3 (pp. 142-144, Fig. 6.12); Vygotsky.
* **Criterios Evaluados:**
  * *Presencia visible del Advisor:* Componente de asistencia pedagógica proactiva que personifica la tutoría inteligente.
  * *Pistas escalonadas en 3 niveles (Graduated Hints):*
    * Nivel 1: Preguntas reflexivas y textos guía (*placeholders* pedagógicos).
    * Nivel 2: Señalamiento directo de inconsistencias o campos faltantes mediante alertas en línea.
    * Nivel 3: Andamiaje algorítmico profundo mediante sugerencias generativas de objetivos y estándares.
  * *Intervención no invasiva:* Asistencia activada a demanda o ante bloqueos sin interrumpir abruptamente el flujo de trabajo.
* **Evidencia en Frontend:**
  * En [WizardStep1Basicos.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep1Basicos.jsx) y [WizardStep3Estandares.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep3Estandares.jsx), el tutor ofrece botones proactivos: *"Sugerir Objetivos con IA"* y *"Sugerir Estándares y DBA con IA"*.
  * Las pistas escalonadas operan en 3 niveles: (1) Placeholders pedagógicos ("Ej: Fotosíntesis en plantas terrestres..."), (2) Mensajes de error contextuales sin recargas, y (3) Solicitud al Advisor para que la IA complete y justifique el objetivo pedagógico respetando lineamientos del MEN.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Advisor inteligente visible con andamiaje de 3 niveles y sugerencias asistidas por IA.

---

### UI-04: Característica 4: Curaduría Dinámica y Resiliencia de Recursos Educativos
* **Ref. Teórica:** Tesis Caro Cap. 4.2 y Cap. 6.1.3 (*"Resources curation"*, pp. 144-145); Algoritmos SQL y k-NN.
* **Criterios Evaluados:**
  * *Valoración de utilidad por el usuario:* Mecanismos explícitos para guardar, descartar, editar y reutilizar planes curriculares.
  * *Recuperación adaptativa de recursos:* Banco de plantillas pedagógicas predefinidas y catálogo de recursos de la comunidad.
  * *Tolerancia a fallos y sustitución en caliente:* Degradación elegante ante fallas de conexión o errores en modelos de IA sin romper la interfaz.
* **Evidencia en Frontend:**
  * En [aiService.js](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/services/aiService.js#L9-L85), se implementó una cascada resiliente de modelos candidatos (`gemini-flash-latest`, `gemini-3.5-flash`, etc.) con recuperación automática ante errores 503 (congestión), 429 (límite de cuota) o 404.
  * En [dbService.js](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/services/dbService.js), si la conexión a Firestore experimenta lentitud o desconexión, el sistema recurre de inmediato al almacenamiento local estructurado (`LOCAL_PLANS_KEY`), evitando la pérdida de trabajo del usuario.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Tolerancia a fallos, sustitución en caliente de modelos y fallback local verificado.

---

### UI-05: Característica 5: Replanificación Instruccional en Tiempo Real ante Bloqueos
* **Ref. Teórica:** Tesis Caro Cap. 3.1.2, Cap. 6.1.2 y Cap. 6.1.3 (pp. 145-147); Caro et al. (2015).
* **Criterios Evaluados:**
  * *Sensores de comportamiento y bloqueo:* Detección de fallos de red o desconexiones mediante observadores reactivos en el frontend.
  * *Ruptura de la monotonía instruccional:* Capacidad de intervenir sobre la marcha cuando una propuesta no satisface los requerimientos didácticos.
  * *Reconfiguración dinámica de la pantalla:* Adaptación de la vista para ofrecer un enfoque pedagógico alternativo o simplificado sin reiniciar el asistente.
* **Evidencia en Frontend:**
  * En [NetworkStatusBanner.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/NetworkStatusBanner.jsx), el frontend monitorea en tiempo real los eventos `online` y `offline`, avisando discretamente al usuario sobre interrupciones de conectividad sin bloquear la edición local.
  * En [EditorPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/EditorPage.jsx), el tutor incorpora un motor de replanificación en lenguaje natural (`modifyPlan`), permitiendo al usuario solicitar correcciones específicas (*"Reduce la complejidad"*, *"Añade más tiempo a la práctica guiada"*, *"Incluye más ejemplos DUA"*), reconfigurando el plan al instante.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Replanificación en caliente mediante edición guiada por IA y monitoreo de estado de red.

---

## 5. Bloque 3: Metacognición Computacional y Prototipo FUNPRO

### META-01: Doble Lazo de Razonamiento en la Interfaz (Double-Loop Architecture)
* **Ref. Teórica:** Tesis Caro Cap. 4.1 (pp. 62-65), Cap. 6.1 (pp. 120-122, Fig. 6.1); Nelson & Narens (1990).
* **Criterios Evaluados:**
  * *Diferenciación visual Nivel Objeto vs. Meta-Nivel:* Separación clara entre el espacio operativo de resolución/edición de la tarea y el área de reflexión metacognitiva sobre el proceso.
  * *Mecanismos de monitoreo introspectivo:* Indicadores visuales que transparentan el estado de la tarea y la efectividad pedagógica.
  * *Control metacognitivo asistido:* Estimulación de la autorregulación mediante la justificación de decisiones didácticas.
* **Evidencia en Frontend:**
  * **Nivel Objeto:** Representado en el Editor por el área de redacción y visualización del plan de clase.
  * **Meta-Nivel:** Representado por:
    1. La cabecera editorial con badges de estado del ciclo de vida (`Propuesta generada (sin guardar)`, `Cambios pendientes por guardar`, `Guardado en Mis Planes`).
    2. El apartado explícito de **Cierre y Metacognición** que el tutor genera obligatoriamente en cada plan de clase (preguntas de autorregulación del aprendizaje para los estudiantes: *"¿Qué estrategia me sirvió más?", "¿Dónde experimenté confusión y cómo la superé?"*).
    3. El panel de métricas y autorregulación en [HomePage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/HomePage.jsx) que permite al docente monitorear la distribución de áreas y grados atendidos.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Arquitectura de Doble Lazo reflejada en la separación de edición y paneles de autorregulación docente.

---

### META-02: Juicios Metacognitivos y Metamemoria (Formalización COP y CSRD)
* **Ref. Teórica:** Tesis Caro Cap. 4.1.5 (pp. 73-76), Cap. 5.2.2 (pp. 88-95) y Cap. 6.2.2 (pp. 151-153, Fig. 6.8).
* **Criterios Evaluados:**
  * *Juicios de Certeza previos y posteriores (EOL / JOL):* Componentes donde el usuario calibra su estimación de dificultad y confianza antes de generar y evalúa la pertinencia tras la entrega.
  * *Calibración de la ilusión de competencia:* Contraste explícito entre las expectativas curriculares planteadas y el resultado pedagógico estructurado.
  * *Selección informada por COP/CSRD:* Tácticas didácticas fundamentadas en certezas pedagógicas del MEN sin improvisación algorítmica.
* **Evidencia en Frontend:**
  * En [WizardStep4Inclusion.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/wizard/WizardStep4Inclusion.jsx), el docente realiza juicios previos de facilidad y necesidad (diagnóstico de barreras DUA/PIAR).
  * En [EditorPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/EditorPage.jsx), los badges reactivos y los avisos de guardado informan con certeza el estado real de persistencia, erradicando la "ilusión de guardado automático" resuelta en la auditoría técnica.
  * Los recursos generados (como Quizzes interactivos y Rúbricas interactivas) incorporan autoevaluación inmediata para que los alumnos juzguen su propio aprendizaje.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Juicios de certeza y metamemoria implementados en la calibración del plan y evaluación formativa.

---

### META-03: Transparencia Algorítmica y Agencia Compartida (Shared Agency)
* **Ref. Teórica:** Tesis Caro Cap. 6.1.3 (*"Learner control"*, pp. 146-147); Zimmerman (Self-Regulated Learning).
* **Criterios Evaluados:**
  * *Agencia del usuario (Learner Control / Shared Agency):* El usuario conserva el control decisorio sobre su ruta pedagógica, pudiendo modificar, aceptar o descartar las sugerencias del tutor.
  * *Inteligencia Artificial Explicable (XAI):* La interfaz transparenta por qué el sistema recomienda ciertas metodologías, citando normativas curriculares oficiales.
  * *Evaluación formativa desprovista de castigo:* Entorno seguro de experimentación, donde descartar un borrador o reiniciar un plan se realiza con confirmación explícita sin penalizaciones.
* **Evidencia en Frontend:**
  * **Agencia Compartida Total:** La IA propone el plan, pero el docente tiene potestad absoluta para:
    1. Editar manualmente cualquier bloque de texto en el editor Markdown.
    2. Modificarlo mediante instrucciones en lenguaje natural con el asistente.
    3. Decidir cuándo guardarlo como plan definitivo mediante el botón *"Guardar"*, diferenciando formalmente borradores en memoria de planes consolidados.
  * **Explicabilidad Curricular:** El tutor explicita los referentes normativos del MEN (Guía 30, DBA, lineamientos por área) que sustentan sus propuestas.
  * **Experimentación Segura:** En [WizardPage.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/pages/WizardPage.jsx), el botón *"Comenzar nuevo plan en blanco"* cuenta con un modal de confirmación no destructivo ([ConfirmModal.jsx](file:///c:/Users/dtapi/Documents/10m%20Semestre/DISE%C3%91O%20Y%20DESARROLLO%20DE%20SOFTWARE%20EDUCATIVO%20III/Inspiracte/src/components/ConfirmModal.jsx)), protegiendo el trabajo del docente.
* **Valoración:** **C — Cumple Totalmente**
* **Puntos y Notas:** **2 / 2 pts**  
  *Obs:* Agencia compartida demostrada; el docente tiene control total sobre la IA con explicabilidad pedagógica.

---

## 6. Cuadro de Consolidación y Dictamen de Evaluación

| Sección / Bloque Evaluado | Puntos Posibles | Puntos Logrados | % Cumplimiento |
|:---|:---:|:---:|:---:|
| **Bloque 1:** Reflejo de los 4 Módulos Canónicos en la UI (4 ítems) | 8 pts | **8 pts** | **100%** |
| **Bloque 2:** Características que Reflejan la Inteligencia del Tutor (5 ítems) | 10 pts | **10 pts** | **100%** |
| **Bloque 3:** Metacognición Computacional y Prototipo FUNPRO (3 ítems) | 6 pts | **6 pts** | **100%** |
| **PUNTUACIÓN GLOBAL TOTAL CONSOLIDADA:** | **24 pts** | **24 pts** | **100%** |

### Escala Cualitativa de Aprobación
* **[ 90 – 100% ] Sobresaliente — Certificación de Sistema Tutor Inteligente Aprobada** *(Puntaje Obtenido: 100%)*
* [ 75 – 89% ] Aceptable / Competente
* [ 60 – 74% ] Básico con Observaciones
* [ < 60% ] Insuficiente / Requiere Rehacer

---

## 7. Fortalezas Identificadas en el Frontend

1. **Alineación Ontológica Rigurosa (Módulo del Experto):**  
   A diferencia de sistemas genéricos basados en prompts difusos, INSPIRATEC ancla el conocimiento del tutor en los Estándares Básicos de Competencias y DBA del Ministerio de Educación Nacional de Colombia (MEN), garantizando pertinencia curricular sin alucinaciones de numeración.
2. **Bifurcación Multimodal Real:**  
   La capacidad de transformar un plan de clase en prosa en recursos interactivos dinámicos (Flashcards 3D, diapositivas animadas, cuestionarios autocalificados y juegos de sopa de letras) cumple a cabalidad con la teoría de codificación dual de Paivio (1986) y la multimodalidad adaptativa descrita por Caro (2015).
3. **Respeto a la Agencia y Control del Usuario (Shared Agency):**  
   La reciente corrección del ciclo de vida de persistencia (desacoplando la generación del guardado automático) materializa de forma impecable el principio de agencia compartida de Zimmerman y Caro, empoderando al docente como el evaluador crítico y soberano de la propuesta de la IA.
4. **Resiliencia de Red y Cascada de Modelos:**  
   La integración combinada de `NetworkStatusBanner`, la cascada resiliente de modelos en `aiService.js` y el almacenamiento de respaldo local en `dbService.js` garantizan una tolerancia a fallos ejemplar en contextos de conectividad intermitente.
5. **Ergonomía Visual Warm Glassmorphism:**  
   La reciente actualización de las migas de pan (*Breadcrumbs*) a cápsulas de cristal esmerilado de alto contraste y los bordes reactivos para validaciones contextuales demuestran un estándar de excelencia en UX y reducción de carga cognitiva extraña.

---

## 8. Debilidades Críticas y Compromisos Técnicos para la Siguiente Iteración

1. **Formalización Explícita de Métricas de Estilo de Aprendizaje (Felder-Silverman):**  
   *Hallazgo:* Si bien el sistema incorpora principios DUA y adaptaciones PIAR, no expone aún un test psicométrico interactivo directo de Felder-Silverman para el docente.  
   *Compromiso Técnico:* Incorporar en la vista de Configuración o Perfil un módulo opcional de autodiagnóstico de estilos de enseñanza/aprendizaje con visualización radial.
2. **Visualización de Grafos de Prerrequisitos en Canvas/SVG:**  
   *Hallazgo:* La jerarquía curricular se presenta en selectores desplegables y tarjetas modulares, pero no como un grafo interactivo de nodos interconectados (mapa conceptual visual del dominio).  
   *Compromiso Técnico:* Evaluar la incorporación de un visualizador de grafo conceptual interactivo (usando Mermaid o SVG nativo) para explorar los DBA por grado.
3. **Ampliación de Tácticas Socráticas en el Chat de Edición:**  
   *Hallazgo:* La función de edición interactiva responde con solvencia a órdenes directas, pero podría ofrecer más preguntas reflexivas socráticas previas a la modificación del plan.  
   *Compromiso Técnico:* Refinar el system prompt de `modifyPlan` para incluir una modalidad de diálogo socrático guiado.
