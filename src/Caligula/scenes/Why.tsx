import React from "react";
import { useCurrentFrame } from "remotion";
import { ramp } from "../anim";
import { Horse } from "../characters/Horse";
import { Caligula, Senator } from "../characters/People";
import { C } from "../format";
import { Rostrum, SenateHall } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Title } from "../ui/Plates";
import { Bubble, Stamp } from "../ui/Widgets";

// 1:00 — Caligula smirks at the camera; the senators sweat and nod like dashboard toys.
export const Why: React.FC = () => {
  const f = useCurrentFrame();
  const L = lines("why");

  if (f >= L.start(4) - 4) {
    const freeze = f >= L.start(5) + 6;
    const nod = freeze ? 0 : Math.sin(f * 0.55) * 12;
    return (
      <>
        <Stage camera={{ zoom: 1.12 + ramp(f, L.start(5), L.start(5) + 30, 0, 0.1) }}>
          <SenateHall benches={false} />
          {[0, 1, 2].map((i) => (
            <Senator
              key={i}
              x={700 + i * 260}
              y={1090}
              scale={1.25}
              variant={[2, 0, 1][i]}
              nod={nod}
              sweat
              expr={freeze && i === 1 ? "shock" : "worried"}
              look={freeze ? [i === 0 ? 8 : i === 2 ? -8 : 0, -4] : [0, 3]}
            />
          ))}
        </Stage>
        <Title text="ДА-ДА, КОНЕЧНО!" from={L.start(4) + 4} to={L.start(5)} slot="top" size={96} />
        <Title text="СПОРИТЬ? НЕТ, СПАСИБО" from={L.start(5) + 6} slot="top" color="#ff5a4a" size={84} />
      </>
    );
  }

  return (
    <>
      <Stage camera={{ zoom: 1 + f * 0.0012 }}>
        <g style={{ filter: "blur(3px)" }}>
          <SenateHall />
        </g>
        <Caligula
          x={960}
          y={1000}
          scale={1.35}
          expr={f > L.start(1) ? "smirk" : "neutral"}
          brow={f > L.start(2) ? 1 : 0.3}
          look={[0, 3]}
          arm={f > L.start(3) ? "point" : "rest"}
        />
        <Bubble x={1190} y={230} r={150} from={L.start(3) + 4} tailTo={[1070, 420]}>
          <rect x={1030} y={70} width={320} height={320} fill="#efe6d6" />
          <g transform="translate(1175 355) scale(0.27) translate(-960 -960)">
            <Horse x={880} y={880} outfit="toga" />
            <Rostrum x={960} y={960} />
          </g>
          <Stamp x={1190} y={320} text="ОДОБРЕНО" from={L.start(3) + 40} size={28} color="#1f7a3a" />
        </Bubble>
      </Stage>
      <Title text="ЗАЧЕМ?" from={L.start(0)} to={L.start(1)} slot="top" size={130} />
      <Title text="ЭТО ТРОЛЛИНГ" from={L.start(1) + 18} to={L.start(3)} slot="top" color={C.gold} size={104} />
    </>
  );
};
