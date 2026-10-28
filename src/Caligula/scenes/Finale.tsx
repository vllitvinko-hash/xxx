import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pop, ramp } from "../anim";
import { Horse } from "../characters/Horse";
import { Caligula, Praetorian } from "../characters/People";
import { C, FONT_DISPLAY, FONT_TEXT, useFormat } from "../format";
import { Studio, Sunset, Throne, ThroneRoom } from "../Sets";
import { Stage } from "../Stage";
import { lines } from "../timing";
import { Title } from "../ui/Plates";
import { Plaque, Stamp } from "../ui/Widgets";

export const finaleCues = () => {
  const L = lines("finale");
  return { cancel: L.end(0) - 6, wreath: L.start(1) + 30 };
};

const Scroll: React.FC<{ x: number; y: number; name: string; from: number; tilt: number }> = ({ x, y, name, from, tilt }) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const p = pop(f, from, 10);
  const shrug = Math.sin((f - from) / 6) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${p}) rotate(${tilt + shrug})`}>
      <rect x={-140} y={-220} width={280} height={440} fill="#f3e2b5" stroke="#b08a4a" strokeWidth={6} />
      <rect x={-170} y={-250} width={340} height={44} rx={22} fill="#c9a35c" />
      <rect x={-170} y={206} width={340} height={44} rx={22} fill="#c9a35c" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-100} y={-140 + i * 50} width={i % 2 ? 160 : 200} height={12} rx={6} fill="#c7b07a" />
      ))}
      <text x={0} y={-300} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight={700} fontSize={42} fill="#fff" stroke={C.ink} strokeWidth={8} paintOrder="stroke">
        {name}
      </text>
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={200} fill={C.purple} opacity={ramp(f, from + 10, from + 18)}>
        ?
      </text>
    </g>
  );
};

const Wave: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const s = Math.sin(f / 10) * 10;
  return (
    <g transform={`translate(${x} ${y + s})`}>
      <path d="M -260 300 C -260 40 -60 -200 160 -180 C 60 -120 20 -40 70 30 C 110 -40 190 -50 240 -10 C 260 120 260 220 260 300 Z" fill="#2f7fc4" />
      <path d="M -200 300 C -200 100 -40 -120 120 -150 C 40 -90 0 -20 40 60 C 0 120 -60 200 -60 300 Z" fill="#5aa8e6" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={60 + i * 40} cy={-160 + i * 30} r={20 - i * 3} fill="#fff" />
      ))}
    </g>
  );
};

// 1:15 — No consulship, the praetorians, silent sources, a dignified retirement, end card.
export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const vertical = useFormat() === "vertical";
  const L = lines("finale");
  const cue = finaleCues();

  if (f >= L.start(4) - 4) {
    const s = L.start(4) - 4;
    return (
      <>
        <Stage camera={{ zoom: 1 + (f - s) * 0.0008 }}>
          <Studio from="#2c8fbf" to="#0e2f4a" />
          <rect x={-400} y={880} width={2720} height={700} fill="#1d5f93" />
          <Caligula x={760} y={760} scale={0.9} arm="point" expr="smirk" brow={1} look={[6, 0]} />
          <Wave x={1260} y={700} />
        </Stage>
        <Title text="ВОЙНА С МОРЕМ" from={s + 6} to={vertical ? L.end(4) + 6 : Infinity} slot="top" size={110} color="#9fe0ff" />
        <Title text={"→ полное видео на канале"} from={s + 24} slot="bottom" size={62} tilt={0} />
        {vertical && (
          <Title text={"А какую должность\nты дал бы своему коту?"} from={L.end(4) + 6} slot="top" size={64} tilt={0} color="#ffe08a" />
        )}
      </>
    );
  }

  if (f >= L.start(3) - 4) {
    // Into the sunset, then a glance back at the camera during the silence.
    const s = L.start(3) - 4;
    const t = f - s;
    const walkX = 560 + Math.min(t, 75) * 5;
    const turned = t > 70;
    return (
      <Stage camera={{ zoom: 1.05 }}>
        <Sunset />
        <Horse x={walkX} y={1020} scale={0.62} outfit="blanket" collar walk={turned ? undefined : 0} lookBack={turned} lids={0.5} />
      </Stage>
    );
  }

  if (f >= L.start(2) - 4) {
    return (
      <>
        <Stage>
          <Studio from="#c79a4a" to="#5a3b16" />
          <Scroll x={760} y={600} name="Светоний" from={L.start(2) - 2} tilt={-6} />
          <Scroll x={1160} y={600} name="Кассий Дион" from={L.start(2) + 6} tilt={6} />
        </Stage>
        <Title text="ИСТОЧНИКИ МОЛЧАТ" from={L.start(2) + 10} slot="top" size={96} />
      </>
    );
  }

  if (f >= L.start(1) - 4) {
    // 41 AD: no violence on screen — an empty throne, a fallen wreath, silhouettes in the doorway.
    const fall = ramp(f, cue.wreath, cue.wreath + 14);
    return (
      <>
        <Stage filter="brightness(0.55) saturate(0.8)" camera={{ zoom: 1.08 + (f - L.start(1)) * 0.001 }}>
          <ThroneRoom />
          <Throne x={960} y={900} />
          <Praetorian x={600} y={960} scale={1.05} opacity={ramp(f, L.start(1), L.start(1) + 20)} />
          <Praetorian x={1330} y={960} scale={1.05} opacity={ramp(f, L.start(1) + 6, L.start(1) + 26)} />
          <g transform={`translate(${960 + fall * 60} ${620 + fall * 300}) rotate(${fall * 160})`}>
            <ellipse cx={0} cy={0} rx={90} ry={34} fill="none" stroke="#5e8c3a" strokeWidth={18} strokeDasharray="22 8" />
          </g>
        </Stage>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, #000c 100%)" }} />
        <Title text="41 г. н. э." from={L.start(1)} slot="top" size={120} color="#ffd1c8" />
      </>
    );
  }

  return (
    <>
      <Stage>
        <Studio />
        <Horse x={820} y={1060} scale={0.95} outfit="toga" collar lids={f > cue.cancel ? 0.05 : 0.45} mouth={f > cue.cancel ? "open" : "smile"} />
        <Plaque x={960} y={170} text="КОНСУЛ" color={C.purple} />
        {/* loading bar that never reaches 100% */}
        <rect x={700} y={290} width={520} height={34} rx={17} fill="#ffffff33" />
        <rect x={700} y={290} width={520 * Math.min(0.99, ramp(f, 4, cue.cancel - 4, 0, 0.99))} height={34} rx={17} fill={C.gold} />
        <text x={960} y={370} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={36} fill="#fff">
          {Math.round(Math.min(0.99, ramp(f, 4, cue.cancel - 4, 0, 0.99)) * 100)}%
        </text>
        <Stamp x={960} y={180} text="ОТМЕНЕНО" from={cue.cancel} size={84} />
      </Stage>
    </>
  );
};
