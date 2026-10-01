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
import { BLIND, CHECKOUT, RECEIPTS } from "./content";

// cue — локальные кадры начала субтитров в сцене
export type SceneProps = { cue: number[] };

// ---------- Иллюстрации ----------

export const Beer: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={90 * scale} height={240 * scale} viewBox="0 0 90 240">
    <rect
      x={33}
      y={0}
      width={24}
      height={16}
      fill={C.tag}
      stroke={C.ink}
      strokeWidth={4}
    />
    <path
      d="M35 16 H55 V60 Q55 80 75 95 Q85 105 85 125 V230 Q85 236 79 236 H11 Q5 236 5 230 V125 Q5 105 15 95 Q35 80 35 60 Z"
      fill="#7A4A16"
      stroke={C.ink}
      strokeWidth={5}
    />
    <rect
      x={5}
      y={135}
      width={80}
      height={60}
      fill={C.tag}
      stroke={C.ink}
      strokeWidth={5}
    />
    <text
      x={45}
      y={173}
      textAnchor="middle"
      fontFamily={MONO}
      fontWeight={700}
      fontSize={20}
      fill={C.ink}
    >
      ПИВО
    </text>
  </svg>
);

export const Chips: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <svg width={140 * scale} height={190 * scale} viewBox="0 0 140 190">
    <path
      d="M10 12 L130 12 L122 95 L130 178 L10 178 L18 95 Z"
      fill={C.tag}
      stroke={C.ink}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path
      d="M10 12 L130 12"
      stroke={C.ink}
      strokeWidth={9}
      strokeDasharray="6 6"
    />
    <rect
      x={22}
      y={70}
      width={96}
      height={44}
      fill={C.red}
      stroke={C.ink}
      strokeWidth={4}
    />
    <text
      x={70}
      y={100}
      textAnchor="middle"
      fontFamily={MONO}
      fontWeight={700}
      fontSize={22}
      fill="#fff"
    >
      ЧИПСЫ
    </text>
  </svg>
);

