# Evidencias — ACT-011 (Elaboración del Guion Didáctico)

## 1. Identificación de la Actividad
* **Actividad:** ACTIVIDAD 9 (ACT-011) — Elaboración del Guion Didáctico.
* **Ciclo:** Semana 6 / Semana 10 (Consolidación y Cierre).
* **Marco de Referencia:** MODESEC (Fase II — Diseño Educativo y Multimedial).
* **Equipo de Trabajo:** Grupo 2 (María Soto, María Ubarne, Zoe Peñata, Maira Ortega, Luis Caldera, Daniel Tapias).
* **Estado:** COMPLETADA Y VALIDADA.

---

## 2. Artefactos Producidos
1. **Guion Didáctico Maestro (Documento Institucional Extendido):** [`docs/pedagogia/GUION_DIDACTICO.md`](../../pedagogia/GUION_DIDACTICO.md) (13 apartados que cubren exhaustivamente los 10 requisitos normativos, la respuesta a la pregunta central formativa y la matriz de capacidades existentes vs. futuras).
2. **Guion Didáctico Ejecutivo (Raíz del Repositorio):** [`GUION_DIDACTICO.md`](../../../GUION_DIDACTICO.md).
3. **Ficha Técnica de la Actividad:** [`docs/actividades/ACT-011_GUION_DIDACTICO.md`](../../actividades/ACT-011_GUION_DIDACTICO.md).
4. **Matriz de Trazabilidad de los 7 Hábitos de Covey:** [`docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`](../../actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#512-act-011--elaboración-del-guion-didáctico-actividad-9) (Sección 5.12).
5. **Registro de Interacción con IA (ROCAS):** [`docs/ia/REGISTRO_IA_ACT-011.md`](../../ia/REGISTRO_IA_ACT-011.md).
6. **Bitácora de Campo:** [`docs/diario-campo/SEMANA_ACTUAL.md`](../../diario-campo/SEMANA_ACTUAL.md).
7. **Monitoreo Semanal:** [`docs/seguimiento/MONITOREO_SEMANAL.md`](../../seguimiento/MONITOREO_SEMANAL.md).

---

## 3. Trazabilidad de Evidencias en el Código Fuente

El Guion Didáctico no se elaboró sobre supuestos ficticios, sino sobre la arquitectura real de software desplegada en el repositorio:

| Apartado del Guion | Componente / Servicio Verificado en Código | Evidencia Tangible |
|---|---|---|
| **Momentos Didácticos (Inicio, Desarrollo, Cierre)** | `src/pages/WizardPage.jsx` & `src/components/StructuredPlanDocument.jsx` | Wizard secuencial de 4 pasos y editor dividido en los tres momentos del MEN. |
| **Alineación Curricular Guía 30 MEN y DBA** | `src/services/aiService.js` (Líneas 119-125, funciones `suggestObjectives` y `suggestStandards`) | Ontología explícita de reglas disciplinares del MEN para Tecnología, Matemáticas, Ciencias, Lenguaje e Inglés. |
| **Inclusión DUA y PIAR** | `src/components/wizard/WizardStep4Inclusion.jsx` & `src/styles/ui.css` | Módulo de selección de barreras, ajustes razonables y panel DUA con alto contraste y fuente OpenDyslexic. |
| **Materiales Multimodales Interactivos** | `src/services/materials/` (`generateGamifiedQuizHTML`, `generateInteractiveFlashcardsHTML`, `generateWordsearchHTML`, `buildPresentationHtml`) | Módulos generadores de código HTML interactivo ejecutable localmente sin dependencias externas. |
| **Modelado de Estilos y Metacognición** | `src/pages/AdnPedagogicoPage.jsx` & `src/components/FelderSilvermanModule.jsx` | Autodiagnóstico según Felder-Silverman con radar polar SVG y persistencia de ADN formativo. |
| **Agencia Compartida (*Shared Agency*)** | `src/pages/EditorPage.jsx` & `src/components/ConfirmModal.jsx` | Soberanía total del docente para editar, aceptar o rechazar sugerencias de la IA y replanificar en caliente. |
| **Exportación Profesional** | `src/services/export/` (motores PDF nativo, Word, Markdown, JSON) | Generación directa de documentos sin diálogo invasivo del navegador. |

---

## 4. Validación Colegiada del Equipo
- **Aprobación de la Visión Pedagógica:** María Soto y María Ubarne validaron que el software educa al docente en la planificación constructivista y no promueve la holgazanería ni la automatización ciega.
- **Aprobación Técnica y Funcional:** Daniel Tapias y Luis Caldera certificaron que cada apartado describe exactamente las funcionalidades desplegadas y operativas en Vite / React 19.
- **Aprobación Metodológica Scrum:** Zoe Peñata y Maira Ortega verificaron el cierre formal de la Actividad 9 (ACT-011) en el sprint del proyecto.
