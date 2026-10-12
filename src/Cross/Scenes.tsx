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
import { SceneProps } from "../Abc/ScenesA";
import {
  BATTERIES,
  BONUS,
  BUNDLE,
  CHEAT,
  CHECKOUT_NO,
  CHECKOUT_YES,
  MONTAGE,
  RECEIPTS,
  SHELF,
} from "./content";

const useSp = (at: number, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping } });
};

const BLUE = "#4A7BD0";
const EMOJI = "'Noto Color Emoji', sans-serif";

const Stamp: React.FC<{
  text: string;
  s: number;
  color?: string;
  size?: number;
  rotate?: number;
  bg?: string;
}> = ({
  text,
  s,
  color = C.red,
  size = 50,
  rotate = -6,
  bg = "rgba(255,255,255,0.92)",
}) => (
  <div
    style={{
      transform: `rotate(${rotate}deg) scale(${interpolate(s, [0, 1], [2, 1])})`,
      opacity: Math.min(1, s),
      border: `6px solid ${color}`,
      color,
      background: bg,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      padding: "8px 24px",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const RuleTitle: React.FC<{ text: string }> = ({ text }) => {
  const s = useSp(2, 12);
  const [num, ...rest] = text.split(". ");
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 74,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        color: C.ink,
        whiteSpace: "pre-line",
        opacity: s,
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <span style={{ background: C.tag, padding: "0 16px", marginRight: 14 }}>
        {num}
      </span>
      {rest.join(". ")}
    </div>
  );
};

// ---------- Касса: общая сцена для «нет» и «выбора из двух» ----------
const Person: React.FC<{
  x: number;
  shirt: string;
  apron?: boolean;
  flip?: boolean;
  point?: number;
}> = ({ x, shirt, apron, flip, point = 0 }) => (
  <svg
    width={260}
    height={420}
    style={{
      position: "absolute",
      left: x,
      top: 560,
      transform: flip ? "scaleX(-1)" : undefined,
    }}
  >
    <rect
      x={50}
      y={170}
      width={160}
      height={250}
      rx={60}
      fill={shirt}
      stroke={C.ink}
      strokeWidth={7}
    />
    {apron && (
      <rect
        x={85}
        y={210}
        width={90}
        height={210}
        rx={14}
        fill={C.green}
        stroke={C.ink}
        strokeWidth={6}
      />
    )}
    <circle
      cx={130}
      cy={100}
      r={70}
      fill="#F3D2B3"
      stroke={C.ink}
      strokeWidth={7}
    />
    <circle cx={108} cy={95} r={7} fill={C.ink} />
    <circle cx={152} cy={95} r={7} fill={C.ink} />
    {/* рука-указатель */}
    <g transform={`rotate(${-point * 50} 200 230)`}>
      <rect
        x={190}
        y={220}
        width={120 * point}
        height={30}
        rx={15}
        fill="#F3D2B3"
        stroke={C.ink}
        strokeWidth={6}
        opacity={point > 0.05 ? 1 : 0}
      />
    </g>
  </svg>
);

const Bubble: React.FC<{
  text: string;
  x: number;
  y: number;
  s: number;
  color?: string;
  textColor?: string;
  tail: "left" | "right";
  size?: number;
}> = ({
  text,
  x,
  y,
  s,
  color = "#fff",
  textColor = C.ink,
  tail,
  size = 52,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${s})`,
      transformOrigin: tail === "left" ? "left bottom" : "right bottom",
      background: color,
      color: textColor,
      border: `6px solid ${C.ink}`,
      borderRadius: 36,
      padding: "20px 34px",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.12,
      whiteSpace: "pre-line",
      boxShadow: `8px 8px 0 ${C.ink}`,
    }}
  >
    {text}
  </div>
);

const Counter: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 960,
        height: 40,
        background: C.shelf,
        borderTop: `6px solid ${C.ink}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1000,
        height: 300,
        background: "#D9C9A8",
        borderTop: `6px solid ${C.ink}`,
        borderBottom: `6px solid ${C.ink}`,
      }}
    />
    {/* касса */}
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 860,
        width: 200,
        height: 110,
        background: C.ink,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          margin: 16,
          height: 40,
          background: "#3E8E4A",
          fontFamily: MONO,
          color: "#fff",
          fontSize: 24,
          padding: "6px 10px",
        }}
      >
        КАССА
      </div>
    </div>
    {/* кофе на прилавке */}
    <div
      style={{
        position: "absolute",
        left: 470,
        top: 850,
        fontFamily: EMOJI,
        fontSize: 110,
      }}
    >
      ☕
    </div>
  </>
);

