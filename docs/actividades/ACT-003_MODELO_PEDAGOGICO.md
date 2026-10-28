# ACT-003 - Análisis y Definición del Modelo Pedagógico

## 1. Actividad
**ID:** ACT-003  
**Nombre:** Análisis y Definición del Modelo Pedagógico.  
**Prioridad:** Alta.  
**Estado:** **COMPLETADA — CONSOLIDADA Y VALIDADA POR EL EQUIPO.**

---

## 2. Objetivo
Analizar y documentar formalmente el modelo pedagógico que orienta el desarrollo del software educativo **PlanClase (INSPIRATEC)**, estableciendo su relación bidireccional con la necesidad educativa, los usuarios docentes, los estudiantes beneficiarios, el software educativo, el ambiente de aprendizaje, las estrategias metodológicas activas, las competencias de la Guía 30 del MEN y los marcos metodológicos **MODESEC** y **SECMALI**.

---

## 3. Estado Actual
**COMPLETADA — CONSOLIDADA Y VALIDADA POR EL EQUIPO.**  
*(El análisis inicial fue realizado en la Semana 4, formalizando la adopción del Constructivismo y metodologías activas. En las Semanas 5 y 6 se completó la validación final del equipo, articulando el modelo con la evidencia científica de la Matriz de 15 Artículos [ACT-004], la caracterización exhaustiva de la población prioritaria DUA/PIAR y la matriz curricular de competencias en el Diseño de Aprendizaje bajo MODESEC [ACT-013]).*

---

## 4. Semana
* **Semana de inicio y formulación:** Semana 4.  
* **Semana de consolidación y validación final:** Semana 6.

---

## 5. Participantes y Responsabilidades

Todos los integrantes del equipo (Grupo 2) participaron activamente en el proceso colegiado:

| Integrante | Rol Scrum | Responsabilidad en ACT-003 | Hábito Covey Principal |
|---|---|---|---|
| **Zoe Peñata** | Scrum Master | Coordinación general de sesiones, gestión del tiempo, moderación del debate epistemológico y validación de acuerdos grupales. | H3 (Primero lo Primero), H6 (Sinergizar) |
| **Luis Caldera** | Frontend Developer | Análisis de coherencia entre los componentes de interfaz (interacción activa, HUD, selector de metodologías) y los postulados constructivistas. | H2 (Fin en Mente), H5 (Primero Comprender) |
| **Daniel Tapias** | Frontend Developer / Técnico | Análisis técnico de arquitectura, trazabilidad con el código (`quiz-game.ts`, D3.js, DUA tokens), gestión en Git y registro documental. | H1 (Ser Proactivo), H6 (Sinergizar) |
| **Maira Ortega** | Facilitadora / Documentación | Sistematización de discusiones, estructuración de actas, análisis del rol docente mediador y apoyo en redacción pedagógica. | H5 (Primero Comprender), H6 (Sinergizar) |
| **María Soto** | Product Owner | Priorización de necesidades formativas, validación de la Guía 30 MEN y liderazgo en la decisión de adoptar Constructivismo y ABP. | H2 (Empezar con Fin en Mente), H4 (Ganar/Ganar) |
| **María Ubarne** | PO Support / Asesora Pedagógica | Fundamentación pedagógica del marco inclusivo DUA (CAST) y PIAR (Decreto 1421/2017) como pilar transversal de la arquitectura educativa. | H2 (Fin en Mente), H5 (Primero Comprender) |

---

## 6. Desarrollo Metodológico

El desarrollo de la actividad se ejecutó en diez (10) fases sistemáticas:

1. **Auditoría del software y la arquitectura:** Revisión exhaustiva de la documentación existente (`README.md`, `DIAGRAMA_DE_CONTENIDOS.md`) y del código fuente en `src/` para verificar qué tipo de interacción propone el sistema.
2. **Identificación de funcionalidades educativas:** Reconocimiento de módulos pedagógicos concretos: Wizard didáctico en 4 pasos, generador de mapas conceptuales interactivos (D3.js), trivias interactivas, sopas de letras y panel de accesibilidad DUA/PIAR.
3. **Mapeo de metodologías activas integradas:** Verificación de las estrategias seleccionables por el docente en el Wizard: Aprendizaje Basado en Problemas (ABP), Pensamiento Computacional (*Connected* y *Unplugged*), Design Thinking, Gamificación e Indagación.
4. **Debate epistemológico y sesión de consenso:** Discusión colegiada de los seis integrantes para deliberar sobre las corrientes pedagógicas (conductismo vs. cognitivismo vs. constructivismo).
5. **Selección unánime del Constructivismo:** Definición del **Constructivismo Cognitivo y Social** como el modelo rector, reconociendo que el estudiante construye activamente el conocimiento mediante la resolución de problemas y la interacción mediada.
6. **Estructuración bajo el marco SECMALI:** Mapeo de los cinco elementos relacionales: Sujeto que aprende (Estudiante), Educador (Docente mediador), Contenido/Objeto de conocimiento (Tecnología e Informática - MEN Guía 30), Medio/Software (PlanClase como andamiaje cognitivo) y Ambiente de aprendizaje (aulas conectadas, hibridas y desconectadas).
7. **Articulación con MODESEC:** Alineación de las dimensiones pedagógica, comunicacional y computacional de MODESEC, asegurando que cada componente del software responda a un requerimiento curricular.
8. **Articulación con evidencia científica (ACT-004):** Respaldo de los principios constructivistas a través de la literatura científica analizada (Piaget, Vygotsky, Papert, Wing, Barrows, CAST, Black & Wiliam).
9. **Operacionalización curricular (ACT-013):** Conexión directa del modelo con la matriz de competencias, indicadores, estrategias, actividades y evidencias de aprendizaje en `DISENO_DE_APRENDIZAJE.md`.
10. **Revisión, validación y cierre:** Sesión de revisión final del documento `MODELO_PEDAGOGICO.md` con aprobación unánime de los integrantes del equipo.

