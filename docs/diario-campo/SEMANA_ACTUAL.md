# Diario de Campo — Semana Actual (Semana 10)

## Información General
- **Participantes:** Zoe Peñata (Scrum Master), María Soto (PO), María Ubarne (PO Support), Maira Ortega (Facilitadora), Luis Caldera (Frontend / UI-UX Lead), Daniel Tapias (Frontend / Git Lead).
- **Fecha:** 16 de Octubre de 2026.
- **Ciclo:** Semana 10 — Verificación Heurística, Ergonómica y de Patrones del Frontend (Fase III MODESEC / Pressman & Maxim).
- **Actividad Central:** ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño.

---

## Registro del Trabajo Colaborativo Realizado

### 1. Ejecución de la Lista de Chequeo Oficial (ACT-017)
- Se aplicó rigurosamente la lista de chequeo basada en los Capítulos 12, 13 y 14 de Pressman & Maxim (9na Edición).
- Se auditaron 16 criterios formales en código y ejecución:
  - **Capítulo 12 (UX Design):** Planos de Garrett, Reglas de Mandel, Modelado de Personas, Tognazzini, Accesibilidad WCAG (POUR) y Métricas SUS.
  - **Capítulo 13 (Design for Mobility):** Pirámide Móvil/Web, Ergonomía de la Thumb Zone, Sensibilidad al Contexto y Resiliencia de Red.
  - **Capítulo 14 (Pattern-Based UI):** Desacoplamiento MVC/Componentes, Patrones de Navegación de van Welie/Tidwell, Patrones de Entrada y Prevención de Antipatrones (The Blob, Mystery Meat, Modal Hell).
- **Resultado Consolidado:** **22 / 32 puntos (68.75%)**, clasificado como *Básico con Observaciones*.
- Se documentó el informe completo en `docs/actividades/ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md`.

### 2. Hallazgos Críticos y Backlog de Remediación
- **Sustitución de Alertas Nativas:** Se identificó el uso de `alert()` en `WizardPage.jsx` y otras vistas; se priorizó su reemplazo por *Inline Validation* reactiva.
- **Persistencia del Borrador del Wizard:** Se acordó corregir el hook de montaje en `WizardPage.jsx` para evitar el reseteo involuntario de formularios.
- **Antipatrón The Blob:** Se programó la modularización de componentes extensos (> 1.000 líneas) en subcomponentes atómicos.
- **Navegación por Teclado y Foco:** Se detectó la falta de `:focus-visible` debido a reglas con `outline: none;`. Se definió una regla global accesible.
- **Integración de Breadcrumbs y Zona del Pulgar:** Se programó el montaje del componente `Breadcrumbs.jsx` y la creación de una barra fija inferior para móvil.

### 3. Matriz de los 7 Hábitos de Covey en ACT-017
- Se actualizó `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md` incorporando la sección 5.11 con el registro de aplicación de hábitos de los 6 participantes:
  - Daniel Tapias: H1 (Proactividad) y H7 (Afilar la Sierra).
  - Luis Caldera: H2 (Fin en Mente) y H5 (Primero Comprender).
  - Zoe Peñata: H3 (Primero lo Primero) y H6 (Sinergizar).
  - Maira Ortega: H4 (Ganar-Ganar) y H5 (Primero Comprender).
  - María Soto: H2 (Fin en Mente) y H4 (Ganar-Ganar).
  - María Ubarne: H5 (Primero Comprender) y H6 (Sinergizar).

---

## Registro de Uso de Inteligencia Artificial (ROCAS)
- Se formalizó la ficha técnica en `docs/ia/REGISTRO_IA_ACT-017.md` y `docs/ia/REGISTRO_IA_ACT-018.md`, actualizando `docs/ia/REGISTRO_USO_IA.md` bajo el marco ROCAS (Rol, Objetivo, Contexto, Acción, Salida y Validación Humana).

---

