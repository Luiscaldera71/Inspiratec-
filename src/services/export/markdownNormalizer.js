/**
 * Normalizador de Markdown a bloques de estructura para pdfmake en INSPIRATEC.
 * Transforma el AST de Markdown en definiciones nativas de pdfmake conservando
 * jerarquías, listas anidadas, tablas GFM paginadas, estilos tipográficos
 * y caracteres en español (tildes, ñ, signos de puntuación).
 */

import { marked } from 'marked';
import { formatCurricularMarkdown } from './curricularMarkdownFormatter.js';

/**
 * Limpia emojis incompatibles con fuentes estándar de PDF (Roboto/Type1)
 * preservando todas las letras con tildes, diéresis, eñes, símbolos y puntuación en español.
 */
export const cleanEmojis = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

/**
 * Decodifica entidades HTML básicas para evitar secuencias no deseadas.
 */
const decodeHtmlEntities = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
};

/**
 * Procesa tokens inline (negrita, cursiva, código, enlaces, texto plano).
 */
export const processInlineTokens = (tokens) => {
  if (!tokens || !Array.isArray(tokens)) return [];

  const results = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
      case 'escape': {
        const textVal = decodeHtmlEntities(token.text || token.raw || '');
        if (textVal) {
          results.push({ text: textVal });
        }
        break;
      }

      case 'strong': {
        const childInlines = token.tokens ? processInlineTokens(token.tokens) : [{ text: token.text }];
        results.push({
          text: childInlines,
          bold: true
        });
        break;
      }

      case 'em': {
        const childInlines = token.tokens ? processInlineTokens(token.tokens) : [{ text: token.text }];
        results.push({
          text: childInlines,
          italics: true
        });
        break;
      }

      case 'codespan': {
        results.push({
          text: ` ${decodeHtmlEntities(token.text)} `,
          font: 'Roboto',
          background: '#F1F5F9',
          color: '#1E293B',
          fontSize: 9.5
        });
        break;
      }

      case 'link': {
        const linkInlines = token.tokens ? processInlineTokens(token.tokens) : [{ text: token.text || token.href }];
        results.push({
          text: linkInlines,
          link: token.href,
          color: '#284A44',
          decoration: 'underline'
        });
        break;
      }

      case 'del': {
        results.push({
          text: decodeHtmlEntities(token.text),
          decoration: 'lineThrough'
        });
        break;
      }

      case 'br': {
        results.push({ text: '\n' });
        break;
      }

      case 'html': {
        // Extracción segura de texto del HTML ignorando etiquetas de scripts
        const cleanText = (token.raw || '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleanText) {
          results.push({ text: decodeHtmlEntities(cleanText) });
        }
        break;
      }

      default:
        if (token.text) {
          results.push({ text: decodeHtmlEntities(token.text) });
        }
        break;
    }
  }

  return results;
};

/**
 * Convierte una lista y sus elementos anidados a la estructura pdfmake.
 */
const processList = (listToken) => {
  const isOrdered = Boolean(listToken.ordered);
  const items = [];

  for (const item of listToken.items) {
    const itemContents = [];

    if (item.tokens && Array.isArray(item.tokens)) {
      for (const child of item.tokens) {
        if (child.type === 'text') {
          const inlineProcessed = child.tokens ? processInlineTokens(child.tokens) : [{ text: child.text }];
          itemContents.push({ text: inlineProcessed, style: 'listItem' });
        } else if (child.type === 'paragraph') {
          const inlineProcessed = child.tokens ? processInlineTokens(child.tokens) : [{ text: child.text }];
          itemContents.push({ text: inlineProcessed, style: 'listItem' });
        } else if (child.type === 'list') {
          itemContents.push(processList(child));
        }
      }
    } else {
      itemContents.push({ text: decodeHtmlEntities(item.text), style: 'listItem' });
    }

    items.push(itemContents.length === 1 ? itemContents[0] : { stack: itemContents });
  }

  return isOrdered ? { ol: items, style: 'orderedList' } : { ul: items, style: 'unorderedList' };
};

/**
 * Convierte una tabla GFM a una tabla nativa de pdfmake con encabezados repetidos
 * y prevención de saltos de fila arbitrarios.
 */
