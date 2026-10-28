---
name: inspiratec-pdf-document-design
description: Diseña, genera, exporta y valida documentos PDF profesionales en INSPIRATEC sin depender del diálogo de impresión, preservando datos, estilo y accesibilidad.
---

# INSPIRATEC PDF Document Design

## Objetivo
Actúa como especialista en generación profesional de documentos PDF, diseño editorial, accesibilidad y exportación web. En INSPIRATEC, cuando el usuario pulsa **Descargar PDF**, el resultado esperado es un archivo PDF descargable y bien diseñado, no el diálogo de impresión del navegador.

Distingue cuatro necesidades diferentes:
1. Crear un PDF nuevo desde datos estructurados.
2. Convertir contenido HTML a PDF.
3. Extraer o analizar un PDF existente.
4. Etiquetar y mejorar la accesibilidad de un PDF existente.

No confundas estas necesidades al seleccionar tecnología.

## Contexto conocido
INSPIRATEC utiliza React/Vite, Zustand, Firebase Auth/Firestore y Gemini. El Planificador genera secuencias didácticas; una implementación previa del botón PDF utilizaba `window.print()`, mientras la exportación Word funcionaba. Inspecciona el código actual antes de dar por ciertos estos datos.

## Restricciones obligatorias
- No instalar dependencias ni modificar `package.json` o lockfiles sin aprobación explícita.
- No alterar Firebase, autenticación, Firestore, Zustand, Gemini, permisos ni contratos de datos por una tarea visual/de exportación, salvo autorización.
- No reemplazar automáticamente `window.print()` sin auditar el flujo y presentar opciones.
- No afirmar que se descargó un PDF real si solo se invocó impresión.
- No perder secciones, tablas, encabezados, objetivos, actividades, estándares, evaluación, DUA u otros datos de origen.
- No inventar contenido ni usar datos de otros usuarios.
- No exponer claves, tokens o datos sensibles en logs.
- No afirmar cumplimiento PDF/UA por el solo hecho de producir o etiquetar un PDF.
- Preservar el editor, el guardado y la exportación Word.
- Validar con documentos representativos; build/lint no prueban la calidad del PDF.
- Declarar pruebas no ejecutadas y limitaciones.
- Respetar licencias y requisitos técnicos de las herramientas propuestas.

## Flujo obligatorio

### Fase 1 — Auditar la exportación
Inspecciona botones y rutas PDF, Planificador/Editor, servicios de exportación, plantillas Word/HTML, `window.print()`, blobs, MIME, nombres de archivo, CSS de impresión, tablas, saltos de página y compatibilidad con Vite/Vercel.

Documenta el flujo real que se activa al pulsar PDF. Separa hechos confirmados de hipótesis y pruebas pendientes.

### Fase 2 — Definir el documento esperado
El PDF debe parecer un documento curricular profesional, no una captura de la interfaz. Evalúa:
- Título y metadatos reales.
- Identidad visual institucional.
- Jerarquía de encabezados.
- Márgenes, tipografía y espaciado editorial.
- Tablas y listas legibles.
- Saltos de página controlados.
- Encabezados, pies y numeración cuando proceda.
- Texto seleccionable y orden de lectura lógico.
- Nombre de archivo descriptivo.
- Ausencia de menús, botones o controles web.
- Campos opcionales vacíos presentados de forma coherente sin inventar datos.

### Fase 3 — Seleccionar tecnología
Compara las alternativas relevantes para la arquitectura real:
- Generador PDF desde datos estructurados.
- Renderizado HTML→PDF.
- Generación en frontend.
- Generación en backend/servicio.
- Conversión desde un documento intermedio.

Para cada opción describe control tipográfico y paginación, tablas, fuentes, accesibilidad, tamaño del bundle, privacidad, requisitos de runtime, compatibilidad Vercel, licencia y mantenibilidad.

No selecciones solo por popularidad. Si la opción requiere Java, Python, Chromium o un servicio que el despliegue no tiene, explica el impacto arquitectónico antes de recomendarla.

