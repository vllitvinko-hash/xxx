// «Перестановка» — Data Physicalization, вертикаль 1080×1920.
// render(t): камера по ключам → пластины → 2D-слой (заголовок, подписи на объектах, вердикты, счётчики, текст, финальная карточка).
import * as THREE from "three";
import { clamp, seg, eo, lerp, track, env } from "/core/lib.js";
import { DUR, T, D, SUBS, LABELS } from "./timeline.js";
import { buildSet, EVENTS, DAY, RC, RO, WB, WA, POS, SLAB, landed, topY } from "./set.js";

const W = 1080, H = 1920;
const BG = new THREE.Color("#d9d2c6");
const INK = "#1c1d20", INK2 = "rgba(28,29,32,.62)", ACC = "#d4521c", PAPER = "#f3efe8";
const PR = +(new URLSearchParams(location.search).get("pr") || 1.5);

await Promise.all(["200 130px Inter", "300 52px Inter", "500 30px Inter", "600 40px Inter", "500 22px JBMono", "400 20px JBMono", "700 90px PTSerif"].map((f) => document.fonts.load(f, "Аа1")));
await document.fonts.ready;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(PR); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("stage").appendChild(renderer.domElement);
renderer.domElement.style.width = W + "px"; renderer.domElement.style.height = H + "px";
const scene = new THREE.Scene();
scene.background = BG.clone(); scene.fog = new THREE.Fog(BG.clone(), 22, 48);
const camera = new THREE.PerspectiveCamera(34, W / H, 0.05, 90);
const set = await buildSet(scene, renderer);

// ---------- камера: один дубль, позиция + точка взгляда ----------
const [dx, dz] = POS.day, [cx, cz] = POS.chickenRc, [ox, oz] = POS.otherRc;
const mx = (cx + ox) / 2;
const CAMK = [
  // 1. заставка: низкий 3/4 через весь зал — курица близко, соус далеко
  [0.0, [-2.3, 2.15, 5.7, 0.15, 0.0, -1.1]],
  [3.6, [-2.05, 2.2, 5.5, 0.2, 0.0, -1.05]],
  // 2. к кассам: первая пластина крупно, потом кран вместе с вершиной стопки
  [4.6, [dx + 0.95, 0.5, dz + 1.25, dx, 0.16, dz]],
  [5.3, [dx + 1.05, 0.55, dz + 1.4, dx, 0.2, dz]],
  [7.0, [dx + 1.7, 1.45, dz + 2.3, dx, 1.0, dz]],
  [8.9, [dx + 2.2, 2.5, dz + 3.4, dx, 1.7, dz]],
  [11.6, [dx + 2.4, 2.6, dz + 4.4, dx - 0.5, 1.05, dz - 0.1]],
  // 3. две стопки по 100: фиксированный 3/4, лёгкий наезд
  [13.0, [mx + 1.5, 1.55, cz + 3.9, mx, 0.5, cz]],
  [17.0, [mx + 1.35, 1.55, cz + 3.7, mx, 0.55, cz]],
  [23.6, [mx + 1.2, 1.6, cz + 3.55, mx, 0.6, cz]],
  // 4. отъезд в почти верхний вид: плита = план зала
  [26.6, [0.35, 13.2, 4.6, 0.1, 0.0, -0.35]],
  [29.6, [0.25, 12.9, 4.4, 0.08, 0.0, -0.35]],
  [33.0, [0.05, 12.5, 4.3, 0.0, 0.0, -0.3]],
  // 5. сзади, низко: «после · до · соус · курица» в одну линию
  [35.6, [2.2, 3.2, -2.6, 0.1, 0.3, 1.6]],
  [37.0, [1.75, 1.55, -1.75, 0.15, 0.36, 1.62]],
  [41.5, [1.55, 1.6, -1.6, 0.12, 0.4, 1.62]],
  [45.6, [1.35, 1.7, -1.5, 0.1, 0.42, 1.62]],
  // 6. отъезд вверх: пары по всем рядам
  [49.5, [0.7, 13.4, 6.6, 0.0, 0.0, -0.3]],
  [53.0, [0.5, 13.8, 6.4, 0.0, 0.0, -0.4]],
  // 7. медленный облёт всего плана под финальной карточкой
  [60.5, [-1.3, 14.0, 6.0, 0.0, 0.0, -0.8]],
];
const CAM = track(CAMK);
function setCamera(t) {
  const c = CAM(t);
  camera.position.set(c[0], c[1], c[2]); camera.lookAt(c[3], c[4], c[5]);
  camera.updateMatrixWorld();
}
const V = new THREE.Vector3();
const proj = (x, y, z) => { V.set(x, y, z).project(camera); return [((V.x + 1) / 2) * W, ((1 - V.y) / 2) * H, V.z]; };
const stackTop = (s, t) => proj(s.x, topY(s, t), s.z);

