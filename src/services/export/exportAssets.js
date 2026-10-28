/**
 * Carga las imágenes de marca (logo, símbolo y banner) como data URL para incrustarlas
 * en los documentos exportados. Si alguna no se puede cargar (sin red, entorno de pruebas)
 * devuelve null y el documento se genera igualmente, sin esa imagen.
 */
const cache = new Map();

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const loadImageDataUrl = async (url) => {
  if (cache.has(url)) return cache.get(url);
  let result = null;
  try {
    if (typeof fetch === 'function' && typeof FileReader !== 'undefined') {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.type.startsWith('image/')) result = await blobToDataUrl(blob);
      }
    }
  } catch (_) {
    result = null;
  }
  if (result) cache.set(url, result);
  return result;
};

export const loadExportAssets = async () => {
  const [logo, mark, banner] = await Promise.all([
    loadImageDataUrl('/images/logo-inspiratec.png'),
    loadImageDataUrl('/images/logo-mark.png'),
    loadImageDataUrl('/images/banner-inicio.jpg')
  ]);
  return { logo, mark, banner };
};

/** Data URL → { mime, base64 } (para las partes MIME del documento Word). */
export const splitDataUrl = (dataUrl) => {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  return m ? { mime: m[1], base64: m[2] } : null;
};
