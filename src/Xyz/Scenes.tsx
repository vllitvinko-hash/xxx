import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, MONO, SANS, Title, clamp } from "../brand";
import { SEPIA, SERIF, SceneProps } from "../Abc/ScenesA";
import { BOUNDS, HOOK, MATRIX, PATTERNS, PEARSON, SAME } from "./content";

const useSpring = (at: number, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping } });
};

// ---------- Сцена 1: пусто и завалено ----------
export const Hook: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 60, c2 = 120] = cue;
  const empty = useSpring(10, 9);
  const dust = useSpring(c1, 12);
  const q = useSpring(c2, 8);
  // полка видна с первого кадра; пустое место «моргает»
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 7));

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          letterSpacing: "-0.03em",
        }}
      >
        <span style={{ background: C.red, color: "#fff", padding: "0 14px" }}>
          Пусто
        </span>{" "}
        <span style={{ color: C.ink }}>и</span>{" "}
        <span
          style={{
            background: C.tag,
            color: C.ink,
            padding: "0 14px",
            opacity: 0.25 + 0.75 * dust,
          }}
        >
          завалено
        </span>
      </div>

      {/* Полка с пустым местом */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 420,
          width: 450,
          height: 820,
          background: C.paper,
          border: `5px solid ${C.ink}`,
        }}
      >
        {[0, 1, 2].map((r) => (
          <React.Fragment key={r}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 250 + r * 270,
                height: 16,
                background: C.shelf,
                borderTop: `4px solid ${C.ink}`,
              }}
            />
            {[0, 1, 2].map((k) => {
              const isEmpty = r === 1 && k === 1;
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: 24 + k * 140,
                    top: 250 + r * 270 - 170,
                    width: 115,
                    height: 170,
                    background: isEmpty
                      ? "transparent"
                      : r === 1
                        ? C.tag
                        : C.bg,
                    border: isEmpty
                      ? `5px dashed ${C.red}`
                      : `4px solid ${C.ink}`,
                    opacity: isEmpty ? blink : 1,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `rotate(-6deg) scale(${interpolate(empty, [0, 1], [1.8, 1])})`,
              opacity: Math.min(1, empty),
              background: C.red,
              color: "#fff",
              border: `4px solid ${C.ink}`,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 30,
              padding: "8px 16px",
              whiteSpace: "nowrap",
            }}
          >
            {HOOK.empty}
          </div>
        </div>
      </div>

      {/* Заваленный склад */}
      <svg
        width={470}
        height={820}
        style={{ position: "absolute", left: 560, top: 420 }}
      >
        <rect
          x={0}
          y={790}
          width={470}
          height={30}
          fill={C.shelf}
          stroke={C.ink}
          strokeWidth={4}
        />
        {[
          [10, 640, 150, 150],
          [160, 640, 150, 150],
          [310, 650, 150, 140],
          [40, 490, 140, 150],
          [190, 500, 150, 140],
          [330, 520, 130, 130],
          [80, 350, 140, 140],
          [230, 360, 140, 140],
          [140, 220, 140, 130],
          [300, 250, 120, 110],
          [180, 100, 120, 120],
        ].map(([x, y, w, h], i) => (
          <g
            key={i}
            transform={`rotate(${((i * 37) % 9) - 4} ${x + w / 2} ${y + h / 2})`}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={SEPIA.light}
              stroke={C.ink}
              strokeWidth={4}
            />
            <line
              x1={x}
              y1={y + h / 2}
              x2={x + w}
              y2={y + h / 2}
              stroke={SEPIA.mid}
              strokeWidth={6}
            />
          </g>
        ))}
        {/* пыль и паутина */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 97) % 470}
            cy={90 + ((i * 53) % 700)}
            r={3 + (i % 3)}
            fill={C.ink2}
            opacity={0.35 * dust}
          />
        ))}
        <path
          d="M 180 100 Q 230 60 300 100 M 200 100 L 240 70 L 280 100 M 240 70 L 240 100"
          stroke={C.ink2}
          strokeWidth={2}
          fill="none"
          opacity={dust}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 560,
          width: 470,
          top: 1260,
          textAlign: "center",
          opacity: dust,
        }}
      >
        <span
          style={{
            background: C.ink,
            color: C.tag,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 30,
            padding: "8px 16px",
          }}
        >
          {HOOK.stock}
        </span>
      </div>

      {/* «Знакомо?» */}
      {frame >= c2 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              background: C.tag,
              border: `6px solid ${C.ink}`,
              boxShadow: `10px 10px 0 ${C.ink}`,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 150,
              color: C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${q}) rotate(${(1 - q) * 30}deg)`,
            }}
          >
            ?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Сцена 2: все закупают одинаково ----------
const SPARKS = [
  [5, 5, 5, 5, 5, 5, 5, 5],
  [5, 5, 4.6, 5, 5.2, 5, 4.8, 5],
  [1, 2, 6, 9, 9, 5, 1, 0],
  [0, 0, 0, 0, 0, 1, 9, 0],
];

const Spark: React.FC<{ data: number[]; draw: number; color: string }> = ({
  data,
  draw,
  color,
}) => {
  const w = 190;
  const h = 70;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / 10) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h + 6}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};

export const Same: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 70, c2 = 150] = cue;
  const doc = useSpring(c0 + 2, 14);
  const strike = interpolate(frame, [c1, c1 + 12], [0, 1], clamp);
  const stamp = useSpring(c1 + 14, 8);
  const draw = interpolate(frame, [c2 + 4, c2 + 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      <Title text={SAME.headline} top={150} size={74} />
      {/* отговорки */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {SAME.excuses.map((e, i) => {
          const s = spring({
            frame: frame - c0 - 10 - i * 8,
            fps: 30,
            config: { damping: 12 },
          });
          return (
            <span
              key={e}
              style={{
                position: "relative",
                transform: `scale(${s})`,
                background: C.paper,
                border: `4px solid ${C.ink}`,
                padding: "10px 24px",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 38,
                color: C.ink2,
              }}
            >
              {e}
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  height: 6,
                  width: `calc(${strike * 100}% - 20px)`,
                  background: C.red,
                }}
              />
            </span>
          );
        })}
      </div>

      {/* накладная */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 80,
          width: 920,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          padding: "30px 40px 36px",
          opacity: doc,
          transform: `translateY(${(1 - doc) * 100}px) rotate(-1deg)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: C.ink2,
            borderBottom: `3px dashed ${C.line}`,
            paddingBottom: 14,
          }}
        >
          <span>{SAME.doc}</span>
          <span>ЗАКАЗ</span>
        </div>
        {SAME.rows.map((r, i) => (
          <div
            key={r}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 0",
              borderBottom:
                i < SAME.rows.length - 1 ? `2px solid ${C.line}` : "none",
              fontFamily: MONO,
              fontSize: 36,
              color: C.ink,
            }}
          >
            <span style={{ width: 360, fontWeight: 700 }}>{r}</span>
            <span style={{ opacity: draw }}>
              <Spark
                data={SPARKS[i]}
                draw={draw}
                color={i < 2 ? C.green : i === 2 ? "#C98A00" : C.red}
              />
            </span>
            <span style={{ fontWeight: 700 }}>{SAME.qty}</span>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -40,
            transform: `rotate(-8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
            opacity: Math.min(1, stamp),
            border: `6px solid ${C.red}`,
            color: C.red,
            background: "rgba(255,255,255,0.85)",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 50,
            padding: "6px 22px",
          }}
        >
          {SAME.stamp}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 30,
          color: C.ink2,
          opacity: draw,
        }}
      >
        ПРОДАЖИ ЗА ГОД — СОВСЕМ РАЗНЫЕ
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 3: X — ровно · Y — волной · Z — хаос ----------
const SERIES = [
  [50, 52, 49, 51, 50, 53, 48, 51, 50, 52, 49, 51],
  [28, 40, 58, 70, 62, 44, 30, 38, 58, 74, 60, 40],
  [5, 0, 0, 44, 0, 3, 0, 0, 60, 0, 0, 10],
];
const SERIES_COLOR = [C.green, "#C98A00", C.red];

export const Patterns: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const starts = [cue[1] ?? 70, cue[2] ?? 140, cue[3] ?? 210];
  const active = starts.reduce((a, s, i) => (frame >= s - 2 ? i : a), -1);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: "-0.02em",
        }}
      >
        {PATTERNS.headline.map((h, i) => (
          <React.Fragment key={h}>
            {i > 0 && <span style={{ color: C.ink2 }}> · </span>}
            <span
              style={{
                padding: "0 8px",
                background: active === i ? SERIES_COLOR[i] : "transparent",
                color: active === i ? "#fff" : C.ink,
                opacity: active >= i ? 1 : 0.3,
              }}
            >
              {h}
            </span>
          </React.Fragment>
        ))}
      </div>
      {PATTERNS.items.map((it, i) => (
        <PatternCard key={it.key} index={i} start={starts[i]} item={it} />
      ))}
    </AbsoluteFill>
  );
};

const PatternCard: React.FC<{
  index: number;
  start: number;
  item: (typeof PATTERNS.items)[number];
}> = ({ index, start, item }) => {
  const frame = useCurrentFrame();
  const s = useSpring(start, 14);
  const draw = interpolate(frame, [start + 6, start + 40], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const data = SERIES[index];
  const W = 560;
  const H = 200;
  const max = 80;
  const pts = data
    .map((v, k) => `${(k / (data.length - 1)) * W},${H - (v / max) * H}`)
    .join(" ");
  const color = SERIES_COLOR[index];
  return (
    <div
      style={{
        position: "absolute",
        top: 330 + index * 340,
        left: 60,
        width: 960,
        height: 300,
        background: C.paper,
        border: `5px solid ${C.ink}`,
        boxShadow: `10px 10px 0 ${C.ink}`,
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 30px",
        opacity: Math.min(1, s * 1.2) * 0.9 + 0.1 * (frame >= start ? 1 : 0),
        transform: `translateX(${(1 - s) * -400}px)`,
      }}
    >
      <div style={{ width: 300 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 120,
            lineHeight: 1,
            color,
          }}
        >
          {item.key}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 36,
            color: C.ink,
            marginTop: 6,
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 24,
            color: C.ink2,
            marginTop: 6,
          }}
        >
          {item.example}
        </div>
      </div>
      <svg width={W} height={H + 10}>
        <line x1={0} y1={H} x2={W} y2={H} stroke={C.line} strokeWidth={4} />
        <polyline
          points={pts}
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
      </svg>
    </div>
  );
};

// ---------- Сцена 4: Карл Пирсон, 1896 ----------
export const Pearson: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 90, c2 = 200] = cue;
  const cards = useSpring(c0 + 4, 13);
  const qm = useSpring(c0 + 40, 8);
  const person = useSpring(c1, 13);
  const paper = useSpring(c2, 13);
  const stamp = useSpring(c2 + 16, 8);

  const card = (name: string, meta: string, ok: boolean) => (
    <div
      style={{
        flex: 1,
        background: ok ? C.paper : C.bg,
        border: `5px ${ok ? "solid" : "dashed"} ${C.ink}`,
        padding: "20px 24px",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 64,
          color: C.ink,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 24,
          color: C.ink2,
          marginTop: 4,
        }}
      >
        {meta}
      </div>
      <div
        style={{
          position: "absolute",
          right: -18,
          top: -26,
          width: 76,
          height: 76,
          borderRadius: 38,
          background: ok ? C.green : C.red,
          border: `4px solid ${C.ink}`,
          color: "#fff",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${ok ? cards : qm})`,
        }}
      >
        {ok ? "✓" : "?"}
      </div>
    </div>
  );

  // точки «скачут» вокруг среднего
  const dots = Array.from({ length: 14 }).map((_, i) => {
    const amp = [10, 50, 18, 70, 30, 6, 60, 22, 44, 12, 66, 28, 8, 40][i];
    const sign = i % 2 ? 1 : -1;
    const t = interpolate(
      frame,
      [c2 + 20 + i * 3, c2 + 34 + i * 3],
      [0, 1],
      clamp,
    );
    return { x: 40 + i * 58, y: 120 + sign * amp * t };
  });

  return (
    <AbsoluteFill>
      <Title text={PEARSON.headline} top={160} size={72} />
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 70,
          right: 70,
          display: "flex",
          gap: 30,
          opacity: cards,
          transform: `translateY(${(1 - cards) * 40}px)`,
        }}
      >
        {card(PEARSON.abc.name, PEARSON.abc.meta, true)}
        {card(PEARSON.xyz.name, PEARSON.xyz.meta, false)}
      </div>
      {/* Пирсон */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 70,
          width: 940,
          display: "flex",
          alignItems: "center",
          gap: 30,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          boxShadow: `10px 10px 0 ${C.ink}`,
          padding: "22px 34px",
          opacity: person,
          transform: `translateX(${(1 - person) * 500}px)`,
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            background: C.tag,
            border: `5px solid ${C.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 58,
            flexShrink: 0,
          }}
        >
          {PEARSON.person.initials}
        </div>
        <div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              color: C.ink,
            }}
          >
            {PEARSON.person.name}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 26,
              color: C.ink2,
              marginTop: 6,
            }}
          >
            {PEARSON.person.years}
          </div>
        </div>
      </div>
      {/* рукописная формула */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 90,
          width: 900,
          background: SEPIA.paper,
          border: `4px solid ${C.ink}`,
          padding: "26px 36px 20px",
          transform: `rotate(-1.5deg) translateY(${(1 - paper) * 160}px)`,
          opacity: paper,
          color: "#2B1E10",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 76,
            textAlign: "center",
          }}
        >
          {PEARSON.formula}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            textAlign: "center",
            color: SEPIA.dark,
          }}
        >
          {PEARSON.formulaNote}
        </div>
        <svg
          width={828}
          height={240}
          style={{ display: "block", marginTop: 6 }}
        >
          <line
            x1={20}
            y1={120}
            x2={808}
            y2={120}
            stroke={SEPIA.dark}
            strokeWidth={3}
            strokeDasharray="10 8"
          />
          <text
            x={24}
            y={104}
            textAnchor="start"
            fontFamily={MONO}
            fontSize={22}
            fill={SEPIA.dark}
          >
            среднее
          </text>
          {dots.map((d, i) => (
            <g key={i}>
              <line
                x1={d.x}
                y1={120}
                x2={d.x}
                y2={d.y}
                stroke={C.red}
                strokeWidth={3}
                opacity={0.6}
              />
              <circle cx={d.x} cy={d.y} r={11} fill={C.ink} />
            </g>
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            right: -24,
            top: -44,
            transform: `rotate(8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
            opacity: Math.min(1, stamp),
            border: `6px solid ${C.red}`,
            color: C.red,
            background: "rgba(255,255,255,0.8)",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 64,
            padding: "2px 20px",
          }}
        >
          {PEARSON.year}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 5: границы — не догма ----------
