import React from "react";
import { useCurrentFrame } from "remotion";
import { blink } from "../anim";
import { C } from "../format";

type Expression = "smirk" | "neutral" | "wink" | "shock" | "worried" | "awkward" | "stern" | "happy";

const Eye: React.FC<{ x: number; y: number; r?: number; closed: number; look?: [number, number] }> = ({
  x,
  y,
  r = 14,
  closed,
  look = [0, 0],
}) => {
  if (closed > 0.85) {
    return <path d={`M ${x - r} ${y} Q ${x} ${y + r * 0.6} ${x + r} ${y}`} stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />;
  }
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * (1 - closed * 0.9)} fill="#fff" stroke={C.ink} strokeWidth={3} />
      <circle cx={x + look[0]} cy={y + look[1]} r={r * 0.5 * (1 - closed * 0.6)} fill={C.ink} />
    </g>
  );
};

const Mouth: React.FC<{ expr: Expression; y: number; w?: number }> = ({ expr, y, w = 30 }) => {
  const s = { stroke: "#7a3b2a", strokeWidth: 6, fill: "none", strokeLinecap: "round" as const };
  switch (expr) {
    case "smirk":
    case "wink":
      return <path d={`M ${-w} ${y + 4} Q ${0} ${y + 14} ${w + 4} ${y - 10}`} {...s} />;
    case "happy":
      return <path d={`M ${-w} ${y - 4} Q 0 ${y + 22} ${w} ${y - 4}`} {...s} />;
    case "shock":
      return <ellipse cx={0} cy={y + 4} rx={w * 0.45} ry={w * 0.6} fill="#5a1f1a" />;
    case "worried":
      return <path d={`M ${-w} ${y + 6} Q ${-w / 2} ${y - 4} 0 ${y + 4} Q ${w / 2} ${y + 12} ${w} ${y + 2}`} {...s} />;
    case "awkward":
      return <path d={`M ${-w} ${y + 2} L ${w} ${y + 2}`} {...s} />;
    case "stern":
      return <path d={`M ${-w} ${y + 6} Q 0 ${y - 4} ${w} ${y + 6}`} {...s} />;
    default:
      return <path d={`M ${-w} ${y} Q 0 ${y + 8} ${w} ${y}`} {...s} />;
  }
};

const Laurel: React.FC<{ cy: number; r: number }> = ({ cy, r }) => (
  <g>
    {Array.from({ length: 13 }).map((_, i) => {
      const side = i < 6 ? -1 : i > 6 ? 1 : 0;
      if (side === 0) return null;
      const k = side < 0 ? i : 12 - i;
      const a = Math.PI + side * (0.25 + k * 0.2) * -1;
      const ang = side < 0 ? Math.PI + 0.15 + k * 0.21 : -0.15 - k * 0.21;
      const x = Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r * 0.62;
      const rot = (ang * 180) / Math.PI + 90 + side * 25 + a * 0;
      return (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={20}
          ry={9}
          fill={k % 2 ? "#6f9f3f" : "#4f7f2c"}
          stroke="#2f5418"
          strokeWidth={2}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      );
    })}
  </g>
);

