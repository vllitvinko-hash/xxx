import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scene } from "../brand";
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
            {i === 0 || i === COMPS.length - 1 ? (
              <Comp cue={cue} />
            ) : (
              <Scene length={len}>
                <Comp cue={cue} />
              </Scene>
            )}
          </Sequence>
        );
      })}
      <ThemedSubs lines={LINES} />
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
