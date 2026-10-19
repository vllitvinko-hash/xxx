import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, SANS, clamp } from "./brand";

// Общие субтитры и музыкальная подложка для роликов с закадровым текстом.

export type CaptionLine = {
  id: string;
  scene: number;
  from: number;
  frames: number;
  text: string;
  // кадры начала слов от начала фразы (из распознавания записи голоса)
  words?: number[] | null;
};

// Субтитры: сказанные слова белые, текущее — жёлтое, будущие — приглушённые
export const Subtitles: React.FC<{
  lines: CaptionLine[];
  darkScene: number; // на этой сцене тёмный фон — субтитры инвертируются
  variant?: "brand" | "soft"; // soft — скруглённая плашка для иллюстрированного стиля
  top?: number; // верх плашки (по умолчанию — под вертикальный кадр)
  maxWidth?: number;
}> = ({ lines, darkScene, variant = "brand", top = 1420, maxWidth = 960 }) => {
  const soft = variant === "soft";
  const frame = useCurrentFrame();
  const line = lines.find(
    (l) => frame >= l.from && frame < l.from + l.frames + 6,
  );
  if (!line) return null;
  const onDark = line.scene === darkScene;
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
        top,
        display: "flex",
        justifyContent: "center",
        opacity: appear,
      }}
    >
      <div
        style={{
          background: soft ? "#fff" : onDark ? C.paper : C.ink,
          padding: soft ? "22px 34px" : "22px 30px",
          borderRadius: soft ? 32 : 0,
          boxShadow: soft ? "0 18px 40px rgba(36,59,85,0.25)" : "none",
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.3,
          maxWidth,
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
          const base = soft ? "#243B55" : onDark ? C.ink : "#fff";
          return (
            <span
              key={i}
              style={{
                color:
                  state === "now"
                    ? soft
                      ? "#EE6A57"
                      : onDark
                        ? C.green
                        : C.tag
                    : base,
                opacity: state === "next" ? (soft ? 0.35 : 0.45) : 1,
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

// Музыка: тише под голосом, чуть громче в паузах, затухание в конце
const MUSIC_UNDER_VOICE = 0.09;
const MUSIC_IN_PAUSE = 0.24;
const RAMP = 6; // кадров на подъём/спад громкости

export const MusicBed: React.FC<{
  src: string;
  lines: CaptionLine[];
  duration: number;
  // есть ли под субтитрами записанный голос; без него музыка ровная
  ducking: boolean;
}> = ({ src, lines, duration, ducking }) => {
  const volume = (f: number) => {
    // насколько сейчас «звучит голос» с учётом плавных переходов
    let voice = 0;
    if (ducking) {
      for (const l of lines) {
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
    }
    const base = MUSIC_IN_PAUSE + (MUSIC_UNDER_VOICE - MUSIC_IN_PAUSE) * voice;
    const fadeOut = interpolate(f, [duration - 45, duration], [1, 0], clamp);
    return base * fadeOut;
  };
  return <Audio src={staticFile(src)} volume={volume} />;
};
