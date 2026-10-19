import React from "react";
import QRCode from "qrcode";
import { F } from "../Refs/Refs";
import { Person } from "../Refs/Refs2";

// Плоские иллюстрации для горизонтальной версии «Пиво и подгузники».
export const SANS = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";
export const P = {
  ...F,
  sky: "#2B3A67",
  night: "#1E2A4F",
  diaper: "#8EC5FF",
  diaperDark: "#5C9EE6",
  beer: "#E39B2D",
  beerDark: "#B8741A",
  glass: "#7A4A1C",
  cream: "#FFF6E8",
  paper: "#FFFFFF",
  muted: "#8C97A8",
  lilac: "#C8B6E2",
};

// Упаковка подгузников
export const DiaperPack: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
}> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-90} y={-120} width={180} height={230} rx={26} fill={P.diaper} />
    <rect
      x={-90}
      y={-120}
      width={180}
      height={40}
      rx={20}
      fill={P.diaperDark}
    />
    <rect x={-90} y={-96} width={180} height={16} fill={P.diaperDark} />
    <circle cx={0} cy={0} r={46} fill={P.cream} />
    <circle cx={-15} cy={-6} r={6} fill={P.navy} />
    <circle cx={15} cy={-6} r={6} fill={P.navy} />
    <path
      d="M -16 14 Q 0 28 16 14"
      stroke={P.navy}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={-28} cy={10} r={8} fill={P.coral} opacity={0.3} />
    <circle cx={28} cy={10} r={8} fill={P.coral} opacity={0.3} />
    <path
      d="M -10 -44 Q 0 -60 12 -46"
      stroke={P.navy}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <rect x={-70} y={62} width={140} height={32} rx={10} fill="#fff" />
    <text
      x={0}
      y={85}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={20}
      fill={P.diaperDark}
    >
      ПОДГУЗНИКИ
    </text>
  </g>
);

// Бутылка пива
export const BeerBottle: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
}> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-14} y={-150} width={28} height={20} rx={4} fill={P.mustard} />
    <path
      d="M -12 -132 L 12 -132 L 14 -80 Q 34 -66 34 -30 L 34 100 Q 34 112 22 112 L -22 112 Q -34 112 -34 100 L -34 -30 Q -34 -66 -14 -80 Z"
      fill={P.glass}
    />
    <path
      d="M -24 -30 L -24 90"
      stroke="#fff"
      strokeWidth={6}
      opacity={0.25}
      strokeLinecap="round"
    />
    <rect x={-34} y={-6} width={68} height={60} fill={P.cream} />
    <text
      x={0}
      y={32}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={20}
      fill={P.beerDark}
    >
      ПИВО
    </text>
  </g>
);

