import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   FondoPixel: salón de clase en pixel art rediseñado con la estética de Inspiratec.
   Cuatro personajes trabajan en sus puestos, se levantan, caminan hasta su robot, 
   conversan, el plan se escribe en el tablero y regresan a su silla.

   Uso:  <FondoPixel />
------------------------------------------------------------------- */

const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (h, t) =>
  "#" + hx(h).map((v) => Math.round(v + ((t > 0 ? 255 : 0) - v) * Math.abs(t)).toString(16).padStart(2, "0")).join("");
const R = (x, y, w, h, f, o) => <rect key={`${x}-${y}-${w}-${h}-${f}`} x={x} y={y} width={w} height={h} fill={f} opacity={o} />;

/* p = [casaX, casaY, hablaX, hablaY] escritorio (%) + los mismos 4 en celular.  bot = robot con el que habla */
const CAST = [
  { id: "a", skin: "#C98B62", hair: "#2B1B16", top: "#F4E9D6", pants: "#EFE2C8", wide: true, chair: "#477A72", bot: 0,
    p: [18, 59, 31, 76, 33, 46.9, 22, 80], say: "¡Hola, Robi! Hoy toca fracciones 🍕", reply: "¡Hola! Ya anoté el tema ✅", line: "Tema: fracciones con pizza" },
  { id: "b", skin: "#EFC2A3", hair: "#2A2230", top: "#F6DDE2", pants: "#6E92CC", chair: "#315B54", bot: 1,
    p: [38, 59, 31, 94, 33, 66.9, 22, 96], say: "¡Pixa! Armemos la meta ✨", reply: "Meta: comparar partes del todo", line: "Meta: comparar partes de un todo" },
  { id: "c", skin: "#C48A62", hair: "#1E1512", top: "#FFFFFF", pants: "#2F3F78", chair: "#4A5551", bot: 2,
    p: [62, 59, 69, 76, 67, 46.9, 78, 80], say: "Byte, necesito un juego 🎲", reply: "¡Va! La pizza partida", line: "Inicio: juego de la pizza partida" },
  { id: "d", skin: "#D9A07A", hair: "#1B1624", top: "#2A2535", pants: "#3A66C8", chair: "#141C1A", bot: 3,
    p: [82, 59, 69, 94, 67, 66.9, 78, 96], say: "Chispa, ¿qué actividad haremos? 🤝", reply: "¡Armé trabajo en equipos! 📚", line: "Desarrollo: grupos de 4 con material" },
];
const BOTS = [
  { name: "Robi", p: [42, 76, 40, 80] }, { name: "Pixa", p: [42, 94, 40, 96] },
  { name: "Byte", p: [58, 76, 60, 80] }, { name: "Chispa", p: [58, 94, 60, 96] },
];
/* d = [izq, ancho, arriba] escritorio; m = igual en celular (dos filas) */
const TABLES = [
  { d: [2, 47, 50], m: [1, 49, 40] }, { d: [51, 47, 50], m: [51, 49, 40] },
  { m: [1, 49, 60], only: true }, { m: [51, 49, 60], only: true },
];
const MONS = [
  { x: 8, t: 50, mx: 11, mt: 40, k: "code" }, { x: 28, t: 50, mx: 89, mt: 40, k: "chart" },
  { x: 72, t: 50, mx: 11, mt: 60, k: "chart" }, { x: 92, t: 50, mx: 89, mt: 60, k: "code" },
];