const processTable = (tableToken) => {
  const headerCols = tableToken.header || [];
  const rows = tableToken.rows || [];
  const aligns = tableToken.align || [];

  const colCount = Math.max(headerCols.length, ...(rows.map(r => r.length)));
  if (colCount === 0) return null;

  // Anchos proporcionales optimizados según el tipo de tabla pedagógica
  let widths = Array(colCount).fill('*');
  if (colCount === 3) {
    // Tabla canónica de Momentos de la clase | Actividades | Mediación (Recursos)
    widths = ['20%', '48%', '32%'];
  } else if (colCount === 2) {
    widths = ['28%', '72%'];
  }

  // Fila de encabezado
  const headerRow = headerCols.map((col, idx) => {
    const inlineCells = col.tokens ? processInlineTokens(col.tokens) : [{ text: col.text || '' }];
    const align = aligns[idx] || 'left';
    return {
      text: inlineCells,
      style: 'tableHeaderCell',
      alignment: align,
      bold: true,
      fillColor: '#EDF3F1' // Verde salvia suave corporativo
    };
  });

  // Filas del cuerpo con negrita garantizada en momentos (Inicio, Desarrollo, Cierre) y criterios
  const bodyRows = rows.map((row) => {
    return row.map((cell, idx) => {
      const inlineCells = cell.tokens ? processInlineTokens(cell.tokens) : [{ text: cell.text || '' }];
      const align = aligns[idx] || 'left';
      const cellText = (cell.text || '').trim();
      const isMoment = /^(inicio|desarrollo|cierre|fase|momento|apertura|criterio)/i.test(cellText);
      const isFirstColLabel = idx === 0 && (isMoment || cellText.length < 32);

      return {
        text: inlineCells,
        style: 'tableBodyCell',
        alignment: align,
        bold: (isMoment || isFirstColLabel) ? true : undefined,
        fillColor: isMoment ? '#F8FAF9' : undefined
      };
    });
  });

  const fullBody = [];
  if (headerRow.length > 0) {
    fullBody.push(headerRow);
  }
  fullBody.push(...bodyRows);

  return {
    table: {
      headerRows: headerRow.length > 0 ? 1 : 0,
      dontBreakRows: true, // Evita cortar filas por la mitad en saltos de página
      widths,
      body: fullBody
    },
    layout: {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.5),
      vLineWidth: () => 0.5,
      hLineColor: (i) => (i === 1 ? '#315B54' : '#D1DBD7'),
      vLineColor: () => '#E2E8F0',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 7,
      paddingBottom: () => 7
    },
    style: 'tableContainer'
  };
};

/**
 * Normaliza una cadena de Markdown a un array de elementos de contenido pdfmake.
 *
 * @param {string} markdownText - Texto Markdown a procesar.
 * @returns {Array} Bloques de contenido compatibles con pdfmake.
 */
export const normalizeMarkdownToPdfBlocks = (markdownText) => {
  if (!markdownText || typeof markdownText !== 'string') return [];

  // 1. Normalizar negrillas de apartados curriculares y limpiar marcadores de IA
  const cleanSource = formatCurricularMarkdown(markdownText, { forExport: true });

  // 2. Lexing con marked
  const tokens = marked.lexer(cleanSource, { gfm: true });
  const contentBlocks = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const cleanTitle = cleanEmojis(token.text);
        const headingInlines = token.tokens ? processInlineTokens(token.tokens) : [{ text: cleanTitle }];

        // Determinar nivel de estilo según profundidad
        const styleName = token.depth <= 2 
          ? 'headingSection' 
          : (token.depth === 3 ? 'headingSubsection' : 'headingMinor');

        contentBlocks.push({
          text: headingInlines,
          style: styleName,
          headlineLevel: token.depth,
          keepWithNext: true // Mantiene el título unido al contenido siguiente
        });
        break;
      }

      case 'paragraph': {
        const inlines = processInlineTokens(token.tokens);
        if (inlines.length > 0) {
          contentBlocks.push({
            text: inlines,
            style: 'paragraph'
          });
        }
        break;
      }

      case 'list': {
        const listBlock = processList(token);
        if (listBlock) {
          contentBlocks.push(listBlock);
        }
        break;
      }

      case 'table': {
        const tableBlock = processTable(token);
        if (tableBlock) {
          contentBlocks.push(tableBlock);
        }
        break;
      }

      case 'blockquote': {
        const quoteInlines = [];
        if (token.tokens) {
          for (const sub of token.tokens) {
            if (sub.tokens) {
              quoteInlines.push(...processInlineTokens(sub.tokens));
            } else if (sub.text) {
              quoteInlines.push({ text: sub.text });
            }
          }
        }
        contentBlocks.push({
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: quoteInlines.length > 0 ? quoteInlines : [{ text: token.text || '' }],
                  style: 'blockquoteCell'
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: (i) => (i === 0 ? 3.5 : 0),
            vLineColor: () => '#477A72',
            paddingLeft: () => 12,
            paddingRight: () => 8,
            paddingTop: () => 4,
            paddingBottom: () => 4
          },
          style: 'blockquoteWrapper'
        });
        break;
      }

      case 'code': {
        contentBlocks.push({
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: token.text,
                  style: 'codeBlockCell',
                  fillColor: '#F8FAFC'
                }
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#E2E8F0',
            vLineColor: () => '#E2E8F0',
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 8,
            paddingBottom: () => 8
          },
          style: 'codeBlockWrapper'
        });
        break;
      }

      case 'hr': {
        contentBlocks.push({
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 4,
              x2: 500,
              y2: 4,
              lineWidth: 0.5,
              lineColor: '#CBD5E1'
            }
          ],
          margin: [0, 8, 0, 12]
        });
        break;
      }

      case 'space':
      default:
        // Espaciador o token no renderizable directamente
        break;
    }
  }

  return contentBlocks;
};
