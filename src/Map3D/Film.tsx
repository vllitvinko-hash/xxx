import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../brand";
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
  rnd,
} from "./engine";

// «Невидимая карта магазина»: чеки падают на 3D-план зала и рисуют связи между товарами.
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);
export const T = {
  hook: 0,
  snow: sec(3),
  arcs: sec(8),
  pairs: sec(16),
  far: sec(24),
  move: sec(32),
  cards: sec(40),
  top: sec(48),
  end: sec(55),
  dur: sec(62),
};
export const MAP_DURATION = T.dur;

const C = {
  bg: "#06190F",
  floor: "#0B2A1B",
  grid: "#16402B",
  top: "#2F7A55",
  sideA: "#1C5B3D",
  sideB: "#134631",
  edge: "#3E8E66",
  y: "#FFD23F",
  w: "#FFFFFF",
  dim: "#7FA390",
  red: "#FF6B5A",
  ink: "#16181A",
};
const SANS = "Inter, sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ---------- зал ----------
type Shelf = { id: string; name: string; x: number; y: number };
const ROWS: [number, (string | null)[]][] = [
  [
    250,
    [
      "Курица-гриль",
      null,
      "Бытовая химия",
      "Макароны",
      "Крупы",
      "Мясо",
      "Соусы",
    ],
  ],
  [700, ["Фрукты", "Вода", "Чипсы", "Соки", "Сладости", "Чай", "Заморозка"]],
  [1150, ["Хлеб", "Выпечка", "Кофе", "Молочка", "Сыр", "Вино", "Пиво"]],
];
const SHELVES: Shelf[] = [];
ROWS.forEach(([y, names]) =>
  names.forEach((n, i) => {
    if (n) SHELVES.push({ id: n, name: n, x: 200 + i * 320, y });
  }),
);
const SW = 230,
  SD = 100,
  SH = 120;
const byId = (id: string) => SHELVES.find((s) => s.id === id)!;
const SAUCE_TO: [number, number] = [520, 250];

// перестановка: соус переезжает к курице
const sauceAt = (f: number): [number, number, number] => {
  const s = byId("Соусы");
  const u = interpolate(f, [T.move + 20, T.move + 110], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const lift = Math.sin(u * Math.PI) * 420;
  return [lerp(s.x, SAUCE_TO[0], u), lerp(s.y, SAUCE_TO[1], u), lift];
};
const posOf = (id: string, f: number): [number, number, number] => {
  if (id === "Соусы") return sauceAt(f);
  const s = byId(id);
  return [s.x, s.y, 0];
};

// ---------- чеки и пары ----------
const PAIRS: [string, string, number][] = [
  ["Курица-гриль", "Соусы", 9],
  ["Пиво", "Чипсы", 8],
  ["Кофе", "Выпечка", 8],
  ["Макароны", "Соусы", 5],
  ["Вино", "Сыр", 5],
  ["Хлеб", "Молочка", 4],
  ["Фрукты", "Соки", 3],
  ["Чай", "Сладости", 3],
];
type Receipt = { t: number; items: string[]; dx: number; dy: number };
const RECEIPTS: Receipt[] = (() => {
  const out: Receipt[] = [];
  const total = PAIRS.reduce((a, p) => a + p[2], 0);
  const N = 170;
  for (let i = 0; i < N; i++) {
    // ускоряющийся поток
    const u = Math.pow(i / N, 0.6);
    const t = T.snow + 20 + u * (T.pairs + 40 - T.snow - 20);
    let r = rnd(i * 3.1) * total;
    let pair = PAIRS[0];
    for (const p of PAIRS) {
      if (r < p[2]) {
        pair = p;
        break;
      }
      r -= p[2];
    }
    const items = [pair[0], pair[1]];
    if (rnd(i * 7.7) < 0.35)
      items.push(SHELVES[Math.floor(rnd(i * 5.3) * SHELVES.length)].id);
    out.push({
      t: Math.round(t),
      items,
      dx: (rnd(i * 1.9) - 0.5) * 160,
      dy: (rnd(i * 2.7) - 0.5) * 80,
    });
  }
  return out;
})();
const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

// ---------- камера ----------
type Key = [number, number, number, number, number, number, number, number]; // кадр, tx, ty, tz, yaw°, pitch°, dist, fov°
const KEYS: Key[] = [
  [0, 1160, 700, 0, -62, 64, 4300, 38],
  [T.snow, 1160, 700, 0, -66, 62, 4200, 38],
  [T.arcs, 1160, 700, 0, -78, 52, 3500, 38],
  [T.pairs, 1160, 720, 60, -100, 40, 3000, 38],
  [T.far - 10, 1160, 740, 60, -112, 36, 2900, 38],
  [T.far + 30, 1150, 300, 0, -90, 26, 2600, 38],
  [T.move, 1150, 300, 0, -84, 26, 2500, 38],
  [T.move + 60, 820, 300, 60, -76, 22, 2100, 38],
  [T.cards - 10, 520, 300, 60, -70, 24, 1800, 38],
  [T.cards + 20, 1160, 700, 0, -60, 46, 3600, 38],
  [T.top - 10, 1160, 700, 0, -50, 50, 3600, 38],
  [T.top + 50, 1160, 700, 0, -90, 84, 3500, 38],
  [T.dur, 1160, 700, 0, -94, 86, 3300, 38],
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
    fov: L(7) * rad,
  };
};

