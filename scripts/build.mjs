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
const palabrasDe = (s) => limpio(s).trim().split(/\s+/).filter(Boolean);
const dur = (file) =>
  parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString());

// ---------- Voz ----------
function tieneEdge() {
  try { execFileSync("python3", ["-c", "import edge_tts"], { stdio: "ignore" }); return true; } catch { return false; }
}
function instalarEdge() {
  if (tieneEdge()) return true;
  for (const extra of [[], ["--break-system-packages"]]) {
    try { execFileSync("python3", ["-m", "pip", "install", "-q", "edge-tts", ...extra], { stdio: "inherit" }); if (tieneEdge()) return true; } catch { /* siguiente intento */ }
  }
  return false;
}
const vozCfg = cfg.voz;
let edgeOk = !fake && vozCfg.motor === "edge" ? instalarEdge() : false;
if (!fake && vozCfg.motor === "edge" && !edgeOk) console.warn("AVISO: no se pudo instalar edge-tts; se usará la voz de respaldo.");
let usoRespaldo = false;

function kokoro(texto, wav) {
  const r = vozCfg.respaldo;
  execFileSync("npx", ["--yes", "hyperframes@0.8.181", "tts", texto, "-o", wav, "-v", r.id, "-l", r.idioma, "-s", String(r.velocidad)], { stdio: "inherit" });
}

