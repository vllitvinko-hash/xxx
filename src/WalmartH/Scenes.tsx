import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../brand";
import { SceneProps } from "../Abc/ScenesA";
import { Box, Cyl, Person, Tag, makeIso, pp } from "../Refs/Refs2";
import {
  BeerBottle,
  Basket,
  Bread,
  Butter,
  Chips,
  DiaperPack,
  MONO,
  P,
  QR,
  Receipt,
  SANS,
  Shelf,
  SixPack,
  Soda,
  Walker,
} from "./Art";

// Горизонтальная версия «Пиво и подгузники»: 1920×1080, плоская иллюстрация + изометрия.
// Полезная область кадра — до y≈860, ниже идут субтитры.

const useSp = (at: number, damping = 13, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass } });
};
const Pop: React.FC<{
  s: number;
  x: number;
  y: number;
  children: React.ReactNode;
}> = ({ s, x, y, children }) => (
  <g
    transform={`translate(${x} ${y}) scale(${Math.max(0.001, s)}) translate(${-x} ${-y})`}
    opacity={Math.min(1, s * 1.5)}
  >
    {children}
  </g>
);
const Head: React.FC<{
  children: React.ReactNode;
  x?: number;
  y?: number;
  size?: number;
  s?: number;
  align?: "left" | "center";
}> = ({ children, x = 110, y = 90, size = 76, s = 1, align = "left" }) => (
  <div
    style={{
      position: "absolute",
      left: align === "center" ? 0 : x,
      right: align === "center" ? 0 : undefined,
      top: y,
      textAlign: align,
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: "-0.03em",
      color: P.navy,
      opacity: s,
      transform: `translateY(${(1 - s) * 30}px)`,
      whiteSpace: "pre-line",
    }}
  >
    {children}
  </div>
);
const Chip: React.FC<{
  text: string;
  bg?: string;
  fg?: string;
  s?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, bg = "#fff", fg = P.navy, s = 1, size = 34, style }) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color: fg,
      borderRadius: 999,
      padding: "10px 26px",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      boxShadow: "0 12px 28px rgba(36,59,85,0.16)",
      transform: `scale(${s})`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);
const Room: React.FC<{ wall?: string; floor?: string; horizon?: number }> = ({
  wall = P.wall,
  floor = P.bg,
  horizon = 640,
}) => (
  <>
    <rect width={1920} height={horizon} fill={wall} />
    <rect y={horizon} width={1920} height={1080 - horizon} fill={floor} />
  </>
);

