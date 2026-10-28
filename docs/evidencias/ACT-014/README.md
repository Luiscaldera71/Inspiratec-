# Evidencias — ACT-014 (Desarrollo del Frontend e Integración de Interfaz)

## 1. Identificación de la Actividad
* **Actividad:** ACT-014 — Desarrollo del Frontend e Integración de Interfaz.
* **Ciclo:** Semanas 5/6 (Consolidada y Cerrada en Semana 10).
* **Equipo Responsable:** Grupo 2 (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne).
* **Estado:** COMPLETADA Y VERIFICADA.

---

## 2. Artefactos y Evidencias en Código Fuente

### 2.1. Arquitectura de Páginas (15 Módulos en `src/pages/`)
| Página | Archivo Fuente | Propósito y Capacidades Verificadas |
|---|---|---|
| **Inicio / Dashboard** | `src/pages/HomePage.jsx` | Resumen de métricas, accesos rápidos y estado del docente. |
| **Generador (Wizard)** | `src/pages/WizardPage.jsx` | Asistente de planeación en 4 pasos conectado a Gemini con persistencia. |
| **Editor Estructurado** | `src/pages/EditorPage.jsx` | Edición WYSIWYG de secuencias, live-preview y live-actions. |
| **Mis Planes** | `src/pages/MisPlanesPage.jsx` | Repositorio personal, filtrado, clonación y confirmaciones seguras. |
| **Biblioteca** | `src/pages/BibliotecaPage.jsx` | Muro colectivo de secuencias públicas compartidas. |
| **Plantillas** | `src/pages/PlantillasPage.jsx` | Moldes curriculares por áreas formativas del MEN. |
| **Experiencias** | `src/pages/ExperienciasPage.jsx` | Muestra de metodologías activas y calificación formativa. |
| **Foro Docente** | `src/pages/ForoPage.jsx` | Diálogo pedagógico y debates comunitarios. |
| **ADN Pedagógico** | `src/pages/AdnPedagogicoPage.jsx` | Calibración docente y radar de estilos cognitivos. |
| **Configuración** | `src/pages/ConfigPage.jsx` | Gestión de API Key de Gemini y preferencias de usuario. |
| **Administración** | `src/pages/AdministracionPage.jsx` | Panel de control institucional y gestión de accesos. |
| **Ayuda** | `src/pages/AyudaPage.jsx` | Centro de preguntas frecuentes y manual interactivo. |
| **Soporte** | `src/pages/SoportePage.jsx` | Mesa de reporte de incidencias operativas. |
| **Acerca de** | `src/pages/AboutPage.jsx` | Créditos de autoría, marco MODESEC y rol institucional. |
| **Autenticación** | `src/pages/AuthPage.jsx` | Ingreso seguro con Firebase Auth y perfiles de usuario. |

### 2.2. Componentes Clave de Integración (`src/components/`)
* **Sistema de Modales con Portal:** `src/components/ConfirmModal.jsx`, `src/components/TermsAndConditionsModal.jsx`, `src/components/ModalCalibracionDocente.jsx` (montados con `createPortal` en `document.body`, `z-index: 9999`).
* **Resiliencia de Red:** `src/components/NetworkStatusBanner.jsx` (Detección de conexión y alerta offline).
* **Navegación Jerárquica:** `src/components/ui/Breadcrumbs.jsx` (Migas de pan interactivas con píldora Glassmorphism).
* **Documento Estructurado:** `src/components/StructuredPlanDocument.jsx` (Edición atómica de bloques y tablas).

### 2.3. Batería de Pruebas de Aceptación Automatizadas (`npm test` — 7/7 Superadas)
```bash
npm test
# Ejecuta 7 suites funcionales en Node.js:
# 1. test_functional_audit.mjs (Persistencia Zustand y KaTeX)
# 2. test_felder_silverman.mjs (Radar polar y resiliencia de cálculo)
# 3. test_curricular_graph.mjs (Grafo acíclico DAG de la Guía 30 MEN)
# 4. test_socratic_chat.mjs (Modo socrático y Shared Agency)
# 5. test_material_recommender.mjs (Catálogo de materiales adaptados)
# 6. test_structured_plan_editor.mjs (Serialización y parsing GFM)
# 7. test_html_materials.mjs (Slides, Trivias, Quizzes, Flashcards en HTML)
# RESULTADO: 100% de pruebas superadas sin excepciones.
```

---

## 3. Verificación de Cierre
- Las 15 páginas compilan limpiamente en Vite y se integran mediante React Router v7.
- La gestión de estado global a través de Zustand asegura persistencia sin fugas de memoria.
- Se cuenta con trazabilidad total en el repositorio Git de los commits de integración.