function generarVoz(i, texto) {
  const wav = join(out, "audio", `escena-${i + 1}.wav`);
  if (fake) {
    const n = palabrasDe(texto).length; const seg = Math.max(2, n / 2.7);
    execFileSync("ffmpeg", ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", String(seg), wav], { stdio: "ignore" });
    const pal = palabrasDe(texto).map((w, k) => ({ texto: w, inicio: (k * seg) / n, fin: ((k + 1) * seg) / n }));
    return { wav, palabras: pal };
  }
  if (edgeOk) {
    const mp3 = join(out, "audio", `escena-${i + 1}.mp3`); const js = join(out, "audio", `escena-${i + 1}.json`);
    try {
      execFileSync("python3", ["scripts/tts_edge.py", texto, vozCfg.voz, vozCfg.rate || "+0%", vozCfg.pitch || "+0Hz", mp3, js], { stdio: "inherit" });
      execFileSync("ffmpeg", ["-y", "-i", mp3, "-ar", "24000", "-ac", "1", wav], { stdio: "ignore" });
      const todas = JSON.parse(readFileSync(js, "utf8"));
      return { wav, palabras: todas.filter((p) => /[\p{L}\p{N}]/u.test(p.texto)) };
    } catch (err) {
      console.warn(`AVISO: Edge TTS falló en la escena ${i + 1} (${err.message}). Se usa la voz de respaldo.`);
    }
  }
  usoRespaldo = true;
  kokoro(texto, wav);
  return { wav, palabras: null };
}

// ---------- Audio por escena + duraciones ----------
const escenas = [];
let t = 0;
cfg.escenas.forEach((e, i) => {
  const { wav, palabras } = generarVoz(i, e.voz);
  const d = dur(wav);
  escenas.push({ ...e, n: i + 1, start: +t.toFixed(3), voz_dur: +d.toFixed(3), dur: +(d + PAUSA).toFixed(3), palabras });
  t += d + PAUSA;
});
const total = +t.toFixed(3);
console.log(`Duración total: ${total.toFixed(1)} s`);
if (usoRespaldo) console.warn("AVISO: se usó la voz de RESPALDO (femenina) en al menos una escena.");
if (total < 45 || total > 60) console.warn(`AVISO: la duración (${total.toFixed(1)} s) está fuera de 45-60 s`);

// ---------- Subtitulos cortos: una frase a la vez ----------
function tiemposFrases(e) {
  const fr = e.frases;
  const nPal = fr.map((f) => palabrasDe(f).length);
  const suma = nPal.reduce((a, b) => a + b, 0);
  const nVoz = palabrasDe(e.voz).length;
  let inicios;
  if (e.palabras && e.palabras.length === nVoz && suma === nVoz) {
    let idx = 0;
    inicios = nPal.map((n) => { const s = e.palabras[idx].inicio; idx += n; return s; });
  } else {
    if (suma !== nVoz) console.warn(`AVISO escena ${e.n}: las frases (${suma} palabras) no cuadran con la voz (${nVoz}).`);
    else if (e.palabras) console.warn(`AVISO escena ${e.n}: Edge devolvió ${e.palabras.length} palabras y la voz tiene ${nVoz}; se reparte por caracteres.`);
    const pesos = fr.map((f) => limpio(f).length + 2); const total = pesos.reduce((a, b) => a + b, 0);
    let acc = 0; inicios = pesos.map((p) => { const s = (acc / total) * e.voz_dur; acc += p; return s; });
  }
  return fr.map((f, k) => {
    const ini = k === 0 ? 0 : Math.max(0, inicios[k] - 0.04);
    const fin = k + 1 < fr.length ? Math.max(0, inicios[k + 1] - 0.04) : e.dur - 0.05;
    return { texto: f, ini: +ini.toFixed(3), fin: +fin.toFixed(3) };
  });
}
const resaltar = (s) => s.split(/(\*[^*]+\*)/).map((p) => (p.startsWith("*") ? `<em class="hl">${p.slice(1, -1)}</em>` : p)).join("");
const tamano = (f) => { const n = limpio(f).length; return n <= 7 ? 190 : n <= 11 ? 160 : n <= 16 ? 128 : 104; };

const frasesPorEscena = escenas.map((e) => tiemposFrases(e));
const logoHtml = `<div class="logo3d"><div class="caja"><span class="asi">así</span></div><div class="func">funciona</div></div>`;

const escenasHtml = escenas.map((e, si) => `
    <section id="s${e.n}" class="clip escena" data-start="${e.start}" data-duration="${e.dur}" data-track-index="1">
      ${e.n === 1 ? '<div class="flash"></div>' : ""}
      ${e.etiqueta ? `<div class="tag">${e.etiqueta}</div>` : ""}
      ${e.visual === "cierre" ? logoHtml : ""}
      <div class="frs">${frasesPorEscena[si].map((f, k) => `<div class="fr" id="s${e.n}f${k + 1}" style="font-size:${tamano(f.texto)}px">${resaltar(f.texto)}</div>`).join("")}</div>
    </section>
    <audio id="voz-${e.n}" data-start="${e.start}" data-duration="${e.voz_dur}" data-track-index="2" src="audio/escena-${e.n}.wav"></audio>`).join("\n");

const datosJs = escenas.map((e, si) => ({ n: e.n, start: e.start, dur: e.dur, v: e.visual, tag: !!e.etiqueta, frases: frasesPorEscena[si].map((f, k) => ({ id: `s${e.n}f${k + 1}`, ini: f.ini, fin: f.fin })) }));

const js = `
const tl = gsap.timeline({ paused: true });
const S = ${JSON.stringify(datosJs)};
S.forEach((e) => {
  const q = (s) => "#s" + e.n + " " + s;
  if (e.tag) tl.fromTo(q(".tag"), { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }, e.start + 0.1);
  e.frases.forEach((f, k) => {
    const el = "#" + f.id; const ts = e.start + f.ini, te = e.start + f.fin;
    if (e.n === 1 && k === 0) {
      // Gancho: el texto ya es visible en el primer fotograma y entra con un golpe de escala
      tl.fromTo(el, { autoAlpha: 1, scale: 1.3, rotationX: 0, y: 0, transformPerspective: 900 }, { scale: 1, duration: 0.25, ease: "power3.out" }, ts);
    } else {
      tl.fromTo(el, { autoAlpha: 0, scale: 0.55, rotationX: -65, y: 50, transformPerspective: 900 }, { autoAlpha: 1, scale: 1, rotationX: 0, y: 0, duration: 0.2, ease: "back.out(2.4)" }, ts);
    }
    tl.to(el, { autoAlpha: 0, scale: 1.12, y: -40, duration: 0.07, ease: "power2.in" }, Math.max(ts + 0.1, te - 0.07));
  });
  if (e.v === "cierre") {
    tl.fromTo(q(".caja"), { rotationY: -70, scale: 0.6, autoAlpha: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, autoAlpha: 1, duration: 0.7, ease: "back.out(1.8)" }, e.start + 0.25);
    tl.fromTo(q(".func"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, e.start + 0.6);
    tl.to(q(".logo3d"), { rotationY: 12, rotationX: -6, transformPerspective: 900, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, e.start + 1.0);
  }
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
#root { position: relative; width: ${W}px; height: ${H}px; background: radial-gradient(circle at 50% 42%, #1B2F52 0%, #0F1B2D 62%); color: #fff; }
#art { position: absolute; inset: 0; width: ${W}px; height: ${H}px; z-index: 1; pointer-events: none; }
#gl { position: absolute; inset: 0; width: ${W}px; height: ${H}px; z-index: 1; }
.escena { position: absolute; inset: 0; z-index: 2; }
.flash { position: absolute; inset: 0; background: #FFB703; opacity: 0; z-index: 5; }
.tag { position: absolute; left: 0; right: 0; top: 215px; text-align: center; font-size: 40px; letter-spacing: 7px; color: #3DDBD9; text-shadow: 0 0 20px rgba(61,219,217,.6); visibility: hidden; }
.frs { position: absolute; left: 70px; right: 70px; top: 290px; height: 480px; }
.fr { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.02; letter-spacing: -2px; text-shadow: 0 10px 0 rgba(0,0,0,.4); opacity: 0; visibility: hidden; }
.fr .hl { color: #FFB703; font-style: italic; margin: 0 .12em; text-shadow: 0 0 34px rgba(255,183,3,.9), 0 0 8px rgba(255,183,3,.6), 0 9px 0 rgba(0,0,0,.4); }
.logo3d { position: absolute; left: 0; right: 0; top: 880px; display: flex; flex-direction: column; align-items: center; gap: 28px; }
.caja { position: relative; width: 620px; height: 330px; border: 10px solid #4B5BFF; background: rgba(75,91,255,.18); display: flex; align-items: center; justify-content: center; }
.caja::before { content: ""; position: absolute; width: 44px; height: 44px; border-radius: 50%; background: #4B5BFF; left: -27px; top: -27px; box-shadow: 590px 0 #4B5BFF, 0 300px #4B5BFF, 590px 300px #4B5BFF; }
.asi { font-size: 250px; letter-spacing: -4px; text-shadow: 0 8px 0 rgba(0,0,0,.35); }
.func { font-size: 100px; font-style: italic; color: #FFB703; text-shadow: 0 0 26px rgba(255,183,3,.8); }
`;

const escenasParaVisual = JSON.stringify(datosJs.map((e) => ({ n: e.n, start: e.start, dur: e.dur, v: e.v })));
const modulo3d = readFileSync("scripts/escena3d.js", "utf8").replace("/*ESCENAS*/[]", escenasParaVisual);
const usaCielo2d = cfg.id === "03-por-que-cielo-azul";
const moduloVisual = usaCielo2d
  ? readFileSync("scripts/escena-cielo.js", "utf8").replace("/*ESCENAS*/[]", escenasParaVisual)
  : modulo3d;
const visualLayer = usaCielo2d
  ? readFileSync("scripts/escena-cielo.svg", "utf8")
  : `${visualLayer}`;

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
<canvas id="gl" width="${W}" height="${H}"></canvas>
${escenasHtml}
</div>
<script>${js}</script>
<script type="module">
${moduloVisual}
</script>
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
