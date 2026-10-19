import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Big,
  Bottle,
  Grain,
  Kick,
  MONO,
  N,
  Pack,
  Spot,
  Strip,
  Vignette,
} from "./Kit";

// Заставка: крупный текст для миниатюры + пара товаров на полке под светом
export const NoirCover: React.FC = () => (
  <AbsoluteFill style={{ background: N.bg }}>
    <Spot x={1560} w={1000} o={0.2} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="shelf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2A2D34" />
          <stop offset="1" stopColor="#121318" />
        </linearGradient>
      </defs>
      {/* полка */}
      <rect x={1180} y={858} width={760} height={40} fill="#3A3D45" />
      <rect x={1180} y={898} width={760} height={190} fill="url(#shelf)" />
      {/* ценники */}
      <rect x={1345} y={906} width={150} height={56} fill={N.paper} />
      <text
        x={1420}
        y={944}
        textAnchor="middle"
        fontFamily={MONO}
        fontWeight={700}
        fontSize={26}
        fill="#222"
      >
        ДЕТИ
      </text>
      <rect x={1655} y={906} width={150} height={56} fill={N.beer} />
      <text
        x={1730}
        y={944}
        textAnchor="middle"
        fontFamily={MONO}
        fontWeight={700}
        fontSize={26}
        fill="#222"
      >
        ПИВО
      </text>
      <ellipse cx={1420} cy={858} rx={150} ry={14} fill="#000" opacity={0.5} />
      <ellipse cx={1730} cy={858} rx={70} ry={10} fill="#000" opacity={0.5} />
      <Pack x={1420} y={676} s={0.95} r={-3} id="cp" />
      <Bottle x={1730} y={680} s={0.95} r={4} id="cb" />
    </svg>
    <div style={{ position: "absolute", left: 90, top: 96, width: 1000 }}>
      <Kick color={N.beer} style={{ fontSize: 34 }}>
        Почему в супермаркете
      </Kick>
      <Big size={300} color={N.beer} style={{ marginTop: 6 }}>
        Пиво
      </Big>
      <Big size={150} style={{ whiteSpace: "nowrap" }}>
        стоит рядом
      </Big>
      <Big size={130} color={N.blue} style={{ whiteSpace: "nowrap" }}>
        с подгузниками?
      </Big>
    </div>
    <Vignette k={0.6} />
    <Grain seed={1} />
  </AbsoluteFill>
);

// Кадр стиля А: находка пары
export const NoirFrameA: React.FC = () => (
  <AbsoluteFill style={{ background: N.bg }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {/* дальние чеки, размытые */}
      <g filter="url(#blur)" opacity={0.35}>
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        {[
          [120, 140, -8],
          [1560, 90, 6],
          [1720, 560, -4],
          [60, 600, 5],
        ].map(([x, y, r], i) => (
          <Strip
            key={i}
            x={x}
            y={y}
            w={260}
            rows={["Хлеб", "Молоко", "Яйца"]}
            r={r}
            s={0.8}
          />
        ))}
      </g>
    </svg>
    <Spot x={960} w={1300} o={0.17} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <Strip
        x={800}
        y={170}
        w={480}
        rows={["Хлеб", "ПОДГУЗНИКИ", "Салфетки", "ПИВО ×6", "Чипсы"]}
        hi={{
          ПОДГУЗНИКИ: "rgba(124,196,255,0.55)",
          "ПИВО ×6": "rgba(245,166,35,0.6)",
        }}
        head="ПТ · 18:47 · КАССА 4"
      />
      <path
        d="M 1280 345 C 1400 345 1400 485 1280 485"
        stroke={N.ink}
        strokeWidth={4}
        fill="none"
        strokeDasharray="10 8"
      />
      <circle cx={1280} cy={345} r={8} fill={N.blue} />
      <circle cx={1280} cy={485} r={8} fill={N.beer} />
    </svg>
    <div style={{ position: "absolute", left: 1420, top: 360 }}>
      <Kick color={N.muted}>найдено в чеках</Kick>
      <Big size={110} color={N.ink} style={{ marginTop: 8 }}>
        одна
        <br />
        пара
      </Big>
    </div>
    <div style={{ position: "absolute", left: 90, top: 380 }}>
      <Big size={104} color={N.blue}>
        Подгузники
      </Big>
      <Big size={104} color={N.ink}>
        +
      </Big>
      <Big size={104} color={N.beer}>
        Пиво
      </Big>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 70,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 44,
          color: N.ink,
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        выделилась странная парочка.{" "}
        <span style={{ color: N.beer }}>Подгузники</span>{" "}
        <span style={{ opacity: 0.4 }}>и пиво.</span>
      </div>
    </div>
    <Vignette />
    <Grain seed={2} />
  </AbsoluteFill>
);

// Кадр стиля Б: данные — поток чеков превращается в поле точек
export const NoirFrameB: React.FC = () => {
  const COLS = 40,
    ROWS = 18;
  return (
    <AbsoluteFill style={{ background: N.bg }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS,
            r = Math.floor(i / COLS);
          const x = 860 + c * 25,
            y = 150 + r * 36;
          const h = (i * 2654435761) % 997;
          const col = h % 13 === 0 ? N.beer : h % 11 === 0 ? N.blue : N.dim;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={h % 13 === 0 || h % 11 === 0 ? 5 : 3.5}
              fill={col}
            />
          );
        })}
        <path
          d="M 1185 330 Q 1400 200 1560 618"
          stroke={N.ink}
          strokeWidth={3}
          fill="none"
        />
        <circle
          cx={1185}
          cy={330}
          r={14}
          fill="none"
          stroke={N.blue}
          strokeWidth={4}
        />
        <circle
          cx={1560}
          cy={618}
          r={14}
          fill="none"
          stroke={N.beer}
          strokeWidth={4}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Strip
            key={i}
            x={80 + i * 46}
            y={380 + i * 60}
            w={300}
            rows={["Товар", "Товар", "Товар"]}
            r={-6 + i * 3}
            s={0.9}
            o={0.25 + i * 0.18}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 80 }}>
        <Kick>конец 1990-х · сша</Kick>
        <Big size={96} style={{ marginTop: 12 }}>
          Тысячи чеков.
        </Big>
        <Big size={96} color={N.beer}>
          Миллионы покупок.
        </Big>
      </div>
      <div
        style={{
          position: "absolute",
          left: 860,
          top: 820,
          fontFamily: MONO,
          fontSize: 24,
          color: N.muted,
          letterSpacing: "0.1em",
        }}
      >
        1 ТОЧКА = 1 ПРОБИТЫЙ ШТРИХКОД
      </div>
      <Vignette />
      <Grain seed={3} />
    </AbsoluteFill>
  );
};
