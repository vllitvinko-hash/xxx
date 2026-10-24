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
import { CaptionLine, MusicBed } from "../captioning";
import captions from "../Grid/captions.json";

// «Вертикаль и горизонталь», версия 2: один план зала, одна камера, тёмно-зелёная гамма сайта.
const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const GRID2_DURATION = SCENES[SCENES.length - 1];

const C = {
  bg: "#0A2A1B",
  floor: "#0E3523",
  rack: "#144A31",
  line: "#2C6A4C",
  dot: "#E9F1EC",
  dim: "#5F8A74",
  y: "#FFD23F",
  w: "#FFFFFF",
  ink: "#16181A",
  red: "#FF6B5A",
};
const SANS = "Inter, sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ---------- мир: план зала 4800×2700 ----------
const RX = (i: number) => 900 + i * 520; // левый край стеллажа
const RW = 170,
  RY = 650,
  RH = 1400;
const DEPTS = ["СОУСЫ", "ХЛЕБ", "МОЛОЧКА", "НАПИТКИ", "СЫР И ВИНО", "МАКАРОНЫ"];
const SLOTS = 14;
const slotY = (k: number) => RY + 60 + k * ((RH - 120) / (SLOTS - 1));
const slot = (i: number, k: number, side = 0): [number, number] => [
  RX(i) + 50 + side * 70,
  slotY(k),
];

const g = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

