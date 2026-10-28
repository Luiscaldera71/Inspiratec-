# Prompt Utilizado — ACT-003

* **Fecha:** Septiembre 2026.
* **Herramienta:** Asistente Inteligente (Google Gemini).
* **Objetivo:** Analizar y documentar el Modelo Pedagógico del proyecto (ACT-003), asegurar la trazabilidad, ajustar la cronología de semanas 2 y 3, y estructurar todos los reportes correspondientes.

## Prompt Principal (Resumido)

> Actúa como Supervisor Académico de Proyectos de Diseño y Desarrollo de Software Educativo, Diseñador Instruccional, Analista Pedagógico y Gestor de Documentación GitHub.
> 
> Trabaja sobre el PROYECTO ACTUAL.
> Tu objetivo es:
> 1. Verificar y preservar la trazabilidad histórica.
> 2. Corregir la ubicación cronológica (Semana 2: Reestructuración, Semana 3: Diagrama [COMPLETADA]).
> 3. Desarrollar la ACT-003: Análisis y Definición del Modelo Pedagógico (Semana 4).
> 4. Diferenciar entre Información Verificada, Reportada, Inferencia y Decisión del Equipo.
> 
> (...) 
> El equipo confirma: Modelo Principal Constructivismo, Complementos (ABP, Gamificación, Indagación, Design Thinking, Pensamiento Computacional).
> 
> (...)
> Crea: `MODELO_PEDAGOGICO.md`, `ACT-003_MODELO_PEDAGOGICO.md`, `SEMANA_04.md`, Actualiza el Monitoreo Semanal, crea Registro IA y Prompt. NO mezcles la actividad de los 15 artículos científicos.
>
> Presenta un resumen antes de hacer commit.

## Resultado Obtenido
La IA identificó la coherencia del software (wizard inclusivo DUA, herramientas gamificadas, mapas interactivos) con las metodologías Activas y el Constructivismo. Creó la estructura exigida diferenciando claramente qué corresponde al software, al docente y al estudiante, además de estructurar los diarios de campo y actas de seguimiento sin inventar información no verificada.

## Modificaciones Humanas
El equipo debió formular directrices sumamente detalladas (Zero-Shot con contexto enriquecido) limitando explícitamente la capacidad de la IA de inventar problemas o requerimientos, obligándola a anclarse únicamente a los módulos presentes en el código (src/) y la documentación oficial (Guía 30 MEN).
