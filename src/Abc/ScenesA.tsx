import "@fontsource/pt-serif/cyrillic-400.css";
import "@fontsource/pt-serif/cyrillic-700.css";
import "@fontsource/pt-serif/latin-400.css";
import "@fontsource/pt-serif/latin-700.css";
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
import { ARTICLE, GROUPS, GROUPS_NOTE, HISTORY, SHELF } from "./content";

// cue — локальные кадры начала субтитров в сцене
export type SceneProps = { cue: number[] };

export const SERIF = "'PT Serif', serif";

// Сепия для «архивных» сцен
export const SEPIA = {
  paper: "#E9DFC8",
  light: "#D6C4A0",
  mid: "#9C7B4F",
  dark: "#4A3520",
};

// Цвета «обычных» товаров на полке
const PRODUCT_COLORS = ["#E4E2DA", "#D9D6CC", "#ECEAE3", "#CFCBBF", "#E0DDD3"];

// ---------- Сцена 1: полка с сотнями товаров ----------
export const Shelf: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const reveal = cue[1] ?? 70;
  const ROWS = 12;
  const W = 80;
  const H = 70;
  const G = 12;
  const total = ROWS * SHELF.cols;
  const winners = new Set(SHELF.winners.filter((i) => i < total));

  // камера медленно отъезжает
  const zoom = interpolate(frame, [0, durationInFrames], [1.9, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const highlight = interpolate(frame, [reveal, reveal + 14], [0, 1], clamp);
  const head = spring({ frame: frame - 6, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 100,
          letterSpacing: "-0.03em",
          color: C.ink,
          opacity: head,
          transform: `scale(${interpolate(head, [0, 1], [1.2, 1])})`,
          zIndex: 2,
        }}
      >
        <span style={{ background: C.tag, padding: "0 18px" }}>
          {SHELF.headline}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - (SHELF.cols * (W + G) - G) / 2 - 24,
          top: 380,
          padding: 24,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 40%",
          display: "grid",
          gridTemplateColumns: `repeat(${SHELF.cols}, ${W}px)`,
          gap: G,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const win = winners.has(i);
          const bg = win
            ? interpolate(highlight, [0, 1], [0, 1]) > 0.5
              ? C.tag
              : PRODUCT_COLORS[i % PRODUCT_COLORS.length]
            : PRODUCT_COLORS[(i * 7) % PRODUCT_COLORS.length];
          return (
            <div
              key={i}
              style={{
                height: H,
                background: bg,
                border: `3px solid ${win && highlight > 0.5 ? C.ink : "#BDB9AD"}`,
                opacity: win ? 1 : interpolate(highlight, [0, 1], [1, 0.25]),
                transform: `scale(${win ? 1 + highlight * 0.12 : 1})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 30,
                color: C.ink,
              }}
            >
              {win && highlight > 0.5 ? "₽" : ""}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 2: 1951, склад General Electric ----------
const Crate: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({
  x,
  y,
  w = 110,
  h = 80,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={SEPIA.mid}
      stroke={SEPIA.dark}
      strokeWidth={4}
    />
    <line
      x1={x}
      y1={y}
      x2={x + w}
      y2={y + h}
      stroke={SEPIA.dark}
      strokeWidth={3}
    />
    <line
      x1={x + w}
      y1={y}
      x2={x}
      y2={y + h}
      stroke={SEPIA.dark}
      strokeWidth={3}
    />
  </g>
);

// хаотичные штабеля ящиков: [x, y, ширина, высота]
const CRATES: [number, number, number, number][] = [
  [30, 380, 120, 90],
  [150, 380, 110, 90],
  [60, 290, 120, 90],
  [90, 200, 100, 90],
  [300, 400, 100, 70],
  [300, 330, 100, 70],
  [400, 380, 130, 90],
  [420, 290, 100, 90],
  [560, 360, 140, 110],
  [580, 250, 110, 110],
  [600, 160, 90, 90],
  [720, 410, 100, 60],
  [140, 110, 90, 90],
  [470, 200, 80, 90],
  [730, 340, 90, 70],
];

export const History: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photo = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const stamp = spring({ frame: frame - 14, fps, config: { damping: 8 } });
  const person = spring({
    frame: frame - (cue[1] ?? 70),
    fps,
    config: { damping: 13 },
  });
  const abcAt = cue[2] ?? 200;

  return (
    <AbsoluteFill>
      <Title text={HISTORY.headline} top={180} size={70} />
      {/* «Архивная фотография» */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 90,
          width: 900,
          padding: "26px 26px 80px",
          background: "#F7F2E6",
          boxShadow: `14px 14px 0 ${C.ink}`,
          border: `4px solid ${C.ink}`,
          transform: `rotate(-2deg) scale(${interpolate(photo, [0, 1], [0.85, 1])})`,
          opacity: photo,
        }}
      >
        <svg
          width={848}
          height={520}
          viewBox="0 0 848 520"
          style={{ display: "block" }}
        >
          <rect width={848} height={520} fill={SEPIA.light} />
          {/* стеллажи на заднем плане */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={0.5}>
              <rect
                x={i * 220 + 10}
                y={30}
                width={14}
                height={300}
                fill={SEPIA.dark}
              />
              <rect
                x={i * 220 + 10}
                y={90}
                width={200}
                height={10}
                fill={SEPIA.dark}
              />
              <rect
                x={i * 220 + 10}
                y={190}
                width={200}
                height={10}
                fill={SEPIA.dark}
              />
            </g>
          ))}
          <rect
            y={470}
            width={848}
            height={50}
            fill={SEPIA.mid}
            opacity={0.6}
          />
          {CRATES.map(([x, y, w, h], i) => (
            <Crate key={i} x={x} y={y} w={w} h={h} />
          ))}
          {/* зерно и царапины старого снимка */}
          {Array.from({ length: 60 }).map((_, i) => (
            <line
              key={i}
              x1={(i * 137) % 848}
              y1={0}
              x2={(i * 137 + 9) % 848}
              y2={520}
              stroke="#fff"
              strokeOpacity={0.05 + ((i * 7) % 5) * 0.01}
              strokeWidth={1}
            />
          ))}
          {/* метки A / B / C на ящиках */}
          {[
            ["A", 600, 200, C.tag],
            ["B", 420, 330, "#fff"],
            ["C", 120, 420, C.shelf],
          ].map(([k, x, y, col], i) => {
            const s = spring({
              frame: frame - abcAt - i * 8,
              fps,
              config: { damping: 8 },
            });
            if (s <= 0.01) return null;
            return (
              <g
                key={k as string}
                transform={`translate(${x} ${y}) scale(${interpolate(s, [0, 1], [2.2, 1])})`}
                opacity={Math.min(1, s)}
              >
                <rect
                  x={-42}
                  y={-42}
                  width={84}
                  height={84}
                  fill={col as string}
                  stroke={C.ink}
                  strokeWidth={6}
                />
                <text
                  textAnchor="middle"
                  y={22}
                  fontFamily={SANS}
                  fontWeight={900}
                  fontSize={64}
                  fill={C.ink}
                >
                  {k}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 30,
            bottom: 22,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            color: SEPIA.dark,
          }}
        >
          {HISTORY.caption}
        </div>
        {/* штамп года */}
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -50,
            transform: `rotate(8deg) scale(${interpolate(stamp, [0, 1], [2, 1])})`,
            opacity: Math.min(1, stamp),
            border: `7px solid ${C.red}`,
            color: C.red,
            background: "rgba(255,255,255,0.75)",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 84,
            padding: "4px 26px",
          }}
        >
          {HISTORY.year}
        </div>
      </div>
      {/* Плашка с именем */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: person,
          transform: `translateY(${(1 - person) * 40}px)`,
        }}
      >
        <div
          style={{
            background: C.ink,
            color: "#fff",
            padding: "18px 34px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 46,
            boxShadow: `8px 8px 0 ${C.tag}`,
          }}
        >
          {HISTORY.person}
          <span
            style={{
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              fontSize: 36,
            }}
          >
            {" "}
            · {HISTORY.role}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 3: три стопки A · B · C ----------
const STACK_COUNTS = [3, 6, 11];
const COL_X = [190, 540, 890];
const BASE_Y = 1010;
const BOX_W = 200;
const BOX_H = 46;

export const Groups: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          fontSize: 110,
          letterSpacing: "-0.02em",
          color: C.ink,
        }}
      >
        {GROUPS.map((g, i) => {
          const on = frame >= (cue[i] ?? 0);
          return (
            <React.Fragment key={g.key}>
              {i > 0 && <span style={{ color: C.ink2 }}> · </span>}
              <span
                style={{
                  padding: "0 12px",
                  background: on && i === 0 ? C.tag : "transparent",
                  opacity: on ? 1 : 0.25,
                }}
              >
                {g.key}
              </span>
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.ink2,
        }}
      >
        {GROUPS_NOTE}
      </div>

      {GROUPS.map((g, gi) => {
        const start = cue[gi] ?? gi * 60;
        const color = gi === 0 ? C.tag : gi === 1 ? C.paper : C.shelf;
        return (
          <React.Fragment key={g.key}>
            {/* стопка коробок: высота = доля позиций */}
            {Array.from({ length: STACK_COUNTS[gi] }).map((_, k) => {
              const s = spring({
                frame: frame - start - k * 2,
                fps,
                config: { damping: 12, mass: 0.6 },
              });
              const y = BASE_Y - (k + 1) * (BOX_H + 4);
              return (
                <div
                  key={k}
                  style={{
                    position: "absolute",
                    left: COL_X[gi] - BOX_W / 2 + ((k * 13) % 9) - 4,
                    top: interpolate(s, [0, 1], [y - 300, y]),
                    width: BOX_W,
                    height: BOX_H,
                    background: color,
                    border: `4px solid ${C.ink}`,
                    opacity: Math.min(1, s * 2),
                  }}
                />
              );
            })}
            {/* подписи и проценты */}
            <Stat x={COL_X[gi]} start={start} data={g} index={gi} />
          </React.Fragment>
        );
      })}
      {/* «замороженные деньги» у группы C */}
      <Frozen at={(cue[2] ?? 160) + 40} />
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: BASE_Y,
          height: 6,
          background: C.ink,
        }}
      />
    </AbsoluteFill>
  );
};

const Stat: React.FC<{
  x: number;
  start: number;
  index: number;
  data: (typeof GROUPS)[number];
}> = ({ x, start, index, data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start - 10, fps, config: { damping: 14 } });
  const rev = Math.round(
    interpolate(frame, [start + 10, start + 40], [0, data.revenue], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x - 160,
        width: 320,
        top: BASE_Y + 24,
        textAlign: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.ink2,
        }}
      >
        {data.items}% ТОВАРОВ
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: index === 0 ? C.green : index === 2 ? C.red : C.ink,
        }}
      >
        {rev}%
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.ink2,
        }}
      >
        ВЫРУЧКИ
      </div>
    </div>
  );
};

const Frozen: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 10 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: COL_X[2] - 170,
        top: BASE_Y - 11 * (BOX_H + 4) - 70,
        width: 340,
        transform: `rotate(-4deg) scale(${s})`,
        background: "#DCEBF5",
        border: `4px solid ${C.ink}`,
        padding: "10px 14px",
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 32,
        color: C.ink,
      }}
    >
      ❄ деньги заморожены
    </div>
  );
};

// ---------- Сцена 4: заголовок статьи на старой бумаге ----------
export const Article: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = spring({ frame: frame - 2, fps, config: { damping: 15 } });
  const mark = interpolate(frame, [26, 44], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const tr = spring({ frame: frame - 40, fps, config: { damping: 13 } });
  const essence = spring({
    frame: frame - (cue[1] ?? 120),
    fps,
    config: { damping: 9 },
  });
  const [lead, tail] = ARTICLE.original.split("Dollars");

  return (
    <AbsoluteFill>
      <Title text={ARTICLE.headline} top={180} size={72} />
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 80,
          width: 920,
          background: SEPIA.paper,
          border: `4px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          padding: "34px 44px 44px",
          transform: `rotate(1.5deg) translateY(${(1 - page) * 120}px)`,
          opacity: page,
          color: SEPIA.dark,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 2,
            borderBottom: `4px double ${SEPIA.dark}`,
            paddingBottom: 14,
          }}
        >
          {ARTICLE.journal}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 70,
            lineHeight: 1.08,
            color: "#2B1E10",
          }}
        >
          {lead}
          <span style={{ position: "relative", display: "inline" }}>
            <span
              style={{
                backgroundImage: `linear-gradient(${C.tag}, ${C.tag})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${mark * 100}% 70%`,
                backgroundPosition: "0 85%",
              }}
            >
              Dollars{tail}
            </span>
          </span>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: SERIF,
            fontSize: 30,
            fontStyle: "italic",
          }}
        >
          {ARTICLE.byline}
        </div>
        {/* колонки текста */}
        <div style={{ display: "flex", gap: 26, marginTop: 30 }}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{ flex: 1 }}>
              {Array.from({ length: 6 }).map((_, k) => (
                <div
                  key={k}
                  style={{
                    height: 9,
                    marginBottom: 13,
                    width: `${80 + ((c * 5 + k * 7) % 20)}%`,
                    background: SEPIA.mid,
                    opacity: 0.45,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* перевод */}
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.2,
          color: C.ink,
          whiteSpace: "pre-line",
          opacity: tr,
          transform: `translateY(${(1 - tr) * 30}px) scale(${1 + essence * 0.06})`,
        }}
      >
        {ARTICLE.translation}
      </div>
    </AbsoluteFill>
  );
};