const World: React.FC<{ f: number }> = ({ f }) => {
  const S = SCENES;
  // вертикаль по стеллажу «Соусы» (сцена 1)
  const vSweep = g(f, S[1] + 40, S[1] + 160);
  // путь покупателя (сцена 2)
  const path = g(f, S[2] + 80, S[2] + 200);
  const pathPts: [number, number][] = [
    [520, 2300],
    [520, 1300],
    [RX(0) - 60, 1300],
    [RX(5) + RW + 120, 1300],
    [RX(5) + RW + 120, 2300],
  ];
  const segLen = pathPts
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - pathPts[i][0], p[1] - pathPts[i][1]));
  const total = segLen.reduce((a, b) => a + b, 0);
  // сцена 3: обе оси; сцена 8: сетка
  const both = g(f, S[3], S[3] + 30) * (1 - g(f, S[4] - 10, S[4] + 10));
  const gridV = g(f, S[8], S[8] + 40);
  const gridH = g(f, S[8] + 60, S[8] + 100);
  // сцена 5: поставщик — сегмент стеллажа «Напитки»
  const sup = g(f, S[5] + 20, S[5] + 50) * (1 - g(f, S[6] - 10, S[6]));
  // сцена 6: слабый товар и его связи
  const weakOn = g(f, S[6] + 10, S[6] + 40) * (1 - g(f, S[7] - 10, S[7]));
  const links = g(f, S[6] + 140, S[6] + 190);
  const removed = g(f, S[6] + 300, S[6] + 330);
  const weak = slot(1, 13, 0);
  const rich = [slot(4, 3, 0), slot(4, 6, 1), slot(4, 9, 0)];
  const hotS = f > S[2] + 80 + 40 && f < S[4];
  const hotM = f > S[2] + 190 && f < S[4];
  return (
    <svg
      width={4800}
      height={2700}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <rect width={4800} height={2700} fill={C.bg} />
      <rect
        x={400}
        y={420}
        width={3900}
        height={2000}
        fill={C.floor}
        stroke={C.line}
        strokeWidth={6}
      />
      {/* вход и кассы */}
      <rect x={430} y={2300} width={200} height={20} fill={C.y} opacity={0.7} />
      <text
        x={530}
        y={2380}
        textAnchor="middle"
        fontFamily={MONO}
        fontWeight={700}
        fontSize={44}
        fill={C.dim}
      >
        ВХОД
      </text>
      {[0, 1, 2].map((k) => (
        <rect
          key={k}
          x={3500 + k * 220}
          y={2240}
          width={160}
          height={70}
          fill="none"
          stroke={C.line}
          strokeWidth={6}
        />
      ))}
      <text
        x={3830}
        y={2380}
        textAnchor="middle"
        fontFamily={MONO}
        fontWeight={700}
        fontSize={44}
        fill={C.dim}
      >
        КАССЫ
      </text>
      {DEPTS.map((d, i) => {
        const hot = (i === 0 && hotS) || (i === 5 && hotM);
        return (
          <g key={d}>
            <rect
              x={RX(i)}
              y={RY}
              width={RW}
              height={RH}
              fill={C.rack}
              stroke={hot ? C.y : C.line}
              strokeWidth={hot ? 12 : 6}
            />
            <text
              x={RX(i) + RW / 2}
              y={RY - 40}
              textAnchor="middle"
              fontFamily={MONO}
              fontWeight={700}
              fontSize={46}
              fill={hot ? C.y : C.dim}
            >
              {d}
            </text>
            {Array.from({ length: SLOTS }, (_, k) =>
              [0, 1].map((side) => {
                const [x, y] = slot(i, k, side);
                const isWeak = i === 1 && k === 13 && side === 0;
                const inSup = i === 3 && k >= 4 && k <= 7;
                let fill = C.dot;
                let op = 0.85;
                if (i === 0 && vSweep > 0)
                  op = Math.abs(k / (SLOTS - 1) - vSweep) < 0.12 ? 1 : 0.5;
                if (inSup && sup > 0) fill = C.y;
                if (isWeak && weakOn > 0) fill = C.red;
                if (isWeak) op *= 1 - removed;
                return (
                  <rect
                    key={`${k}-${side}`}
                    x={x - 22}
                    y={y - 22}
                    width={44}
                    height={44}
                    rx={8}
                    fill={fill}
                    opacity={op}
                  />
                );
              }),
            )}
          </g>
        );
      })}
      {/* вертикаль вдоль стеллажа */}
      {vSweep > 0 && f < S[2] + 40 && (
        <line
          x1={RX(0) - 70}
          y1={RY}
          x2={RX(0) - 70}
          y2={RY + RH * vSweep}
          stroke={C.w}
          strokeWidth={16}
        />
      )}
      {/* путь покупателя */}
      {path > 0 && f < S[4] && (
        <polyline
          points={pathPts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={C.y}
          strokeWidth={18}
          strokeLinejoin="round"
          strokeDasharray={`${path * total} ${total}`}
        />
      )}
      {/* обе оси */}
      {both > 0 && (
        <g opacity={both}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={RX(i) + RW / 2}
              y1={RY - 10}
              x2={RX(i) + RW / 2}
              y2={RY + RH + 10}
              stroke={C.w}
              strokeWidth={14}
            />
          ))}
          <line
            x1={500}
            y1={1300}
            x2={4200}
            y2={1300}
            stroke={C.y}
            strokeWidth={18}
            strokeDasharray="60 40"
          />
        </g>
      )}
      {/* поставщик */}
      {sup > 0 && (
        <g opacity={sup}>
          <rect
            x={RX(3) - 20}
            y={slotY(4) - 50}
            width={RW + 40}
            height={slotY(7) - slotY(4) + 100}
            fill="none"
            stroke={C.y}
            strokeWidth={10}
          />
          <text
            x={RX(3) + RW + 50}
            y={slotY(5)}
            fontFamily={SANS}
            fontWeight={900}
            fontSize={64}
            fill={C.y}
          >
            уровень глаз
          </text>
          <text
            x={RX(3) + RW + 50}
            y={slotY(5) + 80}
            fontFamily={SANS}
            fontWeight={700}
            fontSize={54}
            fill={C.w}
          >
            товар поставщика
          </text>
        </g>
      )}
      {/* слабый товар и дорогие покупки в тех же чеках */}
      {weakOn > 0 &&
        rich.map(([x, y], i) => (
          <g key={i} opacity={weakOn}>
            <path
              d={`M ${weak[0] + 22} ${weak[1]} C ${weak[0] + 600} ${weak[1]}, ${x - 600} ${y}, ${x - 26} ${y}`}
              fill="none"
              stroke={C.y}
              strokeWidth={10}
              strokeDasharray={removed > 0 ? "10 40" : `${links * 3000} 3000`}
              opacity={1 - removed * 0.85}
            />
            <rect
              x={x - 30}
              y={y - 30}
              width={60}
              height={60}
              rx={10}
              fill="none"
              stroke={C.y}
              strokeWidth={8}
              opacity={links}
            />
          </g>
        ))}
      {/* сетка: вертикаль + горизонталь */}
      {gridV > 0 &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`gv${i}`}
            x1={RX(i) + RW / 2}
            y1={RY - 60}
            x2={RX(i) + RW / 2}
            y2={RY - 60 + (RH + 120) * gridV}
            stroke={C.w}
            strokeWidth={14}
          />
        ))}
      {gridH > 0 &&
        [0, 1, 2, 3, 4].map((k) => {
          const y = RY + 120 + k * 290;
          return (
            <line
              key={`gh${k}`}
              x1={600}
              y1={y}
              x2={600 + 3600 * gridH}
              y2={y}
              stroke={C.y}
              strokeWidth={14}
            />
          );
        })}
    </svg>
  );
};

