import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background, C, ProgressBar, SANS, Scene, clamp } from "../brand";
import { Blind, Checkout, Receipts, SceneProps } from "./ScenesA";
import { Final, OnlyExport, Report, Types } from "./ScenesB";
import { CoverA } from "./Cover";
import voice from "./voice.json";

type Line = {
  id: string;
  scene: number;
  from: number;
  frames: number;
  text: string;
};

const SCENES = voice.scenes;
const LINES = voice.lines as Line[];
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

// Субтитры: сказанные слова белые, текущее — жёлтое, будущие — приглушённые
const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const line = LINES.find(
    (l) => frame >= l.from && frame < l.from + l.frames + 6,
  );
  if (!line) return null;
  const onDark = line.scene === SCENES.length - 2;
  const words = line.text.split(" ");
  // время слова пропорционально его длине
  const total = words.reduce((s, w) => s + w.length + 1, 0);
  const progress = ((frame - line.from) / line.frames) * total;
  let acc = 0;
  // первая реплика видна сразу — без нарастания
  const appear =
    line.from === 0 ? 1 : interpolate(frame - line.from, [0, 4], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1420,
        display: "flex",
        justifyContent: "center",
        opacity: appear,
      }}
    >
      <div
        style={{
          background: onDark ? C.paper : C.ink,
          padding: "22px 30px",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.3,
          maxWidth: 960,
        }}
      >
        {words.map((w, i) => {
          const start = acc;
          acc += w.length + 1;
          const state =
            progress >= acc ? "done" : progress >= start ? "now" : "next";
          const base = onDark ? C.ink : "#fff";
          return (
            <span
              key={i}
              style={{
                color: state === "now" ? (onDark ? C.green : C.tag) : base,
                opacity: state === "next" ? 0.45 : 1,
              }}
            >
              {w}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};

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
      <Subtitles />
      {LINES.map((l) => (
        <Sequence key={l.id} from={l.from} layout="none">
          <Audio src={staticFile(`story/${l.id}.wav`)} />
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
