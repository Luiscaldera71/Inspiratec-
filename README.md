# Inspiracte

> **Plataforma Educativa para la Planeación Curricular y Generación de Instrumentos Didácticos**

Inspiracte es una plataforma web orientada a docentes, diseñada para asistir en el diseño, estructuración y generación automatizada de secuencias didácticas completas, utilizando Inteligencia Artificial (Google Gemini) bajo los estándares curriculares del Ministerio de Educación Nacional de Colombia.

---

## 1. Tecnologías Utilizadas

* **Frontend:** React 19, React Router v7, Zustand, Framer Motion, Lucide React, React Markdown, Vite.
* **Backend/BaaS:** Firebase (Auth, Firestore).
* **Inteligencia Artificial:** API REST de Google Gemini (gemini-2.0-flash / gemini-1.5-flash) para la sugerencia de propósitos, estándares (MEN Guía 30), generación de planes de clase y material complementario (rúbricas, cuestionarios, flashcards, juegos de roles, sopas de letras, etc.).

---

## 2. Equipo de Desarrollo — Grupo 2

| Integrante | Rol Scrum | Responsabilidades Principales |
|---|---|---|
| **Zoe Peñata** | Scrum Master | Coordinación del proceso Scrum, gestión de tiempos y seguimiento a compromisos |
| **María Soto** | Product Owner | Definición y priorización del backlog y pertinencia didáctica del producto |
| **María Ubarne** | Product Owner | Validación de requerimientos pedagógicos y articulación curricular |
| **Luis Caldera** | Development Team | Desarrollo frontend, diseño y maquetación de interfaces interactivas (UI/UX) |
| **Daniel Tapias** | Development Team | Desarrollo frontend, gestión técnica del repositorio Git y control de versiones |
| **Maira Ortega** | Development Team | Desarrollo, validación funcional de la plataforma y seguimiento a actividades |

Consulte el detalle completo de responsabilidades en [docs/proyecto/EQUIPO_Y_ROLES.md](docs/proyecto/EQUIPO_Y_ROLES.md).

---

## 3. Metodología de Trabajo

El proyecto articula dos marcos complementarios:

* **SCRUM (Marco de Gestión y Desarrollo):** Gobierna la dinámica de trabajo en equipo, roles oficiales, planificación de Sprints, bitácoras de campo y monitoreo semanal de entregables.
* **MODESEC (Marco Orientador de Diseño Educativo):** Modela la fundamentación didáctica del software educativo (necesidad educativa, competencias MEN Guía 30, indicadores en rúbricas, diseño pedagógico y accesibilidad DUA).

Consulte la fundamentación completa en [docs/metodologia/SCRUM_Y_MODESEC.md](docs/metodologia/SCRUM_Y_MODESEC.md).

---

## 4. Modelo Pedagógico (Constructivismo y Metodologías Activas)

INSPIRATEC fundamenta su diseño instruccional y arquitectura de software en el **Constructivismo** como modelo pedagógico central, estructurado bajo el marco orientador **MODESEC** y articulado con los lineamientos de la **Guía 30 del Ministerio de Educación Nacional (MEN)**:

* **Modelo Pedagógico Principal — Constructivismo:** Sitúa al estudiante en el centro del aprendizaje como sujeto activo y creador, promoviendo la construcción autónoma de significados a partir de sus saberes previos, la exploración guiada y el análisis crítico de artefactos tecnológicos.
* **Metodologías Activas Articuladas:**
  * **Aprendizaje Basado en Problemas (ABP):** Planteamiento de situaciones problémicas reales que desafían al estudiante a investigar y formular soluciones tecnológicas viables.
  * **Pensamiento Computacional y Design Thinking:** Fomento de la abstracción, descomposición, diseño iterativo y empatía con las necesidades del entorno escolar.
  * **Gamificación e Indagación:** Incorporación de dinámicas interactivas (trivias, retos en Canvas, sopas de letras) para dinamizar saberes previos y afianzar conceptos clave.