// ---------- сцена 3D ----------
const World: React.FC<{ f: number }> = ({ f }) => {
  const cam = makeCamera(camAt(f));
  const P = cam.project;
  // пол и сетка
  const floor: V3[] = [
    [-120, -150, 0],
    [2500, -150, 0],
    [2500, 1450, 0],
    [-120, 1450, 0],
  ];
  const grid: React.ReactNode[] = [];
  for (let x = -100; x <= 2500; x += 200)
    grid.push(
      <line
        key={`gx${x}`}
        {...seg(P([x, -150, 0]), P([x, 1450, 0]))}
        stroke={C.grid}
        strokeWidth={1.5}
      />,
    );
  for (let y = -150; y <= 1450; y += 200)
    grid.push(
      <line
        key={`gy${y}`}
        {...seg(P([-120, y, 0]), P([2500, y, 0]))}
        stroke={C.grid}
        strokeWidth={1.5}
      />,
    );

  // веса пар по упавшим чекам
  const weight: Record<string, number> = {};
  for (const r of RECEIPTS) {
    if (r.t > f) continue;
    for (let a = 0; a < r.items.length; a++)
      for (let b = a + 1; b < r.items.length; b++) {
        if (r.items[a] === r.items[b]) continue;
        const k = pairKey(r.items[a], r.items[b]);
        weight[k] = (weight[k] || 0) + 1;
      }
  }
  const fade = f >= T.cards && f < T.top ? 0.5 : 1;

  // стеллажи: дальние первыми
  const shelfData = SHELVES.map((s) => {
    const [x, y, z] = posOf(s.id, f);
    const c = P([x, y, z + SH / 2]);
    return { s, x, y, z, depth: c.z };
  }).sort((a, b) => b.depth - a.depth);
  const hot = (id: string) =>
    (f >= T.far && f < T.cards && (id === "Курица-гриль" || id === "Соусы")) ||
    (id === "Соусы" && f >= T.move && f < T.cards);

  const shelves = shelfData.map(({ s, x, y, z }) => {
    const x0 = x - SW / 2,
      x1 = x + SW / 2,
      y0 = y - SD / 2,
      y1 = y + SD / 2,
      z0 = z,
      z1 = z + SH;
    const faces: { n: V3; c: V3; p: V3[]; fill: string }[] = [
      {
        n: [0, -1, 0],
        c: [x, y0, (z0 + z1) / 2],
        p: [
          [x0, y0, z0],
          [x1, y0, z0],
          [x1, y0, z1],
          [x0, y0, z1],
        ],
        fill: C.sideA,
      },
      {
        n: [0, 1, 0],
        c: [x, y1, (z0 + z1) / 2],
        p: [
          [x0, y1, z0],
          [x1, y1, z0],
          [x1, y1, z1],
          [x0, y1, z1],
        ],
        fill: C.sideA,
      },
      {
        n: [-1, 0, 0],
        c: [x0, y, (z0 + z1) / 2],
        p: [
          [x0, y0, z0],
          [x0, y1, z0],
          [x0, y1, z1],
          [x0, y0, z1],
        ],
        fill: C.sideB,
      },
      {
        n: [1, 0, 0],
        c: [x1, y, (z0 + z1) / 2],
        p: [
          [x1, y0, z0],
          [x1, y1, z0],
          [x1, y1, z1],
          [x1, y0, z1],
        ],
        fill: C.sideB,
      },
    ];
    const top: V3[] = [
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ];
    const h = hot(s.id);
    // тень на полу (для поднятого стеллажа)
    const shadow: V3[] = [
      [x0, y0, 0],
      [x1, y0, 0],
      [x1, y1, 0],
      [x0, y1, 0],
    ];
    // «товары» на верхней грани: ряд светлых точек
    const dots = Array.from({ length: 5 }, (_, i) =>
      P([x0 + 28 + i * 43.5, y, z1]),
    );
    const lbl = P([x, y, z1 + 40]);
    return (
      <g key={s.id} opacity={fade}>
        {z > 1 && (
          <polygon points={pts(shadow.map(P))} fill="#000" opacity={0.35} />
        )}
        {faces
          .filter((fc) => facing(fc.c, fc.n, cam.pos))
          .map((fc, i) => (
            <polygon
              key={i}
              points={pts(fc.p.map(P))}
              fill={h ? (fc.fill === C.sideA ? "#8A6F12" : "#6E580E") : fc.fill}
              stroke={C.edge}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ))}
        <polygon
          points={pts(top.map(P))}
          fill={h ? C.y : C.top}
          stroke={h ? "#FFE58A" : C.edge}
          strokeWidth={1.5}
        />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={Math.max(1.5, d.k * 14)}
            fill={h ? C.ink : "#BFE3CF"}
            opacity={0.75}
          />
        ))}
        <text
          x={lbl.x}
          y={lbl.y}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={Math.max(11, lbl.k * 44)}
          fill={h ? C.y : C.dim}
          opacity={f < T.top ? 0.95 : 0.7}
        >
          {s.name.toUpperCase()}
        </text>
      </g>
    );
  });

  // дуги связей
  const arcs: React.ReactNode[] = [];
  const keys = Object.keys(weight).sort((a, b) => weight[a] - weight[b]);
  for (const k of keys) {
    const [a, b] = k.split("|");
    const wgt = weight[k];
    const pa = posOf(a, f),
      pb = posOf(b, f);
    const A: V3 = [pa[0], pa[1], pa[2] + SH],
      Bp: V3 = [pb[0], pb[1], pb[2] + SH];
    const dist = Math.hypot(A[0] - Bp[0], A[1] - Bp[1]);
    const peak = 60 + dist * 0.32;
    const ptsArr: Proj[] = [];
    for (let i = 0; i <= 28; i++) {
      const u = i / 28;
      ptsArr.push(
        P([
          lerp(A[0], Bp[0], u),
          lerp(A[1], Bp[1], u),
          lerp(A[2], Bp[2], u) + Math.sin(u * Math.PI) * peak,
        ]),
      );
    }
    const strong = wgt >= 10;
    const isKey = k === pairKey("Курица-гриль", "Соусы");
    const focus = f >= T.far && f < T.cards;
    const op = focus ? (isKey ? 1 : 0.18) : Math.min(1, 0.25 + wgt / 22);
    const sw = Math.min(14, 1.5 + wgt * 0.45) * (ptsArr[14].k * 3.2);
    const col = strong || isKey ? C.y : C.w;
    arcs.push(
      <g key={k} opacity={op * fade}>
        <polyline
          points={pts(ptsArr)}
          fill="none"
          stroke={col}
          strokeWidth={sw * 3.2}
          opacity={0.12}
          strokeLinecap="round"
        />
        <polyline
          points={pts(ptsArr)}
          fill="none"
          stroke={col}
          strokeWidth={sw}
          opacity={0.9}
          strokeLinecap="round"
        />
      </g>,
    );
  }

  // падающие чеки и вспышки
  const snow: React.ReactNode[] = [];
  RECEIPTS.forEach((r, i) => {
    const t0 = r.t - 50;
    if (f < t0 || f > r.t + 14) return;
    const [x, y, z] = posOf(r.items[0], f);
    if (f <= r.t) {
      const u = (f - t0) / 50;
      const zz = lerp(1700, z + SH + 10, u * u);
      const p = P([x + r.dx, y + r.dy, zz]);
      const s = p.k * 34;
      const rot = (rnd(i) - 0.5) * 50 + u * 90 * (rnd(i * 4) - 0.5);
      snow.push(
        <g key={`r${i}`} transform={`translate(${p.x} ${p.y}) rotate(${rot})`}>
          <rect
            x={-s / 2}
            y={-s * 0.7}
            width={s}
            height={s * 1.4}
            fill="#F6F4EE"
            opacity={0.95}
          />
          <rect
            x={-s * 0.35}
            y={-s * 0.45}
            width={s * 0.7}
            height={Math.max(1, s * 0.08)}
            fill="#9AA0A6"
          />
          <rect
            x={-s * 0.35}
            y={-s * 0.2}
            width={s * 0.5}
            height={Math.max(1, s * 0.08)}
            fill="#9AA0A6"
          />
        </g>,
      );
    } else {
      const u = (f - r.t) / 14;
      const p = P([x + r.dx, y + r.dy, z + SH]);
      snow.push(
        <circle
          key={`f${i}`}
          cx={p.x}
          cy={p.y}
          r={p.k * (20 + u * 120)}
          fill="none"
          stroke={C.y}
          strokeWidth={Math.max(1, p.k * 8 * (1 - u))}
          opacity={1 - u}
        />,
      );
    }
  });

  // путь покупателя от курицы к соусу (до перестановки)
  const path: React.ReactNode[] = [];
  const pathK =
    interpolate(f, [T.far + 70, T.far + 150], [0, 1], clamp) *
    (1 - interpolate(f, [T.move + 10, T.move + 30], [0, 1], clamp));
  if (pathK > 0) {
    const way: V3[] = [
      [200, 250 - 120, 2],
      [200, 475, 2],
      [2000, 475, 2],
      [2000, 250 + 70, 2],
    ];
    const segs = way
      .slice(1)
      .map((p, i) => Math.hypot(p[0] - way[i][0], p[1] - way[i][1]));
    const total = segs.reduce((a, b) => a + b, 0);
    for (let i = 0; i < 70; i++) {
      const u = i / 69;
      if (u > pathK) break;
      let dd = u * total;
      let j = 0;
      while (j < segs.length - 1 && dd > segs[j]) {
        dd -= segs[j];
        j++;
      }
      const k = dd / segs[j];
      const p = P([
        lerp(way[j][0], way[j + 1][0], k),
        lerp(way[j][1], way[j + 1][1], k),
        2,
      ]);
      path.push(
        <circle
          key={`p${i}`}
          cx={p.x}
          cy={p.y}
          r={Math.max(2, p.k * 14)}
          fill={C.w}
          opacity={0.85}
        />,
      );
    }
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="fl" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#0F3524" />
          <stop offset="100%" stopColor={C.bg} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#fl)" />
      <polygon points={pts(floor.map(P))} fill={C.floor} />
      {grid}
      {path}
      {shelves}
      <g style={{ mixBlendMode: "screen" }}>{arcs}</g>
      {snow}
    </svg>
  );
};
const seg = (a: Proj, b: Proj) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