// ---------- Сцена 1: касса ----------
export const Checkout: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // бутылка уже едет по ленте с первого кадра
  const beerX = interpolate(frame, [0, 22], [140, 470], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const beep = frame >= 22 && frame < 28;
  const printed = interpolate(frame, [24, 44], [0, 1], clamp);
  const missedAt = cue[1] ?? 42;
  const missed = spring({
    frame: frame - missedAt - 6,
    fps,
    config: { damping: 9 },
  });
  const headline = spring({
    frame: frame - missedAt - 22,
    fps,
    config: { damping: 12 },
  });
  const beltShift = (frame * 6) % 60;

  return (
    <AbsoluteFill>
      {/* Полка с чипсами */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 470,
          width: 440,
          height: 300,
          background: C.paper,
          border: `4px solid ${C.ink}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 22,
            background: C.shelf,
            borderTop: `4px solid ${C.ink}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 40,
            display: "flex",
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <Chips key={i} scale={0.92} />
          ))}
        </div>
        {/* «Не купил» */}
        <div
          style={{
            position: "absolute",
            inset: -18,
            border: `6px dashed ${C.red}`,
            opacity: missed,
            transform: `scale(${interpolate(missed, [0, 1], [1.2, 1])})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -10,
            top: -46,
            transform: `rotate(6deg) scale(${interpolate(missed, [0, 1], [2, 1])})`,
            opacity: missed,
            background: C.red,
            color: "#fff",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 36,
            padding: "8px 20px",
            border: `4px solid ${C.ink}`,
          }}
        >
          {CHECKOUT.stamp}
        </div>
      </div>

      {/* Лента кассы */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1080,
          height: 70,
          background: `repeating-linear-gradient(90deg, #2A2D31 0 30px, ${C.ink} 30px 60px)`,
          backgroundPosition: `${frame < 22 ? beltShift : 0}px 0`,
          borderTop: `5px solid ${C.ink}`,
        }}
      />
      {/* Сканер */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 940,
          width: 150,
          height: 140,
          background: C.ink,
          border: `4px solid ${C.ink}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: 20,
            height: 14,
            background: beep ? C.red : "#3A3E44",
            boxShadow: beep ? `0 0 40px ${C.red}` : "none",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: beerX, top: 840 }}>
        <Beer />
      </div>

      {/* Чек выезжает из кассы */}
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 1160,
          width: 600,
          height: 220 * printed,
          overflow: "hidden",
          background: C.paper,
          border: printed > 0 ? `4px solid ${C.ink}` : "none",
          borderTop: "none",
          fontFamily: MONO,
          fontSize: 30,
          color: C.ink,
          padding: printed > 0 ? "18px 28px" : 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>{CHECKOUT.item}</span>
          <span>{CHECKOUT.price}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            color: C.red,
            opacity: missed,
            textDecoration: "line-through",
            fontWeight: 700,
          }}
        >
          <span>{CHECKOUT.missed}</span>
          <span>—</span>
        </div>
        <div
          style={{ borderTop: `3px dashed ${C.line}`, margin: "18px 0 12px" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>ИТОГО</span>
          <span>{CHECKOUT.price}</span>
        </div>
      </div>

      {/* Заголовок */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 40,
          right: 40,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: C.ink,
          opacity: headline,
          transform: `scale(${interpolate(headline, [0, 1], [1.3, 1])})`,
        }}
      >
        <span style={{ background: C.red, color: "#fff", padding: "0 14px" }}>
          {CHECKOUT.headline}
        </span>
        <div style={{ marginTop: 10 }}>{CHECKOUT.headlineTail}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 2: продажи ≠ связи ----------
export const Blind: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const split = cue[1] ?? 85;

  const count = Math.round(
    interpolate(frame, [4, 50], [0, BLIND.counter], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const phaseA = interpolate(frame, [split - 8, split], [1, 0], clamp);
  const phaseB = spring({ frame: frame - split, fps, config: { damping: 14 } });
  const linkDraw = interpolate(frame, [split + 40, split + 80], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const neq = spring({
    frame: frame - split - 20,
    fps,
    config: { damping: 8 },
  });

  // лента чеков бежит фоном
  const tapeY = -((frame * 22) % 220);

  return (
    <AbsoluteFill>
      {/* Фаза A: счётчик и лента чеков */}
      {phaseA > 0 && (
        <AbsoluteFill style={{ opacity: phaseA }}>
          <div
            style={{
              position: "absolute",
              left: 330,
              width: 420,
              top: 0,
              bottom: 0,
              overflow: "hidden",
              opacity: 0.9,
            }}
          >
            <div style={{ transform: `translateY(${tapeY}px)` }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 200,
                    margin: "20px 0 0",
                    background: C.paper,
                    border: `3px solid ${C.ink}`,
                    padding: "18px 24px",
                    fontFamily: MONO,
                    fontSize: 26,
                    color: C.ink2,
                  }}
                >
                  <div>ЧЕК {String(4812 + i).padStart(6, "0")}</div>
                  <div style={{ color: C.ink, marginTop: 10 }}>
                    ПИВО ....... 119,00
                  </div>
                  <div
                    style={{
                      color: C.red,
                      textDecoration: "line-through",
                      marginTop: 8,
                    }}
                  >
                    ЧИПСЫ ........ —
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 640,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 260,
              letterSpacing: "-0.05em",
              color: C.ink,
              textShadow: `10px 10px 0 ${C.tag}`,
              lineHeight: 1,
            }}
          >
            ×{count}
          </div>
          <div
            style={{
              position: "absolute",
              top: 920,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: C.ink,
                color: C.tag,
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 48,
                padding: "10px 30px",
              }}
            >
              {BLIND.counterLabel}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Фаза B: продажи против связей */}
      {frame >= split && (
        <AbsoluteFill style={{ opacity: phaseB }}>
          <div
            style={{
              position: "absolute",
              top: 170,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 100,
              letterSpacing: "-0.03em",
              color: C.ink,
            }}
          >
            Продажи{" "}
            <span
              style={{
                display: "inline-block",
                color: C.red,
                transform: `scale(${neq})`,
              }}
            >
              ≠
            </span>{" "}
            связи
          </div>

          {/* Левая панель: столбики продаж */}
          <Panel x={50} title={BLIND.left}>
            {BLIND.items.map((it, i) => {
              const w = spring({
                frame: frame - split - 6 - i * 5,
                fps,
                config: { damping: 15 },
              });
              return (
                <div key={it} style={{ marginBottom: 34 }}>
                  <div
                    style={{
                      fontFamily: SANS,
                      fontWeight: 700,
                      fontSize: 32,
                      color: C.ink,
                    }}
                  >
                    {it}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      height: 34,
                      width: `${BLIND.bars[i] * 100 * w}%`,
                      background: C.ink2,
                    }}
                  />
                </div>
              );
            })}
          </Panel>

          {/* Правая панель: те же товары, но связаны */}
          <Panel x={555} title={BLIND.right} highlight>
            <svg
              width={370}
              height={500}
              style={{ position: "absolute", left: 30, top: 110 }}
            >
              {[
                [0, 1],
                [2, 3],
                [0, 2],
              ].map(([a, b], i) => {
                const pa = NODE_POS[a];
                const pb = NODE_POS[b];
                return (
                  <line
                    key={i}
                    x1={pa[0]}
                    y1={pa[1]}
                    x2={pb[0]}
                    y2={pb[1]}
                    stroke={i === 0 ? C.green : C.ink}
                    strokeWidth={i === 0 ? 10 : 5}
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={1 - linkDraw}
                  />
                );
              })}
            </svg>
            {BLIND.items.map((it, i) => (
              <div
                key={it}
                style={{
                  position: "absolute",
                  left: 30 + NODE_POS[i][0] - 80,
                  top: 110 + NODE_POS[i][1] - 32,
                  width: 160,
                  height: 64,
                  background: i < 2 ? C.tag : C.paper,
                  border: `4px solid ${C.ink}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 30,
                  color: C.ink,
                }}
              >
                {it}
              </div>
            ))}
          </Panel>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const NODE_POS: [number, number][] = [
  [95, 60],
  [275, 190],
  [95, 330],
  [275, 440],
];

