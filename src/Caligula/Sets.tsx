import React from "react";
import { C, FONT_ROMAN } from "./format";

// Every set covers x -400..2320 and y -400..1500 so zooms and the tall
// vertical crop never reveal an edge.
const X0 = -400;
const W = 2720;
const Y0 = -400;
const FLOOR = 900;

export const Column: React.FC<{ x: number; top: number; bottom: number; w?: number; color?: string }> = ({
  x,
  top,
  bottom,
  w = 90,
  color = "#f5eee2",
}) => (
  <g>
    <rect x={x - w / 2} y={top + 40} width={w} height={bottom - top - 70} fill={color} />
    {[-0.3, 0, 0.3].map((k) => (
      <rect key={k} x={x + k * w - 4} y={top + 50} width={8} height={bottom - top - 90} fill="#00000014" />
    ))}
    <rect x={x - w / 2 - 18} y={top} width={w + 36} height={26} fill={color} />
    <rect x={x - w / 2 - 8} y={top + 24} width={w + 16} height={18} fill="#e3d6bf" />
    <rect x={x - w / 2 - 14} y={bottom - 34} width={w + 28} height={34} fill="#e3d6bf" />
  </g>
);

const Floor: React.FC<{ a: string; b: string; y?: number }> = ({ a, b, y = FLOOR }) => (
  <g>
    <rect x={X0} y={y} width={W} height={1500 - y} fill={a} />
    {Array.from({ length: 30 }).map((_, i) =>
      Array.from({ length: 6 }).map((__, j) => {
        const cx = X0 + i * 100 + (j % 2) * 50;
        const cy = y + 40 + j * 90;
        return <rect key={`${i}-${j}`} x={cx} y={cy} width={44} height={44} fill={b} transform={`rotate(45 ${cx + 22} ${cy + 22})`} />;
      }),
    )}
    <rect x={X0} y={y} width={W} height={14} fill="#00000022" />
  </g>
);

export const SenateHall: React.FC<{ benches?: boolean }> = ({ benches = true }) => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill="#e6d6ba" />
    {/* wall panels */}
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-260 + i * 300} y={60} width={220} height={560} fill="#d8c3a0" stroke="#c6ad86" strokeWidth={8} />
    ))}
    <rect x={X0} y={-60} width={W} height={60} fill="#cdb48c" />
    <rect x={X0} y={600} width={W} height={40} fill="#cdb48c" />
    {[60, 360, 660, 1260, 1560, 1860].map((x) => (
      <Column key={x} x={x} top={-140} bottom={FLOOR - 120} />
    ))}
    <text x={960} y={-6} textAnchor="middle" fontSize={64} fontFamily={FONT_ROMAN} fontWeight={700} fill="#8a6a3a" letterSpacing={18}>
      S·P·Q·R
    </text>
    {/* tiered benches */}
    {benches &&
      [0, 1, 2].map((t) => (
        <g key={t}>
          <rect x={X0} y={FLOOR - 300 + t * 100} width={720 - t * 60} height={100} fill={t % 2 ? "#b89668" : "#c7a678"} />
          <rect x={1600 + t * 60} y={FLOOR - 300 + t * 100} width={720} height={100} fill={t % 2 ? "#b89668" : "#c7a678"} />
        </g>
      ))}
    <Floor a="#cdb998" b="#a88a63" />
  </g>
);

export const Rostrum: React.FC<{ x: number; y: number; label?: string }> = ({ x, y, label = "SENATVS" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-260} y={-300} width={520} height={300} fill="#8a5a33" />
    <rect x={-280} y={-330} width={560} height={44} rx={8} fill="#6e4424" />
    <rect x={-220} y={-260} width={440} height={200} fill="#9c6b40" stroke={C.gold} strokeWidth={6} />
    <text x={0} y={-140} textAnchor="middle" fontSize={64} fontFamily={FONT_ROMAN} fontWeight={700} fill={C.gold}>
      {label}
    </text>
  </g>
);

export const ThroneRoom: React.FC = () => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill="#7a1f1f" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={X0 + i * 240} y={Y0} width={40} height={FLOOR - Y0} fill="#8f2a26" />
    ))}
    {/* purple drapes */}
    <path d="M 300 -400 C 340 200 420 500 560 860 L 300 860 Z" fill={C.purple} />
    <path d="M 1620 -400 C 1580 200 1500 500 1360 860 L 1620 860 Z" fill={C.purple} />
    <path d="M 300 -400 L 1620 -400 L 1620 -120 C 1300 40 620 40 300 -120 Z" fill={C.purpleDark} />
    <path d="M 300 -120 C 620 40 1300 40 1620 -120" stroke={C.gold} strokeWidth={14} fill="none" />
    {[-200, 2120].map((x) => (
      <Column key={x} x={x} top={-200} bottom={FLOOR} w={120} color="#e9c86a" />
    ))}
    <Floor a="#e8dcc6" b="#cbb894" />
  </g>
);