// ---------- экранный слой ----------
const useSp = (at: number, damping = 15) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, mass: 0.8 } });
};
const Y: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: C.y,
      color: C.ink,
      padding: "0 0.12em",
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);
// крупная фраза: слова проявляются по одному снизу
const Words: React.FC<{
  text: string;
  at: number;
  size?: number;
  x?: number;
  y?: number;
  w?: number;
  mark?: string[];
  align?: "left" | "center";
  out?: number;
}> = ({
  text,
  at,
  size = 92,
  x = 110,
  y = 110,
  w = 1200,
  mark = [],
  align = "left",
  out = 1e9,
}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const o = 1 - interpolate(f, [out - 10, out], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x,
        right: align === "center" ? 0 : undefined,
        top: y,
        width: align === "center" ? undefined : w,
        textAlign: align,
        opacity: o,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: "-0.04em",
        color: C.w,
        textShadow: "0 6px 40px rgba(0,0,0,0.55)",
      }}
    >
      {words.map((wd, i) => {
        const s = interpolate(f, [at + i * 3, at + i * 3 + 10], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const m = mark.includes(wd.replace(/[.,—]/g, ""));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              marginRight: "0.24em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - s) * 105}%)`,
                opacity: s,
              }}
            >
              {m ? <Y>{wd}</Y> : wd}
            </span>
          </span>
        );
      })}
    </div>
  );
};
const Label: React.FC<{
  children: React.ReactNode;
  s: number;
  x: number;
  y: number;
  color?: string;
}> = ({ children, s, x, y, color = C.y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: s,
      transform: `translateY(${(1 - s) * 12}px)`,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.18em",
      color,
    }}
  >
    {children}
  </div>
);
// затемнение снизу и слева под текст
const Scrim: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <AbsoluteFill
    style={{
      opacity: k,
      background:
        "linear-gradient(180deg, rgba(6,25,15,0.92) 0%, rgba(6,25,15,0.55) 26%, rgba(6,25,15,0) 46%)",
    }}
  />
);

