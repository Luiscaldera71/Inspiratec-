/**
 * Motor de exportación a Microsoft Word para InspiraTEC (rediseño).
 * Genera un documento Word (.doc, formato MHTML con imágenes incrustadas) con la misma
 * identidad visual del PDF: portada con banner y logo, ficha de datos, secciones en
 * tarjetas de color, tablas con cabecera azul, encabezado de marca y pie con paginación.
 */

import { marked } from 'marked';
import { validatePlanForExport } from '../validateDocument.js';
import { adaptPlanDocument } from '../planDocumentAdapter.js';
import { formatCurricularMarkdown } from '../curricularMarkdownFormatter.js';
import { buildWordFilename, downloadBlob } from '../downloadFile.js';
import { THEME } from '../exportTheme.js';
import { loadExportAssets, splitDataUrl } from '../exportAssets.js';

const FONT = "Calibri, 'Segoe UI', Arial, sans-serif";
const SLOGAN = 'Docentes que transforman con tecnología';
const BASE_LOCATION = 'file:///C:/InspiraTEC';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const clip = (text, max) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

/**
 * Aplica estilos en línea al HTML generado por marked para que Word lo muestre
 * con la jerarquía y los colores de la plantilla InspiraTEC.
 */
const styleHtmlForWord = (rawHtml, toc = []) => {
  let html = rawHtml;

  html = html.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi,
    `<h1 style="color:${THEME.navy}; font-size:17pt; font-weight:bold; background:${THEME.soft}; border-left:6pt solid ${THEME.violet}; padding:7pt 12pt; margin:18pt 0 8pt 0; font-family:${FONT}; mso-line-height-rule:exactly; line-height:1.25;">$1</h1>`);

  // Capítulos (H2): número grande + título, y se registran para el índice
  let capitulo = 0;
  html = html.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (m, inner) => {
    capitulo += 1;
    const titulo = inner.replace(/^\s*\d+[.)]\s*/, '');
    toc.push({ n: capitulo, titulo: titulo.replace(/<[^>]+>/g, '').trim() });
    const num = String(capitulo).padStart(2, '0');
    return `<h2 style="color:${THEME.navy}; font-size:14pt; font-weight:bold; background:${THEME.soft}; border-left:6pt solid ${THEME.indigo}; padding:6pt 12pt; margin:20pt 0 8pt 0; font-family:${FONT}; mso-line-height-rule:exactly;"><a name="cap-${capitulo}"></a><span style="background:${THEME.indigo}; color:#FFFFFF; font-size:13pt; font-weight:bold; padding:3pt 10pt;">&nbsp;${num}&nbsp;</span>&nbsp;&nbsp;${titulo}</h2>`;
  });
  html = html.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi,
    `<h3 style="color:${THEME.indigo}; font-size:11.5pt; font-weight:bold; border-left:3pt solid ${THEME.violet}; padding-left:7pt; margin:12pt 0 4pt 0; font-family:${FONT};">$1</h3>`);

  html = html.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi,
    `<h4 style="color:${THEME.navy}; font-size:10.5pt; font-weight:bold; margin:10pt 0 3pt 0; font-family:${FONT};">$1</h4>`);

  html = html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi,
    `<p style="font-size:10.5pt; line-height:1.45; color:${THEME.text}; margin:0 0 6pt 0; font-family:${FONT};">$1</p>`);

  html = html.replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi,
    `<strong style="font-weight:bold; color:${THEME.navy};">$1</strong>`);

  html = html.replace(/<ul\b[^>]*>/gi, `<ul style="margin:2pt 0 6pt 0; padding-left:20pt; font-family:${FONT};">`);
  html = html.replace(/<ol\b[^>]*>/gi, `<ol style="margin:2pt 0 6pt 0; padding-left:20pt; font-family:${FONT};">`);
  html = html.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi,
    `<li style="margin-bottom:2.5pt; font-size:10.5pt; line-height:1.4; color:${THEME.text};">$1</li>`);

  html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi,
    `<blockquote style="border-left:4pt solid ${THEME.violet}; background:#F5F2FF; padding:8pt 12pt; margin:8pt 0; font-size:10pt; color:${THEME.navy}; font-style:italic; font-family:${FONT};">$1</blockquote>`);

  html = html.replace(/<hr\b[^>]*\/?>/gi,
    `<hr style="border:none; border-top:1pt solid ${THEME.border}; margin:12pt 0;" />`);

  html = html.replace(/<table\b[^>]*>/gi,
    `<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin:8pt 0 12pt 0; border:0.75pt solid ${THEME.border}; font-family:${FONT}; mso-table-lspace:0pt; mso-table-rspace:0pt;">`);

  html = html.replace(/<th\b[^>]*>([\s\S]*?)<\/th>/gi,
    `<th style="background:${THEME.indigo}; color:#FFFFFF; font-weight:bold; font-size:9.5pt; padding:8pt 10pt; border:0.75pt solid ${THEME.indigo}; text-align:left; vertical-align:top;">$1</th>`);

  html = html.replace(/<td\b[^>]*>([\s\S]*?)<\/td>/gi, (match, cellInner) => {
    const isMoment = /^(<strong>\s*)?(Inicio|Desarrollo|Cierre|Apertura|Fase|Momento)/i.test(cellInner.trim());
    const bg = isMoment ? `background:${THEME.moment};` : '';
    const weight = isMoment ? `font-weight:bold; color:${THEME.navy}; width:20%;` : `color:${THEME.text};`;
    return `<td style="border:0.75pt solid ${THEME.border}; padding:7pt 10pt; vertical-align:top; font-size:9.5pt; line-height:1.35; ${bg} ${weight}">${cellInner}</td>`;
  });

  return html;
};

