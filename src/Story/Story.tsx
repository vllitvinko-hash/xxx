import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background, ProgressBar, Scene } from "../brand";
import { Blind, Checkout, Receipts, SceneProps } from "./ScenesA";
import { Final, OnlyExport, Report, Types } from "./ScenesB";
import { CoverA } from "./Cover";
import captions from "./captions.json";
import { CaptionLine, MusicBed, Subtitles } from "../captioning";

const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const STORY_DURATION = SCENES[SCENES.length - 1];

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  Checkout,
  Blind,
  Receipts,
  Types,
  Report,
  OnlyExport,
  Final,
];

export const Story: React.FC = () => {
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
      <Subtitles lines={LINES} darkScene={SCENES.length - 2} />
      <MusicBed
        src="music/bed.mp3"
        lines={LINES}
        duration={STORY_DURATION}
        ducking
      />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(`voice/${l.id}.wav`)} />
        </Sequence>
      ))}
      <ProgressBar />
      {/* Обложка A — первым кадром: её берут как превью мессенджеры */}
      <Sequence durationInFrames={1}>
        <CoverA />
      </Sequence>
    </AbsoluteFill>
  );
};
