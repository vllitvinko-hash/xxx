// Набор: ореховая плита = план зала с инкрустацией, стопки пластин (алюминий = чеки,
// бирюзовый акрил = соус, латунь = каждая десятая), два товара-объекта, маленькие пары по рядам.
// Положение каждой пластины — чистая функция времени.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { seg, eo, hash, lerp } from "/core/lib.js";
import { T, D, LABELS } from "./timeline.js";

export const SX = 2.25, SZ = 4.0, SLAB = 0.12; // плита: x ∈ [-2.25,2.25], z ∈ [-4,4]
export const RACKS = [1.6, 0.4, -0.8, -2.0, -3.2]; // ряды стеллажей (по z)
export const POS = {
  day: [1.35, 3.1],
  chickenRc: [-1.15, 2.95],
  otherRc: [-0.4, 2.95],
  chicken: [-1.35, 1.6],
  sauceFrom: [1.35, -3.2],
  sauceTo: [-0.78, 1.6],
  before: [-0.1, 1.62],
  after: [0.52, 1.62],
};

// ---------- расписание пластин ----------
export const STACKS = [];
export const SHEETS = [];
export const EVENTS = [];
function stack(id, [x, z], n, th, w, d, mat, b, L, opts = {}) {
  const s = { id, x, z, n, th, w, d, mat, b, L, ...opts };
  STACKS.push(s);
  for (let k = 0; k < n; k++) {
    const brass = !opts.noBrass && (k + 1) % 10 === 0;
    const m = opts.matAt ? opts.matAt(k) : mat;
    let land, t0, mode;
    if (opts.feedFrom != null && k >= opts.feedFrom) {
      const j = k - opts.feedFrom;
      t0 = T.feed + j * T.feedStep;
      land = t0 + T.feedFall;
      mode = "d";
    } else {
      const nb = opts.feedFrom ?? n;
      land = opts.first != null && k === 0 ? opts.first : b + L * Math.pow((k + 1) / nb, 0.85);
      t0 = land - (opts.first != null && k === 0 ? 0.5 : 0.11);
      mode = opts.first != null && k === 0 ? "d" : "c";
    }
    const g = brass ? "brass" : m;
    SHEETS.push({
      s, k, g, t0, land, mode,
      jx: (hash(STACKS.length * 100 + k) - 0.5) * 0.008,
      jz: (hash(STACKS.length * 100 + k + 0.5) - 0.5) * 0.008,
      ja: (hash(STACKS.length * 77 + k * 3.1) - 0.5) * 0.03,
      shade: 0.9 + hash(STACKS.length * 91 + k * 1.7) * 0.14,
    });
    if (!opts.quiet || brass) EVENTS.push({ t: +land.toFixed(3), type: g === "acr" ? "tok" : g === "brass" ? "brass" : "tick", h: Math.floor((k + 1) / 10), stack: id });
  }
  return s;
}
// соус в 9 из 100 чеков с курицей и в 1 из 100 остальных (позиции не кратны 10)
const SAUCE_C = new Set([4, 15, 23, 36, 47, 52, 68, 74, 86]);
const SAUCE_O = new Set([57]);
export const DAY = stack("day", POS.day, D.receiptsDay / D.perPlateDay, 0.016, 0.46, 0.34, "alu", T.dayB, T.dayL, { first: T.dayFirst });
export const RC = stack("rc", POS.chickenRc, 100, 0.0105, 0.42, 0.32, "alu", T.pairB, T.pairL, { matAt: (k) => (SAUCE_C.has(k) ? "acr" : "alu") });
export const RO = stack("ro", POS.otherRc, 100, 0.0105, 0.42, 0.32, "alu", T.pairB + 0.12, T.pairL, { matAt: (k) => (SAUCE_O.has(k) ? "acr" : "alu") });
const nB = Math.round(D.weekBefore / D.perPlateWeek), nA = Math.round(D.weekAfter / D.perPlateWeek);
export const WB = stack("wb", POS.before, nB, 0.02, 0.4, 0.3, "acr", T.beforeB, T.stackL);
export const WA = stack("wa", POS.after, nA, 0.02, 0.4, 0.3, "acr", T.afterB, T.stackL, { feedFrom: nB });
// маленькие пары по рядам: алюминий (товар А) + акрил (товар Б)
export const MINI = [];
{
  let i = 0;
  for (const [ri, rz] of RACKS.entries()) {
    const xs = ri === 0 ? [1.3] : [-1.45, -0.75, -0.05, 0.65, 1.35];
    for (const x of xs) {
      if (ri === 4 && x > 1.0) continue; // место, где стоял соус
      const b = T.pairsB + hash(i * 5.3) * T.pairsL;
      const na = 6 + Math.floor(hash(i * 2.1) * 16), nb = 3 + Math.floor(hash(i * 3.7) * 10);
      MINI.push(stack("m" + i + "a", [x - 0.11, rz], na, 0.012, 0.18, 0.15, "alu", b, 0.5, { noBrass: true, quiet: true }));
      MINI.push(stack("m" + i + "b", [x + 0.11, rz], nb, 0.012, 0.18, 0.15, "acr", b + 0.12, 0.4, { noBrass: true, quiet: true }));
      EVENTS.push({ t: +(b + 0.3).toFixed(3), type: "riffle", n: na + nb });
      i++;
    }
  }
}
EVENTS.push({ t: T.moveLift, type: "lift" }, { t: T.moveLand, type: "impact" });
EVENTS.sort((a, b) => a.t - b.t);