export const Throne: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -180 0 L -180 -560 Q 0 -660 180 -560 L 180 0 Z" fill={C.gold} />
    <path d="M -140 -40 L -140 -530 Q 0 -610 140 -530 L 140 -40 Z" fill={C.purple} />
    <circle cx={0} cy={-590} r={34} fill="#d6262b" stroke={C.goldDark} strokeWidth={8} />
    <rect x={-230} y={-180} width={460} height={70} rx={20} fill={C.goldDark} />
    <rect x={-200} y={-110} width={400} height={110} fill={C.gold} />
    <rect x={-250} y={-250} width={60} height={250} rx={18} fill={C.gold} />
    <rect x={190} y={-250} width={60} height={250} rx={18} fill={C.gold} />
  </g>
);

export const Camp: React.FC = () => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill="#cfe3ea" />
    <ellipse cx={1500} cy={120} rx={90} ry={90} fill="#fff3c4" />
    <path d="M -400 760 Q 400 600 1000 720 T 2320 700 L 2320 900 L -400 900 Z" fill="#9fb27a" />
    {[0, 1, 2, 3, 4].map((i) => {
      const x = -100 + i * 480;
      return (
        <g key={i}>
          <path d={`M ${x} 860 L ${x + 160} 640 L ${x + 320} 860 Z`} fill="#e3d2a8" />
          <path d={`M ${x + 160} 640 L ${x + 160} 860`} stroke="#b59c68" strokeWidth={6} />
        </g>
      );
    })}
    <rect x={X0} y={FLOOR} width={W} height={1500 - FLOOR} fill="#b39467" />
  </g>
);

export const Stable: React.FC = () => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill="#f4efe6" />
    {/* marble veins */}
    {Array.from({ length: 14 }).map((_, i) => (
      <path
        key={i}
        d={`M ${X0 + i * 210} ${-300 + (i % 3) * 120} c 60 80 -20 160 40 240 s 30 180 -20 260 s 50 160 10 300`}
        stroke="#cbc3b6"
        strokeWidth={4}
        fill="none"
      />
    ))}
    {/* arches with gold trim */}
    {[-120, 520, 1160, 1800].map((x) => (
      <g key={x}>
        <path d={`M ${x} 860 L ${x} 300 A 200 200 0 0 1 ${x + 400} 300 L ${x + 400} 860 Z`} fill="#e2d7c4" />
        <path d={`M ${x} 860 L ${x} 300 A 200 200 0 0 1 ${x + 400} 300 L ${x + 400} 860`} stroke={C.gold} strokeWidth={14} fill="none" />
      </g>
    ))}
    <rect x={X0} y={-120} width={W} height={36} fill={C.gold} />
    <Floor a="#ede6da" b="#d7cbb6" />
    {/* straw, just for the joke that it is still a stable */}
    {Array.from({ length: 22 }).map((_, i) => (
      <path key={i} d={`M ${200 + i * 70} ${960 + (i % 4) * 14} l 40 -10`} stroke="#e1b84c" strokeWidth={6} strokeLinecap="round" />
    ))}
  </g>
);

export const Manger: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -200 -200 L 200 -200 L 170 -40 L -170 -40 Z" fill="#fff6e0" stroke="#d9c79c" strokeWidth={8} />
    <path d="M -150 -150 Q 0 -120 150 -150" stroke="#e9d9b0" strokeWidth={10} fill="none" />
    <rect x={-150} y={-40} width={40} height={40} fill="#fff6e0" />
    <rect x={110} y={-40} width={40} height={40} fill="#fff6e0" />
    {Array.from({ length: 9 }).map((_, i) => (
      <ellipse key={i} cx={-140 + i * 35} cy={-205} rx={22} ry={10} fill="#d9b25a" />
    ))}
  </g>
);

export const DiningRoom: React.FC = () => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill="#b6452f" />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-300 + i * 340} y={80} width={260} height={420} fill="#c8603f" stroke="#e7c27a" strokeWidth={8} />
    ))}
    <rect x={X0} y={560} width={W} height={340} fill="#2f2a26" />
    <rect x={X0} y={556} width={W} height={12} fill="#e7c27a" />
    <Floor a="#d8c7a6" b="#b79c74" />
  </g>
);