// ---------- 2D-слой ----------
const ov = document.getElementById("ov"), g = ov.getContext("2d");
let TXT = [], REPORT = true;
function text(id, s, x, y, font, color, a = 1, align = "left") {
  if (a <= 0.01) return 0;
  g.globalAlpha = a; g.font = font; g.fillStyle = color; g.textAlign = align; g.fillText(s, x, y);
  const w = g.measureText(s).width, sz = parseFloat(font.split(" ")[1]);
  const x0 = align === "left" ? x : align === "right" ? x - w : x - w / 2;
  if (REPORT && a > 0.5) TXT.push({ id, text: s, x0, y0: y - sz, x1: x0 + w, y1: y + sz * 0.25 });
  g.globalAlpha = 1; return w;
}
const width = (s, font) => { g.font = font; return g.measureText(s).width; };
function line(pts, a, color = INK, w = 1.6) { if (a <= 0.01) return; g.globalAlpha = a; g.strokeStyle = color; g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.globalAlpha = 1; }
function dot(x, y, a, color = INK, r = 4) { if (a <= 0.01) return; g.globalAlpha = a; g.fillStyle = color; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
function plate(x, y, w, h, a, fill = PAPER, k = 0.86) { if (a <= 0.01) return; g.globalAlpha = a * k; g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill(); g.globalAlpha = 1; }
function swatch(x, y, kind, a) { if (a <= 0.01) return; g.globalAlpha = a; g.fillStyle = kind === "acr" ? "#5fc4c4" : kind === "brass" ? "#d2b07a" : "#b4b8be"; g.strokeStyle = INK; g.lineWidth = 1; g.fillRect(x, y - 18, 18, 18); g.strokeRect(x + 0.5, y - 17.5, 17, 17); g.globalAlpha = 1; }
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// подпись к точке на объекте: точка, выноска, плашка с образцом, строка-категория, число и единица
function reading(id, [ax, ay], a, { side = 1, lift = 110, val, unit, cat, kind, valFont = "300 52px Inter", maxY = 1560, minY = 300 }) {
  if (a <= 0.01) return;
  const k = eo(a), fV = valFont, fU = "500 22px JBMono", fT = "500 28px Inter";
  const vs = parseFloat(fV.split(" ")[1]);
  const wv = val ? width(val, fV) : 0, wu = unit ? width(unit, fU) : 0, wt = width(cat, fT) + (kind ? 28 : 0);
  const tw = Math.max(wv + (unit ? 12 + wu : 0), wt);
  const hh = val ? vs + 66 : 56;
  let ex = ax + side * 40 * k, ey = clamp(ay - lift * k, minY + hh, maxY);
  ex = side < 0 ? Math.max(ex, 60 + tw) : Math.min(ex, W - 60 - tw);
  const x0 = side < 0 ? ex - tw : ex, rise = (1 - k) * 16;
  plate(x0 - 16, ey - hh + rise, tw + 32, hh + 12, a);
  dot(ax, ay, a); line([[ax, ay], [ex, ey + rise], [side < 0 ? x0 - 8 : ex + tw + 8, ey + rise]], a * 0.85);
  const ty = ey - hh + 38 + rise;
  if (kind) swatch(x0, ty + 2, kind, a);
  text(id + "c", cat, x0 + (kind ? 28 : 0), ty, fT, INK2, a);
  if (val) { const w = text(id + "v", val, x0, ey - 14 + rise, fV, INK, a); if (unit) text(id + "u", unit, x0 + w + 12, ey - 14 + rise, fU, INK2, a); }
}
function verdict(id, s, a, y = 210) {
  if (a <= 0.01) return;
  const x = 70, f = "600 44px Inter", w = width(s, f);
  plate(x - 22, y - 66, w + 44, 98, a);
  line([[x, y + 18], [x + w * eo(seg(a, 0, 1)), y + 18]], a, ACC, 2.5);
  text(id, s, x, y + 2 * (1 - eo(a)) * 8, f, ACC, a);
}
// экранный текст (вместо голоса): слева внизу, одна строка
const FS = "500 38px Inter", SUB_X = 70, SUB_Y = 1772, SUB_SAFE = W - 2 * SUB_X - 20;
function subtitles(t) {
  for (const [i, [a0, a1, s]] of SUBS.entries()) {
    const a = env(t, a0, a1, 0.18, 0.22);
    if (a <= 0.01) continue;
    const w = width(s, FS);
    g.globalAlpha = a * 0.86;
    const gr = g.createLinearGradient(SUB_X - 30, 0, SUB_X + w + 90, 0);
    gr.addColorStop(0, PAPER); gr.addColorStop(0.8, PAPER); gr.addColorStop(1, "rgba(243,239,232,0)");
    g.fillStyle = gr; g.fillRect(SUB_X - 30, SUB_Y - 58, w + 120, 84); g.globalAlpha = 1;
    line([[SUB_X - 14, SUB_Y - 46], [SUB_X - 14, SUB_Y + 14]], a, INK, 2.5);
    text("sub" + i, s, SUB_X, SUB_Y, FS, INK, a);
  }
}
window.SUBCHECK = { safe: SUB_SAFE, cues: SUBS.map(([, , s]) => ({ s, w: Math.round(width(s, FS)) })), ok: SUBS.every(([, , s]) => width(s, FS) <= SUB_SAFE) };

function vignette() {
  const gr = g.createRadialGradient(W / 2, H * 0.48, H * 0.3, W / 2, H * 0.5, H * 0.75);
  gr.addColorStop(0, "rgba(40,30,20,0)"); gr.addColorStop(1, "rgba(40,30,20,0.22)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

function titleCard(t) {
  const a = 1 - seg(t, T.titleOut - 0.5, T.titleOut);
  if (a <= 0.01) return;
  const y0 = 250;
  plate(50, y0 - 70, W - 100, 400, a, PAPER, 0.93);
  text("kick", LABELS.kicker, 90, y0 - 10, "500 22px JBMono", INK2, a);
  text("t1", LABELS.title1, 90, y0 + 100, "700 92px PTSerif", INK, a);
  const f2 = "700 92px PTSerif", w2 = width(LABELS.title2, f2);
  g.globalAlpha = a; g.fillStyle = ACC; g.fillRect(78, y0 + 140, w2 + 30, 116); g.globalAlpha = 1;
  text("t2", LABELS.title2, 92, y0 + 225, f2, "#fff", a);
}
function endCard(t) {
  const a = seg(t, T.endCard, T.endCard + 0.8);
  if (a <= 0.01) return;
  const y0 = 300, r = (1 - eo(a)) * 16;
  plate(50, y0 - 90 + r, W - 100, 470, a, PAPER, 0.93);
  text("e1", LABELS.endQ1, 90, y0 + r, "700 64px PTSerif", INK, a);
  text("e2", LABELS.endQ2, 90, y0 + 80 + r, "700 64px PTSerif", INK, a);
  line([[90, y0 + 128 + r], [90 + 300 * eo(a), y0 + 128 + r]], a, ACC, 2.5);
  const b = seg(t, T.endCard + 0.9, T.endCard + 1.6);
  text("e3", LABELS.endSite, 90, y0 + 230 + r, "600 64px Inter", INK, b);
  text("e4", LABELS.endNote, 90, y0 + 290 + r, "500 30px Inter", INK2, b);
}

function overlay(t) {
  g.clearRect(0, 0, W, H);
  vignette();
  titleCard(t);
  // строка источника — в кадре всё время, правый верхний угол
  text("src", LABELS.source, W - 40, 64, "400 20px JBMono", INK2, 1, "right");

  // 2. правило единицы на первой пластине, латунь, счётчик
  const a1 = env(t, T.dayFirst + 0.2, 7.0, 0.35, 0.3);
  const p0 = proj(DAY.x - DAY.w / 2, SLAB + DAY.th, DAY.z + DAY.d / 2);
  reading("rule", p0, a1, { side: -1, lift: 260, cat: LABELS.ruleDay, kind: "alu" });
  const firstBrass = 5.75;
  const a2 = env(t, firstBrass + 0.2, 7.4, 0.35, 0.3);
  const pb = proj(DAY.x + DAY.w / 2, SLAB + DAY.th * 9.5, DAY.z + DAY.d / 2);
  reading("brass", pb, a2, { side: 1, lift: 140, cat: LABELS.ruleBrass, kind: "brass" });
  const a3 = env(t, T.dayB + 0.1, 12.2, 0.3, 0.4);
  const nDay = landed(DAY, t);
  reading("dayc", stackTop(DAY, t), a3, { side: -1, lift: 150, val: fmt(nDay * D.perPlateDay), unit: "", cat: LABELS.dayCount, valFont: "200 120px Inter" });

  // 3. две стопки по 100 чеков
  const a4 = env(t, T.pairB + 0.3, 16.6, 0.35, 0.3);
  reading("prule", proj(RO.x + RO.w / 2, SLAB + 0.02, RO.z + RO.d / 2), a4, { side: 1, lift: 120, cat: LABELS.pairRule, kind: "alu" });
  const a5 = env(t, 16.65, 20.0, 0.35, 0.3);
  const sk = 52, ps = proj(RC.x - RC.w / 2, SLAB + RC.th * (sk + 0.5), RC.z + RC.d / 2);
  reading("mark", ps, a5, { side: -1, lift: 60, cat: LABELS.sauceMark, kind: "acr" });
  const a6 = env(t, T.pairRead, 24.2, 0.4, 0.3);
  reading("rc", stackTop(RC, t), a6, { side: -1, lift: 170, val: `${D.chickenWithSauce} из 100`, cat: LABELS.chicken, kind: "acr" });
  reading("ro", stackTop(RO, t), a6, { side: 1, lift: 170, val: `${D.otherWithSauce} из 100`, cat: LABELS.other, kind: "acr" });
  verdict("v1", LABELS.verdictPair, env(t, T.pairVerdict, 24.2, 0.5, 0.3));

  // 4. план зала: расстояние
  const a7 = env(t, T.route + 0.6, T.moveLand + 1.6, 0.4, 0.3);
  reading("route", proj(1.93, SLAB, -0.8), a7, { side: -1, lift: 90, val: `${D.meters} м`, cat: "от курицы до соуса" });

  // 5. до / после
  const a8 = env(t, T.beforeB + 0.2, 40.2, 0.35, 0.3);
  reading("wrule", proj(WB.x - WB.w / 2, SLAB + WB.th * 0.5, WB.z + WB.d / 2), a8, { side: -1, lift: 70, cat: LABELS.weekRule, kind: "acr" });
  const a9 = env(t, T.beforeB + 1.0, 46.2, 0.35, 0.3);
  reading("wb", stackTop(WB, t), a9, { side: 1, lift: 330, val: fmt(landed(WB, t) >= WB.n ? D.weekBefore : landed(WB, t) * D.perPlateWeek), unit: LABELS.unitWeek, cat: LABELS.before, kind: "acr" });
  const nA = landed(WA, t), valA = nA >= WA.n ? D.weekAfter : nA <= WB.n ? D.weekBefore : nA * D.perPlateWeek;
  reading("wa", stackTop(WA, t), env(t, T.afterB + 1.0, 46.2, 0.35, 0.3), { side: -1, lift: 300, val: fmt(valA), unit: LABELS.unitWeek, cat: LABELS.after, kind: "acr" });
  verdict("v2", LABELS.verdictResult, env(t, T.resultVerdict, 46.3, 0.5, 0.3));

  endCard(t);
  subtitles(t);
}

window.DUR = DUR;
window.EV = EVENTS;
window.render = (t) => {
  setCamera(t);
  set.update(t);
  renderer.render(scene, camera);
  TXT = [];
  overlay(t);
};
window.TEXTS = (t) => { REPORT = true; window.render(t); return TXT; };
window.READY = true;
