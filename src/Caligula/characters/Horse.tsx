import React, { useId } from "react";
import { useCurrentFrame } from "remotion";
import { blink } from "../anim";
import { C } from "../format";

const H = {
  coat: "#9a5b2e",
  coatDark: "#7a4320",
  coatLight: "#b06d3b",
  muzzle: "#c48a5c",
  mane: "#2b1a10",
  hoof: "#3b2a1e",
  line: "#2a170b",
};

export type HorseProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  outfit?: "none" | "toga" | "blanket";
  collar?: boolean;
  // 0 = eyes wide open, 1 = closed. The default reads as smug.
  lids?: number;
  // Pupil looks at the viewer or ahead.
  look?: "camera" | "ahead";
  headTilt?: number;
  // When set, legs walk; the value is a phase offset in frames.
  walk?: number;
  mouth?: "smile" | "flat" | "open";
  // Head turned back over the shoulder (for walking away).
  lookBack?: boolean;
  blinkOffset?: number;
};

const Leg: React.FC<{ x: number; angle: number; color: string }> = ({ x, angle, color }) => (
  <g transform={`rotate(${angle} ${x} -250)`}>
    <rect x={x - 21} y={-262} width={42} height={236} rx={18} fill={color} />
    <rect x={x - 25} y={-42} width={50} height={40} rx={9} fill={H.hoof} />
  </g>
);