### 4. Ejecución de la Lista de Chequeo de Sistemas Tutores Inteligentes (ACT-018)
- Se contrastó el frontend de INSPIRATEC con la investigación doctoral del Dr. Manuel Fernando Caro Piñeres (Universidad Nacional de Colombia, 2015).
- Se auditaron 12 criterios organizados en:
  - **Bloque 1 (4 Módulos Canónicos de Wenger/Caro):** Dominio (MEN/DBA), Estudiante/Overlay (DUA/PIAR y estados de planes), Tutor (tácticas didácticas y temporalización) e Interfaz Ergonómica (*Warm Glassmorphism*).
  - **Bloque 2 (5 Características de Tutoría Inteligente):** Multimodalidad (prosa vs recursos interactivos 3D), Navegación adaptativa (secuencial vs global con breadcrumbs), Andamiaje graduado en 3 niveles, Curaduría resiliente de modelos IA y Replanificación en caliente.
  - **Bloque 3 (Metacognición y Prototipo FUNPRO):** Doble Lazo de Razonamiento (*Double-Loop Architecture*), Juicios Metacognitivos (certeza y metamemoria) y Agencia Compartida (*Shared Agency*).
- **Resultado Consolidado:** **24 / 24 puntos (100%)**, catalogado como *Sobresaliente / Certificación de Sistema Tutor Inteligente Aprobada*.
- Se documentó el informe completo en `docs/actividades/ACT-018_LISTA_CHEQUEO_STI_CARO.md`.

---

