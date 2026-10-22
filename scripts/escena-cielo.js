// Ilustración SVG 2D sincronizada con el tiempo de Hyperframes.
const ESC = /*ESCENAS*/[];
const tl = gsap.timeline({ paused: true });
ESC.forEach((e) => {
  const el = document.querySelector("#art-" + e.v);
  if (!el) throw new Error("Falta la ilustración SVG para: " + e.v);
  tl.fromTo(el,
    { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 58%" },
    { autoAlpha: 1, scale: 1, duration: 0.48, ease: "power3.out" },
    Math.max(0, e.start + 0.05)
  );
  // La siguiente ilustración entra cuando empieza la siguiente escena; se oculta la anterior.
  tl.to(el, { autoAlpha: 0, duration: 0.22, ease: "power1.in" },
    Math.max(0, e.start + e.dur - 0.18)
  );
});
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
const lastTime = ESC.length ? ESC[ESC.length - 1].start + ESC[ESC.length - 1].dur : 0;
function renderAt(t) {
  const clamped = Math.max(0, Math.min(lastTime, Number(t) || 0));
  tl.time(clamped, false);
}
window.addEventListener("hf-seek", (ev) => renderAt(ev.detail.time));
renderAt(window.__hfThreeTime || 0);
