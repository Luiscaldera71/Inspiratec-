# ACT-011 — Elaboración del Guion Didáctico

## 1. Información General
- **ID de la Actividad:** ACT-011 (Actividad 9 del Plan de Trabajo)
- **Nombre Oficial:** Elaboración del Guion Didáctico
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación Final)
- **Prioridad:** Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial, Componente 6 y 7)
- **Producto Esperado:** `GUION_DIDACTICO.md` en `docs/pedagogia/` y raíz del proyecto.

---

## 2. Objetivo y Justificación

### Objetivo General
Elaborar el **Guion Didáctico integral de INSPIRATEC**, fundamentado rigurosamente en el funcionamiento real del software, su arquitectura de Sistema Tutor Inteligente y su finalidad formativa, explicitando qué aprenderá el usuario mediante la plataforma, cómo contribuirá cada componente computacional a dicho aprendizaje, qué competencias y capacidades desarrollará y qué evidencias permitirán constatar los resultados educativos alcanzados.

### Justificación Técnica y Pedagógica
En el marco del diseño de software educativo bajo MODESEC y las directrices institucionales, el software no puede reducirse a una colección de pantallas o a un envoltorio tecnológico superficial sobre un modelo de lenguaje. El Guion Didáctico constituye la carta de navegación pedagógica que articula la intencionalidad formativa con la experiencia interactiva del usuario. Con este documento se formalizan los 10 apartados exigidos, respondiendo a la pregunta central: **¿Qué aprenderá el usuario mediante este software, cómo lo aprenderá y qué evidencias permitirán reconocer ese aprendizaje?**

---

## 3. Responsables y Participantes

| Integrante | Rol Scrum Oficial | Contribución Específica en ACT-011 |
|---|---|---|
| **María Soto** | Product Owner | Liderazgo pedagógico en la definición de la finalidad educativa, coherencia curricular con la Guía 30 del MEN y validación de los objetivos didácticos. |
| **María Ubarne** | Product Owner Support | Modelado de los contextos valorativos, caracterización psicológica fundamentada y especificación de los apoyos inclusivos DUA/PIAR. |
| **Zoe Peñata** | Scrum Master | Facilitación del sprint, control de tiempos, verificación de completitud de los 10 apartados y gestión de la integración documental. |
| **Maira Ortega** | Facilitadora de Equipo | Análisis de la carga cognitiva docente, estructuración de la unidad temática en 5 módulos y revisión de coherencia de las evidencias de aula. |
| **Luis Caldera** | Development Team / UI-UX Lead | Mapeo entre las actividades didácticas y los componentes ergonómicos de la interfaz (Dock, Wizard, paneles Glassmorphism y microinteracciones). |
| **Daniel Tapias** | Development Team / Git Lead | Auditoría técnica de capacidades existentes en código fuente (`src/`), generación de artefactos Markdown, control de versiones y trazabilidad institucional. |

---

## 4. Estructura y Contenidos Desarrollados en el Guion

La actividad cubrió y desarrolló exhaustivamente los 10 apartados obligatorios:

1. **Título:** *INSPIRATEC: Ecosistema Digital de Andamiaje Pedagógico, Co-diseño Curricular Asistido por Inteligencia Artificial y Generación de Instrumentos Didácticos Multimodales*.
2. **Sinopsis de la Temática:** Transposición didáctica en los tres momentos del MEN (Inicio, Desarrollo y Cierre), componentes de la Guía 30 MEN, metodologías activas (ABP, STEAM, Pensamiento Computacional, Gamificación), DUA/PIAR y modelado de estilos de aprendizaje de Felder-Silverman.
3. **Finalidad Educativa:** Superación de la sobrecarga burocrática y desarticulación curricular mediante un andamiaje reflexivo que enseña a planificar con criterio científico a docentes y asegura experiencias constructivistas a los estudiantes.
4. **Objetivos Didácticos:** 7 objetivos medibles y observables (OD-01 a OD-07) vinculados directamente a pantallas y módulos del sistema.
5. **Contextos Valorativos:** Ética y soberanía docente (*Shared Agency*), equidad e inclusión, honestidad académica, cultura comunitaria y afilar la sierra metacognitivo.
6. **Características de la Población Objetivo:** Caracterización detallada de usuarios directos (docentes en ejercicio y formación) y beneficiarios indirectos (estudiantes de 1.° a 11.°).
7. **Rango de Edades y Justificación:** 20 a 65 años para docentes (madurez cognitiva y responsabilidad profesional) y 6 a 18 años para estudiantes (trayectoria formal de ciclos escolares del MEN).
8. **Características Psicológicas:** Fundamentación basada en la Teoría de la Carga Cognitiva (Sweller), Transposición Didáctica (Chevallard), Autodeterminación (Deci & Ryan), Autoeficacia (Bandura) y Doble Lazo Metacognitivo (Caro Piñeres).
9. **Nivel Académico:** Pertinencia demostrada para Educación Superior (Licenciaturas y Posgrados), Escuelas Normales y Educación Básica y Media.
10. **Unidad Temática:** Secuencia de 5 módulos didácticos (Diagnóstico y ADN Pedagógico, Metas y MEN, Secuenciación Activa, DUA/PIAR, y Evaluación Formativa Multimodal).

