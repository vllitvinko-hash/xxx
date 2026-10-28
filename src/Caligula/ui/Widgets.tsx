import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pop, ramp } from "../anim";
import { C, FONT_DISPLAY, FONT_ROMAN, FONT_TEXT, useFormat } from "../format";

// Game-style character card: "Калигула, 24 года. Уровень: император".
export const GameCard: React.FC<{ from: number; stats: { label: string; value: string; at: number }[] }> = ({
  from,
  stats,
}) => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  if (f < from) return null;
  const p = pop(f, from, 13);
  const xp = ramp(f, from + 8, from + 40);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          ...(vertical ? { top: 70, left: 90, right: 90 } : { top: 60, left: 60, width: 640 }),
          transform: `scale(${p})`,
          transformOrigin: "top left",
          background: "linear-gradient(180deg, #2a1640 0%, #160b24 100%)",
          border: `6px solid ${C.gold}`,
          borderRadius: 24,
          boxShadow: "0 10px 0 #0006",
          padding: "22px 28px",
          color: "#fff",
          fontFamily: FONT_TEXT,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: C.gold }}>КАЛИГУЛА</span>
          <span style={{ fontSize: 34, opacity: 0.85 }}>24 года</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 6 }}>
          Уровень: <b style={{ color: "#c9a7ff" }}>ИМПЕРАТОР</b>
        </div>
        <div style={{ marginTop: 12, height: 22, borderRadius: 11, background: "#ffffff22", overflow: "hidden" }}>
          <div style={{ width: `${xp * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.gold}, #fff2b0)` }} />
        </div>
        {stats.map((s) =>
          f >= s.at ? (
            <div
              key={s.label}
              style={{
                fontSize: 30,
                marginTop: 10,
                transform: `translateX(${(1 - pop(f, s.at, 14)) * -40}px)`,
                opacity: ramp(f, s.at, s.at + 6),
              }}
            >
              {s.label}: <b style={{ color: C.gold }}>{s.value}</b>
            </div>
          ) : null,
        )}
      </div>
    </AbsoluteFill>
  );
};

// "Room tour" vlog chrome: REC dot, handle, view counter.
export const VlogUI: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  if (f < from || f >= to) return null;
  const o = ramp(f, from, from + 6);
  const secs = Math.floor((f - from) / 30);
  const views = Math.floor(1200 + (f - from) * 731);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, fontFamily: FONT_TEXT, color: "#fff" }}>
      <div
        style={{
          position: "absolute",
          top: vertical ? 60 : 40,
          left: vertical ? 50 : 50,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 38,
          fontWeight: 700,
          textShadow: "0 3px 0 #0008",
        }}
      >
        <span style={{ width: 28, height: 28, borderRadius: 14, background: "#ff3030", opacity: f % 30 < 18 ? 1 : 0.2 }} />
        REC 00:{String(secs).padStart(2, "0")}
      </div>
      <div
        style={{
          position: "absolute",
          top: vertical ? 60 : 40,
          right: 50,
          fontSize: 32,
          fontWeight: 600,
          background: "#0007",
          borderRadius: 30,
          padding: "8px 22px",
        }}
      >
        @incitatus_official · {views.toLocaleString("ru-RU")} просмотров
      </div>
      <div style={{ position: "absolute", inset: vertical ? "30px 30px" : 24, border: "4px solid #ffffff99", borderRadius: 30 }} />
    </AbsoluteFill>
  );
};