export const Caligula: React.FC<{
  x: number;
  y: number;
  scale?: number;
  expr?: Expression;
  brow?: number;
  look?: [number, number];
  arm?: "rest" | "point" | "chin";
  wreath?: boolean;
  blinkOffset?: number;
}> = ({ x, y, scale = 1, expr = "smirk", brow = 0, look = [0, 2], arm = "rest", wreath = true, blinkOffset = 0 }) => {
  const f = useCurrentFrame();
  const b = blink(f, 89, blinkOffset);
  const breathe = Math.sin(f / 18) * 3;
  const browY = -404 - brow * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* lower body, seated */}
      <path d="M -126 0 L 126 0 L 150 236 L -150 236 Z" fill={C.purple} />
      <path d="M -150 236 L 150 236 L 147 212 L -147 212 Z" fill={C.gold} />
      <ellipse cx={-62} cy={246} rx={44} ry={18} fill="#6b4226" />
      <ellipse cx={62} cy={246} rx={44} ry={18} fill="#6b4226" />
      <g transform={`translate(0 ${breathe * 0.3})`}>
        {/* torso */}
        <path d="M -126 6 L -108 -232 Q 0 -268 108 -232 L 126 6 Z" fill={C.purple} />
        <path d="M -48 -250 L 0 -176 L 48 -250 Z" fill={C.toga} />
        <path d="M -104 -238 L 118 -6" stroke={C.gold} strokeWidth={18} />
        <path d="M -104 -238 L 118 -6" stroke={C.goldDark} strokeWidth={4} strokeDasharray="10 14" />
        {/* arms */}
        <path d="M -108 -226 C -150 -170 -168 -90 -150 -30 L -112 -24 C -120 -90 -110 -150 -86 -196 Z" fill={C.purpleDark} />
        <circle cx={-134} cy={-22} r={24} fill={C.skin} />
        {arm === "rest" && (
          <g>
            <path d="M 108 -226 C 150 -170 168 -90 150 -30 L 112 -24 C 120 -90 110 -150 86 -196 Z" fill={C.purpleDark} />
            <circle cx={134} cy={-22} r={24} fill={C.skin} />
          </g>
        )}
        {arm === "point" && (
          <g>
            <path d="M 104 -226 C 170 -200 230 -190 290 -214 L 296 -176 C 236 -150 170 -150 92 -180 Z" fill={C.purpleDark} />
            <circle cx={306} cy={-196} r={24} fill={C.skin} />
            <rect x={318} y={-206} width={42} height={14} rx={7} fill={C.skin} />
          </g>
        )}
        {arm === "chin" && (
          <g>
            <path d="M 104 -226 C 150 -170 140 -110 96 -100 L 70 -128 C 96 -140 104 -170 86 -196 Z" fill={C.purpleDark} />
            <circle cx={60} cy={-268} r={22} fill={C.skin} />
            <path d="M 96 -100 C 70 -150 62 -200 60 -260" stroke={C.purpleDark} strokeWidth={34} strokeLinecap="round" />
          </g>
        )}
        {/* neck and head */}
        <rect x={-28} y={-292} width={56} height={64} fill={C.skinShade} />
        <circle cx={-84} cy={-366} r={19} fill={C.skin} />
        <circle cx={84} cy={-366} r={19} fill={C.skin} />
        <ellipse cx={0} cy={-372} rx={84} ry={96} fill={C.skin} />
        <ellipse cx={-46} cy={-336} rx={16} ry={9} fill="#e89c87" opacity={0.5} />
        <ellipse cx={46} cy={-336} rx={16} ry={9} fill="#e89c87" opacity={0.5} />
        {/* hair with a short fringe */}
        <path
          d="M -90 -380 C -98 -472 -40 -494 0 -492 C 52 -494 100 -464 90 -380 C 84 -418 64 -436 46 -430 L 34 -448 L 18 -428 L 2 -450 L -14 -428 L -30 -450 L -44 -428 C -62 -440 -82 -420 -90 -380 Z"
          fill="#4a2e1a"
        />
        {wreath && <Laurel cy={-420} r={92} />}
        {/* brows */}
        <path d={`M -54 ${browY + 4} Q -34 ${browY - 8} -14 ${browY}`} stroke="#3a2414" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path
          d={`M 14 ${browY - (expr === "smirk" ? 8 : 0)} Q 34 ${browY - 16} 54 ${browY - 2}`}
          stroke="#3a2414"
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
        />
        <Eye x={-33} y={-372} closed={expr === "wink" ? 0 : Math.max(b, expr === "smirk" ? 0.25 : 0)} look={look} />
        <Eye x={33} y={-372} closed={expr === "wink" ? 1 : Math.max(b, expr === "smirk" ? 0.25 : 0)} look={look} />
        <path d="M 2 -362 Q -10 -334 6 -328" stroke={C.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(0 -310)">
          <Mouth expr={expr} y={0} w={28} />
        </g>
      </g>
    </g>
  );
};

const SENATORS = [
  { skin: "#efc6a0", hair: "#e8e8e8", beard: false, bald: true },
  { skin: "#d9a77c", hair: "#9a9a9a", beard: true, bald: false },
  { skin: "#f2cfae", hair: "#c9c9c9", beard: false, bald: false },
  { skin: "#c68f65", hair: "#e0e0e0", beard: true, bald: true },
];

