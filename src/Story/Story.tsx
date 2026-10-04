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
import captions from "./captions.json";

type Line = {
  id: string;
  scene: number;
  from: number;
  frames: number;
  text: string;
  // кадры начала слов от начала фразы (из распознавания записи)
  words?: number[] | null;
};

const SCENES = captions.scenes;
const LINES = captions.lines as Line[];
export const STORY_DURATION = SCENES[SCENES.length - 1];

// Музыка: тише под голосом, чуть громче в паузах, затухание в конце
const MUSIC_UNDER_VOICE = 0.09;
const MUSIC_IN_PAUSE = 0.24;
const RAMP = 6; // кадров на подъём/спад громкости

const musicVolume = (f: number) => {
  // насколько сейчас «звучит голос» с учётом плавных переходов
  let voice = 0;
  for (const l of LINES) {
    const v = Math.min(
      interpolate(f, [l.from - RAMP, l.from], [0, 1], clamp),
      interpolate(
        f,
        [l.from + l.frames, l.from + l.frames + RAMP],
        [1, 0],
        clamp,
      ),
    );
    voice = Math.max(voice, v);
  }
  const base = MUSIC_IN_PAUSE + (MUSIC_UNDER_VOICE - MUSIC_IN_PAUSE) * voice;
  const fadeOut = interpolate(
    f,
    [STORY_DURATION - 45, STORY_DURATION],
    [1, 0],
    clamp,
  );
  return base * fadeOut;
};

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
  const local = frame - line.from;
  // время слова: по записи голоса, иначе пропорционально длине
  const total = words.reduce((s, w) => s + w.length + 1, 0);
  const progress = (local / line.frames) * total;
  const isWord = (w: string) => /[A-Za-zА-Яа-яЁё0-9]/.test(w);
  let acc = 0;
  let spoken = -1;
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
          let state: "done" | "now" | "next";
          if (line.words) {
            if (isWord(w)) spoken++;
            const idx = Math.max(spoken, 0);
            const ws = line.words[idx];
            const we = line.words[idx + 1] ?? line.frames;
            state = local >= we ? "done" : local >= ws ? "now" : "next";
          } else {
            state =
              progress >= acc ? "done" : progress >= start ? "now" : "next";
          }
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
      <Audio src={staticFile("music/bed.mp3")} volume={musicVolume} />
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
