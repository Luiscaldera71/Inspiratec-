# ACT-002 — Desarrollo colaborativo y mejora del Frontend y Diagrama de Contenidos

## Información General

* **ID:** ACT-002
* **Nombre Definitivo:** Desarrollo colaborativo y mejora del Frontend y Diagrama de Contenidos
* **Fecha:** Septiembre de 2026
* **Semana / Sprint:** Semana 1 del nuevo proceso de actualización / Sprint 1
* **Duración:** Duración pendiente de confirmación
* **Estado:** **Completada** (Mejoras visuales implementadas, Diagrama de Contenidos consolidado y artefactos publicados)

---

## Objetivo

Registrar el proceso de desarrollo, revisión, mejora, reestructuración del frontend y diseño del nuevo Diagrama de Contenidos de la versión actual de **PlanClase (INSPIRATEC)**, realizado mediante el trabajo colaborativo de todo el equipo y fundamentado en el marco pedagógico de la Guía 30 del MEN y las pautas DUA.

---

## Descripción

El equipo llevó a cabo un ciclo de trabajo colaborativo enfocado en dos frentes simultáneos:
1. **Perfeccionamiento y optimización de la interfaz de usuario (Frontend):** Resolución de solapamientos en selectores, corrección de espaciados entre tarjetas de configuración curricular, integración del widget interactivo "Profe Guía" y actualización formal de la tarjeta de autoría y créditos del Grupo 2.
2. **Modelado y formalización del nuevo Diagrama de Contenidos:** A partir de la arquitectura real del software, se conceptualizó, estructuró y vectorizó el mapa conceptual del sistema en sus 7 dimensiones clave (Planificación, Actividades, Recursos, Inclusión, Evidencias, Gestión y Ayuda).

---

## Participantes

* **Zoe Peñata** (Scrum Master)
* **Luis Caldera** (Development Team / Desarrollador Frontend)
* **Daniel Tapias** (Development Team / Desarrollador)
* **Maira Ortega** (Scrum Master Support / Facilitadora del equipo)
* **María Soto** (Product Owner)
* **María Ubarne** (Product Owner Support / Apoyo al Product Owner)

---

## Trabajo Realizado

El avance fue desarrollado mediante un proceso colaborativo en el que todos los integrantes participaron en diferentes niveles de análisis, revisión, discusión, validación y mejora del frontend y del Diagrama de Contenidos. Las contribuciones técnicas específicas se registran únicamente cuando existe evidencia verificable.

1. **Análisis del frontend existente:** Identificación de solapamientos visuales en las opciones de selección de formato de plan (`#template-select`) y nivel educativo (`#nivelEducativo`).
2. **Revisión colectiva de las interfaces:** Evaluación del flujo del asistente wizard y de la frecuencia de aparición de modales emergentes.
3. **Discusión grupal:** Acuerdos sobre la distribución visual, proporciones de espaciado (`margin-bottom: 2rem`) y jerarquía de navegación.
4. **Consideración de orientaciones docentes:** Aplicación de las pautas dadas por el docente Raúl Toscano sobre usabilidad docente y accesibilidad DUA.
5. **Implementación de mejoras verificables:** Codificación de directivas CSS, lógica de modal único en `src/ui.ts` y actualización de créditos en `index.html`.
6. **Construcción del nuevo Diagrama de Contenidos:** Diseño conceptual y generación de artefactos visuales (PNG, SVG, Mermaid y Markdown).

---

## Trabajo Colaborativo

Todos los integrantes del Grupo 2 participaron activamente en:
- Revisión del frontend y análisis funcional de las pantallas.
- Discusión sobre la experiencia de usuario (UX) para los docentes.
- Evaluación de la estructura de contenidos y módulos pedagógicos.
- Debates sobre la pertinencia de las ramas del nuevo mapa conceptual.
- Validación grupal de las propuestas visuales y de diagramación.
- Toma colectiva de decisiones para la consolidación de entregables.

---

## Desarrollo Técnico Verificable

### Información Reportada por el Equipo
- Reuniones de socialización para debatir la pertinencia pedagógica de los componentes del aula.
- Discusiones sobre la articulación curricular con los 4 componentes de Tecnología e Informática del MEN.
- Validación de que los 7 módulos del diagrama reflejen fielmente el flujo de trabajo real del docente.

### Información Verificada en el Repositorio (Código y Commits)
- **Frontend y Estilos (`src/index.css`):**
  - Ajuste de espaciado en `.teacher-input-card` (`margin-bottom: 2rem !important;`).
  - Corrección de padding en `.input-with-adornment select` (`padding-left: 3rem !important; height: 48px;`) evitando sobreposición de iconos con el texto.
  - Estilos dedicados para `.teacher-guide-widget` y avatar redondo del Profe Guía.
