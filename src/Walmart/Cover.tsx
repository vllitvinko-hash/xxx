import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, C, MONO, SANS } from "../brand";
import { Beer } from "../Story/ScenesA";
import { COVER } from "./content";
import { Diapers } from "./Scenes";

// Превью ролика «Пиво и подгузники»: 1080×1920, важное — в центральной зоне 3:4.
export const WalmartCover: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div
      style={{
        position: "absolute",
        top: 260,
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
        top: 320,
        left: 40,
        right: 40,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 112,
        lineHeight: 1.08,
        letterSpacing: "-0.04em",
        color: C.ink,
      }}
    >
      <div>{COVER.line1}</div>
      <div>{COVER.line2}</div>
      <div>
        <span style={{ background: C.tag, padding: "0 16px" }}>
          {COVER.line3}
        </span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 800,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 40,
      }}
    >
      <div style={{ transform: "rotate(-8deg)" }}>
        <Diapers scale={2.1} />
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 160,
          color: C.red,
          alignSelf: "center",
        }}
      >
        +
      </div>
      <div style={{ transform: "rotate(8deg)" }}>
        <Beer scale={1.9} />
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: "rotate(-3deg)",
          background: C.red,
          color: "#fff",
          border: `6px solid ${C.ink}`,
          boxShadow: `12px 12px 0 ${C.ink}`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 54,
          padding: "10px 34px",
        }}
      >
        ЭТО НЕ ШУТКА
      </div>
    </div>
  </AbsoluteFill>
);
