# Registro de Uso de IA — ACT-012 (Diseño de la Guía de Metáforas)

**Marco de Referencia:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida)  
**Actividad:** ACTIVIDAD 10 (ACT-012) — Diseño de la Guía de Metáforas  
**Fecha:** 18 de Octubre de 2026 (Semana 10)  
**Proyecto:** INSPIRATEC (Plataforma Web PlanClase)  
**Estado:** VALIDADO Y CONSOLIDADO  

---

## 1. R — Rol de la IA
Especialista Senior en Diseño de Interfaces de Usuario (UI/UX), Ergonomía Cognitiva, Metodología MODESEC (Fase II: Diseño Multimedial) y Semiótica de Software Educativo, con dominio de la arquitectura de componentes React 19 y bibliotecas de iconografía vectorial (`lucide-react`).

---

## 2. O — Objetivo
Elaborar la **Guía de Metáforas institucional** de INSPIRATEC a partir de una auditoría integral del software existente, identificando los 30 elementos gráficos reales implementados en el código fuente, documentando fielmente su apariencia visual y su función operativa en la tabla institucional de tres columnas (Nombre, Imagen, Descripción), y fundamentando la metáfora instrumental implícita («El Taller de Co-Creación del Arquitecto Curricular») sin inventar elementos ficticios ni reinterpretar libremente los iconos.

---

## 3. C — Contexto
En el marco de la asignatura Diseño y Desarrollo de Software Educativo III (Universidad de Córdoba), el equipo del Grupo 2 requiere formalizar la Actividad 10 (ACT-012) correspondiente al componente 5 de la Fase II de MODESEC. La instrucción exige explícitamente fidelidad absoluta a los elementos gráficos que ya existen en el proyecto (rechazando ilustraciones generadas por IA que desvirtúen los iconos reales del software) y demanda preservar la estructura de la tabla de referencia institucional.

---

## 4. A — Acción (Prompt Principal Utilizado)
> "Actúa como un Especialista Senior en UI/UX y Diseño Multimedial MODESEC. Analiza integralmente el código fuente de INSPIRATEC (src/App.jsx, src/pages/, src/components/, src/styles/ui.css, node_modules/lucide-react).
> Elabora la Guía de Metáforas oficial siguiendo estrictamente el formato institucional:
> 1. Tabla principal de tres columnas: Nombre, Imagen y Descripción.
> 2. Representación visual fiel: extrae y referencia directamente los recursos vectoriales SVG reales del software (33 iconos de lucide-react y gráficos de soporte).
> 3. Documenta para cada elemento su función operativa real y significado dentro de la interfaz.
> 4. Sección de Justificación de la Metáfora distinguiendo con rigor científico: Metáfora visual, Representación visual y Función operativa.
> 5. Sustenta la metáfora instrumental del «Taller de Co-Creación del Arquitecto Curricular». No inventes funcionalidades ni sustituyas los iconos por dibujos artísticos tridimensionales o decorativos.
> Guarda el entregable en docs/diseno-multimedial/GUIA_DE_METAFORAS.md y GUIA_DE_METAFORAS.md."

---

## 5. S — Salida y Validación Humana

### 5.1. Salida de la IA:
- Creación de [`docs/diseno-multimedial/GUIA_DE_METAFORAS.md`](../diseno-multimedial/GUIA_DE_METAFORAS.md) con la tabla estructurada de 30 elementos reales clasificados por zonas funcionales, imágenes incrustadas de los SVGs originales y la justificación teórica tripartita.
- Creación del resumen ejecutivo [`GUIA_DE_METAFORAS.md`](../../GUIA_DE_METAFORAS.md) en la raíz del repositorio.
- Extracción y almacenamiento de 33 iconos SVG puros en `docs/diseno-multimedial/iconos/*.svg` directamente desde `node_modules/lucide-react`.
- Elaboración de la ficha técnica oficial en `docs/actividades/ACT-012_GUIA_DE_METAFORAS.md`.
- Mapeo de la aplicación de los 7 hábitos de Stephen Covey para los 6 integrantes en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`.

### 5.2. Validación Humana Colegiada:
- **Luis Caldera (UI/UX Lead) y Daniel Tapias (Git Lead):** Contrastaron cada fila de la tabla contra la interfaz real del software en el navegador y el código JSX, validando que los 30 elementos tienen correspondencia 1:1 con componentes activos y que los SVGs reproducen fielmente los trazos, proporciones y estilo Glassmorphism 2026.
- **María Soto (Product Owner) y María Ubarne (Product Owner Support):** Validaron que la metáfora del Arquitecto Curricular representa legítimamente el quehacer docente constructivista y que las descripciones de los controles DUA/PIAR reflejan los principios de diseño universal.
- **Zoe Peñata (Scrum Master) y Maira Ortega (Facilitadora):** Verificaron la consistencia de los entregables con el cronograma y formatos institucionales de MODESEC.
