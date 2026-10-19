import React from "react";
import { AbsoluteFill } from "remotion";
import { Person } from "../Refs/Refs2";
import { DiaperPack, MONO, P, SANS, Shelf, SixPack } from "./Art";

// Заставка горизонтальной версии: полка, на которой пиво стоит рядом с подгузниками, и удивлённый папа.
export const WalmartHCover: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect width={1920} height={1080} fill={P.wall} />
      <rect y={860} width={1920} height={220} fill={P.bg} />
      <Shelf x={1000} y={120} w={860} rows={4} seed={5} dim={0.35} />
      {/* светлое пятно на паре */}
      <ellipse
        cx={1430}
        cy={520}
        rx={360}
        ry={230}
        fill="#FFF3C4"
        opacity={0.8}
      />
      <DiaperPack x={1290} y={500} s={1.5} r={-6} />
      <SixPack x={1580} y={540} s={1.45} r={5} />
      <path
        d="M 1430 300 L 1430 250 M 1350 320 L 1320 285 M 1510 320 L 1540 285"
        stroke={P.coral}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <Person
        x={1000}
        y={560}
        s={0.95}
        skin={P.skin1}
        hair="#6B3B23"
        hairStyle="short"
        top="#5C7CFA"
        pose="point"
        target={[260, 0]}
        mood="happy"
      />
    </svg>
    <div style={{ position: "absolute", left: 110, top: 150, width: 820 }}>
      <div
        style={{
          display: "inline-block",
          background: P.mustard,
          color: P.navy,
          borderRadius: 999,
          padding: "10px 28px",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: "0.08em",
        }}
      >
        ИСТОРИЯ ИЗ РИТЕЙЛА
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.0,
          letterSpacing: "-0.04em",
          color: P.navy,
        }}
      >
        Почему <span style={{ color: P.beerDark }}>пиво</span>
        <br />
        поставили
        <br />
        рядом
        <br />с <span style={{ color: P.diaperDark }}>подгузниками?</span>
      </div>
    </div>
  </AbsoluteFill>
);
