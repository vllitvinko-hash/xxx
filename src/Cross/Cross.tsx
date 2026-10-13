import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background, ProgressBar, Scene } from "../brand";
import { CaptionLine, MusicBed, Subtitles } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import captions from "./captions.json";
import { CrossCover } from "./Cover";
import {
  Batteries,
  Bonus,
  Bundle,
  CheatSheet,
  CheckoutChoice,
  CheckoutNo,
  Montage,
  PairsInReceipts,
  ShelfSells,
} from "./Scenes";

const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const CROSS_DURATION = SCENES[SCENES.length - 1];

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  CheckoutNo,
  Montage,
  CheckoutChoice,
  Batteries,
  ShelfSells,
  Bundle,
  Bonus,
  PairsInReceipts,
  CheatSheet,
];

export const Cross: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
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
      {/* тёмных сцен нет */}
      <Subtitles lines={LINES} darkScene={-1} />
      <MusicBed
        src="music/bed-xl.mp3"
        lines={LINES}
        duration={CROSS_DURATION}
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
        <CrossCover />
      </Sequence>
    </AbsoluteFill>
  );
};
