import React from "react";
import { AbsoluteFill } from "remotion";
import { F, FlatCroissant } from "../Refs/Refs";
import { Bubble, Cafe, Person } from "../Refs/Refs2";

// Обложка ролика про кросс-продажи в иллюстрированном стиле.
const SANS = "Inter, sans-serif";

export const Cross2Cover: React.FC = () => (
  <AbsoluteFill style={{ background: F.bg }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Cafe />
      <rect y={1140} width={1080} height={420} fill={F.wall} />
      <Person
        x={300}
        y={1060}
        s={1.25}
        skin={F.skin2}
        hair={F.hair}
        hairStyle="bun"
        top="#F7F3EE"
        apron={F.teal}
        pose="relaxed"
        mood="happy"
      />
      <rect x={0} y={1550} width={1080} height={40} fill={F.wood} />
      <rect x={0} y={1590} width={1080} height={330} fill={F.navy} />
      <g transform="translate(830 1480)">
        <path d="M -60 -50 L 60 -50 L 48 72 L -48 72 Z" fill="#fff" />
        <rect x={-60} y={-14} width={120} height={36} fill={F.coral} />
      </g>
      <FlatCroissant x={590} y={1530} s={1.1} />
      <text
        x={710}
        y={1500}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={90}
        fill={F.coral}
      >
        +
      </text>
      <Bubble
        x={500}
        y={800}
        w={520}
        lines={["Круассан", "или маффин?"]}
        tail="left"
      />
    </svg>
    <div style={{ position: "absolute", top: 110, left: 60, right: 60 }}>
      <div
        style={{
          display: "inline-block",
          background: F.mustard,
          color: F.navy,
          borderRadius: 999,
          padding: "10px 30px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 40,
        }}
      >
        5 правил · кросс-продажи
      </div>
      <div
        style={{
          marginTop: 26,
          background: "#fff",
          borderRadius: 44,
          padding: "34px 40px",
          boxShadow: "0 24px 50px rgba(36,59,85,0.2)",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1.02,
          letterSpacing: "-0.035em",
          color: F.navy,
        }}
      >
        <span style={{ color: F.coral }}>Cross-sell</span>
        <br />
        на практике
      </div>
    </div>
  </AbsoluteFill>
);
