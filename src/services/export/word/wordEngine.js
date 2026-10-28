/**
 * Motor de exportación a Microsoft Word para INSPIRATEC.
 * Genera documentos Word (.doc / HTML-Word compatible) con el mismo diseño editorial,
 * paleta de colores institucional, espaciado A4, encabezados, pies de página,
 * tablas estilizadas y negrillas en apartados que posee el documento PDF.
 */

import { marked } from 'marked';
import { validatePlanForExport } from '../validateDocument.js';
import { adaptPlanDocument } from '../planDocumentAdapter.js';
import { formatCurricularMarkdown } from '../curricularMarkdownFormatter.js';
import { buildWordFilename, downloadBlob } from '../downloadFile.js';

// Paleta cromática oficial de INSPIRATEC
const PALETTE = {
  petroleumDark: '#142B25',     // Verde petróleo principal institucional
  petroleumActive: '#315B54',   // Verde petróleo activo / subtítulos
  sageBrand: '#477A72',         // Verde salvia corporativo
  sageLight: '#EDF3F1',         // Salvia suave para encabezados de tablas
  sageBorder: '#CBD5E1',        // Bordes de tabla y separadores
  bgTableRowAlt: '#F8FAF9',     // Fondo suave para momentos de clase
  textMain: '#1C1917',          // Texto principal de alto contraste
  textMuted: '#576864',         // Texto secundario / metadatos
  white: '#FFFFFF'
};

/**
 * Aplica estilos en línea y optimiza las etiquetas HTML generadas por marked
 * para que Microsoft Word las interprete con la misma jerarquía y elegancia del PDF.
 *
 * @param {string} rawHtml - HTML producido por marked.
 * @returns {string} HTML enriquecido para Word.
 */
const styleHtmlForWord = (rawHtml) => {
  let html = rawHtml;

  // 1. Encabezados H1, H2, H3, H4
  html = html.replace(
    /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi,
    `<h1 style="color: ${PALETTE.petroleumDark}; font-size: 18pt; font-weight: bold; border-bottom: 2pt solid ${PALETTE.petroleumActive}; padding-bottom: 5pt; margin-top: 14pt; margin-bottom: 8pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif; mso-line-height-rule: exactly; line-height: 1.25;">$1</h1>`
  );

  html = html.replace(
    /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi,
    `<h2 style="color: ${PALETTE.petroleumDark}; font-size: 13.5pt; font-weight: bold; border-bottom: 0.75pt solid ${PALETTE.sageBorder}; padding-bottom: 3pt; margin-top: 16pt; margin-bottom: 6pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif; mso-line-height-rule: exactly;">$1</h2>`
  );

  html = html.replace(
    /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi,
    `<h3 style="color: ${PALETTE.petroleumActive}; font-size: 11.5pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">$1</h3>`
  );

  html = html.replace(
    /<h4\b[^>]*>([\s\S]*?)<\/h4>/gi,
    `<h4 style="color: ${PALETTE.petroleumDark}; font-size: 10.5pt; font-weight: bold; margin-top: 10pt; margin-bottom: 3pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">$1</h4>`
  );

  // 2. Párrafos
  html = html.replace(
    /<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    `<p style="font-size: 10.5pt; line-height: 1.45; color: ${PALETTE.textMain}; margin-top: 0; margin-bottom: 6pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">$1</p>`
  );

  // 3. Negrillas destacadas con color institucional
  html = html.replace(
    /<strong\b[^>]*>([\s\S]*?)<\/strong>/gi,
    `<strong style="font-weight: bold; color: ${PALETTE.petroleumDark};">$1</strong>`
  );

  // 4. Listas y elementos de lista
  html = html.replace(
    /<ul\b[^>]*>/gi,
    `<ul style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 20pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">`
  );

  html = html.replace(
    /<ol\b[^>]*>/gi,
    `<ol style="margin-top: 2pt; margin-bottom: 6pt; padding-left: 20pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">`
  );

  html = html.replace(
    /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
    `<li style="margin-bottom: 2.5pt; font-size: 10.5pt; line-height: 1.4; color: ${PALETTE.textMain};">$1</li>`
  );

  // 5. Citas / Bloques de notas
  html = html.replace(
    /<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi,
    `<blockquote style="border-left: 3.5pt solid ${PALETTE.sageBrand}; background-color: #F4F8F7; padding: 7pt 11pt; margin: 8pt 0; font-size: 10pt; color: ${PALETTE.petroleumActive}; font-style: italic; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">$1</blockquote>`
  );

  // 6. Líneas divisorias horizontales
  html = html.replace(
    /<hr\b[^>]*\/?>/gi,
    `<hr style="border: none; border-top: 0.75pt solid ${PALETTE.sageBorder}; margin: 12pt 0;" />`
  );

  // 7. Tablas: aplicar diseño editorial tipo PDF
  html = html.replace(
    /<table\b[^>]*>/gi,
    `<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 8pt; margin-bottom: 12pt; border: 0.75pt solid ${PALETTE.sageBorder}; font-family: Calibri, 'Segoe UI', Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">`
  );

  html = html.replace(
    /<th\b[^>]*>([\s\S]*?)<\/th>/gi,
    `<th style="background-color: ${PALETTE.sageLight}; color: ${PALETTE.petroleumDark}; font-weight: bold; font-size: 9.5pt; padding: 8pt 10pt; border: 0.75pt solid ${PALETTE.sageBorder}; border-bottom: 1.5pt solid ${PALETTE.petroleumActive}; text-align: left; vertical-align: top;">$1</th>`
  );

  html = html.replace(
    /<td\b[^>]*>([\s\S]*?)<\/td>/gi,
    (match, cellInner) => {
      const cleanCell = cellInner.trim();
      const isMoment = /^(<strong>\s*)?(Inicio|Desarrollo|Cierre|Apertura|Fase|Momento)/i.test(cleanCell);
      
      const bgStyle = isMoment ? `background-color: ${PALETTE.bgTableRowAlt};` : '';
      const boldStyle = isMoment ? `font-weight: bold; color: ${PALETTE.petroleumDark};` : `color: ${PALETTE.textMain};`;
      const widthStyle = isMoment ? 'width: 20%;' : '';

      return `<td style="border: 0.75pt solid ${PALETTE.sageBorder}; padding: 7pt 10pt; vertical-align: top; font-size: 9.5pt; line-height: 1.35; ${bgStyle} ${boldStyle} ${widthStyle}">${cellInner}</td>`;
    }
  );

  return html;
};

