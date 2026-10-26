import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp } from "../brand";
import { C, Label, MONO, SANS, Words, seg, useSp } from "../Map3D/Film";
import {
  Cam,
  H,
  Proj,
  V3,
  W,
  facing,
  lerp,
  makeCamera,
  pts,
} from "../Map3D/engine";

// «Вертикаль и горизонталь»: мерчендайзинг видит полку, чеки — путь покупателя через весь зал.
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);
export const T = {
  hook: 0,
  vert: sec(7),
  horiz: sec(17),
  both: sec(29),
  p1: sec(36),
  p2: sec(45),
  p3: sec(53),
  p4: sec(63),
  grid: sec(72),
  end: sec(79),
  dur: sec(86),
};
export const MERCH_DURATION = T.dur;
const RED = "#E5533F";

// ---------- зал ----------
type Gondola = { id: string; x: number; y: number; hue: number; k: number };
const ROWS: [number, [string, number][]][] = [
  [
    250,
    [
      ["Соусы", 6],
      ["Овощи", 105],
      ["Фрукты", 38],
      ["Хлеб", 28],
      ["Выпечка", 34],
      ["Кофе", 22],
    ],
  ],
  [
    750,
    [
      ["Чай", 140],
      ["Крупы", 44],
      ["Мясо", 356],
      ["Курица", 18],
      ["Сыр", 50],
      ["Молочка", 200],
    ],
  ],
  [
    1250,
    [
      ["Напитки", 190],
      ["Чипсы", 46],
      ["Сладости", 320],
      ["Вино", 338],
      ["Пиво", 40],
      ["Макароны", 52],
    ],
  ],
];
const GS: Gondola[] = [];
ROWS.forEach(([y, names]) =>
  names.forEach(([id, hue], i) =>
    GS.push({ id, x: 200 + i * 380, y, hue, k: GS.length }),
  ),
);
const SW = 280,
  SD = 90,
  SH = 200;
const g = (id: string) => GS.find((x) => x.id === id)!;

// соус «выводят» в главе 03: стеллаж уходит в пол
const sauceH = (f: number) =>
  1 -
  interpolate(f, [T.p3 + sec(5.6), T.p3 + sec(6.4)], [0, 1], clamp) +
  interpolate(f, [T.p4 - 10, T.p4], [0, 1], clamp);
const heightOf = (id: string, f: number) =>
  id === "Соусы" ? Math.min(1, sauceH(f)) : 1;

