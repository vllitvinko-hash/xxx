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
import { QR } from "../WalmartH/Art";
import {
  B,
  Backdrop,
  Beer,
  Check,
  Diapers,
  Display,
  Label,
  useT,
} from "./Theme";

// Сцены «Пиво и подгузники» (1920×1080). Вид — из темы; содержание и тайминг общие для трёх стилей.
// Рабочая область кадра — до y≈880, ниже субтитры.

const useSp = (at: number, damping = 14, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass } });
};
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
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
const At: React.FC<{
  x: number;
  y: number;
  s?: number;
  dx?: number;
  dy?: number;
  children: React.ReactNode;
  w?: number;
  style?: React.CSSProperties;
}> = ({ x, y, s = 1, dx = 0, dy = 30, children, w, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity: Math.min(1, s),
      transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);
const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const t = useT();
  return (
    <div
      style={{
        background: t.surface,
        boxShadow: t.shadow,
        borderRadius: t.radius,
        border: t.id === "swiss" ? "3px solid #111" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
const Frame: React.FC<{ children: React.ReactNode; spotX?: number }> = ({
  children,
  spotX,
}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Backdrop spotX={spotX} />
      {children}
    </AbsoluteFill>
  );
};

// ---------- 0. Каждый товар рассказывает историю ----------
export const Intro: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [, c1 = 132, c2 = 256] = cue;
  const lines = ["Каждый товар", "на полке", "рассказывает", "свою историю"];
  const out = ease(frame, c1 - 8, c1 + 6);
  const split = useSp(c1 + 4, 15);
  const after = useSp(c2 - 18, 15);
  const arrow = ease(frame, c2 - 26, c2 - 10);
  const path = ease(frame, c1 + 14, c1 + 70, 0, 100);
  const two = ease(frame, c2 + 14, c2 + 28);
  const scroll = interpolate(frame, [0, 333], [0, -520]);
  const items = [
    "Молоко",
    "Хлеб",
    "Яблоки",
    "Сыр",
    "Подгузники",
    "Кофе",
    "Пиво ×6",
    "Салфетки",
    "Чипсы",
    "Вода",
    "Рис",
    "Масло",
    "Сок",
  ];
  return (
    <Frame spotX={1460}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: 1 - out }}
      >
        <Check
          x={1290}
          y={80 + scroll}
          w={400}
          rows={items}
          hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
          head="ЧЕК № 0001"
          r={4}
        />
      </svg>
      <div
        style={{ position: "absolute", left: 110, top: 120, opacity: 1 - out }}
      >
        {lines.map((l, i) => {
          const s = i === 0 ? 1 : ease(frame, i * 9, i * 9 + 14);
          return (
            <div
              key={l}
              style={{
                opacity: s,
                transform: `translateX(${(1 - s) * -60}px)`,
              }}
            >
              <Display size={150} color={i === 3 ? t.beer : t.ink}>
                {l}
              </Display>
            </div>
          );
        })}
      </div>
      {/* в зале — далеко, в чеке — вместе */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 110,
          opacity: split,
          transform: `translateY(${(1 - split) * 50}px)`,
        }}
      >
        <Label>В зале</Label>
        <svg width={700} height={420} style={{ marginTop: 24 }}>
          <rect
            x={6}
            y={6}
            width={680}
            height={400}
            fill={t.surface}
            stroke={t.ink}
            strokeWidth={4}
          />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={210 + k * 110}
              y={70}
              width={70}
              height={250}
              fill={t.dim}
            />
          ))}
          <rect x={30} y={30} width={150} height={90} fill={t.diaper} />
          <text
            x={105}
            y={84}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={20}
            fill="#fff"
          >
            ПОДГУЗНИКИ
          </text>
          <rect x={516} y={290} width={150} height={90} fill={t.beer} />
          <text
            x={591}
            y={344}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={22}
            fill={t.paperInk}
          >
            ПИВО
          </text>
          <polyline
            points="105,120 105,360 516,360"
            pathLength={100}
            fill="none"
            stroke={t.ink}
            strokeWidth={5}
            strokeDasharray={`${path} 100`}
          />
          {path > 98 && (
            <path
              d="M 498 346 L 516 360 L 498 374"
              stroke={t.ink}
              strokeWidth={5}
              fill="none"
            />
          )}
        </svg>
        <Display size={120} style={{ marginTop: 26 }}>
          в разных концах
        </Display>
      </div>
      <div
        style={{
          position: "absolute",
          left: 880,
          top: 300,
          opacity: arrow,
          transform: `translateX(${(1 - arrow) * -30}px)`,
          fontFamily: t.display,
          fontWeight: 900,
          fontSize: 160,
          color: t.ink,
        }}
      >
        →
      </div>
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 110,
          opacity: after,
          transform: `translateY(${(1 - after) * 40}px)`,
        }}
      >
        <Label color={t.ink}>В чеке</Label>
        <svg width={760} height={420} style={{ marginTop: 24 }}>
          <Check
            x={10}
            y={10}
            w={520}
            rows={["Подгузники", "Пиво ×6"]}
            hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
            head="ПТ · 19:42 · КАССА 2"
            s={1.3}
          />
        </svg>
        <Display size={120} style={{ marginTop: 26, opacity: two }}>
          <B>вместе</B>
        </Display>
      </div>
    </Frame>
  );
};