// ---------- камера ----------
type Key = [number, number, number, number]; // кадр, cx, cy, zoom
const CAM = (): Key[] => {
  const S = SCENES;
  return [
    [0, 1650, 1250, 1.05],
    [S[1] - 1, 1750, 1300, 1.12],
    [S[1] + 30, 1735, 1350, 0.72],
    [S[2] - 1, 1700, 1360, 0.76],
    [S[2] + 40, 2350, 1450, 0.37],
    [S[4] - 1, 2350, 1430, 0.39],
    [S[4] + 30, 2350, 1450, 0.34],
    [S[5] - 1, 2350, 1450, 0.35],
    [S[5] + 30, RX(3) + 85 - 610, slotY(6), 0.62],
    [S[6] - 1, RX(3) + 85 - 600, slotY(6), 0.66],
    [S[6] + 30, 2550, 1500, 0.4],
    [S[7] - 1, 2550, 1500, 0.42],
    [S[7] + 30, 2350, 1450, 0.34],
    [S[8] - 1, 2350, 1450, 0.35],
    [S[8] + 30, 700, 1400, 0.27],
    [S[9], 760, 1400, 0.28],
  ];
};
const camAt = (f: number): [number, number, number] => {
  const k = CAM();
  if (f <= k[0][0]) return [k[0][1], k[0][2], k[0][3]];
  for (let i = 0; i < k.length - 1; i++) {
    const [a, ...p] = k[i];
    const [b, ...q] = k[i + 1];
    if (f <= b) {
      const u = interpolate(f, [a, b], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      });
      return [
        p[0] + (q[0] - p[0]) * u,
        p[1] + (q[1] - p[1]) * u,
        p[2] + (q[2] - p[2]) * u,
      ];
    }
  }
  const l = k[k.length - 1];
  return [l[1], l[2], l[3]];
};

// ---------- экранный слой ----------
const useSp = (at: number, damping = 15) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, mass: 0.8 } });
};
const H: React.FC<{
  s: number;
  children: React.ReactNode;
  size?: number;
  y?: number;
  x?: number;
  w?: number;
}> = ({ s, children, size = 96, y = 110, x = 110, w = 900 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity: s,
      transform: `translateY(${(1 - s) * 24}px)`,
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      color: C.w,
      whiteSpace: "pre-line",
    }}
  >
    {children}
  </div>
);
const Kick: React.FC<{
  s: number;
  children: React.ReactNode;
  y?: number;
  x?: number;
  color?: string;
}> = ({ s, children, y = 70, x = 110, color = C.y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: s,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "0.2em",
      color,
    }}
  >
    {children}
  </div>
);
const Y: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: C.y, color: C.ink, padding: "0 0.12em" }}>
    {children}
  </span>
);
// чек: белая бумага, крупные строки
const Receipt: React.FC<{
  rows: [string, string?][];
  head: string;
  sum?: string;
  w?: number;
  s?: number;
  rot?: number;
}> = ({ rows, head, sum, w = 460, s = 1, rot = 0 }) => (
  <div
    style={{
      width: w,
      background: "#FBFAF6",
      padding: "26px 30px 22px",
      transform: `scale(${s}) rotate(${rot}deg)`,
      transformOrigin: "top left",
      boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.12em",
        color: "#6B6F73",
        textAlign: "center",
      }}
    >
      {head}
    </div>
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "16px 0 12px" }} />
    {rows.map(([name, mark]) => (
      <div
        key={name}
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 32,
          color: mark === "w" ? "#fff" : C.ink,
          background:
            mark === "y"
              ? C.y
              : mark === "g"
                ? "#0E4D2E"
                : mark === "w"
                  ? "#0E4D2E"
                  : "transparent",
          padding: "6px 12px",
          marginTop: 6,
        }}
      >
        {name}
      </div>
    ))}
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "16px 0 10px" }} />
    {sum && (
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 52,
          color: C.ink,
          textAlign: "right",
        }}
      >
        {sum}
      </div>
    )}
    <div style={{ display: "flex", gap: 4, marginTop: 10, height: 34 }}>
      {Array.from({ length: 34 }, (_, i) => (
        <div
          key={i}
          style={{ width: i % 3 === 0 ? 6 : 3, background: C.ink }}
        />
      ))}
    </div>
  </div>
);

