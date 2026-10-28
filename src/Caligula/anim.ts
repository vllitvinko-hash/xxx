import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Eased 0..1 (or from..to) ramp between two frames.
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

// Bouncy 0..1 entrance starting at frame `start`.
export const pop = (f: number, start: number, damping = 11) =>
  spring({ frame: f - start, fps: FPS, config: { damping, stiffness: 190, mass: 0.8 } });

// Settle without overshoot.
export const settle = (f: number, start: number) =>
  spring({ frame: f - start, fps: FPS, config: { damping: 200 } });

// Eyelid closure 0..1 for a quick blink every `period` frames.
export const blink = (f: number, period = 97, offset = 0) => {
  const p = (f + offset) % period;
  if (p < 3) return p / 3;
  if (p < 6) return (6 - p) / 3;
  return 0;
};

// Decaying shake for impacts.
export const shake = (f: number, start: number, dur = 10, amp = 14) =>
  f < start || f > start + dur ? 0 : Math.sin((f - start) * 2.9) * amp * (1 - (f - start) / dur);

export const visible = (f: number, from: number, to = Infinity) => f >= from && f < to;