/* ---------- Personaje en pixel art (cuadrícula 16 x 24) ---------- */
function Sprite({ c }) {
  const { id, skin, hair, top, pants } = c;
  const sd = mix(skin, -0.16), hd = mix(hair, 0.28), E = "#2b1d1d", M = "#8C5048";
  const lw = c.wide ? 4 : 3;
  return (
    <svg viewBox="0 0 16 24" className="mini" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="3" y="23" width="10" height="1" fill="#000" opacity=".22" />
      <g className="leg l">{R(c.wide ? 4 : 5, 18, lw, 5, pants)}{R(c.wide ? 4 : 5, 22, lw, 1, "#2a2440")}</g>
      <g className="leg r">{R(8, 18, lw, 5, pants)}{R(8, 22, lw, 1, "#2a2440")}</g>
      {/* pelo trasero */}
      {id === "a" && <>{R(1, 3, 3, 11, hair)}{R(12, 3, 3, 11, hair)}{R(1, 7, 1, 1, hd)}{R(14, 10, 1, 1, hd)}{R(2, 12, 1, 1, hd)}</>}
      {id === "b" && <>{R(2, 2, 2, 8, hair)}{R(12, 2, 2, 8, hair)}</>}
      {/* torso */}
      {R(4, 12, 8, 7, top)}
      <g className="arm l">{R(2, 12, 2, 6, top)}{R(2, 18, 2, 1, skin)}</g>
      <g className="arm r">{R(12, 12, 2, 6, top)}{R(12, 18, 2, 1, skin)}</g>
      {id === "a" && <>{R(6, 14, 1, 1, "#F08AA0")}{R(9, 15, 1, 1, "#E5333F")}{R(7, 16, 1, 1, "#F2B43C")}{R(5, 16, 1, 1, "#9CC6E8")}{R(4, 14, 8, 1, "#fff", .5)}{R(12, 17, 2, 1, "#E5333F")}</>}
      {id === "b" && <>{R(5, 13, 1, 1, "#E9A9B8")}{R(7, 13, 1, 1, "#E9A9B8")}{R(9, 13, 1, 1, "#E9A9B8")}{R(6, 14, 1, 1, "#E9A9B8")}{R(8, 14, 1, 1, "#E9A9B8")}{R(10, 14, 1, 1, "#E9A9B8")}{R(7, 12, 1, 1, "#3a3040")}{R(8, 13, 1, 1, "#3a3040")}{R(7, 15, 2, 1, "#5a5260")}{R(2, 17, 2, 1, "#3a3040")}</>}
      {id === "c" && <>{R(6, 12, 4, 1, "#D8DCE8")}{R(8, 13, 1, 5, "#E3E6F0")}{R(7, 14, 1, 1, "#C5CAD8")}</>}
      {id === "d" && <>
        {R(4, 12, 1, 6, "#3A66C8")}{R(11, 12, 1, 6, "#3A66C8")}{R(6, 12, 1, 1, "#d9c2a0")}{R(7, 13, 1, 1, "#d9c2a0")}{R(8, 14, 1, 1, "#E88B3C")}
        {R(6, 15, 4, 1, "#6FC6FF")}{R(6, 16, 1, 1, "#6FC6FF")}{R(9, 16, 1, 1, "#6FC6FF")}
        {R(6, 17, 4, 3, "#1c1a24")}{R(7, 18, 2, 1, "#8FD3FF")}{R(6, 12, 1, 2, "#C23B3B", .0)}
      </>}
      {/* cabeza */}
      {R(3, 2, 10, 9, skin)}{R(3, 10, 10, 1, sd, .7)}
      <g className="eyes">{R(4, 6, 2, 2, E)}{R(10, 6, 2, 2, E)}</g>
      {R(4, 8, 2, 1, "#F2998F", .28)}{R(10, 8, 2, 1, "#F2998F", .28)}
      <g className="mo">{R(7, 9, 2, 1, M)}</g><g className="mo-open">{R(7, 9, 2, 2, "#7A3F3A")}</g>
      {id === "d" && <>
        {R(5, 10, 6, 1, hair, .4)}
        <rect x="3.7" y="5.6" width="2.6" height="2.6" fill="#fff" fillOpacity=".12" stroke="#2b2a44" strokeWidth=".7" />
        <rect x="9.7" y="5.6" width="2.6" height="2.6" fill="#fff" fillOpacity=".12" stroke="#2b2a44" strokeWidth=".7" />{R(6, 6, 4, 1, "#2b2a44")}
      </>}
      {/* pelo frontal */}
      {id === "a" && <>{R(3, 1, 10, 3, hair)}{R(2, 2, 1, 6, hair)}{R(13, 2, 1, 6, hair)}{R(3, 4, 3, 1, hair)}{R(10, 4, 3, 1, hair)}{R(6, 1, 1, 1, hd)}{R(10, 2, 1, 1, hd)}{R(4, 0, 3, 1, "#2a2a3a")}{R(9, 0, 3, 1, "#2a2a3a")}{R(7, 0, 2, 1, "#2a2a3a")}</>}
      {id === "b" && <>{R(3, 1, 10, 3, hair)}{R(2, 2, 1, 8, hair)}{R(13, 2, 1, 8, hair)}{R(3, 4, 10, 1, hair)}{R(5, 1, 2, 1, hd)}</>}
      {id === "c" && <>{R(3, 1, 10, 3, hair)}{R(4, 0, 3, 1, hair)}{R(8, 0, 3, 1, hair)}{R(3, 3, 1, 2, hair)}{R(12, 3, 1, 2, hair)}{R(6, 1, 1, 1, hd)}</>}
      {id === "d" && <>{R(3, 1, 10, 3, hair)}{R(3, 3, 1, 3, hair)}{R(12, 3, 1, 3, hair)}{R(3, 3, 6, 1, hair)}{R(6, 1, 2, 1, hd)}</>}
    </svg>
  );
}