### 5. Elaboración del Guion Didáctico Integral (ACT-011)
- Se desarrolló formalmente el Guion Didáctico institucional de INSPIRATEC, estructurado en los 10 apartados obligatorios y respondiendo a la pregunta central formativa: *¿Qué aprenderá el usuario mediante este software, cómo lo aprenderá y qué evidencias permitirán reconocer ese aprendizaje?*.
- Se realizó una auditoría integral del código fuente (`src/`) para sustentar cada apartado con evidencias de funcionamiento real (Wizard de 4 pasos, editor interactivo, generador de quizzes, flashcards, diapositivas y soporte DUA/PIAR), diferenciando capacidades existentes de propuestas futuras.
- Se documentó el producto oficial en [`docs/pedagogia/GUION_DIDACTICO.md`](../pedagogia/GUION_DIDACTICO.md) y [`GUION_DIDACTICO.md`](../../GUION_DIDACTICO.md) en la raíz.
- Se registró el uso de IA bajo el marco ROCAS en `docs/ia/REGISTRO_IA_ACT-011.md` y se actualizó la matriz de hábitos en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md` (Sección 5.12).

---

### 6. Diseño de la Guía de Metáforas MODESEC (ACT-012)
- Se elaboró la Guía de Metáforas oficial de INSPIRATEC bajo la directriz de fidelidad estricta al software existente, sin inventar ni reinterpretar elementos visuales.
- Se auditaron e inventariaron 30 elementos gráficos reales en la tabla institucional de 3 columnas (Nombre, Imagen, Descripción).
- Se extrajeron 33 archivos vectoriales SVG originales de `node_modules/lucide-react/dist/esm/icons/` a `docs/diseno-multimedial/iconos/`, garantizando una representación gráfica 100% fidedigna.
- Se fundamentó la metáfora instrumental del «Taller de Co-Creación del Arquitecto Curricular» en sus tres dimensiones: metáfora visual, representación visual y función operativa.
- Se formalizó el entregable en [`docs/diseno-multimedial/GUIA_DE_METAFORAS.md`](../diseno-multimedial/GUIA_DE_METAFORAS.md) y [`GUIA_DE_METAFORAS.md`](../../GUIA_DE_METAFORAS.md), actualizando la ficha `ACT-012_GUIA_DE_METAFORAS.md`, evidencias y hábitos (Sección 5.13).

---

### 7. Consolidación y Cierre de ACT-014 (Desarrollo Frontend) y ACT-015 (Usabilidad y DUA)
- **ACT-014 (Desarrollo Frontend e Integración):**
  - Se completó la auditoría y verificación integral de las 15 páginas desarrolladas en React 19 y Vite (`src/pages/`).
  - Se verificó la arquitectura de modales con `createPortal` en `document.body` (`ConfirmModal`, `TermsAndConditionsModal`, `ModalCalibracionDocente`) asegurando ausencia de fugas de scroll y gestión de atajos de teclado (`Escape`).
  - Se ejecutó la batería completa de pruebas de aceptación en Node.js (`npm test`), confirmando el 100% de éxito en las 7 suites funcionales (KaTeX, grafo curricular, diálogo socrático, materiales HTML, persistencia Zustand).
  - Se documentaron las evidencias en `docs/evidencias/ACT-014/README.md` y se actualizó la ficha `docs/actividades/ACT-014_DESARROLLO_FRONTEND.md` al estado **COMPLETADA**.
- **ACT-015 (Validar Usabilidad y Accesibilidad - DUA):**
  - Se completó la auditoría heurística de las 15 pantallas bajo las 9 preguntas maestras de Nielsen y Shneiderman (Control del Usuario, Carga Cognitiva y Consistencia).
  - Se verificó la conformidad con WCAG 2.1 AA: ratios de contraste superiores a 4.5:1 (alcanzando 7.2:1 en textos principales), semántica HTML5, y atributos ARIA completos.
  - Se confirmó la implementación en `ui.css` de los modos de lectura accesible (alto contraste, modo sepia y compatibilidad con tipografía para dislexia).
  - Se cerraron los 3 hallazgos heurísticos pendientes: anclaje sticky de la barra de acciones en `EditorPage.jsx`, diseño circular compacto del stepper en pantallas móviles menores a 640px, y consolidación de la métrica SUS estandarizada en 86.4/100 (Grado A).
  - Se documentaron las evidencias en `docs/evidencias/ACT-015/README.md` y se actualizó la ficha `docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md` al estado **COMPLETADA**.

---

### 8. Diseño y Formalización de Mockups de Alta Fidelidad (ACT-007)
- Se consolidaron los 4 mockups de alta fidelidad exigidos por la Semana 03 en `docs/diseno-interface/mockups/`:
  - `mockup-inicio.png` (Ventana de Inicio)
  - `mockup-dashboard.png` (Repositorio de Planes de Clase)
  - `mockup-actividad.png` (Arquitectura Curricular y Plantillas)
  - `mockup-resultados.png` (Editor y Plan de Clase con Co-docente IA)
- Se evaluó rigurosamente el cumplimiento de las Tres Reglas de Oro de Theo Mandel: (1) Dar el control al usuario, (2) Reducir la carga de memoria y (3) Mantener consistencia visual.
- Se documentó la ficha técnica en `docs/actividades/ACT-007_DISENO_MOCKUPS.md`, el `README.md` descriptivo en `docs/diseno-interface/mockups/` y el registro ROCAS en `docs/ia/REGISTRO_IA_ACT-007.md`.

---

### 9. Descripción de Ventanas según Plantilla Institucional MODESEC (ACT-009)
- Se elaboró la descripción integral de las 15 ventanas y 5 modales emergentes de INSPIRATEC en `DESCRIPCION_VENTANAS.md` y `docs/diseno-multimedial/DESCRIPCION_VENTANAS.md`.
- Se aplicó estrictamente la plantilla institucional de 9 campos obligatorios: Nombre de la ventana, Imagen, Texto, Audio, Video, Animación, Acciones del usuario, Botones y Navegación.
- Se incorporaron las capturas fotográficas reales de alta fidelidad obtenidas del software en ejecución en `docs/evidencias/ACT-009/`, declarando la ausencia de audios o videos en pantallas estáticas para evitar invenciones.
- Se formalizó la ficha `docs/actividades/ACT-009_DESCRIPCION_VENTANAS.md` en estado **COMPLETADA** y el registro ROCAS en `docs/ia/REGISTRO_IA_ACT-009.md`.

---

### 10. Elaboración del Guion Técnico Multimedial (ACT-010)
- Se formuló la matriz técnica de 6 columnas (`Ventana`, `Elemento`, `Descripción`, `Formato / Fuente`, `Acción`, `Evento`) documentando 86 elementos reales en `GUION_TECNICO_MULTIMEDIAL.md` y `docs/diseno-multimedial/GUION_TECNICO_MULTIMEDIAL.md`.
- Se integraron las capturas reales en `docs/evidencias/ACT-010/` y se documentó la síntesis de voz en español mediante la Web Speech API para los materiales interactivos compilados desde la biblioteca.
- Se formalizó la ficha `docs/actividades/ACT-010_GUION_TECNICO_MULTIMEDIAL.md` en estado **COMPLETADA**, el registro ROCAS en `docs/ia/REGISTRO_IA_ACT-010.md` y la matriz de los 7 hábitos en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`.

---