const cueOf = (scene: number) =>
  LINES.filter((l) => l.scene === scene).map((l) => l.from - SCENES[scene]);

const S0: React.FC = () => {
  const f = useCurrentFrame();
  const [, c1 = 74] = cueOf(0);
  const a = interpolate(f, [0, 8], [0.9, 1], clamp);
  const r = useSp(c1 - 6, 14);
  const v = useSp(c1 + 30, 13);
  return (
    <>
      <Scrim side="left" w={60} />
      <H s={a} size={110}>
        {"Полки\nидеальные."}
      </H>
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 150,
          opacity: r,
          transform: `translateX(${(1 - r) * 80}px)`,
        }}
      >
        <Receipt
          head="СРЕДНИЙ ЧЕК"
          rows={[["сегодня"], ["год назад"]]}
          sum="1 240 ₽"
          w={420}
        />
      </div>
      <H s={v} size={110} y={760} x={110} w={1200}>
        Красиво <Y>≠</Y> прибыльно
      </H>
    </>
  );
};
const S1: React.FC = () => {
  const [c0 = 0, c1 = 41, c2 = 158, c3 = 217] = cueOf(1);
  const a = useSp(c0 + 6),
    b = useSp(c1 + 10),
    c = useSp(c2),
    d = useSp(c3);
  return (
    <>
      <Scrim side="right" w={52} />
      <Kick s={a} x={1024} y={90}>
        МЕРЧЕНДАЙЗИНГ
      </Kick>
      <H s={b} size={120} y={130} x={1020}>
        {"Вертикаль:\nполка\nза полкой"}
      </H>
      <div
        style={{
          position: "absolute",
          left: 1024,
          top: 640,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            opacity: c,
            transform: `translateX(${(1 - c) * 40}px)`,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 48,
            color: C.w,
          }}
        >
          <Y>соусы</Y> — чтобы было видно
        </div>
        <div
          style={{
            opacity: d,
            transform: `translateX(${(1 - d) * 40}px)`,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 48,
            color: C.w,
          }}
        >
          <Y>молочка</Y> — чтобы было удобно
        </div>
      </div>
    </>
  );
};
const S2: React.FC = () => {
  const [c0 = 0, , , c3 = 225] = cueOf(2);
  const a = useSp(c0 + 30);
  const r = useSp(c3, 14);
  return (
    <>
      <Scrim side="top" />
      <Kick s={a}>ПОКУПАТЕЛЬ</Kick>
      <H s={a} size={92} y={100} w={1500}>
        Горизонталь: <Y>весь чек</Y>
      </H>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 260,
          opacity: r,
          transform: `translateY(${(1 - r) * 60}px)`,
        }}
      >
        <Receipt
          head="ОДНА ПОКУПКА"
          rows={[
            ["Соус", "w"],
            ["Макароны", "y"],
          ]}
          w={440}
          rot={3}
        />
      </div>
    </>
  );
};
const S3: React.FC = () => {
  const [c0 = 0, c1 = 57, c2 = 108] = cueOf(3);
  const a = useSp(c0 + 6),
    b = useSp(c1),
    n = useSp(c2 + 20, 12);
  const f = useCurrentFrame();
  return (
    <>
      <Dim k={n * 0.85} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 90,
          display: "flex",
          gap: 60,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 56,
        }}
      >
        <div style={{ opacity: a, color: C.w }}>│ мерчендайзинг</div>
        <div style={{ opacity: b, color: C.y }}>— анализ чеков</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {[1, 2, 3, 4].map((k, i) => {
          const s = interpolate(
            f,
            [c2 + 30 + i * 8, c2 + 44 + i * 8],
            [0, 1],
            clamp,
          );
          return (
            <div
              key={k}
              style={{
                width: 150,
                height: 150,
                background: C.y,
                color: C.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 100,
                opacity: s * n,
                transform: `scale(${0.7 + 0.3 * s})`,
              }}
            >
              {k}
            </div>
          );
        })}
      </div>
      <H s={n} size={72} y={820} x={0} w={1920}>
        <div style={{ textAlign: "center" }}>
          вещи, которые вертикаль не видит
        </div>
      </H>
    </>
  );
};
// затемнение под текстом: слева, справа или сверху
const Scrim: React.FC<{
  side: "left" | "right" | "top";
  k?: number;
  w?: number;
}> = ({ side, k = 1, w = 58 }) => {
  const bg = "10,42,27";
  const grad =
    side === "left"
      ? `linear-gradient(90deg, rgba(${bg},0.97) 0%, rgba(${bg},0.93) ${w - 18}%, rgba(${bg},0) ${w + 12}%)`
      : side === "right"
        ? `linear-gradient(270deg, rgba(${bg},0.97) 0%, rgba(${bg},0.93) ${w - 18}%, rgba(${bg},0) ${w + 12}%)`
        : `linear-gradient(180deg, rgba(${bg},0.97) 0%, rgba(${bg},0.9) 18%, rgba(${bg},0) 34%)`;
  return <AbsoluteFill style={{ background: grad, opacity: k }} />;
};
// затемнение мира под карточками правил
const Dim: React.FC<{ k: number }> = ({ k }) => (
  <AbsoluteFill style={{ background: `rgba(10,42,27,${0.82 * k})` }} />
);
const Num: React.FC<{ n: number; text: string; s: number; size?: number }> = ({
  n,
  text,
  s,
  size = 76,
}) => (
  <div
    style={{
      position: "absolute",
      left: 110,
      top: 90,
      display: "flex",
      alignItems: "center",
      gap: 30,
      opacity: s,
      transform: `translateX(${(1 - s) * -40}px)`,
    }}
  >
    <div
      style={{
        width: 120,
        height: 120,
        background: C.y,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 84,
      }}
    >
      {n}
    </div>
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.03em",
        color: C.w,
      }}
    >
      {text}
    </div>
  </div>
);
const S4: React.FC = () => {
  const [c0 = 0, c1 = 140] = cueOf(4);
  const f = useCurrentFrame();
  const a = useSp(c0 + 6),
    b = useSp(c0 + 24),
    r = useSp(c1, 14);
  return (
    <>
      <Dim k={interpolate(f, [0, 20], [0, 1], clamp)} />
      <Num n={1} text="Не ваши покупатели" s={a} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 300,
          width: 640,
          border: `3px solid ${C.dim}`,
          padding: "34px 40px",
          opacity: b * (1 - r * 0.6),
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
          «КАК ПРИНЯТО»
        </div>
        {[
          "соусы — к соусам",
          "хиты — на уровне глаз",
          "молочка — у дальней стены",
        ].map((x) => (
          <div
            key={x}
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 42,
              color: C.w,
              marginTop: 22,
            }}
          >
            — {x}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 860,
          top: 290,
          display: "flex",
          gap: 26,
        }}
      >
        {[
          ["Соус", "Макароны", "Сыр"],
          ["Макароны", "Вино", "Соус"],
          ["Соус", "Макароны", "Хлеб"],
        ].map((rows, i) => {
          const s = interpolate(f, [c1 + i * 8, c1 + 20 + i * 8], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={i}
              style={{ opacity: s, transform: `translateY(${(1 - s) * 60}px)` }}
            >
              <Receipt
                head={`ВАШ ЧЕК ${i + 1}`}
                rows={rows.map(
                  (x) =>
                    [
                      x,
                      x === "Соус" ? "w" : x === "Макароны" ? "y" : undefined,
                    ] as [string, string?],
                )}
                w={300}
                rot={(i - 1) * 2}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
const S5: React.FC = () => {
  const [c0 = 0, c1 = 146] = cueOf(5);
  const a = useSp(c0 + 6),
    r = useSp(c1 + 10, 14);
  return (
    <>
      <Scrim side="left" w={50} />
      <Num n={2} text="Выкладка поставщика" s={a} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 640,
          width: 760,
          opacity: r,
          transform: `translateY(${(1 - r) * 30}px)`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.2,
          color: C.w,
        }}
      >
        Он думает о своей категории — <Y>а не о всей корзине</Y>
      </div>
    </>
  );
};
const S6: React.FC = () => {
  const [c0 = 0, c1 = 143, c2 = 298] = cueOf(6);
  const f = useCurrentFrame();
  const a = useSp(c0 + 6),
    b = useSp(c0 + 40),
    l = useSp(c1 + 30),
    d = useSp(c2 + 20);
  const drop = interpolate(f, [c2 + 30, c2 + 70], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <>
      <Scrim side="top" />
      <Num
        n={3}
        text="Слабый по вертикали, сильный по горизонтали"
        s={a}
        size={54}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 250,
          opacity: b,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: C.w,
        }}
      >
        <span style={{ color: C.red }}>■</span> внизу категории — «кандидат на
        вывод»
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 320,
          opacity: l,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          color: C.w,
        }}
      >
        <span style={{ color: C.y }}>■</span> а в его чеках — дорогие покупки
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 640,
          width: 520,
          background: "#FBFAF6",
          padding: "24px 30px",
          opacity: d,
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.12em",
            color: "#6B6F73",
          }}
        >
          СЫР И ВИНО · ВЫРУЧКА
        </div>
        <svg width={460} height={150}>
          <polyline
            points={`0,40 90,30 180,38 270,${40 + drop * 70} 360,${45 + drop * 90} 460,${50 + drop * 96}`}
            fill="none"
            stroke={C.red}
            strokeWidth={8}
          />
        </svg>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 40,
            color: C.red,
          }}
        >
          убрали — и потеряли
        </div>
      </div>
    </>
  );
};
const S7: React.FC = () => {
  const [c0 = 0, c1 = 115] = cueOf(7);
  const f = useCurrentFrame();
  const a = useSp(c0 + 6),
    r = useSp(c1, 14),
    v = useSp(c1 + 60, 13);
  const b1 = interpolate(f, [c0 + 30, c0 + 60], [0, 180], clamp),
    b2 = interpolate(f, [c0 + 50, c0 + 80], [0, 360], clamp);
  return (
    <>
      <Dim k={interpolate(f, [0, 20], [0, 1], clamp)} />
      <Num n={4} text="Вырос товар — или чек?" s={a} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <text
          x={110}
          y={330}
          fontFamily={MONO}
          fontWeight={700}
          fontSize={26}
          fill={C.dim}
          letterSpacing="4"
        >
          ПРОДАЖИ ТОВАРА
        </text>
        <line
          x1={110}
          y1={780}
          x2={640}
          y2={780}
          stroke={C.w}
          strokeWidth={4}
        />
        <rect x={150} y={780 - b1} width={180} height={b1} fill={C.dim} />
        <rect x={420} y={780 - b2} width={180} height={b2} fill={C.y} />
        <text
          x={240}
          y={830}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={28}
          fill={C.dim}
        >
          ДО
        </text>
        <text
          x={510}
          y={830}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={28}
          fill={C.w}
        >
          ПОСЛЕ ↑
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 280,
          display: "flex",
          gap: 40,
          opacity: r,
          transform: `translateY(${(1 - r) * 50}px)`,
        }}
      >
        <Receipt
          head="ЧЕК ДО"
          rows={[["Сок «Б»"], ["Хлеб"], ["Сыр"]]}
          sum="860 ₽"
          w={420}
        />
        <Receipt
          head="ЧЕК ПОСЛЕ"
          rows={[["Сок «А»", "y"], ["Хлеб"], ["Сыр"]]}
          sum="860 ₽"
          w={420}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 820,
          opacity: v,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          color: C.w,
        }}
      >
        взяли вместо другого — <Y>чек не вырос</Y>
      </div>
    </>
  );
};
const S8: React.FC = () => {
  const [c0 = 0, c1 = 70, c2 = 138] = cueOf(8);
  const a = useSp(c0 + 6),
    b = useSp(c1),
    c = useSp(c2, 13);
  return (
    <>
      <Scrim side="left" w={56} />
      <div style={{ position: "absolute", left: 110, top: 110, width: 1200 }}>
        <div
          style={{
            opacity: a,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
            color: C.w,
            lineHeight: 1.1,
          }}
        >
          │ вертикаль — порядок на полке
        </div>
        <div
          style={{
            opacity: b,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 46,
            color: C.y,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          — горизонталь — связи через зал
        </div>
      </div>
      <H s={c} size={76} y={720} w={1200}>
        Вместе — <Y>полная картина</Y>
      </H>
    </>
  );
};
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const a = useSp(2),
    o = useSp(14),
    btn = useSp(30, 11);
  const it = (i: number) =>
    interpolate(f, [24 + i * 7, 40 + i * 7], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: 0.25 }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`v${i}`}
            x1={1240 + i * 120}
            y1={0}
            x2={1240 + i * 120}
            y2={1080}
            stroke={C.w}
            strokeWidth={6}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1={1180}
            y1={180 + i * 180}
            x2={1920}
            y2={180 + i * 180}
            stroke={C.y}
            strokeWidth={6}
          />
        ))}
      </svg>
      <Kick s={a} y={110}>
        АНАЛИТИКА ПРО
      </Kick>
      <H s={a} size={96} y={160} w={1400}>
        {"Увидим горизонталь\nвашего магазина"}
      </H>
      <div style={{ position: "absolute", left: 110, top: 430, opacity: o }}>
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
          top: 800,
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
            fontSize: 46,
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
const OVER = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9];

