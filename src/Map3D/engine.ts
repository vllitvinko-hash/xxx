// Мини-3D для SVG: перспективная камера, проекция точек, видимость граней.
// Мир: z вверх, пол — плоскость z=0, единицы ~сантиметры зала.
export type V3 = [number, number, number];
export const W = 1920,
  H = 1080;

export type Cam = {
  tx: number;
  ty: number;
  tz: number;
  yaw: number;
  pitch: number;
  dist: number;
  fov: number;
};

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export type Proj = { x: number; y: number; z: number; k: number }; // k — масштаб на этой глубине

export const makeCamera = (c: Cam) => {
  const pos: V3 = [
    c.tx + c.dist * Math.cos(c.pitch) * Math.cos(c.yaw),
    c.ty + c.dist * Math.cos(c.pitch) * Math.sin(c.yaw),
    c.tz + c.dist * Math.sin(c.pitch),
  ];
  const f = norm(sub([c.tx, c.ty, c.tz], pos));
  const r = norm(cross(f, [0, 0, 1]));
  const u = cross(r, f);
  const focal = H / 2 / Math.tan(c.fov / 2);
  const project = (p: V3): Proj => {
    const d = sub(p, pos);
    const zc = Math.max(1, dot(d, f));
    return {
      x: W / 2 + (focal * dot(d, r)) / zc,
      y: H / 2 - (focal * dot(d, u)) / zc,
      z: zc,
      k: focal / zc,
    };
  };
  return { pos, project };
};
export const pts = (a: Proj[]) =>
  a.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
export const facing = (center: V3, normal: V3, camPos: V3) =>
  dot(sub(camPos, center), normal) > 0;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// детерминированный «случай»
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