// ---------- 1. Walmart · анализ корзины ----------
export const Start: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 131, c2 = 203] = cue;
  const era = useSp(c0, 14);
  const name = useSp(c0 + 10, 16);
  const swap = ease(frame, c1 - 6, c1 + 10);
  const nodes = [
    "Хлеб",
    "Масло",
    "Чипсы",
    "Газировка",
    "Подгузники",
    "Пиво",
    "Молоко",
    "Кофе",
  ];
  const R = 280,
    cx = 1380,
    cy = 440;
  const pos = nodes.map((_, i) => {
    const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * R, cy + Math.sin(a) * R * 0.92] as const;
  });
  const links: [number, number][] = [
    [0, 1],
    [2, 3],
    [6, 7],
    [0, 6],
    [3, 5],
    [4, 5],
    [1, 7],
    [2, 5],
  ];
  const net = ease(frame, c2, c2 + 60);
  return (
    <Frame spotX={1380}>
      <At x={110} y={110} s={era} dx={-40} dy={0}>
        <Label color={t.beer}>Конец 1990-х · США</Label>
      </At>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 170,
          opacity: name * (1 - swap),
          transform: `translateY(${(1 - name) * 40}px)`,
        }}
      >
        <Display size={250}>Walmart</Display>
        <div
          style={{
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 40,
            color: t.muted,
            marginTop: 18,
          }}
        >
          американская сеть супермаркетов
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 190,
          opacity: swap,
          transform: `translateY(${(1 - swap) * 40}px)`,
        }}
      >
        <Display size={112}>{"Анализ\nпокупательской"}</Display>
        <Display size={112} color={t.beer}>
          корзины
        </Display>
        <Label style={{ marginTop: 26, opacity: net }}>
          Market Basket Analysis
        </Label>
      </div>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {links.map(([a, b], i) => {
          const k = interpolate(net, [i * 0.08, i * 0.08 + 0.3], [0, 1], clamp);
          const hot = (a === 4 && b === 5) || (a === 5 && b === 4);
          return (
            <line
              key={i}
              x1={pos[a][0]}
              y1={pos[a][1]}
              x2={pos[a][0] + (pos[b][0] - pos[a][0]) * k}
              y2={pos[a][1] + (pos[b][1] - pos[a][1]) * k}
              stroke={hot ? t.beer : t.ink}
              strokeWidth={hot ? 6 : 2.5}
              opacity={hot ? 1 : 0.5}
            />
          );
        })}
        {nodes.map((n, i) => {
          const s = spring({
            frame: frame - c1 - i * 4,
            fps: 30,
            config: { damping: 13 },
          });
          const col =
            n === "Пиво"
              ? t.mark
                ? "#8A6A00"
                : t.beer
              : n === "Подгузники"
                ? t.diaper
                : t.ink;
          return (
            <Pop key={n} s={s} x={pos[i][0]} y={pos[i][1]}>
              <circle cx={pos[i][0]} cy={pos[i][1]} r={14} fill={col} />
              <text
                x={pos[i][0]}
                y={pos[i][1] - 30}
                textAnchor="middle"
                fontFamily={t.mono}
                fontWeight={700}
                fontSize={24}
                fill={col}
              >
                {n.toUpperCase()}
              </text>
            </Pop>
          );
        })}
      </svg>
    </Frame>
  );
};