// Price tag hanging on a string, drawn in stage coordinates.
export const PriceTag: React.FC<{ x: number; y: number; title: string; price: string; from: number; to?: number; tilt?: number }> = ({
  x,
  y,
  title,
  price,
  from,
  to = Infinity,
  tilt = -6,
}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const p = pop(f, from, 9) * (Number.isFinite(to) ? ramp(f, to - 5, to, 1, 0) : 1);
  const swing = Math.sin((f - from) / 8) * 4 * Math.exp(-(f - from) / 40);
  const w = Math.max(title.length, price.length) * 19 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${p}) rotate(${tilt + swing})`}>
      <line x1={0} y1={-70} x2={0} y2={0} stroke={C.ink} strokeWidth={4} />
      <path d={`M 0 0 L ${w / 2} 20 L ${w / 2} 130 L ${-w / 2} 130 L ${-w / 2} 20 Z`} fill="#fff4cf" stroke={C.ink} strokeWidth={5} />
      <circle cx={0} cy={22} r={8} fill={C.ink} />
      <text x={0} y={72} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={30} fill={C.ink}>
        {title}
      </text>
      <text x={0} y={112} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={32} fill={C.red}>
        {price}
      </text>
    </g>
  );
};

// Marble plaque with an engraved title, in stage coordinates.
export const Plaque: React.FC<{ x: number; y: number; text: string; glow?: number; scale?: number; color?: string }> = ({
  x,
  y,
  text,
  glow = 0,
  scale = 1,
  color = C.ink,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {glow > 0 && <rect x={-330} y={-110} width={660} height={220} rx={40} fill={C.gold} opacity={glow * 0.6} />}
    <rect x={-300} y={-90} width={600} height={180} rx={18} fill="#f3ece0" stroke={C.goldDark} strokeWidth={10} />
    <rect x={-276} y={-66} width={552} height={132} rx={10} fill="none" stroke="#cdbf9f" strokeWidth={4} />
    <text x={0} y={32} textAnchor="middle" fontFamily={FONT_ROMAN} fontWeight={700} fontSize={96} fill={color} letterSpacing={6}>
      {text}
    </text>
  </g>
);

// Rubber stamp that slams down, in stage coordinates.
export const Stamp: React.FC<{ x: number; y: number; text: string; from: number; color?: string; rotate?: number; size?: number }> = ({
  x,
  y,
  text,
  from,
  color = "#d32020",
  rotate = -14,
  size = 120,
}) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const k = ramp(f, from, from + 5, 2.6, 1);
  const o = ramp(f, from, from + 3);
  const w = text.length * size * 0.72 + 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${k})`} opacity={o}>
      <rect x={-w / 2} y={-size * 0.72} width={w} height={size * 1.3} rx={16} fill="none" stroke={color} strokeWidth={14} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={size} fill={color} letterSpacing={6}>
        {text}
      </text>
    </g>
  );
};

// VHS rewind overlay: jittering bands, tracking noise and the ◄◄ glyph.
export const Rewind: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const bands = Array.from({ length: 7 }).map((_, i) => ((f * 37 + i * 211) % 1920) / 1920);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#0a0420", opacity: 0.25 }} />
      {bands.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${b * 100}%`,
            height: 10 + (i % 3) * 14,
            background: i % 2 ? "#ffffff55" : "#00ffff33",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          fontFamily: FONT_DISPLAY,
          fontSize: 80,
          color: "#fff",
          textShadow: "4px 0 #f0f, -4px 0 #0ff",
        }}
      >
        ◄◄
      </div>
    </AbsoluteFill>
  );
};

// Old-film look for the flashback.
export const FilmGrain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, #2a1a0acc 100%)" }} />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 3,
            left: `${((f * (13 + i * 7) + i * 300) % 100) * 1}%`,
            background: "#3a2a1a55",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Thought bubble in stage coordinates; children are drawn inside the circle.
export const Bubble: React.FC<{ x: number; y: number; r: number; from: number; tailTo: [number, number]; children: React.ReactNode }> = ({
  x,
  y,
  r,
  from,
  tailTo,
  children,
}) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const p = pop(f, from, 12);
  const id = `bubble-${x}-${y}`;
  return (
    <g>
      {[0.25, 0.5].map((k, i) => (
        <circle
          key={k}
          cx={tailTo[0] + (x - tailTo[0]) * k}
          cy={tailTo[1] + (y - tailTo[1]) * k}
          r={(14 + i * 12) * p}
          fill="#fff"
          stroke={C.ink}
          strokeWidth={5}
        />
      ))}
      <g transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>
        <circle cx={x} cy={y} r={r} fill="#fff" stroke={C.ink} strokeWidth={8} />
        <clipPath id={id}>
          <circle cx={x} cy={y} r={r - 6} />
        </clipPath>
        <g clipPath={`url(#${id})`}>{children}</g>
      </g>
    </g>
  );
};