// ---------- камера ----------
type Key = [number, number, number, number, number, number, number]; // кадр, tx, ty, tz, yaw°, pitch°, dist
const KEYS: Key[] = [
  [0, 150, 205, 105, -98, 6, 540],
  [sec(6.4), 330, 205, 105, -84, 9, 480],
  [sec(9.6), 1150, 420, 60, -80, 24, 3150],
  [sec(16.4), 1150, 480, 60, -73, 30, 3250],
  [sec(19), 1150, 720, 0, -62, 50, 3500],
  [sec(28.4), 1150, 740, 0, -56, 54, 3450],
  [sec(31), 1150, 760, 60, -100, 32, 3300],
  [sec(35.4), 1150, 760, 60, -107, 30, 3300],
  [sec(38), 880, 760, 0, -90, 60, 3500],
  [sec(44.4), 880, 770, 0, -86, 62, 3450],
  [sec(47.2), 260, 1205, 180, -90, 30, 900],
  [sec(52.4), 200, 1205, 180, -81, 28, 820],
  [sec(55.4), 1150, 700, 0, -72, 48, 2700],
  [sec(62.4), 1100, 700, 0, -67, 50, 2650],
  [sec(65.2), 2080, 705, 340, -90, 22, 1200],
  [sec(71.4), 2050, 705, 340, -95, 20, 1150],
  [sec(74.6), 1150, 760, 0, -90, 62, 3700],
  [T.dur, 1150, 760, 0, -96, 68, 3500],
];
const camAt = (f: number): Cam => {
  let i = 0;
  while (i < KEYS.length - 2 && f > KEYS[i + 1][0]) i++;
  const a = KEYS[i],
    b = KEYS[i + 1];
  const u = interpolate(f, [a[0], b[0]], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const L = (j: number) => lerp(a[j], b[j], u);
  const rad = Math.PI / 180;
  return {
    tx: L(1),
    ty: L(2),
    tz: L(3),
    yaw: L(4) * rad,
    pitch: L(5) * rad,
    dist: L(6),
    fov: 38 * rad,
  };
};

// ---------- связи ----------
type Arc = {
  a: string;
  b: string;
  w: number;
  col: string;
  op: number;
  prog?: number;
  broken?: number;
};
const PAIRS: [string, string, number][] = [
  ["Соусы", "Макароны", 9],
  ["Пиво", "Чипсы", 8],
  ["Сыр", "Вино", 7],
  ["Кофе", "Выпечка", 6],
  ["Соусы", "Мясо", 6],
  ["Соусы", "Курица", 5],
  ["Хлеб", "Молочка", 4],
  ["Фрукты", "Молочка", 3],
  ["Чай", "Сладости", 3],
  ["Овощи", "Мясо", 3],
];
const P1_PAIRS = ["Сыр|Вино", "Пиво|Чипсы", "Соусы|Макароны", "Хлеб|Молочка"];
const P3_PAIRS = ["Соусы|Мясо", "Соусы|Курица", "Соусы|Макароны"];
const arcsAt = (f: number): Arc[] => {
  const all = (op: number): Arc[] =>
    PAIRS.map(([a, b, w]) => ({
      a,
      b,
      w,
      col: w >= 7 ? C.y : C.w,
      op: op * Math.min(1, 0.35 + w / 10),
    }));
  if (f >= T.horiz && f < T.both) {
    const prog = interpolate(
      f,
      [T.horiz + sec(6.4), T.horiz + sec(7.6)],
      [0, 1],
      clamp,
    );
    return prog > 0
      ? [{ a: "Соусы", b: "Макароны", w: 10, col: C.y, op: 1, prog }]
      : [];
  }
  if (f >= T.both && f < T.p1) {
    const k = interpolate(f, [T.both + 10, T.both + 50], [0, 1], clamp);
    return PAIRS.map(([a, b, w], i) => ({
      a,
      b,
      w,
      col: w >= 7 ? C.y : C.w,
      op: Math.min(1, 0.35 + w / 10),
      prog: interpolate(k * 10 - i * 0.6, [0, 2], [0, 1], clamp),
    }));
  }
  if (f >= T.p1 && f < T.p2) {
    return PAIRS.map(([a, b, w]) => {
      const i = P1_PAIRS.indexOf(`${a}|${b}`);
      if (i < 0) return { a, b, w, col: C.w, op: 0.12 };
      const prog = interpolate(
        f,
        [T.p1 + sec(3) + i * 14, T.p1 + sec(3) + i * 14 + 18],
        [0, 1],
        clamp,
      );
      return { a, b, w: 9, col: C.y, op: 1, prog };
    });
  }
  if (f >= T.p3 && f < T.p4) {
    const br = interpolate(
      f,
      [T.p3 + sec(5.6), T.p3 + sec(6.2)],
      [0, 1],
      clamp,
    );
    return PAIRS.filter(([a, b]) => P3_PAIRS.includes(`${a}|${b}`)).map(
      ([a, b], i) => ({
        a,
        b,
        w: 9,
        col: br > 0 ? RED : C.y,
        op:
          1 -
          interpolate(f, [T.p3 + sec(8), T.p3 + sec(9.4)], [0, 0.75], clamp),
        prog: interpolate(
          f,
          [T.p3 + sec(2.6) + i * 10, T.p3 + sec(2.6) + i * 10 + 20],
          [0, 1],
          clamp,
        ),
        broken: br,
      }),
    );
  }
  if (f >= T.grid) {
    const k = interpolate(
      f,
      [T.grid + sec(2.5), T.grid + sec(3.5)],
      [0, 1],
      clamp,
    );
    return all(k);
  }
  return [];
};

// вертикальные лучи над стеллажами
const pillarAt = (
  gd: Gondola,
  f: number,
): { h: number; op: number; col: string } => {
  if (f >= T.vert && f < T.both) {
    const s = interpolate(
      f,
      [T.vert + sec(1.6) + gd.k * 7, T.vert + sec(1.6) + gd.k * 7 + 16],
      [0, 1],
      { ...clamp, easing: Easing.out(Easing.cubic) },
    );
    const dim = interpolate(f, [T.horiz, T.horiz + 20], [1, 0.22], clamp);
    return { h: s * 760, op: dim, col: C.y };
  }
  if (f >= T.both && f < T.p1) {
    const o = 1 - interpolate(f, [T.p1 - 12, T.p1], [0, 1], clamp);
    return { h: 760, op: o, col: C.y };
  }
  if (f >= T.p2 && f < T.p3 && gd.id === "Напитки") {
    const s = interpolate(f, [T.p2 + sec(1.4), T.p2 + sec(2.2)], [0, 1], clamp);
    return { h: s * 520, op: 1, col: RED };
  }
  if (f >= T.grid && f < T.end + sec(1)) {
    const s = interpolate(
      f,
      [T.grid + sec(1) + gd.k * 2, T.grid + sec(1) + gd.k * 2 + 14],
      [0, 1],
      clamp,
    );
    return { h: s * 620, op: 1, col: C.y };
  }
  return { h: 0, op: 0, col: C.y };
};

// ---------- путь покупателя ----------
const WAY: V3[] = [
  [-200, 110, 3],
  [200, 110, 3],
  [2390, 110, 3],
  [2390, 1000, 3],
  [2100, 1000, 3],
  [2390, 1000, 3],
  [2390, 1560, 3],
];
const WAY_LEN = WAY.slice(1).map((p, i) =>
  Math.hypot(p[0] - WAY[i][0], p[1] - WAY[i][1]),
);
const WAY_TOTAL = WAY_LEN.reduce((a, b) => a + b, 0);
const wayAt = (u: number): V3 => {
  let d = u * WAY_TOTAL,
    j = 0;
  while (j < WAY_LEN.length - 1 && d > WAY_LEN[j]) {
    d -= WAY_LEN[j];
    j++;
  }
  const k = Math.min(1, d / WAY_LEN[j]);
  return [
    lerp(WAY[j][0], WAY[j + 1][0], k),
    lerp(WAY[j][1], WAY[j + 1][1], k),
    3,
  ];
};
const wayU = (i: number) =>
  WAY_LEN.slice(0, i).reduce((a, b) => a + b, 0) / WAY_TOTAL;
const WALK: [number, number] = [T.horiz + sec(0.8), T.horiz + sec(6.6)];
const walkU = (f: number) =>
  interpolate(f, WALK, [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
const PICKS: [string, number][] = [
  ["Соусы", wayU(1)],
  ["Макароны", wayU(4)],
];

// ---------- геометрия ----------
type Face = { n: V3; c: V3; p: V3[]; fill: string };
const boxFaces = (
  x: number,
  y: number,
  w: number,
  d: number,
  z0: number,
  h: number,
  side: string,
  side2: string,
): Face[] => {
  const x0 = x - w / 2,
    x1 = x + w / 2,
    y0 = y - d / 2,
    y1 = y + d / 2,
    z1 = z0 + h,
    zm = (z0 + z1) / 2;
  return [
    {
      n: [0, -1, 0],
      c: [x, y0, zm],
      p: [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y0, z1],
        [x0, y0, z1],
      ],
      fill: side,
    },
    {
      n: [0, 1, 0],
      c: [x, y1, zm],
      p: [
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x0, y1, z1],
      ],
      fill: side,
    },
    {
      n: [-1, 0, 0],
      c: [x0, y, zm],
      p: [
        [x0, y0, z0],
        [x0, y1, z0],
        [x0, y1, z1],
        [x0, y0, z1],
      ],
      fill: side2,
    },
    {
      n: [1, 0, 0],
      c: [x1, y, zm],
      p: [
        [x1, y0, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x1, y0, z1],
      ],
      fill: side2,
    },
    {
      n: [0, 0, 1],
      c: [x, y, z1],
      p: [
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1],
      ],
      fill: side,
    },
  ];
};
const visible = (a: Proj[]) => a.every((p) => p.z > 30);

