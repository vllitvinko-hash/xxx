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
import { SEPIA, SceneProps } from "../Abc/ScenesA";
import { Beer } from "../Story/ScenesA";
import {
  DATA,
  FINALE,
  IDEA,
  INTRO,
  MOVE,
  PAIRS,
  START,
  STORY,
  SURVEY,
  TODAY,
} from "./content";

const useSp = (at: number, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping } });
};

const TEAL = "#7FD1C7";

// ---------- Иллюстрации ----------
export const Diapers: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={170 * scale} height={210 * scale} viewBox="0 0 170 210">
    <rect
      x={6}
      y={6}
      width={158}
      height={198}
      rx={16}
      fill={TEAL}
      stroke={C.ink}
      strokeWidth={6}
    />
    <rect
      x={6}
      y={30}
      width={158}
      height={22}
      fill="#fff"
      stroke={C.ink}
      strokeWidth={4}
    />
    <circle
      cx={85}
      cy={112}
      r={34}
      fill="#FFE1C4"
      stroke={C.ink}
      strokeWidth={5}
    />
    <circle cx={74} cy={108} r={4} fill={C.ink} />
    <circle cx={96} cy={108} r={4} fill={C.ink} />
    <path
      d="M72 124 Q85 134 98 124"
      stroke={C.ink}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
    <rect
      x={26}
      y={160}
      width={118}
      height={30}
      fill="#fff"
      stroke={C.ink}
      strokeWidth={4}
    />
    <text
      x={85}
      y={182}
      textAnchor="middle"
      fontFamily={MONO}
      fontWeight={700}
      fontSize={17}
      fill={C.ink}
    >
      ПОДГУЗНИКИ
    </text>
  </svg>
);

const Cart: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 300 240">
    <path
      d="M10 30 L60 30 L95 160 L250 160 L280 60 L75 60"
      fill="none"
      stroke={C.ink}
      strokeWidth={12}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {[110, 160, 210].map((x) => (
      <line
        key={x}
        x1={x}
        y1={62}
        x2={x - 8}
        y2={158}
        stroke={C.ink}
        strokeWidth={6}
      />
    ))}
    <line x1={82} y1={110} x2={265} y2={110} stroke={C.ink} strokeWidth={6} />
    <circle
      cx={110}
      cy={205}
      r={20}
      fill={C.tag}
      stroke={C.ink}
      strokeWidth={8}
    />
    <circle
      cx={230}
      cy={205}
      r={20}
      fill={C.tag}
      stroke={C.ink}
      strokeWidth={8}
    />
  </svg>
);