// субтитры: белый текст на полупрозрачной плашке
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const line = LINES.find((l) => f >= l.from && f < l.from + l.frames + 6);
  if (!line || f >= SCENES[SCENES.length - 2]) return null;
  const a = line.from === 0 ? 1 : Math.min(1, (f - line.from) / 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 56,
        display: "flex",
        justifyContent: "center",
        opacity: a,
      }}
    >
      <div
        style={{
          background: "rgba(5,20,13,0.78)",
          padding: "14px 30px",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.3,
          color: C.w,
          textAlign: "center",
          maxWidth: 1500,
        }}
      >
        {line.text}
      </div>
    </div>
  );
};
const Brand: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 2 || f >= SCENES[SCENES.length - 2]) return null;
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

// обложка — тот же мир, общий план
export const Grid2Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${960 - 3000 * 0.42}px, ${540 - 1400 * 0.42}px) scale(0.42)`,
        transformOrigin: "0 0",
      }}
    >
      <World f={SCENES[3] + 20} />
    </div>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(10,42,27,0.98) 0%, rgba(10,42,27,0.95) 52%, rgba(10,42,27,0) 72%)",
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
        lineHeight: 0.92,
      }}
    >
      <div style={{ fontSize: 170, color: C.w }}>Красиво</div>
      <div style={{ fontSize: 200, color: C.y }}>≠</div>
      <div style={{ fontSize: 170, color: C.w }}>прибыльно</div>
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
        fontSize: 50,
        letterSpacing: "-0.03em",
        color: C.ink,
      }}
    >
      что видно только в чеке
    </div>
  </AbsoluteFill>
);

export const Grid2Film: React.FC = () => {
  const f = useCurrentFrame();
  const [cx, cy, z] = camAt(f);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${960 - cx * z}px, ${540 - cy * z}px) scale(${z})`,
          transformOrigin: "0 0",
        }}
      >
        <World f={f} />
      </div>
      {/* лёгкая виньетка */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      {OVER.map((O, i) => (
        <Sequence
          key={i}
          from={SCENES[i]}
          durationInFrames={SCENES[i + 1] - SCENES[i]}
        >
          <O />
        </Sequence>
      ))}
      <Subs />
      <Brand />
      <MusicBed
        src="music/bed-xl.mp3"
        lines={LINES}
        duration={GRID2_DURATION}
        ducking={false}
      />
      {SCENES.slice(1, -1).map((b) => (
        <Sequence key={`w${b}`} from={b - 4} layout="none">
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence durationInFrames={1}>
        <Grid2Cover />
      </Sequence>
    </AbsoluteFill>
  );
};