export const Senator: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  expr?: Expression;
  nod?: number;
  sweat?: boolean;
  // 0..1: scroll held in hands, falling out at 1.
  scrollDrop?: number;
  holdScroll?: boolean;
  look?: [number, number];
  flip?: boolean;
}> = ({ x, y, scale = 1, variant = 0, expr = "neutral", nod = 0, sweat = false, scrollDrop = 0, holdScroll = false, look = [0, 2], flip = false }) => {
  const f = useCurrentFrame();
  const v = SENATORS[variant % SENATORS.length];
  const b = blink(f, 83 + variant * 11, variant * 23);
  const drop = Math.min(1, Math.max(0, scrollDrop));
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* body */}
      <path d="M -112 0 L -96 -172 Q 0 -204 96 -172 L 112 0 Z" fill={C.toga} />
      <rect x={-13} y={-186} width={26} height={186} fill="#7b3a8f" />
      <path d="M -96 -172 C -40 -120 40 -60 108 -20" stroke={C.togaShade} strokeWidth={22} fill="none" />
      <path d="M -96 -172 C -40 -120 40 -60 108 -20" stroke={C.toga} strokeWidth={10} fill="none" />
      {holdScroll && (
        <g transform={`translate(0 ${drop * 260}) rotate(${drop * 70})`} opacity={1 - Math.max(0, drop - 0.85) * 6}>
          <rect x={-70} y={-96} width={140} height={34} rx={17} fill="#f3e2b5" stroke="#b08a4a" strokeWidth={4} />
          <circle cx={-70} cy={-79} r={18} fill="#c9a35c" />
          <circle cx={70} cy={-79} r={18} fill="#c9a35c" />
        </g>
      )}
      {holdScroll && (
        <g>
          <circle cx={-64 - drop * 18} cy={-78 + drop * 8} r={20} fill={v.skin} />
          <circle cx={64 + drop * 18} cy={-78 + drop * 8} r={20} fill={v.skin} />
        </g>
      )}
      {/* head, nodding around the neck */}
      <g transform={`rotate(${nod * 0.4} 0 -196) translate(0 ${nod * 0.9})`}>
        <rect x={-22} y={-214} width={44} height={36} fill={v.skin} />
        <circle cx={-62} cy={-262} r={15} fill={v.skin} />
        <circle cx={62} cy={-262} r={15} fill={v.skin} />
        <ellipse cx={0} cy={-268} rx={64} ry={74} fill={v.skin} />
        {v.bald ? (
          <g>
            <ellipse cx={-56} cy={-292} rx={18} ry={26} fill={v.hair} />
            <ellipse cx={56} cy={-292} rx={18} ry={26} fill={v.hair} />
            <ellipse cx={-14} cy={-318} rx={20} ry={8} fill="#fff" opacity={0.35} />
          </g>
        ) : (
          <path d="M -66 -276 C -72 -350 -20 -352 0 -350 C 30 -352 72 -340 66 -276 C 56 -310 30 -318 0 -314 C -30 -318 -56 -310 -66 -276 Z" fill={v.hair} />
        )}
        {v.beard && <path d="M -56 -250 C -56 -190 -20 -176 0 -176 C 20 -176 56 -190 56 -250 C 40 -214 -40 -214 -56 -250 Z" fill={v.hair} />}
        {/* bushy brows, raised when worried */}
        {(() => {
          const lift = expr === "worried" || expr === "shock" ? 8 : 0;
          const tilt = expr === "worried" ? 8 : 0;
          return (
            <g>
              <path d={`M -42 ${-296 - lift + tilt} L -12 ${-300 - lift - tilt}`} stroke={v.hair} strokeWidth={10} strokeLinecap="round" />
              <path d={`M 12 ${-300 - lift - tilt} L 42 ${-296 - lift + tilt}`} stroke={v.hair} strokeWidth={10} strokeLinecap="round" />
            </g>
          );
        })()}
        <Eye x={-26} y={-276} r={11} closed={b} look={look} />
        <Eye x={26} y={-276} r={11} closed={b} look={look} />
        <path d="M 0 -268 Q -10 -246 4 -242" stroke="#00000033" strokeWidth={5} fill="none" strokeLinecap="round" />
        <g transform="translate(0 -222)">
          <Mouth expr={expr} y={0} w={20} />
        </g>
        {sweat &&
          [0, 1].map((i) => {
            const t = ((f + i * 17) % 34) / 34;
            const sx = i ? 58 : -60;
            return (
              <path
                key={i}
                d={`M ${sx} ${-318 + t * 70} q -9 16 0 22 q 9 -6 0 -22 Z`}
                fill="#6cc4ff"
                stroke="#2b7fc0"
                strokeWidth={2}
                opacity={1 - t}
              />
            );
          })}
      </g>
    </g>
  );
};

