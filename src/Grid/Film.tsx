import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../brand";
import { CaptionLine, MusicBed } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import { Check, ThemeProvider, ThemedSubs, useT } from "../WalmartN/Theme";
import captions from "./captions.json";
import {
  Both,
  Grew,
  Grid,
  Horizontal,
  NotYours,
  Outro,
  Pretty,
  Supplier,
  Vertical,
  Weak,
} from "./Scenes";

// «Вертикаль и горизонталь» — 1920×1080. Пока без голоса: субтитры по черновому таймингу.
const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const GRID_DURATION = SCENES[SCENES.length - 1];
const COMPS: React.FC<SceneProps>[] = [
  Pretty,
  Vertical,
  Horizontal,
  Both,
  NotYours,
  Supplier,
  Weak,
  Grew,
  Grid,
  Outro,
];

const GREEN = "#0E4D2E",
  YELLOW = "#FFD23F",
  INK = "#16181A";
const W = (s: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.045em",
  lineHeight: 0.92,
  ...s,
});
const CoverBody: React.FC = () => {
  useT();
  return (
    <AbsoluteFill style={{ background: GREEN }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={1130}
          y={120}
          width={720}
          height={560}
          rx={36}
          fill="#F4F3EE"
        />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({ length: 10 }, (_, k) => (
              <rect
                key={k}
                x={1170 + k * 64}
                y={150 + r * 170}
                width={50}
                height={120}
                fill={["#0E4D2E", "#C9C6BC", "#7FA88F"][r]}
              />
            ))}
            <rect
              x={1150}
              y={276 + r * 170}
              width={680}
              height={12}
              fill={INK}
            />
          </g>
        ))}
        <Check
          x={1300}
          y={560}
          w={420}
          rows={["Соус", "Макароны"]}
          hi={{ Соус: "diaper", Макароны: "beer" }}
          head="ЧЕК"
          r={-6}
          s={1.1}
        />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={W({ fontSize: 160, color: "#fff" })}>Красиво</div>
        <div style={W({ fontSize: 240, color: YELLOW, marginTop: 6 })}>≠</div>
        <div style={W({ fontSize: 160, color: "#fff" })}>прибыльно</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 70,
          background: YELLOW,
          padding: "14px 30px",
          ...W({ fontSize: 52, color: INK, lineHeight: 1 }),
        }}
      >
        что видно только в чеке
      </div>
    </AbsoluteFill>
  );
};
export const GridCover: React.FC = () => (
  <ThemeProvider id="swiss">
    <CoverBody />
  </ThemeProvider>
);
// лёгкий наезд камеры внутри сцены
const Push: React.FC<{ length: number; children: React.ReactNode }> = ({
  length,
  children,
}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [0, length], [1, 1.035], clamp);
  return (
    <AbsoluteFill
      style={{ transform: `scale(${k})`, transformOrigin: "50% 45%" }}
    >
      {children}
    </AbsoluteFill>
  );
};
// фирменная шторка между сценами: зелёная панель с жёлтой кромкой проезжает слева направо
const WIPE = 9;
const Wipe: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, WIPE * 2], [-2200, 2000], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x,
          width: 2000,
          background: GREEN,
          transform: "skewX(-12deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x + 2000,
          width: 36,
          background: YELLOW,
          transform: "skewX(-12deg)",
        }}
      />
    </AbsoluteFill>
  );
};
// логотип в углу на протяжении ролика
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 2 || frame >= SCENES[SCENES.length - 2]) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 40,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.12em",
        color: INK,
      }}
    >
      <span>АНАЛИТИКА</span>
      <span style={{ background: YELLOW, padding: "2px 10px" }}>ПРО</span>
    </div>
  );
};
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 6,
        width: `${(frame / durationInFrames) * 100}%`,
        background: YELLOW,
      }}
    />
  );
};
export const GridFilm: React.FC = () => (
  <ThemeProvider id="swiss">
    <AbsoluteFill>
      {COMPS.map((Comp, i) => {
        const from = SCENES[i];
        const len = SCENES[i + 1] - from;
        const cue = LINES.filter((l) => l.scene === i).map(
          (l) => l.from - from,
        );
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <Push length={len}>
              <Comp cue={cue} />
            </Push>
          </Sequence>
        );
      })}
      {SCENES.slice(1, -1).map((b) => (
        <Sequence key={`w${b}`} from={b - WIPE} durationInFrames={WIPE * 2}>
          <Wipe />
        </Sequence>
      ))}
      <Brand />
      <ThemedSubs lines={LINES} />
      {SCENES.slice(1, -1).map((b) => (
        <Sequence key={`ws${b}`} from={b - WIPE - 4} layout="none">
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
        </Sequence>
      ))}
      {LINES.filter((l, i) => i > 0 && LINES[i - 1].scene === l.scene).map(
        (l) => (
          <Sequence key={`p${l.id}`} from={l.from} layout="none">
            <Audio src={staticFile("sfx/pop.wav")} volume={0.18} />
          </Sequence>
        ),
      )}
      <MusicBed
        src="music/bed-xl.mp3"
        lines={LINES}
        duration={GRID_DURATION}
        ducking={false}
      />
      <Progress />
      <Sequence durationInFrames={1}>
        <CoverBody />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);
