import "@fontsource/montserrat/cyrillic-600.css";
import "@fontsource/montserrat/cyrillic-800.css";
import "@fontsource/montserrat/cyrillic-900.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-900.css";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CTA_BUTTON,
  CTA_SITE,
  CTA_TITLE,
  HIDDEN_TITLE,
  HOOK,
  ISOLATED_TITLE,
  LINKS,
  NODES,
  NodeId,
  SOLUTION_SUB,
  SOLUTION_TITLE,
} from "./content";

const C = {
  bg1: "#070B1A",
  bg2: "#101A3A",
  text: "#F4F7FF",
  muted: "#8C97BF",
  cyan: "#38E1FF",
  green: "#3DFFA2",
  red: "#FF4D63",
  card: "rgba(22, 32, 68, 0.92)",
};

const FONT = "Montserrat, sans-serif";

// Тайминг (30 fps, 900 кадров = 30 сек)
const T = {
  hookEnd: 105,
  netStart: 90,
  netEnd: 735,
  // внутри сети (локальные кадры)
  hiddenStart: 150,
  linkStep: 105,
  solutionStart: 480,
  ctaStart: 720,
};

const CARD_W = 380;
const CARD_H = 170;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, 900], [0, 120]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${C.bg2} 0%, ${C.bg1} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(56,225,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,225,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${shift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 10,
        width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
      }}
    />
  );
};

