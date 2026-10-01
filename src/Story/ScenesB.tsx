import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrutalButton, C, Kicker, MONO, SANS, Title, clamp } from "../brand";
import {
  FINAL,
  ONLY_EXPORT,
  REPORT,
  TYPES_HEADLINE,
  TYPE_CARDS,
} from "./content";
import type { SceneProps } from "./ScenesA";

const KIND_COLOR = { gold: C.tag, hidden: C.green, danger: C.red } as const;

// ---------- Сцена 4: золотые · скрытые · опасные ----------
export const Types: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardStarts = cue.slice(1); // реплики 2–4 — по карточке на каждую
  const active = cardStarts.reduce(
    (acc, s, i) => (frame >= s - 4 ? i : acc),
    -1,
  );

  return (
    <AbsoluteFill>
      {/* Строка заголовка: активный тип подсвечен */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: "-0.02em",
        }}
      >
        {TYPES_HEADLINE.map((t, i) => {
          const s = spring({
            frame: frame - 4 - i * 6,
            fps,
            config: { damping: 12 },
          });
          const on = active === i;
          const kind = TYPE_CARDS[i].kind;
          return (
            <React.Fragment key={t}>
              {i > 0 && <span style={{ color: C.ink2, opacity: s }}>·</span>}
              <span
                style={{
                  opacity: s,
                  padding: "0 10px",
                  background: on ? KIND_COLOR[kind] : "transparent",
                  color: on && kind !== "gold" ? "#fff" : C.ink,
                  transform: `translateY(${(1 - s) * 30}px)`,
                  display: "inline-block",
                }}
              >
                {t}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* Вступление: «три вещи» */}
      {active < 0 && <Intro />}

      {TYPE_CARDS.map((card, i) => {
        const start = cardStarts[i] - 4;
        const end = i < 2 ? cardStarts[i + 1] - 4 : 100000;
        if (frame < start || frame >= end) return null;
        return (
          <TypeCard
            key={i}
            card={card}
            local={frame - start}
            last={i === 2}
            len={end - start}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 520,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 300,
          lineHeight: 1,
          color: C.ink,
          letterSpacing: "-0.05em",
          textShadow: `12px 12px 0 ${C.tag}`,
          transform: `scale(${spring({ frame: frame - 6, fps, config: { damping: 9 } })})`,
        }}
      >
        3
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {TYPE_CARDS.map((c, i) => {
          const s = spring({
            frame: frame - 20 - i * 6,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={c.kind}
              style={{
                width: 260,
                height: 300,
                background: C.paper,
                border: `4px solid ${C.ink}`,
                borderTop: `22px solid ${KIND_COLOR[c.kind]}`,
                boxShadow: `8px 8px 0 ${C.ink}`,
                opacity: s,
                transform: `translateY(${(1 - s) * 80}px) rotate(${(i - 1) * 3}deg)`,
                padding: 22,
              }}
            >
              {[0.9, 0.6, 0.8, 0.5].map((w, k) => (
                <div
                  key={k}
                  style={{
                    height: 12,
                    width: `${w * 100}%`,
                    background: C.line,
                    marginBottom: 22,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypeCard: React.FC<{
  card: (typeof TYPE_CARDS)[number];
  local: number;
  last: boolean;
  len: number;
}> = ({ card, local, last, len }) => {
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: local,
    fps,
    config: { damping: 15, mass: 0.7 },
  });
  const exit = last
    ? 0
    : interpolate(local, [len - 8, len], [0, 1], {
        ...clamp,
        easing: Easing.in(Easing.cubic),
      });
  const result = spring({ frame: local - 26, fps, config: { damping: 9 } });
  const color = KIND_COLOR[card.kind];
  const onColor = card.kind === "gold" ? C.ink : "#fff";

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 60,
        width: 960,
        transform: `translateX(${(1 - enter) * 1100 - exit * 1100}px)`,
        background: C.paper,
        border: `5px solid ${C.ink}`,
        boxShadow: `16px 16px 0 ${C.ink}`,
      }}
    >
      <div
        style={{
          background: color,
          color: onColor,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 32,
          padding: "20px 40px",
          borderBottom: `5px solid ${C.ink}`,
        }}
      >
        {card.tag}
      </div>
      <div style={{ padding: "36px 44px 44px" }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 60,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.ink,
          }}
        >
          {card.pair}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 38,
            lineHeight: 1.25,
            color: C.ink2,
            whiteSpace: "pre-line",
          }}
        >
          {card.fact}
        </div>
        <div
          style={{ borderTop: `3px dashed ${C.line}`, margin: "34px 0 28px" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              opacity: Math.min(1, result),
              transform: `scale(${interpolate(result, [0, 1], [0.6, 1])})`,
              transformOrigin: "left bottom",
            }}
          >
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 150,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: card.kind === "danger" ? C.green : C.green,
              }}
            >
              {card.result}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 36,
                color: C.ink,
                marginTop: 8,
              }}
            >
              {card.resultLabel}
            </div>
          </div>
          <div
            style={{
              border: `4px solid ${C.ink}`,
              padding: "14px 22px",
              textAlign: "center",
              fontFamily: MONO,
              background: card.kind === "danger" ? "#F6D3CF" : C.bg,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: C.ink2 }}>
              LIFT
            </div>
            <div
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: card.kind === "danger" ? C.red : C.ink,
              }}
            >
              {card.lift}
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: MONO,
            fontSize: 24,
            fontWeight: 700,
            color: C.ink2,
          }}
        >
          {card.source}
        </div>
      </div>
    </div>
  );
};