const Stamp: React.FC<{
  text: string;
  s: number;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ text, s, color = C.red, size = 54, rotate = -6 }) => (
  <div
    style={{
      transform: `rotate(${rotate}deg) scale(${interpolate(s, [0, 1], [2, 1])})`,
      opacity: Math.min(1, s),
      border: `6px solid ${color}`,
      color,
      background: "rgba(255,255,255,0.9)",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size,
      padding: "8px 26px",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const Center: React.FC<{ top: number; children: React.ReactNode }> = ({
  top,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

// ---------- 1. Каждый товар рассказывает историю ----------
const PRODUCT_COLORS = [
  C.tag,
  TEAL,
  "#F2A65A",
  C.paper,
  "#E4E2DA",
  "#C8B6E2",
  "#F28B82",
];

export const Intro: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 80, c2 = 150] = cue;
  const say = useSp(c1, 12);
  const strike = interpolate(frame, [c2, c2 + 12], [0, 1], clamp);
  const buy = useSp(c2 + 6, 9);
  const drift = interpolate(frame, [0, 300], [0, -60]);
  return (
    <AbsoluteFill>
      <Title text={INTRO.headline} top={150} size={70} />
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 70,
          width: 940,
          height: 560,
          overflow: "hidden",
          background: C.paper,
          border: `5px solid ${C.ink}`,
        }}
      >
        <div style={{ transform: `translateX(${drift}px)`, padding: 20 }}>
          {[0, 1, 2, 3].map((r) => (
            <div
              key={r}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 22,
                borderBottom: `8px solid ${C.shelf}`,
                paddingBottom: 8,
              }}
            >
              {Array.from({ length: 11 }).map((_, k) => (
                <div
                  key={k}
                  style={{
                    width: 78,
                    height: 92 - ((k * 13 + r * 7) % 30),
                    alignSelf: "flex-end",
                    background:
                      PRODUCT_COLORS[(k * 3 + r * 5) % PRODUCT_COLORS.length],
                    border: `4px solid ${C.ink}`,
                    borderRadius: (k + r) % 3 === 0 ? 14 : 4,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            position: "relative",
            transform: `scale(${say})`,
            background: "#fff",
            border: `5px solid ${C.ink}`,
            borderRadius: 40,
            padding: "22px 40px",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 46,
            color: C.ink2,
          }}
        >
          💬 {INTRO.say}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              height: 8,
              width: `calc(${strike * 100}% - 40px)`,
              background: C.red,
            }}
          />
        </div>
        <div
          style={{
            transform: `scale(${buy})`,
            background: C.tag,
            border: `5px solid ${C.ink}`,
            boxShadow: `8px 8px 0 ${C.ink}`,
            padding: "22px 40px",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 46,
            color: C.ink,
          }}
        >
          🧾 {INTRO.buy}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Walmart, конец 1990-х ----------
export const Start: React.FC<SceneProps> = ({ cue }) => {
  const [c0 = 0, c1 = 110, c2 = 170] = cue;
  const card = useSp(c0 + 4, 13);
  const method = useSp(c1, 12);
  const en = useSp(c2, 14);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 3,
          color: C.green,
          opacity: card,
        }}
      >
        {START.era}
      </div>
      <Center top={290}>
        <div
          style={{
            transform: `scale(${interpolate(card, [0, 1], [0.7, 1])})`,
            opacity: card,
            background: C.paper,
            border: `6px solid ${C.ink}`,
            boxShadow: `14px 14px 0 ${C.ink}`,
            padding: "26px 60px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 130,
              letterSpacing: "-0.04em",
              color: "#1F5FBF",
              lineHeight: 1,
            }}
          >
            {START.chain}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 36,
              color: C.ink,
              marginTop: 12,
            }}
          >
            {START.chainNote}
          </div>
        </div>
      </Center>
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: method,
          transform: `translateY(${(1 - method) * 60}px)`,
        }}
      >
        {START.method.map((w, i) => (
          <div key={w} style={{ display: "inline-block", margin: "4px 8px" }}>
            <span
              style={{
                display: "inline-block",
                background: i === 1 ? "#1F5FBF" : C.ink,
                color: "#fff",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 64,
                padding: "4px 20px",
                transform: `rotate(${(i - 1) * -2}deg)`,
              }}
            >
              {w}
            </span>
          </div>
        ))}
        <div
          style={{ marginTop: 30, display: "flex", justifyContent: "center" }}
        >
          <Cart size={300} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 32,
          color: C.ink2,
          opacity: en,
        }}
      >
        {START.methodEn}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. Идея была простой ----------
