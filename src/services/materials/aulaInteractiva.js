/**
 * aulaInteractiva.js
 * Recurso "Aula interactiva": una pizarra digital con herramientas listas para usar.
 * La estructura (pizarra, temporizador, selector de estudiantes, equipos, votación, quiz,
 * vocabulario) viene fija; la IA solo entrega el CONTENIDO de la clase en JSON y este módulo
 * lo vuelca en la plantilla. Así el aula siempre funciona y el contenido es 100% del tema.
 */

const asText = (v) => (typeof v === 'string' ? v.trim() : '');
const asList = (v) => (Array.isArray(v) ? v.map(asText).filter(Boolean) : []);

/** Valida y normaliza el contenido entregado por la IA. Lanza un error si no sirve. */
export function normalizeAulaContent(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('El contenido del aula no es válido.');

  const momentos = (Array.isArray(raw.momentos) ? raw.momentos : []).map((m) => ({
    nombre: asText(m?.nombre),
    duracion: Math.max(0, Math.min(180, parseInt(m?.duracion, 10) || 0)),
    instruccion: asText(m?.instruccion),
    contenido: asList(m?.contenido),
    actividad: m?.actividad && typeof m.actividad === 'object'
      ? { titulo: asText(m.actividad.titulo), pasos: asList(m.actividad.pasos) }
      : null,
    pregunta: asText(m?.pregunta)
  })).filter(m => m.nombre && (m.contenido.length > 0 || m.instruccion));

  if (momentos.length < 2) throw new Error('El aula necesita al menos dos momentos con contenido.');

  const preguntas = (Array.isArray(raw.preguntas) ? raw.preguntas : []).map((p) => ({
    pregunta: asText(p?.pregunta),
    opciones: asList(p?.opciones),
    correcta: Number.isInteger(p?.correcta) ? p.correcta : -1,
    explicacion: asText(p?.explicacion)
  })).filter(p => p.pregunta && p.opciones.length >= 2 && p.correcta >= 0 && p.correcta < p.opciones.length);

  const vocabulario = (Array.isArray(raw.vocabulario) ? raw.vocabulario : []).map((v) => ({
    termino: asText(v?.termino),
    definicion: asText(v?.definicion)
  })).filter(v => v.termino && v.definicion);

  const roles = (Array.isArray(raw.roles) ? raw.roles : []).map((r) => ({
    rol: asText(r?.rol),
    funcion: asText(r?.funcion)
  })).filter(r => r.rol && r.funcion);

  return {
    titulo: asText(raw.titulo) || 'Aula interactiva',
    area: asText(raw.area),
    grado: asText(raw.grado),
    objetivo: asText(raw.objetivo),
    momentos,
    preguntas,
    vocabulario,
    roles,
    retoFinal: asText(raw.retoFinal)
  };
}

/** Instrucciones para que la IA entregue únicamente el contenido en JSON. */
export const AULA_CONTENT_SCHEMA = `Devuelve ÚNICAMENTE un objeto JSON válido (sin bloques markdown) con esta forma:
{
  "titulo": "título corto de la clase",
  "objetivo": "objetivo de aprendizaje en una frase",
  "momentos": [
    {
      "nombre": "Inicio: nombre del momento",
      "duracion": 10,
      "instruccion": "qué hace el docente en este momento (1 o 2 frases)",
      "contenido": ["punto o idea para proyectar", "otro punto"],
      "actividad": { "titulo": "nombre de la actividad", "pasos": ["paso 1", "paso 2"] },
      "pregunta": "pregunta para el grupo"
    }
  ],
  "vocabulario": [ { "termino": "palabra", "definicion": "definición clara" } ],
  "preguntas": [ { "pregunta": "texto", "opciones": ["A", "B", "C"], "correcta": 0, "explicacion": "por qué" } ],
  "roles": [ { "rol": "Coordinador", "funcion": "qué hace en el equipo" } ],
  "retoFinal": "desafío de cierre"
}
Reglas: 3 a 5 momentos que sigan el plan (inicio, desarrollo, cierre); contenido real del tema, nunca de relleno; entre 5 y 10 términos de vocabulario; entre 4 y 8 preguntas de selección con una sola respuesta correcta (índice desde 0); roles solo si el plan propone trabajo en equipo.`;