// чек, который печатается в начале
const BigReceipt: React.FC = () => {
  const f = useCurrentFrame();
  const print = interpolate(f, [4, 60], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const fly = interpolate(f, [T.snow - 14, T.snow + 22], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const rows = [
    "КУРИЦА-ГРИЛЬ",
    "СОУС ТОМАТНЫЙ",
    "ХЛЕБ БЕЛЫЙ",
    "ПИВО 0,5",
    "ЧИПСЫ",
  ];
  const h = 760;
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - 230,
        top: 190 - fly * 900,
        width: 460,
        height: h * print,
        overflow: "hidden",
        transform: `rotate(${-3 + fly * 25}deg) scale(${1 - fly * 0.6})`,
        opacity: 1 - fly * 0.9,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        background: "#F7F5EF",
      }}
    >
      <div style={{ padding: "34px 36px", fontFamily: MONO, color: C.ink }}>
        <div
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.14em",
            color: "#6B6F73",
          }}
        >
          КАССОВЫЙ ЧЕК № 004812
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: 20,
            color: "#6B6F73",
            marginTop: 6,
          }}
        >
          ПТ 19:42 · КАССА 2
        </div>
        <div style={{ borderTop: "3px dashed #C9C6BC", margin: "22px 0" }} />
        {rows.map((r) => (
          <div
            key={r}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 30,
              marginTop: 14,
            }}
          >
            <span>{r}</span>
            <span>×1</span>
          </div>
        ))}
        <div
          style={{ borderTop: "3px dashed #C9C6BC", margin: "24px 0 14px" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
          }}
        >
          <span>ИТОГ</span>
          <span>1 240 ₽</span>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 26, height: 60 }}>
          {Array.from({ length: 36 }, (_, i) => (
            <div
              key={i}
              style={{ width: i % 3 === 0 ? 6 : 3, background: C.ink }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// подписи к сильным парам (проецируются из 3D)
const PairTags: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.pairs || f >= T.far) return null;
  const cam = makeCamera(camAt(f));
  // ярлык ставится в точку дуги u (0..1), чтобы ярлыки не налезали друг на друга
  const tags: [string, string, string, number, number][] = [
    ["Курица-гриль", "Соусы", "курица-гриль + соус", 0, 0.2],
    ["Пиво", "Чипсы", "пиво + чипсы", 14, 0.72],
    ["Кофе", "Выпечка", "кофе + выпечка", 28, 0.5],
  ];
  return (
    <>
      {tags.map(([a, b, txt, d, u]) => {
        const s =
          interpolate(f, [T.pairs + 20 + d, T.pairs + 36 + d], [0, 1], clamp) *
          (1 - interpolate(f, [T.far - 12, T.far], [0, 1], clamp));
        const pa = posOf(a, f),
          pb = posOf(b, f);
        const dist = Math.hypot(pa[0] - pb[0], pa[1] - pb[1]);
        const p = cam.project([
          pa[0] + (pb[0] - pa[0]) * u,
          pa[1] + (pb[1] - pa[1]) * u,
          SH + 60 + Math.sin(u * Math.PI) * dist * 0.32,
        ]);
        return (
          <div
            key={txt}
            style={{
              position: "absolute",
              left: p.x,
              top: Math.max(220, p.y - 70),
              transform: `translateX(-50%) scale(${0.85 + 0.15 * s})`,
              opacity: s,
              background: C.y,
              color: C.ink,
              padding: "10px 20px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 34,
              whiteSpace: "nowrap",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            }}
          >
            {txt}
          </div>
        );
      })}
    </>
  );
};

const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const items: [string, string, string, string][] = [
    ["Золотые пары", "ставить рядом", "+15%", "средний чек"],
    ["Скрытые связи", "не выводить", "+34%", "продажи соуса"],
    ["Каннибалы", "развести по залу", "+22%", "выручка пары"],
  ];
  const o = 1 - interpolate(f, [T.top - 14, T.top], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top: 300,
        display: "flex",
        gap: 34,
        opacity: o,
      }}
    >
      {items.map(([h, sub, num, unit], i) => {
        const s = interpolate(
          f,
          [T.cards + 30 + i * 22, T.cards + 50 + i * 22],
          [0, 1],
          { ...clamp, easing: Easing.out(Easing.cubic) },
        );
        return (
          <div
            key={h}
            style={{
              flex: 1,
              background: "rgba(6,25,15,0.86)",
              border: `2px solid ${i === 2 ? C.red : C.y}`,
              padding: "36px 36px 30px",
              opacity: s,
              transform: `translateY(${(1 - s) * 60}px)`,
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 52,
                color: C.w,
                letterSpacing: "-0.03em",
              }}
            >
              {h}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 24,
                color: C.dim,
                letterSpacing: "0.12em",
                marginTop: 10,
              }}
            >
              {sub.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 120,
                color: i === 2 ? C.red : C.y,
                letterSpacing: "-0.05em",
                marginTop: 26,
                lineHeight: 1,
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 30,
                color: C.w,
                marginTop: 6,
              }}
            >
              {unit}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 470,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.14em",
          color: C.dim,
          opacity: interpolate(
            f,
            [T.cards + 100, T.cards + 120],
            [0, 1],
            clamp,
          ),
        }}
      >
        КЕЙСЫ КЛИЕНТОВ · ANALYTIC-PRO.RU
      </div>
    </div>
  );
};