const BOT_ART = [
  <>{R(7, 0, 2, 3, "#315B54")}{R(6, 0, 4, 1, "#477A72")}{R(2, 3, 12, 9, "#E7EDE7")}{R(2, 3, 12, 1, "#FFFFFF")}{R(2, 11, 12, 1, "#D1D8D5")}{R(1, 6, 1, 3, "#315B54")}{R(14, 6, 1, 3, "#315B54")}{R(4, 5, 8, 5, "#141C1A")}
    <g className="reyes">{R(5, 6, 2, 2, "#477A72")}{R(9, 6, 2, 2, "#477A72")}</g>{R(4, 12, 3, 2, "#315B54")}{R(9, 12, 3, 2, "#315B54")}{R(3, 14, 4, 1, "#141C1A")}{R(9, 14, 4, 1, "#141C1A")}</>,
  <>{R(8, 0, 1, 2, "#141C1A")}{R(7, 0, 3, 1, "#477A72")}{R(3, 2, 10, 6, "#E7EDE7")}{R(3, 2, 10, 1, "#FFFFFF")}{R(4, 4, 8, 3, "#141C1A")}
    <g className="reyes">{R(5, 5, 2, 1, "#477A72")}{R(9, 5, 2, 1, "#477A72")}</g>{R(4, 8, 8, 5, "#D1D8D5")}{R(6, 9, 4, 3, "#141C1A")}{R(7, 10, 2, 1, "#477A72")}
    {R(1, 8, 2, 4, "#E7EDE7")}{R(13, 8, 2, 4, "#E7EDE7")}{R(3, 13, 4, 3, "#315B54")}{R(9, 13, 4, 3, "#315B54")}{R(4, 14, 2, 1, "#141C1A")}{R(10, 14, 2, 1, "#141C1A")}</>,
  <>{R(8, 0, 1, 2, "#315B54")}{R(7, 0, 3, 1, "#477A72")}{R(4, 2, 8, 6, "#E7EDE7")}{R(4, 2, 8, 1, "#FFFFFF")}
    <g className="reyes">{R(5, 4, 2, 2, "#141C1A")}{R(9, 4, 2, 2, "#141C1A")}</g>{R(6, 7, 1, 1, "#315B54")}{R(7, 6, 1, 1, "#315B54")}{R(8, 7, 1, 1, "#315B54")}{R(9, 6, 1, 1, "#315B54")}
    {R(5, 8, 6, 5, "#D1D8D5")}{R(7, 9, 1, 1, "#477A72")}{R(8, 11, 1, 1, "#477A72")}{R(3, 8, 2, 5, "#E7EDE7")}{R(11, 8, 2, 5, "#E7EDE7")}
    {R(5, 13, 2, 3, "#315B54")}{R(9, 13, 2, 3, "#315B54")}{R(4, 16, 3, 1, "#141C1A")}{R(9, 16, 3, 1, "#141C1A")}</>,
  <>{R(7, 2, 2, 3, "#315B54")}<g className="prop">{R(1, 1, 14, 1, "#477A72")}</g>{R(4, 5, 8, 6, "#E7EDE7")}{R(4, 5, 8, 1, "#FFFFFF")}{R(4, 10, 8, 1, "#D1D8D5")}
    <g className="reyes">{R(5, 7, 2, 2, "#141C1A")}{R(9, 7, 2, 2, "#141C1A")}</g>{R(7, 9, 2, 1, "#477A72")}
    {R(3, 12, 1, 2, "#315B54")}{R(12, 12, 1, 2, "#315B54")}{R(2, 14, 12, 1, "#315B54")}</>,
];
const Bot = ({ t }) => <svg viewBox="0 0 16 17" className="rsvg" shapeRendering="crispEdges" aria-hidden="true">{BOT_ART[t]}</svg>;

