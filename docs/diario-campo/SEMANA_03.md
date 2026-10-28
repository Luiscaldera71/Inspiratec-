# DIARIO DE CAMPO — SEMANA 3
> **Consolidación formal basada en las Guías de Aprendizaje y el Marco MODESEC.**

## 1. Contexto de la Semana
Durante la Semana 3 se abordó el diseño conceptual y multimedial del software educativo **INSPIRATEC**, enfocado en dos pilares fundamentales:
1. El **Diagrama de Contenidos** (ACT-001).
2. El **Mapa de Navegación** (ACT-006) fundamentado en MODESEC y los principios de Interacción Humano-Computador (HCI).

---

## 2. Desarrollo de Actividades Verificables

### 2.1. Diagrama de Contenidos (ACT-001)
- Se modeló la estructura de contenidos jerárquica y pedagógica de la plataforma.
- Evidencias gráficas (SVG, PNG, MD) consolidadas en `docs/evidencias/diagramas/`.

### 2.2. Diseño del Mapa de Navegación (ACT-006)
- **Fundamentación MODESEC:** Se estructuró la navegación en la secuencia de 5 niveles:
  $$\text{Pantalla Inicial} \longrightarrow \text{Módulos Principales} \longrightarrow \text{Pantallas Secundarias} \longrightarrow \text{Actividades} \longrightarrow \text{Resultados}$$
- **Controles Canónicos Ubicuos:** Se incorporaron en toda la arquitectura los controles de **Regresar** (con `Breadcrumbs` interactivo y sincronización de historial), **Inicio** (Sidebar / Header), **Ayuda** (FAQ y Tour interactivo) y **Cerrar/Cancelar** (tecla `Escape`, botón `✕` y cancelaciones de diálogo).
- **Auditoría de la Regla de las 3 Interacciones:** Se construyó la matriz empírica de accesibilidad que demuestra que cualquier recurso formativo (Plan de aula, OVA, rúbrica, cuestionario, plantilla) es accesible en un máximo de 2 clics desde la pantalla inicial, cumpliendo con creces el límite de 3 establecido por la guía.
- **Artefactos generados:**
  - `docs/diseno-multimedial/MAPA_NAVEGACION.md` (Documentación completa)
  - `docs/evidencias/ACT-006/MAPA_NAVEGACION.png` (Esquema gráfico oficial en alta fidelidad)
  - `docs/actividades/ACT-006_MAPA_NAVEGACION.md` (Ficha de actividad actualizada)
  - `docs/evidencias/ACT-006/README.md` (Carpeta de evidencia y trazabilidad)

---

## 3. Integración de Inteligencia Artificial
- Se utilizó **Antigravity / Gemini 3.1 Pro** como asistente técnico para la auditoría de rutas en React Router DOM v7, la verificación matricial de clics y la codificación vectorial del archivo SVG de navegación.
- Registro detallado disponible en [`docs/ia/REGISTRO_IA_ACT-006.md`](../ia/REGISTRO_IA_ACT-006.md).

---

## 4. Participación Verificada y Aplicación de los 7 Hábitos (Covey)
- **Daniel Tapias (H1: Proactividad, H6: Sinergia):** Análisis técnico de rutas en React (`App.jsx`), estructuración de los 5 niveles MODESEC y codificación del SVG. *(Verificado)*.
- **Luis Caldera (H2: Fin en Mente, H5: Primero Comprender):** Auditoría de flujos de usuario, diseño espacial del mapa y verificación de la regla de $\le 3$ clics. *(Verificado)*.
- **Zoe Peñata (H3: Primero lo Primero):** Priorización estricta de los 5 niveles exigidos por la Guía de Semana 03 y control de entregables. *(Reportado)*.
- **María Soto (H2: Fin en Mente, H4: Ganar-Ganar):** Validación de accesibilidad inmediata a Biblioteca y Mis Planes en $\le 2$ clics. *(Reportado)*.
- **María Ubarne (H6: Sinergia, H7: Afilar la Sierra):** Integración transversal de DUA, plantillas PEI y revisión de consistencia del flujo. *(Reportado)*.
- **Maira Ortega (H5: Primero Comprender):** Revisión de la experiencia visual y ergonómica desde la perspectiva del docente de aula. *(Reportado)*.

---

## 5. Problemas y Decisiones
- **Decisión Arquitectónica:** Se migró formalmente la representación de un modelo SPA estático antiguo (`ui.ts`) hacia la arquitectura real basada en **React Router DOM v7**, permitiendo el uso del botón nativo "Atrás" del navegador y migas de pan (`Breadcrumbs`), eliminando callejones sin salida para el docente.
- **Decisión Metodológica:** Los pasos del asistente de planeación (Paso 1 a 4) se modelaron como actividades internas del módulo principal Planificador (`/`), evitando saturar el mapa con ventanas artificiales y respetando la lógica de componentes de React.
