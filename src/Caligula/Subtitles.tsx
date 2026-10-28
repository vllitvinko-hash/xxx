import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT_TEXT, useFormat } from "./format";
import { allLines, sec } from "./timing";

const phrases = allLines();

// Phrase-level subtitles for sound-off viewing.
export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  const current = phrases.find((p, i) => {
    const next = phrases[i + 1];
    const until = next ? Math.min(sec(next.start), sec(p.end + 0.5)) : sec(p.end + 0.8);
    return f >= sec(p.start) && f < until;
  });
  if (!current) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: vertical ? 60 : 160,
          right: vertical ? 60 : 160,
          bottom: vertical ? 250 : 46,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_TEXT,
            fontWeight: 800,
            fontSize: vertical ? 56 : 46,
            lineHeight: 1.25,
            color: "#fff",
            WebkitTextStroke: vertical ? "10px #000" : "8px #000",
            paintOrder: "stroke fill",
          }}
        >
          {current.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