export const Idea: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 130] = cue;
  const bulb = useSp(c0 + 4, 10);
  const glow = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Title text={IDEA.headline} top={150} size={78} />
      <Center top={380}>
        <svg width={300} height={340} style={{ transform: `scale(${bulb})` }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={150 + Math.cos(a) * 120}
                y1={140 + Math.sin(a) * 120}
                x2={150 + Math.cos(a) * 145}
                y2={140 + Math.sin(a) * 145}
                stroke={C.ink}
                strokeWidth={10}
                strokeLinecap="round"
                opacity={glow}
              />
            );
          })}
          <circle
            cx={150}
            cy={140}
            r={90}
            fill={glow > 0.5 ? C.tag : C.paper}
            stroke={C.ink}
            strokeWidth={8}
          />
          <rect
            x={115}
            y={225}
            width={70}
            height={50}
            rx={8}
            fill={C.shelf}
            stroke={C.ink}
            strokeWidth={8}
          />
          <line
            x1={118}
            y1={300}
            x2={182}
            y2={300}
            stroke={C.ink}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </svg>
      </Center>
      <div style={{ position: "absolute", top: 780, left: 120, right: 120 }}>
        {IDEA.uses.map((u, i) => {
          const s = spring({
            frame: frame - c2 - i * 12,
            fps: 30,
            config: { damping: 12 },
          });
          return (
            <div
              key={u}
              style={{
                marginBottom: 24,
                background: i === 0 ? C.tag : C.paper,
                border: `5px solid ${C.ink}`,
                boxShadow: `8px 8px 0 ${C.ink}`,
                padding: "22px 30px",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 46,
                color: C.ink,
                opacity: s,
                transform: `translateX(${(1 - s) * (i % 2 ? 300 : -300)}px)`,
              }}
            >
              {u}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. Тысячи чеков ----------
export const Data: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 90, c2 = 170] = cue;
  const tape = -((frame * 14) % 120);
  const scan = useSp(c1, 12);
  const found = useSp(c2 + 4, 8);
  return (
    <AbsoluteFill>
      <Title text={DATA.headline} top={150} size={70} />
      {/* лента чеков */}
      <div
        style={{
          position: "absolute",
          top: 400,
          left: 80,
          width: 420,
          height: 880,
          overflow: "hidden",
          border: `5px solid ${C.ink}`,
          background: C.paper,
        }}
      >
        <div
          style={{
            transform: `translateY(${tape}px)`,
            padding: "10px 24px",
            fontFamily: MONO,
            fontSize: 28,
            color: C.ink,
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: i % 5 === 4 ? `3px dashed ${C.line}` : "none",
              }}
            >
              <span>
                {["ХЛЕБ", "МОЛОКО", "ЧИПСЫ", "ПИВО", "МАСЛО", "СОК"][i % 6]}
              </span>
              <span>
                {(59 + ((i * 37) % 240)).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* штрихкод */}
      <div
        style={{
          position: "absolute",
          top: 460,
          left: 560,
          width: 440,
          opacity: scan,
          transform: `scale(${interpolate(scan, [0, 1], [0.8, 1])})`,
        }}
      >
        <svg width={440} height={320}>
          <rect
            width={440}
            height={320}
            fill="#fff"
            stroke={C.ink}
            strokeWidth={6}
          />
          {Array.from({ length: 38 }).map((_, i) => (
            <rect
              key={i}
              x={30 + i * 10}
              y={30}
              width={(i * 7) % 3 === 0 ? 7 : 3}
              height={220}
              fill={C.ink}
            />
          ))}
          <rect
            x={20}
            y={130 + Math.sin(frame / 5) * 90}
            width={400}
            height={6}
            fill={C.red}
            opacity={0.8}
          />
          <text
            x={220}
            y={295}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={30}
            fontWeight={700}
            fill={C.ink}
          >
            4 600 123 456 789
          </text>
        </svg>
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 30,
            color: C.green,
          }}
        >
          = ТОЧКА ДАННЫХ
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 540,
          width: 480,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp text="?!" s={found} size={110} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1200,
          left: 540,
          width: 480,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 28,
          color: C.red,
          opacity: found,
        }}
      >
        {DATA.found}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5. Подгузники и пиво ----------