const World: React.FC<{ f: number }> = ({ f }) => {
  const cam = makeCamera(camAt(f));
  const P = cam.project;
  const poly = (a: V3[]) => {
    const pp = a.map(P);
    return visible(pp) ? pts(pp) : null;
  };
  // пол и сетка
  const gridK =
    f >= T.grid ? interpolate(f, [T.grid + 10, T.grid + 60], [0, 1], clamp) : 0;
  const grid: React.ReactNode[] = [];
  const line = (key: string, a: V3, b: V3, hot: number) => {
    const pa = P(a),
      pb = P(b);
    if (pa.z < 30 || pb.z < 30) return;
    grid.push(
      <line
        key={key}
        {...seg(pa, pb)}
        stroke={hot > 0 ? C.y : C.grid}
        strokeOpacity={hot > 0 ? 0.25 + hot * 0.5 : 1}
        strokeWidth={hot > 0 ? 2 + hot * 2 : 1.5}
      />,
    );
  };
  for (let x = -200; x <= 2600; x += 200)
    line(
      `gx${x}`,
      [x, -100, 0],
      [x, 1600, 0],
      gridK * (x % 400 === 0 ? 1 : 0.5),
    );
  for (let y = -100; y <= 1600; y += 200)
    line(
      `gy${y}`,
      [-250, y, 0],
      [2600, y, 0],
      gridK * (y % 400 === 300 ? 1 : 0.5),
    );

  // стеллажи: дальние первыми
  const order = GS.map((gd) => ({ gd, d: P([gd.x, gd.y, SH / 2]).z })).sort(
    (a, b) => b.d - a.d,
  );
  const supplier = f >= T.p2 && f < T.p3;
  const p3hot = f >= T.p3 + sec(2.6) && f < T.p3 + sec(5.6);
  const p3lost = f >= T.p3 + sec(5.6) && f < T.p4;
  const shelves = order.map(({ gd }) => {
    const hk = heightOf(gd.id, f);
    if (hk <= 0.01) return null;
    const h = SH * hk;
    const isSup = supplier && gd.id === "Напитки";
    const isTarget = ["Мясо", "Курица", "Макароны"].includes(gd.id);
    const tint =
      (p3hot && (isTarget || gd.id === "Соусы")) ||
      (f >= T.horiz &&
        f < T.both &&
        f > T.horiz + sec(6.4) &&
        (gd.id === "Соусы" || gd.id === "Макароны"))
        ? "hot"
        : p3lost && isTarget
          ? "lost"
          : isSup
            ? "sup"
            : "";
    const sideA =
      tint === "hot" ? "#7E6612" : tint === "lost" ? "#5E2A22" : C.sideA;
    const sideB =
      tint === "hot" ? "#685410" : tint === "lost" ? "#4C221C" : C.sideB;
    const faces = boxFaces(gd.x, gd.y, SW, SD, 0, h, sideA, sideB);
    const out: React.ReactNode[] = [];
    faces.slice(0, 4).forEach((fc, i) => {
      if (!facing(fc.c, fc.n, cam.pos)) return;
      const pp = poly(fc.p);
      if (pp)
        out.push(
          <polygon
            key={`s${i}`}
            points={pp}
            fill={fc.fill}
            stroke={C.edge}
            strokeOpacity={0.45}
            strokeWidth={1}
          />,
        );
    });
    // товары на видимой длинной стороне
    const front = cam.pos[1] < gd.y - SD / 2;
    const back = cam.pos[1] > gd.y + SD / 2;
    if ((front || back) && hk > 0.6) {
      const fy = front ? gd.y - SD / 2 - 1 : gd.y + SD / 2 + 1;
      const c = P([gd.x, fy, SH / 2]);
      const detail = c.k * SW > 90;
      for (let L = 0; L < 4; L++) {
        const zb = 12 + L * 47;
        if (zb + 36 > h) break;
        if (!detail) {
          const pp = poly([
            [gd.x - SW / 2 + 8, fy, zb],
            [gd.x + SW / 2 - 8, fy, zb],
            [gd.x + SW / 2 - 8, fy, zb + 34],
            [gd.x - SW / 2 + 8, fy, zb + 34],
          ]);
          if (pp)
            out.push(
              <polygon
                key={`l${L}`}
                points={pp}
                fill={isSup ? RED : `hsl(${gd.hue} 50% 46%)`}
                opacity={0.85}
              />,
            );
          continue;
        }
        for (let j = 0; j < 8; j++) {
          const x0 = gd.x - SW / 2 + 10 + j * 33.5;
          const tall = 30 + ((j * 7 + L * 3 + gd.k) % 3) * 3;
          const light = 42 + ((j * 5 + L * 2 + gd.k) % 3) * 9;
          const col =
            isSup && L >= 1 && L <= 2
              ? j % 2
                ? RED
                : "#F2EDE4"
              : `hsl(${gd.hue} 58% ${light}%)`;
          const pp = poly([
            [x0, fy, zb],
            [x0 + 29, fy, zb],
            [x0 + 29, fy, zb + tall],
            [x0, fy, zb + tall],
          ]);
          if (pp)
            out.push(<polygon key={`p${L}-${j}`} points={pp} fill={col} />);
        }
        // полка и ценники
        const lip = poly([
          [gd.x - SW / 2, fy, zb - 6],
          [gd.x + SW / 2, fy, zb - 6],
          [gd.x + SW / 2, fy, zb - 1],
          [gd.x - SW / 2, fy, zb - 1],
        ]);
        if (lip)
          out.push(
            <polygon
              key={`lip${L}`}
              points={lip}
              fill="#CFE3D6"
              opacity={0.9}
            />,
          );
        for (let j = 0; j < 8; j += 2) {
          const x0 = gd.x - SW / 2 + 14 + j * 33.5;
          const tag = poly([
            [x0, fy - 0.5, zb - 7],
            [x0 + 22, fy - 0.5, zb - 7],
            [x0 + 22, fy - 0.5, zb],
            [x0, fy - 0.5, zb],
          ]);
          if (tag)
            out.push(
              <polygon
                key={`t${L}-${j}`}
                points={tag}
                fill={isSup ? RED : C.y}
              />,
            );
        }
      }
    }
    const top = poly(faces[4].p);
    if (top)
      out.push(
        <polygon
          key="top"
          points={top}
          fill={
            tint === "hot" ? C.y : tint === "lost" ? RED : isSup ? RED : C.top
          }
          stroke={C.edge}
          strokeWidth={1.2}
        />,
      );
    const lb = P([gd.x, gd.y, h + 46]);
    if (lb.z > 30)
      out.push(
        <text
          key="lb"
          x={lb.x}
          y={lb.y}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={Math.min(46, Math.max(12, lb.k * 44))}
          fill={
            tint === "hot"
              ? C.y
              : tint === "lost"
                ? RED
                : isSup
                  ? "#FF9A8C"
                  : C.dim
          }
        >
          {gd.id.toUpperCase()}
        </text>,
      );
    return (
      <g key={gd.id} opacity={Math.min(1, hk * 1.5)}>
        {out}
      </g>
    );
  });

  // бары продаж йогуртов над «Молочкой» (глава 04)
  const bars: React.ReactNode[] = [];
  if (f >= T.p4 && f < T.grid) {
    const m = g("Молочка");
    const s = interpolate(f, [T.p4 + sec(1.6), T.p4 + sec(3)], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
    const show = interpolate(f, [T.p4 + 10, T.p4 + 30], [0, 1], clamp);
    const hs = [lerp(150, 210, s) * show, lerp(150, 90, s) * show];
    [-70, 70].forEach((dx, i) => {
      const fc = boxFaces(
        m.x + dx,
        m.y,
        100,
        60,
        SH,
        hs[i],
        i ? "#8E3A2E" : "#B8961F",
        i ? "#6E2C23" : "#8F7414",
      );
      fc.forEach((q, qi) => {
        if (qi < 4 && !facing(q.c, q.n, cam.pos)) return;
        const pp = poly(q.p);
        if (pp)
          bars.push(
            <polygon
              key={`b${i}-${qi}`}
              points={pp}
              fill={qi === 4 ? (i ? RED : C.y) : q.fill}
            />,
          );
      });
    });
  }

  // лучи
  const beams: React.ReactNode[] = [];
  const yaw = camAt(f).yaw;
  const px = -Math.sin(yaw),
    py = Math.cos(yaw);
  GS.forEach((gd) => {
    const b = pillarAt(gd, f);
    if (b.h <= 1 || b.op <= 0) return;
    const hw = SW * 0.32;
    const z0 = SH * heightOf(gd.id, f);
    for (let s = 0; s < 6; s++) {
      const za = z0 + (b.h * s) / 6,
        zb = z0 + (b.h * (s + 1)) / 6;
      const pp = poly([
        [gd.x - px * hw, gd.y - py * hw, za],
        [gd.x + px * hw, gd.y + py * hw, za],
        [gd.x + px * hw, gd.y + py * hw, zb],
        [gd.x - px * hw, gd.y - py * hw, zb],
      ]);
      if (pp)
        beams.push(
          <polygon
            key={`${gd.id}${s}`}
            points={pp}
            fill={b.col}
            opacity={b.op * 0.3 * (1 - s / 6)}
          />,
        );
    }
    const a = P([gd.x, gd.y, z0]),
      c = P([gd.x, gd.y, z0 + b.h]);
    if (a.z > 30 && c.z > 30)
      beams.push(
        <line
          key={`${gd.id}core`}
          {...seg(a, c)}
          stroke={b.col}
          strokeWidth={Math.max(2, a.k * 10)}
          strokeLinecap="round"
          opacity={b.op * 0.95}
        />,
      );
  });

  // дуги
  const arcs = arcsAt(f).map((ar) => {
    const ga = g(ar.a),
      gb = g(ar.b);
    const A: V3 = [ga.x, ga.y, SH],
      B: V3 = [gb.x, gb.y, SH];
    const dist = Math.hypot(A[0] - B[0], A[1] - B[1]);
    const peak = 80 + dist * 0.3;
    const prog = ar.prog ?? 1;
    const n = 30;
    const parts: Proj[][] = [[]];
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      if (u > prog) break;
      // обрыв: из середины дуги выпадает кусок
      if (ar.broken && Math.abs(u - 0.5) < 0.2 * ar.broken) {
        if (parts[parts.length - 1].length) parts.push([]);
        continue;
      }
      parts[parts.length - 1].push(
        P([
          lerp(A[0], B[0], u),
          lerp(A[1], B[1], u),
          SH + Math.sin(u * Math.PI) * peak,
        ]),
      );
    }
    const mid = P([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, SH + peak]);
    const sw = Math.min(14, 1.5 + ar.w * 0.6) * mid.k * 3.2;
    return (
      <g key={`${ar.a}|${ar.b}`} opacity={ar.op}>
        {parts
          .filter((p) => p.length > 1 && visible(p))
          .map((p, i) => (
            <g key={i}>
              <polyline
                points={pts(p)}
                fill="none"
                stroke={ar.col}
                strokeWidth={sw * 3.2}
                opacity={0.14}
                strokeLinecap="round"
              />
              <polyline
                points={pts(p)}
                fill="none"
                stroke={ar.col}
                strokeWidth={sw}
                opacity={0.95}
                strokeLinecap="round"
              />
            </g>
          ))}
      </g>
    );
  });

  // покупатель и его след
  const walk: React.ReactNode[] = [];
  if (f >= T.horiz && f < T.both) {
    const u = walkU(f);
    const fade = 1 - interpolate(f, [T.both - 20, T.both], [0, 1], clamp);
    const trail: Proj[] = [];
    for (let i = 0; i <= 120; i++) {
      const v = (i / 120) * u;
      trail.push(P(wayAt(v)));
    }
    if (visible(trail) && u > 0)
      walk.push(
        <g key="trail" opacity={fade}>
          <polyline
            points={pts(trail)}
            fill="none"
            stroke={C.y}
            strokeWidth={22 * trail[trail.length - 1].k}
            opacity={0.18}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={pts(trail)}
            fill="none"
            stroke={C.y}
            strokeWidth={7 * trail[trail.length - 1].k}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>,
      );
    const me = P(wayAt(u));
    if (me.z > 30 && u > 0 && u < 1)
      walk.push(
        <g key="me" opacity={fade}>
          <circle cx={me.x} cy={me.y} r={me.k * 70} fill={C.w} opacity={0.15} />
          <circle cx={me.x} cy={me.y} r={me.k * 30} fill={C.w} />
        </g>,
      );
    PICKS.forEach(([id, pu]) => {
      const t = walkFrame(pu);
      if (f < t || f > t + 20) return;
      const r = (f - t) / 20;
      const gd = g(id);
      const p = P([gd.x, gd.y, SH]);
      walk.push(
        <circle
          key={`pk${id}`}
          cx={p.x}
          cy={p.y}
          r={p.k * (60 + r * 260)}
          fill="none"
          stroke={C.y}
          strokeWidth={Math.max(2, p.k * 14 * (1 - r))}
          opacity={1 - r}
        />,
      );
    });
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="mfl" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#0F3524" />
          <stop offset="100%" stopColor={C.bg} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#mfl)" />
      {(() => {
        const fl = poly([
          [-250, -100, 0],
          [2600, -100, 0],
          [2600, 1600, 0],
          [-250, 1600, 0],
        ]);
        return fl ? <polygon points={fl} fill={C.floor} /> : null;
      })()}
      {grid}
      {walk}
      {shelves}
      {bars}
      <g style={{ mixBlendMode: "screen" }}>
        {beams}
        {arcs}
      </g>
    </svg>
  );
};
// кадр, на котором покупатель проходит точку пути pu
const walkFrame = (pu: number) => {
  for (let fr = WALK[0]; fr <= WALK[1]; fr++) if (walkU(fr) >= pu) return fr;
  return WALK[1];
};

