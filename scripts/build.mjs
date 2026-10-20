// Genera un proyecto Hyperframes a partir de escenas/<id>/escenas.json
// Uso: node scripts/build.mjs escenas/<id> [--fake-audio]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const dir = process.argv[2];
const fake = process.argv.includes("--fake-audio");
if (!dir) throw new Error("Uso: node scripts/build.mjs escenas/<id> [--fake-audio]");

const cfg = JSON.parse(readFileSync(join(dir, "escenas.json"), "utf8"));
const out = join("build", cfg.id);
mkdirSync(join(out, "audio"), { recursive: true });
mkdirSync(join(out, "fonts"), { recursive: true });

// Fuentes (las copia el workflow desde @fontsource/montserrat)
for (const f of ["montserrat-800.woff2", "montserrat-800-italic.woff2"]) {
  const src = join("fonts-cache", f);
  if (existsSync(src)) copyFileSync(src, join(out, "fonts", f));
  else console.warn("Falta la fuente", src);
}

const W = 1080, H = 1920, PAUSA = 0.45;
const limpio = (s) => s.replaceAll("*", "");
const dur = (file) =>
  parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

// 1) Audio por escena + duraciones
const escenas = [];
let t = 0;
cfg.escenas.forEach((e, i) => {
  const wav = join(out, "audio", `escena-${i + 1}.wav`);
  const texto = limpio(e.voz);
  if (fake) {
    const seg = Math.max(2, texto.split(/\s+/).length / 2.7);
    execFileSync("ffmpeg", ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(seg), wav], { stdio: "ignore" });
  } else {
    execFileSync("npx", ["--yes", "hyperframes@0.8.181", "tts", texto, "-o", wav, "-v", cfg.voz.id, "-l", cfg.voz.idioma, "-s", String(cfg.voz.velocidad)], { stdio: "inherit" });
  }
  const d = dur(wav);
  escenas.push({ ...e, n: i + 1, start: +t.toFixed(3), voz_dur: +d.toFixed(3), dur: +(d + PAUSA).toFixed(3) });
  t += d + PAUSA;
});
const total = +t.toFixed(3);
console.log(`Duración total: ${total.toFixed(1)} s`);
if (total < 45 || total > 60) console.warn(`AVISO: la duración (${total.toFixed(1)} s) está fuera de 45-60 s`);

// 2) HTML
const resaltar = (s) => s.split(/(\*[^*]+\*)/).map((p) => (p.startsWith("*") ? `<em class="hl">${p.slice(1, -1)}</em>` : p)).join("");

const visuales = {
  prueba: () => `<div class="grid">${Array.from({ length: 20 }, (_, k) => `<i class="dot${[2, 7, 8, 13].includes(k) ? " on" : ""}"></i>`).join("")}</div><div class="etiqueta">GRUPO DE PRUEBA</div>`,
  progreso: () => `<div class="barra"><b class="relleno"></b></div><div class="etiqueta">TIEMPO DE REPRODUCCIÓN</div>`,
  avion: () => `<svg class="avion" viewBox="0 0 200 200" width="360" height="360"><path d="M10 100 L190 20 L140 180 L100 120 Z" fill="#3DDBD9"/><path d="M100 120 L190 20 L70 105 Z" fill="#FFFFFF" opacity=".85"/></svg><div class="etiqueta">ENVÍOS POR MENSAJE</div>`,
  marca: () => `<div class="video"><span class="wm">OTRA APP</span><svg class="tacha" viewBox="0 0 100 100"><path d="M10 10 L90 90 M90 10 L10 90" stroke="#FF4D6D" stroke-width="9" stroke-linecap="round"/></svg></div><div class="etiqueta">CONTENIDO ORIGINAL</div>`,
  telefonos: () => `<div class="tels">${["#4B5BFF", "#3DDBD9", "#FFB703", "#FF4D6D"].map((c) => `<div class="tel"><s style="background:${c};width:80%"></s><s style="background:${c};width:55%"></s><s style="background:${c};width:68%"></s></div>`).join("")}</div><div class="etiqueta">CADA FEED ES DISTINTO</div>`,
  logo: () => `<div class="caja"><span class="asi">así</span></div><div class="func">funciona</div>`,
};