export const Table: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-330} y={-40} width={660} height={40} rx={10} fill="#7a4a24" />
    <rect x={-290} y={0} width={30} height={200} fill="#5e381b" />
    <rect x={260} y={0} width={30} height={200} fill="#5e381b" />
    {/* grapes, bread, amphora, bowl of oats */}
    {Array.from({ length: 9 }).map((_, i) => (
      <circle key={i} cx={-220 + (i % 3) * 22 + (i > 5 ? 11 : 0)} cy={-60 - Math.floor(i / 3) * -18 - 30} r={14} fill="#6b2d8c" />
    ))}
    <ellipse cx={-60} cy={-64} rx={70} ry={30} fill="#d89a4a" />
    <path d="M 120 -44 L 100 -150 Q 140 -190 180 -150 L 160 -44 Z" fill="#b5603a" />
    <ellipse cx={250} cy={-56} rx={60} ry={20} fill="#fff6e0" />
    <ellipse cx={250} cy={-66} rx={50} ry={12} fill="#e1b84c" />
  </g>
);

export const Street: React.FC = () => (
  <g>
    <rect x={X0} y={Y0} width={W} height={FLOOR - Y0} fill={C.sky} />
    {[
      [-400, 120, "#d9a066"],
      [140, 40, "#e0b47a"],
      [700, 160, "#c98b5b"],
      [1240, 60, "#deb07a"],
      [1780, 140, "#d39a68"],
    ].map(([x, top, fill], i) => (
      <g key={i}>
        <rect x={x as number} y={top as number} width={540} height={FLOOR - (top as number)} fill={fill as string} />
        <path d={`M ${(x as number) - 20} ${top} L ${(x as number) + 270} ${(top as number) - 90} L ${(x as number) + 560} ${top} Z`} fill="#a8432b" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={(x as number) + 70 + c * 150} y={(top as number) + 80 + r * 170} width={80} height={100} fill="#5a3a22" opacity={0.8} />
          )),
        )}
      </g>
    ))}
    {/* market awning behind the merchant */}
    <path d="M 1060 600 L 1520 600 L 1560 680 L 1020 680 Z" fill="#2f7a6a" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={1030 + i * 90} y={600} width={45} height={80} fill="#f2e6c8" opacity={0.7} />
    ))}
    <rect x={X0} y={FLOOR} width={W} height={1500 - FLOOR} fill="#9a8a78" />
    {Array.from({ length: 30 }).map((_, i) =>
      Array.from({ length: 6 }).map((__, j) => (
        <rect key={`${i}-${j}`} x={X0 + i * 92 + (j % 2) * 46} y={FLOOR + 10 + j * 70} width={84} height={60} rx={12} fill="#8a7a68" />
      )),
    )}
  </g>
);

export const Studio: React.FC<{ from?: string; to?: string }> = ({ from = "#7b3fa8", to = "#2a0f3d" }) => (
  <g>
    <defs>
      <radialGradient id="studio" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </radialGradient>
    </defs>
    <rect x={X0} y={Y0} width={W} height={1900} fill="url(#studio)" />
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return (
        <path
          key={i}
          d={`M 960 500 L ${960 + Math.cos(a) * 2400} ${500 + Math.sin(a) * 2400} L ${960 + Math.cos(a + 0.12) * 2400} ${500 + Math.sin(a + 0.12) * 2400} Z`}
          fill="#ffffff"
          opacity={0.05}
        />
      );
    })}
  </g>
);

export const Sunset: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="sunsetSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#3b2a6b" />
        <stop offset="45%" stopColor="#e2725b" />
        <stop offset="80%" stopColor="#f6c56b" />
      </linearGradient>
    </defs>
    <rect x={X0} y={Y0} width={W} height={1300} fill="url(#sunsetSky)" />
    <circle cx={960} cy={720} r={170} fill="#ffe08a" />
    <path d="M -400 760 Q 300 640 960 740 T 2320 720 L 2320 1500 L -400 1500 Z" fill="#7a4b3a" />
    <path d="M -400 840 Q 500 760 960 830 T 2320 820 L 2320 1500 L -400 1500 Z" fill="#5b3428" />
    {/* cypress trees */}
    {[200, 330, 1560, 1700].map((x, i) => (
      <path key={x} d={`M ${x} ${830 - (i % 2) * 20} C ${x - 40} 700 ${x - 10} 520 ${x} 470 C ${x + 10} 520 ${x + 40} 700 ${x} ${830 - (i % 2) * 20} Z`} fill="#2a1d1a" />
    ))}
    {/* the road into the sunset */}
    <path d="M 860 760 L 1060 760 L 1500 1500 L 420 1500 Z" fill="#c08a5a" opacity={0.65} />
  </g>
);
