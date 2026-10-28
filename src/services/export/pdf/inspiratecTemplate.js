/**
 * Plantilla editorial de InspiraTEC para pdfmake (rediseño).
 * - Portada con banner del robot, logo, título, ficha con íconos y objetivo.
 * - Páginas internas con encabezado de marca, secciones en tarjetas de color,
 *   tablas con cabecera azul, citas destacadas y numeración en pie.
 * - Anexos de rúbricas y materiales con el mismo lenguaje visual y sello final.
 */
import { THEME, svgIcon } from '../exportTheme.js';
import { headingCard } from './pdfBlocks.js';

const PAGE_W = 595.28;
const BANNER_H = (PAGE_W * 755) / 2083;
const SLOGAN = 'Docentes que transforman con tecnología';

const clip = (text, max) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

/** Portada a página completa (elementos con posición absoluta). */
const buildCover = (model, assets) => {
  const { tema, materia, grado, duracion, docente, institucion, fecha, numEstudiantes, metodologiaSTEAM, objetivos } = model;
  const cover = [];

  // Banner superior (o banda de color si no hay imagen) y franja degradada
  if (assets.banner) {
    cover.push({ image: 'banner', width: PAGE_W, absolutePosition: { x: 0, y: 0 } });
  } else {
    cover.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: PAGE_W, h: BANNER_H, color: THEME.navy }], absolutePosition: { x: 0, y: 0 } });
  }
  cover.push({
    canvas: THEME.stripe.map((color, i) => ({ type: 'rect', x: (i * PAGE_W) / THEME.stripe.length, y: 0, w: PAGE_W / THEME.stripe.length + 1, h: 7, color })),
    absolutePosition: { x: 0, y: BANNER_H - 1 }
  });

  // Tarjeta con el logo, a caballo entre el banner y el contenido
  if (assets.logo) {
    cover.push({
      canvas: [{ type: 'rect', x: 0, y: 0, w: 156, h: 92, r: 16, color: '#FFFFFF', lineColor: THEME.border, lineWidth: 1 }],
      absolutePosition: { x: 36, y: BANNER_H - 46 }
    });
    cover.push({ image: 'logo', width: 128, absolutePosition: { x: 50, y: BANNER_H - 38 } });
  }

  // Ficha de datos con íconos
  const info = [
    ['user', 'Docente', docente],
    ['school', 'Institución', institucion],
    ['book', 'Área', materia],
    ['grade', 'Grado', grado],
    ['clock', 'Duración', duracion],
    ['users', 'Estudiantes', numEstudiantes],
    ['calendar', 'Fecha', fecha],
    ['spark', 'Enfoque', metodologiaSTEAM]
  ].filter(([, , v]) => v && String(v).trim());

  const cells = info.map(([icon, label, value]) => ({
    columns: [
      { ...svgIcon(icon, THEME.indigo, 16), margin: [0, 1, 0, 0] },
      {
        width: '*',
        stack: [
          { text: label.toUpperCase(), fontSize: 7, bold: true, color: THEME.indigo, characterSpacing: 0.8 },
          { text: clip(value, 60), fontSize: 10, bold: true, color: THEME.navy, margin: [0, 2, 0, 0] }
        ]
      }
    ],
    columnGap: 9,
    fillColor: THEME.soft
  }));

  const rows = [];
  for (let i = 0; i < cells.length; i += 2) {
    rows.push([cells[i], cells[i + 1] || { text: '', fillColor: '#FFFFFF' }]);
  }

  const subtitle = [materia, grado ? `Grado ${grado}` : '', duracion].filter(Boolean).join('  ·  ');

  const stack = [
    { text: '  GUÍA DE CLASE  ', background: THEME.soft, color: THEME.indigo, bold: true, fontSize: 8.5, characterSpacing: 1.4 },
    { text: clip(tema, 120) || 'Secuencia didáctica', fontSize: 27, bold: true, color: THEME.navy, lineHeight: 1.12, margin: [0, 10, 0, 6] },
    subtitle ? { text: subtitle, fontSize: 11.5, color: THEME.muted, margin: [0, 0, 0, 18] } : { text: '', margin: [0, 0, 0, 14] }
  ];

  if (rows.length) {
    stack.push({
      table: { widths: ['*', '*'], body: rows },
      layout: {
        hLineWidth: (i, node) => (i > 0 && i < node.table.body.length ? 8 : 0),
        vLineWidth: (i) => (i === 1 ? 8 : 0),
        hLineColor: () => '#FFFFFF',
        vLineColor: () => '#FFFFFF',
        paddingLeft: () => 12,
        paddingRight: () => 12,
        paddingTop: () => 10,
        paddingBottom: () => 10
      }
    });
  }

  const objetivo = clip(objetivos, 320);
  if (objetivo) {
    stack.push({
      table: {
        widths: [4, '*'],
        body: [[
          { text: '', fillColor: THEME.violet },
          {
            stack: [
              { text: 'OBJETIVO', fontSize: 7.5, bold: true, color: THEME.violet, characterSpacing: 1 },
              { text: objetivo, fontSize: 10, color: THEME.text, lineHeight: 1.4, margin: [0, 3, 0, 0] }
            ],
            fillColor: '#F5F2FF'
          }
        ]]
      },
      layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: (i) => (i === 1 ? 14 : 0), paddingRight: () => 14, paddingTop: () => 10, paddingBottom: () => 10 },
      margin: [0, 14, 0, 0]
    });
  }

  cover.push({ absolutePosition: { x: 44, y: BANNER_H + 74 }, stack });

  // Banda inferior de marca
  cover.push({
    canvas: [
      { type: 'rect', x: 0, y: 0, w: PAGE_W, h: 118, color: THEME.navy },
      ...THEME.stripe.map((color, i) => ({ type: 'rect', x: (i * PAGE_W) / THEME.stripe.length, y: 0, w: PAGE_W / THEME.stripe.length + 1, h: 4, color }))
    ],
    absolutePosition: { x: 0, y: 723.89 }
  });
  cover.push({
    absolutePosition: { x: 44, y: 752 },
    columns: [
      { width: '*', text: [{ text: 'Creado con ', color: '#C9D3FF' }, { text: 'InspiraTEC', bold: true, color: '#FFFFFF' }], fontSize: 12 },
      { width: 'auto', text: SLOGAN, fontSize: 9, color: '#C9D3FF', alignment: 'right', margin: [0, 3, 0, 0] }
    ]
  });

  cover.push({ text: '', pageBreak: 'after' });
  return cover;
};

