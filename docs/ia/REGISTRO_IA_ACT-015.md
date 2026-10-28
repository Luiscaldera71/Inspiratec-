# Registro de Uso de IA — ACT-015 (Validar Usabilidad y Accesibilidad)

**Marco de Referencia:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida)  
**Actividad:** ACT-015 — Validar Usabilidad y Accesibilidad (DUA)  
**Fecha:** Octubre 2026  

---

## 1. R — Rol de la IA
Auditor Especialista en UX/UI, Heurísticas de Usabilidad y Accesibilidad Web (WCAG 2.1 AA y DUA).

## 2. O — Objetivo
Evaluar rigurosamente cada una de las pantallas desarrolladas en INSPIRATEC bajo tres dimensiones críticas: Control del Usuario (regresar, cancelar, navegación clara), Carga Cognitiva (densidad de información, memoria del usuario, metáforas de iconos) y Consistencia (paleta de colores, comportamiento de botones, tipografía homogénea).

## 3. C — Contexto
Tras el despliegue del rediseño visual Glassmorphism 2026 y la implementación de modales montados mediante `createPortal`, se requería una auditoría heurística integral pantalla por pantalla para asegurar que las transparencias esmeriladas mantuvieran legibilidad óptima, contraste accesible y navegación ergonómica para docentes.

## 4. A — Acción (Prompt Principal Utilizado)
> "Como auditor senior de usabilidad y accesibilidad web, audita exhaustivamente cada pantalla desarrollada en el proyecto INSPIRATEC (Wizard, Editor, Mis Planes, Plantillas, Biblioteca, Foro, Configuración IA, Administración, Ayuda, Acerca de, Autenticación y Sistema de Modales). Para cada pantalla evalúa y califica detalladamente: 1) Control del usuario (¿Puede regresar?, ¿Puede cancelar?, ¿La navegación es clara?), 2) Carga cognitiva (¿Pantalla con demasiada información?, ¿El usuario debe recordar cosas innecesariamente?, ¿Los iconos ayudan a reconocer funciones?), y 3) Consistencia (¿Se utilizan los mismos colores?, ¿Los botones funcionan igual?, ¿La tipografía es coherente?). Incluye justificación técnica basada en el código real JSX/CSS y pautas DUA/WCAG."

## 5. S — Salida y Validación Humana
- **Salida:** Matriz completa de auditoría pantalla por pantalla incorporada en `docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md`.
- **Validación Humana:** El equipo de desarrollo frontend (Daniel Tapias, Luis Caldera) y facilitación (Maira Ortega, Zoe Peñata) revisaron los hallazgos en el software en ejecución, corroborando el correcto funcionamiento de los botones de retorno, atajos `Escape` en modales y contraste de fuentes sobre los paneles esmerilados.
