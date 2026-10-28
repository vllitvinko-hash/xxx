import React from "react";
import { useCurrentFrame } from "remotion";
import { ramp, shake } from "../anim";
import { Horse } from "../characters/Horse";
import { Senator } from "../characters/People";
import { useFormat } from "../format";
import { Rostrum, SenateHall } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Title } from "../ui/Plates";

// 0:00 — The horse in a toga at the Senate rostrum, senators drop their scrolls.
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  const L = lines("hook");
  const drop = ramp(f, L.end(0) - 18, L.end(0) + 4);
  const shocked = f > L.end(0) - 14;
  // Slow push-in, a snap zoom onto the horse at "Так вот…", then a jolt on "ещё хуже".
  const snap = ramp(f, L.start(2) - 2, L.start(2) + 8);
  const back = ramp(f, L.start(3) + 2, L.start(3) + 12);
  const zoom = 1 + ramp(f, 0, L.start(2), 0, 0.08) + snap * (1 - back) * 0.75 + back * 0.12;
  const cam = {
    zoom,
    x: snap * (1 - back) * -180 + shake(f, L.start(3) + 2, 12, 16),
    y: snap * (1 - back) * 300 + back * 40,
  };
  return (
    <>
      <Stage camera={cam}>
        <SenateHall />
        {/* back-row senators on the benches */}
        <Senator x={140} y={700} scale={0.8} variant={1} expr={shocked ? "shock" : "neutral"} />
        <Senator x={1780} y={700} scale={0.8} variant={2} expr={shocked ? "shock" : "neutral"} flip />
        <Horse x={850} y={880} outfit="toga" scale={1.0} lids={snap > 0.5 && back < 0.5 ? 0.55 : 0.42} />
        <Rostrum x={960} y={960} />
        {/* front senators holding their scrolls */}
        <Senator x={600} y={1110} scale={0.95} variant={0} holdScroll scrollDrop={drop} expr={shocked ? "shock" : "neutral"} look={[6, -2]} />
        <Senator x={1330} y={1110} scale={0.95} variant={3} holdScroll scrollDrop={drop * 1.1} expr={shocked ? "shock" : "neutral"} look={[-6, -2]} flip />
      </Stage>
      {vertical && <Title text={"КОНЬ-СЕНАТОР —\nЭТО ФЕЙК.\nПРАВДА ХУЖЕ"} from={0} to={L.start(3)} slot="top" size={70} tilt={0} />}
      <Title text="КОНЬ-СЕНАТОР?!" from={2} to={L.start(2)} slot={vertical ? "bottom" : "top"} size={112} />
      <Title text="ВСЁ БЫЛО ЕЩЁ ХУЖЕ" from={L.start(3) + 8} slot={vertical ? "top" : "top"} color="#ff5a4a" size={104} tilt={2} />
    </>
  );
};
