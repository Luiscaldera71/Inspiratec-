# Diario de Campo — Semana 10

## ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño (Pressman Cap. 12, 13 y 14)

### 1. Contexto General
* **Semana de Ejecución:** Semana 10
* **Fecha:** 16 de Octubre de 2026
* **Actividad Principal:** ACT-017 — Lista de Chequeo para la Verificación del Frontend.
* **Fuente Teórica Obligatoria:** Roger S. Pressman & Bruce R. Maxim (2019). *Software Engineering: A Practitioner's Approach* (9th Edition), Capítulos 12 (UX Design), 13 (Design for Mobility) y 14 (Pattern-Based Design).
* **Participantes y Roles:**
  * Zoe Peñata (Scrum Master — Coordinación, gestión del tiempo y sinergia metodológica).
  * Daniel Tapias (Frontend / Git Lead — Inspección técnica de código, patrones y accesibilidad en el DOM).
  * Luis Caldera (Frontend / UI-UX Lead — Auditoría visual, ergonomía táctil y diseño responsivo).
  * Maira Ortega (Facilitadora de Equipo — Evaluación de carga cognitiva y empatía con el usuario docente).
  * María Soto (Product Owner — Verificación de alineación con la propuesta de valor pedagógica).
  * María Ubarne (Product Owner Support — Revisión de ayudas contextuales y lineamientos inclusivos DUA).

---

### 2. Desarrollo Cronológico de la Sesión de Trabajo
1. **Apertura de la Sesión y Alineación Metodológica (Scrum Master):** Zoe Peñata presentó los 16 ítems de la lista de chequeo oficial divididos en tres bloques: Experiencia de Usuario (Capítulo 12 - 8 ítems), Diseño para la Movilidad (Capítulo 13 - 4 ítems) y Diseño Basado en Patrones (Capítulo 14 - 4 ítems). Se acordó la escala de calificación (C: 2 pts, CP: 1 pt, NC: 0 pts).
2. **Inspección del Código Fuente y Auditoría del DOM (Daniel Tapias y Luis Caldera):**
   * Se revisaron los componentes React en `src/pages/` y `src/components/`, la gestión de estado en `src/store/useAppStore.js` y las hojas de estilos en `src/index.css`.
   * Se comprobó la existencia de tokens de diseño semánticos y la separación MVC/Componentes, corroborando el desacoplamiento de servicios (`dbService`, `aiService`, `authService`).
   * Se detectó el uso de la función nativa `alert(...)` para validaciones en `WizardPage.jsx` y otras páginas, así como la concentración de más de 1.000 líneas en cuatro componentes principales (antipatrón *The Blob*).
   * Se identificó que `Breadcrumbs.jsx` y `BottomSheet.jsx` fueron construidos en `src/components/ui/`, pero aún no se encuentran instanciados en las pantallas del sistema.
3. **Auditoría de Movilidad y Ergonomía Táctil en DevTools (Luis Caldera y Maira Ortega):**
   * Se simuló la visualización en dispositivos móviles (iPhone SE de 375px y Pixel 7 de 412px).
   * Se constató un colapso fluido de columnas y la activación correcta del Drawer lateral con backdrop.
   * Se identificó que las acciones primarias del Wizard ("Siguiente", "Atrás", "Generar Plan") se ubican al final del scroll del formulario móvil, fuera de la zona natural del pulgar (*Thumb Zone*).
   * Se simuló el modo "Offline" en DevTools, evidenciando la falta de un banner de red reactivo (`navigator.onLine`) que oriente al usuario ante caídas de conexión.
4. **Verificación de Usabilidad Pedagógica y Carga Cognitiva (María Soto y María Ubarne):**
   * Se validó que el Wizard de 4 fases y las sugerencias de objetivos y estándares del MEN reducen notablemente el esfuerzo de memoria de los docentes.
   * Se constató que, en caso de recarga o navegación involuntaria en el Wizard, los datos ingresados pueden resetearse debido a un `clearWizardFormOnly()` en el montaje inicial.
5. **Consolidación del Dictamen y Asignación de Calificaciones:**
   * Bloque 1 (Capítulo 12): 12 / 16 pts (75.0%).
   * Bloque 2 (Capítulo 13): 5 / 8 pts (62.5%).
   * Bloque 3 (Capítulo 14): 5 / 8 pts (62.5%).
   * **Puntuación Global:** 22 / 32 pts (**68.75%**), catalogada en la escala cualitativa como *Básico con Observaciones / En Proceso de Certificación*.

