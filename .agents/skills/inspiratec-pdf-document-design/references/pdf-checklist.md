# Checklist de diseño y validación PDF — INSPIRATEC

## Tipo de necesidad
- [ ] Generar PDF desde datos estructurados.
- [ ] Convertir HTML a PDF.
- [ ] Convertir otro formato.
- [ ] Extraer/analizar PDF existente.
- [ ] Mejorar etiquetado/accesibilidad de PDF existente.

## Flujo funcional
- [ ] Descarga un archivo `.pdf` real sin diálogo de impresión.
- [ ] Nombre descriptivo y MIME `application/pdf`.
- [ ] Documento abre en un lector PDF.
- [ ] Datos completos, sin contenido inventado.
- [ ] Errores comunicados y doble envío prevenido.
- [ ] Exportación Word preservada.

## Diseño editorial
- [ ] Título y metadatos correctos.
- [ ] Jerarquía de encabezados.
- [ ] Márgenes y espacios consistentes.
- [ ] Texto seleccionable y legible.
- [ ] Tildes, ñ y símbolos correctos.
- [ ] Tablas y listas completas.
- [ ] Saltos de página cuidados.
- [ ] Encabezados/pies/números de página cuando proceda.
- [ ] Sin menús ni controles de la web.
- [ ] Campos ausentes resueltos coherentemente.

## Accesibilidad
- [ ] Orden de lectura lógico.
- [ ] Encabezados y listas estructurados.
- [ ] Tablas semánticas cuando el motor lo permita.
- [ ] PDF etiquetado si se requiere.
- [ ] No confundir etiquetado con conformidad PDF/UA.
- [ ] Validación formal cuando se afirme conformidad.

## Tecnología/despliegue
- [ ] Compatibilidad Vite/Vercel evaluada.
- [ ] Runtime (Java/Python/Chromium/backend) confirmado.
- [ ] Privacidad de procesamiento documentada.
- [ ] Licencia verificada.
- [ ] Rendimiento y tamaño evaluados.
- [ ] Dependencias pendientes de aprobación.

## Pruebas
- [ ] Documento mínimo y completo.
- [ ] Documento largo.
- [ ] Tablas grandes.
- [ ] Tildes/ñ/símbolos.
- [ ] Campos opcionales ausentes.
- [ ] Descarga en producción.
- [ ] Archivo abre y texto es correcto.
- [ ] Revisión visual de páginas.
- [ ] Pruebas realizadas separadas de pendientes.