const Panel: React.FC<{
  x: number;
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
}> = ({ x, title, highlight, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 420,
      width: 475,
      height: 760,
      background: C.paper,
      border: `4px solid ${C.ink}`,
      boxShadow: highlight ? `12px 12px 0 ${C.ink}` : "none",
      padding: "30px 34px",
    }}
  >
    <div
      style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 28,
        color: highlight ? C.green : C.ink2,
        marginBottom: 40,
      }}
    >
      {title.toUpperCase()}
    </div>
    {children}
  </div>
);

// ---------- Сцена 3: чеки знают больше ----------
type NodeId = (typeof RECEIPTS.nodes)[number]["id"];
const nodeById = (id: NodeId) => RECEIPTS.nodes.find((n) => n.id === id)!;
const STACK = { x: 540, y: 1290 };

export const Receipts: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const second = cue[1] ?? 90;

  return (
    <AbsoluteFill>
      <Title text={RECEIPTS.headline} top={170} size={68} />

      {/* Стопка чеков */}
      {[3, 2, 1, 0].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: STACK.x - 150 + i * 10,
            top: STACK.y - 70 - i * 12,
            width: 300,
            height: 140,
            background: C.paper,
            border: `4px solid ${C.ink}`,
            transform: `rotate(${(i - 1.5) * 3}deg)`,
            padding: "16px 22px",
          }}
        >
          {[0.9, 0.6, 0.75].map((w, k) => (
            <div
              key={k}
              style={{
                height: 8,
                width: `${w * 100}%`,
                background: C.line,
                marginBottom: 14,
              }}
            />
          ))}
        </div>
      ))}

      {/* Связи */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {RECEIPTS.links.map((l, i) => {
          const a = nodeById(l.from);
          const b = nodeById(l.to);
          const killer = l.kind === "killer";
          const start = killer ? second + 10 : 34 + i * 12;
          const draw = interpolate(frame, [start, start + 18], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
          if (draw <= 0) return null;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - 70;
          const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
          return (
            <g key={i}>
              {killer ? (
                <>
                  <path
                    d={d}
                    fill="none"
                    stroke={C.red}
                    strokeWidth={9}
                    strokeDasharray="20 16"
                    opacity={draw}
                  />
                  <text
                    x={mx}
                    y={my + 44}
                    textAnchor="middle"
                    fontFamily={SANS}
                    fontWeight={900}
                    fontSize={60}
                    fill={C.red}
                    opacity={draw}
                  >
                    ✕
                  </text>
                </>
              ) : (
                <path
                  d={d}
                  fill="none"
                  stroke={C.green}
                  strokeWidth={12}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - draw}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Товары вылетают из стопки */}
      {RECEIPTS.nodes.map((n, i) => {
        const s = spring({
          frame: frame - 4 - i * 4,
          fps,
          config: { damping: 13, mass: 0.8 },
        });
        const x = interpolate(s, [0, 1], [STACK.x, n.x]);
        const y = interpolate(s, [0, 1], [STACK.y, n.y]);
        const killer = n.id.startsWith("lemon");
        const lit = killer ? frame >= second + 10 : frame >= 40;
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.3, 1])})`,
              opacity: Math.min(1, s * 2),
              background: lit ? (killer ? "#F6D3CF" : C.tag) : C.paper,
              border: `4px solid ${C.ink}`,
              boxShadow: `6px 6px 0 ${C.ink}`,
              padding: "14px 26px",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            {n.label}
          </div>
        );
      })}

      {/* Легенда */}
      <Legend frame={frame} second={second} />
    </AbsoluteFill>
  );
};

const Legend: React.FC<{ frame: number; second: number }> = ({
  frame,
  second,
}) => {
  const a = interpolate(frame, [second, second + 10], [0, 1], clamp);
  const b = interpolate(frame, [second + 20, second + 30], [0, 1], clamp);
  const item = (color: string, dashed: boolean, text: string, o: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: o }}>
      <svg width={70} height={14}>
        <line
          x1={0}
          y1={7}
          x2={70}
          y2={7}
          stroke={color}
          strokeWidth={10}
          strokeDasharray={dashed ? "14 10" : undefined}
        />
      </svg>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color }}>
        {text}
      </span>
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 1100,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "space-between",
        zIndex: 2,
      }}
    >
      {item(C.green, false, RECEIPTS.magnet, a)}
      {item(C.red, true, RECEIPTS.killers, b)}
    </div>
  );
};
