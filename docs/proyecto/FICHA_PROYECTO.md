# Ficha General del Proyecto — INSPIRATEC

| Campo | Información |
|---|---|
| Nombre del proyecto | INSPIRATEC (Docente PRO / Generador de Planes de Clase) |
| Grupo | G2 |
| Asignatura | Diseño y Desarrollo de Software Educativo III |
| Docente | Raúl Toscano |
| Universidad | Universidad de Córdoba |
| Metodología de gestión | Scrum |
| Metodología de diseño educativo | MODESEC (Marco orientador pedagógico) |
| Duración estimada | 15 semanas |
| Fecha de inicio | 17 de agosto de 2026 |
| Repositorio | Privado (GitHub: `DanielTapias12/planclase`) |
| Estado actual | Versión avanzada adoptada y funcional / En proceso de documentación y validación |

---

## 1. Descripción General

**INSPIRATEC** es una plataforma web de software educativo diseñada para acompañar y empoderar a los docentes (con énfasis en el área de Tecnología e Informática en Colombia) en la planificación, estructuración, generación y gestión de secuencias didácticas completas y contextualizadas.

El sistema integra:
- Inteligencia Artificial Generativa guiada por plantillas taxonómicas estructuradas.
- Lineamientos curriculares oficiales de las **Orientaciones Pedagógicas de la Guía 30 del MEN**.
- Principios de inclusión y accesibilidad mediante el **Diseño Universal para el Aprendizaje (DUA)** y adaptaciones individuales **PIAR**.
- Instrumentos de evaluación formativa (rúbricas analíticas, cuestionarios interactivos, sopas de letras algorítmicas, diapositivas con mapas conceptuales).
- Sistematización de **Experiencias Significativas** bajo enfoques de Investigación-Acción e investigación basada en diseño (DSRM).
- Soporte para formatos institucionales de colegios (PEI).

---

## 2. Evolución del Proyecto y Decisión de Transición

Durante el proceso académico y tras la finalización de las actividades iniciales de la Semana 1, el equipo realizó una evaluación técnica y pedagógica conjunta. Después de recibir orientaciones y retroalimentación del docente de la asignatura, se analizaron alternativas para robustecer el alcance de la solución y se tomó la decisión unánime de adoptar una **versión más avanzada, interactiva y reestructurada del sistema**.

* **Versión Inicial (Semana 1):** Representó la etapa exploratoria y de diseño preliminar (arquitectura separada NestJS/Vite y diseño del Diagrama de Contenidos ACT-001). Sus evidencias y registros se conservan como antecedentes históricos de trazabilidad.
* **Nueva Versión (Semana 2 en adelante):** Plataforma modular consolidada en TypeScript con Express 5, Firebase Auth, Cloud Firestore, motor de generación documental (PDFMake/DOCX) e integración con Google Gemini AI.

---

## 3. Trazabilidad del Proyecto

El ciclo de desarrollo y seguimiento mantiene la siguiente cadena de valor:

```
Objetivo → Actividad → Responsable → Acción → Artefacto → Evidencia → Evaluación → Retroalimentación → Mejora → Próximo compromiso
```

---

## 4. Estado de los Componentes Técnicos

| Componente | Estado Verificado | Descripción |
|---|---|---|
| **Asistente Wizard (4 Pasos)** | Funcional | Datos básicos, Metodología, Estándares MEN, Inclusión DUA |
| **Generador de Planes (IA)** | Funcional | Generación curricular estructurada en HTML y Markdown |
| **Generador de Rúbricas** | Funcional | Rúbricas analíticas con escala de desempeño colombiana |
| **Diapositivas Didácticas** | Funcional | Diapositivas interactivas con notas y gráficos D3.js |
| **Zona Gamificada** | Funcional | Cuestionarios tipo trivia y generador Canvas de sopa de letras |
| **Experiencias Significativas** | Funcional | Sistematización IAP / DSRM con generación de informes técnicos |
| **Plantillas PEI** | Funcional | Mapeo y adaptación a formatos institucionales |
| **Exportador Documental** | Funcional | Descarga directa en PDF corporativo y Word (.docx) |
| **Persistencia y Auth** | Funcional | Firebase Authentication y Cloud Firestore con reglas de seguridad |