---

## 5. Artefactos y Productos Generados

- **Documento Maestro Pedagógico:** [`docs/pedagogia/GUION_DIDACTICO.md`](../pedagogia/GUION_DIDACTICO.md) (13 apartados completos con contrastes técnicos).
- **Documento Resumen Ejecutivo:** [`GUION_DIDACTICO.md`](../../GUION_DIDACTICO.md) (Ubicación en la raíz del repositorio).
- **Ficha Técnica de Actividad:** `docs/actividades/ACT-011_GUION_DIDACTICO.md`.
- **Registro de Uso de IA (ROCAS):** [`docs/ia/REGISTRO_IA_ACT-011.md`](../ia/REGISTRO_IA_ACT-011.md).
- **Carpeta de Evidencias:** [`docs/evidencias/ACT-011/README.md`](../evidencias/ACT-011/README.md).
- **Actualización de Matriz de 7 Hábitos:** [`docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`](ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md) (Sección 5.12).

---

## 6. Evidencias Verificadas en el Software

El contenido del Guion Didáctico se sustenta en artefactos de código plenamente operativos:
- **Wizard de 4 Pasos:** `src/pages/WizardPage.jsx` (Identificación, Alineación MEN, Metodologías y Ajustes DUA).
- **Editor Estructurado y Doble Lazo:** `src/pages/EditorPage.jsx` y `src/components/StructuredPlanDocument.jsx`.
- **Motor Multimodal de Materiales:** `src/services/materials/` (Slides, Quizzes, Flashcards, Wordsearches, Rubrics) y `MaterialesGenerablesSection.jsx`.
- **Calibración y Metacognición:** `src/pages/AdnPedagogicoPage.jsx` y `src/components/FelderSilvermanModule.jsx`.
- **Servicio de IA con Cascada Resiliente:** `src/services/aiService.js` (Llamadas a Gemini, reglas disciplinares y replanificación).

---

## 7. Matriz de Evaluación Académica

| Criterio | Calificación (1 a 4) | Justificación Evaluativa |
|---|---|---|
| **Cumplimiento** | **4 — Consolidado** | Se desarrollaron la totalidad de los 10 apartados obligatorios y los criterios pedagógicos transversales sin omitir ninguno. |
| **Calidad** | **4 — Consolidado** | Profundidad analítica, fundamentación epistemológica rigurosa (Sweller, Chevallard, Bandura, MEN) y respuesta explícita a la pregunta central. |
| **Evidencia** | **4 — Consolidado** | Correspondencia demostrable con los archivos de código fuente, componentes interactivos y servicios desplegados en el software. |
| **Documentación** | **4 — Consolidado** | Redacción académica profesional, formato Markdown impecable, enlaces navegables relativos y doble ubicación estratégica (raíz y pedagogía). |
| **Responsabilidad** | **4 — Consolidado** | Participación activa, articulada y trazable de los 6 miembros del equipo bajo los 7 hábitos de Covey y roles Scrum. |
| **Coherencia** | **4 — Consolidado** | Articulación armónica entre MODESEC, el Modelo Pedagógico Constructivista, el Diseño de Aprendizaje y el Frontend de INSPIRATEC. |

---

## 8. Síntesis de los 7 Hábitos en ACT-011

- **Daniel Tapias (H1, H3, H7):** Proactividad en auditoría de código, priorización técnica y afilar la sierra en trazabilidad Git.
- **Luis Caldera (H2, H5, H6):** Visión espacial de la interfaz pedagógica, empatía ergonómica con el usuario y sinergia visual.
- **Zoe Peñata (H3, H4, H6):** Priorización del backlog, facilitación ganar-ganar entre PO y Devs, y sinergia en la entrega.
- **Maira Ortega (H4, H5, H6):** Ganar-ganar para docentes y alumnos, escucha empática de la realidad de aula y sinergia documental.
- **María Soto (H2, H4, H5):** Fin pedagógico en mente, beneficio mutuo curricular y comprensión diagnóstica de la sobrecarga docente.
- **María Ubarne (H2, H5, H6):** Fin en mente inclusivo (DUA/PIAR), comprensión de la diversidad y co-diseño con el equipo técnico.