// ---------- экранный слой ----------
const Scrim: React.FC<{ top?: number; bottom?: number }> = ({
  top = 1,
  bottom = 0,
}) => (
  <>
    <AbsoluteFill
      style={{
        opacity: top,
        background:
          "linear-gradient(180deg, rgba(6,25,15,0.94) 0%, rgba(6,25,15,0.6) 24%, rgba(6,25,15,0) 44%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: bottom,
        background:
          "linear-gradient(0deg, rgba(6,25,15,0.95) 0%, rgba(6,25,15,0.7) 20%, rgba(6,25,15,0) 40%)",
      }}
    />
  </>
);

const Receipt: React.FC<{
  head: string;
  rows: string[];
  total: string;
  s: number;
  x: number;
  y: number;
  r?: number;
  w?: number;
}> = ({ head, rows, total, s, x, y, r = -3, w = 400 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      background: "#F7F5EF",
      padding: "26px 30px",
      fontFamily: MONO,
      color: C.ink,
      opacity: s,
      transform: `translateY(${(1 - s) * 60}px) rotate(${r}deg)`,
      boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
    }}
  >
    <div
      style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.14em",
        color: "#6B6F73",
      }}
    >
      {head}
    </div>
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "16px 0 6px" }} />
    {rows.map((row) => (
      <div
        key={row}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: 28,
          marginTop: 10,
        }}
      >
        <span>{row}</span>
        <span>×1</span>
      </div>
    ))}
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "18px 0 10px" }} />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 40,
      }}
    >
      <span>ИТОГ</span>
      <span>{total}</span>
    </div>
  </div>
);