const cap = (e) => {
  const pal = e.voz.split(/\s+/);
  const pesos = pal.map((w) => limpio(w).length + 2);
  const suma = pesos.reduce((a, b) => a + b, 0);
  let acc = 0;
  let marca = false;
  const html = pal.map((w, k) => {
    const ini = (acc / suma) * e.voz_dur; acc += pesos[k];
    let txt = w, cls = "w";
    if (w.startsWith("*")) marca = true;
    if (marca) cls += " hl";
    if (w.endsWith("*") || /\*[^*]*\*/.test(w)) marca = false;
    txt = limpio(txt);
    return `<span class="${cls}" data-t="${ini.toFixed(2)}">${txt}</span>`;
  }).join(" ");
  return html;
};

const escenasHtml = escenas.map((e) => `
    <section id="s${e.n}" class="clip escena" data-start="${e.start}" data-duration="${e.dur}" data-track-index="1">
      ${e.n === 1 ? '<div class="flash"></div>' : ""}
      <h1 class="titulo">${resaltar(e.titulo)}</h1>
      <div class="visual">${visuales[e.visual]()}</div>
      <p class="sub">${cap(e)}</p>
    </section>
    <audio id="voz-${e.n}" data-start="${e.start}" data-duration="${e.voz_dur}" data-track-index="2" src="audio/escena-${e.n}.wav"></audio>`).join("\n");

const js = `
const tl = gsap.timeline({ paused: true });
const S = ${JSON.stringify(escenas.map((e) => ({ n: e.n, start: e.start, dur: e.dur, v: e.visual })))};
S.forEach((e) => {
  const q = (s) => "#s" + e.n + " " + s;
  // Titulo: entra con un golpe de escala (visible desde el primer fotograma)
  tl.fromTo(q(".titulo"), { scale: e.n === 1 ? 1.14 : 0.9, y: e.n === 1 ? 0 : 30 }, { scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" }, e.start);
  tl.fromTo(q(".visual"), { opacity: e.n === 1 ? 1 : 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, e.start + 0.1);
  // Subtitulos palabra por palabra
  document.querySelectorAll(q(".w")).forEach((w) => {
    tl.fromTo(w, { opacity: 0.18 }, { opacity: 1, duration: 0.12 }, e.start + parseFloat(w.dataset.t));
  });
  // Visual especifico
  if (e.v === "prueba") {
    tl.fromTo(q(".dot"), { scale: 0.4, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.04, ease: "back.out(3)" }, e.start + 0.2);
    tl.fromTo(q(".dot.on"), { scale: 1 }, { scale: 1.35, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, e.start + 1.4);
  }
  if (e.v === "progreso") tl.fromTo(q(".relleno"), { width: "4%" }, { width: "96%", duration: e.dur - 0.5, ease: "none" }, e.start + 0.3);
  if (e.v === "avion") tl.fromTo(q(".avion"), { x: -420, y: 120, rotation: -15 }, { x: 0, y: 0, rotation: 0, duration: 0.9, ease: "power3.out" }, e.start + 0.2)
    .to(q(".avion"), { y: -22, duration: 0.9, yoyo: true, repeat: 4, ease: "sine.inOut" }, e.start + 1.1);
  if (e.v === "marca") tl.fromTo(q(".tacha"), { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)" }, e.start + 1.6);
  if (e.v === "telefonos") tl.fromTo(q(".tel"), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.18, ease: "power3.out" }, e.start + 0.2);
  if (e.v === "logo") tl.fromTo(q(".caja"), { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "back.out(2.4)" }, e.start + 0.2);
});
// Destello amarillo en el segundo 1 (gancho)
tl.fromTo("#s1 .flash", { opacity: 0 }, { opacity: 0.5, duration: 0.08 }, 1.0).to("#s1 .flash", { opacity: 0, duration: 0.35 }, 1.08);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
tl.seek(0);
`;