export const Pairs: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 100, c2 = 150, c3 = 190] = cue;
  const dim = interpolate(frame, [c1, c1 + 12], [1, 0.3], clamp);
  const odd = useSp(c2, 10);
  const stamp = useSp(c3 + 4, 8);
  return (
    <AbsoluteFill>
      {PAIRS.usual.map(([a, b], i) => {
        const s = spring({
          frame: frame - c0 - 4 - i * 10,
          fps: 30,
          config: { damping: 13 },
        });
        return (
          <div
            key={a}
            style={{
              position: "absolute",
              top: 200 + i * 150,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              opacity: s * dim,
              transform: `translateY(${(1 - s) * 40}px)`,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 44,
              color: C.ink,
            }}
          >
            <span
              style={{
                background: C.paper,
                border: `4px solid ${C.ink}`,
                padding: "12px 26px",
              }}
            >
              {a}
            </span>
            <span style={{ width: 70, height: 8, background: C.green }} />
            <span
              style={{
                background: C.paper,
                border: `4px solid ${C.ink}`,
                padding: "12px 26px",
              }}
            >
              {b}
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
          opacity: odd,
          transform: `scale(${interpolate(odd, [0, 1], [0.6, 1])})`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Diapers scale={1.5} />
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              color: C.ink,
              marginTop: 10,
            }}
          >
            {PAIRS.odd[0]}
          </div>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 130,
            color: C.red,
          }}
        >
          +
        </div>
        <div style={{ textAlign: "center" }}>
          <Beer scale={1.45} />
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 52,
              color: C.ink,
              marginTop: 10,
            }}
          >
            {PAIRS.odd[1]}
          </div>
        </div>
      </div>
      <Center top={1200}>
        <Stamp text={PAIRS.stamp} s={stamp} size={60} />
      </Center>
    </AbsoluteFill>
  );
};