// ярлык, привязанный к точке 3D-зала
const Tag3D: React.FC<{
  at: V3;
  s: number;
  children: React.ReactNode;
  bg?: string;
  color?: string;
  dy?: number;
}> = ({ at, s, children, bg = C.y, color = C.ink, dy = -70 }) => {
  const f = useCurrentFrame();
  if (s <= 0) return null;
  const p = makeCamera(camAt(f)).project(at);
  if (p.z < 30) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y + dy,
        transform: `translateX(-50%) scale(${0.85 + 0.15 * s})`,
        opacity: s,
        background: bg,
        color,
        padding: "10px 20px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 34,
        whiteSpace: "nowrap",
        boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
};
const win = (f: number, a: number, b: number, fade = 12) =>
  interpolate(f, [a, a + fade], [0, 1], clamp) *
  (1 - interpolate(f, [b - fade, b], [0, 1], clamp));

// номер и название главы
const Chapter: React.FC<{
  n: string;
  title: string;
  at: number;
  out: number;
}> = ({ n, title, at, out }) => {
  const f = useCurrentFrame();
  const s = useSp(at + 4, 14);
  const o = 1 - interpolate(f, [out - 10, out], [0, 1], clamp);
  if (f < at || f >= out) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 66,
        display: "flex",
        alignItems: "baseline",
        gap: 30,
        opacity: o,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 132,
          color: C.y,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          transform: `translateY(${(1 - s) * 40}px)`,
          opacity: s,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 70,
          color: C.w,
          letterSpacing: "-0.04em",
          lineHeight: 1.02,
          maxWidth: 1350,
          opacity: interpolate(f, [at + 10, at + 22], [0, 1], clamp),
          transform: `translateX(${(1 - interpolate(f, [at + 10, at + 22], [0, 1], clamp)) * -30}px)`,
          textShadow: "0 6px 40px rgba(0,0,0,0.55)",
        }}
      >
        {title}
      </div>
    </div>
  );
};