---

## 7. Producto Entregable

* **Documento Principal:** [`docs/pedagogia/MODELO_PEDAGOGICO.md`](../pedagogia/MODELO_PEDAGOGICO.md)  
  *(Estructura exhaustiva de 20 secciones: propósito educativo, necesidad formativa, población prioritaria, constructivismo, justificación, estrategias complementarias, roles SECMALI, ambiente escolar, DUA/PIAR, relación con MODESEC, evidencia científica articulada y validación formal).*
* **Documentos Vinculados:**
  * [`docs/pedagogia/DISENO_DE_APRENDIZAJE.md`](../pedagogia/DISENO_DE_APRENDIZAJE.md) (ACT-013).
  * [`docs/investigacion/MATRIZ_15_ARTICULOS.md`](../investigacion/MATRIZ_15_ARTICULOS.md) (ACT-004).
  * [`docs/proyecto/EQUIPO_Y_ROLES.md`](../proyecto/EQUIPO_Y_ROLES.md) y [`docs/proyecto/SCRUM_Y_MODESEC.md`](../proyecto/SCRUM_Y_MODESEC.md).

---

## 8. Evidencias

- **Evidencias Documentales:**
  - `docs/pedagogia/MODELO_PEDAGOGICO.md` (versión final consolidada de 20 secciones).
  - `docs/pedagogia/DISENO_DE_APRENDIZAJE.md` (matriz de diseño instruccional MODESEC).
  - `README.md` (sección 4: Modelo Pedagógico integrado).
- **Evidencias Técnicas en Código:**
  - Selector metodológico y Wizard 4 pasos en `src/pages/WizardPage.jsx` y componentes modales.
  - Generador de mapas conceptuales en `src/components/ConceptMap.jsx` / D3.js.
  - Módulos lúdicos y de evaluación formativa en `src/components/QuizModal.jsx` y `quiz-game.ts`.
  - Sistema de tokens de accesibilidad e inclusión DUA en `src/index.css` y `AccessibilityModal.jsx`.
- **Evidencias de Repositorio:**
  - Commits en la rama `main` del repositorio oficial (`https://github.com/DanielTapias12/planclase.git`).
- **Evidencias de Decisión y Ética:**
  - Acta de decisión unánime registrada en el Diario de Campo (`SEMANA_04.md`, `SEMANA_06.md`).
  - Registro de apoyo ético con IA bajo el marco ROCAS (`docs/ia/REGISTRO_IA_ACT-003.md` y `REGISTRO_USO_IA.md`).

---

## 9. Evaluación de la Actividad

| Dimensión | Nivel | Observación Justificada |
|---|---|---|
| **1. Cumplimiento** | **4 — Excelente / Consolidado** | El modelo cubre el 100% de los elementos exigidos por la cátedra, MODESEC y SECMALI, articulado plenamente con el código. |
| **2. Calidad** | **4 — Excelente / Consolidado** | Redacción rigurosa, argumentación epistemológica sólida y respaldo en normatividad MEN (Guía 30, Decretos 1421 y 1290). |
| **3. Evidencia** | **4 — Excelente / Consolidado** | Trazabilidad completa con el código fuente del frontend, matriz de 15 artículos científicos y diseño de aprendizaje. |
| **4. Documentación** | **4 — Excelente / Consolidado** | Documento oficial de 20 secciones con estructura académica impecable y formato Markdown estándar. |
| **5. Responsabilidad** | **4 — Excelente / Consolidado** | Participación y aportes individuales verificados de los 6 miembros del equipo con roles claros. |
| **6. Coherencia** | **4 — Excelente / Consolidado** | La propuesta constructivista y de aprendizaje activo es perfectamente coherente con la arquitectura SPA, el Wizard y los recursos generados. |

---

## 10. Conclusión y Visto Bueno del Equipo

La actividad **ACT-003** queda formalmente **CERRADA Y COMPLETADA**. Ha dejado de ser un borrador provisional para convertirse en el fundamento pedagógico y epistemológico oficial de la plataforma **PlanClase (INSPIRATEC)**, guiando directamente el diseño curricular, la arquitectura de componentes y la validación de usabilidad del software educativo.
