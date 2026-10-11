import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, C, MONO, SANS } from "../brand";
import { SEPIA } from "../Abc/ScenesA";
import { COVER } from "./content";

// Превью ролика про XYZ: 1080×1920, всё важное — в центральной зоне 3:4.
export const XyzCover: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div
      style={{
        position: "absolute",
        top: 250,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: 3,
        color: C.green,
      }}
    >
      {COVER.kicker}
    </div>
    <div
      style={{
        position: "absolute",
        top: 310,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 96,
        lineHeight: 1.12,
        letterSpacing: "-0.035em",
        color: C.ink,
      }}
    >
      <div>{COVER.line1}</div>
      <div>
        <span style={{ background: C.red, color: "#fff", padding: "0 14px" }}>
          {COVER.short}
        </span>
      </div>
      <div style={{ marginTop: 6 }}>{COVER.line2}</div>
      <div>
        <span style={{ background: C.tag, padding: "0 14px" }}>
          {COVER.long}
        </span>
      </div>
    </div>

    {/* слева — пустое место на полке */}
    <div
      style={{
        position: "absolute",
        top: 950,
        left: 90,
        width: 400,
        height: 480,
        background: C.paper,
        border: `5px solid ${C.ink}`,
        transform: "rotate(-3deg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 340,
          height: 16,
          background: C.shelf,
          borderTop: `4px solid ${C.ink}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 110,
          width: 180,
          height: 230,
          border: `6px dashed ${C.red}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 54,
          color: C.red,
        }}
      >
        {COVER.zero}
      </div>
    </div>

    {/* справа — гора коробок */}
    <svg
      width={440}
      height={500}
      style={{ position: "absolute", top: 930, left: 560 }}
    >
      {[
        [10, 340, 140, 140],
        [150, 340, 140, 140],
        [290, 340, 140, 140],
        [60, 200, 140, 140],
        [210, 200, 140, 140],
        [130, 60, 140, 140],
      ].map(([x, y, w, h], i) => (
        <g
          key={i}
          transform={`rotate(${((i * 37) % 9) - 4} ${x + w / 2} ${y + h / 2})`}
        >
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill={SEPIA.light}
            stroke={C.ink}
            strokeWidth={5}
          />
          <line
            x1={x}
            y1={y + h / 2}
            x2={x + w}
            y2={y + h / 2}
            stroke={SEPIA.mid}
            strokeWidth={7}
          />
        </g>
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={i}
          cx={(i * 71) % 440}
          cy={40 + ((i * 47) % 440)}
          r={4}
          fill={C.ink2}
          opacity={0.35}
        />
      ))}
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1450,
        left: 560,
        width: 440,
        textAlign: "center",
      }}
    >
      <span
        style={{
          background: C.ink,
          color: C.tag,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 48,
          padding: "6px 22px",
        }}
      >
        {COVER.years}
      </span>
    </div>
  </AbsoluteFill>
);
