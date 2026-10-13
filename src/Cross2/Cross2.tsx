import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ProgressBar, Scene } from "../brand";
import { SiteButton } from "./SiteButton";
import { CaptionLine, MusicBed, Subtitles } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import { Channel } from "../Abc/ScenesB";
import captions from "./captions.json";
import { F } from "../Refs/Refs";
import { Cross2Cover } from "./Cover";
import {
  S0Checkout,
  S1Montage,
  S2Choice,
  S3Home,
  S4Shelf,
  S5Bundle,
  S6Bonus,
  S7Receipts,
  S8Cheat,
} from "./Scenes";

// Тот же голос и тайминг, что у Cross, — новая иллюстрированная графика.
const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const CROSS2_DURATION = SCENES[SCENES.length - 1];

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  S0Checkout,
  S1Montage,
  S2Choice,
  S3Home,
  S4Shelf,
  S5Bundle,
  S6Bonus,
  S7Receipts,
  S8Cheat,
  Channel,
];

export const Cross2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      {SCENE_COMPONENTS.map((Comp, i) => {
        const from = SCENES[i];
        const len = SCENES[i + 1] - from;
        const cue = LINES.filter((l) => l.scene === i).map(
          (l) => l.from - from,
        );
        const isFirst = i === 0;
        const isLast = i === SCENE_COMPONENTS.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            {isFirst || isLast ? (
              <Comp cue={cue} />
            ) : (
              <Scene length={len}>
                <Comp cue={cue} />
              </Scene>
            )}
          </Sequence>
        );
      })}
      <Sequence from={SCENES[SCENE_COMPONENTS.length - 1]}>
        <SiteButton />
      </Sequence>
      <Subtitles
        lines={LINES}
        darkScene={SCENE_COMPONENTS.length - 1}
        variant="soft"
      />
      <MusicBed
        src="music/bed-xl.mp3"
        lines={LINES}
        duration={CROSS2_DURATION}
        ducking
      />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(`cross-voice/${l.id}.wav`)} />
        </Sequence>
      ))}
      <ProgressBar />
      {/* превью первым кадром — его берут мессенджеры */}
      <Sequence durationInFrames={1}>
        <Cross2Cover />
      </Sequence>
    </AbsoluteFill>
  );
};