// ---------- 0. Каждый товар рассказывает историю ----------
export const Intro: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 132, c2 = 256] = cue;
  const head = interpolate(frame, [0, 6], [0.85, 1], clamp);
  const pan = interpolate(frame, [0, 330], [0, -160]);
  const split = useSp(c1, 14);
  const win = interpolate(frame, [c2, c2 + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const bubbles = [0, 1, 2, 3, 4].map((i) =>
    spring({ frame: frame - 14 - i * 9, fps: 30, config: { damping: 11 } }),
  );
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        <Room />
        <g transform={`translate(${pan} 0)`} opacity={1 - split * 0.55}>
          <Shelf x={120} y={420} w={2000} rows={3} seed={3} />
          {[340, 720, 1100, 1480, 1860].map((x, i) => (
            <Pop key={x} s={bubbles[i]} x={x} y={380}>
              <path
                d={`M ${x - 46} 300 h 92 a 22 22 0 0 1 22 22 v 36 a 22 22 0 0 1 -22 22 h -36 l -18 22 l -4 -22 h -34 a 22 22 0 0 1 -22 -22 v -36 a 22 22 0 0 1 22 -22 z`}
                fill="#fff"
              />
              <circle cx={x - 24} cy={341} r={7} fill={P.navy} />
              <circle cx={x} cy={341} r={7} fill={P.navy} />
              <circle cx={x + 24} cy={341} r={7} fill={P.navy} />
            </Pop>
          ))}
        </g>
      </svg>
      <Head s={head * (1 - split)} size={84}>
        Каждый товар{"\n"}
        <span style={{ color: P.coral }}>рассказывает историю</span>
      </Head>
      {/* «говорят» и «покупают» */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
          opacity: split,
          transform: `translateY(${(1 - split) * 60}px)`,
        }}
      >
        {[0, 1].map((k) => {
          const on = k === 1 ? win : 0;
          const off = k === 0 ? win : 0;
          return (
            <div
              key={k}
              style={{
                width: 720,
                height: 700,
                background: "#fff",
                borderRadius: 44,
                boxShadow: `0 ${24 + on * 20}px ${50 + on * 30}px rgba(36,59,85,${0.16 + on * 0.1})`,
                position: "relative",
                transform: `scale(${1 + on * 0.06 - off * 0.06})`,
                opacity: 1 - off * 0.3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 34,
                  left: 40,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: "0.12em",
                  color: k ? P.teal : P.muted,
                }}
              >
                {k ? "ПОКУПАЮТ" : "ГОВОРЯТ"}
              </div>
              <svg
                width={720}
                height={700}
                style={{ position: "absolute", inset: 0 }}
              >
                {k === 0 ? (
                  <>
                    <rect
                      x={0}
                      y={520}
                      width={720}
                      height={180}
                      fill={P.wall}
                    />
                    <Person
                      x={250}
                      y={250}
                      s={0.62}
                      skin={P.skin1}
                      hair="#6B3B23"
                      hairStyle="short"
                      top={P.lilac}
                      pose="crossed"
                      mood="neutral"
                    />
                    <path
                      d="M 360 120 h 300 a 30 30 0 0 1 30 30 v 120 a 30 30 0 0 1 -30 30 h -220 l -50 40 l 10 -40 h -40 a 30 30 0 0 1 -30 -30 v -120 a 30 30 0 0 1 30 -30 z"
                      fill={P.bg}
                    />
                    <text
                      x={510}
                      y={200}
                      textAnchor="middle"
                      fontFamily={SANS}
                      fontWeight={800}
                      fontSize={32}
                      fill={P.navy}
                    >
                      «Беру только
                    </text>
                    <text
                      x={510}
                      y={244}
                      textAnchor="middle"
                      fontFamily={SANS}
                      fontWeight={800}
                      fontSize={32}
                      fill={P.navy}
                    >
                      самое нужное»
                    </text>
                    {off > 0 && (
                      <line
                        x1={380}
                        y1={226}
                        x2={380 + 260 * off}
                        y2={210}
                        stroke={P.coral}
                        strokeWidth={10}
                        strokeLinecap="round"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Receipt
                      x={70}
                      y={110}
                      w={330}
                      items={["Подгузники", "Пиво", "Чипсы", "Газировка"]}
                      mark={
                        on > 0.5
                          ? { Подгузники: "#DDEEFF", Пиво: "#FCE3BC" }
                          : {}
                      }
                    />
                    <Basket x={560} y={520} s={0.62}>
                      <g transform="translate(-60 -70) scale(0.5)">
                        <DiaperPack x={0} y={0} />
                      </g>
                      <g transform="translate(70 -80) scale(0.6)">
                        <BeerBottle x={0} y={0} />
                      </g>
                    </Basket>
                  </>
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1. Конец 1990-х, американская сеть Walmart ----------
export const Start: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 131, c2 = 203] = cue;
  const iso = makeIso(560, 700);
  const build = (i: number) =>
    spring({ frame: frame - c0 - i * 5, fps: 30, config: { damping: 14 } });
  const era = useSp(c0 + 8, 11);
  const name = useSp(c0 + 24, 12);
  const bk = useSp(c1, 12);
  const drop = (i: number) =>
    interpolate(frame, [c1 + 10 + i * 8, c1 + 28 + i * 8], [-420, 0], {
      ...clamp,
      easing: Easing.bounce,
    });
  const net = interpolate(frame, [c2, c2 + 30], [0, 1], clamp);
  const items: [number, number, React.ReactNode][] = [
    [-120, -60, <Bread key="b" x={0} y={0} s={0.6} />],
    [0, -80, <Soda key="s" x={0} y={0} s={0.6} />],
    [120, -60, <Chips key="c" x={0} y={0} s={0.5} />],
    [-60, -10, <Butter key="m" x={0} y={0} s={0.6} />],
    [70, -14, <DiaperPack key="d" x={0} y={0} s={0.42} />],
  ];
  const bx = 1440,
    by = 640;
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        <rect width={1920} height={1080} fill="#E4EEF8" />
        <polygon
          points={pp([
            iso(-700, -500, 0),
            iso(700, -500, 0),
            iso(700, 700, 0),
            iso(-700, 700, 0),
          ])}
          fill="#CFE3D4"
        />
        {/* супермаркет */}
        <g opacity={build(0)}>
          <Box
            iso={iso}
            x={-300}
            y={-200}
            z={0}
            w={600}
            d={360}
            h={230 * build(0)}
            c={["#F7F3EE", "#E9DCCB", "#D9C7B0"]}
          />
        </g>
        {build(2) > 0.05 &&
          (() => {
            const a = iso(-300, 160, 160),
              b = iso(300, 160, 160);
            return (
              <g opacity={build(2)}>
                <polygon
                  points={pp([
                    iso(-300, 160, 150),
                    iso(300, 160, 150),
                    iso(300, 160, 210),
                    iso(-300, 160, 210),
                  ])}
                  fill={P.coral}
                />
                <text
                  x={(a[0] + b[0]) / 2}
                  y={(a[1] + b[1]) / 2 - 16}
                  textAnchor="middle"
                  fontFamily={SANS}
                  fontWeight={900}
                  fontSize={34}
                  fill="#fff"
                  transform={`skewY(${(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI})`}
                  style={{
                    transformOrigin: `${(a[0] + b[0]) / 2}px ${(a[1] + b[1]) / 2}px`,
                  }}
                >
                  СУПЕРМАРКЕТ
                </text>
              </g>
            );
          })()}
        {[-220, -60, 100].map((x, i) => (
          <polygon
            key={x}
            opacity={build(3 + i)}
            points={pp([
              iso(x, 160, 20),
              iso(x + 120, 160, 20),
              iso(x + 120, 160, 120),
              iso(x, 160, 120),
            ])}
            fill="#9DD3F0"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={build(6 + i)}>
            <Cyl
              iso={iso}
              x={-420 + i * 70}
              y={260 + i * 30}
              z={0}
              r={34}
              h={70}
              body="#2BA59B"
              dark="#1F7F77"
              cap="#6EE7B7"
            />
          </g>
        ))}
        {/* корзина и связи */}
        <g opacity={bk}>
          <Basket x={bx} y={by} s={1.25}>
            {items.map(([dx, dy, node], i) => (
              <g key={i} transform={`translate(${dx} ${dy + drop(i)})`}>
                {node}
              </g>
            ))}
          </Basket>
          {net > 0 &&
            (() => {
              const pts = items.map(
                ([dx, dy]) => [bx + dx * 1.25, by + (dy - 20) * 1.25] as const,
              );
              const pairs = [
                [0, 3],
                [1, 2],
                [4, 0],
                [4, 2],
                [1, 3],
              ];
              return pairs.map(([a, b], i) => {
                const k = interpolate(
                  net,
                  [i * 0.12, i * 0.12 + 0.4],
                  [0, 1],
                  clamp,
                );
                const [x1, y1] = pts[a],
                  [x2, y2] = pts[b];
                return (
                  <g key={i} opacity={k}>
                    <path
                      d={`M ${x1} ${y1 - 110} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 260} ${x2} ${y2 - 110}`}
                      stroke={P.navy}
                      strokeWidth={5}
                      strokeDasharray="10 10"
                      fill="none"
                    />
                    <circle cx={x1} cy={y1 - 110} r={10} fill={P.coral} />
                    <circle cx={x2} cy={y2 - 110} r={10} fill={P.coral} />
                  </g>
                );
              });
            })()}
        </g>
      </svg>
      <div style={{ position: "absolute", top: 70, left: 110 }}>
        <Chip text="КОНЕЦ 1990-х · США" bg={P.mustard} s={era} size={30} />
        <div
          style={{
            marginTop: 22,
            opacity: name,
            transform: `translateX(${(1 - name) * -40}px)`,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 92,
              color: P.navy,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Walmart
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              color: P.muted,
              marginTop: 8,
            }}
          >
            американская сеть супермаркетов
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 70,
          right: 110,
          textAlign: "right",
          opacity: bk,
          transform: `translateY(${(1 - bk) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 54,
            color: P.navy,
            lineHeight: 1.05,
          }}
        >
          Анализ
          <br />
          <span style={{ color: P.coral }}>покупательской корзины</span>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 26,
            color: P.muted,
            marginTop: 12,
            opacity: net,
          }}
        >
          Market Basket Analysis
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Идея была простой ----------
export const Idea: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 49, c2 = 175] = cue;
  const head = useSp(c0, 12);
  const pair = useSp(c1 + 4, 10);
  const arrow = interpolate(frame, [c1 + 30, c1 + 50], [0, 1], clamp);
  const card = (i: number) =>
    spring({ frame: frame - c2 - i * 38, fps: 30, config: { damping: 12 } });
  const slide = interpolate(frame, [c2 + 20, c2 + 60], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const stock = (i: number) =>
    interpolate(frame, [c2 + 100 + i * 6, c2 + 120 + i * 6], [0, 1], clamp);
  const titles = [
    "Как расставить магазин",
    "Какие делать совместные акции",
    "Как планировать запасы",
  ];
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Head s={head} size={84}>
        Идея была <span style={{ color: P.coral }}>простой</span>
      </Head>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Pop s={pair} x={1500} y={170}>
          <circle cx={1380} cy={170} r={70} fill={P.diaper} />
          <text
            x={1380}
            y={186}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={48}
            fill="#fff"
          >
            A
          </text>
          <text
            x={1480}
            y={190}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={70}
            fill={P.coral}
          >
            +
          </text>
          <circle cx={1580} cy={170} r={70} fill={P.beer} />
          <text
            x={1580}
            y={186}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={48}
            fill="#fff"
          >
            Б
          </text>
        </Pop>
        <path
          d={`M 1680 170 L ${1680 + 90 * arrow} 170`}
          stroke={P.navy}
          strokeWidth={10}
          strokeLinecap="round"
        />
        {arrow > 0.9 && (
          <path
            d="M 1752 146 L 1780 170 L 1752 194"
            stroke={P.navy}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 110,
          right: 110,
          display: "flex",
          gap: 40,
        }}
      >
        {titles.map((t, i) => {
          const s = card(i);
          return (
            <div
              key={t}
              style={{
                flex: 1,
                height: 520,
                background: "#fff",
                borderRadius: 40,
                boxShadow: "0 22px 48px rgba(36,59,85,0.15)",
                transform: `translateY(${(1 - s) * 120}px)`,
                opacity: s,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <svg
                width={533}
                height={380}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                {i === 0 && (
                  <>
                    <rect width={533} height={380} fill="#EEF5FF" />
                    {[0, 1, 2].map((r) => (
                      <rect
                        key={r}
                        x={70}
                        y={70 + r * 100}
                        width={260}
                        height={46}
                        rx={10}
                        fill="#C9D6EA"
                      />
                    ))}
                    <rect
                      x={70 + 150 * slide}
                      y={170}
                      width={110}
                      height={46}
                      rx={10}
                      fill={P.beer}
                    />
                    <rect
                      x={70}
                      y={170}
                      width={110}
                      height={46}
                      rx={10}
                      fill={P.diaper}
                    />
                    <path
                      d={`M 130 150 Q 220 ${120 - 20 * slide} ${290} 150`}
                      stroke={P.coral}
                      strokeWidth={5}
                      strokeDasharray="8 8"
                      fill="none"
                      opacity={1 - slide}
                    />
                  </>
                )}
                {i === 1 && (
                  <>
                    <rect width={533} height={380} fill="#FFF3E6" />
                    <g
                      transform={`translate(270 190) rotate(${-8 + Math.sin(frame / 10) * 3})`}
                    >
                      <path
                        d="M -150 -70 L 110 -70 L 170 0 L 110 70 L -150 70 Z"
                        fill={P.coral}
                      />
                      <circle cx={110} cy={0} r={14} fill="#FFF3E6" />
                      <text
                        x={-30}
                        y={20}
                        textAnchor="middle"
                        fontFamily={SANS}
                        fontWeight={900}
                        fontSize={56}
                        fill="#fff"
                      >
                        −20%
                      </text>
                    </g>
                    <text
                      x={266}
                      y={330}
                      textAnchor="middle"
                      fontFamily={SANS}
                      fontWeight={800}
                      fontSize={30}
                      fill={P.navy}
                    >
                      на пару товаров
                    </text>
                  </>
                )}
                {i === 2 && (
                  <>
                    <rect width={533} height={380} fill="#E9F7F2" />
                    {[0, 1, 2, 3, 4].map((k) => (
                      <rect
                        key={k}
                        x={90 + k * 76}
                        y={320 - (60 + k * 40) * stock(k)}
                        width={56}
                        height={(60 + k * 40) * stock(k)}
                        rx={8}
                        fill={k === 4 ? P.teal : "#A7DCCF"}
                      />
                    ))}
                    <line
                      x1={70}
                      y1={322}
                      x2={470}
                      y2={322}
                      stroke={P.navy}
                      strokeWidth={4}
                    />
                  </>
                )}
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: 36,
                  right: 36,
                  bottom: 40,
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 38,
                  lineHeight: 1.1,
                  color: P.navy,
                }}
              >
                {t}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Тысячи чеков, миллионы покупок ----------
export const Data: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 116, c2 = 210] = cue;
  const head = useSp(c0, 12);
  const COLS = 26,
    ROWS = 14;
  const filled = Math.floor(
    interpolate(frame, [c0 + 10, c2 - 10], [0, COLS * ROWS], clamp),
  );
  const found = interpolate(frame, [c2, c2 + 20], [0, 1], clamp);
  const zoom = useSp(c1, 12);
  const HI = [57, 249];
  const belt = (frame * 9) % 220;
  const cols = [P.coral, P.teal, P.mustard, P.diaper, P.lilac];
  const counter = Math.round(
    interpolate(frame, [c0, c2], [0, 2400000], {
      ...clamp,
      easing: Easing.in(Easing.quad),
    }),
  );
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <Head s={head} size={70}>
        Тысячи чеков ·{"\n"}
        <span style={{ color: P.coral }}>миллионы покупок</span>
      </Head>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* касса: лента со сканером */}
        <rect x={60} y={640} width={820} height={60} rx={30} fill={P.navy} />
        {Array.from({ length: 6 }, (_, i) => {
          const x = 60 + ((i * 220 + belt) % 1100) - 140;
          if (x < 40 || x > 820) return null;
          const c = cols[(i + Math.floor((frame * 9) / 220)) % cols.length];
          return (
            <rect
              key={i}
              x={x}
              y={560}
              width={110}
              height={80}
              rx={14}
              fill={c}
            />
          );
        })}
        <rect x={520} y={460} width={70} height={190} rx={14} fill="#3A4A66" />
        <rect x={500} y={440} width={110} height={40} rx={12} fill="#2C3A52" />
        <line
          x1={555}
          y1={480}
          x2={555}
          y2={640}
          stroke="#FF3B3B"
          strokeWidth={4}
          opacity={0.5 + 0.5 * Math.sin(frame / 2)}
        />
        {/* штрихкод крупно */}
        <Pop s={zoom} x={280} y={380}>
          <rect x={120} y={300} width={320} height={170} rx={16} fill="#fff" />
          {Array.from({ length: 28 }, (_, i) => (
            <rect
              key={i}
              x={140 + i * 10.5}
              y={318}
              width={(i * 7) % 3 === 0 ? 6 : 3}
              height={110}
              fill={P.navy}
            />
          ))}
          <text
            x={280}
            y={456}
            textAnchor="middle"
            fontFamily={MONO}
            fontWeight={500}
            fontSize={18}
            fill={P.navy}
          >
            4 607001 234567
          </text>
          <path
            d="M 440 385 Q 620 300 900 330"
            stroke={P.coral}
            strokeWidth={5}
            strokeDasharray="10 10"
            fill="none"
          />
          <text
            x={660}
            y={292}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={30}
            fill={P.navy}
          >
            = точка данных
          </text>
        </Pop>
        {/* поле точек */}
        <rect x={940} y={170} width={880} height={500} rx={30} fill="#fff" />
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          if (i >= filled) return null;
          const cx = 990 + (i % COLS) * 30.5,
            cy = 215 + Math.floor(i / COLS) * 32;
          const hi = HI.includes(i);
          const r = hi ? 9 + found * 6 : 9;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={hi && found > 0 ? P.coral : cols[i % 5]}
              opacity={found > 0 && !hi ? 1 - found * 0.7 : 0.9}
            />
          );
        })}
        {found > 0 &&
          (() => {
            const [a, b] = HI.map((i) => [
              990 + (i % COLS) * 30.5,
              215 + Math.floor(i / COLS) * 32,
            ]);
            return (
              <path
                d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2 + 120} ${(a[1] + b[1]) / 2} ${b[0]} ${b[1]}`}
                stroke={P.coral}
                strokeWidth={6}
                fill="none"
                strokeDasharray={`${found * 600} 600`}
              />
            );
          })()}
        <text
          x={1380}
          y={720}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={30}
          fill={P.muted}
        >
          {counter.toLocaleString("ru-RU")} покупок
        </text>
      </svg>
      <div style={{ position: "absolute", top: 120, right: 110 }}>
        <Chip
          text="НАЙДЕНО НЕОЖИДАННОЕ"
          bg={P.coral}
          fg="#fff"
          s={found}
          size={36}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Пары: привычные и странная ----------
export const Pairs: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 131, c2 = 199, c3 = 262] = cue;
  const p1 = useSp(c0 + 6, 12),
    p2 = useSp(c0 + 40, 12);
  const odd = useSp(c2, 10);
  const stamp = useSp(c3, 8);
  const dimUsual = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  const clink =
    Math.max(0, Math.sin((frame - c2) / 4)) *
    (frame > c2 + 10 && frame < c2 + 50 ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        {[
          {
            s: p1,
            x: 110,
            a: <Bread x={140} y={250} s={0.9} />,
            b: <Butter x={330} y={260} s={0.95} />,
            t: "хлеб + масло",
          },
          {
            s: p2,
            x: 110,
            a: <Chips x={150} y={240} s={0.8} />,
            b: <Soda x={330} y={240} s={0.9} />,
            t: "чипсы + газировка",
            dy: 380,
          },
        ].map((c, i) => (
          <g
            key={i}
            transform={`translate(${c.x} ${(c.dy ?? 0) + 60 + (1 - c.s) * 100})`}
            opacity={c.s * (1 - dimUsual * 0.5)}
          >
            <rect x={0} y={0} width={480} height={340} rx={36} fill="#fff" />
            <g transform="translate(-10 -40)">
              {c.a}
              {c.b}
            </g>
            <text
              x={240}
              y={300}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={800}
              fontSize={34}
              fill={P.muted}
            >
              {c.t}
            </text>
          </g>
        ))}
        <Pop s={odd} x={1200} y={430}>
          <rect x={720} y={60} width={1090} height={720} rx={50} fill="#fff" />
          <rect
            x={720}
            y={60}
            width={1090}
            height={720}
            rx={50}
            fill="none"
            stroke={P.coral}
            strokeWidth={8}
            strokeDasharray="22 16"
          />
          <g transform={`rotate(${-clink * 6} 1070 600)`}>
            <DiaperPack x={1060} y={420} s={1.45} r={-6} />
          </g>
          <text
            x={1265}
            y={450}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={120}
            fill={P.coral}
          >
            +
          </text>
          <g transform={`rotate(${clink * 8} 1460 600)`}>
            <BeerBottle x={1470} y={420} s={1.6} r={8} />
          </g>
          <text
            x={1265}
            y={730}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={48}
            fill={P.navy}
          >
            подгузники + пиво
          </text>
          {[0, 1, 2, 3].map((k) => {
            const a = (k / 4) * Math.PI * 2 + frame / 30;
            return (
              <path
                key={k}
                d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z"
                fill={P.mustard}
                transform={`translate(${1265 + Math.cos(a) * 420} ${400 + Math.sin(a) * 250}) scale(${1 + Math.sin(frame / 6 + k) * 0.3})`}
              />
            );
          })}
        </Pop>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 1430,
          transform: `rotate(-12deg) scale(${2 - stamp})`,
          opacity: stamp,
        }}
      >
        <div
          style={{
            border: `8px solid ${P.coral}`,
            color: P.coral,
            borderRadius: 18,
            padding: "8px 30px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 64,
            background: "rgba(255,255,255,0.85)",
          }}
        >
          НЕ ШУТКА
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Пятница, вечер ----------
export const Friday: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 188, c2 = 261] = cue;
  // путь папы: вход → подгузники → пиво у выхода
  const x = interpolate(
    frame,
    [c0 + 10, c1 - 20, c1 + 20, c2 - 10, c2 + 30, 397],
    [-200, 620, 620, 1180, 1180, 1500],
    clamp,
  );
  const walking = [c0 + 10, c1 - 20, c1 + 20, c2 - 10, c2 + 30, 397];
  const moving =
    (frame > walking[0] && frame < walking[1]) ||
    (frame > walking[2] && frame < walking[3]) ||
    frame > walking[4];
  const phase = moving ? frame / 3.2 : 0;
  const gotD = interpolate(frame, [c1, c1 + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  const gotB = interpolate(frame, [c2, c2 + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(2)),
  });
  const tv = useSp(c2 + 30, 11);
  const tx = Math.min(x, 1180);
  const clock = useSp(c0, 12);
  const who = useSp(c0 + 50, 12);
  return (
    <AbsoluteFill style={{ background: P.night }}>
      <svg width={1920} height={1080}>
        {/* вечер за окнами */}
        <rect width={1920} height={1080} fill={P.night} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={80 + i * 460}
            y={60}
            width={400}
            height={230}
            rx={16}
            fill="#33467A"
          />
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            cx={((i * 137) % 1840) + 60}
            cy={80 + ((i * 53) % 190)}
            r={3}
            fill="#fff"
            opacity={0.6 + 0.4 * Math.sin(frame / 8 + i)}
          />
        ))}
        <circle cx={1700} cy={130} r={46} fill="#FFF3C4" />
        <circle cx={1718} cy={118} r={46} fill="#33467A" />
        <rect y={300} width={1920} height={560} fill="#F3E8DA" />
        <rect y={860} width={1920} height={220} fill="#E2D2BE" />
        {/* полки */}
        <rect x={420} y={360} width={400} height={360} rx={18} fill="#E9DCCB" />
        {[0, 1].map((r) =>
          [0, 1, 2].map((c) => (
            <DiaperPack
              key={`${r}${c}`}
              x={500 + c * 120}
              y={455 + r * 170}
              s={0.42}
            />
          )),
        )}
        <text
          x={620}
          y={760}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={24}
          fill={P.muted}
        >
          ДЕТСКИЙ ОТДЕЛ
        </text>
        <rect
          x={1000}
          y={340}
          width={400}
          height={400}
          rx={18}
          fill="#2F4A6B"
        />
        <rect
          x={1020}
          y={360}
          width={360}
          height={360}
          rx={10}
          fill="#DDF2F0"
          opacity={0.25}
        />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <BeerBottle
              key={`${r}${c}`}
              x={1065 + c * 68}
              y={445 + r * 110}
              s={0.36}
            />
          )),
        )}
        <text
          x={1200}
          y={780}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={24}
          fill={P.muted}
        >
          НАПИТКИ · У ВЫХОДА
        </text>
        <rect
          x={1640}
          y={360}
          width={200}
          height={500}
          rx={10}
          fill="#9DD3F0"
          opacity={0.6}
        />
        <text
          x={1740}
          y={340}
          textAnchor="middle"
          fontFamily={MONO}
          fontWeight={700}
          fontSize={24}
          fill={P.muted}
        >
          ВЫХОД →
        </text>
        {/* папа */}
        <Walker
          x={x}
          y={420}
          s={0.62}
          phase={phase}
          stride={moving ? 1 : 0}
          top="#5C7CFA"
          pants="#2C3A52"
          skin={P.skin1}
          hair="#6B3B23"
          mood={gotB > 0.5 ? "happy" : "neutral"}
          carry={
            <>
              {gotD > 0 && (
                <DiaperPack
                  x={-110}
                  y={330 - (1 - gotD) * 120}
                  s={0.6 * gotD}
                  r={-8}
                />
              )}
              {gotB > 0 && (
                <SixPack x={150} y={350 - (1 - gotB) * 120} s={0.55 * gotB} />
              )}
            </>
          }
        />
        {/* мысль о матче */}
        <Pop s={tv} x={tx + 230} y={300}>
          <circle cx={tx + 120} cy={320} r={10} fill="#fff" />
          <circle cx={tx + 150} cy={290} r={16} fill="#fff" />
          <rect
            x={tx + 160}
            y={120}
            width={300}
            height={170}
            rx={24}
            fill="#fff"
          />
          <rect
            x={tx + 180}
            y={138}
            width={260}
            height={134}
            rx={12}
            fill="#2E8B57"
          />
          <line
            x1={tx + 310}
            y1={138}
            x2={tx + 310}
            y2={272}
            stroke="#fff"
            strokeWidth={3}
            opacity={0.7}
          />
          <circle
            cx={tx + 310}
            cy={205}
            r={26}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            opacity={0.7}
          />
          <circle
            cx={tx + 250 + Math.sin(frame / 6) * 50}
            cy={190 + Math.cos(frame / 5) * 30}
            r={9}
            fill="#fff"
          />
        </Pop>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 110,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <Chip text="ПЯТНИЦА · 19:30" bg={P.mustard} s={clock} size={34} />
        <Chip text="молодые папы" bg="#fff" s={who} size={34} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 6. Опрос не выявит — чеки покажут ----------
