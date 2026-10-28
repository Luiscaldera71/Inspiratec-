# Diario de Campo — Avance del Frontend y Diagrama de Contenidos

## Información General

* **Periodo:** 17 al 21 de agosto de 2026 / Ciclo de consolidación y mejora
* **Semana / Sprint:** Semana 1 del nuevo proceso de actualización / Sprint 1
* **Proyecto:** PlanClase (INSPIRATEC)
* **Grupo:** Grupo 2
* **Asignatura:** Diseño y Desarrollo de Software Educativo III
* **Docente Asesor:** Raúl Toscano

---

## 1. Contexto

Durante esta sesión de trabajo, el equipo concentró sus esfuerzos en dos objetivos prioritarios: optimizar la experiencia de usuario y presentación visual del frontend, y diseñar formalmente el nuevo **Diagrama de Contenidos** estructurado a partir de la arquitectura real de **PlanClase (INSPIRATEC)**.

Tras haber adoptado la versión más avanzada del software, era imperativo que la arquitectura de información y la documentación gráfica correspondieran con exactitud a los módulos, componentes pedagógicos y flujos didácticos implementados en el sistema, asegurando coherencia con los lineamientos de la **Guía 30 del MEN** y las directrices **DUA**.

---

## 2. Desarrollo Cronológico

1. **Análisis exhaustivo del frontend:** El equipo revisó colectivamente las pantallas del planificador curricular, detectando que los selectores de formato institucional y nivel educativo presentaban sobreposición entre los iconos de adorno y el texto de las opciones. Asimismo, se constató la necesidad de mejorar el espaciado vertical entre tarjetas de configuración para evitar sobrecargas visuales.
2. **Discusión grupal sobre el diseño:** Se acordaron modificaciones visuales específicas: ajustar la separación a `2rem`, incrementar el padding interior de los selectores a `3rem` e incorporar el avatar del "Profe Guía" con un widget flotante amigable para orientar al docente.
3. **Análisis de la estructura de contenidos:** A partir de las orientaciones del docente Raúl Toscano, el grupo analizó los componentes del sistema, agrupándolos en 7 dimensiones esenciales: Planificación, Actividades, Recursos, Inclusión, Evidencias, Gestión y Ayuda.
4. **Construcción y modelado del nuevo Diagrama de Contenidos:** Con base en el debate interno, se construyó el mapa mental formalizando cada una de las 7 ramas con sus submódulos específicos. Se generó su representación en Mermaid (`mindmap` y `flowchart TD`), su renderizado vectorial en SVG y su captura gráfica de alta resolución en PNG.
5. **Revisión y validación colectiva:** Todo el equipo inspeccionó los artefactos gráficos y documentales, verificando que la representación conceptual coincide al 100% con las funcionalidades activas del software.

---

## 3. Observaciones

- **Participación Colectiva:** Existió un ambiente de debate riguroso y constructivo donde los 6 integrantes aportaron desde sus perspectivas pedagógicas y técnicas.
- **Hallazgos Visuales:** La mejora de dimensiones y espaciados en el frontend redujo significativamente la fatiga visual al interactuar con el formulario de planificación.
- **Trazabilidad Preservada:** El diagrama anterior de la Semana 1 permanece archivado como antecedente exploratorio histórico, sin interferir con el nuevo mapa conceptual del sistema actual.

---

## 4. Trabajo Colaborativo

Todos los integrantes del equipo participaron activamente en el proceso. La participación colectiva se articuló de la siguiente forma:

* **Participación Grupal (Análisis, Diseño, Discusión y Validación):**
  - *Zoe Peñata:* Coordinación de la sesión, facilitación de consensos y seguimiento a los compromisos de entrega.
  - *María Soto y María Ubarne:* Validación de la coherencia didáctica de los 7 módulos del diagrama frente a las necesidades reales de los maestros y directrices MEN/DUA.
  - *Maira Ortega:* Revisión de calidad del producto documental y apoyo en la organización de minutas y acuerdos.
  - *Luis Caldera y Daniel Tapias:* Análisis de usabilidad y estructuración de la jerarquía visual.
* **Desarrollo Técnico Verificable (Código y Artefactos):**
  - *Luis Caldera y Daniel Tapias:* Implementación de reglas CSS en `src/index.css`, lógica de apertura del modal de bienvenida en `src/ui.ts` y actualización de créditos en `index.html`.
  - *Daniel Tapias:* Generación y estandarización del código Mermaid, vectorización SVG y control de versiones en GitHub.

