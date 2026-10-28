/**
 * Plantilla editorial institucional de INSPIRATEC para pdfmake.
 * Define la paleta de color aprobada, márgenes editoriales A4, encabezados y pies discretos,
 * numeración de páginas, bloques de metadatos curriculares, tablas y anexos de rúbricas.
 */

// Paleta cromática oficial de INSPIRATEC
const PALETTE = {
  petroleumDark: '#142B25',     // Verde petróleo institucional principal
  petroleumActive: '#315B54',   // Verde petróleo interactivo / subtítulos
  sageBrand: '#477A72',         // Verde salvia corporativo
  sageLight: '#EDF3F1',         // Salvia muy claro para fondos de tablas y cabeceras
  sageBorder: '#D1DBD7',        // Bordes discretos
  parchmentBg: '#FFFDF9',       // Marfil cálido
  textMain: '#1C1917',          // Texto principal de alto contraste
  textMuted: '#576864',         // Texto secundario / metadatos
  textLight: '#FFFFFF',         // Blanco
  divider: '#E2E8F0',           // Líneas sutiles
  borderCard: '#CBD5E1'
};

/**
 * Genera la definición completa de documento para pdfmake.
 *
 * @param {Object} documentModel - Modelo de documento retornado por adaptPlanDocument.
 * @param {Array} contentBlocks - Bloques de contenido normalizados desde Markdown.
 * @returns {Object} Definición de documento compatible con pdfmake.createPdf().
 */