export const CheckoutNo: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 60, c2 = 120] = cue;
  const ask = interpolate(frame, [0, 6], [0.85, 1], clamp); // видна с первого кадра
  const no = useSp(14, 9);
  const cross = interpolate(frame, [c1 - 10, c1 + 6], [0, 1], clamp);
  const save = useSp(c2, 9);
  return (
    <AbsoluteFill>
      <Counter />
      <Person x={60} shirt="#fff" apron />
      <Person x={760} shirt={BLUE} flip />
      <Bubble
        text={CHECKOUT_NO.ask}
        x={60}
        y={320}
        s={ask}
        tail="left"
        size={58}
      />
      <Bubble
        text={CHECKOUT_NO.answer}
        x={720}
        y={460}
        s={no}
        tail="right"
        color={C.red}
        textColor="#fff"
        size={64}
      />
      {/* перечёркиваем фразу продавца */}
      <svg
        width={1080}
        height={600}
        style={{ position: "absolute", left: 0, top: 280 }}
      >
        {cross > 0 && (
          <line
            x1={60}
            y1={150}
            x2={60 + 560 * cross}
            y2={150 - 60 * cross}
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${save}) rotate(-3deg)`,
            background: C.tag,
            border: `6px solid ${C.ink}`,
            boxShadow: `10px 10px 0 ${C.ink}`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 62,
            padding: "12px 30px",
          }}
        >
          🔖 {CHECKOUT_NO.headline}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CheckoutChoice: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 90, c2 = 160] = cue;
  const ask = useSp(c0 + 6, 11);
  const opts = useSp(c0 + 30, 11);
  const think = interpolate(frame, [c1, c1 + 30], [0, 1], clamp);
  const point = interpolate(frame, [c2, c2 + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pick = useSp(c2 + 14, 9);
  const badge = useSp(c2 + 40, 11);
  return (
    <AbsoluteFill>
      <RuleTitle text={CHECKOUT_YES.rule} />
      <Counter />
      <Person x={60} shirt="#fff" apron />
      <Person x={760} shirt={BLUE} flip point={point} />
      <Bubble
        text={CHECKOUT_YES.ask}
        x={60}
        y={300}
        s={ask}
        tail="left"
        size={48}
      />
      {/* мысли покупателя */}
      {think > 0 && pick < 0.5 && (
        <div
          style={{
            position: "absolute",
            left: 830,
            top: 470,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 70,
            color: C.ink2,
            opacity: think,
          }}
        >
          {".".repeat(1 + (Math.floor(frame / 8) % 3))}
        </div>
      )}
      {/* варианты на прилавке */}
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {CHECKOUT_YES.options.map((o, i) => {
          const chosen = i === 0 && pick > 0.5;
          return (
            <div
              key={o}
              style={{
                transform: `scale(${opts * (chosen ? 1 + pick * 0.12 : 1)})`,
                opacity: i === 1 && pick > 0.5 ? 0.45 : 1,
                background: chosen ? C.tag : C.paper,
                border: `6px solid ${C.ink}`,
                boxShadow: chosen ? `10px 10px 0 ${C.ink}` : "none",
                padding: "16px 30px",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 50,
              }}
            >
              <span style={{ fontFamily: EMOJI }}>{o.split(" ")[0]}</span>{" "}
              {o.split(" ").slice(1).join(" ")}
              {chosen && " ✓"}
            </div>
          );
        })}
      </div>
      {/* было / стало */}
      <div
        style={{
          position: "absolute",
          top: 1200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
          opacity: badge,
          transform: `translateY(${(1 - badge) * 30}px)`,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 34,
            color: C.red,
            textDecoration: "line-through",
            background: "#fff",
            padding: "8px 16px",
            border: `4px solid ${C.ink}`,
          }}
        >
          {CHECKOUT_YES.before}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 34,
            color: "#fff",
            background: C.green,
            padding: "8px 16px",
            border: `4px solid ${C.ink}`,
          }}
        >
          {CHECKOUT_YES.after}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Нарезка пар ----------
export const Montage: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 150, c2 = 230] = cue;
  const free = useSp(c2 + 10, 8);
  return (
    <AbsoluteFill>
      <Title text={MONTAGE.headline} top={150} size={72} />
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
        }}
      >
        {MONTAGE.pairs.map(([a, b], i) => {
          const s = spring({
            frame: frame - c0 - 8 - i * 16,
            fps: 30,
            config: { damping: 11 },
          });
          return (
            <div
              key={i}
              style={{
                height: 250,
                background: i % 3 === 0 ? C.tag : C.paper,
                border: `5px solid ${C.ink}`,
                boxShadow: `10px 10px 0 ${C.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                fontFamily: EMOJI,
                fontSize: 100,
                transform: `scale(${s}) rotate(${(i % 2 ? 2 : -2) * (1 - s)}deg)`,
              }}
            >
              {a}
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 70,
                  color: C.red,
                }}
              >
                +
              </span>
              {b}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 60,
          right: 60,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {MONTAGE.places.map((p, i) => {
          const s = spring({
            frame: frame - c1 - i * 8,
            fps: 30,
            config: { damping: 12 },
          });
          return (
            <span
              key={p}
              style={{
                transform: `scale(${s})`,
                background: C.ink,
                color: C.tag,
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 36,
                padding: "10px 22px",
              }}
            >
              ✓ {p}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp text={MONTAGE.free} s={free} color={C.green} size={56} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Без этого не работает ----------
const Robot: React.FC<{ on: boolean }> = ({ on }) => (
  <svg width={260} height={300} viewBox="0 0 260 300">
    {on &&
      Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={130 + Math.cos(a) * 120}
            y1={140 + Math.sin(a) * 120}
            x2={130 + Math.cos(a) * 140}
            y2={140 + Math.sin(a) * 140}
            stroke={C.tag}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      })}
    <rect
      x={60}
      y={40}
      width={140}
      height={110}
      rx={18}
      fill={on ? C.tag : "#CFCBBF"}
      stroke={C.ink}
      strokeWidth={7}
    />
    <circle
      cx={100}
      cy={95}
      r={16}
      fill={on ? "#fff" : C.ink2}
      stroke={C.ink}
      strokeWidth={5}
    />
    <circle
      cx={160}
      cy={95}
      r={16}
      fill={on ? "#fff" : C.ink2}
      stroke={C.ink}
      strokeWidth={5}
    />
    <line x1={130} y1={40} x2={130} y2={14} stroke={C.ink} strokeWidth={6} />
    <circle cx={130} cy={12} r={10} fill={on ? C.red : C.ink2} />
    <rect
      x={70}
      y={160}
      width={120}
      height={110}
      rx={14}
      fill={on ? "#F2A65A" : "#BDB9AD"}
      stroke={C.ink}
      strokeWidth={7}
    />
    <rect
      x={95}
      y={190}
      width={70}
      height={44}
      fill={on ? "#3E8E4A" : C.ink}
      stroke={C.ink}
      strokeWidth={5}
    />
  </svg>
);

export const Batteries: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 70, c2 = 150, c3 = 230] = cue;
  const left = useSp(c0 + 6, 12);
  const right = useSp(c1, 12);
  const list = useSp(c3, 13);
  const panel = (on: boolean, s: number) => (
    <div
      style={{
        width: 440,
        height: 520,
        background: on ? C.paper : "#ECEAE3",
        border: `5px solid ${C.ink}`,
        boxShadow: on ? `10px 10px 0 ${C.ink}` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 34,
          color: on ? C.green : C.red,
          marginBottom: 10,
        }}
      >
        {on ? `🔋 ${BATTERIES.with}` : BATTERIES.without}
      </div>
      <Robot on={on} />
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 40,
          color: on ? C.green : C.red,
          marginTop: 6,
        }}
      >
        {on ? `✓ ${BATTERIES.works}` : `✕ ${BATTERIES.broken}`}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <RuleTitle text={BATTERIES.rule} />
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {panel(false, left)}
        {panel(true, right)}
      </div>
      <div style={{ position: "absolute", top: 950, left: 90, right: 90 }}>
        {BATTERIES.examples.map(([a, b], i) => {
          const s = spring({
            frame: frame - c2 - i * 10,
            fps: 30,
            config: { damping: 13 },
          });
          return (
            <div
              key={a}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 14,
                opacity: s * (1 - list * 0.6),
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 40,
                color: C.ink,
              }}
            >
              <span style={{ width: 300, textAlign: "right" }}>{a}</span>
              <span style={{ color: C.red, fontWeight: 900 }}>→</span>
              <span
                style={{
                  background: C.tag,
                  padding: "2px 16px",
                  border: `4px solid ${C.ink}`,
                }}
              >
                {b}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${list})`,
            background: C.ink,
            color: C.tag,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 40,
            padding: "14px 28px",
          }}
        >
          {BATTERIES.question}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Полка продаёт сама ----------
export const ShelfSells: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 110] = cue;
  const items = useSp(c0 + 6, 12);
  const arc = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  const fly = interpolate(frame, [c2 + 20, c2 + 50], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const basketS = useSp(c2 + 6, 12);
  const pack = (
    label: string,
    color: string,
    x: number,
    w: number,
    h: number,
    round?: boolean,
    target?: number, // куда летит в корзину; без него товар остаётся на полке
  ) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 860 - h,
        width: w,
        height: h,
        background: color,
        border: `6px solid ${C.ink}`,
        borderRadius: round ? "30px 30px 14px 14px" : 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 32,
        color: round ? "#fff" : C.ink,
        opacity: items,
        transform:
          target === undefined
            ? undefined
            : `translate(${(target - x) * fly}px, ${fly * 380}px) scale(${1 - fly * 0.45})`,
      }}
    >
      {label}
    </div>
  );
  return (
    <AbsoluteFill>
      <RuleTitle text={SHELF.rule} />
      {/* полка */}
      <div
        style={{
          position: "absolute",
          top: 460,
          left: 70,
          width: 940,
          height: 430,
          background: C.paper,
          border: `5px solid ${C.ink}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 70,
          width: 940,
          height: 26,
          background: C.shelf,
          borderTop: `5px solid ${C.ink}`,
        }}
      />
      {[0, 1].map((k) => (
        <React.Fragment key={k}>
          {pack(
            SHELF.pasta,
            C.tag,
            160 + k * 170,
            150,
            260,
            false,
            k === 1 ? 400 : undefined,
          )}
        </React.Fragment>
      ))}
      {pack(SHELF.sauce, C.red, 520, 140, 220, true, 540)}
      {[0, 1].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 720 + k * 130,
            top: 640,
            width: 110,
            height: 220,
            background: "#E4E2DA",
            border: `5px solid #BDB9AD`,
          }}
        />
      ))}
      {/* дуга «на расстоянии руки» */}
      <svg
        width={1080}
        height={300}
        style={{ position: "absolute", left: 0, top: 380 }}
      >
        <path
          d="M 250 80 Q 420 -20 590 80"
          fill="none"
          stroke={C.green}
          strokeWidth={8}
          strokeDasharray="16 12"
          pathLength={1}
          opacity={arc}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 250,
          width: 340,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 28,
          color: C.green,
          opacity: arc,
        }}
      >
        ✋ {SHELF.reach}
      </div>
      {/* корзина */}
      <div
        style={{
          position: "absolute",
          top: 1130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: EMOJI,
          fontSize: 170,
          transform: `scale(${basketS})`,
        }}
      >
        🧺
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Имя для набора ----------
export const Bundle: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 130] = cue;
  const pack = interpolate(frame, [c1 + 20, c1 + 50], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const box = useSp(c1 + 10, 11);
  const math = useSp(c2, 10);
  const pos = [140, 420, 700];
  return (
    <AbsoluteFill>
      <RuleTitle text={BUNDLE.rule} />
      {BUNDLE.items.map((it, i) => {
        const s = spring({
          frame: frame - c0 - 6 - i * 8,
          fps: 30,
          config: { damping: 12 },
        });
        return (
          <div
            key={it}
            style={{
              position: "absolute",
              top: interpolate(pack, [0, 1], [400, 760]),
              left: interpolate(pack, [0, 1], [pos[i], 330 + i * 80]),
              width: 240,
              textAlign: "center",
              background: C.paper,
              border: `5px solid ${C.ink}`,
              padding: "20px 10px",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 44,
              opacity: s * (1 - pack * 0.9),
              transform: `scale(${s * (1 - pack * 0.5)})`,
            }}
          >
            {it}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 22,
                color: C.ink2,
                marginTop: 6,
              }}
            >
              решение {i + 1}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${box}) rotate(-2deg)`,
            width: 620,
            height: 320,
            background: "#D9C9A8",
            border: `7px solid ${C.ink}`,
            boxShadow: `14px 14px 0 ${C.ink}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontFamily: EMOJI, fontSize: 90 }}>🔥🍢</div>
          <div
            style={{
              background: C.tag,
              border: `5px solid ${C.ink}`,
              padding: "10px 24px",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 46,
              marginTop: 10,
            }}
          >
            {BUNDLE.box}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 60,
          opacity: math,
          transform: `scale(${math})`,
        }}
      >
        <span style={{ color: C.red, textDecoration: "line-through" }}>
          {BUNDLE.math[0]}
        </span>
        <span style={{ color: C.ink2 }}> → </span>
        <span style={{ background: C.green, color: "#fff", padding: "0 14px" }}>
          {BUNDLE.math[1]}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Бонус + тест пары ----------