/**
 * Renderiza los anexos de rúbricas estructuradas en tablas HTML para Word.
 */
const renderWordRubricas = (rubricasTextuales) => {
  if (!rubricasTextuales || rubricasTextuales.length === 0) return '';

  let html = `
    <div style="page-break-before: always; margin-top: 18pt;">
      <h2 style="color: ${PALETTE.petroleumDark}; font-size: 13.5pt; font-weight: bold; border-bottom: 1.5pt solid ${PALETTE.petroleumActive}; padding-bottom: 4pt; margin-top: 16pt; margin-bottom: 4pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">
        Anexo: Rúbrica de Evaluación de Desempeño
      </h2>
      <p style="font-size: 9.5pt; color: ${PALETTE.textMuted}; margin-bottom: 10pt; font-style: italic;">
        Criterios formativos y niveles de logro para la valoración integral de las competencias desarrolladas.
      </p>
  `;

  rubricasTextuales.forEach((rubrica) => {
    if (rubrica.title && rubrica.title !== 'Rúbrica de Evaluación') {
      html += `<h3 style="color: ${PALETTE.petroleumActive}; font-size: 11pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt;">${rubrica.title}</h3>`;
    }

    html += `<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-bottom: 14pt; border: 0.75pt solid ${PALETTE.sageBorder};"><thead><tr>`;
    
    (rubrica.headers || []).forEach(header => {
      html += `<th style="background-color: ${PALETTE.sageLight}; color: ${PALETTE.petroleumDark}; font-weight: bold; font-size: 9pt; padding: 7pt 8pt; border: 0.75pt solid ${PALETTE.sageBorder}; border-bottom: 1.5pt solid ${PALETTE.petroleumActive}; text-align: left;">${header}</th>`;
    });

    html += `</tr></thead><tbody>`;

    (rubrica.rows || []).forEach(row => {
      html += `<tr>`;
      row.forEach((cell, idx) => {
        const isCriterion = idx === 0;
        const bgStyle = isCriterion ? `background-color: ${PALETTE.bgTableRowAlt};` : '';
        const boldStyle = isCriterion ? `font-weight: bold; color: ${PALETTE.petroleumDark};` : `color: ${PALETTE.textMain};`;
        html += `<td style="border: 0.75pt solid ${PALETTE.sageBorder}; padding: 6pt 8pt; vertical-align: top; font-size: 9pt; line-height: 1.3; ${bgStyle} ${boldStyle}">${cell}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
  });

  html += `</div>`;
  return html;
};

/**
 * Renderiza el anexo de materiales complementarios interactivos.
 */
const renderWordMateriales = (materialesGenerados) => {
  if (!materialesGenerados || materialesGenerados.length === 0) return '';

  let html = `
    <div style="margin-top: 16pt;">
      <h2 style="color: ${PALETTE.petroleumDark}; font-size: 13.5pt; font-weight: bold; border-bottom: 1.5pt solid ${PALETTE.petroleumActive}; padding-bottom: 4pt; margin-top: 16pt; margin-bottom: 4pt; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">
        Materiales Didácticos Complementarios Generados
      </h2>
      <p style="font-size: 9.5pt; color: ${PALETTE.textMuted}; margin-bottom: 10pt; font-style: italic;">
        Recursos pedagógicos generados durante la sesión disponibles para visualización y descarga interactiva.
      </p>
  `;

  materialesGenerados.forEach(mat => {
    html += `
      <div style="background-color: #FAFAF8; border: 0.75pt solid ${PALETTE.sageBorder}; border-left: 3.5pt solid ${PALETTE.petroleumActive}; padding: 9pt 12pt; margin-bottom: 8pt; border-radius: 4pt;">
        <div style="font-size: 10.5pt; font-weight: bold; color: ${PALETTE.petroleumDark}; margin-bottom: 2pt;">${mat.title}</div>
        <div style="font-size: 8.5pt; color: ${PALETTE.textMuted}; margin-bottom: 4pt;">Tipo: ${mat.tipo}</div>
        <div style="font-size: 9.5pt; color: ${PALETTE.textMain}; line-height: 1.35; margin-bottom: 4pt;">${mat.description}</div>
        ${mat.accessUrl ? `<div style="font-size: 9pt; color: ${PALETTE.petroleumActive}; font-weight: bold;">▶ <a href="${mat.accessUrl}" style="color: ${PALETTE.petroleumActive}; text-decoration: underline;">${mat.accessAction}</a></div>` : ''}
      </div>
    `;
  });

  html += `</div>`;
  return html;
};

/**
 * Genera y descarga el documento en formato Microsoft Word (.doc).
 *
 * @param {Object} options
 * @param {Object} options.plan - Datos del plan.
 * @param {string} [options.markdown] - Contenido Markdown.
 * @param {Object} [options.userProfile] - Perfil del docente.
 * @param {string} [options.planId] - ID del plan.
 * @returns {Promise<{ success: boolean, filename: string }>}
 */
export const exportPlanToWord = async ({
  plan = {},
  markdown = '',
  userProfile = null,
  planId = null
}) => {
  // 1. Validación previa de contenido
  const validation = validatePlanForExport(plan, markdown);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Contenido curricular no apto para exportar a Word.');
  }

  // 2. Adaptación del modelo canónico
  const documentModel = adaptPlanDocument({
    plan,
    markdown,
    userProfile,
    planId
  });

  const {
    tema,
    grado,
    materia,
    fecha,
    rubricasTextuales,
    materialesGenerados
  } = documentModel;

  // 3. Normalización rigurosa de negrillas en apartados y momentos pedagógicos
  const enrichedMarkdown = formatCurricularMarkdown(documentModel.cleanMarkdown, { forExport: true });

  // 4. Conversión de Markdown a HTML enriquecido
  const rawHtml = marked.parse(enrichedMarkdown, { gfm: true });
  const styledBodyHtml = styleHtmlForWord(rawHtml);

  // 5. Renderizado de anexos
  const rubricasHtml = renderWordRubricas(rubricasTextuales);
  const materialesHtml = renderWordMateriales(materialesGenerados);

  // 6. Ensamblaje del documento Office HTML completo con metadatos y namespaces de Word
  const wordDocumentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${tema || 'Plan de Clase'} - INSPIRATEC</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 2.5cm 2.5cm 2.5cm 2.5cm;
          mso-header-margin: 36.0pt;
          mso-footer-margin: 36.0pt;
          mso-header: url("#h1") h1;
          mso-footer: url("#f1") f1;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
        }
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          font-size: 10.5pt;
          color: ${PALETTE.textMain};
          line-height: 1.45;
          background-color: #FFFFFF;
        }
        table {
          mso-displayed-decimal-separator: ",";
          mso-displayed-thousand-separator: ".";
        }
      </style>
    </head>
    <body>
      <!-- Encabezado de página dinámico para Word -->
      <div style="mso-element:header" id="h1">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom: 8pt;">
          <tr>
            <td style="font-size: 8.5pt; font-weight: bold; color: ${PALETTE.textMuted}; border: none; padding: 0; font-family: Calibri, sans-serif;">
              INSPIRATEC · Planificación Curricular
            </td>
            <td style="font-size: 8.5pt; color: ${PALETTE.textMuted}; text-align: right; border: none; padding: 0; font-family: Calibri, sans-serif;">
              ${materia || 'General'} · ${grado || ''}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="border-bottom: 0.5pt solid ${PALETTE.sageBorder}; height: 2pt; font-size: 1pt; padding: 0;">&nbsp;</td>
          </tr>
        </table>
      </div>

      <!-- Pie de página dinámico con paginación nativa de Word -->
      <div style="mso-element:footer" id="f1">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top: 8pt;">
          <tr>
            <td colspan="2" style="border-top: 0.5pt solid ${PALETTE.sageBorder}; height: 2pt; font-size: 1pt; padding: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="font-size: 8pt; color: ${PALETTE.textMuted}; border: none; padding: 4pt 0 0 0; font-family: Calibri, sans-serif;">
              Documento Curricular Oficial — INSPIRATEC
            </td>
            <td style="font-size: 8pt; color: ${PALETTE.textMuted}; text-align: right; border: none; padding: 4pt 0 0 0; font-family: Calibri, sans-serif;">
              Página <span style="mso-field-code: PAGE "></span> de <span style="mso-field-code: NUMPAGES "></span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Cuerpo del Documento -->
      <div class="Section1">
        <!-- Banner Institucional Superior idéntico al PDF -->
        <div style="border-bottom: 1.5pt solid ${PALETTE.petroleumActive}; padding-bottom: 10pt; margin-bottom: 16pt;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td>
                <span style="font-size: 8.5pt; font-weight: bold; color: ${PALETTE.sageBrand}; text-transform: uppercase; letter-spacing: 1.5pt;">
                  PLAN DE CLASE INSTITUCIONAL
                </span>
                <h1 style="color: ${PALETTE.petroleumDark}; font-size: 20pt; font-weight: bold; margin: 4pt 0 6pt 0; line-height: 1.2; font-family: Calibri, 'Segoe UI', Arial, sans-serif;">
                  ${tema || 'Secuencia Didáctica Curricular'}
                </h1>
                <div style="font-size: 9.5pt; color: ${PALETTE.petroleumActive}; font-weight: 600;">
                  ${materia ? `Área: ${materia}` : ''} ${grado ? ` · Grado: ${grado}` : ''} ${fecha ? ` · Fecha: ${fecha}` : ''}
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Contenido Central del Plan de Clase -->
        <div class="document-content">
          ${styledBodyHtml}
        </div>

        <!-- Anexos de Rúbricas y Materiales Interactivos -->
        ${rubricasHtml}
        ${materialesHtml}
      </div>
    </body>
    </html>
  `;

  // 7. Descarga en el navegador
  const filename = buildWordFilename({ tema, grado, fecha });
  const blob = new Blob(['\ufeff', wordDocumentHtml], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, filename);

  return {
    success: true,
    filename
  };
};