* **Enfoque de Inclusión y Diversidad (DUA y PIAR):**
  * Integración estructural de los principios del **Diseño Universal para el Aprendizaje (DUA)**: múltiples formas de motivación, representación y expresión, con soporte de accesibilidad visual y auditiva directamente en la plataforma.
  * Soporte guiado para el **Plan Individual de Ajustes Razonables (PIAR)** dentro del asistente de planeación (Paso 4), garantizando equidad para estudiantes con discapacidades y talentos excepcionales.
* **Roles dentro del Proceso Educativo:**
  * **Estudiante:** Participante activo, reflexivo y transformador que elabora evidencias de aprendizaje y artefactos concretos.
  * **Docente:** Diseñador y mediador pedagógico que estructura andamiajes formativos y evalúa continuamente mediante rúbricas analíticas (Superior, Alto, Básico, Bajo).
  * **Software Educativo (INSPIRATEC):** Entorno facilitador que optimiza la labor de planeación, combate la sobrecarga documental y garantiza la coherencia curricular nacional.

Consulte la fundamentación teórica completa en [docs/pedagogia/MODELO_PEDAGOGICO.md](docs/pedagogia/MODELO_PEDAGOGICO.md).

---

## 5. Instalación y Ejecución

### Prerrequisitos
* Node.js (v18+)
* pnpm (recomendado)

### Pasos
1. Instalar dependencias:
   ```bash
   pnpm install
   ```
2. Ejecutar entorno de desarrollo:
   ```bash
   pnpm run dev
   ```

---

## 6. Sistema de Diseño Visual y Modales (Actualización 2026)

La interfaz de usuario implementa un diseño contemporáneo basado en:
* **Glassmorphism institucional:** Paneles de cristal translúcido con desenfoque de 20px a 30px (`backdrop-filter`), bordes luminosos sutiles y sombras suaves integradas sobre fondos ambientales fotográficos en todas las páginas del sistema.
* **Sistema Unificado de Modales con Portal (`.modal-glass-*`):** Ventanas emergentes montadas en `document.body` mediante `createPortal`, garantizando z-index absoluto sobre menús y barras fijas, bloqueo de scroll y atajo accesible `Escape`.
* **Confirmaciones Seguras (`ConfirmModal.jsx`):** Diálogos interactivos de cristal para operaciones destructivas sin alertas grises nativas del navegador.

Consulte la documentación técnica detallada en [docs/proyecto/ACTUALIZACION_SISTEMA_DISENO_MODALES_2026.md](docs/proyecto/ACTUALIZACION_SISTEMA_DISENO_MODALES_2026.md).

---

## 7. Arquitectura y Mapa de Navegación MODESEC (ACT-006)

Siguiendo las directrices de la **Guía de la Semana 03** y el marco orientador **MODESEC**, INSPIRATEC modela su experiencia de usuario en una jerarquía estructurada de cinco niveles:
$$\text{Pantalla Inicial} \longrightarrow \text{Módulos Principales} \longrightarrow \text{Pantallas Secundarias} \longrightarrow \text{Actividades} \longrightarrow \text{Resultados}$$

* **Regla de Oro de Interacciones:** Garantiza el acceso a cualquier contenido formativo o didáctico en un máximo de **3 interacciones** (promedio empírico de 1.8 clics).
* **Controles Canónicos Ubicuos:** Incorpora controles permanentes de **Regresar** (con `Breadcrumbs` interactivo y sincronización de historial), **Inicio** (Sidebar / Header), **Ayuda** (FAQ, guías y tour) y **Cerrar / Cancelar** (tecla `Escape`, botón `✕`).
* **Documentación y Diagramas:**
  * Documento Técnico-Metodológico: [docs/diseno-multimedial/MAPA_NAVEGACION.md](docs/diseno-multimedial/MAPA_NAVEGACION.md)
  * Diagrama Vectorial de Alta Fidelidad: [docs/diseno-multimedial/MAPA_NAVEGACION.svg](docs/diseno-multimedial/MAPA_NAVEGACION.svg)
  * Ficha de Actividad: [docs/actividades/ACT-006_MAPA_NAVEGACION.md](docs/actividades/ACT-006_MAPA_NAVEGACION.md)
  * Evidencias: [docs/evidencias/ACT-006/README.md](docs/evidencias/ACT-006/README.md)
  * Registro de IA (ROCAS): [docs/ia/REGISTRO_IA_ACT-006.md](docs/ia/REGISTRO_IA_ACT-006.md)

