import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, ramp, shake } from "../anim";
import { Horse } from "../characters/Horse";
import { Legionary, Merchant, Senator } from "../characters/People";
import { C, FONT_DISPLAY } from "../format";
import { DiningRoom, Manger, Stable, Street, Table } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Title } from "../ui/Plates";
import { Bubble, PriceTag, VlogUI } from "../ui/Widgets";

const Couch: React.FC<{ x: number; y: number; from: number }> = ({ x, y, from }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const p = pop(f, from, 10);
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <rect x={-150} y={-90} width={300} height={70} rx={20} fill={C.purple} />
      <path d="M -170 -20 L -170 -150 Q -170 -170 -140 -160 L -120 -90 Z" fill={C.goldDark} />
      <rect x={-170} y={-30} width={340} height={30} rx={8} fill={C.goldDark} />
      <rect x={-160} y={0} width={20} height={50} fill={C.goldDark} />
      <rect x={140} y={0} width={20} height={50} fill={C.goldDark} />
      <ellipse cx={-90} cy={-100} rx={50} ry={22} fill="#e8c56a" />
    </g>
  );
};

// 0:22 — Incitatus shows off his marble stable, then the dinner guests, then the quiet street.
export const RoomTour: React.FC = () => {
  const f = useCurrentFrame();
  const L = lines("roomtour");

  if (f >= L.start(8) - 4) {
    // Soldiers enforce silence: the rooster gets cut off mid-crow.
    const crow = L.start(8) + 30;
    const shush = ramp(f, crow + 10, crow + 18);
    const clamp = ramp(f, crow + 22, crow + 28);
    return (
      <>
        <Stage camera={{ zoom: 1.08, x: shake(f, crow, 10, 6) }}>
          <Street />
          <Legionary x={760} y={1000} scale={1.05} shush={shush} />
          <Merchant x={1210} y={1000} scale={1.0} clamp={clamp} flip />
          {f > crow && f < crow + 24 && (
            <text x={1110} y={430} fontFamily={FONT_DISPLAY} fontSize={64} fill="#fff" stroke={C.ink} strokeWidth={10} paintOrder="stroke" transform="rotate(10 1110 430)">
              КУ-КА-РЕ…
            </text>
          )}
          {f > crow + 12 && f < L.start(9) && (
            <text x={560} y={300} fontFamily={FONT_DISPLAY} fontSize={84} fill="#fff" stroke={C.ink} strokeWidth={12} paintOrder="stroke" transform="rotate(-6 560 300)">
              ТСС!
            </text>
          )}
          <Bubble x={1180} y={200} r={150} from={L.start(9) - 2} tailTo={[1060, 400]}>
            <rect x={960} y={20} width={440} height={400} fill="#efe6d6" />
            <Horse x={1140} y={320} scale={0.38} outfit="blanket" lids={1} />
            <text x={1220} y={150} fontFamily={FONT_DISPLAY} fontSize={44} fill={C.purple}>
              z z z
            </text>
          </Bubble>
        </Stage>
        <Title text="ТСС! ИНЦИТАТ ОТДЫХАЕТ" from={L.start(9)} slot="bottom" size={92} />
      </>
    );
  }

  if (f >= L.start(7) - 4) {
    // Dinner guests: two senators sit across the table from the horse.
    const s = L.start(7) - 4;
    return (
      <>
        <Stage camera={{ zoom: 1.04 + (f - s) * 0.0015 }}>
          <DiningRoom />
          <Horse x={560} y={980} scale={0.9} outfit="blanket" collar headTilt={-6} />
          <Senator x={1130} y={980} scale={0.95} variant={1} expr="awkward" look={[-8, 0]} />
          <Senator x={1330} y={990} scale={0.95} variant={2} expr="worried" sweat look={[-8, 0]} flip />
          <Table x={1000} y={900} />
        </Stage>
        <Title text="ДА, У КОНЯ БЫЛИ ГОСТИ" from={L.start(7)} slot="top" size={88} />
      </>
    );
  }

  // The tour itself.
  const pan = ramp(f, L.start(6), L.start(6) + 16);
  return (
    <>
      <Stage camera={{ zoom: 1 + f * 0.0008, x: pan * 90 }}>
        <Stable />
        <PriceTag x={960} y={160} title="Мраморная конюшня" price="Цена: дорого" from={L.start(2)} to={L.start(3) + 6} tilt={-4} />
        {f >= L.start(3) && <Manger x={1290} y={960} scale={0.75 * pop(f, L.start(3), 10)} />}
        <Horse
          x={880}
          y={960}
          scale={0.95}
          outfit={f >= L.start(4) + 4 ? "blanket" : "none"}
          collar={f >= L.start(5) + 4}
          lids={f < L.start(1) ? 0.3 : 0.45}
        />
        <PriceTag x={1220} y={640} title="Кормушка: слоновая кость" price="Цена: очень дорого" from={L.start(3) + 6} to={L.start(4) + 10} tilt={5} />
        <PriceTag x={760} y={420} title="Попона цвета императора" price="Цена: ещё дороже" from={L.start(4) + 10} to={L.start(5) + 8} tilt={-5} />
        <PriceTag x={760} y={300} title="Ошейник с камнями" price="Цена: не спрашивай" from={L.start(5) + 8} to={L.start(6) + 12} tilt={4} />
        <Couch x={560} y={1060} from={L.start(6) + 4} />
        <PriceTag x={760} y={560} title="Дом, рабы, мебель" price="За счёт казны" from={L.start(6) + 12} tilt={-3} />
      </Stage>
      <VlogUI from={0} to={L.start(7)} />
      <Title text="ИНЦИТАТ — «СТРЕМИТЕЛЬНЫЙ»" from={L.start(0) + 10} to={L.start(2)} slot="bottom" size={74} />
    </>
  );
};