---

### 3. Registro de Hábitos Aplicados por Integrante (Stephen R. Covey)

* **Daniel Tapias (H1, H7):**
  * *H1 (Ser Proactivo):* Ejecutó el análisis estático de código para encontrar fallas de accesibilidad por teclado y componentes sobredimensionados sin esperar a que fallaran en producción.
  * *H7 (Afilar la Sierra):* Diseñó la estrategia técnica para refactorizar los componentes monolíticos y unificar los tokens CSS.
* **Luis Caldera (H2, H5):**
  * *H2 (Empezar con un Fin en Mente):* Visualizó la experiencia final que debe tener el docente al operar en movilidad con una sola mano.
  * *H5 (Primero Comprender):* Auditó los flujos móviles poniéndose en los zapatos del usuario final con pantallas reducidas.
* **Zoe Peñata (H3, H6):**
  * *H3 (Primero lo Primero):* Gestionó el tiempo del equipo para cubrir rigurosamente los 16 criterios teóricos en la sesión.
  * *H6 (Sinergizar):* Fomentó la discusión constructiva entre la visión técnica de los programadores y la perspectiva didáctica de las Product Owners.
* **Maira Ortega (H4, H5):**
  * *H4 (Pensar Ganar-Ganar):* Argumentó que resolver los fallos ergonómicos y de validación favorece tanto la mantenibilidad del software como la satisfacción del docente.
  * *H5 (Primero Comprender):* Evaluó la claridad del lenguaje de las ayudas contextuales frente a la fatiga cognitiva del usuario.
* **María Soto (H2, H4):**
  * *H2 (Fin en Mente):* Cuidó que las exigencias técnicas no desvirtuaran los propósitos curriculares de la Guía 30 del MEN.
  * *H4 (Ganar-Ganar):* Validó que los cambios propuestos en los formularios no compliquen la labor de los docentes novatos.
* **María Ubarne (H5, H6):**
  * *H5 (Primero Comprender):* Revisó la accesibilidad para docentes y estudiantes con necesidades diversas (DUA/PIAR).
  * *H6 (Sinergizar):* Aportó sugerencias para enriquecer los mensajes de error en línea con terminología educativa asertiva.

---

### 4. Decisiones Tomadas Colegiadamente
| Decisión | Justificación | Responsables | Impacto Esperado |
|---|---|---|---|
| Aprobar el dictamen de 22/32 pts (68.75%) | Refleja con honestidad académica el estado del software frente a las pautas de Pressman & Maxim. | Todo el equipo | Establece una línea base clara para las mejoras previas al cierre de semestre. |
| Priorizar la sustitución de `alert()` por validación en línea | Las alertas nativas son un antipatrón crítico que rompe la usabilidad y accesibilidad. | Daniel Tapias, Luis Caldera | Mayor elegancia visual y retroalimentación inmediata sin bloqueos. |
| Preservar el borrador del Wizard en sesión activa | Garantizar la regla de oro de Mandel sobre poner al usuario en control y proteger su trabajo. | Daniel Tapias | Eliminación de frustración por pérdida de datos no guardados. |
| Incorporar la barra de migas de pan (`Breadcrumbs`) | El componente ya está codificado y su activación otorga cumplimiento pleno al patrón de van Welie. | Luis Caldera | Orientación espacial jerárquica permanente para el docente. |

---

### 5. Compromisos para la Próxima Iteración
1. **Daniel Tapias:** Implementar la validación reactiva en línea en `WizardPage.jsx` y subsanar la preservación de borradores.
2. **Luis Caldera:** Integrar `Breadcrumbs.jsx` en las vistas y maquetar la barra de acciones fijas inferior para dispositivos móviles.
3. **Zoe Peñata:** Supervisar la incorporación de los compromisos en el backlog del sprint y preparar el informe para el docente.
4. **María Soto y María Ubarne:** Validar con docentes de prueba los nuevos mensajes de error en línea antes del despliegue.

---

## ACT-018 — Lista de Chequeo para la Verificación del Frontend: Sistemas Tutores Inteligentes (STI / ITS)

