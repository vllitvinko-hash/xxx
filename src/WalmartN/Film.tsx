import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Scene } from "../brand";
import { CaptionLine, MusicBed } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import captions from "../Walmart/captions.json";
import {
  Channel,
  Data,
  Finale,
  Friday,
  Idea,
  Intro,
  Move,
  Pairs,
  Start,
  Survey,
  Today,
} from "./Scenes";
import {
  Backdrop,
  Beer,
  Diapers,
  Display,
  Label,
  Overlay,
  ThemeId,
  ThemeProvider,
  ThemedSubs,
  useT,
} from "./Theme";

// Три стиля одного ролика: тот же голос (walmart-voice), тот же тайминг, 1920×1080.
const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const FILM_DURATION = SCENES[SCENES.length - 1];
const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  Intro,
  Start,
  Idea,
  Data,
  Pairs,
  Friday,
  Survey,
  Move,
  Today,
  Finale,
  Channel,
];

// Заставка: крупные буквы для миниатюры
const CoverBody: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Backdrop spotX={1640} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={1300}
          y={858}
          width={640}
          height={30}
          fill={t.id === "noir" ? "#3A3D45" : t.ink}
        />
        {t.id === "noir" && (
          <rect x={1300} y={888} width={640} height={200} fill="#15171C" />
        )}
        <Diapers x={1520} y={676} s={0.95} r={-3} id="cd" />
        <Beer x={1800} y={680} s={0.95} r={4} id="cb" />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 96, width: 1150 }}>
        <Label color={t.mark ? t.ink : t.beer} style={{ fontSize: 36 }}>
          Почему в супермаркете
        </Label>
        <Display size={300} color={t.beer} style={{ marginTop: t.mark ? 30 : 6 }}>
          Пиво
        </Display>
        <Display size={150} style={{ whiteSpace: "nowrap" }}>
          стоит рядом
        </Display>
        <Display
          size={t.id === "riso" ? 112 : 130}
          color={t.diaper}
          style={{ whiteSpace: "nowrap" }}
        >
          с подгузниками?
        </Display>
      </div>
      <Overlay />
    </AbsoluteFill>
  );
};
export const FilmCover: React.FC<{ theme: ThemeId }> = ({ theme }) => (
  <ThemeProvider id={theme}>
    <CoverBody />
  </ThemeProvider>
);

const Progress: React.FC = () => {
  const t = useT();
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
        background: t.beer,
      }}
    />
  );
};

export const Film: React.FC<{ theme: ThemeId }> = ({ theme }) => (
  <ThemeProvider id={theme}>
    <AbsoluteFill>
      {SCENE_COMPONENTS.map((Comp, i) => {
        const from = SCENES[i];
        const len = SCENES[i + 1] - from;
        const cue = LINES.filter((l) => l.scene === i).map(
          (l) => l.from - from,
        );
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            {i === 0 || i === SCENE_COMPONENTS.length - 1 ? (
              <Comp cue={cue} />
            ) : (
              <Scene length={len}>
                <Comp cue={cue} />
              </Scene>
            )}
          </Sequence>
        );
      })}
      <Overlay />
      <ThemedSubs lines={LINES} />
      <MusicBed
        src="music/bed-xl.mp3"
        lines={LINES}
        duration={FILM_DURATION}
        ducking
      />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(`walmart-voice/${l.id}.wav`)} />
        </Sequence>
      ))}
      <Progress />
      <Sequence durationInFrames={1}>
        <CoverBody />
      </Sequence>
    </AbsoluteFill>
  </ThemeProvider>
);
export const FilmNoir: React.FC = () => <Film theme="noir" />;
export const FilmSwiss: React.FC = () => <Film theme="swiss" />;
export const FilmRiso: React.FC = () => <Film theme="riso" />;
export const CoverNoir: React.FC = () => <FilmCover theme="noir" />;
export const CoverSwiss: React.FC = () => <FilmCover theme="swiss" />;
export const CoverRiso: React.FC = () => <FilmCover theme="riso" />;
