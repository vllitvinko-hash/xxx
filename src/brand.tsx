import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/cyrillic-700.css";
import "@fontsource/inter/cyrillic-800.css";
import "@fontsource/inter/cyrillic-900.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/inter/latin-900.css";
import "@fontsource/jetbrains-mono/cyrillic-500.css";
import "@fontsource/jetbrains-mono/cyrillic-700.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Фирменные цвета сайта analytic-pro.ru
export const C = {
  bg: "#F4F3EE",
  paper: "#FFFFFF",
  ink: "#16181A",
  ink2: "#5A6066",
  green: "#0E4D2E",
  tag: "#FFD23F",
  line: "#DEDCD4",
  shelf: "#E4E2DA",
  red: "#B3372E",
};

export const SANS = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// ---------- Общие элементы ----------

export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`,
      backgroundSize: "44px 44px",
    }}
  />
);

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: `${(frame / durationInFrames) * 100}%`,
        background: C.tag,
        borderBottom: `3px solid ${C.ink}`,
      }}
    />
  );
};

// Сцена с появлением снизу и затуханием в конце
export const Scene: React.FC<{ length: number; children: React.ReactNode }> = ({
  length,
  children,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [length - 8, length], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 50}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{
  text: string;
  top: number;
  color?: string;
}> = ({ text, top, color = C.green }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 2,
      color,
    }}
  >
    {text}
  </div>
);

// Заголовок: строки выезжают по очереди
export const Title: React.FC<{
  text: string;
  top: number;
  size?: number;
  color?: string;
  delay?: number;
  weight?: number;
}> = ({ text, top, size = 64, color = C.ink, delay = 0, weight = 800 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color,
      }}
    >
      {text.split("\n").map((line, i) => {
        const s = spring({
          frame: frame - delay - i * 5,
          fps,
          config: { damping: 15, mass: 0.6 },
        });
        return (
          <div
            key={i}
            style={{ opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

// Текст с жёлтым маркером, который «прокрашивается» слева направо
export const Marker: React.FC<{
  children: React.ReactNode;
  progress: number;
}> = ({ children, progress }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        left: -12,
        right: -12,
        top: "12%",
        bottom: "4%",
        background: C.tag,
        transformOrigin: "left center",
        transform: `scaleX(${progress}) rotate(-1deg)`,
      }}
    />
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);

// Кнопка в стиле сайта: жёлтая, чёрная рамка, жёсткая тень
export const BrutalButton: React.FC<{ text: string; scale: number }> = ({
  text,
  scale,
}) => (
  <div
    style={{
      transform: `scale(${scale})`,
      padding: "40px 64px",
      background: C.tag,
      border: `5px solid ${C.ink}`,
      boxShadow: `14px 14px 0 ${C.paper}`,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 56,
      color: C.ink,
    }}
  >
    {text}
  </div>
);