> *"El avance fue desarrollado mediante un proceso colaborativo en el que todos los integrantes participaron en diferentes niveles de análisis, revisión, discusión, validación y mejora del frontend. Las contribuciones técnicas específicas se registran únicamente cuando existe evidencia verificable."*

---

## 5. Uso de Inteligencia Artificial

* **Herramientas utilizadas:** GPT y asistente de desarrollo Antigravity.
* **Propósito:** Apoyo instrumental en la sintaxis de diagramación Mermaid, cálculo de coordenadas vectoriales en SVG y refinamiento de la redacción documental.

### Análisis ROCAS de la Actividad
* **R — Rol:** Asistente de Arquitectura de Información y Documentación Técnica.
* **O — Objetivo:** Estructurar el código Mermaid y el archivo vectorial SVG correspondiente al mapa mental de 7 módulos de PlanClase.
* **C — Contexto:** Proyecto PlanClase (INSPIRATEC), asignatura Diseño y Desarrollo de Software Educativo III, Universidad de Córdoba, Grupo 2.
* **A — Acción:** Modelar jerárquicamente las 7 ramas (Planificación, Actividades, Recursos, Inclusión, Evidencias, Gestión, Ayuda) y generar especificaciones compatibles con GitHub.
* **S — Salida:** Código Mermaid en `diagrama-contenidos.mmd` y estructura en `DIAGRAMA_DE_CONTENIDOS.md`.

* **Evaluación y Validación Humana:** El equipo contrastó la salida con el código real y el mapa mental gráfico, ajustando denominaciones para asegurar estricta concordancia con la terminología pedagógica colombiana. Ningún resultado fue aceptado automáticamente.

---

## 6. Problemas o Bloqueos

* **Técnico:** Superposición de iconos con texto en los elementos select del formulario de inicio.  
  * *Acción tomada:* Aplicación de `padding-left: 3rem !important; height: 48px;` en `src/index.css`.
* **Pedagógico:** Delimitar con claridad qué partes del diagrama de contenidos corresponden a funciones implementadas versus funciones en diseño formativo.  
  * *Acción tomada:* Clasificación explícita de los 11 componentes de MODESEC en implementados, en diseño y pendientes.
* **Organizacional:** Sin bloqueos verificables reportados.
* **Comunicación:** Sin bloqueos verificables reportados.
* **Documentación:** Necesidad de soportar visualizaciones Mermaid tanto en GitHub como en editores externos.  
  * *Acción tomada:* Inclusión dual de `mindmap` y `flowchart TD`.
* **Herramientas:** Sin bloqueos verificables reportados.

---

## 7. Decisiones Tomadas

| Decisión | Justificación | Responsables | Consecuencia Esperada |
|---|---|---|---|
| **Adoptar el nuevo Diagrama de Contenidos de 7 módulos** | Refleja fielmente la arquitectura modular de la nueva versión del software. | Todo el equipo | Coherencia entre diseño conceptual y código fuente. |
| **Optimizar espaciados e iconografía del frontend** | Evitar superposiciones visuales y mejorar la experiencia de usuario del docente. | Luis Caldera y Daniel Tapias | Interfaz más clara, accesible y profesional. |
| **Archivar ACT-001 y abrir formalmente ACT-002** | Garantizar trazabilidad histórica y documentar con rigor la nueva etapa de trabajo. | Todo el equipo | Auditoría académica clara y transparente. |

---

## 8. Reflexión del Proceso

* **Qué funcionó:** El trabajo colaborativo y la discusión abierta permitieron detectar fallas sutiles de interfaz y clarificar la jerarquía de los contenidos educativos antes de su documentación definitiva.
* **Qué debe mejorarse:** Continuar fortaleciendo la recolección temprana de evidencias visuales durante las fases de diseño.
* **Aprendizaje del equipo:** Un buen diagrama de contenidos no solo organiza el software, sino que modela pedagógicamente el pensamiento del docente al momento de planear secuencias inclusivas.

---

## 9. Próximos Compromisos

| Compromiso | Responsable | Fecha Límite | Prioridad | Estado |
|---|---|---|---|---|
| Publicar el nuevo diagrama y avances en el repositorio GitHub (`main`) | Luis Caldera y Daniel Tapias | Inmediata | Alta | En proceso |
| Validación pedagógica de las rúbricas y actividades con docentes | María Soto y María Ubarne | Por definir | Alta | Pendiente |
| Preparación del guion de socialización del nuevo diagrama | Zoe Peñata y Maira Ortega | Por definir | Media | Pendiente |