// ---------- 2. Идея была простой ----------
export const Idea: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 49, c2 = 175] = cue;
  const head = useSp(c0, 14);
  const pair = useSp(c1 + 2, 13);
  const col = (i: number) =>
    spring({ frame: frame - c2 - i * 34, fps: 30, config: { damping: 14 } });
  const swap = ease(frame, c2 + 30, c2 + 70);
  const stock = (i: number) => ease(frame, c2 + 90 + i * 5, c2 + 110 + i * 5);
  const titles = [
    "Как расставить\nмагазин",
    "Какие делать\nсовместные акции",
    "Как планировать\nзапасы",
  ];
  return (
    <Frame spotX={960}>
      <At x={110} y={100} s={head} dx={-40} dy={0}>
        <Display size={130}>
          Идея была <B>простой</B>
        </Display>
      </At>
      <At x={110} y={270} s={pair} dx={0} dy={20}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontFamily: t.mono,
            fontWeight: 700,
            fontSize: 34,
            color: t.ink,
          }}
        >
          <span>НАЙДИ ПАРЫ</span>
          <span style={{ color: t.diaper }}>■ A</span>
          <span>+</span>
          <B>■ Б</B>
          <span style={{ color: t.muted }}>→ УМНЫЕ РЕШЕНИЯ</span>
        </div>
      </At>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 380,
          display: "flex",
          gap: 44,
        }}
      >
        {titles.map((title, i) => {
          const s = col(i);
          return (
            <div
              key={title}
              style={{
                flex: 1,
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px)`,
              }}
            >
              <div
                style={{
                  borderTop: `4px solid ${t.ink}`,
                  paddingTop: 16,
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                }}
              >
                <Display
                  size={96}
                  color={i === 1 ? t.beer : i === 0 ? t.diaper : t.ink}
                >
                  {`0${i + 1}`}
                </Display>
                <div
                  style={{
                    fontFamily: t.body,
                    fontWeight: 800,
                    fontSize: 36,
                    lineHeight: 1.15,
                    color: t.ink,
                    whiteSpace: "pre-line",
                    paddingTop: 10,
                  }}
                >
                  {title}
                </div>
              </div>
              <svg width={520} height={260} style={{ marginTop: 20 }}>
                {i === 0 && (
                  <>
                    {[0, 1, 2].map((r) => (
                      <rect
                        key={r}
                        x={10}
                        y={20 + r * 76}
                        width={480}
                        height={44}
                        fill={t.dim}
                      />
                    ))}
                    <rect
                      x={10}
                      y={96}
                      width={150}
                      height={44}
                      fill={t.diaper}
                    />
                    <rect
                      x={10 + 160 + 300 * (1 - swap)}
                      y={96 - 76 * (1 - swap)}
                      width={150}
                      height={44}
                      fill={t.beer}
                    />
                  </>
                )}
                {i === 1 && (
                  <g transform="translate(250 120) rotate(-6)">
                    <rect
                      x={-180}
                      y={-70}
                      width={360}
                      height={140}
                      fill={t.accent}
                      rx={t.radius}
                    />
                    <text
                      x={0}
                      y={26}
                      textAnchor="middle"
                      fontFamily={t.display}
                      fontWeight={900}
                      fontSize={
                        t.id === "riso" ? 32 : t.id === "swiss" ? 42 : 70
                      }
                      fill="#fff"
                    >
                      −20% ЗА ПАРУ
                    </text>
                  </g>
                )}
                {i === 2 &&
                  [0, 1, 2, 3, 4, 5].map((k) => {
                    const h = (60 + k * 30) * stock(k);
                    return (
                      <rect
                        key={k}
                        x={20 + k * 80}
                        y={240 - h}
                        width={56}
                        height={h}
                        fill={k === 5 ? t.beer : t.dim}
                      />
                    );
                  })}
              </svg>
            </div>
          );
        })}
      </div>
    </Frame>
  );
};

// ---------- 3. Тысячи чеков, миллионы покупок ----------
export const Data: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 116, c2 = 210] = cue;
  const head = useSp(c0, 14);
  const COLS = 33,
    ROWS = 15;
  const filled = Math.floor(
    interpolate(frame, [c0 + 6, c2 - 6], [0, COLS * ROWS], {
      ...clamp,
      easing: Easing.in(Easing.quad),
    }),
  );
  const found = ease(frame, c2, c2 + 24);
  const bar = useSp(c1, 13);
  const A = 7 * COLS + 9,
    B = 13 * COLS + 25;
  const P = (i: number) =>
    [1000 + (i % COLS) * 26, 230 + Math.floor(i / COLS) * 40] as const;
  const counter = Math.round(
    interpolate(frame, [c0, c2], [0, 1000000], {
      ...clamp,
      easing: Easing.in(Easing.quad),
    }),
  );
  return (
    <Frame spotX={500}>
      <At x={110} y={100} s={head} dx={-40} dy={0}>
        <Display size={92}>Тысячи чеков.</Display>
        <Display size={92} color={t.beer}>
          Миллионы покупок.
        </Display>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const s = ease(frame, c0 + i * 10, c0 + i * 10 + 20);
          return (
            <Check
              key={i}
              x={110 + i * 40}
              y={400 + i * 34 + (1 - s) * 300}
              w={300}
              rows={["Товар", "Товар", "Товар"]}
              r={-6 + i * 3}
              s={0.8}
              o={s * (0.3 + i * 0.17)}
            />
          );
        })}
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          if (i >= filled) return null;
          const [x, y] = P(i);
          const h = (i * 2654435761) % 997;
          const hot = i === A || i === B;
          const c = hot
            ? i === A
              ? t.diaper
              : t.beer
            : h % 13 === 0
              ? t.beer
              : h % 11 === 0
                ? t.diaper
                : t.dim;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hot ? 6 + found * 8 : 4}
              fill={c}
              opacity={found > 0 && !hot ? 1 - found * 0.6 : 1}
            />
          );
        })}
        {found > 0 &&
          (() => {
            const [ax, ay] = P(A),
              [bx, by] = P(B);
            return (
              <path
                d={`M ${ax} ${ay} Q ${(ax + bx) / 2 + 40} ${ay - 160} ${bx} ${by}`}
                stroke={t.ink}
                strokeWidth={4}
                fill="none"
                strokeDasharray={`${found * 900} 900`}
              />
            );
          })()}
        <Pop s={bar} x={560} y={580}>
          <rect
            x={520}
            y={500}
            width={300}
            height={130}
            fill={t.paper}
            stroke={t.id === "swiss" ? "#111" : "none"}
            strokeWidth={3}
          />
          {Array.from({ length: 26 }, (_, i) => (
            <rect
              key={i}
              x={538 + i * 10.4}
              y={516}
              width={(i * 7) % 3 === 0 ? 6 : 3}
              height={80}
              fill={t.paperInk}
            />
          ))}
          <line
            x1={820}
            y1={565}
            x2={880}
            y2={565}
            stroke={t.ink}
            strokeWidth={3}
            strokeDasharray="8 6"
          />
        </Pop>
      </svg>
      <At x={900} y={810} s={1}>
        <Label>{`1 точка = 1 штрихкод · ${counter.toLocaleString("ru-RU")}`}</Label>
      </At>
      <At x={1380} y={70} s={found} dx={0} dy={-20}>
        <Label color={t.accent} style={{ fontSize: 30 }}>
          ● найдено неожиданное
        </Label>
      </At>
    </Frame>
  );
};

// ---------- 4. Пары ----------
export const Pairs: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 131, c2 = 199, c3 = 262] = cue;
  const r1 = useSp(c0 + 10, 14),
    r2 = useSp(c0 + 50, 14);
  const dimR = ease(frame, c1, c1 + 20);
  const big = useSp(c2, 12);
  const stamp = useSp(c3, 9);
  return (
    <Frame spotX={1300}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 110,
          opacity: 1 - dimR * 0.75,
        }}
      >
        <Label>Привычные пары</Label>
        {[
          ["Хлеб", "масло", r1],
          ["Чипсы", "газировка", r2],
        ].map(([a, b, s]) => (
          <div
            key={a as string}
            style={{
              opacity: s as number,
              transform: `translateX(${(1 - (s as number)) * -40}px)`,
              marginTop: 18,
            }}
          >
            <Display size={84} color={t.muted}>{`${a} + ${b}`}</Display>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 470,
          opacity: big,
          transform: `translateY(${(1 - big) * 40}px)`,
        }}
      >
        <Label color={t.accent}>Странная парочка</Label>
        <Display size={150} color={t.diaper} style={{ marginTop: 12 }}>
          Подгузники
        </Display>
        <Display size={150} color={t.beer}>
          + пиво
        </Display>
      </div>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Pop s={big} x={1400} y={600}>
          <Diapers x={1300} y={500} s={1.25} r={-5} id="pd" />
          <Beer x={1610} y={530} s={1.25} r={6} id="pb" />
        </Pop>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 1230,
          top: 120,
          opacity: stamp,
          transform: `rotate(-10deg) scale(${2.2 - 1.2 * stamp})`,
        }}
      >
        <div
          style={{
            border: `8px solid ${t.accent}`,
            color: t.accent,
            padding: "6px 26px",
            fontFamily: t.display,
            fontWeight: t.displayWeight,
            fontSize: 80 * t.displaySize + 10,
            textTransform: "uppercase",
          }}
        >
          Не шутка
        </div>
      </div>
    </Frame>
  );
};

// ---------- план зала (сцены 5 и 7) ----------
const PLAN = { x: 980, y: 120, w: 820, h: 700 };
const ZONES = {
  door: { x: 1000, y: 700, w: 160, h: 100, name: "ВХОД" },
  kids: { x: 1020, y: 160, w: 300, h: 160, name: "ДЕТСКИЙ ОТДЕЛ" },
  drinks: { x: 1500, y: 560, w: 280, h: 140, name: "НАПИТКИ" },
  till: { x: 1500, y: 730, w: 280, h: 70, name: "КАССА" },
};
const Plan: React.FC<{ hide?: string[] }> = ({ hide = [] }) => {
  const t = useT();
  return (
    <g>
      <rect
        x={PLAN.x}
        y={PLAN.y}
        width={PLAN.w}
        height={PLAN.h}
        fill={t.id === "noir" ? "#15171C" : t.surface}
        stroke={t.ink}
        strokeWidth={t.id === "swiss" ? 4 : 3}
        opacity={t.id === "noir" ? 0.95 : 1}
      />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={1060 + i * 170}
          y={380}
          width={110}
          height={140}
          fill={t.dim}
        />
      ))}
      {Object.entries(ZONES)
        .filter(([k]) => !hide.includes(k))
        .map(([k, z]) => (
          <g key={k}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              fill="none"
              stroke={
                k === "kids" ? t.diaper : k === "drinks" ? t.beer : t.muted
              }
              strokeWidth={3}
              strokeDasharray={k === "door" || k === "till" ? "8 8" : undefined}
            />
            <text
              x={z.x + 14}
              y={z.y + 34}
              fontFamily={t.mono}
              fontWeight={700}
              fontSize={22}
              fill={
                k === "kids"
                  ? t.diaper
                  : k === "drinks"
                    ? t.mark
                      ? "#8A6A00"
                      : t.beer
                    : t.muted
              }
            >
              {z.name}
            </text>
          </g>
        ))}
    </g>
  );
};
// точка на ломаной по доле пути
const along = (pts: [number, number][], u: number): [number, number] => {
  const seg = pts
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = u * seg.reduce((a, b) => a + b, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) {
      const k = d / seg[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k,
      ];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};

// ---------- 5. Пятница, вечер ----------
export const Friday: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 188, c2 = 261] = cue;
  const pts: [number, number][] = [
    [1080, 760],
    [1080, 600],
    [1170, 330],
    [1170, 600],
    [1640, 600],
    [1640, 680],
    [1640, 760],
  ];
  // путь: до подгузников к c1, до пива к c2, к кассе в конце
  const u = interpolate(
    frame,
    [c0 + 10, c1, c1 + 20, c2, c2 + 20, 380],
    [0, 0.31, 0.31, 0.78, 0.78, 1],
    clamp,
  );
  const [px, py] = along(pts, u);
  const trail = Array.from({ length: 60 }, (_, i) => along(pts, (u * i) / 59));
  const head = useSp(c0, 14);
  const who = useSp(c0 + 60, 14);
  const gotD = useSp(c1, 11);
  const gotB = useSp(c2, 11);
  const tv = useSp(c2 + 40, 12);
  const mins = Math.round(
    interpolate(frame, [0, 397], [18 * 60 + 40, 19 * 60 + 35]),
  );
  const hhmm = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}`;
  return (
    <Frame spotX={1390}>
      <At x={110} y={100} s={head} dx={-40} dy={0}>
        <Label color={t.beer}>Пятница · вечер</Label>
        <Display
          size={200}
          style={{ marginTop: 10, fontVariantNumeric: "tabular-nums" }}
        >
          {hhmm}
        </Display>
      </At>
      <At x={110} y={420} s={who} dx={-40} dy={0}>
        <Display size={84}>{"Молодые папы"}</Display>
        <div
          style={{
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 34,
            color: t.muted,
            marginTop: 14,
            lineHeight: 1.3,
          }}
        >
          заходят за подгузниками,
          <br />
          на выходе берут пиво —
          <br />
          вечером матч
        </div>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Plan />
        <polyline
          points={trail.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={t.ink}
          strokeWidth={4}
          strokeDasharray="10 8"
        />
        <circle cx={px} cy={py} r={16} fill={t.accent} />
        <circle
          cx={px}
          cy={py}
          r={28}
          fill="none"
          stroke={t.accent}
          strokeWidth={3}
          opacity={0.5 + 0.5 * Math.sin(frame / 4)}
        />
        <Pop s={gotD} x={1240} y={250}>
          <Diapers x={1250} y={250} s={0.38} id="fd" />
        </Pop>
        <Pop s={gotB} x={1720} y={620}>
          <Beer x={1730} y={630} s={0.42} id="fb" />
        </Pop>
        <Pop s={tv} x={1640} y={250}>
          <rect
            x={1500}
            y={170}
            width={260}
            height={160}
            fill={t.id === "noir" ? "#222630" : t.ink}
            rx={t.radius}
          />
          <rect x={1516} y={186} width={228} height={128} fill="#2E8B57" />
          <line
            x1={1630}
            y1={186}
            x2={1630}
            y2={314}
            stroke="#fff"
            strokeWidth={3}
            opacity={0.7}
          />
          <circle
            cx={1630}
            cy={250}
            r={24}
            fill="none"
            stroke="#fff"
            strokeWidth={3}
            opacity={0.7}
          />
          <circle
            cx={1580 + Math.sin(frame / 6) * 40}
            cy={240 + Math.cos(frame / 5) * 30}
            r={7}
            fill="#fff"
          />
          <text
            x={1630}
            y={360}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={22}
            fill={t.muted}
          >
            ВЕЧЕРНИЙ МАТЧ
          </text>
        </Pop>
      </svg>
    </Frame>
  );
};

// ---------- 6. Опрос против чеков ----------
export const Survey: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 84, c2 = 165] = cue;
  const a = useSp(c0, 14),
    b = useSp(c1 - 14, 14);
  const cross = ease(frame, c1, c1 + 14);
  const hl = ease(frame, c1 + 10, c1 + 24);
  const verdict = useSp(c2, 13);
  return (
    <Frame spotX={1400}>
      <At x={110} y={110} s={a} dx={-40} dy={0} w={760}>
        <Card
          style={{
            padding: "40px 44px",
            position: "relative",
          }}
        >
          <Label>Опрос</Label>
          <div
            style={{
              fontFamily: t.body,
              fontWeight: 800,
              fontSize: 40,
              color: t.id === "noir" ? t.ink : t.ink,
              marginTop: 18,
              lineHeight: 1.2,
            }}
          >
            Что вы купите вместе с подгузниками?
          </div>
          {["Влажные салфетки", "Детское питание", "Ничего"].map((o, i) => (
            <div
              key={o}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
                marginTop: 22,
                fontFamily: t.body,
                fontWeight: 600,
                fontSize: 34,
                color: t.muted,
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  border: `3px solid ${t.muted}`,
                  display: "inline-block",
                  background: i === 0 ? t.muted : "transparent",
                }}
              />
              {o}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -36,
              opacity: cross,
              transform: `rotate(-3deg) scale(${0.9 + 0.1 * cross})`,
              background: t.ink,
              color: t.bg,
              fontFamily: t.body,
              fontWeight: 900,
              fontSize: 34,
              padding: "12px 22px",
            }}
          >
            про пиво в опросе не скажут
          </div>
        </Card>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity={b} transform={`translate(0 ${(1 - b) * 60})`}>
          <Check
            x={1050}
            y={110}
            w={460}
            rows={["Подгузники", "Салфетки", "Пиво ×6", "Чипсы"]}
            hi={hl > 0.5 ? { Подгузники: "diaper", "Пиво ×6": "beer" } : {}}
            head="ЧЕК · ПТ 19:42"
            s={1.1}
          />
        </g>
      </svg>
      <At x={110} y={680} s={verdict} dx={0} dy={30}>
        <Display size={100}>
          Не спрашивает — <B>наблюдает</B>
        </Display>
      </At>
    </Frame>
  );
};

// ---------- 7. Перестановка и результат ----------
export const Move: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 135, c2 = 168] = cue;
  const head = useSp(c0, 14);
  const mv = interpolate(frame, [c0 + 20, c0 + 90], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const q = useSp(c1, 12);
  const chart = useSp(c2, 14);
  const b1 = ease(frame, c2 + 6, c2 + 30, 0, 200);
  const b2 = ease(frame, c2 + 24, c2 + 56, 0, 420);
  const from = ZONES.drinks,
    to = { x: 1340, y: 160 };
  const zx = from.x + (to.x - from.x) * mv,
    zy = from.y + (to.y - from.y) * mv;
  const chartOn = chart > 0.01;
  return (
    <Frame spotX={1390}>
      <At x={110} y={100} s={head} dx={-40} dy={0}>
        <Display size={104}>{"Пиво —\nближе\nк подгузникам"}</Display>
      </At>
      <At x={110} y={560} s={q} dx={-30} dy={0}>
        <Display size={96} color={t.beer}>
          Результат?
        </Display>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, opacity: 1 - chart * 0.85 }}
      >
        <Plan hide={["drinks"]} />
        <rect
          x={from.x}
          y={from.y}
          width={from.w}
          height={from.h}
          fill="none"
          stroke={t.beer}
          strokeWidth={3}
          strokeDasharray="6 8"
          opacity={mv * 0.6}
        />
        <path
          d={`M ${from.x + 140} ${from.y + 70} Q 1700 300 ${to.x + 140} ${to.y + 70}`}
          stroke={t.accent}
          strokeWidth={4}
          strokeDasharray="10 8"
          fill="none"
          opacity={mv > 0 && mv < 1 ? 1 : 0}
        />
        <rect
          x={zx}
          y={zy}
          width={from.w * 0.62}
          height={from.h}
          fill={t.beer}
          opacity={0.9}
        />
        <text
          x={zx + 16}
          y={zy + 40}
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={24}
          fill={t.id === "swiss" ? "#111" : t.bg}
        >
          ПИВО
        </text>
      </svg>
      {chartOn && (
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0, opacity: chart }}
        >
          <text
            x={1000}
            y={180}
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={26}
            fill={t.muted}
            letterSpacing="3"
          >
            ПРОДАЖИ ПИВА · ПЯТНИЦА ВЕЧЕР
          </text>
          <line
            x1={1000}
            y1={800}
            x2={1780}
            y2={800}
            stroke={t.ink}
            strokeWidth={4}
          />
          <rect x={1080} y={800 - b1} width={220} height={b1} fill={t.dim} />
          <rect x={1440} y={800 - b2} width={220} height={b2} fill={t.beer} />
          <text
            x={1190}
            y={850}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={28}
            fill={t.muted}
          >
            ДО
          </text>
          <text
            x={1550}
            y={850}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={28}
            fill={t.ink}
          >
            ПОСЛЕ
          </text>
          {b2 > 400 && (
            <path
              d="M 1500 330 L 1550 280 L 1600 330"
              stroke={t.ink}
              strokeWidth={8}
              fill="none"
            />
          )}
        </svg>
      )}
    </Frame>
  );
};