const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const s = useSp(T.move + 110, 12);
  const n = Math.round(
    interpolate(f, [T.move + 110, T.move + 160], [0, 34], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const o = 1 - interpolate(f, [T.cards - 10, T.cards], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: 250,
        textAlign: "right",
        opacity: s * o,
        padding: "40px 50px 60px 200px",
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
          fontSize: 210,
          color: C.y,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          textShadow: "0 10px 60px rgba(255,210,63,0.35)",
        }}
      >
        +{n}%
      </div>
      <div
        style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.w }}
      >
        продажи соуса
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
        КЕЙС КЛИЕНТА · МАГАЗИН У ДОМА
      </div>
    </div>
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
    <AbsoluteFill style={{ background: `rgba(6,25,15,${0.88 * a})` }}>
      <div style={{ position: "absolute", left: 110, top: 120, opacity: a }}>
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
            fontSize: 104,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: C.w,
            marginTop: 18,
          }}
        >
          Прочитаем карту
          <br />
          вашего магазина
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 470, opacity: o }}>
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
          top: 840,
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
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
            color: C.w,
            opacity: btn,
            transform: `translateX(${Math.sin(f / 5) * 10}px)`,
          }}
        >
          ссылка в профиле →
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Brand: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.snow || f >= T.end) return null;
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
export const MapCover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <World f={T.pairs + 60} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(6,25,15,0.97) 0%, rgba(6,25,15,0.9) 40%, rgba(6,25,15,0.2) 70%, rgba(6,25,15,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 120,
        fontFamily: SANS,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "-0.045em",
        lineHeight: 0.94,
      }}
    >
      <div style={{ fontSize: 120, color: C.w }}>Невидимая</div>
      <div style={{ fontSize: 120, color: C.w }}>карта</div>
      <div style={{ fontSize: 120, color: C.y }}>вашего</div>
      <div style={{ fontSize: 120, color: C.y }}>магазина</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 90,
        bottom: 80,
        background: C.y,
        padding: "14px 30px",
        fontFamily: SANS,
        fontWeight: 900,
        textTransform: "uppercase",
        fontSize: 46,
        letterSpacing: "-0.03em",
        color: C.ink,
      }}
    >
      она уже есть в ваших чеках
    </div>
  </AbsoluteFill>
);