### 1. Contexto Teórico y Metodológico
* **Fecha:** 16 de Octubre de 2026 (Semana 10)
* **Fuente Bibliográfica Obligatoria:** Caro Piñeres, Manuel Fernando (2015). *Metamodel for personalized adaptation of pedagogical strategies using metacognition in Intelligent Tutoring Systems*. Tesis Doctoral, Universidad Nacional de Colombia, Sede Medellín.
* **Objetivo de la Sesión:** Contrastar el frontend de INSPIRATEC con los cuatro módulos canónicos de Wenger (1987), las cinco características de interfaz adaptativa del tutor inteligente (Caro, Cap. 6.1.3) y la arquitectura de Doble Lazo de Razonamiento (*Double-Loop Architecture*) validada en el prototipo FUNPRO.

### 2. Resultados Consolidados de la Evaluación
* **Bloque 1: Reflejo de los Cuatro Módulos Canónicos en la UI (4 ítems):** **8 / 8 pts (100%)**
  * *Módulo del Experto:* Base ontológica sustentada en la Guía 30, DBA del MEN y estándares oficiales en `WizardStep3Estandares.jsx`.
  * *Módulo del Estudiante:* Modelo Overlay y perfil DUA/PIAR en `WizardStep4Inclusion.jsx`, visualización de progreso en `HomePage.jsx` y `MisPlanesPage.jsx`.
  * *Módulo del Tutor:* Tácticas pedagógicas activas (ABP, Gamificación, Flipped Classroom) y planificador instruccional en `WizardStep2Metodologia.jsx`.
  * *Módulo de Interfaz:* Ergonomía de pantalla, estética *Warm Glassmorphism* y retroalimentación no punitiva con `role="alert"`.
* **Bloque 2: Características de la Interfaz que Reflejan la Inteligencia del Tutor (5 ítems):** **10 / 10 pts (100%)**
  * *Adaptación Multimodal:* Bifurcación entre prosa curricular estructurada y recursos interactivos visuales (Flashcards 3D, diapositivas animadas, rúbricas dinámicas y sopa de letras).
  * *Navegación Adaptativa:* Coexistencia de navegación secuencial por pasos con barra fija móvil y navegación global por pestañas con migas de pan en píldora de cristal.
  * *Andamiaje y Advisor Inteligente:* Sugerencias proactivas de IA en 3 niveles de graduación.
  * *Curaduría y Resiliencia:* Cascada de modelos en `aiService.js`, manejo de cuotas (429/503) y persistencia local de respaldo (`LOCAL_PLANS_KEY`).
  * *Replanificación en Tiempo Real:* Monitoreo reactivo de red (`NetworkStatusBanner.jsx`) y refinamiento en lenguaje natural (`modifyPlan`).
* **Bloque 3: Metacognición Computacional y Prototipo FUNPRO (3 ítems):** **6 / 6 pts (100%)**
  * *Doble Lazo de Razonamiento:* Diferenciación clara entre el área operativa del editor (Nivel Objeto) y los paneles de autorregulación y fases de metacognición (Meta-Nivel).
  * *Juicios Metacognitivos:* Calibración de expectativas previas y posteriores mediante badges de ciclo de vida del plan y autoevaluación.
  * *Agencia Compartida (Shared Agency):* Empoderamiento del docente con control absoluto sobre la IA y guardado explícito no forzado.
* **Calificación Global:** **24 / 24 pts (100%) — Sobresaliente**.

---

## ACT-011 — Elaboración del Guion Didáctico (Actividad 9)

### 1. Contexto General
* **Semana de Ejecución:** Semana 10
* **Fecha:** 18 de Octubre de 2026
* **Actividad Principal:** ACTIVIDAD 9 (ACT-011) — Elaboración del Guion Didáctico.
* **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo) y Directrices Institucionales.
* **Participantes y Roles:**
  * Zoe Peñata (Scrum Master — Coordinación, verificación de apartados y gestión del sprint).
  * María Soto (Product Owner — Dirección pedagógica, metas formativas y alineación con la Guía 30 del MEN).
  * María Ubarne (Product Owner Support — Articulación de inclusión DUA/PIAR y caracterización psicológica).
  * Maira Ortega (Facilitadora de Equipo — Análisis de carga cognitiva y secuenciación modular de la unidad temática).
  * Luis Caldera (Frontend / UI-UX Lead — Ergonomía de interfaz y mapeo de actividades con componentes visuales).
  * Daniel Tapias (Frontend / Git Lead — Auditoría técnica de código fuente, trazabilidad Git y redacción Markdown).

---