const Chair = ({ c }) => (
  <svg viewBox="0 0 14 16" className="csvg" shapeRendering="crispEdges" aria-hidden="true">
    {R(2, 0, 10, 9, c)}{R(2, 0, 10, 1, mix(c, 0.35))}{R(2, 8, 10, 1, mix(c, -0.3))}{R(1, 9, 12, 2, mix(c, -0.2))}{R(6, 11, 2, 3, "#D1D8D5")}{R(2, 14, 10, 1, "#4A5551")}
  </svg>
);

const Cactus = () => (
  <svg viewBox="0 0 12 20" className="cactus" shapeRendering="crispEdges" aria-hidden="true">
    {R(5, 0, 2, 12, "#477A72")}{R(1, 4, 2, 5, "#477A72")}{R(1, 8, 5, 2, "#477A72")}{R(9, 2, 2, 5, "#477A72")}{R(6, 6, 4, 2, "#477A72")}
    {R(5, 0, 1, 12, "#E7EDE7")}{R(1, 12, 10, 8, "#315B54")}{R(1, 12, 10, 2, "#4A5551")}
  </svg>
);

const CONF = ["#477A72", "#315B54", "#D1D8D5", "#E7EDE7"];

export default function FondoPixel({ children, dim = 0.15, className = "", enabled = false }) {
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState("go");
  const active = tick % CAST.length;

  useEffect(() => {
    if (!enabled) return;
    setPhase("go");
    const T = [
      setTimeout(() => setPhase("t1"), 1300),
      setTimeout(() => setPhase("t2"), 2500),
      setTimeout(() => setPhase("back"), 3700),
      setTimeout(() => setPhase("idle"), 4900),
      setTimeout(() => setTick((n) => n + 1), 5200),
    ];
    return () => T.forEach(clearTimeout);
  }, [tick, enabled]);

  const atSpot = ["go", "t1", "t2"].includes(phase);
  const walking = phase === "go" || phase === "back";
  const away = atSpot || walking;
  const revealed = active + (["t2", "back", "idle"].includes(phase) ? 1 : 0);
  const cur = CAST[active];

  if (!enabled) {
    return (
      <div className={`app-workspace-layout ${className}`} style={{ minHeight: '100vh', width: '100%', background: 'var(--color-bg-canvas)' }}>
        {children}
      </div>
    );
  }

  return (
    <section className={`px ${className}`}>
      <style>{CSS}</style>
      <div className="scene">
        <div className="win">
          <svg viewBox="0 0 40 20" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
            {R(0, 0, 40, 20, "#A6DDF5")}{R(0, 14, 40, 6, "#E7EDE7")}{R(3, 10, 5, 10, "#E7EDE7")}{R(14, 8, 6, 12, "#D1D8D5")}{R(27, 11, 5, 9, "#E7EDE7")}
            {R(5, 12, 1, 1, "#FFFDF9")}{R(16, 11, 1, 1, "#FFFDF9")}{R(29, 13, 1, 1, "#FFFDF9")}
            <g className="cloud">{R(10, 3, 5, 1, "#fff", .85)}{R(11, 2, 3, 1, "#fff", .85)}</g><g className="cloud c2">{R(30, 5, 6, 1, "#fff", .85)}{R(31, 4, 3, 1, "#fff", .85)}</g>
          </svg>
          <b className="bar-v" /><b className="bar-h" />
        </div>

        <div className="board">
          <h3>Plan de clase con IA</h3>
          <ul>{CAST.map((c, i) => <li key={c.id} className={i < revealed ? "show" : ""}><i />{c.line}</li>)}</ul>
        </div>

        <div className="floor" /><div className="rug" />
        {TABLES.map((t, i) => (
          <div key={i} className={`table ${t.only ? "tm" : ""}`}
            style={{ "--l": t.d?.[0], "--w": t.d?.[1], "--t": t.d?.[2], "--ml": t.m[0], "--mw2": t.m[1], "--mt": t.m[2] }} />
        ))}
        {MONS.map((m, i) => (
          <div key={i} className="mon" style={{ "--x": m.x, "--t": m.t, "--mx": m.mx, "--mt": m.mt }}>
            <div className={`scr ${m.k}`}><i /><i /><i /></div>
          </div>
        ))}
        <div className="plant pl"><Cactus /></div><div className="plant pr"><Cactus /></div>

        {CAST.map((c, i) => {
          const me = i === active;
          return (
            <div key={c.id} className={`chair ${me && away ? "away" : ""}`}
              style={{ "--hx": c.p[0], "--hy": c.p[1], "--mhx": c.p[4], "--mhy": c.p[5] }}><Chair c={c.chair} /></div>
          );
        })}

        {CAST.map((c, i) => {
          const me = i === active, go = me && atSpot;
          return (
            <div key={c.id} className={`person ${go ? "go" : ""} ${me && walking ? "walking" : ""} ${me && phase === "t1" ? "talking" : ""}`}
              style={{ "--hx": c.p[0], "--hy": c.p[1], "--tx": c.p[2], "--ty": c.p[3], "--mhx": c.p[4], "--mhy": c.p[5], "--mtx": c.p[6], "--mty": c.p[7], "--d": `${i * 0.4}s` }}>
              {me && phase === "t1" && <div className="bubble">{c.say}</div>}
              <Sprite c={c} />
            </div>
          );
        })}

        {BOTS.map((b, i) => {
          const me = cur.bot === i;
          return (
            <div key={b.name} className={`robot ${me && atSpot ? "hi" : ""} ${me && phase === "t2" ? "talking" : ""}`}
              style={{ "--rx": b.p[0], "--ry": b.p[1], "--mrx": b.p[2], "--mry": b.p[3], "--d": `${-i * 1.1}s` }}>
              {me && phase === "t2" && <div className="bubble rb">{cur.reply}</div>}
              <span className="tag">{b.name}</span>
              <Bot t={i} />
            </div>
          );
        })}

        {revealed === CAST.length && Array.from({ length: 16 }, (_, k) => (
          <i key={k} className="cf" style={{ left: `${(k * 37 + 8) % 96}%`, animationDelay: `${(k % 6) * 0.12}s`, background: CONF[k % 4] }} />
        ))}
      </div>
      <div className="px-dim" style={{ background: `rgba(8,20,30,${dim})` }} />
      <div className="px-content">{children}</div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
.px{position:relative;min-height:100vh;display:grid;place-items:center;padding:clamp(10px,3vw,32px);background:var(--bg-general);box-sizing:border-box;overflow:hidden;}
.px *{box-sizing:border-box}
.scene{--u:9;--mw:8;--fl:56;--rt:66;position:relative;container-type:inline-size;width:min(100%,1100px);aspect-ratio:16/9;overflow:hidden;
  border-radius:1.4cqw;border:.7cqw solid var(--primary-active);image-rendering:pixelated;
  background:repeating-linear-gradient(90deg,var(--bg-sage-soft) 0 12.5%,var(--border-color) 12.5% 12.9%);z-index:0;
  box-shadow: 0 2cqw 4cqw rgba(49, 91, 84, 0.15);font-family:Silkscreen,monospace;}
.scene::before{content:"";position:absolute;left:0;right:0;top:0;height:3cqw;background:var(--primary-sage)}
.floor{position:absolute;left:0;right:0;top:calc(var(--fl)*1%);bottom:0;border-top:1cqw solid var(--border-color);
  background:repeating-linear-gradient(90deg,transparent 0 7.9cqw,rgba(71, 122, 114, 0.05) 7.9cqw 8.2cqw),repeating-linear-gradient(0deg,transparent 0 7.9cqw,rgba(71, 122, 114, 0.05) 7.9cqw 8.2cqw),var(--bg-general)}
.rug{position:absolute;left:24%;width:52%;top:calc(var(--rt)*1%);bottom:3%;border:.7cqw solid var(--primary-sage);
  background:repeating-linear-gradient(45deg,rgba(71, 122, 114, 0.1) 0 1.6cqw,rgba(71, 122, 114, 0.2) 1.6cqw 3.2cqw);opacity:.9;border-radius:0.5cqw;}
.win{position:absolute;left:4%;top:7%;width:40%;height:34%;border:1.3cqw solid var(--primary-sage);box-shadow:inset 0 0 0 .4cqw var(--primary-active); border-radius:0.5cqw; overflow:hidden;}
.win svg{position:absolute;inset:0;width:100%;height:100%}
.cloud{animation:drift 9s steps(18) infinite alternate}.c2{animation-duration:12s}
.bar-v{position:absolute;left:49%;top:0;bottom:0;width:1.2cqw;background:var(--primary-active)}
.bar-h{position:absolute;top:56%;left:0;right:0;height:1.2cqw;background:var(--primary-active)}
.board{position:absolute;left:54%;top:7%;width:42%;height:34%;background:var(--bg-surface);border:.5cqw solid var(--primary-active);box-shadow:.7cqw .7cqw 0 rgba(71, 122, 114,.25);
  padding:1.5cqw 2cqw;color:var(--primary-active);transform:rotate(1deg); border-radius: 0.8cqw;}
.board h3{margin:0 0 1cqw;font-size:max(10px,1.7cqw);font-weight:700;color:var(--primary-sage)}
.board ul{list-style:none;margin:0;padding:0;display:grid;gap:.9cqw}
.board li{display:flex;align-items:center;gap:.9cqw;font-size:max(8px,1.3cqw);opacity:0;transform:translateX(-1cqw);transition:all .4s steps(4);}
.board li.show{opacity:1;transform:none}
.board li i{flex:none;width:1.3cqw;height:1.3cqw;min-width:8px;min-height:8px;background:var(--primary-sage);border:.25cqw solid var(--primary-active); border-radius: 50%;}
/* escritorios */
.table{position:absolute;left:calc(var(--l)*1%);width:calc(var(--w)*1%);top:calc(var(--t)*1%);height:2.2cqw;background:#E3DAC9;border-bottom:.6cqw solid #C2B6A1;z-index:4; border-radius: 0.5cqw;}
.table::after{content:"";position:absolute;left:1.5%;right:1.5%;top:100%;height:calc(var(--u)*.5cqw);
  background:repeating-linear-gradient(90deg,#D4C7B3 0 3cqw,#C4B7A3 3cqw 3.3cqw);border-bottom:.5cqw solid #A89C88}
.tm{display:none}
.mon{position:absolute;left:calc(var(--x)*1%);top:calc(var(--t)*1% - var(--mw)*.8cqw);width:calc(var(--mw)*1cqw);height:calc(var(--mw)*.72cqw);
  transform:translateX(-50%);background:var(--primary-active);border:.5cqw solid var(--primary-sage);z-index:2; border-radius: 0.5cqw;}
.mon::after{content:"";position:absolute;left:35%;right:35%;top:100%;height:.8cqw;background:var(--primary-sage)}
.scr{position:absolute;inset:8%;display:flex;flex-direction:column;justify-content:center;gap:12%;padding:0 8%;background:var(--bg-surface);overflow:hidden; border-radius: 0.2cqw;}
.scr i{display:block;height:10%;background:var(--primary-sage);animation:type 2.4s steps(6) infinite}.scr i:nth-child(2){width:60%;background:var(--primary-active);animation-delay:.4s}.scr i:nth-child(3){width:80%;background:var(--primary-sage);animation-delay:.8s}
.scr.chart{flex-direction:row;align-items:flex-end;justify-content:space-around;background:var(--bg-surface);padding:12% 8% 10%}
.scr.chart i{width:20%;height:50%;background:var(--primary-sage);animation:grow 2.4s steps(5) infinite alternate}
.scr.chart i:nth-child(2){height:85%;background:var(--primary-active)}.scr.chart i:nth-child(3){height:35%;background:var(--primary-sage)}
.plant{position:absolute;bottom:3%;z-index:4;width:calc(var(--u)*.55cqw);animation:sway 3s steps(2) infinite}
.pl{left:2%}.pr{right:2%}
.cactus,.csvg{display:block;width:100%;height:auto}
/* sillas */
.chair{position:absolute;left:calc(var(--hx)*1%);top:calc(var(--hy)*1%);width:calc(var(--u)*1.15cqw);z-index:2;
  transform:translate(-50%,calc(-100% + var(--u)*.14cqw));transition:transform .5s steps(5)}
.chair.away{transform:translate(-50%,calc(-100% + var(--u)*.55cqw)) rotate(8deg)}
/* personas */
.person,.robot{position:absolute;transform:translate(-50%,-100%); filter: drop-shadow(0 0.5cqw 0.5cqw rgba(49, 91, 84, 0.2));}
.person{left:calc(var(--hx)*1%);top:calc(var(--hy)*1%);width:calc(var(--u)*1cqw);z-index:3;
  transition:left 1.2s steps(14,end),top 1.2s steps(14,end)}
.person.go{left:calc(var(--tx)*1%);top:calc(var(--ty)*1%);z-index:30}
.person.walking{z-index:30}
.person:not(.go):not(.walking) .mini{animation:work 1.6s steps(1) var(--d) infinite}
.mini,.rsvg{display:block;width:100%;height:auto}
.walking .mini{animation:bob .4s steps(1) infinite}
.walking .leg.l,.walking .arm.r{animation:lg .4s steps(1) infinite}
.walking .leg.r,.walking .arm.l{animation:lg .4s steps(1) -.2s infinite}
.talking .arm.r{animation:wv .5s steps(1) infinite}
.talking .mini{animation:chat .5s steps(1) infinite}
.mo-open{display:none}.talking .mo-open{display:block}.talking .mo{display:none}
.eyes,.reyes{animation:blink 4.2s steps(1) infinite}
/* robots */
.robot{left:calc(var(--rx)*1%);top:calc(var(--ry)*1%);width:calc(var(--u)*.95cqw);z-index:25;animation:roam 4s steps(8) var(--d) infinite alternate}
.robot .rsvg{animation:hov 1.2s steps(1) var(--d) infinite}
.robot.hi .rsvg{animation:hop .35s steps(1) infinite}
.robot.talking .rsvg{animation:chat .25s steps(1) infinite}
.prop{transform-box:fill-box;transform-origin:center;animation:spin .16s steps(1) infinite}
.tag{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:.4cqw;white-space:nowrap;background:var(--primary-sage);color:var(--bg-surface);
  font-size:max(8px,1.15cqw);font-weight:700;padding:.35cqw .8cqw;letter-spacing:.04em; border-radius: 0.4cqw;}
.bubble{position:absolute;left:50%;transform:translateX(-50%);width:max-content;max-width:calc(var(--u)*2.3cqw);
  background:var(--bg-surface);color:var(--primary-active);border:.3cqw solid var(--border-color);border-left:1cqw solid var(--primary-sage);padding:.9cqw 1.2cqw;font-size:max(9px,1.25cqw);line-height:1.35;
  box-shadow:.5cqw .5cqw 0 rgba(49, 91, 84, 0.15);z-index:5;animation:pop .25s steps(3) both; border-radius: 0.8cqw;}
.person .bubble{bottom:calc(100% + .8cqw)}.robot .bubble{bottom:calc(100% + 2.8cqw)}
.bubble::after{content:"";position:absolute;top:100%;left:50%;margin-left:-.6cqw;border:.7cqw solid transparent;border-top-color:var(--border-color)}
.rb{border-left-color:var(--primary-active)}
.cf{position:absolute;top:-3%;width:1.2cqw;height:1.2cqw;z-index:40;animation:fall 2.2s steps(12) both}
.px-dim{position:absolute;inset:0;z-index:1;pointer-events:none; background: radial-gradient(circle, transparent 10%, var(--bg-general) 120%); opacity: 0.5;}
.px-content{position:absolute;inset:0;z-index:2;overflow-y:auto;overflow-x:hidden;pointer-events:auto;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;}

@keyframes work{50%{transform:translateY(-.5px)}}
@keyframes bob{0%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes lg{0%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes wv{0%{transform:translateY(-3px)}50%{transform:translateY(-4px)}}
@keyframes chat{50%{transform:translateY(-1px)}}
@keyframes hov{50%{transform:translateY(-1px)}}
@keyframes hop{0%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes roam{from{margin-left:-1.6cqw}to{margin-left:1.6cqw}}
@keyframes spin{50%{transform:scaleX(.45)}}
@keyframes blink{0%,92%{opacity:1}94%,100%{opacity:0}}
@keyframes type{0%{width:10%}100%{width:90%}}
@keyframes grow{to{transform:scaleY(.6);transform-origin:bottom}}
@keyframes sway{50%{transform:translateX(.3cqw)}}
@keyframes drift{to{transform:translateX(4px)}}
@keyframes fall{from{top:-3%}to{top:102%}}
@keyframes pop{from{opacity:0;transform:translateX(-50%) scale(.6)}to{opacity:1;transform:translateX(-50%) scale(1)}}
@media (max-width:640px){
  .scene{--u:17;--mw:17;--fl:33;--rt:70;aspect-ratio:4/5.4}
  .win{left:3%;top:4%;width:38%;height:19%}
  .board{left:44%;top:4%;width:53%;height:19%;padding:2cqw 3cqw}
  .board h3{font-size:max(8px,2.8cqw);margin-bottom:1.2cqw}.board ul{gap:.9cqw}.board li{font-size:max(7px,2.2cqw)}
  .table{left:calc(var(--ml)*1%);width:calc(var(--mw2)*1%);top:calc(var(--mt)*1%)}
  .tm{display:block}
  .mon{left:calc(var(--mx)*1%);top:calc(var(--mt)*1% - var(--mw)*.8cqw)}
  .plant{width:calc(var(--u)*.45cqw)}
  .rug{left:8%;width:84%}
  .chair{left:calc(var(--mhx)*1%);top:calc(var(--mhy)*1%)}
  .person{left:calc(var(--mhx)*1%);top:calc(var(--mhy)*1%)}
  .person.go{left:calc(var(--mtx)*1%);top:calc(var(--mty)*1%)}
  .robot{left:calc(var(--mrx)*1%);top:calc(var(--mry)*1%);width:calc(var(--u)*.8cqw)}
  .tag{font-size:max(7px,2.4cqw);padding:.6cqw 1.4cqw}
  .bubble{font-size:max(9px,2.9cqw);max-width:42cqw;padding:2cqw 2.6cqw}
  .person .bubble{bottom:calc(100% + 1.5cqw)}.robot .bubble{bottom:calc(100% + 6cqw)}
}
@media (prefers-reduced-motion:reduce){
  .px *{animation:none!important;transition-duration:.01ms!important}
}
`;
