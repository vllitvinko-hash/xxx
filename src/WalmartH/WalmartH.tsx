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
import { CaptionLine, MusicBed, Subtitles } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import captions from "../Walmart/captions.json";
import { P } from "./Art";
import { WalmartHCover } from "./Cover";
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

// Горизонтальная версия: тот же голос (walmart-voice) и тот же тайминг, новая графика 1920×1080.
const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const WALMARTH_DURATION = SCENES[SCENES.length - 1];
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

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 8,
        width: `${(frame / durationInFrames) * 100}%`,
        background: P.coral,
      }}
    />
  );
};

export const WalmartH: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg }}>
    {SCENE_COMPONENTS.map((Comp, i) => {
      const from = SCENES[i];
      const len = SCENES[i + 1] - from;
      const cue = LINES.filter((l) => l.scene === i).map((l) => l.from - from);
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
    <Subtitles
      lines={LINES}
      darkScene={-1}
      variant="soft"
      top={900}
      maxWidth={1720}
    />
    <MusicBed
      src="music/bed-xl.mp3"
      lines={LINES}
      duration={WALMARTH_DURATION}
      ducking
    />
    {LINES.map((l) => (
      <Sequence key={l.id} from={l.from} layout="none">
        <Audio src={staticFile(`walmart-voice/${l.id}.wav`)} />
      </Sequence>
    ))}
    <Progress />
    {/* заставка первым кадром */}
    <Sequence durationInFrames={1}>
      <WalmartHCover />
    </Sequence>
  </AbsoluteFill>
);