export const Legionary: React.FC<{ x: number; y: number; scale?: number; shush?: number; flip?: boolean }> = ({
  x,
  y,
  scale = 1,
  shush = 0,
  flip = false,
}) => {
  const f = useCurrentFrame();
  const b = blink(f, 77, 5);
  // shush 0..1 lifts the arm to the lips
  const ax = 40 - shush * 30;
  const ay = -250 - shush * 150;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={4} rx={120} ry={16} fill="#000" opacity={0.18} />
      {/* legs with caligae */}
      <rect x={-48} y={-170} width={34} height={160} fill={C.skin} />
      <rect x={14} y={-170} width={34} height={160} fill={C.skin} />
      {[-48, 14].map((lx) => (
        <g key={lx}>
          <rect x={lx - 4} y={-56} width={42} height={56} rx={8} fill="#6b4226" />
          <path d={`M ${lx} -48 L ${lx + 34} -36 M ${lx} -30 L ${lx + 34} -18`} stroke="#3b2414" strokeWidth={4} />
        </g>
      ))}
      {/* tunic and armour */}
      <path d="M -92 -150 L 92 -150 L 104 -230 L -104 -230 Z" fill={C.red} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={-84 + i * 25} y={-190} width={18} height={54} rx={3} fill="#7a4a24" />
      ))}
      <path d="M -100 -230 L -88 -400 Q 0 -432 88 -400 L 100 -230 Z" fill="#9aa3ab" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M -100 ${-262 - i * 36} Q 0 ${-246 - i * 36} 100 ${-262 - i * 36}`} stroke="#6e767e" strokeWidth={6} fill="none" />
      ))}
      {/* shield arm */}
      <rect x={-200} y={-380} width={110} height={220} rx={16} fill={C.red} stroke={C.gold} strokeWidth={8} />
      <circle cx={-145} cy={-270} r={22} fill={C.gold} />
      {/* shushing arm */}
      <path d={`M 84 -390 Q 130 -300 ${ax + 30} ${ay + 40}`} stroke={C.red} strokeWidth={42} strokeLinecap="round" fill="none" />
      <circle cx={ax + 20} cy={ay + 10} r={24} fill={C.skin} />
      {shush > 0.5 && <rect x={ax + 8} y={ay - 46} width={16} height={50} rx={8} fill={C.skin} />}
      {/* head with helmet */}
      <rect x={-24} y={-446} width={48} height={40} fill={C.skinShade} />
      <ellipse cx={0} cy={-500} rx={66} ry={74} fill={C.skin} />
      <path d="M -76 -506 C -80 -600 80 -600 76 -506 L 60 -520 L -60 -520 Z" fill="#b8bfc6" />
      <path d="M -76 -506 L -66 -440 L -44 -446 L -52 -506 Z" fill="#9aa3ab" />
      <path d="M 76 -506 L 66 -440 L 44 -446 L 52 -506 Z" fill="#9aa3ab" />
      <path d="M -60 -580 Q 0 -650 60 -580 L 50 -572 Q 0 -620 -50 -572 Z" fill={C.red} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={-50 + i * 12} y={-640 + Math.abs(i - 4) * 9} width={8} height={50} fill={C.red} />
      ))}
      <path d="M -40 -540 L -14 -530 M 40 -540 L 14 -530" stroke="#3a2414" strokeWidth={8} strokeLinecap="round" />
      <Eye x={-24} y={-508} r={10} closed={b} look={[3, 1]} />
      <Eye x={24} y={-508} r={10} closed={b} look={[3, 1]} />
      <g transform="translate(0 -462)">
        {shush > 0.5 ? <ellipse cx={0} cy={2} rx={10} ry={8} fill="#7a3b2a" /> : <Mouth expr="stern" y={0} w={18} />}
      </g>
    </g>
  );
};

export const Merchant: React.FC<{ x: number; y: number; scale?: number; clamp?: number; flip?: boolean }> = ({
  x,
  y,
  scale = 1,
  clamp = 0,
  flip = false,
}) => {
  const f = useCurrentFrame();
  const b = blink(f, 91, 31);
  const squawk = clamp < 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx={0} cy={4} rx={120} ry={16} fill="#000" opacity={0.18} />
      <rect x={-46} y={-160} width={34} height={150} fill={C.skin} />
      <rect x={12} y={-160} width={34} height={150} fill={C.skin} />
      <ellipse cx={-30} cy={-6} rx={30} ry={12} fill="#6b4226" />
      <ellipse cx={30} cy={-6} rx={30} ry={12} fill="#6b4226" />
      <path d="M -110 -150 L 110 -150 L 92 -420 Q 0 -446 -92 -420 Z" fill="#a8743f" />
      <path d="M -110 -150 L 110 -150" stroke="#7a5228" strokeWidth={10} />
      <rect x={-96} y={-280} width={192} height={18} fill="#7a5228" />
      {/* rooster in his arms */}
      <g transform="translate(10 -300)">
        <path d="M -110 -20 C -170 -80 -160 -150 -120 -170 C -130 -120 -110 -80 -80 -50 Z" fill="#1f4d3a" />
        <path d="M -100 -10 C -150 -40 -170 -110 -150 -140 C -140 -100 -110 -60 -80 -40 Z" fill="#2d6b4f" />
        <ellipse cx={0} cy={0} rx={96} ry={66} fill="#c4492a" />
        <ellipse cx={-10} cy={10} rx={60} ry={38} fill="#e0763c" />
        <path d="M 50 -40 L 70 -120 L 110 -110 L 100 -30 Z" fill="#d0602f" />
        <circle cx={92} cy={-130} r={36} fill="#d0602f" />
        <path d="M 70 -164 q 8 -26 18 -4 q 8 -28 18 -2 q 10 -24 16 6 Z" fill="#e2231a" />
        <path d="M 96 -108 q 6 24 -6 30 q -12 -6 -4 -30 Z" fill="#e2231a" />
        <circle cx={100} cy={-138} r={10} fill="#fff" />
        <circle cx={103} cy={-138} r={5} fill={C.ink} />
        {squawk ? (
          <g>
            <path d="M 124 -136 L 166 -150 L 128 -126 Z" fill="#f2b632" />
            <path d="M 124 -124 L 162 -108 L 126 -118 Z" fill="#f2b632" />
          </g>
        ) : (
          <path d="M 124 -132 L 160 -128 L 124 -120 Z" fill="#f2b632" />
        )}
        {/* merchant's hands: one on the body, one clamping the beak */}
        <circle cx={-40} cy={40} r={26} fill={C.skin} />
        <circle cx={60 + clamp * 84} cy={-50 - clamp * 78} r={26} fill={C.skin} />
        <path d={`M 90 -60 L ${60 + clamp * 84} ${-50 - clamp * 78}`} stroke="#a8743f" strokeWidth={30} strokeLinecap="round" />
      </g>
      {/* head */}
      <rect x={-22} y={-470} width={44} height={40} fill={C.skinShade} />
      <ellipse cx={0} cy={-520} rx={64} ry={70} fill={C.skin} />
      <path d="M -64 -540 C -60 -600 60 -600 64 -540 C 40 -570 -40 -570 -64 -540 Z" fill="#5a3a22" />
      <rect x={-66} y={-560} width={132} height={14} rx={7} fill="#3a6aa8" />
      <path d="M -40 -476 Q -20 -462 0 -476 Q 20 -462 40 -476" stroke="#3a2414" strokeWidth={10} fill="none" strokeLinecap="round" />
      <Eye x={-24} y={-526} r={clamp > 0.5 ? 15 : 11} closed={b} look={[-4, -2]} />
      <Eye x={24} y={-526} r={clamp > 0.5 ? 15 : 11} closed={b} look={[-4, -2]} />
      <g transform="translate(0 -458)">
        <Mouth expr={clamp > 0.5 ? "worried" : "neutral"} y={0} w={16} />
      </g>
    </g>
  );
};

// Little Gaius in soldier's boots (caligae).
export const Boy: React.FC<{ x: number; y: number; scale?: number; step?: number }> = ({ x, y, scale = 1, step = 0 }) => {
  const f = useCurrentFrame();
  const b = blink(f, 70, 12);
  const s = Math.sin(step) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={4} rx={90} ry={12} fill="#000" opacity={0.2} />
      {[-30, 30].map((lx, i) => (
        <g key={lx} transform={`rotate(${i ? s : -s} ${lx} -110)`}>
          <rect x={lx - 13} y={-110} width={26} height={70} fill={C.skin} />
          <rect x={lx - 30} y={-62} width={60} height={62} rx={12} fill="#6b4226" />
          <path d={`M ${lx - 26} -52 L ${lx + 26} -40 M ${lx - 26} -34 L ${lx + 26} -22`} stroke="#3b2414" strokeWidth={5} />
        </g>
      ))}
      <path d="M -64 -100 L 64 -100 L 54 -250 Q 0 -266 -54 -250 Z" fill={C.red} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={-56 + i * 24} y={-128} width={16} height={34} rx={3} fill="#7a4a24" />
      ))}
      <ellipse cx={0} cy={-322} rx={70} ry={74} fill={C.skin} />
      <path d="M -72 -330 C -80 -410 80 -410 72 -330 C 60 -372 -60 -372 -72 -330 Z" fill="#6b4226" />
      {[-56, -30, -4, 22, 48].map((cx) => (
        <circle key={cx} cx={cx} cy={-380} r={16} fill="#6b4226" />
      ))}
      <ellipse cx={-38} cy={-300} rx={13} ry={7} fill="#e89c87" opacity={0.6} />
      <ellipse cx={38} cy={-300} rx={13} ry={7} fill="#e89c87" opacity={0.6} />
      <Eye x={-24} y={-324} r={13} closed={b} look={[0, 3]} />
      <Eye x={24} y={-324} r={13} closed={b} look={[0, 3]} />
      <g transform="translate(0 -290)">
        <Mouth expr="happy" y={0} w={18} />
      </g>
    </g>
  );
};

// Soldier seen from the knees down: a forest of legs around the boy.
export const SoldierLegs: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M -110 -560 L 110 -560 L 120 -380 L -120 -380 Z" fill={C.red} />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-104 + i * 27} y={-420} width={20} height={70} rx={3} fill="#7a4a24" />
    ))}
    {[-50, 50].map((lx) => (
      <g key={lx}>
        <rect x={lx - 22} y={-380} width={44} height={330} fill={C.skinShade} />
        <rect x={lx - 34} y={-90} width={72} height={90} rx={12} fill="#5a3820" />
        <path d={`M ${lx - 30} -76 L ${lx + 34} -60 M ${lx - 30} -50 L ${lx + 34} -34`} stroke="#2e1c10" strokeWidth={6} />
      </g>
    ))}
  </g>
);

export const Praetorian: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({ x, y, scale = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} fill="#160f0b">
    <path d="M -90 0 L -70 -380 Q 0 -410 70 -380 L 90 0 Z" />
    <ellipse cx={0} cy={-450} rx={62} ry={70} />
    <path d="M -70 -470 C -70 -560 70 -560 70 -470 Z" />
    <path d="M -50 -540 Q 0 -620 50 -540 Z" />
    <rect x={110} y={-640} width={14} height={640} />
    <path d="M 104 -640 L 117 -700 L 130 -640 Z" />
    <rect x={-180} y={-330} width={100} height={210} rx={14} />
  </g>
);
