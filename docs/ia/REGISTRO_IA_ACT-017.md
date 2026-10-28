# Registro de Uso de IA — ACT-017 (Lista de Chequeo Frontend Pressman)

**Marco de Referencia:** ROCAS (Rol, Objetivo, Contexto, Acción, Salida)  
**Actividad:** ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño  
**Fecha:** 16 de Octubre de 2026 (Semana 10)  

---

## 1. R — Rol de la IA
Experto Senior en Ingeniería de Software Frontend, Auditor de UX/UI, Ergonomía de Software Educativo y Especialista en el marco metodológico de Roger S. Pressman & Bruce R. Maxim (9na Edición).

## 2. O — Objetivo
Auditar exhaustivamente la solución frontend del proyecto INSPIRATEC conforme a la lista de chequeo formal de 16 ítems estructurada en los Capítulos 12 (UX Design), 13 (Design for Mobility) y 14 (Pattern-Based Design) de Pressman & Maxim, determinando la calificación numérica rigurosa (C: 2 pts, CP: 1 pt, NC: 0 pts), documentando evidencias verificables en el código fuente JSX/CSS, identificando fortalezas, debilidades críticas y articulando el trabajo del equipo con los 7 hábitos de Covey.

## 3. C — Contexto
En el marco de la Semana 10 de la asignatura Informática Educativa / Diseño de Interfaces de Usuario, el equipo de desarrollo requiere un diagnóstico objetivo y riguroso de su aplicación web desplegada en React 19 / Vite / Zustand / CSS Modules. Se necesita una auditoría imparcial que no sobreestime el cumplimiento y que identifique los puntos débiles exactos en el código (como validaciones intrusivas, antipatrones arquitectónicos o carencias en accesibilidad y movilidad) antes de la entrega final.

## 4. A — Acción (Prompt Principal Utilizado)
> "Toma el Rol de un Experto en Frontend. Realiza la actividad ACT-017: Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño basada en los Capítulos 12, 13 y 14 de Roger S. Pressman & Bruce R. Maxim (9na Edición). Audita el código real del proyecto INSPIRATEC, califica rigurosamente cada uno de los 16 ítems con la escala C (2 pts), CP (1 pt), NC (0 pts), sustenta cada valoración con archivos y líneas de código exactas, consolida el dictamen global y dime qué mejoras o debilidades se tienen para que yo decida cuáles deben proceder. Además, registra los 7 hábitos que realizó cada integrante, registra el diario de campo, IA, evidencia y seguimiento en la Semana 10."

## 5. S — Salida y Validación Humana
* **Salida de la IA:**
  * Documento formal de evaluación consolidado en `docs/actividades/ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md` con puntuación de **22/32 pts (68.75%)**.
  * Identificación precisa de debilidades en código: uso de `alert()` nativo en lugar de *Inline Validation*, reseteo de borradores en el montaje del Wizard, antipatrón *The Blob* en 4 componentes de más de 1.000 líneas, ausencia de `:focus-visible` por reglas con `outline: none`, falta de banner para simulación offline y ausencia de las migas de pan ya codificadas.
  * Mapeo de los 7 hábitos de Covey para los 6 integrantes del equipo.
  * Trazabilidad en diario de campo (`SEMANA_10.md`, `SEMANA_ACTUAL.md`) y monitoreo semanal.
* **Validación Humana:**
  * El equipo de desarrollo frontend (Daniel Tapias, Luis Caldera) validó los hallazgos en el código fuente, corroborando que la puntuación refleja fielmente las áreas de oportunidad de la plataforma.
  * La Scrum Master (Zoe Peñata) y las Product Owners (María Soto, María Ubarne) validaron la priorización del backlog de remediación antes de proceder con las modificaciones de código.