const Head: React.FC<{
  lids: number;
  look: "camera" | "ahead";
  mouth: "smile" | "flat" | "open";
  clipId: string;
}> = ({ lids, look, mouth, clipId }) => {
  const px = look === "ahead" ? 9 : 2;
  const py = look === "ahead" ? 0 : 5;
  const lidH = 4 + lids * 52;
  return (
    <g>
      {/* ear */}
      <path d="M -48 -40 L -30 -128 L 4 -48 Z" fill={H.coat} />
      <path d="M -38 -52 L -28 -108 L -8 -54 Z" fill={H.coatDark} />
      {/* skull and muzzle */}
      <path d="M 15 -48 L 135 -8 L 150 82 L 0 66 Z" fill={H.coat} />
      <ellipse cx={0} cy={0} rx={76} ry={64} fill={H.coat} />
      <ellipse cx={112} cy={40} rx={80} ry={54} fill={H.muzzle} />
      <ellipse cx={162} cy={26} rx={11} ry={7} fill={H.line} opacity={0.75} transform="rotate(-20 162 26)" />
      {mouth === "open" ? (
        <ellipse cx={150} cy={78} rx={24} ry={14} fill="#5a1f1a" />
      ) : (
        <path
          d={mouth === "smile" ? "M 112 70 Q 145 84 180 62" : "M 115 74 L 178 72"}
          stroke={H.line}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {/* forelock */}
      <path d="M -60 -46 C -30 -96 26 -86 44 -40 C 16 -56 -8 -40 -22 -26 C -30 -40 -44 -44 -60 -46 Z" fill={H.mane} />
      {/* eye */}
      <clipPath id={clipId}>
        <ellipse cx={0} cy={-6} rx={24} ry={27} />
      </clipPath>
      <ellipse cx={0} cy={-6} rx={24} ry={27} fill="#fff" />
      <circle cx={px} cy={-6 + py} r={12} fill={H.line} />
      <circle cx={px + 4} cy={-11 + py} r={4} fill="#fff" />
      <g clipPath={`url(#${clipId})`}>
        <rect x={-30} y={-36} width={60} height={lidH} fill={H.coatLight} />
        <line x1={-30} x2={30} y1={-36 + lidH} y2={-36 + lidH} stroke={H.line} strokeWidth={5} />
      </g>
      <ellipse cx={0} cy={-6} rx={24} ry={27} fill="none" stroke={H.line} strokeWidth={4} />
    </g>
  );
};

export const Horse: React.FC<HorseProps> = ({
  x,
  y,
  scale = 1,
  flip = false,
  outfit = "none",
  collar = false,
  lids = 0.42,
  look = "camera",
  headTilt = 0,
  walk,
  mouth = "smile",
  lookBack = false,
  blinkOffset = 0,
}) => {
  const f = useCurrentFrame();
  const clipId = useId().replace(/:/g, "");
  const walking = walk !== undefined;
  const ph = walking ? (f + (walk ?? 0)) * 0.32 : 0;
  const swing = walking ? Math.sin(ph) * 20 : 0;
  const bob = walking ? Math.abs(Math.sin(ph)) * -10 : Math.sin(f / 22) * 2;
  const tail = Math.sin(f / 14) * 6;
  const closed = Math.max(lids, blink(f, 101, blinkOffset));

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* soft ground shadow */}
      <ellipse cx={0} cy={4} rx={250} ry={22} fill="#000" opacity={0.18} />
      <g transform={`translate(0 ${bob})`}>
        {/* far legs */}
        <Leg x={-150} angle={-swing} color={H.coatDark} />
        <Leg x={122} angle={swing} color={H.coatDark} />
        {/* tail */}
        <path
          d="M -232 -372 C -330 -350 -336 -214 -292 -140 C -276 -206 -262 -286 -214 -330 Z"
          fill={H.mane}
          transform={`rotate(${tail} -232 -372)`}
        />
        {/* body */}
        <circle cx={-168} cy={-334} r={92} fill={H.coat} />
        <circle cx={168} cy={-330} r={88} fill={H.coat} />
        <ellipse cx={0} cy={-314} rx={226} ry={110} fill={H.coat} />
        <ellipse cx={14} cy={-246} rx={180} ry={40} fill={H.coatDark} opacity={0.3} />
        {/* neck */}
        <path d="M 112 -384 C 156 -474 190 -548 228 -604 L 326 -566 C 294 -500 276 -432 262 -330 Z" fill={H.coat} />
        {/* mane */}
        <path
          d="M 244 -616 C 204 -566 166 -474 116 -386 L 84 -398 Q 98 -432 80 -444 Q 122 -472 110 -494 Q 146 -524 134 -546 Q 172 -574 164 -594 Q 204 -620 198 -640 Q 230 -656 244 -616 Z"
          fill={H.mane}
        />
        {/* near legs */}
        <Leg x={-104} angle={swing} color={H.coat} />
        <Leg x={168} angle={-swing} color={H.coat} />

        {outfit === "toga" && (
          <g>
            <path
              d="M -214 -404 C -90 -452 84 -452 214 -398 L 240 -300 C 122 -244 -64 -226 -246 -282 Z"
              fill={C.toga}
            />
            <path d="M -150 -420 C -120 -350 -110 -300 -120 -250" stroke={C.togaShade} strokeWidth={8} fill="none" />
            <path d="M -40 -436 C -20 -360 -16 -300 -30 -236" stroke={C.togaShade} strokeWidth={8} fill="none" />
            <path d="M 80 -430 C 96 -360 96 -310 84 -246" stroke={C.togaShade} strokeWidth={8} fill="none" />
            <path d="M 240 -300 C 122 -244 -64 -226 -246 -282" stroke={C.purple} strokeWidth={22} fill="none" />
            {/* drape over the shoulder */}
            <path d="M 136 -408 L 214 -440 L 258 -336 L 178 -296 Z" fill={C.toga} />
            <path d="M 214 -440 L 258 -336" stroke={C.purple} strokeWidth={14} />
          </g>
        )}
        {outfit === "blanket" && (
          <g>
            <path
              d="M -176 -410 C -60 -436 70 -436 156 -410 L 168 -244 C 62 -228 -82 -228 -190 -250 Z"
              fill={C.purple}
            />
            <path d="M -160 -396 C -60 -418 64 -418 144 -396" stroke={C.purpleDark} strokeWidth={10} fill="none" />
            <path d="M 168 -244 C 62 -228 -82 -228 -190 -250" stroke={C.gold} strokeWidth={14} fill="none" />
            {Array.from({ length: 15 }).map((_, i) => {
              const fx = -182 + i * 24.5;
              const fy = -244 + Math.abs(fx + 10) * -0.05 + 8;
              return <rect key={i} x={fx} y={fy} width={8} height={26} rx={3} fill={C.gold} />;
            })}
            <circle cx={-10} cy={-330} r={30} fill="none" stroke={C.gold} strokeWidth={8} />
            <text x={-10} y={-319} textAnchor="middle" fontSize={30} fontFamily="'Cormorant SC', serif" fontWeight={700} fill={C.gold}>
              I
            </text>
          </g>
        )}
        {collar && (
          <g>
            <path d="M 128 -404 C 170 -428 232 -424 272 -384" stroke={C.gold} strokeWidth={28} fill="none" strokeLinecap="round" />
            {[
              [150, -416, "#d6262b"],
              [184, -424, "#2a9d5b"],
              [218, -420, "#2f6fd6"],
              [250, -404, "#d6262b"],
            ].map(([cx, cy, fill], i) => (
              <g key={i}>
                <circle cx={cx as number} cy={cy as number} r={11} fill={fill as string} />
                <circle cx={(cx as number) - 3} cy={(cy as number) - 4} r={3.5} fill="#fff" opacity={0.8} />
              </g>
            ))}
          </g>
        )}

        {/* head */}
        <g
          transform={
            lookBack
              ? `translate(258 -616) scale(-1 1) rotate(${20 + headTilt})`
              : `translate(296 -606) rotate(${22 + headTilt})`
          }
        >
          <Head lids={closed} look={look} mouth={mouth} clipId={clipId} />
        </g>
      </g>
    </g>
  );
};
