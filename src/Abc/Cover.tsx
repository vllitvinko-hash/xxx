import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, C, MONO, SANS } from "../brand";
import { COVER, SHELF } from "./content";

// Превью ролика про ABC: 1080×1920, всё важное — в центральной зоне 3:4.
export const AbcCover: React.FC = () => {
  const winners = new Set(SHELF.winners.slice(0, 6).map((i) => i % 30));
  return (
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
          top: 340,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: SANS,
          color: C.ink,
          letterSpacing: "-0.04em",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 230, lineHeight: 1 }}>
          <span style={{ background: C.tag, padding: "0 20px" }}>
            {COVER.big[0]}
          </span>
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 70,
            lineHeight: 1.1,
            marginTop: 18,
            letterSpacing: "-0.02em",
          }}
        >
          {COVER.line1}
        </div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 230,
            lineHeight: 1,
            color: C.green,
            marginTop: 10,
          }}
        >
          {COVER.big[1]}
          <span
            style={{ fontSize: 110, color: C.ink, letterSpacing: "-0.02em" }}
          >
            {" "}
            {COVER.line2}
          </span>
        </div>
      </div>

      {/* полка: немногие «кормильцы» подсвечены */}
      <div
        style={{
          position: "absolute",
          top: 1010,
          left: 110,
          width: 860,
          padding: 18,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: 10,
          transform: "rotate(-2deg)",
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => {
          const win = winners.has(i);
          return (
            <div
              key={i}
              style={{
                height: 58,
                background: win ? C.tag : "#E4E2DA",
                border: `3px solid ${win ? C.ink : "#BDB9AD"}`,
                opacity: win ? 1 : 0.55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 26,
              }}
            >
              {win ? "₽" : ""}
            </div>
          );
        })}
      </div>

      {/* «Какие?» */}
      <div
        style={{
          position: "absolute",
          top: 1300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: "rotate(-4deg)",
            background: C.red,
            color: "#fff",
            border: `6px solid ${C.ink}`,
            boxShadow: `12px 12px 0 ${C.ink}`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            padding: "6px 50px 14px",
            letterSpacing: "-0.03em",
          }}
        >
          {COVER.question}
        </div>
      </div>
    </AbsoluteFill>
  );
};
