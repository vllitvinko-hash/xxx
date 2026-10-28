import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pop, ramp } from "../anim";
import { C, FONT_DISPLAY, FONT_TEXT, useFormat } from "../format";

type Slot = "top" | "center" | "bottom";

// Vertical: the top band above the stage holds titles; bottom is left to subtitles.
const slotStyle = (slot: Slot, vertical: boolean): React.CSSProperties => {
  if (slot === "top") return { top: vertical ? 150 : 60 };
  if (slot === "bottom") return { bottom: vertical ? 470 : 70 };
  return { top: "50%", transform: "translateY(-50%)" };
};

// Big meme caption, 3-5 words, pops in with a slight tilt.
export const Title: React.FC<{
  text: string;
  from: number;
  to?: number;
  slot?: Slot;
  color?: string;
  size?: number;
  tilt?: number;
}> = ({ text, from, to = Infinity, slot = "top", color = "#fff", size = 96, tilt = -3 }) => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  if (f < from || f >= to) return null;
  const p = pop(f, from);
  const out = Number.isFinite(to) ? ramp(f, to - 6, to, 1, 0) : 1;
  const fontSize = vertical ? size * 0.92 : size;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          textAlign: "center",
          ...slotStyle(slot, vertical),
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: FONT_DISPLAY,
            fontSize,
            lineHeight: 1.05,
            color,
            WebkitTextStroke: `${Math.round(fontSize / 9)}px ${C.ink}`,
            paintOrder: "stroke fill",
            textShadow: `0 ${fontSize / 12}px 0 ${C.ink}`,
            transform: `scale(${p * out}) rotate(${tilt * p}deg)`,
            letterSpacing: 1,
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Small caption chip, e.g. a source note.
export const Chip: React.FC<{ text: string; from: number; to?: number; slot?: Slot }> = ({
  text,
  from,
  to = Infinity,
  slot = "bottom",
}) => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  if (f < from || f >= to) return null;
  const o = ramp(f, from, from + 8) * (Number.isFinite(to) ? ramp(f, to - 8, to, 1, 0) : 1);
  const style = slot === "bottom" ? { bottom: vertical ? 620 : 40 } : slotStyle(slot, vertical);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", ...style }}>
        <span
          style={{
            display: "inline-block",
            opacity: o,
            fontFamily: FONT_TEXT,
            fontWeight: 600,
            fontSize: vertical ? 34 : 30,
            color: C.ink,
            background: "rgba(255,248,230,0.92)",
            border: `3px solid ${C.ink}`,
            borderRadius: 14,
            padding: "8px 18px",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
