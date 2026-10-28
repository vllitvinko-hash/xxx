import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, ramp, settle, shake } from "../anim";
import { Horse } from "../characters/Horse";
import { Caligula, Senator } from "../characters/People";
import { C, FONT_DISPLAY } from "../format";
import { Studio } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Chip, Title } from "../ui/Plates";
import { Plaque, Rewind, Stamp } from "../ui/Widgets";

// Times inside the twist scene, shared with the sound-effect cues.
export const twistCues = () => {
  const L = lines("twist");
  return {
    fake: L.start(0) + 30,
    rewind: L.start(1) - 2,
    upgrade: L.end(1) - 16,
  };
};

const Tier: React.FC<{ y: number; w: number; label: string; color: string; from: number }> = ({ y, w, label, color, from }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const p = settle(f, from);
  return (
    <g transform={`translate(0 ${(1 - p) * 60})`} opacity={p}>
      <rect x={960 - w / 2} y={y} width={w} height={170} rx={16} fill={color} stroke={C.ink} strokeWidth={6} />
      <text x={960} y={y + 112} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={64} fill="#fff" stroke={C.ink} strokeWidth={8} paintOrder="stroke">
        {label}
      </text>
    </g>
  );
};

// 0:44 — The "senator" plaque gets stamped FAKE, rewinds and levels up to CONSUL.
export const Twist: React.FC = () => {
  const f = useCurrentFrame();
  const L = lines("twist");
  const cue = twistCues();

  if (f >= L.start(2) - 4) {
    // The Roman ladder: senate < consuls < emperor, and the horse jumps to the top.
    const jump = ramp(f, L.start(4) + 20, L.start(4) + 44);
    // Ground at y 1060, top of the consuls tier at y 580.
    const hy = 1060 - jump * 480 - Math.sin(jump * Math.PI) * 160;
    const hx = 1330 - jump * 140;
    return (
      <>
        <Stage>
          <Studio from="#3f6fb0" to="#132544" />
          <Tier y={770} w={820} label="СЕНАТ" color="#8a8f98" from={L.start(2) - 2} />
          <Tier y={580} w={600} label="КОНСУЛЫ" color={C.purple} from={L.start(2) + 14} />
          <Tier y={390} w={440} label="ИМПЕРАТОР" color={C.gold} from={L.start(3)} />
          {f >= L.start(3) && (
            <g opacity={settle(f, L.start(3))} transform="translate(960 311) scale(0.3)">
              <Caligula x={0} y={0} expr="smirk" />
            </g>
          )}
          {[0, 1, 2, 3].map((i) => (
            <Senator key={i} x={640 + i * 160} y={1100} scale={0.45} variant={i} expr={jump > 0.5 ? "shock" : "neutral"} look={[6, -4]} />
          ))}
          {f >= L.start(4) && (
            <g transform={`translate(${hx} ${hy}) scale(${0.3 * pop(f, L.start(4), 12)}) translate(-880 -880)`}>
              <Horse x={880} y={880} outfit="toga" collar flip={jump < 0.5} />
            </g>
          )}
        </Stage>
        <Title text="КОНСУЛ > СЕНАТОР" from={L.start(2) + 4} to={L.start(4)} slot="top" size={96} />
        <Title text="КОНЬ — ВО ГЛАВЕ!" from={L.start(4) + 44} slot="top" color={C.gold} size={96} />
      </>
    );
  }

  const leveled = f >= cue.upgrade;
  const glow = leveled ? Math.max(0, 1 - (f - cue.upgrade) / 20) : 0;
  const k = leveled ? 1 + 0.25 * Math.max(0, 1 - (f - cue.upgrade) / 10) : 1;
  return (
    <>
      <Stage camera={{ zoom: 1.02, x: shake(f, cue.fake, 10, 18), y: shake(f, cue.fake + 1, 10, 10) }}>
        <Studio />
        <Horse x={820} y={1060} scale={0.95} outfit="toga" lids={f > cue.fake && f < cue.upgrade ? 0.05 : 0.45} mouth={f > cue.fake && f < cue.upgrade ? "open" : "smile"} collar={leveled} />
        <Plaque x={960} y={170} text={leveled ? "КОНСУЛ" : "СЕНАТОР"} glow={glow} scale={k} color={leveled ? C.purple : C.ink} />
        {!leveled && <Stamp x={960} y={180} text="ФЕЙК" from={cue.fake} size={110} />}
        {leveled &&
          Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const r = 200 + (f - cue.upgrade) * 14;
            return (
              <text key={i} x={960 + Math.cos(a) * r * 1.6} y={170 + Math.sin(a) * r} fontSize={50} fill={C.gold} opacity={glow} textAnchor="middle">
                ★
              </text>
            );
          })}
      </Stage>
      <Rewind from={cue.rewind} to={cue.rewind + 30} />
      {leveled && <Title text="LEVEL UP!" from={cue.upgrade} to={L.start(2) - 4} slot="center" color={C.gold} size={92} tilt={-8} />}
      <Chip text="Светоний, «Жизнь двенадцати цезарей», 55 · Кассий Дион, LIX.14" from={L.start(1) + 30} to={L.start(2) - 4} slot="bottom" />
    </>
  );
};