// Упаковка из шести бутылок
export const SixPack: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
}> = ({ x, y, s = 1, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {[-60, 0, 60].map((dx) => (
      <g key={dx}>
        <rect
          x={dx - 10}
          y={-120}
          width={20}
          height={14}
          rx={3}
          fill={P.mustard}
        />
        <path
          d={`M ${dx - 9} -108 L ${dx + 9} -108 L ${dx + 11} -70 Q ${dx + 26} -60 ${dx + 26} -36 L ${dx - 26} -36 Q ${dx - 26} -60 ${dx - 11} -70 Z`}
          fill={P.glass}
        />
      </g>
    ))}
    <path d="M -96 -40 L 96 -40 L 90 90 L -90 90 Z" fill={P.beer} />
    <path
      d="M -40 -40 Q 0 -90 40 -40"
      stroke={P.beerDark}
      strokeWidth={12}
      fill="none"
    />
    <rect x={-70} y={0} width={140} height={44} rx={10} fill={P.cream} />
    <text
      x={0}
      y={31}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={26}
      fill={P.beerDark}
    >
      ПИВО ×6
    </text>
  </g>
);

export const Bread: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -90 40 L -90 -20 Q -90 -70 -40 -70 L 40 -70 Q 90 -70 90 -20 L 90 40 Z"
      fill="#D9934A"
    />
    {[-45, 0, 45].map((dx) => (
      <path
        key={dx}
        d={`M ${dx - 14} -50 L ${dx + 14} -30`}
        stroke="#F3C27E"
        strokeWidth={8}
        strokeLinecap="round"
      />
    ))}
  </g>
);
export const Butter: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 -20 L 20 -50 L 80 -20 L -10 10 Z" fill="#FFE68A" />
    <path d="M -70 -20 L -10 10 L -10 50 L -70 20 Z" fill="#F2CF55" />
    <path d="M -10 10 L 80 -20 L 80 20 L -10 50 Z" fill="#E6BD3A" />
  </g>
);
export const Chips: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -70 -90 L 70 -90 L 60 -70 Q 80 0 60 70 L 70 90 L -70 90 L -60 70 Q -80 0 -60 -70 Z"
      fill={P.coral}
    />
    <circle cx={0} cy={0} r={34} fill={P.mustard} />
    <path
      d="M -50 -90 L -40 -78 L -30 -90 L -20 -78 L -10 -90 L 0 -78 L 10 -90 L 20 -78 L 30 -90 L 40 -78 L 50 -90"
      stroke="#fff"
      strokeWidth={4}
      fill="none"
      opacity={0.6}
    />
  </g>
);
export const Soda: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-80} width={80} height={160} rx={18} fill={P.teal} />
    <rect x={-34} y={-92} width={68} height={16} rx={6} fill="#B8C4CF" />
    <path
      d="M -40 -10 Q 0 20 40 -10 L 40 20 Q 0 50 -40 20 Z"
      fill="#fff"
      opacity={0.8}
    />
  </g>
);

// Корзина с ручкой
export const Basket: React.FC<{
  x: number;
  y: number;
  s?: number;
  children?: React.ReactNode;
}> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -130 -60 Q 0 -230 130 -60"
      stroke={P.navy}
      strokeWidth={16}
      fill="none"
      strokeLinecap="round"
    />
    {children}
    <path d="M -160 -60 L 160 -60 L 130 90 L -130 90 Z" fill={P.coral} />
    {[-90, -30, 30, 90].map((dx) => (
      <line
        key={dx}
        x1={dx}
        y1={-46}
        x2={dx * 0.85}
        y2={78}
        stroke="#fff"
        strokeWidth={8}
        opacity={0.35}
        strokeLinecap="round"
      />
    ))}
    <rect x={-166} y={-74} width={332} height={26} rx={13} fill="#D9584A" />
  </g>
);

// Чек с позициями; mark — какие строки подсветить
export const Receipt: React.FC<{
  x: number;
  y: number;
  w?: number;
  items: string[];
  mark?: Record<string, string>;
  title?: string;
  s?: number;
}> = ({ x, y, w = 320, items, mark = {}, title = "ЧЕК", s = 1 }) => {
  const h = 120 + items.length * 54;
  const zig = Array.from(
    { length: Math.round(w / 20) + 1 },
    (_, i) => `${i * 20},${i % 2 ? 12 : 0}`,
  ).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x={6}
        y={12}
        width={w}
        height={h}
        rx={8}
        fill="rgba(36,59,85,0.12)"
      />
      <rect x={0} y={0} width={w} height={h} rx={8} fill="#fff" />
      <polyline
        points={zig}
        transform={`translate(0 ${h - 6})`}
        fill="#fff"
        stroke="none"
      />
      <text
        x={24}
        y={44}
        fontFamily={MONO}
        fontWeight={700}
        fontSize={22}
        fill={P.muted}
      >
        {title}
      </text>
      <line
        x1={24}
        y1={62}
        x2={w - 24}
        y2={62}
        stroke="#E3E7EE"
        strokeWidth={3}
        strokeDasharray="8 8"
      />
      {items.map((it, i) => (
        <g key={it + i}>
          {mark[it] && (
            <rect
              x={14}
              y={78 + i * 54}
              width={w - 28}
              height={44}
              rx={10}
              fill={mark[it]}
            />
          )}
          <text
            x={28}
            y={110 + i * 54}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={28}
            fill={P.navy}
          >
            {it}
          </text>
          <text
            x={w - 28}
            y={110 + i * 54}
            textAnchor="end"
            fontFamily={MONO}
            fontWeight={500}
            fontSize={22}
            fill={P.muted}
          >
            ×1
          </text>
        </g>
      ))}
    </g>
  );
};