export const Bounds: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 80, c2 = 170] = cue;
  const table = useSpring(c0 + 4, 14);
  const cross = interpolate(frame, [c2 + 4, c2 + 20], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const stamp = useSpring(c2 + 22, 8);
  const COLW = [230, 230, 230, 230];

  return (
    <AbsoluteFill>
      <Title text={BOUNDS.headline} top={170} size={78} />
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 80,
          width: 920,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          opacity: table,
          transform: `translateY(${(1 - table) * 80}px)`,
        }}
      >
        {[BOUNDS.head, ...BOUNDS.rows].map((row, ri) => {
          const rowOn = ri === 0 || frame >= (ri === 1 ? c0 + 20 : c1 + 6);
          return (
            <div
              key={ri}
              style={{
                display: "flex",
                borderBottom:
                  ri < BOUNDS.rows.length ? `3px solid ${C.ink}` : "none",
                background: ri === 0 ? C.ink : "transparent",
                opacity: rowOn ? 1 : 0,
              }}
            >
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  style={{
                    width: COLW[ci],
                    padding: "34px 20px",
                    fontFamily: ri === 0 ? SANS : ci === 0 ? MONO : SANS,
                    fontWeight: ri === 0 ? 900 : ci === 0 ? 700 : 800,
                    fontSize: ri === 0 ? 56 : ci === 0 ? 28 : 40,
                    whiteSpace: "nowrap",
                    color: ri === 0 ? C.tag : ci === 1 ? C.green : C.ink,
                    textAlign: ci === 0 ? "left" : "center",
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          );
        })}
        {/* перечёркивание */}
        <svg
          width={920}
          height={420}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          <line
            x1={20}
            y1={30}
            x2={20 + 880 * cross}
            y2={30 + 360 * cross}
            stroke={C.red}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <line
            x1={900}
            y1={30}
            x2={900 - 880 * cross}
            y2={30 + 360 * cross}
            stroke={C.red}
            strokeWidth={12}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `rotate(-4deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
            opacity: Math.min(1, stamp),
            background: C.tag,
            border: `6px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.ink}`,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 54,
            padding: "14px 34px",
            color: C.ink,
          }}
        >
          {BOUNDS.stamp}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 6: сетка ABC × XYZ ----------
const CELL = 250;
const GRID_LEFT = 175;
const GRID_TOP = 420;

export const Matrix: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 110, c3 = 220, c4 = 300] = cue;
  const [gold, out] = MATRIX.headline.split(" · ");

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 58,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        <span
          style={{
            background: frame >= c2 ? C.tag : "transparent",
            padding: "0 10px",
            opacity: frame >= c2 ? 1 : 0.3,
          }}
        >
          {gold}
        </span>
        <span style={{ color: C.ink2 }}> · </span>
        <span
          style={{
            background: frame >= c3 ? C.red : "transparent",
            color: frame >= c3 ? "#fff" : C.ink,
            padding: "0 10px",
            opacity: frame >= c3 ? 1 : 0.3,
          }}
        >
          {out}
        </span>
      </div>
      {/* подписи осей */}
      {MATRIX.cols.map((c, i) => (
        <div
          key={c}
          style={{
            position: "absolute",
            top: GRID_TOP - 80,
            left: GRID_LEFT + i * CELL,
            width: CELL,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            color: [C.green, "#C98A00", C.red][i],
            opacity: interpolate(
              frame,
              [c0 + 4 + i * 4, c0 + 12 + i * 4],
              [0, 1],
              clamp,
            ),
          }}
        >
          {c}
        </div>
      ))}
      {MATRIX.rows.map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: GRID_TOP + i * CELL,
            left: GRID_LEFT - 110,
            height: CELL,
            width: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            color: C.ink,
            opacity: interpolate(
              frame,
              [c0 + 4 + i * 4, c0 + 12 + i * 4],
              [0, 1],
              clamp,
            ),
          }}
        >
          {r}
        </div>
      ))}
      {MATRIX.rows.map((r, ri) =>
        MATRIX.cols.map((c, ci) => {
          const idx = ri * 3 + ci;
          const on = interpolate(
            frame,
            [c1 + idx * 4, c1 + idx * 4 + 8],
            [0, 1],
            clamp,
          );
          const isGold = ri === 0 && ci === 0;
          const isOut = ri === 2 && ci === 2;
          const goldOn = isGold && frame >= c2;
          const outOn = isOut && frame >= c3;
          const middle = !isGold && !isOut && frame >= c4;
          const bg = goldOn
            ? C.tag
            : outOn
              ? C.red
              : middle
                ? "#EDEAE0"
                : C.paper;
          const pop = goldOn || outOn ? 1.06 : 1;
          return (
            <div
              key={`${r}${c}`}
              style={{
                position: "absolute",
                top: GRID_TOP + ri * CELL + 6,
                left: GRID_LEFT + ci * CELL + 6,
                width: CELL - 12,
                height: CELL - 12,
                background: bg,
                border: `5px solid ${C.ink}`,
                boxShadow: goldOn || outOn ? `8px 8px 0 ${C.ink}` : "none",
                opacity: on,
                transform: `scale(${pop * (0.6 + 0.4 * on)})`,
                zIndex: goldOn || outOn ? 2 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: outOn ? "#fff" : C.ink,
              }}
            >
              <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 64 }}>
                {r}
                {c}
              </div>
              {(goldOn || outOn) && (
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: 1.15,
                    textAlign: "center",
                    whiteSpace: "pre-line",
                    padding: "0 8px",
                  }}
                >
                  {goldOn ? MATRIX.gold : MATRIX.out}
                </div>
              )}
            </div>
          );
        }),
      )}
    </AbsoluteFill>
  );
};
