import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, C, MONO, SANS } from "../brand";
import { COVER } from "./content";

// Превью ролика про кросс-продажи: 1080×1920, важное — в центральной зоне 3:4.
export const CrossCover: React.FC = () => (
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
        fontSize: 34,
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
        fontSize: 100,
        lineHeight: 1.1,
        letterSpacing: "-0.04em",
        color: C.ink,
      }}
    >
      <div>{COVER.title1}</div>
      <div>{COVER.title2}</div>
      <div>
        <span style={{ background: C.tag, padding: "0 16px" }}>
          {COVER.marked}
        </span>
      </div>
      <div style={{ fontSize: 76, marginTop: 6 }}>{COVER.title3}</div>
    </div>
    {/* чек с плюсом */}
    <div
      style={{
        position: "absolute",
        top: 930,
        left: 170,
        width: 740,
        background: "#fff",
        border: `6px solid ${C.ink}`,
        boxShadow: `14px 14px 0 ${C.ink}`,
        padding: "30px 40px",
        transform: "rotate(-2deg)",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 44,
        color: C.ink,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>☕ КОФЕ</span>
        <span>190,00</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
          background: C.tag,
          padding: "6px 10px",
          marginLeft: -10,
          marginRight: -10,
        }}
      >
        <span>🥐 КРУАССАН</span>
        <span>+150,00</span>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 1260,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: "rotate(-4deg)",
          background: C.green,
          color: "#fff",
          border: `6px solid ${C.ink}`,
          boxShadow: `10px 10px 0 ${C.ink}`,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 80,
          padding: "4px 40px 10px",
        }}
      >
        +1 в чеке
      </div>
    </div>
  </AbsoluteFill>
);