const Rules: React.FC = () => {
  const f = useCurrentFrame();
  const s = win(f, T.p1 + 20, T.p2, 14);
  const rules = [
    "соусы — к соусам",
    "молочка — к молочке",
    "пиво — к напиткам",
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 300,
        width: 520,
        padding: "30px 36px",
        background: "rgba(6,25,15,0.9)",
        border: `2px solid ${C.dim}`,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: "0.16em",
          color: C.dim,
        }}
      >
        КАК ПРИНЯТО
      </div>
      {rules.map((r, i) => (
        <div
          key={r}
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 38,
            color: C.w,
            marginTop: 16,
            opacity: interpolate(
              f,
              [T.p1 + 34 + i * 8, T.p1 + 46 + i * 8],
              [0, 1],
              clamp,
            ),
          }}
        >
          {r}
        </div>
      ))}
      <div
        style={{
          marginTop: 28,
          paddingTop: 22,
          borderTop: `2px solid ${C.grid}`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: "0.16em",
          color: C.y,
          opacity: interpolate(
            f,
            [T.p1 + sec(3), T.p1 + sec(3.6)],
            [0, 1],
            clamp,
          ),
        }}
      >
        ВАШИ ЧЕКИ → ПАРЫ НА КАРТЕ
      </div>
    </div>
  );
};

const LossCounter: React.FC = () => {
  const f = useCurrentFrame();
  const at = T.p3 + sec(6.3);
  const s = useSp(at, 12);
  const n = Math.round(
    interpolate(f, [at, at + 40], [0, 12], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const o = 1 - interpolate(f, [T.p4 - 10, T.p4], [0, 1], clamp);
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top: 280,
        textAlign: "right",
        opacity: s * o,
        padding: "30px 50px 50px 200px",
        background:
          "radial-gradient(ellipse at 65% 50%, rgba(6,25,15,0.94) 0%, rgba(6,25,15,0.8) 50%, rgba(6,25,15,0) 72%)",
        transform: `scale(${0.8 + 0.2 * s})`,
        transformOrigin: "right top",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 190,
          color: RED,
          letterSpacing: "-0.06em",
          lineHeight: 1,
        }}
      >
        −{n}%
      </div>
      <div
        style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.w }}
      >
        выручка мяса и курицы
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "0.14em",
          color: C.dim,
          marginTop: 10,
        }}
      >
        ПРИМЕР
      </div>
    </div>
  );
};

const Legend: React.FC = () => {
  const f = useCurrentFrame();
  const s1 = win(f, T.both + 20, T.p1, 12),
    s2 = win(f, T.both + 40, T.p1, 12);
  const row = (icon: string, a: string, b: string, s: number) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: s,
        transform: `translateY(${(1 - s) * 20}px)`,
        marginTop: 14,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: C.y,
          width: 60,
          textAlign: "center",
        }}
      >
        {icon}
      </span>
      <span
        style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.w }}
      >
        {a}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "0.1em",
          color: C.dim,
        }}
      >
        {b}
      </span>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 110, bottom: 70 }}>
      {row("↕", "Вертикаль", "МЕРЧЕНДАЙЗИНГ: ПОЛКА ЗА ПОЛКОЙ", s1)}
      {row("↔", "Горизонталь", "АНАЛИЗ ЧЕКОВ: СВЯЗИ ЧЕРЕЗ ЗАЛ", s2)}
    </div>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const r = win(f, sec(2.4), sec(4.4), 10);
  const big = useSp(sec(4.2), 13);
  const out = 1 - interpolate(f, [T.vert - 12, T.vert], [0, 1], clamp);
  return (
    <>
      <Receipt
        head="СРЕДНИЙ ЧЕК"
        rows={["год назад: 1 240 ₽"]}
        total="1 240 ₽"
        s={r}
        x={1340}
        y={380}
        r={3}
        w={460}
      />
      {f >= sec(4.2) && (
        <AbsoluteFill
          style={{
            background: `rgba(6,25,15,${0.72 * big * out})`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 190,
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              lineHeight: 0.95,
              color: C.w,
              textAlign: "center",
              opacity: big * out,
              transform: `scale(${0.85 + 0.15 * big})`,
            }}
          >
            Красиво
            <br />
            <span style={{ color: C.y }}>≠</span> прибыльно
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = useSp(T.end + 4, 15),
    o = useSp(T.end + 20, 14),
    btn = useSp(T.end + 40, 11);
  const it = (i: number) =>
    interpolate(f, [T.end + 28 + i * 7, T.end + 44 + i * 7], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: `rgba(6,25,15,${0.9 * a})` }}>
      <div style={{ position: "absolute", left: 110, top: 110, opacity: a }}>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.2em",
            color: C.y,
          }}
        >
          АНАЛИТИКА ПРО
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 100,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: C.w,
            marginTop: 18,
          }}
        >
          Покажем горизонталь
          <br />
          вашего магазина
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 450, opacity: o }}>
        <div
          style={{
            display: "inline-block",
            background: C.y,
            color: C.ink,
            padding: "12px 26px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
          }}
        >
          Бесплатный экспресс-разбор
        </div>
        {[
          "3 находки по вашим чекам",
          "за 2 рабочих дня",
          "только выгрузка чеков — без доступа к кассе",
        ].map((x, i) => (
          <div
            key={x}
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 40,
              color: C.w,
              marginTop: 16,
              opacity: it(i),
              transform: `translateX(${(1 - it(i)) * -30}px)`,
            }}
          >
            <span style={{ color: C.y }}>✓</span> {x}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 830,
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            background: C.w,
            color: C.ink,
            padding: "18px 40px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 56,
            transform: `scale(${btn})`,
            transformOrigin: "left center",
          }}
        >
          analytic-pro.ru
        </div>
        <div style={{ opacity: btn }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 34,
              color: C.w,
            }}
          >
            на сайте — калькулятор и кейсы
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 34,
              color: C.y,
              marginTop: 6,
              transform: `translateX(${Math.sin(f / 5) * 8}px)`,
            }}
          >
            ссылка в профиле →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.vert || f >= T.end) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 34,
        right: 44,
        display: "flex",
        gap: 10,
        alignItems: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.12em",
        color: C.w,
        opacity: 0.85,
      }}
    >
      АНАЛИТИКА{" "}
      <span style={{ background: C.y, color: C.ink, padding: "2px 10px" }}>
        ПРО
      </span>
    </div>
  );
};

