# ACT-013 — Consolidar el Diseño de Aprendizaje

## 1. Información General
- **ID de la Actividad:** ACT-013
- **Nombre:** Consolidar el Diseño de Aprendizaje
- **Semana de Ejecución:** Semana 6
- **Prioridad:** Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial, Componente 7)

## 2. Objetivo
Construir y formalizar el documento de Diseño de Aprendizaje de INSPIRATEC, articulando de manera rigurosa la cadena metodológica descendente propuesta por MODESEC:
Competencias -> Indicadores -> Modelo Pedagógico -> Estrategias -> Actividades -> Evidencias,
garantizando coherencia estricta con las Orientaciones Generales para la Educación en Tecnología (Guía 30 del MEN) y el enfoque constructivista inclusivo (DUA/PIAR).

## 3. Justificación y Diagnóstico Técnico
El proyecto contaba con la fundamentación del modelo pedagógico (`MODELO_PEDAGOGICO.md`) y con la estructuración de contenidos (`DIAGRAMA_DE_CONTENIDOS.md`), pero carecía de la formalización explícita de la matriz relacional de diseño instruccional que conecta cada competencia de la Guía 30 con las actividades del sistema y sus evidencias de evaluación.

Mediante esta actividad se consolida la matriz tabular en las 5 dimensiones clave:
1. **Competencia** (Guía 30 MEN por componentes: Naturaleza, Apropiación, Solución de problemas, Tecnología y sociedad).
2. **Indicador de Desempeño** (Descriptores observables para evaluación analítica formativa).
3. **Estrategia de Aprendizaje** (Metodologías activas: ABP, Pensamiento Computacional, Gamificación, Design Thinking, DUA).
4. **Actividad Didáctica** (Momentos pedagógicos: Inicio, Desarrollo y Cierre).
5. **Evidencia de Aprendizaje** (Productos tangibles: algoritmos, rúbricas, diapositivas, planes estructurados).

## 4. Participación del Equipo
- **María Soto (Product Owner):** Validación de pertinencia curricular y correspondencia con el currículo oficial del MEN.
- **María Ubarne (Product Owner Support):** Análisis de necesidades pedagógicas, articulación de indicadores y pautas de inclusión DUA.
- **Zoe Peñata (Scrum Master):** Coordinación del sprint, control de tiempos y formalización de entregables.
- **Maira Ortega (Facilitadora):** Revisión de coherencia metodológica y redacción de la matriz formativa.
- **Luis Caldera (Desarrollador / UX):** Alineación entre las actividades pedagógicas y los componentes interactivos de la interfaz gráfica.
- **Daniel Tapias (Desarrollador / Git):** Integración técnica documental en el repositorio, estructuración Markdown y trazabilidad en GitHub.

## 5. Artefactos y Productos Generados
- **Producto Oficial:** [`docs/pedagogia/DISENO_DE_APRENDIZAJE.md`](../pedagogia/DISENO_DE_APRENDIZAJE.md)
  - Matriz completa de los 4 componentes de la Guía 30 del MEN.
  - Dimensiones transversales de Gamificación (Canvas) e Inclusión DUA/PIAR.
  - Dosificación temporal de secuencias didácticas (Inicio, Desarrollo, Cierre).
  - Especificación de instrumentos de evaluación formativa (rúbricas analíticas en 4 niveles).

## 6. Evidencias Verificadas en el Software
- Implementación del Wizard de 4 pasos en `src/pages/WizardPage.jsx` que refleja los 3 momentos pedagógicos.
- Generador de rúbricas analíticas en `src/services/aiService.js` adaptadas a los niveles ministeriales (Superior, Alto, Básico, Bajo).
- Módulos interactivos lúdicos y de presentación en `src/pages/PlantillasPage.jsx` y componentes UI.

## 7. Evaluación Académica de la Actividad
- **Cumplimiento:** 4 — Consolidado (Matriz completa con todos los campos requeridos por MODESEC).
- **Calidad:** 4 — Consolidado (Rigor pedagógico, fundamentación curricular nacional y enfoque constructivista).
- **Evidencia:** 4 — Consolidado (Correspondencia directa con el código y las funcionalidades desplegadas en la app).
- **Documentación:** 4 — Consolidado (Estructura Markdown impecable y vinculada al repositorio).
- **Responsabilidad:** 4 — Consolidado (Participación de todo el equipo según roles oficiales de Scrum).
- **Coherencia:** 4 — Consolidado (Articulación sin fisuras entre MODESEC, SECMALI y la Guía 30 MEN).