// ---------- фильм ----------
export const MapFilm: React.FC = () => {
  const f = useCurrentFrame();
  const scrim = interpolate(f, [T.snow, T.snow + 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <World f={f} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {f < T.snow + 2 && (
        <AbsoluteFill
          style={{
            background: C.bg,
            opacity:
              1 - interpolate(f, [T.snow - 16, T.snow + 2], [0, 1], clamp),
          }}
        />
      )}
      <Scrim k={scrim * (f < T.cards || f >= T.top ? 1 : 0.4)} />
      {f < T.snow + 30 && <BigReceipt />}
      {/* тексты по битам */}
      <Words
        text="Это не просто чек."
        at={14}
        size={84}
        y={60}
        align="center"
        out={T.snow + 6}
      />
      <Words
        text="Каждый день покупатели оставляют тысячи таких следов."
        at={T.snow + 10}
        size={76}
        y={80}
        w={1500}
        mark={["тысячи"]}
        out={T.arcs}
      />
      <Words
        text="Сложите их вместе — и проявится карта, которой нет в отчётах."
        at={T.arcs + 10}
        size={76}
        y={80}
        w={1600}
        mark={["карта,"]}
        out={T.pairs}
      />
      <Words
        text="Пары товаров, которые берут вместе."
        at={T.pairs + 6}
        size={80}
        y={80}
        w={1600}
        mark={["вместе."]}
        out={T.far}
      />
      <Words
        text="Соус — в 58% чеков с курицей-гриль. А в зале они в разных концах."
        at={T.far + 10}
        size={70}
        y={80}
        w={1700}
        mark={["58%", "концах."]}
        out={T.move}
      />
      <Words
        text="Поставили рядом —"
        at={T.move + 10}
        size={96}
        y={80}
        w={1200}
        out={T.cards}
      />
      <PairTags />
      <Counter />
      {f >= T.cards && f < T.top && (
        <Words
          text="Три типа связей в каждом магазине"
          at={T.cards + 8}
          size={72}
          y={110}
          w={1700}
          mark={["каждом"]}
          out={T.top}
        />
      )}
      {f >= T.cards && f < T.top && <Cards />}
      <Words
        text="Эта карта уже есть в ваших чеках."
        at={T.top + 30}
        size={84}
        y={80}
        w={1700}
        mark={["ваших", "чеках."]}
        out={T.end}
      />
      {f >= T.end && <EndCard />}
      <Brand />
      <Label
        s={
          interpolate(f, [T.far + 10, T.far + 30], [0, 1], clamp) *
          (1 - interpolate(f, [T.move - 6, T.move], [0, 1], clamp))
        }
        x={110}
        y={980}
        color={C.dim}
      >
        ПУТЬ ПОКУПАТЕЛЯ: ЧЕРЕЗ ВЕСЬ ЗАЛ
      </Label>
      {/* звук */}
      <Audio
        src={staticFile("music/bed-xl.mp3")}
        volume={(fr) =>
          interpolate(fr, [0, 20, T.dur - 60, T.dur], [0, 0.32, 0.32, 0], clamp)
        }
      />
      <Sequence from={4} layout="none">
        <Audio src={staticFile("sfx/printer.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={T.snow - 16} layout="none">
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
      </Sequence>
      {RECEIPTS.filter((_, i) => i % 3 === 0).map((r, i) => (
        <Sequence key={`t${i}`} from={r.t} layout="none">
          <Audio
            src={staticFile("sfx/tick.wav")}
            volume={0.1 + rnd(i) * 0.08}
          />
        </Sequence>
      ))}
      <Sequence from={T.move + 10} layout="none">
        <Audio src={staticFile("sfx/riser.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={T.move + 110} layout="none">
        <Audio src={staticFile("sfx/impact.wav")} volume={0.7} />
      </Sequence>
      {[0, 1, 2].map((i) => (
        <Sequence key={`c${i}`} from={T.cards + 30 + i * 22} layout="none">
          <Audio src={staticFile("sfx/pop.wav")} volume={0.35} />
        </Sequence>
      ))}
      {[T.pairs, T.far, T.cards, T.top, T.end].map((b) => (
        <Sequence key={`w${b}`} from={b - 6} layout="none">
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} />
        </Sequence>
      ))}
      <Sequence durationInFrames={1}>
        <MapCover />
      </Sequence>
    </AbsoluteFill>
  );
};
