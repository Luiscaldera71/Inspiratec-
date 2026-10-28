# Registro de Uso de Inteligencia Artificial (ROCAS) - ACT-004

## Aplicación de Metodología ROCAS

- **R — Rol de la IA:** Supervisor de Gestión Documental Académica y Analista de Evidencia.
- **O — Objetivo:** Crear, estructurar y actualizar la documentación de seguimiento y la matriz bibliográfica de los 15 artículos científicos, garantizando trazabilidad y cumplimiento de los requisitos metodológicos del proyecto INSPIRATEC y el marco MODESEC.
- **C — Contexto:** El equipo requiere justificar decisiones de arquitectura, diseño pedagógico e interfaz. Se identificaron inconsistencias en la responsabilidad reportada de los documentos de origen y se necesitaban ajustes en las declaraciones de indexación.
- **A — Acción/Instrucción:** Análisis de los artículos suministrados, categorización en PED (5), ARQ (5), GUI (5), manejo de artículos complementarios/descartados y actualización coordinada del repositorio (monitoreo semanal, diario de campo, actas de actividad).
- **S — Salida:** 
  - Archivo `ACT-004_MATRIZ_15_ARTICULOS.md`
  - Archivo `MATRIZ_15_ARTICULOS.md` en `docs/investigacion/`
  - Modificaciones en `SEMANA_ACTUAL.md` y `MONITOREO_SEMANAL.md`
  - Informes PRE-COMMIT para control de calidad antes de registrar en control de versiones.

### Detalles de Validación y Trazabilidad

- **Resultado generado:** Construcción exitosa de la matriz 5+5+5 con estructura completa.
- **Validación humana:** La primera iteración fue revisada y aprobada con ajustes (diferenciación de responsables, precisión en afirmaciones de indexación y criterios de evaluación de responsabilidades).
- **Correcciones:** Se aplicaron las correcciones indicadas en la revisión humana antes del commit final (evitar asegurar indexación sin validación individual, mantener responsables históricos frente a análisis propuestos).
- **Artículos rechazados por análisis crítico o revisión académica:** 
  - *Understanding and addressing quality attributes of microservices architecture: A systematic literature review*: Reemplazado porque INSPIRATEC no utiliza microservicios y su aporte era solo teórico; sustituido por un artículo sobre métricas de mantenibilidad de código.
  - *A Survey on Large Language Model based Autonomous Agents*: Descartado de la cuota principal por no centrarse en frontend/arquitectura web de INSPIRATEC.
  - *Component-based Web application development (2004)* y *Component-based Web page management environment (2006)*: Descartados y clasificados como complementarios/históricos por obsolescencia frente a SPA/TypeScript actuales.