export const landed = (s, t) => SHEETS.reduce((c, sh) => c + (sh.s === s && sh.land <= t ? 1 : 0), 0);
export const topY = (s, t) => SLAB + landed(s, t) * s.th;

// ---------- плита с планом зала ----------
function planTexture() {
  const C = 3072, c = document.createElement("canvas");
  c.width = (C * SX) / SZ; c.height = C;
  const x = c.getContext("2d"), k = C / (2 * SZ);
  const px = (X) => (X + SX) * k, pz = (Z) => (Z + SZ) * k;
  x.fillStyle = x.strokeStyle = "#fff";
  // стены
  x.lineWidth = 7;
  x.strokeRect(px(-2.12), pz(-3.85), 4.24 * k, 7.7 * k);
  x.clearRect(px(-1.95), pz(3.8), 0.8 * k, 0.12 * k); // проём входа
  // стеллажи: прямоугольники с внутренней штриховкой
  for (const [ri, rz] of RACKS.entries()) {
    const x0 = -1.8, x1 = 1.75;
    x.lineWidth = 3.5;
    x.strokeRect(px(x0), pz(rz - 0.2), (x1 - x0) * k, 0.4 * k);
    x.lineWidth = 1.5;
    for (let q = x0 + 0.2; q < x1; q += 0.2) {
      x.beginPath(); x.moveTo(px(q), pz(rz - 0.2)); x.lineTo(px(q), pz(rz - 0.16)); x.stroke();
      x.beginPath(); x.moveTo(px(q), pz(rz + 0.16)); x.lineTo(px(q), pz(rz + 0.2)); x.stroke();
    }
    x.font = `500 ${Math.round(0.09 * k)}px JBMono`; x.textAlign = "left"; x.textBaseline = "alphabetic";
    x.fillText(`РЯД ${ri + 1}`, px(x0), pz(rz - 0.26));
  }
  // кассы
  x.lineWidth = 3.5;
  for (const q of [0.55, 1.25]) x.strokeRect(px(q - 0.05), pz(2.5), 0.5 * k, 0.2 * k);
  x.font = `500 ${Math.round(0.12 * k)}px JBMono`; x.textAlign = "center"; x.textBaseline = "alphabetic";
  x.fillText(LABELS.checkout, px(1.35), pz(3.66));
  x.fillText(LABELS.entrance, px(-1.55), pz(3.66));
  // стрелка входа
  x.lineWidth = 3; x.beginPath(); x.moveTo(px(-1.55), pz(3.78)); x.lineTo(px(-1.55), pz(3.32)); x.moveTo(px(-1.65), pz(3.44)); x.lineTo(px(-1.55), pz(3.32)); x.lineTo(px(-1.45), pz(3.44)); x.stroke();
  // кольцо-линейка по краю плиты
  x.lineWidth = 2;
  for (let q = -SX + 0.1; q <= SX - 0.1; q += 0.1) {
    const L = Math.abs(Math.round(q * 10)) % 10 === 0 ? 0.08 : 0.04;
    x.beginPath(); x.moveTo(px(q), pz(-SZ + 0.03)); x.lineTo(px(q), pz(-SZ + 0.03 + L)); x.stroke();
    x.beginPath(); x.moveTo(px(q), pz(SZ - 0.03)); x.lineTo(px(q), pz(SZ - 0.03 - L)); x.stroke();
  }
  return c;
}