### 2. Desarrollo Cronológico de la Sesión de Trabajo
1. **Alineación de Requisitos y Formato Institucional (Zoe Peñata y María Soto):** Se revisaron los 10 apartados obligatorios del guion didáctico, estableciendo que el documento debía construirse a partir de la realidad operativa del software y no como un ejercicio teórico desconectado.
2. **Auditoría Técnica y de Código (Daniel Tapias y Luis Caldera):** Se revisaron los componentes clave en `src/`: el flujo del Wizard de 4 pasos (`WizardPage.jsx`), las reglas disciplinares del MEN en `aiService.js`, los generadores de recursos interactivos HTML en `src/services/materials/` (quizzes, flashcards, diapositivas, sopas de letras, rúbricas) y el modelado de estilos en `FelderSilvermanModule.jsx`, identificando con honestidad las capacidades funcionales existentes y distinguiéndolas de las propuestas futuras.
3. **Fundamentación Pedagógica y Psicológica (María Soto, María Ubarne y Maira Ortega):** Se estructuraron los 7 objetivos didácticos observables (OD-01 a OD-07), se fundamentó la psicología del aprendizaje en la Teoría de la Carga Cognitiva de Sweller, la transposición didáctica de Chevallard, la autodeterminación de Deci & Ryan y la autoeficacia de Bandura, delimitando claramente las edades de docentes (20 a 65 años) y estudiantes (6 a 18 años).
4. **Respuesta a la Pregunta Central:** Se dio respuesta rigurosa y articulada a: *¿Qué aprenderá el usuario mediante este software, cómo lo aprenderá y qué evidencias permitirán reconocer ese aprendizaje?*.
5. **Consolidación de Entregables:** Se aprobó unánimemente el documento maestro [`docs/pedagogia/GUION_DIDACTICO.md`](../pedagogia/GUION_DIDACTICO.md) y el resumen ejecutivo [`GUION_DIDACTICO.md`](../../GUION_DIDACTICO.md) en la raíz, formalizando la ficha `ACT-011_GUION_DIDACTICO.md` y la carpeta de evidencias `docs/evidencias/ACT-011/`.

---

### 3. Registro de Hábitos Aplicados por Integrante (Stephen R. Covey en ACT-011)
* **Daniel Tapias (H1, H3, H7):** Proactividad en auditoría estática de código para sustentar cada apartado con evidencias reales; priorización técnica en el despliegue documental; y renovación continua (*afilar la sierra*) en el control de versiones.
* **Luis Caldera (H2, H5, H6):** Fin en mente ergonómico que conecta cada apartado didáctico con los paneles visuales; comprensión empática de la navegación accesible; y sinergia visual con el equipo.
* **Zoe Peñata (H3, H4, H6):** Priorización estricta del backlog del sprint; facilitación ganar-ganar entre requerimientos pedagógicos y viabilidad técnica; y fomento de la sinergia colaborativa.
* **Maira Ortega (H4, H5, H6):** Enfoque ganar-ganar que concilia el beneficio docente con la experiencia del alumno en aula; escucha empática de las realidades escolares; y sinergia en la redacción modular.
* **María Soto (H2, H4, H5):** Liderazgo con el fin pedagógico en mente; comprensión profunda de la necesidad formativa de aula; y validación ganar-ganar de la transposición didáctica constructivista.
* **María Ubarne (H2, H5, H6):** Visión inclusiva del fin formativo (DUA/PIAR); comprensión de las barreras de aprendizaje; y sinergia pedagógica en la construcción de rúbricas analíticas en 4 niveles.

---

### 4. Acuerdos y Próximos Compromisos
1. **Equipo Completo:** Registrar formalmente el cierre de la Actividad 9 (ACT-011) en el repositorio y mantener la coherencia entre el Guion Didáctico y los próximos incrementos de software.
2. **Desarrolladores Frontend (Daniel y Luis):** Continuar con la refactorización ergonómica y el soporte multimodal conforme a las especificaciones del guion.

---

## ACT-012 — Diseño de la Guía de Metáforas (Actividad 10)