export const Survey: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 84, c2 = 165] = cue;
  const a = useSp(c0, 12),
    b = useSp(c1 - 10, 12);
  const cross = interpolate(frame, [c1, c1 + 14], [0, 1], clamp);
  const hl = interpolate(frame, [c1 + 10, c1 + 24], [0, 1], clamp);
  const eye = useSp(c2, 10);
  const blink = Math.abs(Math.sin(frame / 22)) > 0.97 ? 0.15 : 1;
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        {/* анкета */}
        <g
          transform={`translate(160 ${90 + (1 - a) * 80})`}
          opacity={a * (1 - cross * 0.4)}
        >
          <rect x={0} y={0} width={620} height={660} rx={30} fill="#fff" />
          <rect
            x={230}
            y={-30}
            width={160}
            height={60}
            rx={14}
            fill={P.muted}
          />
          <text
            x={40}
            y={110}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={30}
            fill={P.muted}
          >
            ОПРОС
          </text>
          <text
            x={40}
            y={190}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={P.navy}
          >
            Что вы купите
          </text>
          <text
            x={40}
            y={236}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={36}
            fill={P.navy}
          >
            вместе с подгузниками?
          </text>
          {["Влажные салфетки", "Детское питание", "Пиво"].map((t, i) => (
            <g key={t}>
              <rect
                x={40}
                y={300 + i * 90}
                width={44}
                height={44}
                rx={10}
                fill="none"
                stroke={P.navy}
                strokeWidth={4}
              />
              {i === 0 && (
                <path
                  d="M 50 322 L 60 334 L 78 310"
                  stroke={P.teal}
                  strokeWidth={7}
                  fill="none"
                  strokeLinecap="round"
                />
              )}
              <text
                x={110}
                y={334 + i * 90}
                fontFamily={SANS}
                fontWeight={700}
                fontSize={34}
                fill={P.navy}
              >
                {t}
              </text>
            </g>
          ))}
          {cross > 0 && (
            <>
              <line
                x1={40}
                y1={60}
                x2={40 + 540 * cross}
                y2={60 + 560 * cross}
                stroke={P.coral}
                strokeWidth={16}
                strokeLinecap="round"
              />
              <line
                x1={580}
                y1={60}
                x2={580 - 540 * cross}
                y2={60 + 560 * cross}
                stroke={P.coral}
                strokeWidth={16}
                strokeLinecap="round"
              />
            </>
          )}
        </g>
        {/* чек */}
        <g opacity={b} transform={`translate(0 ${(1 - b) * 80})`}>
          <Receipt
            x={1120}
            y={100}
            w={460}
            items={["Подгузники", "Салфетки", "Пиво ×6", "Чипсы"]}
            mark={
              hl > 0.5 ? { Подгузники: "#DDEEFF", "Пиво ×6": "#FCE3BC" } : {}
            }
            title="ЧЕК · ПТ 19:42"
            s={1.15}
          />
        </g>
        {/* глаз */}
        <Pop s={eye} x={960} y={420}>
          <circle cx={960} cy={420} r={110} fill="#fff" />
          <path
            d="M 880 420 Q 960 350 1040 420 Q 960 490 880 420 Z"
            fill={P.navy}
            transform={`translate(0 420) scale(1 ${blink}) translate(0 -420)`}
          />
          <circle
            cx={960 + Math.sin(frame / 15) * 10}
            cy={420}
            r={26}
            fill={P.teal}
            opacity={blink}
          />
        </Pop>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 54,
          color: P.navy,
          opacity: eye,
          transform: `translateY(${(1 - eye) * 20}px)`,
        }}
      >
        Не спрашивает — <span style={{ color: P.teal }}>наблюдает</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. Переставили полки — результат ----------