function engrave(lines, w, h, bg = "#fff", ink = "#2a2016") {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.fillStyle = bg; x.fillRect(0, 0, w, h);
  x.fillStyle = ink; x.textAlign = "center"; x.textBaseline = "middle";
  for (const [txt, font, y] of lines) { x.font = font; x.fillText(txt, w / 2, y); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

export async function buildSet(scene, renderer) {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const key = new THREE.DirectionalLight("#fff0d8", 3.0);
  key.position.set(-6.5, 4.2, 3.5); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -5.5, right: 5.5, top: 5.5, bottom: -5.5, near: 0.5, far: 25 });
  key.shadow.bias = -0.0002; key.shadow.normalBias = 0.01; key.shadow.radius = 3;
  const rim = new THREE.DirectionalLight("#bcd4ff", 1.7); rim.position.set(5.5, 3.0, -6);
  const rim2 = new THREE.DirectionalLight("#c9dcff", 0.9); rim2.position.set(5, 2.4, 6.5);
  const topL = new THREE.DirectionalLight("#f3f1ec", 0.7); topL.position.set(1, 9, 2);
  scene.add(key, key.target, rim, rim2, topL);

  const TL = new THREE.TextureLoader();
  const tex = async (u, srgb) => { const t = await TL.loadAsync(u); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
  const [wD, wN, wR] = await Promise.all([tex("/core/assets/polyhaven/walnut_diff.jpg", true), tex("/core/assets/polyhaven/walnut_nor.jpg"), tex("/core/assets/polyhaven/walnut_rough.jpg")]);
  for (const t of [wD, wN, wR]) t.repeat.set(2.2, 2.9);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshStandardMaterial({ color: "#d6cfc3", roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const walnut = new THREE.MeshStandardMaterial({ map: wD, normalMap: wN, roughnessMap: wR, roughness: 1, color: "#c4a68a", normalScale: new THREE.Vector2(0.6, 0.6) });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(SX * 2, SLAB, SZ * 2), walnut);
  slab.position.y = SLAB / 2; slab.castShadow = slab.receiveShadow = true; scene.add(slab);
  {
    const t = new THREE.CanvasTexture(planTexture()); t.anisotropy = 8;
    const inlay = new THREE.Mesh(new THREE.PlaneGeometry(SX * 2, SZ * 2), new THREE.MeshStandardMaterial({ color: "#f1e6d0", alphaMap: t, transparent: true, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false }));
    inlay.rotation.x = -Math.PI / 2; inlay.position.y = SLAB + 0.0006; inlay.receiveShadow = true; scene.add(inlay);
  }

  // маршрут «курица → соус»: инкрустированная пунктирная латунная дорожка (проявляется)
  const routePts = [[-1.35, 1.05], [1.93, 1.05], [1.93, -2.65], [1.35, -2.65]];
  const routeMat = new THREE.MeshStandardMaterial({ color: "#d4521c", roughness: 0.5, transparent: true, opacity: 0 });
  const route = new THREE.Group();
  {
    for (let i = 0; i < routePts.length - 1; i++) {
      const [ax, az] = routePts[i], [bx, bz] = routePts[i + 1];
      const len = Math.hypot(bx - ax, bz - az), n = Math.floor(len / 0.16);
      for (let q = 0; q < n; q++) {
        const f = (q + 0.25) / n;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.003, 0.03), routeMat);
        m.position.set(lerp(ax, bx, f), SLAB + 0.0015, lerp(az, bz, f));
        m.rotation.y = -Math.atan2(bz - az, bx - ax);
        route.add(m);
      }
    }
    scene.add(route);
  }

  // пластины
  const mats = {
    alu: new THREE.MeshStandardMaterial({ color: "#c8ccd1", metalness: 1, roughness: 0.3 }),
    brass: new THREE.MeshStandardMaterial({ color: "#d2b07a", metalness: 1, roughness: 0.3 }),
    acr: new THREE.MeshPhysicalMaterial({ color: "#5fc4c4", roughness: 0.25, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.93 }),
  };
  const groups = { alu: [], brass: [], acr: [] };
  for (const sh of SHEETS) { sh.idx = groups[sh.g].length; groups[sh.g].push(sh); }
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const meshes = {};
  for (const g of Object.keys(groups)) {
    const m = new THREE.InstancedMesh(geo, mats[g], groups[g].length);
    m.castShadow = m.receiveShadow = true; m.frustumCulled = false;
    for (const sh of groups[g]) { const v = g === "acr" ? 0.96 + (sh.shade - 0.97) * 0.4 : sh.shade; m.setColorAt(sh.idx, new THREE.Color(v, v, v)); }
    m.instanceColor.needsUpdate = true; scene.add(m); meshes[g] = m;
  }

  // товары: курица-гриль (светлый дуб) и соус (бирюзовый акрил) — с гравировкой
  const oak = new THREE.MeshStandardMaterial({ color: "#d9b98f", roughness: 0.6 });
  const chickTop = new THREE.MeshStandardMaterial({ map: engrave([[LABELS.chickenTag, "600 64px Inter", 128]], 512, 256, "#e3c79f", "#3b2a12"), roughness: 0.6 });
  const chicken = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.34, 0.36), [oak, oak, chickTop, oak, oak, oak]);
  chicken.position.set(POS.chicken[0], SLAB + 0.17, POS.chicken[1]); chicken.castShadow = chicken.receiveShadow = true; scene.add(chicken);
  const sauceSide = new THREE.MeshPhysicalMaterial({ color: "#3fb3b0", roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });
  const sauceTop = new THREE.MeshStandardMaterial({ map: engrave([[LABELS.sauceTag, "600 120px Inter", 256]], 512, 512, "#7fd3cf", "#123c3a"), roughness: 0.3 });
  const sauce = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.42, 64), [sauceSide, sauceTop, sauceSide]);
  sauce.castShadow = sauce.receiveShadow = true; scene.add(sauce);

  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), P = new THREE.Vector3(), S = new THREE.Vector3();
  function pose(sh, t) {
    const { s, k } = sh;
    if (t < sh.t0) { M4.compose(P.set(0, -5, 0), Q.identity(), S.set(0, 0, 0)); return M4; }
    let y = SLAB + s.th * (k + 0.5), yaw = sh.ja, tilt = 0, dx = 0;
    if (sh.mode === "c") { const u = seg(t, sh.t0, sh.land); y += 0.1 * (1 - eo(u)); }
    else {
      const u = seg(t, sh.t0, sh.land), f = Math.pow(1 - u, 5);
      y += 0.9 * f; yaw += (hash(k * 13.7) > 0.5 ? 1 : -1) * (0.4 + hash(k * 2.9) * 0.3) * f;
      dx = (hash(k * 3.3) - 0.5) * 0.06 * f; tilt = (hash(k * 5.1) - 0.5) * 0.14 * f;
    }
    P.set(s.x + sh.jx + dx, y, s.z + sh.jz);
    Q.setFromEuler(E.set(tilt, yaw, tilt * 0.6, "YXZ"));
    M4.compose(P, Q, S.set(s.w, s.th * 0.97, s.d));
    return M4;
  }
  function update(t) {
    for (const sh of SHEETS) meshes[sh.g].setMatrixAt(sh.idx, pose(sh, t));
    for (const g in meshes) meshes[g].instanceMatrix.needsUpdate = true;
    // маршрут проявляется и гаснет после перестановки
    routeMat.opacity = Math.min(seg(t, T.route, T.route + 1.2), 1 - seg(t, T.moveLand + 0.6, T.moveLand + 2.0)) * 0.95;
    route.visible = routeMat.opacity > 0.01;
    // соус: подъём, перелёт по дуге, падение с одним маленьким отскоком
    const u = seg(t, T.moveLift, T.moveLand);
    const [ax, az] = POS.sauceFrom, [bx, bz] = POS.sauceTo;
    const e = u < 1 ? (1 - Math.cos(u * Math.PI)) / 2 : 1;
    let y = SLAB + 0.21 + Math.sin(u * Math.PI) * 1.6;
    if (u > 0.82 && u < 1) y = SLAB + 0.21 + Math.sin(u * Math.PI) * 1.6; // плавная посадка
    if (t > T.moveLand) { const b = t - T.moveLand; y += 0.03 * Math.exp(-b * 8) * Math.abs(Math.sin(b * 22)); }
    sauce.position.set(lerp(ax, bx, e), y, lerp(az, bz, e));
    sauce.rotation.set(0, (1 - eo(u)) * 0 + u * Math.PI * 2, Math.sin(u * Math.PI) * 0.25);
  }
  return { update, key, sauce, chicken };
}