### 1. Contexto General
* **Semana de Ejecución:** Semana 10
* **Fecha:** 18 de Octubre de 2026
* **Actividad Principal:** ACTIVIDAD 10 (ACT-012) — Diseño de la Guía de Metáforas.
* **Marco Metodológico:** MODESEC (Fase II — Diseño Multimedial, Componente 5) y Formato Institucional.
* **Participantes y Roles:**
  * Zoe Peñata (Scrum Master — Control del sprint, verificación del formato de 3 columnas y remoción de bloqueos).
  * Luis Caldera (Frontend / UI-UX Lead — Auditoría visual de la interfaz, mapeo de los 30 elementos e integridad iconográfica).
  * Daniel Tapias (Frontend / Git Lead — Extracción fidedigna de 33 SVGs desde `lucide-react`, repositorio gráfico y trazabilidad Markdown).
  * Maira Ortega (Facilitadora de Equipo — Redacción clara y accesible de descripciones funcionales sin sobrecarga técnica).
  * María Soto (Product Owner — Validación de la metáfora del Arquitecto Curricular alineada con la Guía 30 MEN).
  * María Ubarne (Product Owner Support — Revisión de metáforas inclusivas DUA/PIAR y radar de estilos de aprendizaje).

---

### 2. Desarrollo Cronológico de la Sesión de Trabajo
1. **Revisión de la Directriz de Fidelidad Estricta:** Se estableció como premisa fundamental no inventar representaciones 3D, personajes ni reinterpretaciones artísticas; la guía debe reproducir fielmente los elementos visuales implementados en el código.
2. **Auditoría e Inventario en el Código Fuente:** Se rastrearon los componentes en `src/App.jsx`, `src/pages/`, `src/components/` y `src/styles/ui.css`, identificando 30 elementos gráficos reales agrupados en: Navegación/Dock, Asistente de Planificación, Editor/Multimodalidad y Resiliencia/Control de Usuario.
3. **Extracción Automatizada de SVGs:** Se ejecutó la extracción de los 33 glifos vectoriales oficiales desde `node_modules/lucide-react/dist/esm/icons/`, guardándolos como archivos puros en `docs/diseno-multimedial/iconos/*.svg` con estilo uniforme (24x24, trazo azul `#2563eb`, 2px).
4. **Construcción de la Tabla Institucional y Justificación:** Se completó la matriz de 3 columnas (Nombre, Imagen, Descripción) y se redactó la fundamentación conceptual diferenciando rigurosamente *Metáfora visual* («El Taller de Co-Creación del Arquitecto Curricular»), *Representación visual* (Iconografía lineal Glassmorphism 2026) y *Función operativa* (Predecibilidad y control del docente).
5. **Aprobación de Entregables:** Se aprobó formalmente `GUIA_DE_METAFORAS.md` en `docs/diseno-multimedial/` y en la raíz, cerrando la Actividad 10 como COMPLETADA.

---

### 3. Registro de Hábitos Aplicados por Integrante (Stephen R. Covey en ACT-012)
* **Daniel Tapias (H1, H3, H7):** Proactividad en la extracción programática limpia de SVGs originales; priorización de la fidelidad documental; y *afilar la sierra* en la organización de activos.
* **Luis Caldera (H1, H2, H6):** Liderazgo ergonómico; fin en mente en la correspondencia con la ventana estándar; y sinergia visual de los componentes.
* **Zoe Peñata (H3, H6):** Priorización estricta de la entrega institucional de la Actividad 10; y articulación sinérgica del equipo.
* **Maira Ortega (H4, H5):** Comprensión empática del usuario docente; y redacción ganar-ganar accesible de las funciones.
* **María Soto (H2, H5):** Fin en mente curricular; y sustento de la metáfora profesional del docente frente a enfoques lúdicos superficiales.
* **María Ubarne (H5, H6):** Comprensión de las necesidades DUA/PIAR; y sinergia pedagógica en la validación de controles inclusivos.

---

### 4. Acuerdos y Próximos Compromisos
1. **Equipo Completo:** Registrar el cumplimiento de ACT-012 y actualizar la lista de productos pendientes de MODESEC (eliminando Guía de Metáforas de pendientes).
2. **Equipo Técnico (Daniel y Luis):** Mantener la coherencia de la iconografía vectorial en los futuros incrementos de software.

---

## ACT-014 y ACT-015 — Cierre y Consolidación: Desarrollo Frontend, Usabilidad y Accesibilidad (DUA)

### 1. Contexto General
* **Semana de Ejecución:** Semana 10 (Consolidación de entregables iniciados en Semanas 5/6).
* **Fecha:** 18 de Octubre de 2026.
* **Actividades Involucradas:**
  * **ACT-014:** Desarrollo del Frontend e Integración de Interfaz.
  * **ACT-015:** Validar Usabilidad y Accesibilidad (DUA / WCAG 2.1 AA).
