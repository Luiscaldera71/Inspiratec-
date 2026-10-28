# Registro de Uso de IA — ACT-018 (Lista de Chequeo Frontend Sistemas Tutores Inteligentes)

**Marco de Referencia:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida)  
**Actividad:** ACT-018 — Lista de Chequeo para la Verificación del Frontend: Sistemas Tutores Inteligentes (STI / ITS)  
**Fecha:** 16 de Octubre de 2026 (Semana 10)  

---

## 1. R — Rol de la IA
Experto Senior en Frontend, Especialista en Sistemas Tutores Inteligentes (STI / ITS), Ergonomía Cognitiva, Arquitecturas Pedagógicas Adaptativas y Metacognición Computacional, con dominio riguroso del metamodelo doctoral del Dr. Manuel Fernando Caro Piñeres (Universidad Nacional de Colombia, 2015).

## 2. O — Objetivo
Evaluar y auditar cómo la interfaz de usuario del frontend de INSPIRATEC refleja la arquitectura canónica de cuatro módulos (Dominio, Estudiante/Overlay, Tutor/Tácticas, Interfaz ergonómica), las 5 características de interfaz adaptativa donde se experimenta la tutoría inteligente y el soporte a la metacognición mediante la arquitectura de Doble Lazo de Razonamiento (*Double-Loop Architecture*), calificando con la escala formal (C: 2 pts, CP: 1 pt, NC: 0 pts, NA: N/A) sobre un total de 24 puntos (12 ítems).

## 3. C — Contexto
En el marco de la Semana 10 de la asignatura Informática Educativa / Diseño de Interfaces de Usuario, se exige contrastar la solución tecnológica desarrollada con la investigación doctoral de Caro Piñeres (2015). El equipo requiere comprobar que INSPIRATEC no es un simple envoltorio o formulario plano sobre un LLM, sino un auténtico Sistema Tutor Inteligente estructurado con mediación curricular basada en el MEN, andamiaje graduado en 3 niveles, bifurcación multimodal, replanificación instruccional en tiempo real y respeto a la agencia compartida (*Shared Agency*).

## 4. A — Acción (Prompt Principal Utilizado)
> "Toma el Rol de un experto en Frontend: Sistema Tutor Inteligentes: realiza la ACT-018: Lista de Chequeo para la Verificación del Frontend: Sistemas Tutores Inteligentes (STI / ITS), Instrumento de evaluación formativa sobre cómo la interfaz de usuario refleja la inteligencia del tutor y la metacognición, FUENTE BIBLIOGRÁFICA DE REFERENCIA EXIGIDA: Caro Piñeres, Manuel Fernando (2015). Metamodel for personalized adaptation of pedagogical strategies using metacognition in Intelligent Tutoring Systems. Tesis de Doctorado en Ingeniería, Universidad Nacional de Colombia, Sede Medellín. Director: Jovani Alberto Jiménez Builes, Ph.D."

## 5. S — Salida y Validación Humana
* **Salida de la IA:**
  * Documento formal de evaluación consolidado en `docs/actividades/ACT-018_LISTA_CHEQUEO_STI_CARO.md` con puntuación perfecta de **24 / 24 pts (100%) — Sobresaliente**.
  * Análisis pormenorizado de los 12 criterios organizados en los 3 bloques teóricos:
    - *Bloque 1 (4 módulos canónicos):* Dominio (referentes MEN), Estudiante (DUA/PIAR y modelo Overlay), Tutor (tácticas didácticas y temporalización) e Interfaz (Glassmorphism accesible y retroalimentación no punitiva).
    - *Bloque 2 (5 características de inteligencia del tutor):* Adaptación multimodal (prosa vs recursos interactivos 3D/quizzes/sopas de letras), navegación dual (secuencial vs global), andamiaje graduado en 3 niveles, resiliencia y curaduría con cascada de modelos Gemini y replanificación en caliente.
    - *Bloque 3 (metacognición computacional y FUNPRO):* Doble lazo de razonamiento (Nivel Objeto en editor vs Meta-Nivel en badges y autorregulación), juicios de certeza previa y posterior, y agencia compartida (*Shared Agency*) que preserva la soberanía del docente.
  * Consolidación de fortalezas demostradas, debilidades técnicas detectadas y compromisos de mejora.
* **Validación Humana:**
  * Daniel Tapias (Frontend Lead) y Luis Caldera (UI-UX Lead) verificaron que las evidencias referenciadas en `src/services/aiService.js`, `src/pages/WizardPage.jsx`, `src/pages/EditorPage.jsx` y `src/styles/ui.css` son plenamente funcionales y comprobables en la aplicación.
  * Maira Ortega y Zoe Peñata corroboraron la congruencia de los principios DUA y la mediación curricular con las directrices de Informática Educativa.