/** Franja decorativa azul → violeta. */
const stripeHtml = (height = '5pt') => `
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%;">
    <tr>${THEME.stripe.map((c) => `<td style="background:${c}; height:${height}; font-size:1pt; line-height:1pt;">&nbsp;</td>`).join('')}</tr>
  </table>`;

/** Portada: banner, logo, título, ficha de datos y objetivo. */
const renderCover = (model, imgs) => {
  const { tema, materia, grado, duracion, docente, institucion, fecha, numEstudiantes, metodologiaSTEAM, objetivos } = model;

  const info = [
    ['Docente', docente],
    ['Institución', institucion],
    ['Área', materia],
    ['Grado', grado],
    ['Duración', duracion],
    ['Estudiantes', numEstudiantes],
    ['Fecha', fecha],
    ['Enfoque', metodologiaSTEAM]
  ].filter(([, v]) => v && String(v).trim());

  let infoRows = '';
  for (let i = 0; i < info.length; i += 2) {
    const cell = (item) => item
      ? `<td width="50%" style="background:${THEME.soft}; border:4pt solid #FFFFFF; padding:9pt 12pt; vertical-align:top;">
           <div style="font-size:7.5pt; font-weight:bold; color:${THEME.indigo}; letter-spacing:1pt; font-family:${FONT};">${esc(item[0]).toUpperCase()}</div>
           <div style="font-size:10.5pt; font-weight:bold; color:${THEME.navy}; margin-top:2pt; font-family:${FONT};">${esc(clip(item[1], 70))}</div>
         </td>`
      : `<td width="50%" style="border:4pt solid #FFFFFF;">&nbsp;</td>`;
    infoRows += `<tr>${cell(info[i])}${cell(info[i + 1])}</tr>`;
  }

  const objetivo = clip(objetivos, 340);
  const subtitle = [materia, grado ? `Grado ${grado}` : '', duracion].filter(Boolean).join('  ·  ');

  return `
    ${imgs.banner ? `<div style="margin:0; padding:0;"><img src="${imgs.banner}" width="605" height="219" style="width:16cm; height:5.8cm; display:block;" alt="InspiraTEC"></div>` : ''}
    ${stripeHtml('6pt')}

    <div style="margin-top:14pt;">
      ${imgs.logo ? `<img src="${imgs.logo}" width="190" height="114" style="width:5cm; height:3cm;" alt="InspiraTEC">` : ''}
    </div>

    <div style="margin-top:10pt;">
      <span style="background:${THEME.soft}; color:${THEME.indigo}; font-size:8.5pt; font-weight:bold; letter-spacing:1.5pt; padding:3pt 10pt; font-family:${FONT};">&nbsp;GUÍA DE CLASE&nbsp;</span>
    </div>
    <h1 style="color:${THEME.navy}; font-size:28pt; font-weight:bold; line-height:1.12; margin:10pt 0 6pt 0; font-family:${FONT}; background:none; border:none; padding:0;">${esc(clip(tema, 120) || 'Secuencia didáctica')}</h1>
    ${subtitle ? `<p style="font-size:12pt; color:${THEME.muted}; margin:0 0 16pt 0; font-family:${FONT};">${esc(subtitle)}</p>` : ''}

    ${infoRows ? `<table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin:6pt 0 10pt 0;">${infoRows}</table>` : ''}

    ${objetivo ? `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin:8pt 0 18pt 0;">
      <tr><td style="border-left:5pt solid ${THEME.violet}; background:#F5F2FF; padding:11pt 16pt;">
        <div style="font-size:8pt; font-weight:bold; color:${THEME.violet}; letter-spacing:1pt; font-family:${FONT};">OBJETIVO</div>
        <div style="font-size:10.5pt; color:${THEME.text}; line-height:1.4; margin-top:3pt; font-family:${FONT};">${esc(objetivo)}</div>
      </td></tr>
    </table>` : ''}

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin-top:24pt;">
      <tr><td style="background:${THEME.navy}; padding:13pt 18pt; font-family:${FONT};">
        <span style="color:#C9D3FF; font-size:12pt;">Creado con </span><b style="color:#FFFFFF; font-size:12pt;">InspiraTEC</b>
        <span style="color:#C9D3FF; font-size:9pt;">&nbsp;&nbsp;·&nbsp;&nbsp;${esc(SLOGAN)}</span>
      </td></tr>
    </table>
    ${stripeHtml('4pt')}
    <br style="page-break-before:always; mso-break-type:page-break;" clear="all">`;
};

const renderWordRubricas = (rubricasTextuales) => {
  if (!rubricasTextuales || rubricasTextuales.length === 0) return '';
  let html = `
    <div style="page-break-before:always;">
      <h2 style="color:${THEME.navy}; font-size:13.5pt; font-weight:bold; background:${THEME.soft}; border-left:6pt solid ${THEME.indigo}; padding:6pt 12pt; margin:0 0 6pt 0; font-family:${FONT};">Anexo · Rúbrica de evaluación de desempeño</h2>
      <p style="font-size:9.5pt; color:${THEME.muted}; margin:0 0 10pt 0; font-style:italic; font-family:${FONT};">Criterios formativos y niveles de logro para la valoración integral de las competencias desarrolladas.</p>`;

  rubricasTextuales.forEach((rubrica) => {
    if (rubrica.title && rubrica.title !== 'Rúbrica de Evaluación') {
      html += `<h3 style="color:${THEME.indigo}; font-size:11pt; font-weight:bold; margin:10pt 0 4pt 0; font-family:${FONT};">${esc(rubrica.title)}</h3>`;
    }
    html += `<table width="100%" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin-bottom:14pt; border:0.75pt solid ${THEME.border};"><thead><tr>`;
    (rubrica.headers || []).forEach((h) => {
      html += `<th style="background:${THEME.indigo}; color:#FFFFFF; font-weight:bold; font-size:9pt; padding:7pt 8pt; border:0.75pt solid ${THEME.indigo}; text-align:left; font-family:${FONT};">${esc(h)}</th>`;
    });
    html += `</tr></thead><tbody>`;
    (rubrica.rows || []).forEach((row, rIdx) => {
      html += `<tr>`;
      row.forEach((cell, idx) => {
        const bg = idx === 0 ? `background:${THEME.moment}; font-weight:bold; color:${THEME.navy};` : (rIdx % 2 === 1 ? `background:${THEME.softer}; color:${THEME.text};` : `color:${THEME.text};`);
        html += `<td style="border:0.75pt solid ${THEME.border}; padding:6pt 8pt; vertical-align:top; font-size:9pt; line-height:1.3; font-family:${FONT}; ${bg}">${esc(cell)}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  });

  return `${html}</div>`;
};

const renderWordMateriales = (materialesGenerados) => {
  if (!materialesGenerados || materialesGenerados.length === 0) return '';
  let html = `
    <div style="margin-top:16pt;">
      <h2 style="color:${THEME.navy}; font-size:13.5pt; font-weight:bold; background:${THEME.soft}; border-left:6pt solid ${THEME.indigo}; padding:6pt 12pt; margin:0 0 6pt 0; font-family:${FONT};">Materiales didácticos complementarios</h2>
      <p style="font-size:9.5pt; color:${THEME.muted}; margin:0 0 10pt 0; font-style:italic; font-family:${FONT};">Recursos generados en la sesión pedagógica, disponibles para visualizar y descargar en la plataforma.</p>`;

  materialesGenerados.forEach((mat) => {
    html += `
      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin-bottom:8pt;">
        <tr><td style="background:${THEME.softer}; border-left:5pt solid ${THEME.blue}; padding:10pt 14pt; font-family:${FONT};">
          <div style="font-size:10.5pt; font-weight:bold; color:${THEME.navy};">${esc(mat.title)}</div>
          <div style="font-size:8pt; font-weight:bold; color:${THEME.indigo}; letter-spacing:0.6pt; margin:2pt 0 4pt 0;">${esc(mat.tipo)}</div>
          <div style="font-size:9.5pt; color:${THEME.text}; line-height:1.35; margin-bottom:4pt;">${esc(mat.description)}</div>
          ${mat.accessUrl ? `<div style="font-size:9pt; font-weight:bold;"><a href="${esc(mat.accessUrl)}" style="color:${THEME.indigo};">${esc(mat.accessAction)} →</a></div>` : ''}
        </td></tr>
      </table>`;
  });
  return `${html}</div>`;
};

/** Página de índice (estilo libro). */
const renderIndex = (toc) => {
  if (!toc || toc.length < 2) return '';
  const filas = toc.map((e) => `
    <tr>
      <td style="width:44pt; padding:11pt 6pt; border-bottom:0.75pt solid ${THEME.border}; font-size:16pt; font-weight:bold; color:${THEME.indigo}; font-family:${FONT};">${String(e.n).padStart(2, '0')}</td>
      <td style="padding:11pt 6pt; border-bottom:0.75pt solid ${THEME.border}; font-size:13pt; font-weight:bold; color:${THEME.navy}; font-family:${FONT};"><a href="#cap-${e.n}" style="color:${THEME.navy}; text-decoration:none;">${esc(e.titulo)}</a></td>
    </tr>`).join('');
  return `
    <div style="font-size:8.5pt; font-weight:bold; color:${THEME.indigo}; letter-spacing:1.8pt; font-family:${FONT};">ÍNDICE</div>
    <h1 style="color:${THEME.navy}; font-size:26pt; font-weight:bold; margin:4pt 0 8pt 0; font-family:${FONT}; background:none; border:none; padding:0;">Contenido de esta guía</h1>
    ${stripeHtml('4pt')}
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; margin-top:14pt;">${filas}</table>
    <br style="page-break-before:always; mso-break-type:page-break;" clear="all">`;
};

/** Última página: notas del docente con renglones. */
const renderNotesPage = () => {
  const renglones = (n) => Array.from({ length: n }, () => `<tr><td style="height:24pt; border-bottom:0.75pt solid ${THEME.border}; font-size:1pt;">&nbsp;</td></tr>`).join('');
  const bloque = (titulo) => `
    <div style="font-size:11pt; font-weight:bold; color:${THEME.indigo}; margin:14pt 0 0 0; font-family:${FONT};">${titulo}</div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%;">${renglones(4)}</table>`;
  return `
    <div style="page-break-before:always;">
      <h2 style="color:${THEME.navy}; font-size:14pt; font-weight:bold; background:${THEME.soft}; border-left:6pt solid ${THEME.indigo}; padding:6pt 12pt; margin:0 0 6pt 0; font-family:${FONT};">Notas y reflexiones del docente</h2>
      <p style="font-size:9.5pt; color:${THEME.muted}; margin:0; font-family:${FONT};">Espacio para anotar lo que ocurrió en el aula y mejorar tu próxima clase.</p>
      ${bloque('Lo que funcionó')}
      ${bloque('Lo que ajustaré')}
      ${bloque('Ideas para la próxima clase')}
    </div>`;
};
/** Codifica texto UTF-8 en base64 (en bloques, para textos largos). */
const utf8ToBase64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
};

const wrap76 = (b64) => b64.replace(/(.{76})/g, '$1\r\n');

/**
 * Empaqueta el HTML y las imágenes como MHTML (multipart/related), que Word abre
 * mostrando las imágenes incrustadas sin depender de archivos externos.
 */
const buildMhtml = (html, images) => {
  const boundary = '----=_NextPart_InspiraTEC_001';
  const parts = [
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary="${boundary}"; type="text/html"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: base64',
    `Content-Location: ${BASE_LOCATION}/plan.htm`,
    '',
    wrap76(utf8ToBase64(html))
  ];
  images.forEach(({ name, mime, base64 }) => {
    parts.push('', `--${boundary}`, `Content-Type: ${mime}`, 'Content-Transfer-Encoding: base64', `Content-Location: ${BASE_LOCATION}/${name}`, '', wrap76(base64));
  });
  parts.push('', `--${boundary}--`, '');
  return parts.join('\r\n');
};

/**
 * Genera y descarga el documento en formato Microsoft Word (.doc).
 */
export const exportPlanToWord = async ({
  plan = {},
  markdown = '',
  userProfile = null,
  planId = null
}) => {
  const validation = validatePlanForExport(plan, markdown);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Contenido curricular no apto para exportar a Word.');
  }

  const documentModel = adaptPlanDocument({ plan, markdown, userProfile, planId });
  const { tema, grado, materia, fecha, rubricasTextuales, materialesGenerados } = documentModel;

  // Imágenes de marca: se incrustan por Content-Location
  const assets = await loadExportAssets();
  const imgs = {};
  const imageParts = [];
  [['logo', 'logo.png'], ['banner', 'banner.jpg']].forEach(([key, name]) => {
    const parsed = splitDataUrl(assets[key]);
    if (parsed) {
      imgs[key] = `${BASE_LOCATION}/${name}`;
      imageParts.push({ name, ...parsed });
    }
  });

  const enrichedMarkdown = formatCurricularMarkdown(documentModel.cleanMarkdown, { forExport: true });
  let rawHtml = marked.parse(enrichedMarkdown, { gfm: true });
  // El título del plan ya está en la portada: se quita el primer H1 duplicado
  rawHtml = rawHtml.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  const toc = [];
  const styledBodyHtml = styleHtmlForWord(rawHtml, toc);

  const wordDocumentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns:m='http://schemas.microsoft.com/office/2004/12/omml'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${esc(tema || 'Plan de clase')} - InspiraTEC</title>
      <!--[if gte mso 9]>
      <xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 21.0cm 29.7cm;
          margin: 2.2cm 2.5cm 2.2cm 2.5cm;
          mso-header-margin: 30pt;
          mso-footer-margin: 30pt;
          mso-title-page: yes;
          mso-header: url("#h1") h1;
          mso-footer: url("#f1") f1;
          mso-first-header: url("#fh1") fh1;
          mso-first-footer: url("#ff1") ff1;
          mso-paper-source: 0;
        }
        div.Section1 { page: Section1; font-family: ${FONT}; }
        body { font-family: ${FONT}; font-size: 10.5pt; color: ${THEME.text}; line-height: 1.45; background: #FFFFFF; }
        table { mso-displayed-decimal-separator: ","; mso-displayed-thousand-separator: "."; }
      </style>
    </head>
    <body>
      <!-- Encabezado de la portada (vacío) y pie de la portada (vacío) -->
      <div style="mso-element:header-first" id="fh1"><p style="margin:0;">&nbsp;</p></div>
      <div style="mso-element:footer-first" id="ff1"><p style="margin:0;">&nbsp;</p></div>

      <!-- Encabezado de páginas internas -->
      <div style="mso-element:header" id="h1">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:6pt;">
          <tr>
            <td style="font-size:11pt; font-weight:bold; border:none; padding:0; font-family:${FONT};"><span style="color:${THEME.navy};">Inspira</span><span style="color:${THEME.indigo};">TEC</span></td>
            <td style="font-size:8.5pt; color:${THEME.muted}; text-align:right; border:none; padding:0; font-family:${FONT};">${esc(clip(tema, 60))}</td>
          </tr>
          <tr><td colspan="2" style="border-bottom:1.5pt solid ${THEME.indigo}; height:2pt; font-size:1pt; padding:0;">&nbsp;</td></tr>
        </table>
      </div>

      <!-- Pie con paginación nativa -->
      <div style="mso-element:footer" id="f1">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-top:6pt;">
          <tr><td colspan="2" style="border-top:0.75pt solid ${THEME.border}; height:2pt; font-size:1pt; padding:0;">&nbsp;</td></tr>
          <tr>
            <td style="font-size:8.5pt; color:${THEME.muted}; border:none; padding:4pt 0 0 0; font-family:${FONT};">${esc([materia, grado ? `Grado ${grado}` : ''].filter(Boolean).join('  ·  '))}</td>
            <td style="font-size:8.5pt; font-weight:bold; color:${THEME.indigo}; text-align:right; border:none; padding:4pt 0 0 0; font-family:${FONT};">Página <span style="mso-field-code: PAGE "></span> de <span style="mso-field-code: NUMPAGES "></span></td>
          </tr>
        </table>
      </div>

      <div class="Section1">
        ${renderCover(documentModel, imgs)}
        ${renderIndex(toc)}
        <div class="document-content">${styledBodyHtml}</div>
        ${renderWordRubricas(rubricasTextuales)}
        ${renderWordMateriales(materialesGenerados)}
        ${renderNotesPage()}
      </div>
    </body>
    </html>
  `;

  const filename = buildWordFilename({ tema, grado, fecha });
  const blob = new Blob([buildMhtml(wordDocumentHtml, imageParts)], { type: 'application/msword' });
  downloadBlob(blob, filename);

  return { success: true, filename };
};
