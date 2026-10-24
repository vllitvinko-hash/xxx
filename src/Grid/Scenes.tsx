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
import { B, Backdrop, Check, Display, Label, useT } from "../WalmartN/Theme";

// «Вертикаль и горизонталь»: мерчендайзинг видит полку, анализ чеков — весь чек.
// 1920×1080, стиль сайта: светлый фон, тёмно-зелёный, жёлтый маркер. Рабочая область до y≈880.

const useSp = (at: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.8 } });
};
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Backdrop />
      {children}
    </AbsoluteFill>
  );
};
const At: React.FC<{
  x: number;
  y: number;
  s?: number;
  dx?: number;
  dy?: number;
  w?: number;
  children: React.ReactNode;
}> = ({ x, y, s = 1, dx = 0, dy = 30, w, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity: Math.min(1, s),
      transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px)`,
    }}
  >
    {children}
  </div>
);
// номер правила + заголовок
const Rule: React.FC<{ n: number; text: string; s: number; size?: number }> = ({
  n,
  text,
  s,
  size = 84,
}) => {
  const t = useT();
  return (
    <At x={110} y={92} s={s} dx={-40} dy={0}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
        <Display size={150} color={t.diaper}>
          {String(n)}
        </Display>
        <Display size={size}>{text}</Display>
      </div>
    </At>
  );
};

// ---------- общие предметы ----------
const PAL = [
  "#0E4D2E",
  "#FFD23F",
  "#C9C6BC",
  "#7FA88F",
  "#E8B84A",
  "#A9B7AE",
  "#16181A",
];
// аккуратная полка: ряды одинаковых упаковок
const Shelf: React.FC<{
  x: number;
  y: number;
  w: number;
  rows: number;
  seed?: number;
  rowH?: number;
  hiRow?: number;
  tags?: boolean;
  o?: number;
}> = ({
  x,
  y,
  w,
  rows,
  seed = 1,
  rowH = 120,
  hiRow = -1,
  tags = true,
  o = 1,
}) => {
  const t = useT();
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const col = PAL[(seed + r * 2) % PAL.length];
    const n = Math.floor(w / 62);
    for (let k = 0; k < n; k++)
      out.push(
        <rect
          key={`${r}-${k}`}
          x={x + 10 + k * 62}
          y={y + r * rowH + 18}
          width={50}
          height={rowH - 44}
          fill={col}
          opacity={hiRow >= 0 && hiRow !== r ? 0.35 : 1}
        />,
      );
    out.push(
      <rect
        key={`b${r}`}
        x={x}
        y={y + (r + 1) * rowH - 26}
        width={w}
        height={10}
        fill={t.ink}
      />,
    );
    if (tags)
      for (let k = 0; k < n; k += 3)
        out.push(
          <rect
            key={`t${r}-${k}`}
            x={x + 14 + k * 62}
            y={y + (r + 1) * rowH - 16}
            width={40}
            height={14}
            fill="#fff"
            stroke={t.ink}
            strokeWidth={1.5}
          />,
        );
  }
  return <g opacity={o}>{out}</g>;
};
const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  k: number;
  color: string;
  w?: number;
  dash?: boolean;
}> = ({ x1, y1, x2, y2, k, color, w = 12, dash }) => {
  if (k <= 0) return null;
  const ex = x1 + (x2 - x1) * k,
    ey = y1 + (y2 - y1) * k;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = w * 2.6;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={w}
        strokeDasharray={dash ? `${w * 2} ${w * 1.4}` : undefined}
      />
      {k > 0.98 && (
        <polygon
          points={`${x2},${y2} ${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)} ${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`}
          fill={color}
        />
      )}
    </g>
  );
};

// ---------- 0. Красиво ≠ прибыльно ----------
export const Pretty: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [, c1 = 74] = cue;
  const rows = (r: number) => ease(frame, r * 6, r * 6 + 16);
  const chk = useSp(c1 - 4, 13);
  const verdict = useSp(c1 + 30, 12);
  return (
    <Frame>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2, 3, 4].map((r) => (
          <g
            key={r}
            opacity={rows(r)}
            transform={`translate(0 ${(1 - rows(r)) * 20})`}
          >
            <Shelf
              x={110}
              y={110 + r * 140}
              w={1000}
              rows={1}
              rowH={140}
              seed={r * 3 + 1}
            />
          </g>
        ))}
        <g opacity={chk} transform={`translate(${(1 - chk) * 120} 0)`}>
          <Check
            x={1260}
            y={120}
            w={420}
            rows={["Хлеб", "Молоко", "Соус", "Сыр"]}
            head="ЧЕК · СЕГОДНЯ"
            s={1.1}
          />
          <text
            x={1491}
            y={600}
            textAnchor="middle"
            fontFamily={t.display}
            fontWeight={900}
            fontSize={70}
            fill={t.ink}
          >
            1 240 ₽
          </text>
          <text
            x={1491}
            y={650}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={26}
            fill={t.muted}
          >
            ГОД НАЗАД: 1 240 ₽
          </text>
        </g>
      </svg>
      <At x={1260} y={700} s={verdict} dx={0} dy={20}>
        <Display size={92}>
          Красиво <B>≠</B> прибыльно
        </Display>
      </At>
    </Frame>
  );
};

// ---------- 1. Вертикаль: полка за полкой ----------
export const Vertical: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 41, c2 = 158, c3 = 217] = cue;
  const head = useSp(c0 + 4, 14);
  const arrow = ease(frame, c1 + 10, c1 + 80);
  const sauce = useSp(c2, 13);
  const milk = useSp(c3, 13);
  const scan = interpolate(frame, [c1 + 10, c1 + 80], [0, 4], clamp);
  return (
    <Frame>
      <At x={110} y={100} s={head} dx={-40} dy={0}>
        <Label>Мерчендайзинг</Label>
        <Display size={110} style={{ marginTop: 10 }}>
          {"Вертикаль:\nполка\nза полкой"}
        </Display>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={900}
          y={80}
          width={520}
          height={780}
          fill={t.surface}
          stroke={t.ink}
          strokeWidth={4}
        />
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r} opacity={Math.abs(scan - r) < 0.7 ? 1 : 0.45}>
            <Shelf
              x={920}
              y={100 + r * 150}
              w={480}
              rows={1}
              rowH={150}
              seed={r}
            />
          </g>
        ))}
        <Arrow
          x1={1500}
          y1={100}
          x2={1500}
          y2={850}
          k={arrow}
          color={t.diaper}
          w={16}
        />
        <g opacity={sauce} transform={`translate(${(1 - sauce) * 40} 0)`}>
          <rect x={1540} y={250} width={300} height={70} fill={t.beer} />
          <text
            x={1556}
            y={297}
            fontFamily={t.body}
            fontWeight={900}
            fontSize={36}
            fill={t.ink}
          >
            соусы — видно
          </text>
        </g>
        <g opacity={milk} transform={`translate(${(1 - milk) * 40} 0)`}>
          <rect x={1540} y={560} width={340} height={70} fill={t.beer} />
          <text
            x={1556}
            y={607}
            fontFamily={t.body}
            fontWeight={900}
            fontSize={36}
            fill={t.ink}
          >
            молочка — удобно
          </text>
        </g>
      </svg>
    </Frame>
  );
};

// ---------- 2. Горизонталь: весь чек целиком ----------
const DEPTS = ["Соусы", "Молочка", "Хлеб", "Напитки", "Бакалея", "Макароны"];
export const Horizontal: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, , c2 = 110, c3 = 225] = cue;
  const head = useSp(c0 + 4, 14);
  const k = ease(frame, c2 - 10, c2 + 80);
  const ax = 150,
    bx = 1250;
  const pickS = k > 0.06,
    pickM = k > 0.97;
  const rec = useSp(c3, 13);
  return (
    <Frame>
      <At x={110} y={90} s={head} dx={-40} dy={0}>
        <Label>Покупатель</Label>
        <Display size={96} style={{ marginTop: 8 }}>
          Горизонталь: <B>весь чек</B>
        </Display>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {DEPTS.map((d, i) => {
          const x = 110 + i * 190;
          const hot = (i === 0 && pickS) || (i === 5 && pickM);
          return (
            <g key={d}>
              <rect
                x={x}
                y={300}
                width={150}
                height={460}
                fill={t.surface}
                stroke={t.ink}
                strokeWidth={3}
              />
              <Shelf
                x={x + 6}
                y={310}
                w={140}
                rows={4}
                rowH={110}
                seed={i + 2}
                tags={false}
                o={hot ? 1 : 0.55}
              />
              <text
                x={x + 75}
                y={800}
                textAnchor="middle"
                fontFamily={t.mono}
                fontWeight={700}
                fontSize={22}
                fill={hot ? t.ink : t.muted}
              >
                {d.toUpperCase()}
              </text>
              {hot && (
                <rect
                  x={x - 6}
                  y={294}
                  width={162}
                  height={472}
                  fill="none"
                  stroke={t.beer}
                  strokeWidth={8}
                />
              )}
            </g>
          );
        })}
        <Arrow x1={ax} y1={540} x2={bx} y2={540} k={k} color={t.beer} w={18} />
        <g opacity={rec} transform={`translate(${(1 - rec) * 80} 0)`}>
          <Check
            x={1400}
            y={300}
            w={420}
            rows={["Соус", "Макароны"]}
            hi={{ Соус: "diaper", Макароны: "beer" }}
            head="ОДНА ПОКУПКА"
            s={1.05}
          />
          <text
            x={1610}
            y={630}
            textAnchor="middle"
            fontFamily={t.body}
            fontWeight={800}
            fontSize={30}
            fill={t.muted}
          >
            из разных концов зала
          </text>
        </g>
      </svg>
    </Frame>
  );
};

// ---------- 3. Вертикаль видит не всё ----------
export const Both: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 57, c2 = 108] = cue;
  const v = ease(frame, c0 + 4, c0 + 30);
  const h = ease(frame, c1, c1 + 30);
  const four = useSp(c2 + 20, 11);
  return (
    <Frame>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Arrow
          x1={560}
          y1={120}
          x2={560}
          y2={820}
          k={v}
          color={t.diaper}
          w={22}
        />
        <Arrow
          x1={140}
          y1={470}
          x2={1000}
          y2={470}
          k={h}
          color={t.beer}
          w={22}
          dash
        />
        <text
          x={600}
          y={170}
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={28}
          fill={t.diaper}
        >
          МЕРЧЕНДАЙЗИНГ
        </text>
        <text
          x={140}
          y={440}
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={28}
          fill={t.ink}
          opacity={h}
        >
          АНАЛИЗ ЧЕКОВ
        </text>
      </svg>
      <At x={1120} y={170} s={four} dx={40} dy={0}>
        <Display size={96}>{"Вертикаль\nвидит не всё"}</Display>
        <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
          {[1, 2, 3, 4].map((n, i) => {
            const s = ease(frame, c2 + 30 + i * 8, c2 + 44 + i * 8);
            return (
              <div
                key={n}
                style={{
                  width: 120,
                  height: 120,
                  background: t.diaper,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: t.display,
                  fontWeight: 900,
                  fontSize: 80,
                  opacity: s,
                  transform: `scale(${0.6 + 0.4 * s})`,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
      </At>
    </Frame>
  );
};

// ---------- 4. Не ваши покупатели ----------
export const NotYours: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 140] = cue;
  const head = useSp(c0 + 4, 14);
  const book = useSp(c0 + 20, 13);
  const tape = useSp(c1, 13);
  return (
    <Frame>
      <Rule n={1} text="Не ваши покупатели" s={head} />
      <At x={110} y={300} s={book} dx={-40} dy={0}>
        <div
          style={{
            width: 640,
            background: t.surface,
            border: "4px solid #16181A",
            padding: "36px 40px",
            opacity: 1 - tape * 0.45,
          }}
        >
          <Label>Учебник · правила выкладки</Label>
          {[
            "Соусы — к соусам",
            "Молочка — у дальней стены",
            "Хиты — на уровне глаз",
            "Как принято в категории",
          ].map((r) => (
            <div
              key={r}
              style={{
                fontFamily: t.body,
                fontWeight: 700,
                fontSize: 36,
                color: t.ink,
                marginTop: 20,
              }}
            >
              — {r}
            </div>
          ))}
        </div>
      </At>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2, 3].map((i) => {
          const s = ease(frame, c1 + i * 7, c1 + 18 + i * 7);
          return (
            <g key={i} opacity={s} transform={`translate(${(1 - s) * 100} 0)`}>
              <Check
                x={880 + i * 250}
                y={320 + (i % 2) * 30}
                w={230}
                rows={
                  [
                    ["Соус", "Макароны", "Сыр"],
                    ["Пиво", "Чипсы", "Соус"],
                    ["Макароны", "Соус", "Вино"],
                    ["Хлеб", "Соус", "Макароны"],
                  ][i]
                }
                hi={{ Соус: "diaper", Макароны: "beer" }}
                head={`ЧЕК ${i + 1}`}
                r={(i - 1.5) * 2}
              />
            </g>
          );
        })}
        <text
          x={1360}
          y={760}
          textAnchor="middle"
          fontFamily={t.body}
          fontWeight={900}
          fontSize={44}
          fill={t.ink}
          opacity={tape}
        >
          ваши чеки: соус + макароны
        </text>
      </svg>
    </Frame>
  );
};

// ---------- 5. Выкладка поставщика ----------
export const Supplier: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 146] = cue;
  const head = useSp(c0 + 4, 14);
  const arrow = ease(frame, c0 + 40, c0 + 90);
  const cart = useSp(c1 + 10, 13);
  return (
    <Frame>
      <Rule n={2} text="Выкладка поставщика" s={head} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={110}
          y={300}
          width={760}
          height={560}
          fill={t.surface}
          stroke={t.ink}
          strokeWidth={4}
        />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            {Array.from({ length: 11 }, (_, k) => (
              <rect
                key={k}
                x={130 + k * 66}
                y={318 + r * 136}
                width={54}
                height={96}
                fill={r === 1 ? t.diaper : PAL[((r * 2 + k) % 3) + 2]}
              />
            ))}
            {r === 1 &&
              Array.from({ length: 11 }, (_, k) => (
                <text
                  key={`l${k}`}
                  x={157 + k * 66}
                  y={374}
                  textAnchor="middle"
                  fontFamily={t.mono}
                  fontWeight={700}
                  fontSize={22}
                  fill="#fff"
                >
                  A
                </text>
              ))}
            <rect
              x={110}
              y={420 + r * 136}
              width={760}
              height={10}
              fill={t.ink}
            />
          </g>
        ))}
        <Arrow
          x1={940}
          y1={300}
          x2={940}
          y2={390}
          k={arrow}
          color={t.ink}
          w={14}
        />
        <text
          x={980}
          y={360}
          fontFamily={t.body}
          fontWeight={900}
          fontSize={38}
          fill={t.ink}
          opacity={arrow}
        >
          уровень глаз — товар поставщика А
        </text>
        <g opacity={cart} transform={`translate(${(1 - cart) * 60} 0)`}>
          <Check
            x={1060}
            y={460}
            w={420}
            rows={["Товар А", "?", "?"]}
            hi={{ "Товар А": "diaper" }}
            head="КОРЗИНА ПОКУПАТЕЛЯ"
          />
          <text
            x={1520}
            y={560}
            fontFamily={t.body}
            fontWeight={800}
            fontSize={34}
            fill={t.muted}
          >
            что ещё он положит —
          </text>
          <text
            x={1520}
            y={604}
            fontFamily={t.body}
            fontWeight={800}
            fontSize={34}
            fill={t.muted}
          >
            поставщику не важно
          </text>
        </g>
      </svg>
    </Frame>
  );
};

// ---------- 6. Слабый по вертикали, сильный по горизонтали ----------
export const Weak: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 143, c2 = 298] = cue;
  const head = useSp(c0 + 4, 14);
  const mark = useSp(c0 + 50, 12);
  const links = ease(frame, c1 + 10, c1 + 50);
  const out = ease(frame, c2, c2 + 18);
  const dip = ease(frame, c2 + 14, c2 + 40);
  const wx = 300,
    wy = 760;
  const rich: [number, number, string][] = [
    [1180, 380, "Вино · 890 ₽"],
    [1180, 520, "Сыр · 640 ₽"],
    [1180, 660, "Стейк · 1 200 ₽"],
  ];
  return (
    <Frame>
      <Rule
        n={3}
        text="Слабый по вертикали, сильный по горизонтали"
        s={head}
        size={58}
      />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={110}
          y={300}
          width={500}
          height={560}
          fill={t.surface}
          stroke={t.ink}
          strokeWidth={4}
        />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({ length: 7 }, (_, k) => (
              <rect
                key={k}
                x={130 + k * 66}
                y={318 + r * 136}
                width={54}
                height={96}
                fill={PAL[(r + k) % 2 === 0 ? 3 : 5]}
              />
            ))}
            <rect
              x={110}
              y={420 + r * 136}
              width={500}
              height={10}
              fill={t.ink}
            />
          </g>
        ))}
        <g transform={`translate(${-out * 260} 0)`} opacity={1 - out}>
          <rect x={wx - 40} y={wy - 50} width={80} height={90} fill={t.beer} />
          <text
            x={wx}
            y={wy + 8}
            textAnchor="middle"
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={20}
            fill={t.ink}
          >
            ХЛЕБ
          </text>
        </g>
        <g opacity={mark * (1 - out)}>
          <rect x={360} y={728} width={240} height={50} fill={t.accent} />
          <text
            x={378}
            y={762}
            fontFamily={t.body}
            fontWeight={900}
            fontSize={28}
            fill="#fff"
          >
            низ категории
          </text>
        </g>
        {rich.map(([x, y, s], i) => (
          <g key={s}>
            <path
              d={`M ${wx + 40} ${wy - 5} C 800 ${wy - 5}, 900 ${y}, ${x - 20} ${y}`}
              stroke={t.diaper}
              strokeWidth={6}
              fill="none"
              strokeDasharray={out > 0 ? "6 22" : `${links * 1000} 1000`}
              opacity={out > 0 ? 1 - out * 0.8 : 1}
            />
            <rect
              x={x}
              y={y - 40}
              width={360}
              height={80}
              fill={t.surface}
              stroke={t.ink}
              strokeWidth={3}
            />
            <text
              x={x + 20}
              y={y + 12}
              fontFamily={t.body}
              fontWeight={800}
              fontSize={34}
              fill={t.ink}
            >
              {s}
            </text>
            {i === 0 && (
              <text
                x={x}
                y={y - 60}
                fontFamily={t.mono}
                fontWeight={700}
                fontSize={24}
                fill={t.muted}
                opacity={links}
              >
                В ЧЕКАХ С ЭТИМ ХЛЕБОМ
              </text>
            )}
          </g>
        ))}
        {/* график соседнего отдела */}
        <g opacity={dip}>
          <rect
            x={1580}
            y={330}
            width={280}
            height={400}
            fill={t.surface}
            stroke={t.ink}
            strokeWidth={3}
          />
          <text
            x={1600}
            y={370}
            fontFamily={t.mono}
            fontWeight={700}
            fontSize={20}
            fill={t.muted}
          >
            ВИНО · СЫР · МЯСО
          </text>
          <polyline
            points={`1600,520 1650,500 1700,510 1740,${510 + dip * 120} 1790,${520 + dip * 140} 1840,${530 + dip * 150}`}
            stroke={t.accent}
            strokeWidth={7}
            fill="none"
          />
          <text
            x={1600}
            y={710}
            fontFamily={t.body}
            fontWeight={900}
            fontSize={30}
            fill={t.accent}
          >
            через месяц ↓
          </text>
        </g>
      </svg>
    </Frame>
  );
};

// ---------- 7. Вырос товар или чек? ----------
export const Grew: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 115] = cue;
  const head = useSp(c0 + 4, 14);
  const b1 = ease(frame, c0 + 30, c0 + 60, 0, 160);
  const b2 = ease(frame, c0 + 50, c0 + 80, 0, 300);
  const chk = useSp(c1, 13);
  const sw = ease(frame, c1 + 40, c1 + 60);
  return (
    <Frame>
      <Rule n={4} text="Вырос товар или чек?" s={head} />
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <text
          x={110}
          y={330}
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={26}
          fill={t.muted}
        >
          ПРОДАЖИ ТОВАРА
        </text>
        <line
          x1={110}
          y1={760}
          x2={700}
          y2={760}
          stroke={t.ink}
          strokeWidth={4}
        />
        <rect x={170} y={760 - b1} width={180} height={b1} fill={t.dim} />
        <rect x={440} y={760 - b2} width={180} height={b2} fill={t.diaper} />
        <text
          x={260}
          y={800}
          textAnchor="middle"
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={26}
          fill={t.muted}
        >
          ДО
        </text>
        <text
          x={530}
          y={800}
          textAnchor="middle"
          fontFamily={t.mono}
          fontWeight={700}
          fontSize={26}
          fill={t.ink}
        >
          ПОСЛЕ ↑
        </text>
        <g opacity={chk} transform={`translate(${(1 - chk) * 80} 0)`}>
          <Check
            x={860}
            y={330}
            w={400}
            rows={["Сок «Б»", "Хлеб", "Сыр"]}
            head="ЧЕК ДО"
          />
          <Check
            x={1340}
            y={330}
            w={400}
            rows={["Сок «А»", "Хлеб", "Сыр"]}
            hi={{ "Сок «А»": "diaper" }}
            head="ЧЕК ПОСЛЕ"
          />
          <text
            x={1060}
            y={690}
            textAnchor="middle"
            fontFamily={t.display}
            fontWeight={900}
            fontSize={60}
            fill={t.ink}
          >
            860 ₽
          </text>
          <text
            x={1540}
            y={690}
            textAnchor="middle"
            fontFamily={t.display}
            fontWeight={900}
            fontSize={60}
            fill={t.ink}
          >
            860 ₽
          </text>
        </g>
        <g opacity={sw}>
          <rect x={980} y={730} width={680} height={70} fill={t.beer} />
          <text
            x={1320}
            y={777}
            textAnchor="middle"
            fontFamily={t.body}
            fontWeight={900}
            fontSize={34}
            fill={t.ink}
          >
            взяли вместо другого — чек не вырос
          </text>
        </g>
      </svg>
    </Frame>
  );
};

// ---------- 8. Вертикаль + горизонталь ----------
export const Grid: React.FC<SceneProps> = ({ cue }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 70, c2 = 138] = cue;
  const v = (i: number) => ease(frame, c0 + 6 + i * 5, c0 + 30 + i * 5);
  const h = (i: number) => ease(frame, c1 + i * 5, c1 + 24 + i * 5);
  const sum = useSp(c2, 12);
  return (
    <Frame>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Arrow
            key={`v${i}`}
            x1={1290 + i * 108}
            y1={130}
            x2={1290 + i * 108}
            y2={130 + 700}
            k={v(i)}
            color={t.diaper}
            w={10}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <Arrow
            key={`h${i}`}
            x1={1250}
            y1={170 + i * 150}
            x2={1850}
            y2={170 + i * 150}
            k={h(i)}
            color={t.beer}
            w={10}
          />
        ))}
      </svg>
      <At x={110} y={120} s={v(0)} dx={-40} dy={0}>
        <Label color={t.diaper}>Мерчендайзинг</Label>
        <Display size={80} style={{ marginTop: 8 }}>
          вертикаль: порядок на полке
        </Display>
      </At>
      <At x={110} y={380} s={h(0)} dx={-40} dy={0}>
        <Label color={t.ink}>Анализ чеков</Label>
        <Display size={80} style={{ marginTop: 8 }}>
          горизонталь: связи через магазин
        </Display>
      </At>
      <At x={110} y={660} s={sum} dx={0} dy={20}>
        <Display size={100}>
          Вместе — <B>полная картина</B>
        </Display>
      </At>
    </Frame>
  );
};

// ---------- 9. Сайт ----------
export const Outro: React.FC<SceneProps> = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const a = useSp(2, 14),
    btn = useSp(20, 10);
  const nudge = Math.sin(frame / 5) * 10;
  return (
    <AbsoluteFill style={{ background: t.diaper }}>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 150,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: t.mono,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.2em",
            color: t.beer,
          }}
        >
          АНАЛИТИКА ПРО
        </div>
        <div
          style={{
            fontFamily: t.display,
            fontWeight: 900,
            fontSize: 120,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: "#fff",
            marginTop: 20,
          }}
        >
          Как увидеть
          <br />
          горизонталь
          <br />
          вашего магазина
        </div>
        <div
          style={{
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              background: t.beer,
              color: t.ink,
              padding: "18px 40px",
              fontFamily: t.body,
              fontWeight: 900,
              fontSize: 56,
              transform: `scale(${btn})`,
              transformOrigin: "left center",
            }}
          >
            analytic-pro.ru
          </div>
          <div
            style={{
              fontFamily: t.body,
              fontWeight: 900,
              fontSize: 48,
              color: "#fff",
              opacity: btn,
              transform: `translateX(${nudge}px)`,
            }}
          >
            ссылка в профиле →
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
