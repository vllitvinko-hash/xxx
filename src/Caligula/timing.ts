import timeline from "./timeline.json";

export const FPS = 30;

export type SceneId = "hook" | "caligula" | "roomtour" | "twist" | "why" | "finale";

export type Line = { text: string; start: number; end: number };

export const sec = (s: number) => Math.round(s * FPS);

const scenes = timeline.scenes as { id: SceneId; start: number; end: number; lines: Line[] }[];

// Cuts land a few frames before the first phrase of a scene.
const CUT_LEAD = 0.15;

// Hold the end card a little after the voice-over finishes.
export const TOTAL_FRAMES = sec(timeline.duration + 1.4);

const indexOf = (id: SceneId) => scenes.findIndex((s) => s.id === id);

export const sceneFrom = (id: SceneId) => {
  const i = indexOf(id);
  return i === 0 ? 0 : sec(scenes[i].start - CUT_LEAD);
};

export const sceneTo = (id: SceneId) => {
  const i = indexOf(id);
  return i === scenes.length - 1 ? TOTAL_FRAMES : sceneFrom(scenes[i + 1].id);
};

export const allLines = (): Line[] => scenes.flatMap((s) => s.lines);

// Absolute frame of a phrase start, for sound effects placed on the main timeline.
export const at = (id: SceneId, line: number, offsetSec = 0) =>
  sec(scenes[indexOf(id)].lines[line].start + offsetSec);

export const atEnd = (id: SceneId, line: number, offsetSec = 0) =>
  sec(scenes[indexOf(id)].lines[line].end + offsetSec);

// Phrase timings relative to the scene's own <Sequence>.
export const lines = (id: SceneId) => {
  const base = sceneFrom(id);
  const sc = scenes[indexOf(id)];
  return {
    start: (i: number) => sec(sc.lines[i].start) - base,
    end: (i: number) => sec(sc.lines[i].end) - base,
    duration: sceneTo(id) - base,
  };
};
