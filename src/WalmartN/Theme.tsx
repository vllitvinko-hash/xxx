import "@fontsource/unbounded/cyrillic-700.css";
import "@fontsource/unbounded/cyrillic-900.css";
import "@fontsource/unbounded/latin-700.css";
import "@fontsource/unbounded/latin-900.css";
import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { CaptionLine } from "../captioning";
import { Bottle, Grain, N, Pack, Spot, Vignette } from "./Kit";

// Три визуальных стиля одного ролика. Сцены одинаковые, внешний вид — из темы.
export type ThemeId = "noir" | "swiss" | "riso";
export type Theme = {
  id: ThemeId;
  bg: string;
  surface: string; // карточки, плашки
  ink: string;
  muted: string;
  dim: string; // фоновые точки, линии
  beer: string;
  diaper: string;
  accent: string; // штамп, зачёркивание
  paper: string; // бумага чеков
  paperInk: string;
  display: string;
  displayWeight: number;
  displaySize: number; // множитель кегля заголовков
  upper: boolean;
  body: string;
  mono: string;
  shadow: string; // тень карточек
  radius: number;
  misprint?: string; // второй краской (ризограф)
};

export const THEMES: Record<ThemeId, Theme> = {
  noir: {
    id: "noir",
    bg: N.bg,
    surface: "#1A1C22",
    ink: N.ink,
    muted: N.muted,
    dim: "#30343C",
    beer: N.beer,
    diaper: N.blue,
    accent: N.red,
    paper: N.paper,
    paperInk: "#1E1E1E",
    display: "Oswald, 'Arial Narrow', sans-serif",
    displayWeight: 700,
    displaySize: 1,
    upper: true,
    body: "Inter, sans-serif",
    mono: "'JetBrains Mono', monospace",
    shadow: "0 30px 60px rgba(0,0,0,0.55)",
    radius: 4,
  },
  swiss: {
    id: "swiss",
    bg: "#F7F7F4",
    surface: "#FFFFFF",
    ink: "#111111",
    muted: "#6E6E6A",
    dim: "#D8D8D2",
    beer: "#FFB000",
    diaper: "#1F4BFF",
    accent: "#FF2A00",
    paper: "#FFFFFF",
    paperInk: "#111111",
    display: "Inter, 'Helvetica Neue', sans-serif",
    displayWeight: 900,
    displaySize: 0.82,
    upper: false,
    body: "Inter, sans-serif",
    mono: "'JetBrains Mono', monospace",
    shadow: "none",
    radius: 0,
  },
  riso: {
    id: "riso",
    bg: "#F2EDE1",
    surface: "#FBF8F0",
    ink: "#1F2A6B",
    muted: "#6C6A8A",
    dim: "#D9CFBE",
    beer: "#FF6C2F",
    diaper: "#0078BF",
    accent: "#FF48B0",
    paper: "#FBF8F0",
    paperInk: "#1F2A6B",
    display: "Unbounded, 'Arial Black', sans-serif",
    displayWeight: 900,
    displaySize: 0.7,
    upper: true,
    body: "Inter, sans-serif",
    mono: "'JetBrains Mono', monospace",
    shadow: "8px 8px 0 #FF48B0",
    radius: 22,
    misprint: "#FF48B0",
  },
};

const Ctx = createContext<Theme>(THEMES.noir);
export const ThemeProvider: React.FC<{
  id: ThemeId;
  children: React.ReactNode;
}> = ({ id, children }) => (
  <Ctx.Provider value={THEMES[id]}>{children}</Ctx.Provider>
);
export const useT = () => useContext(Ctx);

// ---------- фон и поверхность кадра ----------
export const Backdrop: React.FC<{ spot?: number; spotX?: number }> = ({
  spot = 960,
  spotX,
}) => {
  const t = useT();
  if (t.id === "noir") return <Spot x={spotX ?? spot} w={1300} o={0.15} />;
  if (t.id === "swiss")
    return (
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={i}
            x1={90 + i * 145}
            y1={0}
            x2={90 + i * 145}
            y2={1080}
            stroke="#E8E8E2"
            strokeWidth={1.5}
          />
        ))}
        <line x1={0} y1={64} x2={1920} y2={64} stroke="#111" strokeWidth={3} />
      </svg>
    );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {/* растровые точки ризографа */}
      <defs>
        <pattern
          id="dots"
          width={18}
          height={18}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(15)"
        >
          <circle cx={9} cy={9} r={2.2} fill="#FF48B0" opacity={0.18} />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="url(#dots)" />
    </svg>
  );
};
export const Overlay: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  if (t.id === "noir")
    return (
      <>
        <Vignette k={0.65} />
        <Grain seed={Math.floor(frame / 2)} />
      </>
    );
  if (t.id === "riso")
    return <Grain seed={Math.floor(frame / 3)} amount={0.06} />;
  return null;
};

