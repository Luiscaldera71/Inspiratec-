# Evidencia de Actividad — ACT-006: Diseñar el Mapa de Navegación

## 1. Identificación
- **ID de la Actividad:** ACT-006
- **Semana de la Guía:** Semana 03
- **Fase MODESEC:** Diseño Computacional / Diseño Multimedial
- **Fecha de Validación:** Octubre 2026
- **Responsables:** Daniel Tapias, Luis Caldera (Equipo Frontend & UX)

---

## 2. Artefactos y Productos Entregables

| Entregable | Formato | Ruta en el Repositorio | Descripción |
|---|---|---|---|
| **Mapa de Navegación Oficial** | Imagen (`.png`) | [`MAPA_NAVEGACION.png`](./MAPA_NAVEGACION.png) | Captura oficial del esquema jerárquico del mapa de navegación con los 3 niveles y flujos. |
| **Documento del Mapa de Navegación** | Markdown (`.md`) | [`docs/diseno-multimedial/MAPA_NAVEGACION.md`](../../diseno-multimedial/MAPA_NAVEGACION.md) | Documento metodológico y técnico que fundamenta la arquitectura y la matriz de validación de 3 interacciones. |
| **Ficha de Actividad** | Markdown (`.md`) | [`docs/actividades/ACT-006_MAPA_NAVEGACION.md`](../../actividades/ACT-006_MAPA_NAVEGACION.md) | Ficha de seguimiento formal y trazabilidad de la actividad. |
| **Registro de Inteligencia Artificial** | Markdown (`.md`) | [`docs/ia/REGISTRO_IA_ACT-006.md`](../../ia/REGISTRO_IA_ACT-006.md) | Registro del uso asistido de IA bajo metodología ROCAS. |

---

### Visualización del Mapa de Navegación Oficial

![Mapa de Navegación Oficial INSPIRATEC](./MAPA_NAVEGACION.png)

---

## 3. Síntesis de Validación de Requisitos de la Guía

1. **Jerarquía en 5 Niveles MODESEC:**
   - **Pantalla Inicial & Onboarding:** V01 Autenticación / Registro (`/auth`), V01-B Bienvenida Narrativa (11 escenas), V01-C Calibración Docente Día 0.
   - **Módulos Principales (Troncales):** V02 Inicio / Dashboard (`/home`), V03 Planificador Asistido 4 Fases (`/`), V04 Editor Central (`/editor`).
   - **Pantallas Secundarias (Gestión y Control):** V05 Mis Planes, V06 Mi ADN Pedagógico, V07 Plantillas PEI, V08 Biblioteca, V09 Experiencias, V10 Foro, V11 Soporte, V12 Ayuda, V13 Acerca de, V14 Configuración, V15 Administración y Control Analítico.
   - **Actividades Didácticas:** A1 Curriculares/DUA, A2 Co-docente IA, A3 Rúbricas Socioformativas, A4 Pizarra OVA, A5 Quizzes, A6 Trivia con Audio, A7 Sopas de Letras y Flashcards 3D, A8 Calibración ADN, A9 Feedback Comunitario.
   - **Resultados:** R1 Plan 5 Campos, R2 PDF Institucional Vectorial, R3 Editable Word (.docx), R4 Suite Didáctica Portable (HTMLs autónomos), R5 Matriz Evaluativa Completa.

2. **Controles Canónicos Globales:**
   - **Regresar:** `Breadcrumbs` interactivo y botones `Volver`.
   - **Inicio:** Acceso directo persistente en Sidebar y Header.
   - **Ayuda:** Centro de ayuda, FAQ y tour guiado.
   - **Cerrar / Cancelar:** Tecla `Escape`, botón `✕` y botones `Cancelar`.

3. **Regla de Máximo 3 Interacciones:**
   - Acceso al contenido formativo en $\le 2$ clics desde cualquier vista troncal.
   - **Estado:** ✅ APROBADO (100% de cumplimiento).

---

## 4. Trazabilidad de los 7 Hábitos de Covey por Integrante
- **Daniel Tapias (H1, H6):** Proactividad en la arquitectura técnica de rutas en React Router v7 y sinergia en la conexión Mis Planes ↔ Editor.
- **Luis Caldera (H2, H5):** Fin en mente con el diseño espacial del mapa SVG y comprensión empática del usuario docente.
- **Zoe Peñata (H3):** Primero lo primero priorizando los 5 niveles exigidos por MODESEC.
- **María Soto (H2, H4):** Fin en mente y beneficio ganar-ganar asegurando acceso a planes en $\le 2$ clics.
- **María Ubarne (H6, H7):** Sinergia con DUA/plantillas y mejora continua de la consistencia del árbol de interfaces.
- **Maira Ortega (H5):** Comprensión empática de docentes con baja competencia digital, asegurando controles canónicos universales (Regresar, Inicio, Ayuda, Cerrar).
