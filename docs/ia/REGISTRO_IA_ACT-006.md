# Registro de IA — ACT-006

## 1. Identificación
- **Actividad:** ACT-006 — Diseñar el Mapa de Navegación
- **Herramienta:** Antigravity / Gemini 3.1 Pro
- **Fecha:** Octubre de 2026
- **Semana de la Guía:** Semana 03
- **Fase:** Diseño Multimedial / MODESEC

---

## 2. Metodología ROCAS

### R — Rol
Arquitecto de Software Educativo, Diseñador de Interacción Humano-Computador (HCI) y Especialista en Metodología MODESEC.

### O — Objetivo
Analizar, rediseñar y consolidar el mapa de navegación de INSPIRATEC conforme a la Guía de la Semana 03 y MODESEC, garantizando la estructura jerárquica de 5 niveles (Pantalla inicial $\to$ Módulos principales $\to$ Pantallas secundarias $\to$ Actividades $\to$ Resultados), la integración de controles universales (Regresar, Inicio, Ayuda, Cerrar/Cancelar) y la validación matemática de la regla de máximo 3 interacciones para el acceso al contenido formativo.

### C — Contexto
El software educativo INSPIRATEC está desarrollado en **React 19 + React Router DOM v7**, contando con enrutamiento declarativo estructurado en 15 interfaces canónicas (`/auth`, `/home`, `/`, `/editor`, `/mis-planes`, `/adn-pedagogico`, `/plantillas`, `/biblioteca`, `/experiencias`, `/foro`, `/soporte`, `/ayuda`, `/acerca`, `/config`, `/administracion`), módulos de inducción narrativa y diagnóstica (Bienvenida en 11 escenas y Modal de Calibración Docente Día 0) y un panel administrativo de diagnóstico y salud de plataforma (sin directrices impuestas).

### A — Acción
1. Auditoría exhaustiva de la topología de rutas en el código fuente (`src/App.jsx`, `src/pages/`, `src/components/common/Breadcrumbs.jsx`, `src/components/layout/Sidebar.jsx`).
2. Consolidación y generación del esquema visual oficial en alta fidelidad [`MAPA_NAVEGACION.png`](../evidencias/ACT-006/MAPA_NAVEGACION.png), articulando la jerarquía de niveles, flujos hacia abajo y controles canónicos.
3. Actualización técnica y metodológica del documento [`MAPA_NAVEGACION.md`](../diseno-multimedial/MAPA_NAVEGACION.md) con la matriz de interfaces y diagramas oficiales.
4. Elaboración de la matriz de verificación empírica de accesibilidad ($\le 3$ clics, promedio 1.7 clics).
5. Formalización de la ficha de actividad, evidencias y trazabilidad bajo los 7 hábitos de Covey.

### S — Salida
- `docs/diseno-multimedial/MAPA_NAVEGACION.md`
- `docs/evidencias/ACT-006/MAPA_NAVEGACION.png`
- `docs/actividades/ACT-006_MAPA_NAVEGACION.md`
- `docs/evidencias/ACT-006/README.md`
- `docs/diario-campo/SEMANA_03.md`
- `docs/ia/REGISTRO_IA_ACT-006.md`

---

## 3. Validación Humana
El equipo de desarrollo procedió a:
1. Cotejar el árbol de rutas del SVG contra las rutas reales declaradas en `src/App.jsx`, verificando que no existieran rutas huérfanas ni nombres discrepantes.
2. Comprobar manualmente en el navegador web local que desde la pantalla `/home` o `/` el acceso a cualquier recurso formativo en `/biblioteca`, `/mis-planes` o `/editor` no supera los 2 clics.
3. Verificar que las teclas de escape, los botones `✕`, el botón `Volver a Mis Planes` y las migas de pan (`Breadcrumbs`) respondan de forma consistente en el entorno desktop, tablet y móvil.

---

## 4. Modificaciones Humanas
- **Descartado / Corregido:** Se eliminó la afirmación previa de que el sistema no soportaba History API; se documentó la integración plena con el historial del navegador mediante `useNavigate`.
- **Adaptado:** Se categorizaron las herramientas didácticas (OVA, Rúbricas, Quizzes) en el Nivel 4 (Actividades) y sus productos en el Nivel 5 (Resultados), alineando la terminología exactamente a la Guía de Semana 03.

---

## 5. Articulación con los 7 Hábitos de Stephen Covey
La formulación del prompt y la auditoría asistida por IA reflejan operativamente:
- **H1 (Proactividad) y H6 (Sinergia):** Daniel Tapias y Luis Caldera unificaron la topología técnica y el diseño SVG.
- **H2 (Fin en Mente) y H3 (Primero lo Primero):** Zoe Peñata y María Soto guiaron la estructuración estricta en los 5 niveles exigidos por MODESEC antes de cualquier detalle accesorio.
- **H4 (Ganar-Ganar) y H5 (Primero Comprender):** Maira Ortega y María Ubarne validaron que el acceso a contenidos formativos en $\le 2$ clics maximice la facilidad de uso para el docente y la efectividad del software.