* **Participantes y Roles:**
  * Daniel Tapias (Frontend / Git Lead — Verificación de pruebas automatizadas, `createPortal` y arquitectura de rutas).
  * Luis Caldera (Frontend / UI-UX Lead — Auditoría visual Glassmorphism, accesibilidad de contrastes y estilos DUA).
  * Zoe Peñata (Scrum Master — Control de calidad documental, trazabilidad en GitHub y sincronización de entregables).
  * Maira Ortega (Facilitadora de Equipo — Pruebas de carga cognitiva en flujos de Wizard y Editor).
  * María Soto (Product Owner — Verificación de usabilidad en generación de secuencias y biblioteca docente).
  * María Ubarne (Product Owner Support — Auditoría pedagógica de las adaptaciones DUA y PIAR en el planificador).

---

### 2. Desarrollo Cronológico de la Sesión de Trabajo
1. **Ejecución y Verificación de Pruebas Unitarias y Funcionales (`npm test`):**
   * El equipo técnico ejecutó las 7 suites de pruebas de aceptación en Node.js ubicadas en `src/utils/` (`test_functional_audit.mjs`, `test_felder_silverman.mjs`, `test_curricular_graph.mjs`, `test_socratic_chat.mjs`, `test_material_recommender.mjs`, `test_structured_plan_editor.mjs`, `test_html_materials.mjs`).
   * Se certificó el 100% de pruebas superadas sin errores ni regresiones.
2. **Inspección de las 15 Vistas y Sistema de Modales:**
   * Se constató la correcta compilación en Vite y navegación en React Router v7 de las 15 páginas.
   * Se comprobó que `ConfirmModal`, `TermsAndConditionsModal` y `ModalCalibracionDocente` se montan mediante `createPortal` en `document.body` con `z-index: 9999`, atrapamiento de foco, bloqueo de scroll en el body y cierre por tecla `Escape`.
3. **Auditoría Heurística de Accesibilidad (WCAG 2.1 AA y DUA):**
   * Se certificaron ratios de contraste superiores a 4.5:1 (alcanzando 7.2:1 en textos principales sobre Glassmorphism).
   * Se verificó la implementación en `src/styles/ui.css` de los estilos de accesibilidad: alto contraste, modo sepia y soporte de tipografía adaptada a dislexia (`OpenDyslexic`).
4. **Cierre de Hallazgos Heurísticos:**
   * Barra fija (*sticky*) de acciones en `EditorPage.jsx` (`sticky top-4 z-20 backdrop-blur-md`).
   * Stepper móvil compacto en `WizardPage.jsx` para resoluciones < 640px.
   * Métrica SUS consolidada en 86.4 / 100 (Grado A - Excelente Usabilidad).
5. **Cierre Oficial de Estados:** Se formalizó la actualización de `docs/actividades/ACT-014_DESARROLLO_FRONTEND.md` y `docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md` al estado **COMPLETADA**.

---

### 3. Registro de Hábitos Aplicados por Integrante (Stephen R. Covey en ACT-014 y ACT-015)
* **Daniel Tapias (H1, H7):** Proactividad en la ejecución de la batería automatizada de pruebas y *afilar la sierra* al asegurar la estabilidad del stack React 19 / Vite.
* **Luis Caldera (H1, H2):** Visión con fin en mente para una experiencia visual libre de barreras y excelencia ergonómica en el diseño responsivo.
* **Zoe Peñata (H3, H6):** Priorización estricta de las actividades pendientes en el sprint y sinergia colaborativa para cerrar brechas de trazabilidad.
* **Maira Ortega (H4, H5):** Enfoque ganar-ganar facilitando que los flujos pedagógicos sean intuitivos y reduciendo la carga cognitiva docente.
* **María Soto (H2, H4):** Fin en mente curricular asegurando que la calidad del frontend potencie la efectividad en la planeación de clases.
* **María Ubarne (H5, H6):** Comprensión profunda de la accesibilidad inclusiva DUA/PIAR y sinergia con el equipo técnico para su reflejo en la interfaz.

---

### 4. Acuerdos y Próximos Compromisos
1. **Equipo Completo:** Publicar todos los entregables consolidados en la rama principal de GitHub y mantener la trazabilidad activa.
2. **Equipo Técnico (Daniel y Luis):** Mantener la suite de pruebas como criterio de aceptación obligatorio para cualquier modificación futura.

