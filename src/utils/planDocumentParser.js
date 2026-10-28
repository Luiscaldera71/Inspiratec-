/**
 * Parser y Serializador de Documentos Curriculares para INSPIRATEC.
 * 
 * Descompone un documento Markdown en una lista homogénea de bloques estructurados:
 * - header (H1, H2, H3, H4)
 * - paragraph
 * - list (ordenada o con viñetas)
 * - table (secuencia didáctica y matrices)
 * - divider (---)
 * 
 * Permite la edición visual in-situ sin exponer sintaxis Markdown cruda (#, |, ---)
 * y garantiza la reconstrucción fiel y canónica (round-trip) a Markdown GFM.
 */

export const parsePlanToStructuredBlocks = (markdown) => {
  if (!markdown || typeof markdown !== 'string') return [];

  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let blockIdCounter = 1;

  const nextId = (prefix = 'blk') => `${prefix}_${blockIdCounter++}_${Date.now().toString(36)}`;

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Líneas vacías: se omiten como espaciadores entre bloques
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Separadores horizontales (---, ***, ___)
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({
        id: nextId('divider'),
        type: 'divider'
      });
      i++;
      continue;
    }

    // 3. Encabezados (#, ##, ###, ####)
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      blocks.push({
        id: nextId('header'),
        type: 'header',
        level,
        text
      });
      i++;
      continue;
    }

    // 4. Tablas GFM (ej. Secuencia Didáctica: | Momentos | Actividades | Recursos |)
    if (trimmed.startsWith('|') && trimmed.includes('|', 1)) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Primera línea: cabecera
        const parseRow = (line) => {
          const inner = line.replace(/^\|/, '').replace(/\|$/, '');
          return inner.split('|').map(c => c.trim());
        };

        const headers = parseRow(tableLines[0]);
        // Segunda línea: separador (| :--- | :--- |)
        const isSeparator = /^[|\s:-]+$/.test(tableLines[1]) && tableLines[1].includes('-');
        const startRowIdx = isSeparator ? 2 : 1;

        const rows = [];
        for (let r = startRowIdx; r < tableLines.length; r++) {
          const cells = parseRow(tableLines[r]);
          // Asegurar que la fila tenga la misma cantidad de celdas que la cabecera
          while (cells.length < headers.length) cells.push('');
          rows.push(cells.slice(0, headers.length));
        }

        blocks.push({
          id: nextId('table'),
          type: 'table',
          headers,
          rows
        });
        continue;
      }
    }

    // 5. Listas (viñetas: -, *, + o numeradas: 1., 2.)
    const isUnordered = /^[-*+]\s+/.test(trimmed);
    const isOrdered = /^\d+\.\s+/.test(trimmed);

    if (isUnordered || isOrdered) {
      const ordered = isOrdered;
      const items = [];

      while (i < lines.length) {
        const curTrimmed = lines[i].trim();
        if (!curTrimmed) break;

        const curUnordered = /^[-*+]\s+(.*)$/.exec(curTrimmed);
        const curOrdered = /^\d+\.\s+(.*)$/.exec(curTrimmed);

        if (ordered && curOrdered) {
          items.push(curOrdered[1].trim());
          i++;
        } else if (!ordered && curUnordered) {
          items.push(curUnordered[1].trim());
          i++;
        } else if (items.length > 0 && !curTrimmed.startsWith('#') && !curTrimmed.startsWith('|') && !curTrimmed.startsWith('---')) {
          // Línea de continuación del ítem anterior
          items[items.length - 1] += ' ' + curTrimmed;
          i++;
        } else {
          break;
        }
      }

      blocks.push({
        id: nextId('list'),
        type: 'list',
        ordered,
        items
      });
      continue;
    }

    // 6. Párrafos generales (texto continuo o metadatos en línea)
    const paraLines = [];
    while (i < lines.length) {
      const curLine = lines[i];
      const curTrimmed = curLine.trim();

      if (!curTrimmed) break;
      if (/^#{1,4}\s+/.test(curTrimmed)) break;
      if (/^(\-{3,}|\*{3,}|_{3,})$/.test(curTrimmed)) break;
      if (curTrimmed.startsWith('|') && curTrimmed.includes('|', 1)) break;
      if (/^[-*+]\s+/.test(curTrimmed) || /^\d+\.\s+/.test(curTrimmed)) break;

      paraLines.push(curTrimmed);
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        id: nextId('para'),
        type: 'paragraph',
        text: paraLines.join('\n')
      });
    }
  }

  return blocks;
};

/**
 * Serializa los bloques estructurados de nuevo a una cadena canónica Markdown GFM.
 * 
 * @param {Array} blocks - Lista de bloques del documento.
 * @returns {string} Markdown estructurado y compatible con PDF/Word y Firestore.
 */
export const serializeStructuredBlocksToMarkdown = (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const chunks = [];

  for (const block of blocks) {
    if (!block || !block.type) continue;

    switch (block.type) {
      case 'header': {
        const hashes = '#'.repeat(Math.min(Math.max(block.level || 2, 1), 4));
        const text = (block.text || '').trim();
        if (text) chunks.push(`${hashes} ${text}`);
        break;
      }

      case 'divider': {
        chunks.push('---');
        break;
      }

      case 'table': {
        const headers = Array.isArray(block.headers) ? block.headers : [];
        const rows = Array.isArray(block.rows) ? block.rows : [];

        if (headers.length === 0 && rows.length === 0) break;

        const tableLines = [];
        // Fila de cabecera
        tableLines.push(`| ${headers.map(h => (h || '').trim()).join(' | ')} |`);
        // Fila separadora con alineación
        tableLines.push(`| ${headers.map(() => ':---').join(' | ')} |`);
        // Filas de datos
        for (const row of rows) {
          const cells = Array.isArray(row) ? row : [];
          // Normalizar para que no queden saltos de línea crudos rompiendo la tabla Markdown
          const sanitizedCells = headers.map((_, colIdx) => {
            const rawCell = cells[colIdx] || '';
            return String(rawCell).replace(/\r?\n/g, '<br />').trim();
          });
          tableLines.push(`| ${sanitizedCells.join(' | ')} |`);
        }

        chunks.push(tableLines.join('\n'));
        break;
      }

      case 'list': {
        const items = Array.isArray(block.items) ? block.items : [];
        if (items.length === 0) break;

        const listLines = items
          .map((item, idx) => {
            const text = (item || '').trim();
            return block.ordered ? `${idx + 1}. ${text}` : `- ${text}`;
          })
          .filter(Boolean);

        if (listLines.length > 0) {
          chunks.push(listLines.join('\n'));
        }
        break;
      }

      case 'paragraph': {
        const text = (block.text || '').trim();
        if (text) chunks.push(text);
        break;
      }

      default:
        break;
    }
  }

  return chunks.join('\n\n');
};