export const Move: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 135, c2 = 168] = cue;
  const iso = makeIso(640, 520);
  const mv = interpolate(frame, [c0 + 30, c0 + 100], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const lift = Math.sin(mv * Math.PI) * 90;
  const q = useSp(c1, 10);
  const bar1 = interpolate(frame, [c2 + 6, c2 + 30], [0, 230], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const bar2 = interpolate(frame, [c2 + 26, c2 + 56], [0, 460], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const chart = useSp(c2, 12);
  const bx = interpolate(mv, [0, 1], [380, -40]);
  const by = interpolate(mv, [0, 1], [-420, -20]);
  const beerC: [string, string, string] = ["#FFD38A", P.beer, P.beerDark];
  const diaC: [string, string, string] = ["#CFE6FF", P.diaper, P.diaperDark];
  const grey: [string, string, string] = ["#EFE7DC", "#D9CBB8", "#C4B39C"];
  return (
    <AbsoluteFill style={{ background: "#EEF1F8" }}>
      <svg width={1920} height={1080}>
        <polygon
          points={pp([
            iso(-520, -560, 0),
            iso(520, -560, 0),
            iso(520, 380, 0),
            iso(-520, 380, 0),
          ])}
          fill="#DCE3F2"
        />
        {[-300, 140].map((y) => (
          <Box
            key={y}
            iso={iso}
            x={-420}
            y={y}
            z={0}
            w={260}
            d={70}
            h={110}
            c={grey}
          />
        ))}
        {/* старое место пива: пунктир */}
        <polygon
          points={pp([
            iso(380, -420, 0),
            iso(560, -420, 0),
            iso(560, -340, 0),
            iso(380, -340, 0),
          ])}
          fill="none"
          stroke={P.coral}
          strokeWidth={4}
          strokeDasharray="12 10"
          opacity={mv}
        />
        <Box iso={iso} x={-150} y={-20} z={0} w={180} d={80} h={130} c={diaC} />
        {(() => {
          const a = iso(-60, -20, 140);
          return (
            <Tag
              x={a[0]}
              y={a[1] - 50}
              text="ПОДГУЗНИКИ"
              bg="#fff"
              fg={P.diaperDark}
              w={250}
            />
          );
        })()}
        <g transform={`translate(0 ${-lift})`}>
          <Box iso={iso} x={bx} y={by} z={0} w={180} d={80} h={130} c={beerC} />
          {(() => {
            const a = iso(bx + 180, by + 80, 40);
            return (
              <Tag
                x={a[0] + 110}
                y={a[1] + 10}
                text="ПИВО"
                bg="#fff"
                fg={P.beerDark}
                w={150}
              />
            );
          })()}
        </g>
        {mv > 0 &&
          mv < 1 &&
          (() => {
            const a = iso(470, -380, 140),
              b = iso(80, 20, 140);
            return (
              <path
                d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${Math.min(a[1], b[1]) - 200} ${b[0]} ${b[1]}`}
                stroke={P.coral}
                strokeWidth={6}
                strokeDasharray="14 12"
                fill="none"
              />
            );
          })()}
        {/* график */}
        <g opacity={chart} transform={`translate(0 ${(1 - chart) * 40})`}>
          <rect x={1200} y={140} width={620} height={660} rx={36} fill="#fff" />
          <text
            x={1240}
            y={210}
            fontFamily={MONO}
            fontWeight={700}
            fontSize={24}
            fill={P.muted}
          >
            ПРОДАЖИ ПИВА · ПЯТНИЦА ВЕЧЕР
          </text>
          <line
            x1={1260}
            y1={740}
            x2={1780}
            y2={740}
            stroke={P.navy}
            strokeWidth={4}
          />
          <rect
            x={1320}
            y={740 - bar1}
            width={150}
            height={bar1}
            rx={12}
            fill="#C9D2E0"
          />
          <rect
            x={1560}
            y={740 - bar2}
            width={150}
            height={bar2}
            rx={12}
            fill={P.beer}
          />
          <text
            x={1395}
            y={780}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={30}
            fill={P.muted}
          >
            до
          </text>
          <text
            x={1635}
            y={780}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={800}
            fontSize={30}
            fill={P.navy}
          >
            после
          </text>
          {bar2 > 440 && (
            <path
              d="M 1590 250 L 1635 205 L 1680 250"
              stroke={P.teal}
              strokeWidth={10}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>
      <Head s={1} size={64} y={70}>
        Пиво — <span style={{ color: P.beerDark }}>ближе к подгузникам</span>
      </Head>
      <div style={{ position: "absolute", top: 160, left: 110 }}>
        <Chip text="Результат?" bg={P.navy} fg="#fff" s={q} size={40} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8. Сегодня: на анализе корзины держится многое ----------
export const Today: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 158, c2 = 293] = cue;
  const quotes = (i: number) =>
    spring({ frame: frame - c0 - i * 7, fps: 30, config: { damping: 12 } });
  const hub = useSp(c1, 12);
  const spoke = (i: number) =>
    spring({ frame: frame - c2 - i * 30, fps: 30, config: { damping: 12 } });
  const fadeQ = interpolate(frame, [c1 - 10, c1 + 10], [1, 0], clamp);
  const where = useSp(c2 + 130, 12);
  const price = Math.round(
    interpolate(frame, [c2 + 60, c2 + 90], [199, 179], clamp),
  );
  const cards = [
    { x: 300, t: "Персональные\nрекомендации" },
    { x: 960, t: "Динамические\nцены" },
    { x: 1620, t: "Точечные\nакции" },
  ];
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        {/* цитаты и статьи */}
        <g opacity={fadeQ}>
          {Array.from({ length: 9 }, (_, i) => {
            const s = quotes(i);
            const x = 200 + (i % 5) * 330 + (Math.floor(i / 5) ? 160 : 0);
            const y = 330 + Math.floor(i / 5) * 230;
            return (
              <g
                key={i}
                transform={`translate(${x} ${y + (1 - s) * 200}) rotate(${((i * 37) % 11) - 5})`}
                opacity={s}
              >
                <rect
                  x={-130}
                  y={-80}
                  width={260}
                  height={170}
                  rx={18}
                  fill="#fff"
                />
                <text
                  x={-100}
                  y={-20}
                  fontFamily="'PT Serif', serif"
                  fontWeight={700}
                  fontSize={70}
                  fill={P.coral}
                >
                  “
                </text>
                {[0, 1, 2].map((k) => (
                  <rect
                    key={k}
                    x={-40}
                    y={-40 + k * 30}
                    width={140 - k * 30}
                    height={12}
                    rx={6}
                    fill="#D7DEE8"
                  />
                ))}
                <text
                  x={-100}
                  y={68}
                  fontFamily={MONO}
                  fontWeight={500}
                  fontSize={18}
                  fill={P.muted}
                >
                  пиво · подгузники
                </text>
              </g>
            );
          })}
        </g>
        {/* хаб */}
        <g opacity={hub}>
          {cards.map((c, i) => {
            const k = spoke(i);
            return (
              <line
                key={i}
                x1={960}
                y1={330}
                x2={960 + (c.x - 960) * k}
                y2={330 + 250 * k}
                stroke={P.navy}
                strokeWidth={5}
                strokeDasharray="12 10"
              />
            );
          })}
          <circle cx={960} cy={330} r={150 * hub} fill="#fff" />
          <g transform={`translate(960 360) scale(${0.42 * hub})`}>
            <Basket x={0} y={0}>
              <g transform="translate(-60 -80) scale(0.5)">
                <DiaperPack x={0} y={0} />
              </g>
              <g transform="translate(70 -90) scale(0.55)">
                <BeerBottle x={0} y={0} />
              </g>
            </Basket>
          </g>
        </g>
        {cards.map((c, i) => {
          const k = spoke(i);
          return (
            <Pop key={i} s={k} x={c.x} y={650}>
              <rect
                x={c.x - 240}
                y={560}
                width={480}
                height={240}
                rx={34}
                fill="#fff"
              />
              {i === 0 && (
                <g transform={`translate(${c.x - 215} 590)`}>
                  <rect width={110} height={180} rx={18} fill={P.navy} />
                  <rect
                    x={10}
                    y={20}
                    width={90}
                    height={140}
                    rx={8}
                    fill="#EEF5FF"
                  />
                  <rect
                    x={18}
                    y={34}
                    width={74}
                    height={34}
                    rx={6}
                    fill={P.diaper}
                  />
                  <rect
                    x={18}
                    y={78}
                    width={74}
                    height={34}
                    rx={6}
                    fill={P.beer}
                  />
                  <rect
                    x={18}
                    y={122}
                    width={74}
                    height={24}
                    rx={6}
                    fill="#D7DEE8"
                  />
                </g>
              )}
              {i === 1 && (
                <g
                  transform={`translate(${c.x - 150} 680) rotate(-10) scale(0.8)`}
                >
                  <path
                    d="M -60 -50 L 80 -50 L 120 0 L 80 50 L -60 50 Z"
                    fill={P.mustard}
                  />
                  <text
                    x={20}
                    y={16}
                    textAnchor="middle"
                    fontFamily={SANS}
                    fontWeight={900}
                    fontSize={46}
                    fill={P.navy}
                  >
                    {price}
                  </text>
                </g>
              )}
              {i === 2 && (
                <g transform={`translate(${c.x - 160} 680)`}>
                  {[70, 48, 26].map((r, k) => (
                    <circle key={r} r={r} fill={k % 2 ? "#fff" : P.coral} />
                  ))}
                  <line
                    x1={-90}
                    y1={-60}
                    x2={0}
                    y2={0}
                    stroke={P.navy}
                    strokeWidth={6}
                  />
                </g>
              )}
              {c.t.split("\n").map((line, j) => (
                <text
                  key={j}
                  x={c.x - 20}
                  y={660 + j * 44}
                  textAnchor="start"
                  fontFamily={SANS}
                  fontWeight={900}
                  fontSize={36}
                  fill={P.navy}
                >
                  {line}
                </text>
              ))}
            </Pop>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fadeQ,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            color: P.navy,
            lineHeight: 1.1,
          }}
        >
          Один из самых <span style={{ color: P.coral }}>цитируемых</span>
          <br />
          примеров в ритейле
        </div>
      </div>
      <div
        style={{ position: "absolute", top: 90, right: 120, opacity: where }}
      >
        <Chip
          text="в магазине и онлайн"
          bg={P.teal}
          fg="#fff"
          s={where}
          size={36}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9. Всё началось с одного открытия ----------
export const Finale: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 107] = cue;
  const bulb = useSp(c0, 10);
  const glow = 0.5 + 0.5 * Math.sin(frame / 6);
  const pair = useSp(c1 - 10, 11);
  const line2 = useSp(c1 + 20, 12);
  const clink =
    frame > c1 + 4 && frame < c1 + 40
      ? Math.max(0, Math.sin((frame - c1) / 3))
      : 0;
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <svg width={1920} height={1080}>
        <Pop s={bulb * (1 - pair)} x={960} y={400}>
          <circle
            cx={960}
            cy={360}
            r={220}
            fill={P.mustard}
            opacity={0.18 + glow * 0.12}
          />
          <circle cx={960} cy={360} r={130} fill="#FFE59A" />
          <rect
            x={910}
            y={480}
            width={100}
            height={70}
            rx={14}
            fill="#9AA5B1"
          />
          <path
            d="M 925 420 Q 942 350 960 420 Q 978 350 995 420"
            stroke={P.beerDark}
            strokeWidth={8}
            fill="none"
          />
        </Pop>
        <g opacity={pair}>
          <g transform={`rotate(${-clink * 8} 820 640)`}>
            <DiaperPack x={760} y={480 + (1 - pair) * 200} s={1.7} r={-8} />
          </g>
          <g transform={`rotate(${clink * 10} 1160 640)`}>
            <SixPack x={1180} y={510 + (1 - pair) * 200} s={1.5} r={6} />
          </g>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 68,
          color: P.navy,
          letterSpacing: "-0.03em",
        }}
      >
        <span style={{ opacity: Math.max(bulb * (1 - pair), pair) }}>
          {pair > 0.5 ? "Купил подгузники —" : "Одно неожиданное открытие"}
        </span>
        <div
          style={{
            opacity: line2,
            transform: `translateY(${(1 - line2) * 20}px)`,
            marginTop: 6,
          }}
        >
          <span
            style={{
              background: P.mustard,
              borderRadius: 18,
              padding: "0 22px",
            }}
          >
            возможно, купишь и пиво
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 10. Канал и сайт ----------
export const Channel: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const a = useSp(2, 12),
    q = useSp(14, 11),
    btn = useSp(34, 9);
  const arrow = Math.sin(frame / 5) * 8;
  return (
    <AbsoluteFill style={{ background: P.navy }}>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 140,
          width: 900,
          opacity: a,
          transform: `translateX(${(1 - a) * -40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: "0.12em",
            color: P.mustard,
          }}
        >
          АНАЛИТИКА ПРО
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 76,
            lineHeight: 1.05,
            color: "#fff",
            marginTop: 20,
            letterSpacing: "-0.03em",
          }}
        >
          Найдём такие пары
          <br />
          <span style={{ color: P.mustard }}>в вашем магазине</span>
        </div>
        <div
          style={{
            marginTop: 44,
            display: "inline-block",
            transform: `scale(${btn})`,
            transformOrigin: "left center",
            background: P.coral,
            color: "#fff",
            borderRadius: 999,
            padding: "18px 44px",
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 48,
          }}
        >
          analytic-pro.ru
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 34,
            color: "rgba(255,255,255,0.8)",
            transform: `translateY(${arrow}px)`,
          }}
        >
          ссылка в описании ↓
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 160,
          transform: `scale(${q}) rotate(${(1 - q) * -8}deg)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 26,
            borderRadius: 36,
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }}
        >
          <QR size={420} />
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 38,
            color: P.mustard,
          }}
        >
          @analysis_pro_ru
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          Telegram-канал · приёмы для магазинов
        </div>
      </div>
    </AbsoluteFill>
  );
};