// ---------- обложка ----------
export const MerchCover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <World f={T.both + sec(4)} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(6,25,15,0.97) 0%, rgba(6,25,15,0.88) 42%, rgba(6,25,15,0.15) 72%, rgba(6,25,15,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 110,
        fontFamily: SANS,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "-0.045em",
        lineHeight: 0.94,
      }}
    >
      <div style={{ fontSize: 150, color: C.w }}>Красиво</div>
      <div style={{ fontSize: 150, color: C.y }}>≠</div>
      <div style={{ fontSize: 150, color: C.w }}>прибыльно</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 90,
        bottom: 90,
        background: C.y,
        padding: "14px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        textTransform: "uppercase",
        fontSize: 48,
        letterSpacing: "-0.03em",
        color: C.ink,
      }}
    >
      что мерчендайзинг не видит
    </div>
  </AbsoluteFill>
);

// ---------- фильм ----------
const SFX: React.FC<{ at: number; src: string; v: number }> = ({
  at,
  src,
  v,
}) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={v} />
  </Sequence>
);

export const MerchFilm: React.FC = () => {
  const f = useCurrentFrame();
  const bottom =
    f >= T.p1 && f < T.grid ? 1 : f >= T.horiz && f < T.both ? 0.0 : 0;
  const p3 = (s: number) => T.p3 + sec(s);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <World f={f} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <Scrim top={f < T.end ? 1 : 0} bottom={bottom} />

      {/* 0–7: красивая полка */}
      <Words
        text="Полки идеальные. Ценники ровные."
        at={10}
        size={80}
        y={70}
        w={1700}
        out={sec(4.4)}
      />
      <Words
        text="А средний чек — тот же, что год назад."
        at={sec(2.3)}
        size={56}
        y={170}
        w={1700}
        mark={["тот", "же"]}
        out={sec(4.4)}
      />
      {f < T.vert && <Hook />}

      {/* 7–17: вертикаль */}
      <Label s={win(f, T.vert + 6, T.horiz, 10)} x={112} y={70}>
        ↕ МЕРЧЕНДАЙЗИНГ
      </Label>
      <Words
        text="Смотрит на магазин вертикально: полка за полкой, категория за категорией."
        at={T.vert + 14}
        size={66}
        y={112}
        w={1650}
        mark={["вертикально"]}
        out={T.horiz}
      />

      {/* 17–29: горизонталь */}
      <Label s={win(f, T.horiz + 6, T.both, 10)} x={112} y={70}>
        ↔ ПОКУПАТЕЛЬ
      </Label>
      <Words
        text="А покупатель ходит горизонтально — через весь зал."
        at={T.horiz + 10}
        size={66}
        y={112}
        w={1650}
        mark={["горизонтально"]}
        out={T.horiz + sec(6.6)}
      />
      <Words
        text="Соус и макароны в разных концах. Эту линию видно только в чеке."
        at={T.horiz + sec(6.8)}
        size={62}
        y={112}
        w={1250}
        mark={["чеке"]}
        out={T.both}
      />
      <Receipt
        head="ЧЕК № 2291"
        rows={["СОУС ТОМАТНЫЙ", "МАКАРОНЫ"]}
        total="318 ₽"
        s={win(f, T.horiz + sec(7.4), T.both, 12)}
        x={1420}
        y={560}
        r={4}
      />

      {/* 29–36: вместе */}
      <Words
        text="Полку видно по вертикали. Покупателя — только по горизонтали."
        at={T.both + 8}
        size={64}
        y={80}
        w={1700}
        out={T.both + sec(3.6)}
      />
      <Words
        text="4 вещи, которые по вертикали не увидеть"
        at={T.both + sec(3.8)}
        size={76}
        y={80}
        w={1700}
        mark={["не", "увидеть"]}
        out={T.p1}
      />
      <Legend />

      {/* 01 */}
      <Chapter n="01" title="Не ваши покупатели" at={T.p1} out={T.p2} />
      <Rules />
      <Words
        text="Выкладывают «как принято». А что берут вместе именно ваши покупатели — видно только в ваших чеках."
        at={T.p1 + sec(1.2)}
        size={46}
        y={890}
        w={1700}
        mark={["ваших", "чеках"]}
        out={T.p2}
      />
      <Tag3D
        at={[1720, 750, SH + 60]}
        s={win(f, T.p1 + sec(3.4), T.p2)}
        dy={-110}
      >
        сыр + вино
      </Tag3D>
      <Tag3D
        at={[1150, 1250, SH + 60]}
        s={win(f, T.p1 + sec(3.9), T.p2)}
        dy={-60}
      >
        пиво + чипсы
      </Tag3D>

      {/* 02 */}
      <Chapter n="02" title="Выкладка поставщика" at={T.p2} out={T.p3} />
      <Tag3D
        at={[200, 1205, SH + 150]}
        s={win(f, T.p2 + sec(2.2), T.p3)}
        bg={RED}
        color={C.w}
        dy={-20}
      >
        лучшее место — его товару
      </Tag3D>
      <Words
        text="Поставщик ставит свой товар на лучшее место своей полки. Что ещё человек положит в корзину — его не волнует."
        at={T.p2 + sec(1.2)}
        size={46}
        y={890}
        w={1700}
        mark={["своей", "полки"]}
        out={T.p3}
      />

      {/* 03 */}
      <Chapter
        n="03"
        title="Слабый по вертикали — сильный по горизонтали"
        at={T.p3}
        out={T.p4}
      />
      <Tag3D
        at={[200, 250, SH]}
        s={win(f, p3(0.8), p3(5.6), 10)}
        bg={RED}
        color={C.w}
        dy={-120}
      >
        9 место из 10 в категории
      </Tag3D>
      <Words
        text="Соус — внизу своей категории. Кандидат на вывод."
        at={p3(1)}
        size={46}
        y={890}
        w={1700}
        out={p3(2.6)}
      />
      <Words
        text="Но с ним в чеке — мясо, курица и макароны."
        at={p3(2.8)}
        size={46}
        y={890}
        w={1700}
        mark={["мясо", "курица", "макароны"]}
        out={p3(5.6)}
      />
      <Words
        text="Убрали соус — и потеряли их."
        at={p3(5.8)}
        size={62}
        y={870}
        w={1700}
        mark={["потеряли"]}
        out={T.p4}
      />
      <LossCounter />

      {/* 04 */}
      <Chapter n="04" title="Вырос товар — или чек?" at={T.p4} out={T.grid} />
      {(() => {
        const m = g("Молочка");
        return (
          <>
            <Tag3D
              at={[m.x - 70, m.y, SH + 230]}
              s={win(f, T.p4 + sec(3), T.p4 + sec(4.8))}
              dy={-70}
            >
              йогурт А +40%
            </Tag3D>
            <Tag3D
              at={[m.x + 70, m.y, SH + 110]}
              s={win(f, T.p4 + sec(3.3), T.p4 + sec(4.8))}
              bg={RED}
              color={C.w}
              dy={-70}
            >
              йогурт Б −40%
            </Tag3D>
          </>
        );
      })()}
      <Receipt
        head="ДО"
        rows={["ЙОГУРТ Б", "ХЛЕБ", "СЫР"]}
        total="1 240 ₽"
        s={win(f, T.p4 + sec(4.8), T.grid)}
        x={560}
        y={330}
        r={-4}
      />
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 470,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 130,
          color: C.y,
          opacity: win(f, T.p4 + sec(5.4), T.grid),
        }}
      >
        =
      </div>
      <Receipt
        head="ПОСЛЕ"
        rows={["ЙОГУРТ А", "ХЛЕБ", "СЫР"]}
        total="1 240 ₽"
        s={win(f, T.p4 + sec(5.2), T.grid)}
        x={1140}
        y={330}
        r={3}
      />
      <Words
        text="Йогурт А вырос на 40%. А чек — нет: его просто взяли вместо Б."
        at={T.p4 + sec(1.2)}
        size={46}
        y={890}
        w={1700}
        mark={["вместо", "Б"]}
        out={T.grid}
      />

      {/* сетка */}
      <Words
        text="Вертикаль — порядок на полке. Горизонталь — связи через весь зал."
        at={T.grid + 10}
        size={60}
        y={80}
        w={1700}
        mark={["Вертикаль", "Горизонталь"]}
        out={T.end}
      />
      <Words
        text="Вместе — полная картина."
        at={T.grid + sec(3.4)}
        size={84}
        y={250}
        w={1700}
        mark={["полная", "картина"]}
        out={T.end}
      />

      {f >= T.end && <EndCard />}
      <Brand />

      {/* звук */}
      <Audio
        src={staticFile("music/bed-long.mp3")}
        volume={(fr) =>
          interpolate(fr, [0, 20, T.dur - 60, T.dur], [0, 0.6, 0.6, 0], clamp)
        }
      />
      {[T.vert, T.horiz, T.both, T.p1, T.p2, T.p3, T.p4, T.grid, T.end].map(
        (b) => (
          <SFX key={`w${b}`} at={b - 8} src="whoosh" v={0.45} />
        ),
      )}
      <SFX at={sec(2.4)} src="printer" v={0.4} />
      <SFX at={sec(4.2)} src="impact" v={0.7} />
      {GS.filter((_, i) => i % 2 === 0).map((gd) => (
        <SFX
          key={`t${gd.id}`}
          at={T.vert + sec(1.6) + gd.k * 7}
          src="tick"
          v={0.25}
        />
      ))}
      {PICKS.map(([id, pu]) => (
        <SFX key={`pk${id}`} at={walkFrame(pu)} src="pop" v={0.5} />
      ))}
      <SFX at={T.horiz + sec(7.4)} src="printer" v={0.35} />
      {[T.p1, T.p2, T.p3, T.p4].map((b) => (
        <SFX key={`c${b}`} at={b + 4} src="pop" v={0.4} />
      ))}
      <SFX at={p3(4.6)} src="riser" v={0.5} />
      <SFX at={p3(5.6)} src="impact" v={0.8} />
      <SFX at={T.p4 + sec(1.6)} src="riser" v={0.3} />
      <SFX at={T.grid + sec(1)} src="riser" v={0.4} />
      <SFX at={T.grid + sec(3.4)} src="impact" v={0.5} />
      <Sequence durationInFrames={1}>
        <MerchCover />
      </Sequence>
    </AbsoluteFill>
  );
};