### 11. Registro Fidedigno de Ventanas Críticas: Planear y Mi ADN Pedagógico (ACT-007, ACT-009, ACT-010)
- **Ventana Planear:** Se documentaron sus 4 fases de configuración curricular (1. Grado y Asignatura, 2. Estándares y DBA con Grafo MEN, 3. Metodología y DUA, 4. Generación y Resumen) en `DESCRIPCION_VENTANAS.md`, `GUION_TECNICO_MULTIMEDIAL.md` y `mockup-planificador.png`.
- **Ventana Mi ADN Pedagógico & Estudio Transversal:** Se documentaron exhaustivamente sus 4 pestañas interactivas:
  1. *Memoria de Éxito Automática:* Métricas en vivo (3 planes analizados, 44% innovación, metodología principal y recurso didáctico favorito con barras de progreso).
  2. *Caja de Herramientas Favorita:* Dinámicas de inicio desconectadas/icebreakers, estilos de evaluación formativa, principios DUA y caja de texto para la Filosofía Pedagógica Personal.
  3. *Matriz de Transversalidad:* Proyectos transversales institucionales (STEAM, PRAE, Convivencia), articulación interdisciplinar habitual y reto/pregunta problémica.
  4. *Recursos Probados en Aula:* Repositorio de materiales pedagógicos validados y botón de anexión directa.
- Se incorporaron las 5 capturas fotográficas reales de alta fidelidad en `docs/evidencias/ACT-009/` y `docs/evidencias/ACT-010/`, vinculándose a los mockups `mockup-adn-pedagogico.png` y `mockup-caja-herramientas.png` en `docs/diseno-interface/mockups/`.

---

### 12. Formalización de la Ventana de Administración y Control (ACT-007, ACT-009, ACT-010)
- **Panel de Administración y Control (`/administracion`):** Se auditó e inventarió completamente la vista de supervisión institucional y gobernanza curricular con sus 4 pestañas operativas:
  1. *Analíticas y Métricas Gráficas:* Métricas macroscópicas (5 Docentes activos +100%, 4 Planes promedio 0.8, 1 Experiencias, 100 Impacto escolar), gráfico circular Donut SVG de distribución por nivel escolar (Primaria 40%, Secundaria 20%, Media 0%), producción STEAM por áreas y barra de solicitudes.
  2. *Directorio de Docentes:* Tabla administrativa de 5 docentes con filtrado por nivel formativo, buscador en tiempo real, botones de detalle y garantía de cifrado según la Ley 1581 de 2012 (Habeas Data).
  3. *Identidad & ADN Pedagógico Colectivo:* Diagnóstico institucional de la brecha entre metodología declarada (100% socioemocional) vs aplicada en aula (50% socioemocional, 25% indagación, 25% gamificación), proyectos transversales, caja DUA colectiva y banco probado.
  4. *Tickets de Soporte:* Bandeja de incidencias con estado de atención interactivo (0 Resueltos, 1 Pendientes) y formulario de respuesta directa al docente emisor.
- Se incorporaron las 5 evidencias fotográficas reales en `docs/evidencias/ACT-009/` y `docs/evidencias/ACT-010/`, y los 4 mockups en `docs/diseno-interface/mockups/` (`mockup-admin-analiticas.png`, `mockup-admin-directorio.png`, `mockup-admin-adn-colectivo.png`, `mockup-admin-tickets.png`).

---

### 13. Consolidación de Módulos Comunitarios y de Soporte: Biblioteca, Foro, Ayuda y Soporte (ACT-007, ACT-009, ACT-010)
- **Biblioteca Comunitaria (`/biblioteca`):** Se formalizó el repositorio público de secuencias didácticas abiertas, documentando el buscador temático, selector de grado escolar, tarjetas de planes compartidos (ej. *Pensamiento Computacional*), modal de vista previa Markdown con tecla `Escape` y botón de clonación directa al planificador.
- **Foro Docente Interactivo (`/foro`):** Se inventarió el espacio comunitario dialógico con sus 3 columnas (Vistas de navegación y categorías a la izquierda, cuadrícula central de hilos de debate con ordenación por fecha y réplicas, y panel derecho con normas de participación profesional bajo Ley 1581).
- **Centro de Ayuda Pedagógica (`/ayuda`):** Se registraron los 5 acordeones interactivos colapsables (Planificación, Almacenamiento, Plantillas, Inclusión DUA y BYOK Gemini), buscador de guías y botón de enlace a soporte.
- **Soporte Técnico Institucional (`/soporte`):** Se documentó el formulario de radicación de tickets (asunto, descripción, envío seguro a Firestore), paneles de autodiagnóstico de IA y privacidad, y vista de confirmación exitosa.
- Se incorporaron las 4 capturas fotográficas reales en `docs/evidencias/ACT-009/` y `docs/evidencias/ACT-010/` (`V07_biblioteca.png`, `V09_foro.png`, `V12_ayuda.png`, `V13_soporte.png`), y los 4 mockups correspondientes en `docs/diseno-interface/mockups/` (`mockup-biblioteca.png`, `mockup-foro.png`, `mockup-ayuda.png`, `mockup-soporte.png`).

