# Registro de Uso de IA — ACT-011 (Elaboración del Guion Didáctico)

**Marco de Referencia:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida)  
**Actividad:** ACTIVIDAD 9 (ACT-011) — Elaboración del Guion Didáctico  
**Fecha:** 18 de Octubre de 2026 (Semana 10)  
**Proyecto:** INSPIRATEC (Plataforma Web PlanClase)  
**Estado:** VALIDADO Y CONSOLIDADO  

---

## 1. R — Rol de la IA
Especialista Senior en Diseño Instruccional, Informática Educativa, Metodología MODESEC y Pedagogía Curricular Colombiana (Guía 30 MEN, DUA, PIAR y Taxonomías de Aprendizaje), con dominio de la arquitectura de Sistemas Tutores Inteligentes y ergonomía cognitiva de software educativo.

---

## 2. O — Objetivo
Elaborar el **Guion Didáctico integral de INSPIRATEC**, fundamentado en la realidad operativa del software y su propósito educativo, desarrollando rigurosamente los 10 apartados obligatorios (Título, Sinopsis, Finalidad, Objetivos didácticos, Contextos valorativos, Población objetivo, Rango de edades, Características psicológicas, Nivel académico y Unidad temática), respondiendo explícitamente a la pregunta central formativa y diferenciando capacidades existentes de propuestas futuras sin inventar funcionalidades inexistentes.

---

## 3. C — Contexto
En el marco de la asignatura Diseño y Desarrollo de Software Educativo III (Universidad de Córdoba), el equipo del Grupo 2 requiere formalizar la Actividad 9 (ACT-011) correspondiente al Guion Didáctico bajo la metodología MODESEC (Fase II — Diseño Educativo). Era imperativo no limitarse a completar un formato genérico o superficial, sino realizar una auditoría profunda de la base de código real (`src/pages`, `src/services/aiService.js`, `src/services/materials/`, `src/components/`, `src/store/`) para sustentar cada apartado con evidencias de funcionamiento comprobable.

---

## 4. A — Acción (Prompt Principal Utilizado)
> "Actúa como un Especialista Senior en Diseño Instruccional y Software Educativo. Analiza integralmente todo el proyecto INSPIRATEC, incluyendo su documentación, objetivos, funcionalidades implementadas y propuestas, flujos de interacción, componentes, población destinataria y propósito general.
> A partir de este análisis, elabora el guion didáctico completo, fundamentado en el funcionamiento real y en la finalidad educativa del proyecto.
> Desarrolla con máximo rigor académico los 10 apartados mínimos exigidos:
> 1. Título
> 2. Sinopsis de la temática
> 3. Finalidad educativa
> 4. Objetivos didácticos (concretos, observables y coherentes)
> 5. Contextos valorativos
> 6. Características de la población objetivo
> 7. Rango de edades justificado
> 8. Características psicológicas (cognitivas, motivacionales y de autonomía)
> 9. Nivel académico
> 10. Unidad temática en módulos secuenciales
> Responde de forma transversal: ¿Qué aprenderá el usuario mediante este software, cómo lo aprenderá y qué evidencias permitirán reconocer ese aprendizaje?
> Distingue con honestidad científica las capacidades técnicas existentes de las propuestas futuras. Guarda el entregable en docs/pedagogia/GUION_DIDACTICO.md y GUION_DIDACTICO.md."

---

## 5. S — Salida y Validación Humana

### 5.1. Salida de la IA:
- Generación de [`docs/pedagogia/GUION_DIDACTICO.md`](../pedagogia/GUION_DIDACTICO.md) con 13 secciones profundas, estructuración de la unidad temática en 5 módulos, 7 objetivos didácticos observables y matriz comparativa de capacidades existentes vs. futuras.
- Generación del resumen ejecutivo [`GUION_DIDACTICO.md`](../../GUION_DIDACTICO.md) en la raíz del repositorio.
- Elaboración de la ficha oficial de actividad en `docs/actividades/ACT-011_GUION_DIDACTICO.md`.
- Mapeo de la aplicación de los 7 hábitos de Stephen Covey para los 6 integrantes en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md`.

### 5.2. Validación Humana Colegiada:
- **María Soto (Product Owner) y María Ubarne (Product Owner Support):** Revisaron y validaron la correspondencia de los objetivos didácticos con las competencias de la Guía 30 del MEN y la pertinencia de las justificaciones psicológicas (Carga cognitiva de Sweller y teoría de autodeterminación de Deci & Ryan), confirmando que reflejan exactamente la necesidad docente de aula.
- **Daniel Tapias (Git Lead) y Luis Caldera (UI/UX Lead):** Verificaron que todas las funciones referenciadas (Wizard de 4 pasos, editor interactivo, generador de quizzes, flashcards, diapositivas y soporte DUA) corresponden a archivos y componentes reales del repositorio.
- **Zoe Peñata (Scrum Master) y Maira Ortega (Facilitadora):** Validaron la coherencia cronológica, la distribución de los 7 hábitos y la sincronización en las matrices de monitoreo y bitácoras de campo.