export const Bonus: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, , c2 = 170, c3 = 260] = cue;
  const note = useSp(c0 + 6, 13);
  const ticks = Math.floor(
    interpolate(frame, [c0 + 20, c0 + 110], [0, 12], clamp),
  );
  const coin = useSp(c0 + 60, 9);
  const weeks = useSp(c2, 13);
  const verdict = interpolate(frame, [c3 + 10, c3 + 24], [0, 1], clamp);
  const max = Math.max(...BONUS.weeks.map((w) => w.count));
  return (
    <AbsoluteFill>
      <RuleTitle text={BONUS.rule} />
      {/* тетрадка у кассы */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 90,
          width: 560,
          height: 380,
          background: "#fff",
          border: `5px solid ${C.ink}`,
          backgroundImage: `repeating-linear-gradient(transparent 0 58px, #C9D7EE 58px 61px)`,
          padding: "20px 30px",
          transform: `rotate(-2deg) scale(${note})`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 30,
            color: C.ink2,
          }}
        >
          {BONUS.notebook}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 64,
            color: C.ink,
            marginTop: 20,
            letterSpacing: 6,
            lineHeight: 1.3,
            wordBreak: "break-all",
          }}
        >
          {"✓".repeat(ticks)}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 690,
          transform: `scale(${coin}) rotate(8deg)`,
        }}
      >
        <div
          style={{
            width: 300,
            padding: "22px 10px",
            textAlign: "center",
            background: C.tag,
            border: `6px solid ${C.ink}`,
            boxShadow: `8px 8px 0 ${C.ink}`,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 44,
          }}
        >
          {BONUS.bonus}
        </div>
      </div>
      {/* сравнение недель */}
      <div
        style={{
          position: "absolute",
          top: 850,
          left: 90,
          right: 90,
          opacity: weeks,
          transform: `translateY(${(1 - weeks) * 40}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            color: C.ink2,
            marginBottom: 12,
          }}
        >
          ПРИМЕР
        </div>
        {BONUS.weeks.map((w) => {
          const fill = interpolate(
            frame,
            [c2 + 10, c2 + 50],
            [0, w.count / max],
            clamp,
          );
          return (
            <div key={w.name} style={{ marginBottom: 22 }}>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 34,
                  color: C.ink,
                  marginBottom: 8,
                }}
              >
                {w.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    height: 54,
                    width: `${fill * 70}%`,
                    background: w.keep ? C.green : C.shelf,
                    border: `4px solid ${C.ink}`,
                  }}
                />
                <span
                  style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36 }}
                >
                  {Math.round(fill * max)}
                </span>
                <span
                  style={{
                    opacity: verdict,
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 30,
                    color: "#fff",
                    background: w.keep ? C.green : C.red,
                    padding: "4px 12px",
                  }}
                >
                  {w.keep ? `✓ ${BONUS.keep}` : `✕ ${BONUS.drop}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Пары — в ваших чеках ----------
export const PairsInReceipts: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 90] = cue;
  const link = interpolate(frame, [c1, c1 + 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pairColor: Record<string, string> = {
    Кофе: C.tag,
    Круассан: C.tag,
    Паста: "#F28B82",
    Соус: "#F28B82",
  };
  return (
    <AbsoluteFill>
      <Title text={RECEIPTS.headline} top={150} size={74} />
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {RECEIPTS.receipts.map((r, i) => {
          const s = spring({
            frame: frame - c0 - 6 - i * 8,
            fps: 30,
            config: { damping: 13 },
          });
          return (
            <div
              key={i}
              style={{
                width: 290,
                background: "#fff",
                border: `5px solid ${C.ink}`,
                padding: "20px 18px",
                transform: `translateY(${(1 - s) * 120}px) rotate(${(i - 1) * 2}deg)`,
                opacity: s,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 22,
                  color: C.ink2,
                  borderBottom: `3px dashed ${C.line}`,
                  paddingBottom: 8,
                  marginBottom: 10,
                }}
              >
                ЧЕК {4812 + i}
              </div>
              {r.map((it) => (
                <div
                  key={it}
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 32,
                    padding: "8px 8px",
                    marginBottom: 6,
                    background:
                      link > 0.3 && pairColor[it]
                        ? pairColor[it]
                        : "transparent",
                  }}
                >
                  {it.toUpperCase()}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 900,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 30,
          opacity: link,
        }}
      >
        {[
          ["Кофе", "Круассан", C.tag],
          ["Паста", "Соус", "#F28B82"],
        ].map(([a, b, col]) => (
          <div
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 42,
            }}
          >
            <span
              style={{
                background: col,
                border: `4px solid ${C.ink}`,
                padding: "8px 18px",
              }}
            >
              {a}
            </span>
            <span style={{ width: 40, height: 8, background: C.ink }} />
            <span
              style={{
                background: col,
                border: `4px solid ${C.ink}`,
                padding: "8px 18px",
              }}
            >
              {b}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Шпаргалка ----------
export const CheatSheet: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 50,
          width: 980,
          background: C.paper,
          border: `6px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          padding: "34px 40px 30px",
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          <span style={{ background: C.tag, padding: "0 12px" }}>
            {CHEAT.title}
          </span>
        </div>
        {CHEAT.rules.map(([t, d], i) => {
          const s = spring({
            frame: frame - 6 - i * 6,
            fps: 30,
            config: { damping: 14 },
          });
          return (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 22,
                marginTop: 30,
                opacity: s,
                transform: `translateX(${(1 - s) * 60}px)`,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  flexShrink: 0,
                  background: C.ink,
                  color: C.tag,
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 900,
                    fontSize: 42,
                    color: C.ink,
                    lineHeight: 1.1,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 32,
                    color: C.ink2,
                    marginTop: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {d}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 36,
            paddingTop: 22,
            borderTop: `4px dashed ${C.line}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 30,
              color: C.green,
            }}
          >
            {CHEAT.channel}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 28,
              color: C.ink2,
            }}
          >
            {CHEAT.pause}
          </span>
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            color: C.ink,
          }}
        >
          {CHEAT.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};