// Многострочный заголовок с построчным появлением
const Title: React.FC<{
  text: string;
  top: number;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ text, top, size = 78, color = C.text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.12,
        color,
      }}
    >
      {text.split("\n").map((line, i) => {
        const s = spring({
          frame: frame - delay - i * 6,
          fps,
          config: { damping: 14, mass: 0.6 },
        });
        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `translateY(${(1 - s) * 40}px)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Сцена 1: хук ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const starts = [0, 22, 46];
  const exit = interpolate(frame, [T.hookEnd - 15, T.hookEnd], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exit,
        transform: `scale(${interpolate(exit, [0, 1], [1.15, 1])})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 70,
        }}
      >
        {HOOK.map((item, i) => {
          const local = frame - starts[i];
          // первая строка видна с первого кадра — «ударом»
          const pop =
            i === 0
              ? interpolate(frame, [0, 7], [1.08, 1], {
                  ...clamp,
                  easing: Easing.out(Easing.cubic),
                })
              : interpolate(
                  spring({ frame: local, fps, config: { damping: 11 } }),
                  [0, 1],
                  [1.35, 1],
                );
          const visible = i === 0 || local >= 0;
          const shake =
            !item.ok && local > 6 && local < 30
              ? Math.sin(local * 2.4) * interpolate(local, [6, 30], [18, 0])
              : 0;
          const color = item.ok ? C.text : C.red;
          return (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: `scale(${pop}) translateX(${shake}px)`,
                display: "flex",
                alignItems: "center",
                gap: 34,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: item.ok ? 74 : 84,
                color,
                textShadow: item.ok ? "none" : `0 0 40px ${C.red}88`,
              }}
            >
              <span
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: item.ok ? `${C.green}22` : `${C.red}33`,
                  color: item.ok ? C.green : C.red,
                  fontSize: 62,
                  flexShrink: 0,
                }}
              >
                {item.ok ? "✓" : "✕"}
              </span>
              {item.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцены 2–4: сеть метрик ----------
const nodeById = (id: NodeId) => NODES.find((n) => n.id === id)!;

const linkGeometry = (from: NodeId, to: NodeId) => {
  const a = nodeById(from);
  const b = nodeById(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // изгиб: горизонтальные связки прогибаются вниз, диагонали — вбок
  const cx = a.y === b.y ? mx : mx + (a.y < b.y ? 90 : -90);
  const cy = a.y === b.y ? my + 150 : my;
  const point = (t: number) => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t ** 2 * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t ** 2 * b.y,
  });
  return { d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`, point };
};

const Network: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const netLen = T.netEnd - T.netStart;

  const inSolution = frame >= T.solutionStart;
  const linkStart = (i: number) => T.hiddenStart + 20 + i * T.linkStep;

  const revealed = LINKS.map((_, i) => frame >= linkStart(i));
  const redNodes = new Set<NodeId>();
  LINKS.forEach((l, i) => {
    if (revealed[i]) {
      redNodes.add(l.from);
      redNodes.add(l.to);
    }
  });

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clamp);
  const fadeOut = interpolate(frame, [netLen - 15, netLen], [1, 0], clamp);
  // лёгкий «наезд камеры» в фазе связок
  const zoom = interpolate(
    frame,
    [T.hiddenStart, T.solutionStart, netLen],
    [1, 1.05, 0.97],
    clamp,
  );

  // Активная подпись связки
  const activeLink = inSolution
    ? -1
    : LINKS.reduce((acc, _, i) => (frame >= linkStart(i) ? i : acc), -1);

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* Заголовки фаз */}
      <Sequence durationInFrames={T.hiddenStart} layout="none">
        <PhaseOut end={T.hiddenStart}>
          <Title text={ISOLATED_TITLE} top={200} delay={4} />
        </PhaseOut>
      </Sequence>
      <Sequence
        from={T.hiddenStart}
        durationInFrames={T.solutionStart - T.hiddenStart}
        layout="none"
      >
        <PhaseOut end={T.solutionStart - T.hiddenStart}>
          <Title text={HIDDEN_TITLE} top={200} size={68} />
        </PhaseOut>
      </Sequence>
      <Sequence from={T.solutionStart} layout="none">
        <Title text={SOLUTION_TITLE} top={200} color={C.cyan} />
      </Sequence>

      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {/* Связки */}
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {LINKS.map((l, i) => {
            const { d, point } = linkGeometry(l.from, l.to);
            const draw = interpolate(
              frame,
              [linkStart(i), linkStart(i) + 22],
              [0, 1],
              { ...clamp, easing: Easing.out(Easing.cubic) },
            );
            if (draw <= 0) return null;
            const color = inSolution ? C.cyan : C.red;
            // бегущие импульсы вдоль связки
            const pulses = [0, 0.33, 0.66].map((o) => {
              const t = ((frame - linkStart(i)) / 45 + o) % 1;
              return point(t);
            });
            return (
              <g key={i} filter="url(#glow)">
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={color}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeDasharray="1"
                  strokeDashoffset={1 - draw}
                />
                {draw >= 1 &&
                  pulses.map((p, k) => (
                    <circle key={k} cx={p.x} cy={p.y} r={11} fill="#fff" />
                  ))}
              </g>
            );
          })}
        </svg>

        {/* Карточки метрик */}
        {NODES.map((n, i) => {
          const s = spring({
            frame: frame - 8 - i * 7,
            fps,
            config: { damping: 12, mass: 0.7 },
          });
          const isRed = !inSolution && redNodes.has(n.id);
          const accent = inSolution ? C.green : isRed ? C.red : C.green;
          const status = inSolution
            ? "под контролем"
            : isRed
              ? "теряет деньги"
              : "всё ок";
          const icon = isRed ? "!" : "✓";
          return (
            <div
              key={n.id}
              style={{
                position: "absolute",
                left: n.x - CARD_W / 2,
                top: n.y - CARD_H / 2,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 32,
                background: C.card,
                border: `4px solid ${accent}`,
                boxShadow: `0 0 ${isRed ? 50 : 24}px ${accent}55`,
                transform: `scale(${s})`,
                opacity: s,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 28px",
                fontFamily: FONT,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 800, color: C.text }}>
                {n.label}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 32,
                  fontWeight: 600,
                  color: accent,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontWeight: 900 }}>{icon}</span>
                {status}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Подпись к текущей связке */}
      {activeLink >= 0 && (
        <Caption
          key={activeLink}
          text={LINKS[activeLink].caption}
          start={linkStart(activeLink) + 10}
          end={
            activeLink === LINKS.length - 1
              ? T.solutionStart
              : linkStart(activeLink + 1)
          }
        />
      )}

      {/* Решение: подзаголовок + растущий график */}
      <Sequence from={T.solutionStart + 20} layout="none">
        <Growth />
      </Sequence>
    </AbsoluteFill>
  );
};

const PhaseOut: React.FC<{ end: number; children: React.ReactNode }> = ({
  end,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Caption: React.FC<{ text: string; start: number; end: number }> = ({
  text,
  start,
  end,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - start, fps, config: { damping: 14 } });
  const out = interpolate(frame, [end - 8, end], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1380,
        padding: "34px 30px",
        borderRadius: 30,
        background: C.red,
        color: "#fff",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 44,
        lineHeight: 1.22,
        textAlign: "center",
        whiteSpace: "pre-line",
        opacity: s * out,
        transform: `translateY(${(1 - s) * 60}px)`,
        boxShadow: `0 20px 60px ${C.red}66`,
      }}
    >
      {text}
    </div>
  );
};

const Growth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const draw = interpolate(frame, [10, 55], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pts = "20,150 150,134 280,140 410,100 540,84 670,46 800,16";
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1370,
        opacity: s,
        transform: `translateY(${(1 - s) * 50}px)`,
        textAlign: "center",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          fontSize: 50,
          fontWeight: 800,
          color: C.text,
          whiteSpace: "pre-line",
          lineHeight: 1.2,
        }}
      >
        {SOLUTION_SUB}
      </div>
      <svg width={820} height={170} style={{ marginTop: 16 }}>
        <polyline
          points={pts}
          fill="none"
          stroke={C.green}
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 14px ${C.green})` }}
        />
        {draw >= 1 && <circle cx={800} cy={16} r={16} fill={C.green} />}
      </svg>
    </div>
  );
};

// ---------- Сцена 5: призыв ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = spring({ frame: frame - 22, fps, config: { damping: 10 } });
  const site = spring({ frame: frame - 38, fps, config: { damping: 14 } });
  const pulse = 1 + Math.sin(frame / 6) * 0.03 * (frame > 45 ? 1 : 0);
  return (
    <AbsoluteFill>
      <Title text={CTA_TITLE} top={560} size={80} />
      <div
        style={{
          position: "absolute",
          top: 930,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${btn * pulse})`,
            padding: "44px 70px",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
            color: C.bg1,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 54,
            boxShadow: `0 0 70px ${C.cyan}88`,
          }}
        >
          {CTA_BUTTON}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 62,
          color: C.cyan,
          letterSpacing: 1,
          opacity: site,
          transform: `translateY(${(1 - site) * 30}px)`,
        }}
      >
        {CTA_SITE}
      </div>
    </AbsoluteFill>
  );
};

export const SalesLinks: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg1 }}>
      <Background />
      <Sequence durationInFrames={T.hookEnd}>
        <Hook />
      </Sequence>
      <Sequence from={T.netStart} durationInFrames={T.netEnd - T.netStart}>
        <Network />
      </Sequence>
      <Sequence from={T.ctaStart}>
        <Cta />
      </Sequence>
      <ProgressBar />
    </AbsoluteFill>
  );
};