// ---------- Сцена 5: отчёт на ноутбуке ----------
export const Report: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rowsAt = cue[1] ?? 130;
  const ruleAt = cue[2] ?? 230;
  const lid = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const slide2 = interpolate(frame, [ruleAt - 6, ruleAt + 6], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  // каждая строка подсвечивается под своё слово в реплике
  const rowsLen = (cue[2] ?? rowsAt + 90) - rowsAt;
  const activeRow =
    frame >= rowsAt
      ? Math.min(2, Math.floor(((frame - rowsAt) / rowsLen) * 3))
      : -1;

  return (
    <AbsoluteFill>
      <Title text={REPORT.headline} top={170} size={70} />
      {/* Ноутбук */}
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 70,
          width: 940,
          transformOrigin: "center bottom",
          transform: `perspective(1600px) rotateX(${(1 - lid) * 70}deg)`,
        }}
      >
        <div
          style={{
            height: 640,
            background: C.ink,
            borderRadius: "26px 26px 0 0",
            padding: 24,
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              background: C.paper,
              overflow: "hidden",
            }}
          >
            {/* Слайд 1: топ-20 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "30px 34px",
                transform: `translateX(${-slide2 * 100}%)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                <span style={{ color: C.green }}>{REPORT.slideTitle}</span>
                <span style={{ color: C.ink2 }}>ПРИМЕР</span>
              </div>
              <div style={{ marginTop: 26 }}>
                {REPORT.rows.map((r, i) => {
                  const s = spring({
                    frame: frame - 14 - i * 6,
                    fps,
                    config: { damping: 14 },
                  });
                  const on = activeRow === i;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        padding: "18px 16px",
                        marginBottom: 12,
                        border: `3px solid ${on ? C.ink : C.line}`,
                        background: on ? C.tag : C.paper,
                        opacity: s,
                        transform: `translateX(${(1 - s) * 60}px) scale(${on ? 1.03 : 1})`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO,
                          fontWeight: 700,
                          fontSize: 26,
                          color: C.ink2,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontWeight: 700,
                          fontSize: 20,
                          background: i === 2 ? C.red : C.ink,
                          color: "#fff",
                          padding: "4px 10px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.action}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontFamily: SANS,
                          fontWeight: 700,
                          fontSize: 30,
                          color: C.ink,
                        }}
                      >
                        {r.text}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontWeight: 700,
                          fontSize: 24,
                          color: C.ink2,
                        }}
                      >
                        LIFT {r.lift}
                      </span>
                    </div>
                  );
                })}
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 26,
                    color: C.ink2,
                    marginTop: 18,
                    paddingLeft: 16,
                  }}
                >
                  {REPORT.more}
                </div>
              </div>
            </div>
            {/* Слайд 2: правило с метриками */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "30px 34px",
                transform: `translateX(${(1 - slide2) * 100}%)`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 24,
                  color: C.green,
                }}
              >
                ПРАВИЛО 01
              </div>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 46,
                  color: C.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                {REPORT.rule.title}
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
                {REPORT.rule.metrics.map((m) => (
                  <div
                    key={m.name}
                    style={{
                      flex: 1,
                      border: `3px solid ${C.ink}`,
                      padding: "16px 18px",
                      background: m.name === "LIFT" ? C.tag : C.paper,
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
                      {m.value}
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontWeight: 700,
                        fontSize: 20,
                        color: C.ink2,
                      }}
                    >
                      {m.name}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 30,
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: 1.3,
                  color: C.ink,
                  whiteSpace: "pre-line",
                }}
              >
                {REPORT.rule.explain}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            height: 34,
            margin: "0 -40px",
            background: "#C9C7BF",
            border: `4px solid ${C.ink}`,
            borderRadius: "0 0 30px 30px",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 6: только выгрузка чеков ----------
export const OnlyExport: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chipsAt = cue[1] ?? 130;
  const file = spring({ frame: frame - 70, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <Title text={ONLY_EXPORT.headline} top={190} size={72} />
      {/* Чего не нужно */}
      <div style={{ position: "absolute", top: 380, left: 90, right: 90 }}>
        {ONLY_EXPORT.crossed.map((t, i) => {
          const s = spring({
            frame: frame - 4 - i * 8,
            fps,
            config: { damping: 14 },
          });
          const strike = interpolate(
            frame,
            [14 + i * 10, 26 + i * 10],
            [0, 1],
            clamp,
          );
          return (
            <div
              key={t}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: 20,
                opacity: s,
                transform: `translateX(${(1 - s) * -80}px)`,
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 50,
                color: C.ink2,
              }}
            >
              <span
                style={{
                  width: 64,
                  height: 64,
                  background: C.red,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `4px solid ${C.ink}`,
                  fontSize: 40,
                }}
              >
                ✕
              </span>
              <span style={{ position: "relative" }}>
                {t}
                <span
                  style={{
                    position: "absolute",
                    left: -6,
                    top: "52%",
                    height: 6,
                    width: `calc(${strike * 100}% + 12px)`,
                    background: C.red,
                  }}
                />
              </span>
            </div>
          );
        })}
      </div>

      {/* Файл выгрузки */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 150,
          width: 780,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          boxShadow: `14px 14px 0 ${C.ink}`,
          opacity: file,
          transform: `scale(${interpolate(file, [0, 1], [0.7, 1])}) rotate(-1.5deg)`,
        }}
      >
        <div
          style={{
            background: C.green,
            color: "#fff",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 32,
            padding: "14px 26px",
            borderBottom: `5px solid ${C.ink}`,
          }}
        >
          ▤ {ONLY_EXPORT.file}
        </div>
        <div
          style={{ padding: "14px 26px 20px", fontFamily: MONO, fontSize: 32 }}
        >
          <div
            style={{
              display: "flex",
              color: C.ink2,
              fontWeight: 700,
              paddingBottom: 8,
              borderBottom: `3px dashed ${C.line}`,
            }}
          >
            <span style={{ width: 230 }}>чек</span>
            <span>товар</span>
          </div>
          {ONLY_EXPORT.rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "8px 0",
                color: C.ink,
                opacity: interpolate(
                  frame,
                  [80 + i * 5, 86 + i * 5],
                  [0, 1],
                  clamp,
                ),
              }}
            >
              <span style={{ width: 230 }}>{r[0]}</span>
              <span>{r[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Разово · быстро · понятно */}
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {ONLY_EXPORT.chips.map((t, i) => {
          const s = spring({
            frame: frame - chipsAt - i * 10,
            fps,
            config: { damping: 9 },
          });
          return (
            <span
              key={t}
              style={{
                background: C.tag,
                border: `4px solid ${C.ink}`,
                boxShadow: `6px 6px 0 ${C.ink}`,
                padding: "14px 28px",
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 42,
                color: C.ink,
                transform: `scale(${s})`,
              }}
            >
              {t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 7: финал ----------
export const Final: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 10], [0, 1], clamp);
  const btn = spring({ frame: frame - 30, fps, config: { damping: 9 } });
  const pulse = frame > 60 ? 1 + Math.sin((frame - 60) / 5) * 0.025 : 1;
  const contacts = spring({ frame: frame - 48, fps, config: { damping: 14 } });
  const arrow = frame > 130 ? Math.sin((frame - 130) / 4) * 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity: bg }}>
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 54,
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
      <Kicker text={FINAL.kicker} top={360} color={C.tag} />
      <Title
        text={FINAL.title}
        top={430}
        size={96}
        color={C.paper}
        weight={900}
        delay={4}
      />
      <Title
        text={FINAL.sub}
        top={690}
        size={44}
        color="rgba(255,255,255,0.75)"
        weight={700}
        delay={14}
      />
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BrutalButton text={FINAL.site} scale={btn * pulse} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: contacts,
          transform: `translateY(${(1 - contacts) * 30}px)`,
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.85)",
          whiteSpace: "pre",
        }}
      >
        <div>{FINAL.telegram}</div>
        <div>{FINAL.email}</div>
        <div
          style={{
            marginTop: 20,
            color: C.tag,
            fontWeight: 700,
            fontSize: 44,
            transform: `translateY(${arrow}px)`,
          }}
        >
          {FINAL.arrow}
        </div>
      </div>
    </AbsoluteFill>
  );
};
