import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CASES,
  CASES_TITLE,
  CTA,
  HOOK,
  PLAN,
  STATS,
  STATS_TITLE,
} from "./content";
import {
  C,
  SANS,
  MONO,
  clamp,
  Background,
  ProgressBar,
  Scene,
  Kicker,
  Title,
  Marker,
  BrutalButton,
} from "../brand";

// Тайминг сцен (30 fps, 900 кадров = 30 сек)
const S = {
  hook: [0, 90],
  plan: [90, 330],
  cases: [330, 630],
  stats: [630, 750],
  cta: [750, 900],
} as const;

// ---------- Сцена 1: хук ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // первый кадр уже содержит главную фразу
  const punch = interpolate(frame, [0, 6], [1.06, 1], clamp);
  const mark = interpolate(frame, [4, 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const tail = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  const len = S.hook[1] - S.hook[0];
  const exit = interpolate(frame, [len - 8, len], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Kicker text={HOOK.kicker} top={640} />
      <div
        style={{
          position: "absolute",
          top: 730,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 118,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          color: C.ink,
          transform: `scale(${punch})`,
        }}
      >
        <div>{HOOK.lead}</div>
        <Marker progress={mark}>{HOOK.marked}</Marker>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1040,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.15,
          color: C.ink2,
          whiteSpace: "pre-line",
          opacity: tail,
          transform: `translateY(${(1 - tail) * 30}px)`,
        }}
      >
        {HOOK.tail}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 2: план зала ----------
const HALL = { x: 90, y: 440, w: 900, h: 860 };
const SHELF_W = 230;
const SHELF_H = 100;
const COLS = [240, 540, 840];
const ROWS = [560, 840, 1120];
const A_POS = { x: COLS[0], y: ROWS[0] };
const B_FAR = { x: COLS[2], y: ROWS[2] };
const B_NEAR = { x: COLS[0], y: 700 };
// путь покупателя по проходам от гречки к тушёнке
const PATH = `M ${A_POS.x} ${A_POS.y + 50} L ${A_POS.x} 700 L 690 700 L 690 980 L ${B_FAR.x} 980 L ${B_FAR.x} ${B_FAR.y - 50}`;

const Plan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const T_TOGETHER = 80;
  const T_FIX = 160;

  const pathDraw = interpolate(frame, [30, 70], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pathFade = interpolate(frame, [T_FIX, T_FIX + 10], [1, 0], clamp);
  const move = spring({
    frame: frame - T_FIX,
    fps,
    config: { damping: 13, mass: 0.9 },
  });
  const bx = interpolate(move, [0, 1], [B_FAR.x, B_NEAR.x]);
  const by = interpolate(move, [0, 1], [B_FAR.y, B_NEAR.y]);

  const titleOut = (start: number, end: number) =>
    frame >= start && frame < end
      ? interpolate(frame, [end - 6, end], [1, 0], clamp)
      : 0;

  const stamp = spring({
    frame: frame - T_FIX - 18,
    fps,
    config: { damping: 9 },
  });

  // «один из двенадцати чеков»
  const receipts = Array.from({ length: 12 });
  const receiptsOn = frame >= T_TOGETHER && frame < T_FIX + 10;
  const receiptsFade = interpolate(frame, [T_FIX, T_FIX + 10], [1, 0], clamp);

  return (
    <AbsoluteFill>
      {/* Заголовки трёх фаз */}
      <AbsoluteFill style={{ opacity: titleOut(0, T_TOGETHER) }}>
        <Title text={PLAN.titleApart} top={210} size={58} />
      </AbsoluteFill>
      <Sequence
        from={T_TOGETHER}
        durationInFrames={T_FIX - T_TOGETHER}
        layout="none"
      >
        <AbsoluteFill style={{ opacity: titleOut(T_TOGETHER, T_FIX) }}>
          <Title text={PLAN.titleTogether} top={210} size={58} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={T_FIX} layout="none">
        <Title text={PLAN.titleFix} top={210} size={58} />
      </Sequence>

      {/* Зал */}
      <div
        style={{
          position: "absolute",
          left: HALL.x,
          top: HALL.y,
          width: HALL.w,
          height: HALL.h,
          background: C.paper,
          border: `4px solid ${C.ink}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: HALL.x + 24,
          top: HALL.y + HALL.h - 50,
          fontFamily: MONO,
          fontSize: 24,
          fontWeight: 700,
          color: C.ink2,
        }}
      >
        ВХОД ↑
      </div>
      <div
        style={{
          position: "absolute",
          right: 1080 - HALL.x - HALL.w + 24,
          top: HALL.y + 16,
          fontFamily: MONO,
          fontSize: 24,
          fontWeight: 700,
          color: C.ink2,
        }}
      >
        КАССА
      </div>

      {/* Обычные стеллажи */}
      {ROWS.map((y, r) =>
        COLS.map((x, c) => {
          if ((r === 0 && c === 0) || (r === 2 && c === 2)) return null;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: x - SHELF_W / 2,
                top: y - SHELF_H / 2,
                width: SHELF_W,
                height: SHELF_H,
                background: C.shelf,
                border: `3px solid ${C.line}`,
              }}
            />
          );
        }),
      )}

      {/* Путь покупателя */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <mask id="reveal">
            <path
              d={PATH}
              fill="none"
              stroke="#fff"
              strokeWidth={20}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - pathDraw}
            />
          </mask>
        </defs>
        <path
          d={PATH}
          fill="none"
          stroke={C.red}
          strokeWidth={8}
          strokeDasharray="18 14"
          strokeLinejoin="round"
          mask="url(#reveal)"
          opacity={pathFade}
        />
      </svg>

      <Shelf label={PLAN.itemA} x={A_POS.x} y={A_POS.y} delay={4} />
      <Shelf label={PLAN.itemB} x={bx} y={by} delay={14} />

      {/* Ряд чеков: каждый 12-й содержит пару */}
      {receiptsOn && (
        <div
          style={{
            position: "absolute",
            top: 1360,
            left: 0,
            right: 0,
            opacity: receiptsFade,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
            {receipts.map((_, i) => {
              const s = spring({
                frame: frame - T_TOGETHER - i * 3,
                fps,
                config: { damping: 14 },
              });
              const hit = i === 11 && frame - T_TOGETHER > 42;
              return (
                <div
                  key={i}
                  style={{
                    width: 62,
                    height: 92,
                    background: hit ? C.tag : C.paper,
                    border: `3px solid ${C.ink}`,
                    opacity: s,
                    transform: `translateY(${(1 - s) * 40}px) scale(${hit ? 1.2 : 1})`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "14px 10px",
                  }}
                >
                  {[1, 0.7, 0.85].map((w, k) => (
                    <div
                      key={k}
                      style={{
                        height: 6,
                        width: `${w * 100}%`,
                        background: C.ink,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 36,
              color: C.ink,
              opacity: interpolate(frame - T_TOGETHER, [42, 50], [0, 1], clamp),
            }}
          >
            {PLAN.receiptsLabel}
          </div>
        </div>
      )}

      {/* Штамп «0 ₽» */}
      {frame >= T_FIX + 18 && (
        <div
          style={{
            position: "absolute",
            top: 1370,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${interpolate(stamp, [0, 1], [2, 1])}) rotate(-4deg)`,
              opacity: stamp,
              border: `6px solid ${C.green}`,
              color: C.green,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 64,
              padding: "14px 40px",
            }}
          >
            0 ₽ ЗАТРАТ
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Shelf: React.FC<{
  label: string;
  x: number;
  y: number;
  delay: number;
}> = ({ label, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 10 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - SHELF_W / 2,
        top: y - SHELF_H / 2,
        width: SHELF_W,
        height: SHELF_H,
        background: C.tag,
        border: `4px solid ${C.ink}`,
        boxShadow: `8px 8px 0 ${C.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 34,
        color: C.ink,
        transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      {label}
    </div>
  );
};

// ---------- Сцена 3: кейсы ----------
const CASE_LEN = 100;

const Cases: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Title text={CASES_TITLE} top={210} size={64} />
      {CASES.map((c, i) => {
        const local = frame - i * CASE_LEN;
        if (local < 0 || local >= CASE_LEN) return null;
        return <CaseCard key={i} data={c} index={i} local={local} />;
      })}
    </AbsoluteFill>
  );
};

const CaseCard: React.FC<{
  data: (typeof CASES)[number];
  index: number;
  local: number;
}> = ({ data, index, local }) => {
  const { fps } = useVideoConfig();
  const isLast = index === CASES.length - 1;
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 16, mass: 0.7 },
  });
  const exit = isLast
    ? 0
    : interpolate(local, [CASE_LEN - 8, CASE_LEN], [0, 1], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      });
  const x = (1 - enter) * 1080 - exit * 1080;
  const result = spring({ frame: local - 34, fps, config: { damping: 9 } });
  const found = interpolate(local, [18, 26], [0, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        top: 560,
        left: 70,
        width: 940,
        transform: `translateX(${x}px) rotate(${(index - 1) * 0.8}deg)`,
        background: C.paper,
        border: `4px solid ${C.ink}`,
        boxShadow: `14px 14px 0 ${C.ink}`,
        padding: "44px 50px 50px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.green,
        }}
      >
        <span>{data.tag}</span>
        <span style={{ color: C.ink2 }}>
          {String(index + 1).padStart(2, "0")}/
          {String(CASES.length).padStart(2, "0")}
        </span>
      </div>
      <div
        style={{
          marginTop: 26,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.14,
          letterSpacing: "-0.02em",
          color: C.ink,
          whiteSpace: "pre-line",
        }}
      >
        {data.title}
      </div>
      <div
        style={{
          margin: "34px 0 28px",
          borderTop: `3px dashed ${C.line}`,
        }}
      />
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 32,
          color: C.ink,
          opacity: found,
        }}
      >
        <span
          style={{ background: C.tag, padding: "2px 8px", fontWeight: 700 }}
        >
          НАШЛИ
        </span>{" "}
        {data.found}
      </div>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          opacity: Math.min(1, result),
          transform: `scale(${interpolate(result, [0, 1], [0.6, 1])})`,
          transformOrigin: "left center",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 150,
            letterSpacing: "-0.04em",
            color: C.green,
            lineHeight: 1,
          }}
        >
          {data.result}
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 38,
            color: C.ink,
            lineHeight: 1.15,
          }}
        >
          {data.resultLabel}
        </span>
      </div>
    </div>
  );
};

// ---------- Сцена 4: цифры ----------
const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Title text={STATS_TITLE} top={230} size={62} />
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 70,
          right: 70,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 34,
        }}
      >
        {STATS.map((st, i) => {
          const s = spring({
            frame: frame - 8 - i * 7,
            fps,
            config: { damping: 13 },
          });
          const count = Math.round(
            interpolate(frame, [8 + i * 7, 40 + i * 7], [0, st.value], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          );
          const highlight = i === 3;
          return (
            <div
              key={i}
              style={{
                height: 400,
                background: highlight ? C.tag : C.paper,
                border: `4px solid ${C.ink}`,
                boxShadow: `10px 10px 0 ${C.ink}`,
                padding: "40px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: s,
                transform: `translateY(${(1 - s) * 60}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 100,
                  letterSpacing: "-0.04em",
                  color: C.ink,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {count}
                <span style={{ fontSize: 64 }}>{st.suffix}</span>
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 34,
                  lineHeight: 1.2,
                  color: C.ink,
                  whiteSpace: "pre-line",
                }}
              >
                {st.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 5: призыв ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = spring({ frame: frame - 26, fps, config: { damping: 9 } });
  const pulse = frame > 55 ? 1 + Math.sin((frame - 55) / 5) * 0.025 : 1;
  const contacts = spring({ frame: frame - 44, fps, config: { damping: 14 } });
  const bg = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity: bg }}>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 52,
          color: C.paper,
          letterSpacing: "-0.02em",
        }}
      >
        Аналитика{" "}
        <span
          style={{
            background: C.tag,
            color: C.ink,
            padding: "2px 16px",
            border: `3px solid ${C.paper}`,
          }}
        >
          ПРО
        </span>
      </div>
      <Kicker text={CTA.kicker} top={640} color={C.tag} />
      <Title text={CTA.title} top={720} size={66} color={C.paper} delay={4} />
      <div
        style={{
          position: "absolute",
          top: 1060,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BrutalButton text={CTA.button} scale={btn * pulse} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1300,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: contacts,
          transform: `translateY(${(1 - contacts) * 30}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 58,
            color: C.tag,
          }}
        >
          {CTA.site}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 38,
            color: "rgba(255,255,255,0.75)",
            whiteSpace: "pre",
          }}
        >
          {CTA.telegram}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Озвучка: файлы в public/voice, старт каждой фразы — кадр её сцены
const VOICE: [string, number][] = [
  ["hook", 2],
  ["planA", 92],
  ["planB", 172],
  ["planC", 252],
  ["case1", 332],
  ["case2", 432],
  ["case3", 532],
  ["stats", 634],
  ["cta", 756],
];

const Voiceover: React.FC = () => (
  <>
    {VOICE.map(([name, from]) => (
      <Sequence key={name} from={from} layout="none">
        <Audio src={staticFile(`voice/${name}.wav`)} />
      </Sequence>
    ))}
  </>
);

// ---------- Сборка ----------
const len = (r: readonly [number, number]) => r[1] - r[0];

export const AnalyticPro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence from={S.hook[0]} durationInFrames={len(S.hook)}>
        <Hook />
      </Sequence>
      <Sequence from={S.plan[0]} durationInFrames={len(S.plan)}>
        <Scene length={len(S.plan)}>
          <Plan />
        </Scene>
      </Sequence>
      <Sequence from={S.cases[0]} durationInFrames={len(S.cases)}>
        <Scene length={len(S.cases)}>
          <Cases />
        </Scene>
      </Sequence>
      <Sequence from={S.stats[0]} durationInFrames={len(S.stats)}>
        <Scene length={len(S.stats)}>
          <Stats />
        </Scene>
      </Sequence>
      <Sequence from={S.cta[0]} durationInFrames={len(S.cta)}>
        <Cta />
      </Sequence>
      <ProgressBar />
      <Voiceover />
    </AbsoluteFill>
  );
};
