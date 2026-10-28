/**
 * trackingBridge.js
 * Puente de seguimiento para los recursos HTML que el docente envía a los estudiantes.
 *
 * Se inyecta en el HTML del recurso cuando lo abre un estudiante (nunca en las descargas ni en
 * la vista del docente) y expone `window.InspiraTrack`:
 *   InspiraTrack.register()               → el recurso reporta su propio avance
 *   InspiraTrack.progress(hecho, total)   → avance parcial
 *   InspiraTrack.finish(aciertos, total)  → terminó con puntaje
 *   InspiraTrack.done()                   → terminó (sin puntaje)
 * Los avisos viajan al padre con postMessage y la página del estudiante los guarda en Firestore.
 *
 * Si el recurso no reporta nada (p. ej. uno creado libremente por la IA), a los 1,5 s aparece un
 * botón «Terminé» para que el estudiante marque que completó la actividad.
 */
const BRIDGE_SCRIPT = `(function () {
  if (window.InspiraTrack) return;
  var tracked = false, finished = false;
  function send(p) {
    try { parent.postMessage(Object.assign({ inspiratec: 'track' }, p), '*'); } catch (e) {}
  }
  function removeBtn() {
    var b = document.getElementById('inspiratec-done-btn');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }
  window.InspiraTrack = {
    register: function () { tracked = true; removeBtn(); },
    progress: function (done, total) { tracked = true; removeBtn(); send({ type: 'progress', done: done, total: total }); },
    finish: function (score, total) {
      tracked = true; removeBtn();
      if (finished) return; finished = true;
      send({ type: 'finish', score: score, total: total });
    },
    done: function () { if (finished) return; finished = true; send({ type: 'done' }); }
  };
  function addBtn() {
    if (tracked || finished || document.getElementById('inspiratec-done-btn')) return;
    var b = document.createElement('button');
    b.id = 'inspiratec-done-btn';
    b.type = 'button';
    b.textContent = '\\u2714 Termin\\u00e9';
    b.setAttribute('style', 'position:fixed;right:14px;bottom:14px;z-index:2147483647;border:0;border-radius:999px;padding:12px 20px;font:700 15px system-ui,sans-serif;color:#fff;background:linear-gradient(90deg,#3B82F6,#7C5CFF);box-shadow:0 10px 24px rgba(40,52,140,.45);cursor:pointer');
    b.addEventListener('click', function () {
      window.InspiraTrack.done();
      b.textContent = '\\u00a1Listo, registrado!';
      b.disabled = true;
      b.style.opacity = '.85';
    });
    document.body.appendChild(b);
  }
  window.addEventListener('load', function () { setTimeout(addBtn, 1500); });
  send({ type: 'ready' });
})();`;

export const TRACKING_BRIDGE_TAG = `<script>${BRIDGE_SCRIPT}</script>`;

/** Inserta el puente justo después de <head> (o al inicio si el HTML no tiene <head>). */
export function injectTrackingBridge(html = '') {
  if (typeof html !== 'string' || !html) return html;
  if (html.includes('window.InspiraTrack = {')) return html;
  if (/<head[^>]*>/i.test(html)) return html.replace(/(<head[^>]*>)/i, `$1${TRACKING_BRIDGE_TAG}`);
  if (/<html[^>]*>/i.test(html)) return html.replace(/(<html[^>]*>)/i, `$1<head>${TRACKING_BRIDGE_TAG}</head>`);
  return `${TRACKING_BRIDGE_TAG}${html}`;
}

/**
 * Interpreta un mensaje del recurso y lo convierte en el resultado que se guarda.
 * Devuelve null si el mensaje no es de seguimiento.
 */
export function parseTrackMessage(data) {
  if (!data || data.inspiratec !== 'track') return null;
  const num = (v) => (Number.isFinite(Number(v)) ? Math.max(0, Math.round(Number(v))) : null);
  if (data.type === 'progress') {
    const total = num(data.total);
    const done = num(data.done);
    if (total === null || done === null || total === 0) return null;
    return { type: 'progress', avance: Math.min(done, total), total };
  }
  if (data.type === 'finish') {
    const total = num(data.total);
    const score = num(data.score);
    if (total === null || score === null || total === 0) return { type: 'done' };
    return { type: 'finish', aciertos: Math.min(score, total), total };
  }
  if (data.type === 'done') return { type: 'done' };
  return null;
}