// ---------- типографика ----------
export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 120, color, style }) => {
  const t = useT();
  return (
    <div
      style={{
        fontFamily: t.display,
        fontWeight: t.displayWeight,
        fontSize: size * t.displaySize,
        lineHeight: t.id === "noir" ? 0.95 : 1.02,
        letterSpacing:
          t.id === "swiss"
            ? "-0.045em"
            : t.id === "riso"
              ? "-0.01em"
              : "0.005em",
        textTransform: t.upper ? "uppercase" : "none",
        color: color ?? t.ink,
        textShadow: t.misprint
          ? `${Math.max(3, size * 0.035)}px ${Math.max(2, size * 0.025)}px 0 ${t.misprint}`
          : undefined,
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color, style }) => {
  const t = useT();
  return (
    <div
      style={{
        fontFamily: t.mono,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: color ?? t.muted,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------- товары в стиле темы ----------
export const Beer: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
  id: string;
}> = ({ x, y, s = 1, r = 0, id }) => {
  const t = useT();
  if (t.id === "noir") return <Bottle x={x} y={y} s={s} r={r} id={id} />;
  const body = (
    dx: number,
    dy: number,
    fill: string,
    label: string,
    text: string,
    op = 1,
  ) => (
    <g transform={`translate(${dx} ${dy})`} opacity={op}>
      <rect x={-17} y={-232} width={34} height={22} fill={fill} />
      <path
        d="M -15 -212 L 15 -212 L 17 -140 Q 46 -118 46 -64 L 46 186 L -46 186 L -46 -64 Q -46 -118 -17 -140 Z"
        fill={fill}
      />
      <rect x={-46} y={-4} width={92} height={96} fill={label} />
      <text
        x={0}
        y={60}
        textAnchor="middle"
        fontFamily={t.display}
        fontWeight={900}
        fontSize={t.id === "riso" ? 22 : 30}
        fill={text}
      >
        ПИВО
      </text>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {t.misprint && (
        <g style={{ mixBlendMode: "multiply" }}>
          {body(10, 7, t.misprint, t.misprint, t.misprint, 0.85)}
        </g>
      )}
      <g style={{ mixBlendMode: t.misprint ? "multiply" : undefined }}>
        {body(
          0,
          0,
          t.beer,
          t.id === "swiss" ? "#111" : t.surface,
          t.id === "swiss" ? "#fff" : t.beer,
        )}
      </g>
    </g>
  );
};
export const Diapers: React.FC<{
  x: number;
  y: number;
  s?: number;
  r?: number;
  id: string;
}> = ({ x, y, s = 1, r = 0, id }) => {
  const t = useT();
  if (t.id === "noir") return <Pack x={x} y={y} s={s} r={r} id={id} />;
  const body = (
    dx: number,
    dy: number,
    fill: string,
    label: string,
    text: string,
    op = 1,
  ) => (
    <g transform={`translate(${dx} ${dy})`} opacity={op}>
      <path
        d="M -60 -176 Q 0 -230 60 -176"
        stroke={fill}
        strokeWidth={12}
        fill="none"
      />
      <rect
        x={-124}
        y={-176}
        width={248}
        height={366}
        rx={t.id === "riso" ? 30 : 0}
        fill={fill}
      />
      <circle cx={0} cy={-10} r={58} fill={label} />
      <circle cx={-20} cy={-18} r={7} fill={fill} />
      <circle cx={20} cy={-18} r={7} fill={fill} />
      <path
        d="M -20 8 Q 0 24 20 8"
        stroke={fill}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={-100} y={96} width={200} height={52} fill={label} />
      <text
        x={0}
        y={132}
        textAnchor="middle"
        fontFamily={t.display}
        fontWeight={900}
        fontSize={t.id === "riso" ? 17 : 26}
        fill={text}
      >
        ПОДГУЗНИКИ
      </text>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {t.misprint && (
        <g style={{ mixBlendMode: "multiply" }}>
          {body(10, 7, t.misprint, t.misprint, t.misprint, 0.85)}
        </g>
      )}
      <g style={{ mixBlendMode: t.misprint ? "multiply" : undefined }}>
        {body(0, 0, t.diaper, t.id === "swiss" ? "#fff" : t.surface, t.diaper)}
      </g>
    </g>
  );
};

// ---------- чек ----------
export const Check: React.FC<{
  x: number;
  y: number;
  w?: number;
  rows: string[];
  hi?: Record<string, "beer" | "diaper">;
  head?: string;
  r?: number;
  s?: number;
  o?: number;
  strike?: number;
}> = ({
  x,
  y,
  w = 360,
  rows,
  hi = {},
  head = "КАССОВЫЙ ЧЕК",
  r = 0,
  s = 1,
  o = 1,
}) => {
  const t = useT();
  const h = 150 + rows.length * 46;
  const teeth = Array.from(
    { length: Math.ceil(w / 16) + 1 },
    (_, i) => `${i * 16},${i % 2 ? 10 : 0}`,
  ).join(" ");
  const hc = (k: "beer" | "diaper") => (k === "beer" ? t.beer : t.diaper);
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      {t.id === "noir" && (
        <rect x={8} y={14} width={w} height={h} fill="#000" opacity={0.35} />
      )}
      {t.misprint && (
        <rect
          x={10}
          y={10}
          width={w}
          height={h}
          fill={t.misprint}
          opacity={0.8}
        />
      )}
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={t.paper}
        stroke={t.id === "swiss" ? "#111" : "none"}
        strokeWidth={3}
      />
      {t.id !== "swiss" && (
        <polyline
          points={teeth}
          transform={`translate(0 ${h - 2})`}
          fill={t.paper}
        />
      )}
      <text
        x={w / 2}
        y={40}
        textAnchor="middle"
        fontFamily={t.mono}
        fontWeight={700}
        fontSize={18}
        fill={t.paperInk}
        opacity={0.75}
      >
        {head}
      </text>
      <line
        x1={20}
        y1={58}
        x2={w - 20}
        y2={58}
        stroke={t.paperInk}
        opacity={0.35}
        strokeWidth={2}
        strokeDasharray="6 6"
      />
      {rows.map((row, i) => (
        <g key={row + i}>
          {hi[row] && (
            <rect
              x={12}
              y={70 + i * 46}
              width={w - 24}
              height={38}
              fill={hc(hi[row])}
              opacity={t.id === "noir" ? 0.6 : 0.9}
            />
          )}
          <text
            x={22}
            y={96 + i * 46}
            fontFamily={t.mono}
            fontWeight={hi[row] ? 700 : 500}
            fontSize={22}
            fill={hi[row] && t.id === "swiss" ? "#fff" : t.paperInk}
          >
            {row}
          </text>
        </g>
      ))}
      <line
        x1={20}
        y1={h - 64}
        x2={w - 20}
        y2={h - 64}
        stroke={t.paperInk}
        opacity={0.35}
        strokeWidth={2}
        strokeDasharray="6 6"
      />
      {Array.from({ length: 30 }, (_, i) => (
        <rect
          key={i}
          x={24 + i * ((w - 48) / 30)}
          y={h - 48}
          width={(i * 7) % 3 === 0 ? 4 : 2}
          height={30}
          fill={t.paperInk}
        />
      ))}
    </g>
  );
};

// ---------- субтитры в стиле темы ----------
export const ThemedSubs: React.FC<{ lines: CaptionLine[] }> = ({ lines }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const line = lines.find(
    (l) => frame >= l.from && frame < l.from + l.frames + 6,
  );
  if (!line) return null;
  const words = line.text.split(" ");
  const local = frame - line.from;
  const isWord = (w: string) => /[A-Za-zА-Яа-яЁё0-9]/.test(w);
  let spoken = -1;
  const appear = line.from === 0 ? 1 : Math.min(1, (frame - line.from) / 4);
  const box: React.CSSProperties =
    t.id === "noir"
      ? {
          background: "rgba(10,10,12,0.55)",
          padding: "14px 30px",
          borderRadius: 6,
        }
      : t.id === "swiss"
        ? { background: "#111", padding: "16px 30px" }
        : {
            background: t.surface,
            padding: "16px 32px",
            borderRadius: 22,
            boxShadow: `6px 6px 0 ${t.accent}`,
          };
  const base = t.id === "swiss" ? "#fff" : t.ink;
  const now = t.id === "noir" ? t.beer : t.id === "swiss" ? t.beer : t.accent;
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: 920,
        display: "flex",
        justifyContent: "center",
        opacity: appear,
      }}
    >
      <div
        style={{
          ...box,
          maxWidth: 1600,
          textAlign: "center",
          fontFamily: t.body,
          fontWeight: 800,
          fontSize: 42,
          lineHeight: 1.3,
        }}
      >
        {words.map((w, i) => {
          let state: "done" | "now" | "next" = "done";
          if (line.words) {
            if (isWord(w)) spoken++;
            const idx = Math.max(spoken, 0);
            const ws = line.words[idx];
            const we = line.words[idx + 1] ?? line.frames;
            state = local >= we ? "done" : local >= ws ? "now" : "next";
          }
          return (
            <span
              key={i}
              style={{
                color: state === "now" ? now : base,
                opacity: state === "next" ? 0.4 : 1,
              }}
            >
              {w}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};