const css = `
@font-face { font-family: "Montserrat"; font-weight: 800; font-style: normal; src: url("fonts/montserrat-800.woff2") format("woff2"); }
@font-face { font-family: "Montserrat"; font-weight: 800; font-style: italic; src: url("fonts/montserrat-800-italic.woff2") format("woff2"); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0F1B2D; font-family: "Montserrat", sans-serif; font-weight: 800; }
#root { position: relative; width: ${W}px; height: ${H}px; background: radial-gradient(circle at 50% 38%, #1B2F52 0%, #0F1B2D 62%); color: #fff; }
.escena { position: absolute; inset: 0; }
.flash { position: absolute; inset: 0; background: #FFB703; opacity: 0; z-index: 5; }
.titulo { position: absolute; left: 90px; right: 140px; top: 250px; font-size: 96px; line-height: 1.08; letter-spacing: -1px; text-shadow: 0 8px 0 rgba(0,0,0,.35); }
.hl, .titulo .hl { color: #FFB703; font-style: italic; text-shadow: 0 0 26px rgba(255,183,3,.8), 0 7px 0 rgba(0,0,0,.4); }
.visual { position: absolute; left: 0; right: 0; top: 760px; height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 36px; }
.etiqueta { font-size: 38px; letter-spacing: 6px; color: #3DDBD9; text-shadow: 0 0 18px rgba(61,219,217,.55); }
.sub { position: absolute; left: 100px; right: 150px; top: 1340px; font-size: 54px; line-height: 1.22; font-style: italic; text-shadow: 0 5px 0 rgba(0,0,0,.45); }
.w { opacity: .18; }
.grid { display: grid; grid-template-columns: repeat(5, 90px); gap: 34px; }
.dot { width: 90px; height: 90px; border-radius: 50%; background: #2A3F66; }
.dot.on { background: #3DDBD9; box-shadow: 0 0 30px rgba(61,219,217,.8); }
.barra { width: 760px; height: 64px; border-radius: 32px; background: #1E2F4A; overflow: hidden; border: 4px solid #4B5BFF; }
.relleno { display: block; height: 100%; width: 4%; background: #FFB703; box-shadow: 0 0 30px rgba(255,183,3,.8); border-radius: 32px; }
.video { position: relative; width: 420px; height: 300px; border-radius: 36px; background: #1E2F4A; border: 5px solid #4B5BFF; }
.wm { position: absolute; right: 22px; bottom: 18px; font-size: 34px; color: #fff; opacity: .8; }
.tacha { position: absolute; inset: 40px; width: 340px; height: 220px; }
.tels { display: flex; gap: 28px; }
.tel { width: 190px; height: 330px; border-radius: 34px; border: 5px solid #4B5BFF; background: #14233D; padding: 36px 22px; display: flex; flex-direction: column; gap: 22px; }
.tel s { display: block; height: 26px; border-radius: 13px; text-decoration: none; }
.caja { position: relative; width: 620px; height: 330px; border: 10px solid #4B5BFF; background: rgba(75,91,255,.18); display: flex; align-items: center; justify-content: center; }
.caja::before, .caja::after { content: ""; position: absolute; width: 44px; height: 44px; border-radius: 50%; background: #4B5BFF; left: -27px; top: -27px; box-shadow: 590px 0 #4B5BFF, 0 300px #4B5BFF, 590px 300px #4B5BFF; }
.caja::after { display: none; }
.asi { font-size: 250px; letter-spacing: -4px; text-shadow: 0 8px 0 rgba(0,0,0,.35); }
.func { font-size: 100px; font-style: italic; color: #FFB703; text-shadow: 0 0 26px rgba(255,183,3,.8); }
`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
${escenasHtml}
</div>
<script>${js}</script>
</body>
</html>
`;
writeFileSync(join(out, "index.html"), html);
writeFileSync(join(out, "hyperframes.json"), JSON.stringify({
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
  media: { autoProxy: true }
}, null, 2));
writeFileSync(join(out, "meta.json"), JSON.stringify({ id: cfg.id, name: cfg.id }, null, 2));
console.log("Proyecto generado en", out);
