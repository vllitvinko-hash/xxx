import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background, ProgressBar, Scene } from "../brand";
import { CaptionLine, MusicBed, Subtitles } from "../captioning";
import captions from "./captions.json";
import { AbcCover } from "./Cover";
import { Article, Groups, History, SceneProps, Shelf } from "./ScenesA";
import { Channel, Names, NextLevel, Owner } from "./ScenesB";

const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const ABC_DURATION = SCENES[SCENES.length - 1];

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  Shelf,
  History,
  Groups,
  Article,
  Names,
  Owner,
  NextLevel,
  Channel,
];

export const Abc: React.FC = () => {
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
      <Subtitles lines={LINES} darkScene={SCENE_COMPONENTS.length - 1} />
      <MusicBed
        src="music/bed-long.mp3"
        lines={LINES}
        duration={ABC_DURATION}
        ducking
      />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(`abc-voice/${l.id}.wav`)} />
        </Sequence>
      ))}
      <ProgressBar />
      {/* превью первым кадром — его берут мессенджеры */}
      <Sequence durationInFrames={1}>
        <AbcCover />
      </Sequence>
    </AbsoluteFill>
  );
};
