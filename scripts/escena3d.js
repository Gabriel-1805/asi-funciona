import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/+esm";

// Capa 3D de "así funciona". Se dibuja a partir del tiempo de Hyperframes (evento hf-seek).
const W = 1080, H = 1920;
const ESC = /*ESCENAS*/[];
const C = { turq: 0x3DDBD9, acc: 0xFFB703, azul: 0x4B5BFF, rosa: 0xFF4D6D, oscuro: 0x1E2F4A, medio: 0x2A3F66 };
const HERO_Y = -0.4;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);
const easeOutBack = (x) => { x = clamp(x); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

try {
  const canvas = document.getElementById("gl");
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 60);

  // Luces: relleno ambiental + luz principal + dos luces de color
  scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x0f1b2d, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(3, 4, 6); scene.add(key);
  const rimA = new THREE.PointLight(C.acc, 30, 14, 2); rimA.position.set(-3, 1, 4); scene.add(rimA);
  const rimT = new THREE.PointLight(C.turq, 25, 14, 2); rimT.position.set(3, -1, 3); scene.add(rimT);

  const std = (color, em = 0x000000, ei = 0, rough = 0.4, metal = 0.1) =>
    new THREE.MeshStandardMaterial({ color, emissive: em, emissiveIntensity: ei, roughness: rough, metalness: metal });

  // Lienzo 2D como textura (halo, marca de agua)
  function lienzo(w, h, dibujar) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d");
    dibujar(g, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return { tex, redibujar: () => { dibujar(g, w, h); tex.needsUpdate = true; } };
  }

  // Halo luminoso detras del objeto principal
  const haloTex = lienzo(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  });
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex.tex, color: C.turq, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.set(0, HERO_Y, -1.2); halo.scale.set(4.2, 4.2, 1); scene.add(halo);
  const HALO_COLOR = [C.turq, C.acc, C.turq, C.rosa, C.azul, C.acc];

  // Particulas flotantes de fondo (profundidad)
  const partes = [];
  { const r = rng(11); const geo = new THREE.SphereGeometry(1, 8, 6);
    const mats = [C.turq, C.azul, 0xffffff].map((c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.55 }));
    for (let i = 0; i < 40; i++) {
      const m = new THREE.Mesh(geo, mats[i % 3]);
      const s = 0.03 + r() * 0.07; m.scale.setScalar(s);
      const base = new THREE.Vector3((r() - 0.5) * 6, (r() - 0.5) * 9 + HERO_Y, -3 + r() * 5);
      m.position.copy(base); scene.add(m);
      partes.push({ m, base, fase: r() * 6.28, vel: 0.3 + r() * 0.6, amp: 0.15 + r() * 0.3 });
    } }

  // ---- Objetos principales por escena ----
  function heroPrueba() {
    const g = new THREE.Group(); const geo = new THREE.SphereGeometry(0.19, 16, 12);
    const off = std(C.medio, 0x16264a, 0.6, 0.45), on = std(C.turq, C.turq, 1.1, 0.25);
    const bolas = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      const k = r * 5 + c; const esOn = [2, 7, 8, 13].includes(k);
      const m = new THREE.Mesh(geo, esOn ? on : off); m.position.set((c - 2) * 0.56, (1.5 - r) * 0.56, 0); g.add(m);
      bolas.push({ m, k, c, r, esOn });
    }
    return { group: g, update(u) {
      g.rotation.y = Math.sin(u * 0.9) * 0.45; g.rotation.x = -0.22 + Math.sin(u * 0.7) * 0.08;
      bolas.forEach((b) => {
        let s = 0.4 + 0.6 * easeOutBack((u - b.k * 0.02) / 0.3);
        if (b.esOn) s *= 1 + 0.22 * Math.sin(u * 5 + b.k);
        b.m.scale.setScalar(s); b.m.position.z = Math.sin(u * 2.2 + b.c * 0.6 + b.r * 0.4) * 0.18;
      });
    } };
  }

  function heroProgreso() {
    const g = new THREE.Group(); const N = 48; const anillo = new THREE.Group();
    const geo = new THREE.BoxGeometry(0.09, 0.3, 0.09);
    const lit = std(C.acc, C.acc, 1.2, 0.3), dim = std(C.medio, 0x16264a, 0.5, 0.5);
    const barras = [];
    for (let i = 0; i < N; i++) {
      const th = (i / N) * Math.PI * 2; const m = new THREE.Mesh(geo, dim);
      m.position.set(Math.sin(th) * 1.15, Math.cos(th) * 1.15, 0); m.rotation.z = -th; anillo.add(m); barras.push(m);
    }
    g.add(anillo);
    const nucleo = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), std(C.azul, 0x1d2a99, 0.8, 0.2, 0.3)); g.add(nucleo);
    const orbe = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), std(C.acc, C.acc, 1.4, 0.2)); g.add(orbe);
    return { group: g, update(u, d) {
      const p = clamp((u - 0.3) / Math.max(0.5, d - 0.9)); const n = Math.floor(p * N);
      barras.forEach((m, i) => { m.material = i < n ? lit : dim; m.scale.setScalar(easeOutBack((u - 0.1 - i * 0.008) / 0.3)); });
      anillo.rotation.y = Math.sin(u * 0.8) * 0.5; anillo.rotation.x = -0.35;
      nucleo.rotation.y = u * 0.8; nucleo.scale.setScalar(1 + Math.sin(u * 3) * 0.04);
      const a = u * 3; orbe.position.set(Math.cos(a) * 0.85, Math.sin(a) * 0.3, Math.sin(a) * 0.85);
    } };
  }

  function heroAvion() {
    const g = new THREE.Group(); const interior = new THREE.Group(); g.add(interior);
    const A = [0, 0, 1.3], B = [-0.95, 0.12, -0.75], Cc = [0.95, 0.12, -0.75], D = [0, 0, -0.45], E = [0, -0.38, -0.55];
    const alas = new THREE.BufferGeometry(); alas.setAttribute("position", new THREE.Float32BufferAttribute([...A, ...B, ...D, ...A, ...D, ...Cc], 3)); alas.computeVertexNormals();
    const quilla = new THREE.BufferGeometry(); quilla.setAttribute("position", new THREE.Float32BufferAttribute([...A, ...E, ...D], 3)); quilla.computeVertexNormals();
    const mAlas = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x3a4a6a, emissiveIntensity: 0.35, flatShading: true, side: THREE.DoubleSide, roughness: 0.6 });
    const mQuilla = new THREE.MeshStandardMaterial({ color: C.turq, emissive: C.turq, emissiveIntensity: 0.6, flatShading: true, side: THREE.DoubleSide });
    interior.add(new THREE.Mesh(alas, mAlas), new THREE.Mesh(quilla, mQuilla));
    interior.rotation.y = Math.PI / 2 - 0.35; interior.scale.setScalar(0.9);
    const rastro = []; const geoR = new THREE.SphereGeometry(1, 8, 6); const mR = new THREE.MeshBasicMaterial({ color: C.turq, transparent: true, opacity: 0.8 });
    for (let k = 0; k < 12; k++) { const m = new THREE.Mesh(geoR, mR); g.add(m); rastro.push(m); }
    const pos = (u) => { const p = easeOutCubic((u - 0.1) / 1.0); return [-3 + 3 * p, -1.6 + 1.6 * p + (u > 1.1 ? Math.sin((u - 1.1) * 1.8) * 0.12 : 0), -2.5 + 2.5 * p]; };
    return { group: g, update(u) {
      const q = pos(u); interior.position.set(q[0], q[1], q[2]);
      interior.rotation.x = 0.5; interior.rotation.z = 0.22 + Math.sin(u * 2) * 0.1;
      rastro.forEach((m, k) => {
        const t = pos(Math.max(0, u - (k + 1) * 0.05));
        m.position.set(t[0] - (k + 1) * 0.17, t[1] - (k + 1) * 0.04, t[2]); m.scale.setScalar(0.08 * (1 - k / 12));
      });
    } };
  }

  function heroMarca() {
    const g = new THREE.Group();
    const marca = lienzo(512, 512, (c, w, h) => {
      c.fillStyle = "#1E2F4A"; c.fillRect(0, 0, w, h);
      c.strokeStyle = "#4B5BFF"; c.lineWidth = 14; c.strokeRect(7, 7, w - 14, h - 14);
      c.fillStyle = "rgba(255,255,255,0.18)"; c.beginPath(); c.moveTo(200, 170); c.lineTo(200, 342); c.lineTo(350, 256); c.closePath(); c.fill();
      c.font = "800 62px Montserrat, sans-serif"; c.textAlign = "right"; c.fillStyle = "rgba(255,255,255,0.9)"; c.fillText("OTRA APP", w - 36, h - 40);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => marca.redibujar());
    const lado = std(C.oscuro, 0x16264a, 0.5, 0.4);
    const cubo = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), [lado, lado, lado, lado, new THREE.MeshBasicMaterial({ map: marca.tex }), lado]);
    g.add(cubo);
    const rosa = std(C.rosa, C.rosa, 1.0, 0.3);
    const cruz = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.17, 0.17), rosa); b1.rotation.z = Math.PI / 4;
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.17, 0.17), rosa); b2.rotation.z = -Math.PI / 4;
    cruz.add(b1, b2); cruz.position.z = 1.0; g.add(cruz);
    return { group: g, update(u) {
      g.rotation.y = Math.sin(u * 0.9) * 0.7; g.rotation.x = -0.2 + Math.sin(u * 0.6) * 0.08;
      cruz.scale.setScalar(Math.max(0.0001, easeOutBack((u - 1.6) / 0.5)));
    } };
  }

  function heroTelefonos() {
    const g = new THREE.Group(); const colores = [C.azul, C.turq, C.acc, C.rosa]; const tels = [];
    colores.forEach((col, k) => {
      const t = new THREE.Group();
      t.add(new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.2, 0.07), std(0x14233D, 0x0b1530, 0.5, 0.4, 0.3)));
      const pant = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 1.1), new THREE.MeshBasicMaterial({ color: 0x0f1b2d })); pant.position.z = 0.037; t.add(pant);
      [0.28, 0.08, -0.12, -0.32].forEach((y, j) => {
        const b = new THREE.Mesh(new THREE.PlaneGeometry(0.4 - j * 0.05, 0.1), new THREE.MeshBasicMaterial({ color: col })); b.position.set(-0.05 * j * 0.5, y, 0.04); t.add(b);
      });
      const ang = [0.5, 0.17, -0.17, -0.5][k]; t.position.set(-1.05 + k * 0.7, 0, Math.abs(ang) * -0.5); t.rotation.y = ang;
      g.add(t); tels.push({ t, k, x: t.position.x });
    });
    return { group: g, update(u) {
      tels.forEach(({ t, k }) => {
        const p = easeOutBack((u - 0.15 - k * 0.18) / 0.5);
        t.position.y = -2.2 * (1 - p) + Math.sin(u * 1.5 + k) * 0.06; t.scale.setScalar(Math.max(0.0001, clamp(p, 0, 1.15)));
      });
      g.rotation.y = Math.sin(u * 0.7) * 0.25;
    } };
  }

  function heroCierre() {
    const g = new THREE.Group();
    const anillo = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 12, 64), std(C.acc, C.acc, 1.2, 0.3)); g.add(anillo);
    const anillo2 = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.04, 12, 64), std(C.turq, C.turq, 1.1, 0.3)); g.add(anillo2);
    const r = rng(7); const geo = new THREE.BoxGeometry(0.09, 0.16, 0.02); const cols = [C.acc, C.turq, C.rosa, C.azul, 0xffffff];
    const piezas = [];
    for (let i = 0; i < 36; i++) {
      const m = new THREE.Mesh(geo, std(cols[i % 5], cols[i % 5], 0.8, 0.4)); g.add(m);
      piezas.push({ m, fi: r() * Math.PI * 2, v: 1.2 + r() * 1.6, z: (r() - 0.5) * 1.6, r1: 3 + r() * 5, r2: 2 + r() * 5 });
    }
    return { group: g, update(u) {
      anillo.rotation.x = u * 0.8; anillo.rotation.y = u * 0.5; anillo2.rotation.y = -u * 0.9; anillo2.rotation.x = 1.1;
      piezas.forEach((p) => {
        const t2 = Math.max(0, u - 0.25); const rad = p.v * (1 - Math.exp(-t2 * 2.2));
        p.m.visible = t2 > 0; p.m.position.set(Math.cos(p.fi) * rad, Math.sin(p.fi) * rad * 0.9 - 0.45 * t2 * t2, p.z);
        p.m.rotation.x = t2 * p.r1; p.m.rotation.z = t2 * p.r2; p.m.scale.setScalar(1 - clamp((t2 - 2.2) / 1.2));
      });
    } };
  }

  const FABRICAS = { prueba: heroPrueba, progreso: heroProgreso, avion: heroAvion, marca: heroMarca, telefonos: heroTelefonos, cierre: heroCierre };
  const heroes = ESC.map((e) => { const h = FABRICAS[e.v](); h.group.position.y = HERO_Y; h.group.visible = false; scene.add(h.group); return h; });

  function renderAt(t) {
    let i = ESC.findIndex((e) => t >= e.start && t < e.start + e.dur);
    if (i < 0) i = t < 0 ? 0 : ESC.length - 1;
    const e = ESC[i]; const u = t - e.start;
    // Camara: giro y acercamiento al entrar cada escena (la "transicion")
    const dir = i % 2 === 0 ? 1 : -1; const kick = 1 - easeOutCubic(u / 0.9);
    const theta = Math.sin(t * 0.35) * 0.16 + kick * dir * 0.85; const dist = 9 + kick * 2.4;
    camera.position.set(Math.sin(theta) * dist, HERO_Y + 0.35 + Math.sin(t * 0.5) * 0.12, Math.cos(theta) * dist);
    camera.lookAt(0, HERO_Y, 0);
    halo.material.color.setHex(HALO_COLOR[i % HALO_COLOR.length]); halo.material.opacity = 0.5 + 0.15 * Math.sin(t * 2);
    heroes.forEach((h, k) => {
      const ee = ESC[k]; const uu = t - ee.start; const vis = t >= ee.start && t < ee.start + ee.dur;
      h.group.visible = vis;
      if (!vis) return;
      const entra = k === 0 ? 0.55 + 0.45 * easeOutBack(uu / 0.5) : easeOutBack(uu / 0.6);
      const sale = k < ESC.length - 1 ? 1 - easeInOut((uu - (ee.dur - 0.35)) / 0.35) : 1;
      h.group.scale.setScalar(Math.max(entra * sale, 0.0001)); h.update(uu, ee.dur, t);
    });
    partes.forEach((p) => { p.m.position.set(p.base.x + Math.sin(t * p.vel + p.fase) * p.amp, p.base.y + Math.cos(t * p.vel * 0.8 + p.fase) * p.amp, p.base.z); });
    renderer.render(scene, camera);
  }

  window.addEventListener("hf-seek", (ev) => renderAt(ev.detail.time));
  renderAt(window.__hfThreeTime || 0);
  window.__asi3d = { scene, camera, renderAt };
} catch (err) {
  console.warn("Capa 3D desactivada:", err);
}
