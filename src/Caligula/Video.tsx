import "@fontsource/russo-one/cyrillic-400.css";
import "@fontsource/russo-one/latin-400.css";
import "@fontsource/rubik/cyrillic-600.css";
import "@fontsource/rubik/cyrillic-700.css";
import "@fontsource/rubik/cyrillic-800.css";
import "@fontsource/rubik/latin-600.css";
import "@fontsource/rubik/latin-700.css";
import "@fontsource/rubik/latin-800.css";
import "@fontsource/cormorant-sc/latin-700.css";
import "@fontsource/cormorant-sc/cyrillic-700.css";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence } from "remotion";
import { Format, FormatProvider } from "./format";
import { CaligulaIntro } from "./scenes/CaligulaIntro";
import { Finale } from "./scenes/Finale";
import { Hook } from "./scenes/Hook";
import { RoomTour } from "./scenes/RoomTour";
import { Twist } from "./scenes/Twist";
import { Why } from "./scenes/Why";
import { Sound } from "./Sound";
import { Subtitles } from "./Subtitles";
import { SceneId, sceneFrom, sceneTo } from "./timing";

const SCENES: [SceneId, React.FC][] = [
  ["hook", Hook],
  ["caligula", CaligulaIntro],
  ["roomtour", RoomTour],
  ["twist", Twist],
  ["why", Why],
  ["finale", Finale],
];

const FONTS = ["400 40px 'Russo One'", "700 40px 'Rubik'", "800 40px 'Rubik'", "600 40px 'Rubik'", "700 40px 'Cormorant SC'"];

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(FONTS.map((font) => document.fonts.load(font, "Аа Zz"))).then(() => continueRender(handle));
  }, [handle]);
};

export type CaligulaVideoProps = { format: Format; subtitles: boolean; sound: boolean };

export const CaligulaVideo: React.FC<CaligulaVideoProps> = ({ format, subtitles, sound }) => {
  useFonts();
  return (
    <FormatProvider format={format}>
      <AbsoluteFill style={{ background: "#000" }}>
        {SCENES.map(([id, Scene]) => (
          <Sequence key={id} name={id} from={sceneFrom(id)} durationInFrames={sceneTo(id) - sceneFrom(id)}>
            <Scene />
          </Sequence>
        ))}
        {subtitles && <Subtitles />}
        {sound && <Sound />}
      </AbsoluteFill>
    </FormatProvider>
  );
};
