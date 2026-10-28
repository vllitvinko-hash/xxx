import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { finaleCues } from "./scenes/Finale";
import { twistCues } from "./scenes/Twist";
import { allLines, at, atEnd, lines, sceneFrom, sec, TOTAL_FRAMES } from "./timing";

type Cue = { at: number; sfx: string; volume?: number };

const cues = (): Cue[] => {
  const rel = (id: Parameters<typeof sceneFrom>[0], frame: number) => sceneFrom(id) + frame;
  const cal = lines("caligula");
  const land = cal.start(1) + 4;
  const tour = lines("roomtour");
  const crow = tour.start(8) + 30;
  const tw = twistCues();
  const twist = lines("twist");
  const why = lines("why");
  const fin = finaleCues();
  const finale = lines("finale");
  return [
    // hook
    { at: 2, sfx: "pop" },
    { at: atEnd("hook", 0, -0.5), sfx: "scrolls" },
    { at: at("hook", 2), sfx: "whoosh" },
    { at: at("hook", 3) + 8, sfx: "stamp" },
    // caligula
    { at: sceneFrom("caligula"), sfx: "whoosh" },
    { at: rel("caligula", 2), sfx: "stamp" },
    { at: rel("caligula", land - 10), sfx: "whoosh" },
    { at: rel("caligula", land), sfx: "stamp" },
    { at: rel("caligula", land + 10), sfx: "levelup", volume: 0.5 },
    { at: rel("caligula", cal.start(2) + 24), sfx: "pop" },
    { at: rel("caligula", cal.start(3) + 14), sfx: "pop" },
    { at: rel("caligula", cal.start(4) - 4), sfx: "whoosh" },
    { at: rel("caligula", cal.start(5) + 4), sfx: "pop" },
    // room tour
    { at: sceneFrom("roomtour"), sfx: "whoosh" },
    { at: rel("roomtour", tour.start(2)), sfx: "ding" },
    { at: rel("roomtour", tour.start(3) + 6), sfx: "ding" },
    { at: rel("roomtour", tour.start(4) + 10), sfx: "ding" },
    { at: rel("roomtour", tour.start(5) + 8), sfx: "ding" },
    { at: rel("roomtour", tour.start(6) + 12), sfx: "ding" },
    { at: rel("roomtour", tour.start(7) - 4), sfx: "whoosh" },
    { at: rel("roomtour", tour.start(7)), sfx: "pop" },
    { at: rel("roomtour", tour.start(8) - 4), sfx: "whoosh" },
    { at: rel("roomtour", crow), sfx: "squawk" },
    { at: rel("roomtour", crow + 10), sfx: "shh", volume: 0.6 },
    { at: rel("roomtour", tour.start(9) - 2), sfx: "pop" },
    // twist
    { at: sceneFrom("twist"), sfx: "whoosh" },
    { at: rel("twist", tw.fake - 3), sfx: "scratch", volume: 0.6 },
    { at: rel("twist", tw.fake), sfx: "stamp" },
    { at: rel("twist", tw.rewind), sfx: "rewind", volume: 0.7 },
    { at: rel("twist", tw.upgrade), sfx: "levelup" },
    { at: rel("twist", twist.start(2) - 4), sfx: "whoosh" },
    { at: rel("twist", twist.start(3)), sfx: "pop" },
    { at: rel("twist", twist.start(4) + 44), sfx: "levelup", volume: 0.6 },
    // why
    { at: sceneFrom("why"), sfx: "whoosh" },
    { at: rel("why", why.start(3) + 4), sfx: "pop" },
    { at: rel("why", why.start(3) + 34), sfx: "stamp", volume: 0.6 },
    { at: rel("why", why.start(4) - 4), sfx: "whoosh" },
    { at: rel("why", why.start(5) + 6), sfx: "gulp" },
    // finale
    { at: sceneFrom("finale"), sfx: "whoosh" },
    { at: rel("finale", fin.cancel), sfx: "stamp" },
    { at: rel("finale", finale.start(1) - 4), sfx: "whoosh" },
    { at: rel("finale", fin.wreath + 14), sfx: "stamp", volume: 0.4 },
    { at: rel("finale", finale.start(2) - 4), sfx: "whoosh" },
    { at: rel("finale", finale.start(2) + 10), sfx: "pop" },
    { at: rel("finale", finale.start(4) - 4), sfx: "whoosh" },
    { at: rel("finale", finale.start(4) + 6), sfx: "levelup", volume: 0.5 },
  ];
};

const speech = allLines();

// Music ducks under the voice and drops out for the "retirement" joke.
const musicVolume = (f: number) => {
  const t = f / 30;
  const talking = speech.some((p) => t > p.start - 0.15 && t < p.end + 0.15);
  let v = talking ? 0.1 : 0.2;
  const silenceFrom = at("finale", 3);
  const silenceTo = at("finale", 4) - 6;
  if (f >= silenceFrom - 10 && f < silenceTo) v *= interpolate(f, [silenceFrom - 10, silenceFrom], [1, 0], { extrapolateRight: "clamp" });
  if (f >= silenceTo && f < silenceTo + 10) v *= interpolate(f, [silenceTo, silenceTo + 10], [0, 1]);
  v *= interpolate(f, [0, 8, TOTAL_FRAMES - 25, TOTAL_FRAMES], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  return v;
};

export const Sound: React.FC = () => (
  <>
    <Audio src={staticFile("voice.wav")} />
    <Audio src={staticFile("music.mp3")} volume={musicVolume} />
    {cues().map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.at)} durationInFrames={sec(1.5)} layout="none">
        <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.volume ?? 0.45} />
      </Sequence>
    ))}
  </>
);
