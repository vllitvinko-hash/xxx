import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background, ProgressBar, Scene } from "../brand";
import { CaptionLine, MusicBed, Subtitles } from "../captioning";
import { SceneProps } from "../Abc/ScenesA";
import { Channel } from "../Abc/ScenesB";
import captions from "./captions.json";
import { XyzCover } from "./Cover";
import { Bounds, Hook, Matrix, Patterns, Pearson, Same } from "./Scenes";

const SCENES = captions.scenes;
const LINES = captions.lines as CaptionLine[];
export const XYZ_DURATION = SCENES[SCENES.length - 1];

const SCENE_COMPONENTS: React.FC<SceneProps>[] = [
  Hook,
  Same,
  Patterns,
  Pearson,
  Bounds,
  Matrix,
  Channel,
];

export const Xyz: React.FC = () => {
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
      {/* голоса пока нет — музыка ровная, без приглушения */}
      <MusicBed
        src="music/bed-long.mp3"
        lines={LINES}
        duration={XYZ_DURATION}
        ducking={false}
      />
      <ProgressBar />
      {/* превью первым кадром — его берут мессенджеры */}
      <Sequence durationInFrames={1}>
        <XyzCover />
      </Sequence>
    </AbsoluteFill>
  );
};
