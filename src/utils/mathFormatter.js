import katex from 'katex';

/**
 * Normalizador y renderizador matemático para INSPIRATEC.
 * Soporta renderizado de alta fidelidad con KaTeX para la vista web
 * y conversión limpia a caracteres Unicode para exportaciones (PDF, Word).
 */

const SYMBOL_MAP = [
  { pattern: /\\times\b/g, replacement: '×' },
  { pattern: /\\div\b/g, replacement: '÷' },
  { pattern: /\\pm\b/g, replacement: '±' },
  { pattern: /\\mp\b/g, replacement: '∓' },
  { pattern: /\\leq\b|\\le\b/g, replacement: '≤' },
  { pattern: /\\geq\b|\\ge\b/g, replacement: '≥' },
  { pattern: /\\neq\b/g, replacement: '≠' },
  { pattern: /\\approx\b/g, replacement: '≈' },
  { pattern: /\\cdot\b/g, replacement: '·' },
  { pattern: /\\degree\b|\^\\circ/g, replacement: '°' },
  { pattern: /\\infty\b/g, replacement: '∞' },
  { pattern: /\\pi\b/g, replacement: 'π' },
  { pattern: /\\alpha\b/g, replacement: 'α' },
  { pattern: /\\beta\b/g, replacement: 'β' },
  { pattern: /\\gamma\b/g, replacement: 'γ' },
  { pattern: /\\theta\b/g, replacement: 'θ' },
  { pattern: /\\mu\b/g, replacement: 'μ' },
  { pattern: /\\sigma\b/g, replacement: 'σ' },
  { pattern: /\\Delta\b/g, replacement: 'Δ' },
  { pattern: /\\rightarrow\b|\\to\b/g, replacement: '→' }
];

/**
 * Normaliza barras invertidas duplicadas y escapes accidentales provenientes de respuestas de IA.
 */
export const normalizeMathSyntax = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Eliminar bloques envolventes de markdown si la IA los incluyó
  text = text.replace(/^```markdown\s*/i, '').replace(/```\s*$/i, '');

  // 2. Normalizar barras invertidas duplicadas en operadores comunes (\\\\times -> \times)
  text = text.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // 3. Normalizar delimitadores escapados (\\$ -> $)
  text = text.replace(/\\\\\$/g, '$').replace(/\\\$([^$]+)\\\$/g, '$$$1$$');

  return text;
};

/**
 * Convierte expresiones LaTeX a texto Unicode legible para PDF/Word o texto plano.
 */
export const cleanMathToUnicodeText = (expr) => {
  if (!expr || typeof expr !== 'string') return '';

  let text = expr.trim();

  // Reemplazar fracciones simples: \frac{a}{b} -> (a / b)
  text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');

  // Reemplazar raíces cuadradas: \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

  // Reemplazar potencias comunes
  text = text.replace(/\^2\b/g, '²')
             .replace(/\^3\b/g, '³')
             .replace(/\^0\b/g, '⁰')
             .replace(/\^1\b/g, '¹')
             .replace(/\^\{2\}/g, '²')
             .replace(/\^\{3\}/g, '³');

  // Símbolos estándar
  for (const { pattern, replacement } of SYMBOL_MAP) {
    text = text.replace(pattern, replacement);
  }

  // Limpiar llaves sobrantes de LaTeX: {a} -> a
  text = text.replace(/\{([^{}]+)\}/g, '$1');

  // Limpiar cualquier barra invertida residual de comandos desconocidos
  text = text.replace(/\\([a-zA-Z]+)/g, '$1');

  return text.trim();
};

/**
 * Procesa el Markdown para renderizar fórmulas matemáticas en la interfaz web usando KaTeX.
 * Seguro contra inyección de HTML arbitrario.
 */
export const formatMathForWeb = (markdown) => {
  if (!markdown || typeof markdown !== 'string') return '';

  let text = normalizeMathSyntax(markdown);

  // 1. Bloques de ecuaciones centradas: $$ ... $$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    const trimmedFormula = formula.trim();
    if (!trimmedFormula) return '';
    try {
      const rendered = katex.renderToString(trimmedFormula, {
        displayMode: true,
        throwOnError: false,
        output: 'html'
      });
      return `\n\n<div class="inspiratec-math-block">${rendered}</div>\n\n`;
    } catch {
      const safeFallback = cleanMathToUnicodeText(trimmedFormula);
      return `\n\n<div class="inspiratec-math-block inspiratec-math-fallback">${safeFallback}</div>\n\n`;
    }
  });

  // 2. Fórmulas inline: $ ... $
  // Evitar capturar cuando es un signo monetario común o saltos de línea
  text = text.replace(/(^|[^\\])\$([^$\n\r]+?)\$/g, (match, prefix, formula) => {
    const trimmedFormula = formula.trim();
    if (!trimmedFormula) return match;
    try {
      const rendered = katex.renderToString(trimmedFormula, {
        displayMode: false,
        throwOnError: false,
        output: 'html'
      });
      return `${prefix}<span class="inspiratec-math-inline">${rendered}</span>`;
    } catch {
      const safeFallback = cleanMathToUnicodeText(trimmedFormula);
      return `${prefix}<span class="inspiratec-math-inline inspiratec-math-fallback">${safeFallback}</span>`;
    }
  });

  // 3. Normalizar operadores sueltos fuera de delimitadores que la IA escribe como \times o \div
  for (const { pattern, replacement } of SYMBOL_MAP) {
    text = text.replace(pattern, replacement);
  }

  return text;
};

/**
 * Normaliza las matemáticas a texto Unicode limpio para exportación a PDF y Word.
 */
export const formatMathForExport = (markdown) => {
  if (!markdown || typeof markdown !== 'string') return '';

  let text = normalizeMathSyntax(markdown);

  // 1. Reemplazar $$ ... $$ por texto limpio con espaciado
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    const clean = cleanMathToUnicodeText(formula);
    return `\n\n${clean}\n\n`;
  });

  // 2. Reemplazar $ ... $ por texto limpio
  text = text.replace(/(^|[^\\])\$([^$\n\r]+?)\$/g, (match, prefix, formula) => {
    const clean = cleanMathToUnicodeText(formula);
    return `${prefix}${clean}`;
  });

  // 3. Reemplazar operadores y comandos residuales
  for (const { pattern, replacement } of SYMBOL_MAP) {
    text = text.replace(pattern, replacement);
  }

  return text;
};