// ---------- 6. Пятница вечером ----------
export const Friday: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 150, c2 = 220] = cue;
  const head = useSp(c0 + 2, 12);
  const step = (i: number) =>
    spring({
      frame: frame - [c0 + 40, c1, c2 + 20][i],
      fps: 30,
      config: { damping: 12 },
    });
  const icons = [
    <Diapers key="d" scale={0.9} />,
    <Beer key="b" scale={0.85} />,
    <svg key="tv" width={200} height={170}>
      <rect x={6} y={6} width={188} height={130} rx={10} fill={C.ink} />
      <rect x={20} y={20} width={160} height={102} fill="#3E8E4A" />
      <line x1={100} y1={20} x2={100} y2={122} stroke="#fff" strokeWidth={3} />
      <circle
        cx={100}
        cy={71}
        r={20}
        fill="none"
        stroke="#fff"
        strokeWidth={3}
      />
      <rect x={70} y={140} width={60} height={20} fill={C.ink} />
    </svg>,
  ];
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: head,
          transform: `scale(${interpolate(head, [0, 1], [1.3, 1])})`,
        }}
      >
        <span
          style={{
            background: C.ink,
            color: C.tag,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 56,
            padding: "10px 30px",
          }}
        >
          🕔 {STORY.when}
        </span>
        <div
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 72,
            color: C.ink,
          }}
        >
          {STORY.who}
        </div>
      </div>
      <div style={{ position: "absolute", top: 470, left: 80, right: 80 }}>
        {STORY.steps.map((s, i) => {
          const sp = step(i);
          return (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                marginBottom: 34,
                height: 240,
                background: i === 1 ? C.tag : C.paper,
                border: `5px solid ${C.ink}`,
                boxShadow: `10px 10px 0 ${C.ink}`,
                padding: "0 40px",
                opacity: sp,
                transform: `translateX(${(1 - sp) * 500}px)`,
              }}
            >
              <div
                style={{
                  width: 210,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {icons[i]}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 54,
                  color: C.ink,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 36,
                    color: C.ink2,
                    marginRight: 14,
                  }}
                >
                  {i + 1}
                </span>
                {s}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. Опрос против чеков ----------
export const Survey: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 70, c2 = 140] = cue;
  const sheet = useSp(c0 + 2, 13);
  const cross = interpolate(frame, [c0 + 30, c0 + 46], [0, 1], clamp);
  const rec = useSp(c1, 11);
  const head = useSp(c2, 12);
  return (
    <AbsoluteFill>
      <div style={{ opacity: head }}>
        <Title text={SURVEY.headline} top={150} size={72} />
      </div>
      {/* опрос */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 70,
          width: 440,
          height: 640,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          padding: 30,
          transform: `rotate(-4deg) translateY(${(1 - sheet) * 200}px)`,
          opacity: sheet,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 40,
            color: C.ink,
            marginBottom: 24,
          }}
        >
          {SURVEY.survey}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 26,
            }}
          >
            <div
              style={{ width: 34, height: 34, border: `4px solid ${C.ink}` }}
            />
            <div style={{ height: 10, flex: 1, background: C.line }} />
          </div>
        ))}
        <svg
          width={440}
          height={640}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <line
            x1={20}
            y1={20}
            x2={20 + 400 * cross}
            y2={20 + 600 * cross}
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <line
            x1={420}
            y1={20}
            x2={420 - 400 * cross}
            y2={20 + 600 * cross}
            stroke={C.red}
            strokeWidth={14}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* чеки */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 570,
          width: 440,
          background: "#fff",
          border: `5px solid ${C.ink}`,
          boxShadow: `12px 12px 0 ${C.ink}`,
          padding: "26px 30px",
          fontFamily: MONO,
          fontSize: 32,
          color: C.ink,
          transform: `rotate(3deg) scale(${rec})`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 40, marginBottom: 18 }}>
          {SURVEY.receipt}
        </div>
        {[
          ["ПОДГУЗНИКИ", true],
          ["ПИВО", true],
          ["ХЛЕБ", false],
          ["ПОДГУЗНИКИ", true],
          ["ПИВО", true],
        ].map(([t, hi], i) => (
          <div
            key={i}
            style={{
              padding: "8px 6px",
              marginBottom: 6,
              background: hi ? C.tag : "transparent",
              fontWeight: 700,
            }}
          >
            {t as string}
          </div>
        ))}
        <div
          style={{
            marginTop: 12,
            fontSize: 26,
            color: C.green,
            fontWeight: 700,
          }}
        >
          👁 НАБЛЮДАЕТ
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8. Пиво переставили — результат ----------
export const Move: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 120, c2 = 150] = cue;
  const move = interpolate(frame, [c0 + 30, c0 + 70], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const q = useSp(c1, 9);
  const bars = interpolate(frame, [c2 + 6, c2 + 40], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const beerX = interpolate(move, [0, 1], [760, 470]);
  return (
    <AbsoluteFill>
      {/* стеллаж */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 60,
          width: 960,
          height: 400,
          background: C.paper,
          border: `5px solid ${C.ink}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 20,
            background: C.shelf,
            borderTop: `4px solid ${C.ink}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 26,
            display: "flex",
            gap: 10,
          }}
        >
          <Diapers scale={0.9} />
          <Diapers scale={0.9} />
        </div>
        <div
          style={{
            position: "absolute",
            left: beerX - 60,
            bottom: 26,
            display: "flex",
            gap: 6,
          }}
        >
          <Beer scale={0.85} />
          <Beer scale={0.85} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 16,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: C.ink2,
          }}
        >
          {MOVE.diapers}
        </div>
        <div
          style={{
            position: "absolute",
            left: beerX - 40,
            top: 16,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: C.ink2,
          }}
        >
          {MOVE.beer} {move < 1 ? "→" : "✓"}
        </div>
      </div>
      {/* Результат? */}
      <div
        style={{
          position: "absolute",
          top: 650,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 110,
          letterSpacing: "-0.03em",
          color: C.ink,
          transform: `scale(${q})`,
        }}
      >
        {MOVE.headline}
      </div>
      {/* график */}
      <div
        style={{
          position: "absolute",
          top: 820,
          left: 200,
          width: 680,
          height: 480,
          opacity: bars > 0 ? 1 : 0,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 26,
            color: C.ink2,
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          {MOVE.chart}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 90,
            height: 380,
            borderBottom: `6px solid ${C.ink}`,
          }}
        >
          {MOVE.bars.map((b, i) => (
            <div key={b.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 180,
                  height: 340 * b.value * bars,
                  background: i ? C.tag : C.shelf,
                  border: `5px solid ${C.ink}`,
                  borderBottom: "none",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 90,
            marginTop: 10,
          }}
        >
          {MOVE.bars.map((b) => (
            <div
              key={b.label}
              style={{
                width: 180,
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 36,
                color: C.ink,
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9. Самый цитируемый пример и что сегодня ----------
export const Today: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 120, c2 = 230] = cue;
  const cited = useSp(c0 + 2, 13);
  const toRing = interpolate(frame, [c1 - 6, c1 + 10], [0, 1], clamp);
  const ring = interpolate(frame, [c1 + 4, c1 + 40], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const R = 230;
  const circ = 2 * Math.PI * R;
  const colors = ["#1F5FBF", C.tag, C.green];
  const labelPos = [
    { left: 60, top: 420 },
    { left: 700, top: 420 },
    { left: 380, top: 1190 },
  ];
  return (
    <AbsoluteFill>
      {/* «один из самых цитируемых» */}
      {toRing < 1 && (
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 90,
            width: 900,
            background: SEPIA.paper,
            border: `5px solid ${C.ink}`,
            boxShadow: `14px 14px 0 ${C.ink}`,
            padding: "40px 46px",
            opacity: cited * (1 - toRing),
            transform: `rotate(-2deg) scale(${interpolate(cited, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 26,
              color: SEPIA.dark,
              marginBottom: 20,
            }}
          >
            BEER &amp; DIAPERS · RETAIL
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 60,
              lineHeight: 1.15,
              color: C.ink,
              whiteSpace: "pre-line",
            }}
          >
            <span style={{ background: C.tag }}>{TODAY.cited}</span>
          </div>
        </div>
      )}
      {toRing > 0 && (
        <AbsoluteFill style={{ opacity: toRing }}>
          <svg
            width={1080}
            height={1920}
            style={{ position: "absolute", inset: 0 }}
          >
            {colors.map((col, i) => (
              <circle
                key={i}
                cx={540}
                cy={800}
                r={R}
                fill="none"
                stroke={col}
                strokeWidth={60}
                strokeDasharray={`${(circ / 3 - 12) * ring} ${circ}`}
                transform={`rotate(${-90 + i * 120} 540 800)`}
              />
            ))}
          </svg>
          <div
            style={{
              position: "absolute",
              top: 740,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 44,
              lineHeight: 1.1,
              color: C.ink,
            }}
          >
            🧺
            <br />
            {TODAY.center}
          </div>
          {TODAY.uses.map((u, i) => {
            const s = spring({
              frame: frame - c2 - i * 10,
              fps: 30,
              config: { damping: 12 },
            });
            return (
              <div
                key={u}
                style={{
                  position: "absolute",
                  ...labelPos[i],
                  width: 320,
                  textAlign: "center",
                  background: C.paper,
                  border: `5px solid ${C.ink}`,
                  borderTop: `14px solid ${colors[i]}`,
                  padding: "14px 10px",
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 36,
                  lineHeight: 1.15,
                  color: C.ink,
                  whiteSpace: "pre-line",
                  transform: `scale(${s})`,
                }}
              >
                {u}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              top: 300,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 34,
              color: C.green,
              opacity: interpolate(frame, [c2 + 40, c2 + 52], [0, 1], clamp),
            }}
          >
            🏪 {TODAY.where} 💻
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------- 10. Финал истории ----------
export const Finale: React.FC<SceneProps> = ({ cue }) => {
  const [c0 = 0, c1 = 80] = cue;
  const a = useSp(c0 + 2, 12);
  const b = useSp(c1, 10);
  const right = useSp(c1 + 14, 10);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 70,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: C.ink,
        }}
      >
        <div style={{ opacity: a }}>{FINALE.line1}</div>
        <div style={{ opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>
          <span style={{ background: C.tag, padding: "0 14px" }}>
            {FINALE.line2}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
        }}
      >
        <div style={{ transform: `rotate(-6deg) scale(${a})` }}>
          <Diapers scale={2} />
        </div>
        <div style={{ transform: `rotate(6deg) scale(${right})` }}>
          <Beer scale={1.8} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