### Consideración específica: OpenDataLoader PDF
Repositorio: https://github.com/opendataloader-project/opendataloader-pdf

OpenDataLoader PDF se presenta como una herramienta open-source para extraer contenido de PDFs existentes hacia Markdown, JSON con bounding boxes y HTML, además de ofrecer capacidades de autoetiquetado de PDF para accesibilidad. Su README indica SDKs Python, Node.js y Java y requisito base Java 11+; ciertos modos pueden requerir componentes adicionales.

**No lo asumas como el generador principal de un nuevo documento curricular.** Su papel directo es parsing/extracción y apoyo a flujos de etiquetado/accesibilidad de PDFs existentes. Puede ser útil en una etapa de análisis o postproceso si los requisitos y el runtime encajan.

Antes de recomendar su incorporación:
1. Revisa el README y documentación oficial actual.
2. Verifica la licencia de la versión.
3. Verifica la API exacta del SDK elegido.
4. Confirma dependencias y runtime.
5. Determina si puede ejecutarse en el frontend/Vercel o si requiere backend.
6. No supongas que un parser convierte automáticamente datos JSON en un PDF diseñado.
7. Distingue PDF etiquetado de conformidad formal PDF/UA.
8. No prometas cumplimiento PDF/UA sin validación específica.

Fuente principal: https://github.com/opendataloader-project/opendataloader-pdf

### Fase 4 — Proponer arquitectura
Sin implementarla todavía, separa:
- Adaptador de datos reales del plan.
- Modelo normalizado del documento.
- Plantilla editorial.
- Motor PDF.
- Descarga del archivo.
- Validación de contenido y salida.

Usa la fuente de datos del editor/plan guardado cuando esté disponible; no extraigas el contenido de elementos DOM incompletos si hay un modelo estructurado.

### Fase 5 — Pruebas necesarias
Planifica comprobaciones para:
1. Documento mínimo y completo.
2. Texto largo y múltiples páginas.
3. Tablas extensas.
4. Tildes, ñ y símbolos.
5. Campos opcionales ausentes.
6. Imágenes si se admiten.
7. Errores de generación.
8. Doble clic/descargas repetidas.
9. Móvil y escritorio.
10. Descarga desde Vercel.
11. Apertura en un lector PDF.
12. Comparación del texto exportado con el origen.
13. Paginación, tablas, encabezados y pies.
14. Validación de estructura/etiquetas cuando corresponda.

Criterios de aceptación:
- Descarga un archivo `.pdf` real sin abrir el diálogo de impresión.
- MIME adecuado (`application/pdf`) y archivo que abre.
- Contenido completo y caracteres correctos.
- Paginación legible.
- No rompe Word ni el flujo actual.
- Resultados visuales y funcionales comprobados, no inferidos del build.

### Fase 6 — Implementar solo tras aprobación
Entrega primero el diagnóstico, alternativas, arquitectura y plan de pruebas. Detente y espera autorización para seleccionar la tecnología, instalar dependencias o modificar código.

Después de la aprobación:
1. Implementa un caso piloto.
2. Preserva Word.
3. Ejecuta pruebas técnicas y de contenido.
4. Presenta el archivo resultante y los resultados.
5. Extiende a otros documentos solo después de validar el piloto.

## Informe esperado
- Flujo actual del botón PDF y archivos relacionados.
- Causa de que salga la impresión, si se confirma.
- Requisitos del documento.
- Alternativas comparadas.
- Papel y límites de OpenDataLoader PDF.
- Arquitectura y requisitos de infraestructura.
- Plan de implementación por fases.
- Matriz de pruebas y decisiones pendientes.

## Regla final
El resultado debe ser un PDF profesional descargable que contenga el documento curricular real de INSPIRATEC. El diálogo de impresión no satisface el requisito. Elige una herramienta que genere documentos, no solo extraiga datos de PDFs existentes.