export const buildInspiratecDocumentDefinition = (documentModel, contentBlocks) => {
  const {
    tema,
    rubricasTextuales,
    materialesGenerados
  } = documentModel;

  const content = [];

  // =========================================================================
  // CUERPO PRINCIPAL DEL PLAN DE CLASE (Bloques Markdown normalizados)
  // Se renderiza directamente el contenido del plan sin portadas ni fichas duplicadas
  // =========================================================================
  content.push(...contentBlocks);

  // =========================================================================
  // 5. ANEXO ESPECIAL: RÚBRICAS DE EVALUACIÓN (Tablas PDF reales paginadas)
  // =========================================================================
  if (rubricasTextuales && rubricasTextuales.length > 0) {
    content.push(
      { text: '', margin: [0, 16, 0, 0] },
      {
        text: 'Anexo: Rúbrica de Evaluación de Desempeño',
        style: 'headingSection',
        keepWithNext: true,
        pageBreak: content.length > 15 ? 'before' : undefined
      },
      {
        text: 'Criterios formativos y niveles de logro para la valoración integral de las competencias desarrolladas.',
        style: 'paragraph',
        color: PALETTE.textMuted,
        margin: [0, 0, 0, 12]
      }
    );

    rubricasTextuales.forEach((rubrica) => {
      if (rubrica.title && rubrica.title !== 'Rúbrica de Evaluación') {
        content.push({ text: rubrica.title, style: 'headingSubsection', keepWithNext: true });
      }

      const numCols = Math.max(rubrica.headers.length, ...(rubrica.rows.map(r => r.length)));
      const widths = Array(numCols).fill('*');

      const tableBody = [];
      if (rubrica.headers && rubrica.headers.length > 0) {
        tableBody.push(
          rubrica.headers.map(h => ({
            text: h,
            style: 'tableHeaderCell',
            fillColor: PALETTE.sageLight,
            bold: true
          }))
        );
      }

      rubrica.rows.forEach(r => {
        tableBody.push(
          r.map((cellText, cellIdx) => ({
            text: cellText,
            style: 'tableBodyCell',
            bold: cellIdx === 0 // Resalta el nombre del criterio
          }))
        );
      });

      content.push({
        table: {
          headerRows: 1,
          dontBreakRows: true, // No corta filas a mitad de página
          widths,
          body: tableBody
        },
        layout: {
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.5),
          vLineWidth: () => 0.5,
          hLineColor: (i) => (i === 1 ? PALETTE.petroleumActive : PALETTE.sageBorder),
          vLineColor: () => PALETTE.divider,
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 6,
          paddingBottom: () => 6
        },
        margin: [0, 6, 0, 20]
      });
    });
  }

  // =========================================================================
  // 6. MATERIALES COMPLEMENTARIOS GENERADOS (Con enlaces funcionales reales)
  // =========================================================================
  if (materialesGenerados && materialesGenerados.length > 0) {
    content.push(
      {
        text: 'Materiales Didácticos Complementarios Generados',
        style: 'headingSection',
        keepWithNext: true,
        margin: [0, 20, 0, 8]
      },
      {
        text: 'Los siguientes recursos fueron generados en la sesión pedagógica y están disponibles para visualización y descarga interactiva en la plataforma.',
        style: 'paragraph',
        color: PALETTE.textMuted,
        margin: [0, 0, 0, 14]
      }
    );

    const matRows = materialesGenerados.map(m => {
      const linkBlock = m.accessUrl
        ? {
            text: `▶ ${m.accessAction}`,
            link: m.accessUrl,
            color: PALETTE.petroleumActive,
            bold: true,
            decoration: 'underline',
            fontSize: 9.5
          }
        : {
            text: 'Disponible en la sesión activa del Editor INSPIRATEC',
            italics: true,
            color: PALETTE.textMuted,
            fontSize: 9
          };

      return [
        {
          stack: [
            { text: m.title, bold: true, color: PALETTE.petroleumDark, fontSize: 10.5 },
            { text: `Tipo: ${m.tipo}`, color: PALETTE.textMuted, fontSize: 8.5, margin: [0, 2, 0, 4] },
            { text: m.description, color: PALETTE.textMain, fontSize: 9, margin: [0, 0, 0, 6] },
            linkBlock
          ],
          fillColor: '#FAFAF8',
          margin: [4, 6, 4, 6]
        }
      ];
    });

    content.push({
      table: {
        widths: ['*'],
        body: matRows
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => PALETTE.sageBorder,
        vLineColor: () => PALETTE.sageBorder,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 6,
        paddingBottom: () => 6
      },
      margin: [0, 4, 0, 20]
    });
  }

  // =========================================================================
  // 7. DEFINICIÓN DEL DOCUMENTO (A4, márgenes, encabezados y pies dinámicos)
  // =========================================================================
  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [48, 54, 48, 52],

    // Encabezado institucional dinámico en todas las páginas
    header: () => {
      return {
        margin: [48, 20, 48, 0],
        columns: [
          {
            text: 'INSPIRATEC · Planificación Curricular',
            fontSize: 8.5,
            color: PALETTE.textMuted,
            bold: true
          },
          {
            text: tema ? (tema.length > 45 ? `${tema.substring(0, 45)}...` : tema) : '',
            fontSize: 8.5,
            color: PALETTE.textMuted,
            alignment: 'right'
          }
        ]
      };
    },

    // Pie de página con numeración y leyendas oficiales
    footer: (currentPage, pageCount) => {
      return {
        margin: [48, 16, 48, 0],
        stack: [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 0.5,
                lineColor: PALETTE.divider
              }
            ],
            margin: [0, 0, 0, 6]
          },
          {
            columns: [
              {
                text: 'Documento Curricular Oficial — INSPIRATEC',
                fontSize: 8,
                color: PALETTE.textMuted
              },
              {
                text: `Página ${currentPage} de ${pageCount}`,
                fontSize: 8,
                color: PALETTE.textMuted,
                alignment: 'right'
              }
            ]
          }
        ]
      };
    },

    // Estilos tipográficos y visuales de la identidad INSPIRATEC
    styles: {
      // Portada
      coverKicker: {
        fontSize: 16,
        bold: true,
        color: PALETTE.textLight,
        letterSpacing: 2
      },
      coverSubKicker: {
        fontSize: 7.5,
        color: PALETTE.sageLight,
        letterSpacing: 1.5,
        margin: [0, 3, 0, 0]
      },
      coverTag: {
        fontSize: 9,
        bold: true,
        color: PALETTE.sageBrand,
        letterSpacing: 1.5,
        margin: [0, 0, 0, 6]
      },
      coverTitle: {
        fontSize: 26,
        bold: true,
        color: PALETTE.petroleumDark,
        lineHeight: 1.2
      },
      coverMetaLabel: {
        fontSize: 8.5,
        bold: true,
        color: PALETTE.petroleumActive,
        letterSpacing: 0.5
      },
      coverMetaValue: {
        fontSize: 10,
        color: PALETTE.textMain
      },
      coverFooterNote: {
        fontSize: 8.5,
        color: PALETTE.textMuted,
        italics: true
      },

      // Banner compacto para documentos sin portada
      compactBannerBrand: {
        fontSize: 8.5,
        bold: true,
        color: PALETTE.petroleumActive,
        letterSpacing: 1
      },
      compactBannerDate: {
        fontSize: 8.5,
        color: PALETTE.textMuted
      },
      compactBannerTitle: {
        fontSize: 18,
        bold: true,
        color: PALETTE.petroleumDark,
        margin: [0, 4, 0, 6],
        lineHeight: 1.2
      },
      compactBannerMeta: {
        fontSize: 9.5,
        color: PALETTE.petroleumDark
      },

      // Ficha técnica
      techTableKey: {
        fontSize: 9,
        bold: true,
        color: PALETTE.petroleumDark
      },
      techTableVal: {
        fontSize: 9,
        color: PALETTE.textMain,
        lineHeight: 1.3
      },

      // Encabezados de contenido
      headingSection: {
        fontSize: 14,
        bold: true,
        color: PALETTE.petroleumDark,
        margin: [0, 16, 0, 8]
      },
      headingSubsection: {
        fontSize: 12,
        bold: true,
        color: PALETTE.petroleumActive,
        margin: [0, 12, 0, 6]
      },
      headingMinor: {
        fontSize: 10.5,
        bold: true,
        color: PALETTE.textMain,
        margin: [0, 8, 0, 4]
      },

      // Párrafos y listas
      paragraph: {
        fontSize: 10,
        lineHeight: 1.45,
        color: PALETTE.textMain,
        margin: [0, 0, 0, 8]
      },
      listItem: {
        fontSize: 10,
        lineHeight: 1.35,
        color: PALETTE.textMain,
        margin: [0, 1.5, 0, 1.5]
      },
      unorderedList: {
        margin: [0, 2, 0, 8]
      },
      orderedList: {
        margin: [0, 2, 0, 8]
      },

      // Tablas
      tableContainer: {
        margin: [0, 6, 0, 12]
      },
      tableHeaderCell: {
        fontSize: 9,
        bold: true,
        color: PALETTE.petroleumDark
      },
      tableBodyCell: {
        fontSize: 9,
        color: PALETTE.textMain,
        lineHeight: 1.3
      },

      // Citas y código
      blockquoteCell: {
        fontSize: 9.5,
        italics: true,
        color: PALETTE.petroleumActive,
        lineHeight: 1.35
      },
      codeBlockCell: {
        fontSize: 8.5,
        font: 'Roboto',
        color: '#1E293B',
        lineHeight: 1.3
      }
    },

    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      lineHeight: 1.4,
      color: PALETTE.textMain
    },

    content
  };
};
