import React from "react";
import { AbsoluteFill } from "remotion";
import { Horse } from "./characters/Horse";
import { Senator } from "./characters/People";
import { Format, FormatProvider } from "./format";
import { Rostrum, SenateHall } from "./Sets";
import { Stage } from "./Stage";
import { Title } from "./ui/Plates";
import { Stamp } from "./ui/Widgets";

// Thumbnail / first frame: «Конь-сенатор — это фейк. Правда хуже».
export const Cover: React.FC<{ format: Format }> = ({ format }) => (
  <FormatProvider format={format}>
    <AbsoluteFill>
      <Stage camera={{ zoom: format === "vertical" ? 1 : 1.1, y: format === "vertical" ? 0 : 60 }}>
        <SenateHall />
        <Horse x={850} y={880} outfit="toga" collar scale={1.0} />
        <Rostrum x={960} y={960} />
        <Senator x={600} y={1110} scale={0.95} variant={0} expr="shock" look={[6, -2]} />
        <Senator x={1330} y={1110} scale={0.95} variant={3} expr="shock" look={[-6, -2]} flip />
        <Stamp x={960} y={760} text="ФЕЙК" from={-30} size={130} />
      </Stage>
      <Title text={"КОНЬ-СЕНАТОР —\nЭТО ФЕЙК"} from={-60} slot="top" size={format === "vertical" ? 96 : 104} tilt={0} />
      <Title text="ПРАВДА ХУЖЕ" from={-60} slot="bottom" size={format === "vertical" ? 110 : 96} color="#ff5a4a" tilt={-2} />
    </AbsoluteFill>
  </FormatProvider>
);