---

## 8. Guion Didáctico Institucional (ACT-011)

Siguiendo el marco metodológico **MODESEC** (Fase II — Diseño Educativo), INSPIRATEC formaliza su Guion Didáctico integral fundamentado en el funcionamiento real del software y su finalidad pedagógica:

* **Documento Maestro Pedagógico:** [docs/pedagogia/GUION_DIDACTICO.md](docs/pedagogia/GUION_DIDACTICO.md)
* **Documento Ejecutivo:** [GUION_DIDACTICO.md](GUION_DIDACTICO.md)
* **Ficha Técnica de Actividad:** [docs/actividades/ACT-011_GUION_DIDACTICO.md](docs/actividades/ACT-011_GUION_DIDACTICO.md)
* **Evidencias:** [docs/evidencias/ACT-011/README.md](docs/evidencias/ACT-011/README.md)
* **Registro Ético de IA (ROCAS):** [docs/ia/REGISTRO_IA_ACT-011.md](docs/ia/REGISTRO_IA_ACT-011.md)
* **Análisis de los 7 Hábitos:** [docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md](docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#512-act-011--elaboración-del-guion-didáctico-actividad-9)

---

## 9. Guía de Metáforas MODESEC (ACT-012)

En cumplimiento de la **Fase II: Diseño Multimedial** de MODESEC, INSPIRATEC documenta formalmente su catálogo de metáforas e iconografía fidedigna:

* **Documento Maestro:** [docs/diseno-multimedial/GUIA_DE_METAFORAS.md](docs/diseno-multimedial/GUIA_DE_METAFORAS.md)
* **Documento Ejecutivo:** [GUIA_DE_METAFORAS.md](GUIA_DE_METAFORAS.md)
* **Colección Vectorial Oficial:** [docs/diseno-multimedial/iconos/](docs/diseno-multimedial/iconos/) (33 iconos SVG nativos de producción)
* **Ficha Técnica de Actividad:** [docs/actividades/ACT-012_GUIA_DE_METAFORAS.md](docs/actividades/ACT-012_GUIA_DE_METAFORAS.md)
* **Evidencias:** [docs/evidencias/ACT-012/README.md](docs/evidencias/ACT-012/README.md)
* **Registro Ético de IA (ROCAS):** [docs/ia/REGISTRO_IA_ACT-012.md](docs/ia/REGISTRO_IA_ACT-012.md)
* **Análisis de los 7 Hábitos:** [docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md](docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#513-act-012--diseño-de-la-guía-de-metáforas-actividad-10)

---

## 10. Desarrollo Frontend, Usabilidad y Accesibilidad DUA (ACT-014 y ACT-015)

En consolidación de las Fases II y III de MODESEC y los estándares de ingeniería de software educativo:

* **Desarrollo Frontend e Integración (ACT-014):**
  * Ficha Técnica Oficial: [docs/actividades/ACT-014_DESARROLLO_FRONTEND.md](docs/actividades/ACT-014_DESARROLLO_FRONTEND.md)
  * Evidencias y Pruebas Automatizadas (`npm test` 7/7 suites): [docs/evidencias/ACT-014/README.md](docs/evidencias/ACT-014/README.md)
  * Registro Ético de IA (ROCAS): [docs/ia/REGISTRO_IA_ACT-014.md](docs/ia/REGISTRO_IA_ACT-014.md)
  * Análisis de los 7 Hábitos: [docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md](docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#59-act-014--desarrollo-frontend-e-integración-de-interfaz)
* **Validación de Usabilidad y Accesibilidad DUA (ACT-015):**
  * Ficha Técnica Oficial: [docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md](docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md)
  * Evidencias Heurísticas y WCAG 2.1 AA (SUS 86.4/100): [docs/evidencias/ACT-015/README.md](docs/evidencias/ACT-015/README.md)
  * Registro Ético de IA (ROCAS): [docs/ia/REGISTRO_IA_ACT-015.md](docs/ia/REGISTRO_IA_ACT-015.md)
  * Análisis de los 7 Hábitos: [docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md](docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md#510-act-015--validar-usabilidad-y-accesibilidad-dua)