/** Página de índice (estilo libro): capítulos numerados con su página. */
const buildIndex = (toc) => [
  { text: 'ÍNDICE', fontSize: 8.5, bold: true, color: THEME.indigo, characterSpacing: 1.8 },
  { text: 'Contenido de esta guía', fontSize: 26, bold: true, color: THEME.navy, margin: [0, 4, 0, 8] },
  { canvas: THEME.stripe.map((color, i) => ({ type: 'rect', x: i * 26, y: 0, w: 26, h: 3.5, color })), margin: [0, 0, 0, 14] },
  {
    table: {
      widths: [38, '*', 48],
      body: toc.map((e) => [
        { text: String(e.numero).padStart(2, '0'), bold: true, color: THEME.indigo, fontSize: 15, margin: [0, 1, 0, 0] },
        { text: e.titulo, linkToDestination: e.id, bold: true, color: THEME.navy, fontSize: 12.5 },
        { pageReference: e.id, alignment: 'right', color: THEME.muted, fontSize: 11, margin: [0, 2, 0, 0] }
      ])
    },
    layout: {
      hLineWidth: (i, node) => (i > 0 && i < node.table.body.length ? 0.7 : 0),
      vLineWidth: () => 0,
      hLineColor: () => THEME.border,
      paddingLeft: () => 4,
      paddingRight: () => 4,
      paddingTop: () => 11,
      paddingBottom: () => 11
    }
  },
  { text: '', pageBreak: 'after' }
];