const SHELL = String.raw`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>__TITLE__</title>
<style>
:root{--bg:#0f1f1b;--panel:#16302a;--panel2:#1d3d35;--ink:#eef6f3;--muted:#9fb9b1;--accent:#f2b84b;--accent2:#5fd0b4;--danger:#ef6b6b;--radius:14px;--fs:18px}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;font-family:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif;background:var(--bg);color:var(--ink);font-size:var(--fs);display:flex;flex-direction:column}
body.proyeccion{--fs:22px}
button{font:inherit;cursor:pointer;border:0;border-radius:10px;padding:8px 12px;background:var(--panel2);color:var(--ink);transition:filter .15s,transform .1s,background .2s}
button:active{transform:scale(.96)}
@keyframes pop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse{0%{transform:scale(1)}40%{transform:scale(1.04)}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
button:hover{filter:brightness(1.15)}
button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
button.on{background:var(--accent);color:#1b1b1b;font-weight:700}
header{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--panel);border-bottom:1px solid #ffffff14}
header h1{margin:0;font-size:1.15em}
header p{margin:2px 0 0;color:var(--muted);font-size:.8em}
.actions{display:flex;gap:8px;flex-wrap:wrap}
main{flex:1;min-height:0;display:grid;grid-template-columns:minmax(260px,340px) 1fr minmax(240px,300px);gap:12px;padding:12px}
.col{background:var(--panel);border-radius:var(--radius);padding:12px;overflow:auto;min-height:0}
.col h2{margin:0 0 8px;font-size:.95em;text-transform:uppercase;letter-spacing:.06em;color:var(--accent2)}
.tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.tabs button{font-size:.8em;padding:6px 10px}
.moment{animation:pop .4s ease both;border-left:4px solid var(--accent);padding:6px 10px;margin:8px 0;background:#ffffff08;border-radius:0 10px 10px 0}
.moment h3{margin:0 0 4px;font-size:1em}
.moment ul{margin:6px 0 0 18px;padding:0}
.chip{display:inline-block;background:#ffffff14;border-radius:999px;padding:2px 10px;font-size:.75em;color:var(--muted);margin-right:6px}
.ask{margin-top:8px;padding:8px 10px;background:#f2b84b22;border-radius:10px}
.stage{display:flex;flex-direction:column;gap:8px;min-height:0}
.toolbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:var(--panel);padding:8px;border-radius:var(--radius)}
.toolbar input[type=color]{width:34px;height:34px;padding:0;border:0;background:none}
.swatch{width:26px;height:26px;border-radius:50%;border:2px solid #fff6}
.board{position:relative;flex:1;min-height:260px;background:#fff;border-radius:var(--radius);overflow:hidden;touch-action:none}
.board canvas{position:absolute;inset:0;width:100%;height:100%;display:none;cursor:crosshair}
.board canvas.active{display:block}
.board.grid{background-image:linear-gradient(#0000001a 1px,transparent 1px),linear-gradient(90deg,#0000001a 1px,transparent 1px);background-size:32px 32px}
.board.lined{background-image:linear-gradient(#2a6fdb33 1px,transparent 1px);background-size:100% 36px}
#textbox{position:absolute;display:none;z-index:5;font:inherit;padding:4px 6px;border:2px dashed var(--accent);border-radius:6px;min-width:140px}
.tool{margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #ffffff14}
.tool h3{margin:0 0 6px;font-size:.9em}
.big{font-size:2.2em;font-weight:800;text-align:center;font-variant-numeric:tabular-nums}
.big.alert{color:var(--danger)}
.row{display:flex;gap:6px;flex-wrap:wrap}
textarea,input[type=number],input[type=text]{width:100%;font:inherit;padding:6px 8px;border-radius:8px;border:1px solid #ffffff30;background:#0b1714;color:var(--ink)}
.pick{font-size:1.5em;text-align:center;padding:10px;border-radius:12px;background:var(--accent);color:#1b1b1b;font-weight:800;min-height:3em;display:flex;align-items:center;justify-content:center}
.team{background:#ffffff0d;border-radius:10px;padding:6px 10px;margin:6px 0}
.team b{color:var(--accent)}
.vote{display:flex;gap:8px}
.vote button{flex:1;font-size:1.6em}
.vote span{display:block;font-size:.6em}
.q{margin-bottom:12px}
.opt{display:block;width:100%;text-align:left;margin:4px 0}
.opt.ok{background:#1f8a5b;animation:pulse .5s ease}.opt.bad{background:#a23a3a;animation:shake .4s ease}
.fb{font-size:.85em;color:var(--muted);margin-top:4px}
.voc{display:grid;gap:8px}
.voc button{text-align:left}
.voc .def{display:none;color:var(--muted);font-size:.85em;margin-top:4px}
.voc .open .def{display:block}
@media (max-width:1100px){main{grid-template-columns:1fr}.board{min-height:340px}}
@media print{header .actions,.toolbar,.col:last-child{display:none}main{display:block}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<header>
  <div><h1 id="titulo"></h1><p id="subtitulo"></p></div>
  <div class="actions">
    <button id="btnSound" type="button" aria-pressed="true">🔊 Sonido</button>
    <button id="btnProy" type="button" aria-pressed="false">Modo proyección</button>
    <button id="btnFull" type="button">Pantalla completa</button>
    <button id="btnPng" type="button">Guardar pizarra (PNG)</button>
  </div>
</header>
<main>
  <section class="col" aria-label="Contenido de la clase">
    <h2>La clase</h2>
    <div class="tabs" id="momentTabs" role="tablist"></div>
    <div id="momentView"></div>
    <div id="rolesBox"></div>
    <div id="retoBox"></div>
  </section>

  <section class="stage" aria-label="Pizarra">
    <div class="toolbar" role="toolbar" aria-label="Herramientas de pizarra">
      <button type="button" data-tool="pen" class="on">Lápiz</button>
      <button type="button" data-tool="marker">Resaltador</button>
      <button type="button" data-tool="eraser">Borrador</button>
      <button type="button" data-tool="line">Línea</button>
      <button type="button" data-tool="arrow">Flecha</button>
      <button type="button" data-tool="rect">Rectángulo</button>
      <button type="button" data-tool="circle">Círculo</button>
      <button type="button" data-tool="text">Texto</button>
      <span id="swatches" class="row"></span>
      <input type="color" id="colorPick" value="#1b1b1b" aria-label="Color personalizado">
      <input type="range" id="sizePick" min="2" max="24" value="5" aria-label="Grosor" style="width:90px">
      <button type="button" id="btnUndo">Deshacer</button>
      <button type="button" id="btnClear">Limpiar</button>
      <select id="bgPick" aria-label="Fondo de la pizarra" style="padding:7px;border-radius:8px">
        <option value="plain">Fondo liso</option><option value="grid">Cuadrícula</option><option value="lined">Renglones</option>
      </select>
    </div>
    <div class="board" id="board"><input id="textbox" type="text" aria-label="Escribe y pulsa Enter"></div>
  </section>

  <section class="col" aria-label="Herramientas de aula">
    <h2>Herramientas</h2>
    <div class="tool">
      <h3>Temporizador</h3>
      <div class="big" id="clock">05:00</div>
      <div class="row">
        <button type="button" data-min="1">1 min</button><button type="button" data-min="3">3</button><button type="button" data-min="5">5</button><button type="button" data-min="10">10</button>
      </div>
      <div class="row" style="margin-top:6px"><button type="button" id="tStart">Iniciar / pausar</button><button type="button" id="tReset">Reiniciar</button></div>
    </div>
    <div class="tool">
      <h3>Nombres del grupo</h3>
      <textarea id="names" rows="4" placeholder="Un nombre por línea"></textarea>
      <div class="row" style="margin-top:6px"><button type="button" id="btnPick">Elegir al azar</button></div>
      <div class="pick" id="picked" aria-live="polite">—</div>
      <div class="row" style="margin-top:8px"><input type="number" id="teamN" min="2" max="10" value="4" aria-label="Cantidad de equipos" style="width:80px"><button type="button" id="btnTeams">Formar equipos</button></div>
      <div id="teams"></div>
    </div>
    <div class="tool">
      <h3>¿Cómo vamos? (votación)</h3>
      <div class="vote">
        <button type="button" data-v="g" aria-label="Lo entiendo">🟢<span id="vg">0</span></button>
        <button type="button" data-v="y" aria-label="Tengo dudas">🟡<span id="vy">0</span></button>
        <button type="button" data-v="r" aria-label="No lo entiendo">🔴<span id="vr">0</span></button>
      </div>
      <div class="row" style="margin-top:6px"><button type="button" id="voteReset">Reiniciar</button></div>
    </div>
    <div class="tool" id="vocTool"><h3>Vocabulario</h3><div class="voc" id="voc"></div></div>
    <div class="tool" id="quizTool"><h3>Preguntas rápidas</h3><div id="quiz"></div></div>
  </section>
</main>

<script type="application/json" id="aula-data">__DATA__</script>
<script>
(function(){
  'use strict';
  var D = JSON.parse(document.getElementById('aula-data').textContent);
  function $(id){ return document.getElementById(id); }
  function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  $('titulo').textContent = D.titulo;
  $('subtitulo').textContent = [D.area, D.grado, D.objetivo].filter(Boolean).join(' · ');
  document.title = D.titulo;

  /* ---------- Momentos ---------- */
  var current = 0, boards = [];
  var tabs = $('momentTabs'), view = $('momentView');
  function renderMoment(){
    view.textContent = '';
    var m = D.momentos[current];
    var box = el('div', 'moment');
    box.appendChild(el('h3', null, m.nombre));
    if (m.duracion) box.appendChild(el('span', 'chip', m.duracion + ' min'));
    if (m.instruccion) box.appendChild(el('p', null, m.instruccion));
    if (m.contenido.length){ var ul = el('ul'); m.contenido.forEach(function(c){ ul.appendChild(el('li', null, c)); }); box.appendChild(ul); }
    if (m.actividad && (m.actividad.titulo || m.actividad.pasos.length)){
      box.appendChild(el('h3', null, 'Actividad: ' + (m.actividad.titulo || '')));
      var ol = el('ol'); m.actividad.pasos.forEach(function(p){ ol.appendChild(el('li', null, p)); }); box.appendChild(ol);
    }
    if (m.pregunta) box.appendChild(el('div', 'ask', '❓ ' + m.pregunta));
    view.appendChild(box);
    Array.prototype.forEach.call(tabs.children, function(b, i){ b.classList.toggle('on', i === current); b.setAttribute('aria-selected', i === current); });
    showBoard(current);
    if (m.duracion) setClock(m.duracion * 60);
  }
  D.momentos.forEach(function(m, i){
    var b = el('button', null, (i + 1) + '. ' + m.nombre.split(':')[0]); b.type = 'button'; b.setAttribute('role', 'tab');
    b.addEventListener('click', function(){ sfx.click(); current = i; renderMoment(); });
    tabs.appendChild(b);
  });
  if (D.roles.length){
    var rb = $('rolesBox'); rb.appendChild(el('h2', null, 'Roles del equipo'));
    D.roles.forEach(function(r){ var d = el('div', 'team'); d.appendChild(el('b', null, r.rol + ': ')); d.appendChild(document.createTextNode(r.funcion)); rb.appendChild(d); });
  }
  if (D.retoFinal){ var rf = $('retoBox'); rf.appendChild(el('h2', null, 'Reto final')); rf.appendChild(el('div', 'ask', D.retoFinal)); }

  /* ---------- Pizarra ---------- */
  var board = $('board'), W = 1600, H = 900;
  var tool = 'pen', color = '#1b1b1b', size = 5;
  var hist = [];
  D.momentos.forEach(function(){
    var c = document.createElement('canvas'); c.width = W; c.height = H; board.insertBefore(c, $('textbox'));
    boards.push(c); hist.push([]);
  });
  function ctxOf(i){ return boards[i].getContext('2d'); }
  function showBoard(i){ boards.forEach(function(c, k){ c.classList.toggle('active', k === i); }); }
  function snapshot(i){ var h = hist[i]; h.push(boards[i].toDataURL()); if (h.length > 25) h.shift(); }
  function pos(e){ var r = boards[current].getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  var drawing = false, start = null, base = null, last = null;

  function style(ctx){
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = size * 1.5; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (tool === 'marker'){ ctx.globalAlpha = .35; ctx.lineWidth = size * 5; }
    if (tool === 'eraser'){ ctx.globalCompositeOperation = 'destination-out'; ctx.lineWidth = size * 5; }
  }
  function shape(ctx, a, b){
    ctx.beginPath();
    if (tool === 'line' || tool === 'arrow'){
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (tool === 'arrow'){ var ang = Math.atan2(b.y - a.y, b.x - a.x), L = 26 + size; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - L * Math.cos(ang - .4), b.y - L * Math.sin(ang - .4)); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - L * Math.cos(ang + .4), b.y - L * Math.sin(ang + .4)); ctx.stroke(); }
    } else if (tool === 'rect'){ ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y); }
    else if (tool === 'circle'){ var rx = Math.abs(b.x - a.x) / 2, ry = Math.abs(b.y - a.y) / 2; ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); }
  }
  board.addEventListener('pointerdown', function(e){
    if (e.target.id === 'textbox') return;
    var ctx = ctxOf(current), p = pos(e);
    if (tool === 'text'){ openText(e, p); return; }
    snapshot(current); drawing = true; start = p; last = p; style(ctx);
    base = ctx.getImageData(0, 0, W, H);
    if (tool === 'pen' || tool === 'marker' || tool === 'eraser'){ ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + .01, p.y + .01); ctx.stroke(); }
    board.setPointerCapture(e.pointerId);
  });
  board.addEventListener('pointermove', function(e){
    if (!drawing) return;
    var ctx = ctxOf(current), p = pos(e);
    if (tool === 'pen' || tool === 'marker' || tool === 'eraser'){ style(ctx); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p; }
    else { ctx.putImageData(base, 0, 0); style(ctx); shape(ctx, start, p); }
  });
  function end(){ drawing = false; }
  board.addEventListener('pointerup', end); board.addEventListener('pointercancel', end);

  var tb = $('textbox'), tpos = null;
  function openText(e, p){
    var r = board.getBoundingClientRect(); tpos = p;
    tb.style.display = 'block'; tb.style.left = (e.clientX - r.left) + 'px'; tb.style.top = (e.clientY - r.top) + 'px'; tb.value = ''; tb.style.color = color; tb.focus();
  }
  tb.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ tb.style.display = 'none'; }
    if (e.key === 'Enter' && tb.value.trim()){
      snapshot(current); var ctx = ctxOf(current); style(ctx); ctx.font = (14 + size * 4) + 'px "Segoe UI",sans-serif'; ctx.textBaseline = 'top'; ctx.fillText(tb.value, tpos.x, tpos.y);
      tb.style.display = 'none';
    }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-tool]'), function(b){
    b.addEventListener('click', function(){
      tool = b.dataset.tool;
      Array.prototype.forEach.call(document.querySelectorAll('[data-tool]'), function(x){ x.classList.toggle('on', x === b); });
      boards.forEach(function(c){ c.style.cursor = tool === 'text' ? 'text' : 'crosshair'; });
    });
  });
  ['#1b1b1b', '#d93025', '#1a73e8', '#188038', '#f9ab00', '#9334e6'].forEach(function(c){
    var s = el('button', 'swatch'); s.type = 'button'; s.style.background = c; s.setAttribute('aria-label', 'Color ' + c);
    s.addEventListener('click', function(){ color = c; $('colorPick').value = c; }); $('swatches').appendChild(s);
  });
  $('colorPick').addEventListener('input', function(e){ color = e.target.value; });
  $('sizePick').addEventListener('input', function(e){ size = +e.target.value; });
  $('btnUndo').addEventListener('click', function(){
    var h = hist[current]; if (!h.length) return; var url = h.pop(), img = new Image(), ctx = ctxOf(current);
    img.onload = function(){ ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H); ctx.drawImage(img, 0, 0); }; img.src = url;
  });
  $('btnClear').addEventListener('click', function(){ snapshot(current); ctxOf(current).clearRect(0, 0, W, H); });
  $('bgPick').addEventListener('change', function(e){ board.classList.remove('grid', 'lined'); if (e.target.value !== 'plain') board.classList.add(e.target.value); });
  $('btnPng').addEventListener('click', function(){
    var out = document.createElement('canvas'); out.width = W; out.height = H; var o = out.getContext('2d');
    o.fillStyle = '#fff'; o.fillRect(0, 0, W, H); o.drawImage(boards[current], 0, 0);
    var a = document.createElement('a'); a.href = out.toDataURL('image/png'); a.download = 'pizarra-' + (current + 1) + '.png'; a.click();
  });

  /* ---------- Modo proyección y pantalla completa ---------- */
  $('btnProy').addEventListener('click', function(){ var on = document.body.classList.toggle('proyeccion'); this.setAttribute('aria-pressed', on); this.classList.toggle('on', on); });
  $('btnFull').addEventListener('click', function(){
    if (!document.fullscreenElement) { (document.documentElement.requestFullscreen || function(){}).call(document.documentElement); }
    else { document.exitFullscreen(); }
  });

  /* ---------- Temporizador ---------- */
  var left = 300, timer = null, clock = $('clock');
  function fmt(s){ var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }
  function setClock(s){ left = s; clock.textContent = fmt(left); clock.classList.remove('alert'); stopTimer(); }
  function stopTimer(){ if (timer){ clearInterval(timer); timer = null; } }
  /* ---------- Sonido (Web Audio, sin archivos externos) ---------- */
  var audio = null, soundOn = true;
  function ac(){ try { var A = window.AudioContext || window.webkitAudioContext; if (!audio) audio = new A(); if (audio.state === 'suspended') audio.resume(); } catch (e) { audio = null; } return audio; }
  function tone(freq, dur, type, when, vol){
    if (!soundOn) return; var a = ac(); if (!a) return;
    var t0 = a.currentTime + (when || 0), o = a.createOscillator(), g = a.createGain();
    o.type = type || 'sine'; o.frequency.value = freq; o.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || .12, t0 + .02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + .05);
  }
  var sfx = {
    click: function(){ tone(520, .08, 'triangle'); },
    ok: function(){ tone(660, .12, 'sine'); tone(880, .18, 'sine', .1); },
    bad: function(){ tone(220, .22, 'sawtooth', 0, .08); tone(165, .25, 'sawtooth', .12, .08); },
    pick: function(){ tone(700, .05, 'square', 0, .05); },
    alarm: function(){ tone(880, .25, 'square', 0, .1); tone(880, .25, 'square', .35, .1); tone(1100, .4, 'square', .7, .1); }
  };
  function beep(){ sfx.alarm(); }
  $('btnSound').addEventListener('click', function(){ soundOn = !soundOn; this.textContent = soundOn ? '🔊 Sonido' : '🔇 Silencio'; this.setAttribute('aria-pressed', soundOn); if (soundOn) sfx.click(); });
  $('tStart').addEventListener('click', function(){
    if (timer){ stopTimer(); return; }
    if (left <= 0) return;
    timer = setInterval(function(){ left--; clock.textContent = fmt(Math.max(left, 0)); if (left <= 10) clock.classList.add('alert'); if (left <= 0){ stopTimer(); beep(); } }, 1000);
  });
  $('tReset').addEventListener('click', function(){ var m = D.momentos[current].duracion; setClock((m || 5) * 60); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-min]'), function(b){ b.addEventListener('click', function(){ setClock(+b.dataset.min * 60); }); });
  setClock(300);

  /* ---------- Nombres, azar y equipos ---------- */
  function names(){ return $('names').value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean); }
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  $('btnPick').addEventListener('click', function(){
    var n = names(); if (!n.length){ $('picked').textContent = 'Escribe los nombres'; return; }
    var k = 0, box = $('picked'), iv = setInterval(function(){ sfx.pick(); box.textContent = n[Math.floor(Math.random() * n.length)]; if (++k > 14){ clearInterval(iv); box.textContent = n[Math.floor(Math.random() * n.length)]; } }, 70);
  });
  $('btnTeams').addEventListener('click', function(){
    var n = shuffle(names()), t = Math.max(2, Math.min(10, +$('teamN').value || 2)), out = $('teams'); out.textContent = '';
    if (n.length < t){ out.textContent = 'Faltan nombres para formar ' + t + ' equipos.'; return; }
    var groups = []; for (var i = 0; i < t; i++) groups.push([]);
    n.forEach(function(x, i){ groups[i % t].push(x); });
    groups.forEach(function(g, i){ var d = el('div', 'team'); d.appendChild(el('b', null, 'Equipo ' + (i + 1) + ': ')); d.appendChild(document.createTextNode(g.join(', '))); out.appendChild(d); });
  });

  /* ---------- Votación ---------- */
  var votes = { g: 0, y: 0, r: 0 };
  Array.prototype.forEach.call(document.querySelectorAll('[data-v]'), function(b){ b.addEventListener('click', function(){ sfx.click(); votes[b.dataset.v]++; $('v' + b.dataset.v).textContent = votes[b.dataset.v]; }); });
  $('voteReset').addEventListener('click', function(){ votes = { g: 0, y: 0, r: 0 }; ['g', 'y', 'r'].forEach(function(k){ $('v' + k).textContent = 0; }); });

  /* ---------- Vocabulario ---------- */
  if (!D.vocabulario.length) $('vocTool').style.display = 'none';
  D.vocabulario.forEach(function(v){
    var wrap = el('div'); var b = el('button', null, v.termino); b.type = 'button'; b.setAttribute('aria-expanded', 'false');
    var d = el('div', 'def', v.definicion);
    b.addEventListener('click', function(){ var o = wrap.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
    wrap.appendChild(b); wrap.appendChild(d); $('voc').appendChild(wrap);
  });

  /* ---------- Preguntas rápidas ---------- */
  if (!D.preguntas.length) $('quizTool').style.display = 'none';
  D.preguntas.forEach(function(q, qi){
    var box = el('div', 'q'); box.appendChild(el('b', null, (qi + 1) + '. ' + q.pregunta));
    var fb = el('div', 'fb');
    q.opciones.forEach(function(o, oi){
      var b = el('button', 'opt', o); b.type = 'button';
      b.addEventListener('click', function(){
        Array.prototype.forEach.call(box.querySelectorAll('.opt'), function(x, k){ x.disabled = true; if (k === q.correcta) x.classList.add('ok'); });
        if (oi !== q.correcta) b.classList.add('bad');
        (oi === q.correcta ? sfx.ok : sfx.bad)(); fb.textContent = (oi === q.correcta ? '¡Correcto! ' : 'Revisemos. ') + (q.explicacion || '');
      });
      box.appendChild(b);
    });
    box.appendChild(fb); $('quiz').appendChild(box);
  });

  document.addEventListener('keydown', function(e){
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight' && current < D.momentos.length - 1){ current++; renderMoment(); }
    if (e.key === 'ArrowLeft' && current > 0){ current--; renderMoment(); }
  });
  renderMoment();
})();
</script>
</body>
</html>`;

/** Construye el HTML del aula con el contenido ya validado. */
export function buildAulaInteractivaHtml(rawContent) {
  const content = normalizeAulaContent(rawContent);
  const data = JSON.stringify(content)
    .replace(/</g, '\\u003c')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029');
  const safeTitle = content.titulo.replace(/[<>&"]/g, '');
  return SHELL.replace('__TITLE__', () => safeTitle).replace('__DATA__', () => data);
}