- **Lógica de Interfaz (`src/ui.ts` & `index.html`):**
  - Control de persistencia en `localStorage` (`inspiratec_welcome_modal_dismissed`) para evitar la reapertura automática invasiva del modal de bienvenida en cada recarga.
  - Vinculación del botón tutorial para abrir ordenadamente el modal de bienvenida y posteriormente el tour guiado de campos.
  - Actualización de la sección "Equipo del Proyecto" en `index.html` (líneas 1565–1605) con los 6 integrantes del Grupo 2 y sus roles Scrum.
- **Capa de Datos (`src/storage.ts`):**
  - Eliminación de declaraciones duplicadas de `handleFirestoreError`, resolución de casts de tipos y corrección de llamadas en Firebase Firestore.
- **Artefactos del Diagrama de Contenidos:**
  - Código fuente Mermaid en `docs/evidencias/diagramas/diagrama-contenidos.mmd`.
  - Archivo vectorial en `docs/evidencias/diagramas/diagrama-contenidos-actual.svg`.
  - Imagen de alta resolución en `docs/evidencias/diagramas/diagrama-contenidos-actual.png`.
  - Documento metodológico en `docs/diseno-multimedial/diagramas/DIAGRAMA_DE_CONTENIDOS.md` y `DIAGRAMA_DE_CONTENIDOS.md`.

---

## Producto Obtenido

1. **Frontend optimizado y accesible:** Formulario wizard con espaciados pulidos, sin elementos sobrepuestos, widget tutorial integrado y créditos oficiales del equipo.
2. **Nuevo Diagrama de Contenidos:** Estructura jerárquica completa de 7 ramas (Planificación, Actividades, Recursos, Inclusión, Evidencias, Gestión, Ayuda).
3. **Artefacto Mermaid (`diagrama-contenidos.mmd`):** Compatible con GitHub y Mermaid Live Editor.
4. **Artefacto Vectorial SVG (`diagrama-contenidos-actual.svg`):** Representación vectorial escalable de alta definición.
5. **Imagen Digital (`diagrama-contenidos-actual.png`):** Captura gráfica de alta resolución del mapa conceptual.

---

## Evidencias

### Documentales
- [DIAGRAMA_DE_CONTENIDOS.md](../../DIAGRAMA_DE_CONTENIDOS.md) en la raíz del proyecto.
- [docs/diseno-multimedial/diagramas/DIAGRAMA_DE_CONTENIDOS.md](../diseno-multimedial/diagramas/DIAGRAMA_DE_CONTENIDOS.md).
- [docs/metodologia/SCRUM_Y_MODESEC.md](../metodologia/SCRUM_Y_MODESEC.md).
- [docs/seguimiento/MONITOREO_SEMANAL.md](../seguimiento/MONITOREO_SEMANAL.md).
- [docs/diario-campo/SEMANA_01.md](../diario-campo/SEMANA_01.md).

### Técnicas
- Modificaciones en `src/index.css`, `src/ui.ts`, `src/storage.ts` e `index.html`.
- Archivo fuente `docs/evidencias/diagramas/diagrama-contenidos.mmd`.

### Visuales
- [diagrama-contenidos-actual.png](../evidencias/diagramas/diagrama-contenidos-actual.png) (Mapa mental oficial).
- [diagrama-contenidos-actual.svg](../evidencias/diagramas/diagrama-contenidos-actual.svg) (Vectorial escalable).

### Git
- Commit previo `9be4f51` (`feat: actualizar proyecto a nueva versión y registrar reestructuración académica`).
- Rama activa `main` en `https://github.com/DanielTapias12/planclase.git`.

---

## Dificultades Detectadas

* **Visual:** El selector de formato y de nivel educativo superponía el icono de adorno con el texto de las opciones seleccionadas; se solucionó incrementando el padding izquierdo a `3rem`.
* **Interacción:** El modal de bienvenida emergía repetitivamente en cada refresco de página; se resolvió condicionando su apertura con una clave en `localStorage`.

---

## Decisiones Tomadas

1. **Aprobar el nuevo Diagrama de Contenidos:** Consolidar formalmente el mapa de 7 módulos como la arquitectura de información oficial del proyecto.
2. **Priorizar la legibilidad y usabilidad del frontend:** Mantener espaciados generosos (`2rem`) entre secciones del planificador para reducir la carga cognitiva del docente.
3. **Documentar rigurosamente la participación:** Distinguir claramente entre el desarrollo técnico específico y el trabajo colaborativo de análisis y validación realizado por todo el equipo.

---

## Próximos Compromisos

| Compromiso | Responsable | Fecha Límite | Prioridad | Estado |
|---|---|---|---|---|
| Publicar la documentación del nuevo Diagrama de Contenidos en GitHub | Luis Caldera y Daniel Tapias | Inmediata | Alta | En proceso |
| Validación pedagógica del contenido curricular con docentes de prueba | María Soto y María Ubarne | Por definir | Alta | Pendiente |
| Socialización académica del diagrama y mejoras del frontend | Zoe Peñata y Maira Ortega | Por definir | Media | Pendiente |