/** Última página: notas del docente con renglones, como una guía de trabajo. */
const buildNotesPage = () => {
  const bloque = (titulo, renglones) => ([
    { text: titulo, bold: true, color: THEME.indigo, fontSize: 11, margin: [0, 14, 0, 2] },
    { canvas: Array.from({ length: renglones }, (_, i) => ({ type: 'line', x1: 0, y1: 26 + i * 28, x2: 507, y2: 26 + i * 28, lineWidth: 0.6, lineColor: THEME.border })), margin: [0, 0, 0, 6] }
  ]);
  return [
    { ...headingCard([{ text: 'Notas y reflexiones del docente' }], 2), pageBreak: 'before' },
    { text: 'Espacio para anotar lo que ocurrió en el aula y mejorar tu próxima clase.', style: 'paragraph', color: THEME.muted },
    ...bloque('Lo que funcionó', 5),
    ...bloque('Lo que ajustaré', 5),
    ...bloque('Ideas para la próxima clase', 5)
  ];
};
/** Tabla de datos (rúbricas) con el estilo de la plantilla. */
const buildStyledTable = (headers, rows) => {
  const numCols = Math.max(headers.length, ...rows.map((r) => r.length));
  const body = [];
  if (headers.length > 0) {
    body.push(headers.map((h) => ({ text: h, style: 'tableHeaderCell', fillColor: THEME.indigo })));
  }
  rows.forEach((r, rIdx) => {
    body.push(r.map((cellText, cellIdx) => ({
      text: cellText,
      style: 'tableBodyCell',
      bold: cellIdx === 0,
      fillColor: cellIdx === 0 ? THEME.moment : (rIdx % 2 === 1 ? THEME.softer : undefined)
    })));
  });
  return {
    table: { headerRows: headers.length > 0 ? 1 : 0, dontBreakRows: true, widths: Array(numCols).fill('*'), body },
    layout: {
      hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 0.8 : 0.5),
      vLineWidth: () => 0.5,
      hLineColor: (i) => (i === 1 ? THEME.indigo : THEME.border),
      vLineColor: () => THEME.border,
      paddingLeft: () => 7,
      paddingRight: () => 7,
      paddingTop: () => 6,
      paddingBottom: () => 6
    },
    margin: [0, 6, 0, 18]
  };
};

/**
 * Genera la definición completa de documento para pdfmake.
 *
 * @param {Object} documentModel - Modelo retornado por adaptPlanDocument.
 * @param {Array} contentBlocks - Bloques de contenido normalizados desde Markdown.
 * @param {Object} [assets] - Imágenes de marca { logo, mark, banner } (data URL) o null.
 */