// ---------- 8. Самый цитируемый пример · сегодня ----------
export const Today: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 158, c2 = 293] = cue;
  const head = useSp(c0, 14);
  const outQ = ease(frame, c1 - 10, c1 + 8);
  const hub = useSp(c1 + 4, 14);
  const item = (i: number) =>
    spring({ frame: frame - c2 - i * 26, fps: 30, config: { damping: 14 } });
  const where = useSp(c2 + 120, 13);
  const price = Math.round(
    interpolate(frame, [c2 + 50, c2 + 80], [199, 179], clamp),
  );
  const cites = [
    "учебники по ритейлу",
    "курсы data science",
    "лекции по маркетингу",
    "статьи о big data",
    "кейсы мерчандайзинга",
    "конференции по аналитике",
  ];
  return (
    <Frame spotX={960}>
      <div style={{ opacity: 1 - outQ }}>
        <At x={110} y={100} s={head} dx={-40} dy={0}>
          <Display size={110}>{"Один из самых\nцитируемых примеров"}</Display>
        </At>
        <div
          style={{
            position: "absolute",
            left: 110,
            right: 110,
            top: 400,
            display: "flex",
            flexWrap: "wrap",
            gap: 22,
          }}
        >
          {cites.map((c, i) => {
            const s = ease(frame, c0 + 20 + i * 9, c0 + 36 + i * 9);
            return (
              <div
                key={c}
                style={{
                  opacity: s,
                  transform: `translateY(${(1 - s) * 30}px)`,
                  fontFamily: t.mono,
                  fontWeight: 700,
                  fontSize: 28,
                  color: t.ink,
                  border: `2px solid ${t.dim}`,
                  padding: "14px 22px",
                  borderRadius: t.radius,
                }}
              >
                <B>[{i + 1}]</B> {c} · «пиво и подгузники»
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ opacity: hub }}>
        <At x={110} y={100} s={hub} dx={0} dy={20}>
          <Label>Сегодня на этом держится</Label>
          <Display size={110} style={{ marginTop: 12 }}>
            Анализ <B>корзины</B>
          </Display>
        </At>
        <div
          style={{
            position: "absolute",
            left: 110,
            right: 110,
            top: 420,
            display: "flex",
            gap: 44,
          }}
        >
          {[
            ["Персональные\nрекомендации", "С этим покупают →"],
            ["Динамические\nцены", `${price} ₽`],
            ["Точечные\nакции", "−15% папам в пятницу"],
          ].map(([a, b], i) => {
            const s = item(i);
            return (
              <div
                key={a}
                style={{
                  flex: 1,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 50}px)`,
                  borderTop: `4px solid ${i === 0 ? t.diaper : i === 1 ? t.beer : t.accent}`,
                  paddingTop: 22,
                }}
              >
                <div
                  style={{
                    fontFamily: t.body,
                    fontWeight: 900,
                    fontSize: 46,
                    lineHeight: 1.1,
                    color: t.ink,
                    whiteSpace: "pre-line",
                  }}
                >
                  {a}
                </div>
                <div
                  style={{
                    fontFamily: t.mono,
                    fontWeight: 700,
                    fontSize: 30,
                    color: t.muted,
                    marginTop: 20,
                  }}
                >
                  {b}
                </div>
              </div>
            );
          })}
        </div>
        <At x={110} y={760} s={where} dx={0} dy={20}>
          <Label color={t.beer} style={{ fontSize: 32 }}>
            в магазине и онлайн
          </Label>
        </At>
      </div>
    </Frame>
  );
};

// ---------- 9. Финал ----------
export const Finale: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 4, c1 = 107] = cue;
  const a = useSp(c0, 14);
  const swap = ease(frame, c1 - 8, c1 + 8);
  const prod = useSp(c1 - 4, 12);
  const clink =
    frame > c1 + 10 && frame < c1 + 40
      ? Math.max(0, Math.sin((frame - c1 - 10) / 3))
      : 0;
  return (
    <Frame spotX={1440}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 160,
          opacity: a * (1 - swap),
        }}
      >
        <Display size={140}>{"Всё началось\nс одного"}</Display>
        <Display size={140} color={t.beer}>
          открытия
        </Display>
      </div>
      <div style={{ position: "absolute", left: 110, top: 140, opacity: swap }}>
        <Display size={120} color={t.diaper}>
          Купил подгузники —
        </Display>
        <Display size={96} style={{ marginTop: 16 }}>
          {"возможно,\nкупишь"}
        </Display>
        <Display size={150} color={t.beer}>
          и пиво
        </Display>
      </div>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Pop s={prod} x={1480} y={620}>
          <g transform={`rotate(${-clink * 6} 1380 780)`}>
            <Diapers x={1360} y={560} s={1.05} r={-4} id="nd" />
          </g>
          <g transform={`rotate(${clink * 8} 1660 780)`}>
            <Beer x={1660} y={580} s={1.05} r={5} id="nb" />
          </g>
        </Pop>
      </svg>
    </Frame>
  );
};

// ---------- 10. Канал и сайт ----------
export const Channel: React.FC<SceneProps> = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const a = useSp(2, 14),
    q = useSp(14, 12),
    btn = useSp(30, 10);
  const arrow = Math.sin(frame / 5) * 8;
  return (
    <Frame spotX={1460}>
      <At x={110} y={110} s={a} dx={-40} dy={0} w={1100}>
        <Label color={t.beer}>Аналитика ПРО</Label>
        <Display size={120} style={{ marginTop: 16 }}>
          {"Найдём такие пары\nв вашем магазине"}
        </Display>
        <div
          style={{
            marginTop: 40,
            display: "inline-block",
            transform: `scale(${btn})`,
            transformOrigin: "left center",
            background: t.beer,
            color: t.id === "noir" ? "#111" : "#111",
            padding: "18px 40px",
            borderRadius: t.radius,
            fontFamily: t.body,
            fontWeight: 900,
            fontSize: 52,
            boxShadow: t.misprint ? `6px 6px 0 ${t.misprint}` : undefined,
          }}
        >
          analytic-pro.ru
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 34,
            color: t.muted,
            transform: `translateY(${arrow}px)`,
          }}
        >
          ссылка в описании ↓
        </div>
      </At>
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 120,
          textAlign: "center",
          transform: `scale(${q}) rotate(${(1 - q) * -6}deg)`,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: t.radius,
            boxShadow: t.shadow,
            border: t.id === "swiss" ? "3px solid #111" : undefined,
          }}
        >
          <QR size={400} color="#111" />
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: t.mono,
            fontWeight: 700,
            fontSize: 36,
            color: t.ink,
          }}
        >
          @analysis_pro_ru
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 26,
            color: t.muted,
          }}
        >
          Telegram-канал
        </div>
      </div>
    </Frame>
  );
};
