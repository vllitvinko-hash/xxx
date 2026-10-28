import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pop, ramp } from "../anim";
import { Boy, Caligula, SoldierLegs } from "../characters/People";
import { C, FONT_TEXT } from "../format";
import { Camp, Throne, ThroneRoom } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Chip, Title } from "../ui/Plates";
import { FilmGrain, GameCard } from "../ui/Widgets";

// 0:08 — 37 AD, Caligula flops onto the throne; flashback to the boy in little boots.
export const CaligulaIntro: React.FC = () => {
  const f = useCurrentFrame();
  const L = lines("caligula");
  const flash = L.start(4) - 4;

  if (f >= flash) {
    const g = f - flash;
    const toBoots = ramp(f, L.start(5), L.start(5) + 20);
    return (
      <>
        <Stage
          filter="sepia(0.85) contrast(1.05) brightness(1.02)"
          camera={{ zoom: 1 + g * 0.0015 + toBoots * 0.55, y: toBoots * -260 }}
        >
          <Camp />
          <SoldierLegs x={420} y={940} scale={1.25} />
          <SoldierLegs x={1500} y={940} scale={1.25} />
          <SoldierLegs x={760} y={900} scale={1.0} />
          <SoldierLegs x={1180} y={900} scale={1.0} />
          <Boy x={960 + Math.min(g, 40) * 2 - 80} y={960} scale={1.15} step={g < 40 ? g * 0.5 : 0} />
          {toBoots > 0.3 && (
            <g opacity={ramp(f, L.start(5) + 6, L.start(5) + 14)}>
              <path d="M 1110 760 Q 1080 820 1030 870" stroke={C.ink} strokeWidth={8} fill="none" />
              <path d="M 1030 870 l 6 -32 l 24 20 Z" fill={C.ink} />
              <text x={1040} y={740} fontFamily={FONT_TEXT} fontWeight={700} fontSize={40} fill={C.ink}>
                caliga
              </text>
            </g>
          )}
        </Stage>
        <FilmGrain />
        <AbsoluteFill style={{ background: "#fff", opacity: ramp(f, flash, flash + 6, 0.9, 0), pointerEvents: "none" }} />
        <Chip text="Настоящее имя: Гай Юлий Цезарь Германик" from={L.start(4) + 6} to={L.start(5)} slot="top" />
        <Title text="«САПОЖОК»" from={L.start(5) + 4} slot="top" size={120} />
        <Chip text="caliga — солдатский сапог" from={L.start(5) + 16} />
      </>
    );
  }

  // Caligula drops from above onto the throne at "Императором становится Калигула".
  const land = L.start(1) + 4;
  const fall = pop(f, land - 8, 9);
  const y = f < land - 8 ? -900 : -900 + fall * 1600;
  const squash = f > land && f < land + 8 ? 1 - Math.sin(((f - land) / 8) * Math.PI) * 0.08 : 1;
  const wink = f > L.start(3) + 18 && f < L.start(3) + 40;
  return (
    <>
      <Stage camera={{ zoom: 1.05 + ramp(f, L.start(2), L.start(4), 0, 0.12) }}>
        <ThroneRoom />
        <Throne x={960} y={900} />
        <g transform={`translate(960 ${Math.min(y, 700)}) scale(1 ${squash}) translate(-960 -700)`}>
          <Caligula
            x={960}
            y={700}
            expr={wink ? "wink" : f > L.start(3) ? "smirk" : "neutral"}
            brow={f > L.start(3) ? 1 : 0}
            arm={f > L.start(2) + 10 ? "chin" : "rest"}
          />
        </g>
      </Stage>
      <Title text="37 г. н. э." from={2} to={L.start(1) + 2} slot="center" size={150} tilt={-2} />
      <GameCard
        from={land + 10}
        stats={[
          { label: "Власть", value: "неограниченная", at: L.start(2) + 24 },
          { label: "Чувство юмора", value: "своеобразное", at: L.start(3) + 14 },
        ]}
      />
    </>
  );
};