export const buildInspiratecDocumentDefinition = (documentModel, contentBlocks, assets = {}) => {
  const { tema, materia, grado, rubricasTextuales, materialesGenerados } = documentModel;
  const imgs = {};
  if (assets.logo) imgs.logo = assets.logo;
  if (assets.mark) imgs.mark = assets.mark;
  if (assets.banner) imgs.banner = assets.banner;

  const content = [...buildCover(documentModel, assets)];

  // Índice de capítulos (solo si el plan tiene varias secciones)
  const toc = contentBlocks.toc || [];
  if (toc.length >= 2) content.push(...buildIndex(toc));

  // El título del plan ya está en la portada: se omite el primer H1 duplicado
  const body = contentBlocks[0]?.headlineLevel === 1 ? contentBlocks.slice(1) : contentBlocks;
  // Cada capítulo se une con su primer párrafo o lista para que un título nunca quede solo al final de una página
  const agrupar = (bloques) => {
    const salida = [];
    for (let i = 0; i < bloques.length; i += 1) {
      const b = bloques[i];
      const sig = bloques[i + 1];
      if (b.headlineLevel && sig && (sig.ul || sig.ol || (sig.text !== undefined && !sig.table))) {
        salida.push({ stack: [b, sig], unbreakable: true });
        i += 1;
      } else {
        salida.push(b);
      }
    }
    return salida;
  };
  content.push(...agrupar(body));

  // Anexo: rúbricas
  if (rubricasTextuales && rubricasTextuales.length > 0) {
    content.push(
      { ...headingCard([{ text: 'Anexo · Rúbrica de evaluación de desempeño' }], 2), pageBreak: body.length > 15 ? 'before' : undefined },
      { text: 'Criterios formativos y niveles de logro para la valoración integral de las competencias desarrolladas.', style: 'paragraph', color: THEME.muted, margin: [0, 0, 0, 10] }
    );
    rubricasTextuales.forEach((rubrica) => {
      if (rubrica.title && rubrica.title !== 'Rúbrica de Evaluación') {
        content.push({ text: rubrica.title, style: 'headingSubsection', keepWithNext: true });
      }
      content.push(buildStyledTable(rubrica.headers || [], rubrica.rows || []));
    });
  }

  // Materiales complementarios
  if (materialesGenerados && materialesGenerados.length > 0) {
    content.push(
      headingCard([{ text: 'Materiales didácticos complementarios' }], 2),
      { text: 'Recursos generados en la sesión pedagógica, disponibles para visualizar y descargar en la plataforma.', style: 'paragraph', color: THEME.muted, margin: [0, 0, 0, 10] }
    );
    materialesGenerados.forEach((m) => {
      const link = m.accessUrl
        ? { text: `${m.accessAction}  →`, link: m.accessUrl, color: THEME.indigo, bold: true, fontSize: 9.5 }
        : { text: 'Disponible en la sesión activa del Editor InspiraTEC', italics: true, color: THEME.muted, fontSize: 9 };
      content.push({
        table: {
          widths: [4, '*'],
          body: [[
            { text: '', fillColor: THEME.blue },
            {
              stack: [
                { text: m.title, bold: true, color: THEME.navy, fontSize: 10.5 },
                { text: m.tipo, color: THEME.indigo, fontSize: 8, bold: true, characterSpacing: 0.6, margin: [0, 2, 0, 4] },
                { text: m.description, color: THEME.text, fontSize: 9, lineHeight: 1.35, margin: [0, 0, 0, 5] },
                link
              ],
              fillColor: THEME.softer
            }
          ]]
        },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: (i) => (i === 1 ? 12 : 0), paddingRight: () => 12, paddingTop: () => 9, paddingBottom: () => 9 },
        margin: [0, 0, 0, 8],
        unbreakable: true
      });
    });
  }

  content.push(...buildNotesPage());

  return {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [44, 74, 44, 62],
    info: { title: `${tema || 'Plan de clase'} · InspiraTEC`, author: 'InspiraTEC', subject: 'Plan de clase', creator: 'InspiraTEC' },
    images: imgs,

    // Encabezado: marca a la izquierda, tema a la derecha (no aparece en la portada)
    header: (currentPage) => {
      if (currentPage === 1) return null;
      return {
        margin: [44, 22, 44, 0],
        stack: [
          {
            columns: [
              assets.mark ? { image: 'mark', width: 24, margin: [0, -3, 6, 0] } : { width: 0, text: '' },
              { width: '*', text: [{ text: 'Inspira', bold: true, color: THEME.navy }, { text: 'TEC', bold: true, color: THEME.indigo }], fontSize: 11 },
              { width: 'auto', text: clip(tema, 60), fontSize: 8.5, color: THEME.muted, alignment: 'right', margin: [0, 3, 0, 0] }
            ],
            columnGap: 0
          },
          { canvas: [{ type: 'rect', x: 0, y: 6, w: 507, h: 1.2, color: THEME.border }, { type: 'rect', x: 0, y: 6, w: 70, h: 1.2, color: THEME.indigo }] }
        ]
      };
    },

    // Pie: contexto del plan y número de página en píldora
    footer: (currentPage, pageCount) => {
      if (currentPage === 1) return null;
      return {
        margin: [44, 18, 44, 0],
        columns: [
          { width: '*', text: [materia, grado ? `Grado ${grado}` : ''].filter(Boolean).join('  ·  '), fontSize: 8.5, color: THEME.muted, margin: [0, 4, 0, 0] },
          {
            width: 'auto',
            table: { body: [[{ text: `${currentPage} / ${pageCount}`, fontSize: 8.5, bold: true, color: '#FFFFFF', fillColor: THEME.indigo, alignment: 'center', margin: [8, 1, 8, 1] }]] },
            layout: 'noBorders'
          }
        ]
      };
    },

    styles: {
      headingSectionText: { fontSize: 13.5, bold: true, color: THEME.navy },
      headingSection: { fontSize: 14, bold: true, color: THEME.navy, margin: [0, 16, 0, 8] },
      headingSubsection: { fontSize: 11.5, bold: true, color: THEME.indigo, margin: [0, 10, 0, 4] },
      headingMinor: { fontSize: 10.5, bold: true, color: THEME.navy, margin: [0, 8, 0, 3] },
      paragraph: { fontSize: 10, lineHeight: 1.45, color: THEME.text, margin: [0, 0, 0, 8] },
      listItem: { fontSize: 10, lineHeight: 1.35, color: THEME.text, margin: [0, 1.5, 0, 1.5] },
      unorderedList: { margin: [0, 2, 0, 8] },
      orderedList: { margin: [0, 2, 0, 8] },
      tableContainer: { margin: [0, 6, 0, 14] },
      tableHeaderCell: { fontSize: 9, bold: true, color: '#FFFFFF' },
      tableBodyCell: { fontSize: 9, color: THEME.text, lineHeight: 1.3 },
      blockquoteCell: { fontSize: 9.5, italics: true, color: THEME.navy, lineHeight: 1.4 },
      blockquoteWrapper: { margin: [0, 6, 0, 10] },
      codeBlockCell: { fontSize: 8.5, font: 'Roboto', color: '#1E293B', lineHeight: 1.3 },
      codeBlockWrapper: { margin: [0, 6, 0, 10] }
    },

    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.4, color: THEME.text },

    // Un capítulo nunca queda solo al final de una página
    pageBreakBefore: (node, following) => Boolean(node.headlineLevel && node.headlineLevel <= 3 && following.length === 0 && !node.pageBreak),

    content
  };
};