// Человек в полный рост: ноги с шагом + персонаж-бюст сверху
export const Walker: React.FC<{
  x: number;
  y: number;
  s: number;
  phase: number; // фаза шага, радианы; 0 — стоит
  stride?: number; // 0..1
  top: string;
  pants?: string;
  skin?: string;
  hair?: string;
  mood?: "neutral" | "happy" | "bored";
  pose?: "relaxed" | "crossed" | "point" | "notebook";
  target?: [number, number];
  flip?: boolean;
  carry?: React.ReactNode; // что в руке (в локальных координатах персонажа)
}> = ({
  x,
  y,
  s,
  phase,
  stride = 1,
  top,
  pants = P.navy,
  skin = F.skin1,
  hair = F.hair,
  mood = "neutral",
  pose = "relaxed",
  target,
  flip,
  carry,
}) => {
  const a = Math.sin(phase) * 0.38 * stride;
  const bob = Math.abs(Math.cos(phase)) * 8 * stride;
  const leg = (ang: number, k: number) => (
    <g transform={`rotate(${(ang * 180) / Math.PI} ${k * 40} 470)`}>
      <rect
        x={k * 40 - 34}
        y={460}
        width={68}
        height={250}
        rx={30}
        fill={pants}
      />
      <path
        d={`M ${k * 40 - 36} 690 L ${k * 40 + 50} 690 Q ${k * 40 + 62} 730 ${k * 40 + 30} 734 L ${k * 40 - 36} 734 Z`}
        fill="#2A2626"
      />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(${s})`}>
        {leg(-a, -1)}
        {leg(a, 1)}
      </g>
      <Person
        x={0}
        y={0}
        s={s}
        skin={skin}
        hair={hair}
        hairStyle="short"
        top={top}
        pose={pose}
        mood={mood}
        target={target}
      />
      {carry && <g transform={`scale(${s})`}>{carry}</g>}
    </g>
  );
};

// Полка (вид спереди) с цветными упаковками
export const Shelf: React.FC<{
  x: number;
  y: number;
  w: number;
  rows?: number;
  seed?: number;
  dim?: number;
}> = ({ x, y, w, rows = 3, seed = 1, dim = 0 }) => {
  const cols = [
    "#EE6A57",
    "#2BA59B",
    "#F2B33D",
    "#8EC5FF",
    "#C8B6E2",
    "#5C7CFA",
    "#FFB4A8",
  ];
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    let cx = x + 16;
    let k = 0;
    while (cx < x + w - 60) {
      const h = 70 + ((seed * 31 + r * 17 + k * 13) % 5) * 12;
      const bw = 44 + ((seed * 7 + r * 5 + k * 11) % 4) * 14;
      const c = cols[(seed + r * 3 + k) % cols.length];
      out.push(
        <rect
          key={`${r}-${k}`}
          x={cx}
          y={y + r * 150 + 130 - h}
          width={bw}
          height={h}
          rx={8}
          fill={c}
        />,
      );
      cx += bw + 10;
      k++;
    }
  }
  return (
    <g opacity={1 - dim * 0.6}>
      <rect
        x={x - 14}
        y={y - 30}
        width={w + 28}
        height={rows * 150 + 40}
        rx={14}
        fill="#E9DCCB"
      />
      {out}
      {Array.from({ length: rows }, (_, r) => (
        <rect
          key={r}
          x={x - 14}
          y={y + r * 150 + 130}
          width={w + 28}
          height={18}
          rx={4}
          fill={F.wood}
        />
      ))}
    </g>
  );
};

// QR-код из модулей
const qr = QRCode.create("https://t.me/analysis_pro_ru", {
  errorCorrectionLevel: "M",
});
export const QR: React.FC<{ size: number; color?: string }> = ({
  size,
  color = P.navy,
}) => {
  const n = qr.modules.size;
  const cell = size / n;
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.modules.get(r, c))
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell + 0.4}
            height={cell + 0.4}
            fill={color}
          />,
        );
  return (
    <svg width={size} height={size}>
      {rects}
    </svg>
  );
};
