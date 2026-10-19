import "@fontsource/oswald/cyrillic-500.css";
import "@fontsource/oswald/cyrillic-700.css";
import "@fontsource/oswald/latin-500.css";
import "@fontsource/oswald/latin-700.css";
import React from "react";
import { AbsoluteFill } from "remotion";

// «Пиво и подгузники» — тёмная документальная графика: свет пятном, бумага чеков, крупный узкий шрифт.
export const N = {
  bg: "#0D0E11",
  bg2: "#16181D",
  ink: "#F2EEE6",
  muted: "#8A8F98",
  dim: "#3A3E46",
  beer: "#F5A623",
  beerDeep: "#B8650F",
  blue: "#7CC4FF",
  blueDeep: "#2F6FB0",
  paper: "#ECE6DA",
  red: "#FF5A3C",
};
export const DISPLAY = "Oswald, 'Arial Narrow', sans-serif";
export const BODY = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";

// Зерно плёнки и виньетка поверх всего кадра
export const Grain: React.FC<{
  seed?: number;
  w?: number;
  h?: number;
  amount?: number;
}> = ({ seed = 0, w = 1920, h = 1080, amount = 0.08 }) => (
  <svg
    width={w}
    height={h}
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      mixBlendMode: "overlay",
      opacity: amount * 6,
    }}
  >
    <filter id={`g${seed % 7}`}>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves={2}
        seed={seed % 7}
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={w} height={h} filter={`url(#g${seed % 7})`} />
  </svg>
);
export const Vignette: React.FC<{ k?: number }> = ({ k = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,${k}) 100%)`,
      pointerEvents: "none",
    }}
  />
);
// Луч света сверху
export const Spot: React.FC<{
  x: number;
  w?: number;
  color?: string;
  o?: number;
  top?: number;
  h?: number;
}> = ({ x, w = 700, color = "255,236,200", o = 0.16, top = -80, h = 1200 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top,
      width: w,
      height: h,
      background: `radial-gradient(ellipse at 50% 0%, rgba(${color},${o * 1.6}) 0%, rgba(${color},${o}) 30%, rgba(${color},0) 70%)`,
      clipPath: `polygon(38% 0, 62% 0, 100% 100%, 0 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Бутылка пива со светотенью
export const Bottle: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
  id?: string;
}> = ({ x, y, s = 1, r = 0, id = "b" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}glass`} x1="0" x2="1">
        <stop offset="0" stopColor="#3A1A04" />
        <stop offset="0.28" stopColor="#8A4510" />
        <stop offset="0.45" stopColor="#C26A1A" />
        <stop offset="0.62" stopColor="#7A3A0C" />
        <stop offset="1" stopColor="#240E02" />
      </linearGradient>
      <linearGradient id={`${id}label`} x1="0" x2="1">
        <stop offset="0" stopColor="#B9A88C" />
        <stop offset="0.4" stopColor="#F4EBDC" />
        <stop offset="1" stopColor="#9C8D74" />
      </linearGradient>
      <linearGradient id={`${id}cap`} x1="0" x2="1">
        <stop offset="0" stopColor="#6B5A2A" />
        <stop offset="0.5" stopColor="#E8C66A" />
        <stop offset="1" stopColor="#5E4E20" />
      </linearGradient>
    </defs>
    <rect
      x={-17}
      y={-232}
      width={34}
      height={22}
      rx={3}
      fill={`url(#${id}cap)`}
    />
    <path
      d="M -15 -212 L 15 -212 L 17 -140 Q 46 -118 46 -64 L 46 170 Q 46 186 30 186 L -30 186 Q -46 186 -46 170 L -46 -64 Q -46 -118 -17 -140 Z"
      fill={`url(#${id}glass)`}
    />
    <path
      d="M -30 -50 L -30 160"
      stroke="#FFD9A0"
      strokeWidth={7}
      opacity={0.35}
      strokeLinecap="round"
    />
    <path
      d="M 30 -40 L 30 150"
      stroke="#FFD9A0"
      strokeWidth={3}
      opacity={0.15}
      strokeLinecap="round"
    />
    <rect x={-46} y={-4} width={92} height={96} fill={`url(#${id}label)`} />
    <rect x={-46} y={8} width={92} height={4} fill={N.beerDeep} opacity={0.7} />
    <rect
      x={-46}
      y={78}
      width={92}
      height={4}
      fill={N.beerDeep}
      opacity={0.7}
    />
    <text
      x={0}
      y={56}
      textAnchor="middle"
      fontFamily={DISPLAY}
      fontWeight={700}
      fontSize={32}
      fill="#5A2C08"
      letterSpacing="1"
    >
      ПИВО
    </text>
  </g>
);

// Упаковка подгузников со светотенью
export const Pack: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
  id?: string;
}> = ({ x, y, s = 1, r = 0, id = "p" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <defs>
      <linearGradient id={`${id}body`} x1="0" x2="1">
        <stop offset="0" stopColor="#2A5C93" />
        <stop offset="0.35" stopColor="#6FB3F2" />
        <stop offset="0.55" stopColor="#9ED0FF" />
        <stop offset="1" stopColor="#25507F" />
      </linearGradient>
      <linearGradient id={`${id}top`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#CFE8FF" />
        <stop offset="1" stopColor="#7DB8EE" />
      </linearGradient>
    </defs>
    <path
      d="M -120 -150 Q -120 -176 -94 -176 L 94 -176 Q 120 -176 120 -150 L 128 170 Q 128 190 108 190 L -108 190 Q -128 190 -128 170 Z"
      fill={`url(#${id}body)`}
    />
    <path
      d="M -120 -150 Q -120 -176 -94 -176 L 94 -176 Q 120 -176 120 -150 L 120 -120 L -120 -120 Z"
      fill={`url(#${id}top)`}
    />
    <path
      d="M -60 -176 Q 0 -230 60 -176"
      stroke="#CFE8FF"
      strokeWidth={10}
      fill="none"
    />
    <circle cx={0} cy={0} r={62} fill="#F6F1E8" opacity={0.95} />
    <circle cx={-20} cy={-8} r={7} fill="#24364F" />
    <circle cx={20} cy={-8} r={7} fill="#24364F" />
    <path
      d="M -20 18 Q 0 34 20 18"
      stroke="#24364F"
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
    />
    <rect x={-96} y={96} width={192} height={52} rx={8} fill="#F6F1E8" />
    <text
      x={0}
      y={133}
      textAnchor="middle"
      fontFamily={DISPLAY}
      fontWeight={700}
      fontSize={30}
      fill={N.blueDeep}
      letterSpacing="2"
    >
      ПОДГУЗНИКИ
    </text>
    <path
      d="M -128 170 L -120 -150"
      stroke="#000"
      strokeWidth={10}
      opacity={0.15}
    />
  </g>
);

// Полоска чека
export const Strip: React.FC<{
  x: number;
  y: number;
  w?: number;
  rows: string[];
  hi?: Record<string, string>;
  head?: string;
  r?: number;
  s?: number;
  o?: number;
}> = ({
  x,
  y,
  w = 340,
  rows,
  hi = {},
  head = "КАССОВЫЙ ЧЕК",
  r = 0,
  s = 1,
  o = 1,
}) => {
  const h = 150 + rows.length * 46;
  const teeth = Array.from(
    { length: Math.ceil(w / 16) + 1 },
    (_, i) => `${i * 16},${i % 2 ? 10 : 0}`,
  ).join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      <rect x={8} y={14} width={w} height={h} fill="#000" opacity={0.35} />
      <rect x={0} y={0} width={w} height={h} fill={N.paper} />
      <polyline
        points={teeth}
        transform={`translate(0 ${h - 2})`}
        fill={N.paper}
      />
      <text
        x={w / 2}
        y={40}
        textAnchor="middle"
        fontFamily={MONO}
        fontWeight={700}
        fontSize={18}
        fill="#3B3B3B"
      >
        {head}
      </text>
      <line
        x1={20}
        y1={58}
        x2={w - 20}
        y2={58}
        stroke="#9C968A"
        strokeWidth={2}
        strokeDasharray="6 6"
      />
      {rows.map((t, i) => (
        <g key={t + i}>
          {hi[t] && (
            <rect
              x={12}
              y={70 + i * 46}
              width={w - 24}
              height={38}
              fill={hi[t]}
            />
          )}
          <text
            x={22}
            y={96 + i * 46}
            fontFamily={MONO}
            fontWeight={500}
            fontSize={22}
            fill="#1E1E1E"
          >
            {t}
          </text>
        </g>
      ))}
      <line
        x1={20}
        y1={h - 64}
        x2={w - 20}
        y2={h - 64}
        stroke="#9C968A"
        strokeWidth={2}
        strokeDasharray="6 6"
      />
      {Array.from({ length: 30 }, (_, i) => (
        <rect
          key={i}
          x={24 + i * ((w - 48) / 30)}
          y={h - 48}
          width={(i * 7) % 3 === 0 ? 4 : 2}
          height={30}
          fill="#1E1E1E"
        />
      ))}
    </g>
  );
};

// Крупная строка заголовка
export const Big: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 140, color = N.ink, style }) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: "0.005em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Kick: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = N.muted, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
