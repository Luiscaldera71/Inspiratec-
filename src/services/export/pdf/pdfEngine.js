/**
 * Motor de generación de documentos PDF para INSPIRATEC.
 * Implementa carga diferida (lazy-loading) de pdfmake para evitar sobrecargar
 * el bundle inicial, integrando el adaptador de datos, el normalizador Markdown,
 * la plantilla editorial y la descarga directa del archivo.
 */

import { validatePlanForExport } from '../validateDocument.js';
import { adaptPlanDocument } from '../planDocumentAdapter.js';
import { normalizeMarkdownToPdfBlocks } from '../markdownNormalizer.js';
import { buildInspiratecDocumentDefinition } from './inspiratecTemplate.js';
import { buildPdfFilename, downloadBlob } from '../downloadFile.js';

let cachedPdfMake = null;

/**
 * Carga dinámicamente pdfmake y sus fuentes incrustadas sólo cuando se requiere.
 */
const loadPdfMake = async () => {
  if (cachedPdfMake) return cachedPdfMake;

  try {
    const [pdfMakeModule, pdfFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake.js'),
      import('pdfmake/build/vfs_fonts.js')
    ]);

    const pdfMake = pdfMakeModule.default || pdfMakeModule;
    const pdfFonts = pdfFontsModule.default || pdfFontsModule;

    // Configuración robusta de VFS (Virtual File System) compatible con pdfmake 0.3.x
    const rawVfs = pdfFonts.pdfMake ? (pdfFonts.pdfMake.vfs || pdfFonts.pdfMake) : (pdfFonts.vfs || pdfFonts);
    const vfs = rawVfs && typeof rawVfs === 'object' ? rawVfs : {};

    // 1. Asignación directa en el VirtualFileSystem de pdfmake 0.3.x
    if (typeof pdfMake.addVirtualFileSystem === 'function') {
      pdfMake.addVirtualFileSystem(vfs);
    }

    if (pdfMake.virtualfs && typeof pdfMake.virtualfs.writeFileSync === 'function') {
      for (const key in vfs) {
        if (Object.prototype.hasOwnProperty.call(vfs, key)) {
          pdfMake.virtualfs.writeFileSync(key, vfs[key], 'base64');
        }
      }
    }

    // 2. Compatibilidad con versión heredada
    pdfMake.vfs = vfs;

    // 3. Declaración explícita de la familia tipográfica Roboto
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    };

    cachedPdfMake = pdfMake;
    return pdfMake;
  } catch (err) {
    console.error('[INSPIRATEC PDF Engine] Error al cargar la librería pdfmake:', err);
    throw new Error('No fue posible inicializar el motor de generación PDF en el navegador.');
  }
};

/**
 * Orquesta la generación y descarga completa de un plan pedagógico a PDF.
 *
 * @param {Object} options
 * @param {Object} options.plan - Objeto del plan (desde Zustand o Firestore).
 * @param {string} [options.markdown] - Contenido Markdown directo.
 * @param {Object} [options.userProfile] - Perfil del usuario autenticado.
 * @param {string} [options.planId] - ID persistido del plan.
 * @returns {Promise<{ success: boolean, filename: string, blob: Blob }>}
 */
export const exportPlanToPdf = async ({
  plan = {},
  markdown = '',
  userProfile = null,
  planId = null
}) => {
  // 1. Validación previa de contenido
  const validation = validatePlanForExport(plan, markdown);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Contenido curricular no apto para exportar a PDF.');
  }

  // 2. Adaptación de metadatos y extracción de rúbricas/materiales
  const documentModel = adaptPlanDocument({
    plan,
    markdown,
    userProfile,
    planId
  });

  // 3. Normalización del Markdown a AST de bloques estructurados
  const contentBlocks = normalizeMarkdownToPdfBlocks(documentModel.cleanMarkdown);

  // 4. Construcción de la definición de documento con la plantilla institucional
  const docDefinition = buildInspiratecDocumentDefinition(documentModel, contentBlocks);

  // 5. Carga diferida del motor PDF
  const pdfMake = await loadPdfMake();

  // 6. Generación del documento
  let blob = null;
  try {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    // En pdfmake 0.3.x, getBlob() es una función async que retorna una Promise<Blob>
    const blobCandidate = pdfDocGenerator.getBlob();
    if (blobCandidate && typeof blobCandidate.then === 'function') {
      blob = await blobCandidate;
    } else if (typeof pdfDocGenerator.getBlob === 'function') {
      // Fallback para versiones heredadas con callback
      blob = await new Promise((resolve, reject) => {
        pdfDocGenerator.getBlob((resultBlob) => {
          if (resultBlob) resolve(resultBlob);
          else reject(new Error('El motor no produjo un Blob de salida válido.'));
        });
      });
    }

    if (!blob) {
      throw new Error('El motor no generó el archivo Blob.');
    }
  } catch (renderError) {
    console.error('[INSPIRATEC PDF Engine] Error durante el renderizado del PDF:', renderError);
    throw new Error(`Fallo al compilar el documento PDF: ${renderError.message}`);
  }

  // 7. Determinación del nombre de archivo descriptivo
  const filename = buildPdfFilename({
    tema: documentModel.tema,
    grado: documentModel.grado,
    fecha: documentModel.fecha
  });

  // 8. Descarga en el navegador
  downloadBlob(blob, filename);

  return {
    success: true,
    filename,
    blob
  };
};