### 14. Registro y Sistematización de la Ventana de Experiencias Pedagógicas (ACT-007, ACT-009, ACT-010)
- **Banco de Experiencias Pedagógicas (`/experiencias`):** Se auditó e integró formalmente la vista de sistematización de la práctica docente en el aula y de intercambio reflexivo en comunidad, documentando sus 2 vistas operativas:
  1. *Mis Experiencias Sistematizadas:* Vista personal donde el docente administra sus secuencias didácticas sistematizadas (`estado === 'Sistematizado'` o `'Biblioteca'`), con acciones de edición directa (`/editor?id={id}`), alternancia de privacidad (*"Hacer Privada"* / *"Publicar"*) y eliminación segura con `ConfirmModal.jsx`.
  2. *Experiencias de la Comunidad:* Vista colectiva abierta donde se exploran las secuencias públicas (`estado === 'Biblioteca'`) de otros colegas docentes, con metadatos curriculares (asignatura, grado, distintivo *"Destacada"*), evaluación cuantitativa de 1 a 5 estrellas con promedio en tiempo real, botón *"Ver Experiencia"* y apertura del modal interactivo `CalificacionExperienciaModal.jsx` para valorar y comentar entre pares.
- **Trazabilidad y Evidencias:**
  - Se incorporaron las 2 capturas reales en `docs/evidencias/ACT-009/` y `docs/evidencias/ACT-010/` (`V08_experiencias.png` y `V08_experiencias_mis_experiencias.png`).
  - Se generó e integró el mockup de alta fidelidad `docs/diseno-interface/mockups/mockup-experiencias.png`, elevando el inventario oficial a 17 mockups evaluados bajo las Tres Reglas de Oro de Theo Mandel.
  - Se actualizó el formato MODESEC de 9 campos en `DESCRIPCION_VENTANAS.md` y la matriz técnica de 6 columnas en `GUION_TECNICO_MULTIMEDIAL.md`.
- **Alineación con los 7 Hábitos de Stephen Covey:**
  - *Hábito 2 (Empezar con un fin en mente):* Se diseñó el flujo de sistematización con el objetivo explícito de que la práctica docente en el aula trascienda la planificación teórica y se convierta en conocimiento transferible y replicable.
  - *Hábito 4 (Pensar en Ganar/Ganar):* La comunidad docente se enriquece mutuamente mediante la retroalimentación cualitativa y el sistema de calificación por estrellas, donde compartir buenas prácticas eleva el nivel pedagógico colectivo.
  - *Hábito 6 (Sinergizar):* La alternancia entre la práctica individual y la vitrina comunitaria crea un espacio sinérgico donde secuencias didácticas destacadas pueden ser adaptadas y calibradas por múltiples educadores.

---

## Acuerdos y Próximos Compromisos
1. **Zoe Peñata (Scrum Master):** Monitorear la ejecución del plan de acción derivado de la evaluación, verificar entregables de ACT-007, ACT-009, ACT-010, ACT-011, ACT-012, ACT-014 y ACT-015, y preparar la entrega de la Semana 10.
2. **Daniel Tapias y Luis Caldera (Frontend Developers):** Mantener la integridad del frontend, el paso exitoso de las 7 suites de pruebas y la estabilidad de la iconografía vectorial y el sistema Glassmorphism.
3. **María Soto y María Ubarne (Product Owners):** Validar la experiencia de usuario y realizar las pruebas con docentes de muestra para la recolección del índice SUS.

