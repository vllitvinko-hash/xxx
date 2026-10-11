import QRCode from "qrcode";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, Kicker, MONO, SANS, Title, clamp } from "../brand";
import { CHANNEL, NAMES, NEXT_LEVEL, OWNER } from "./content";
import { SEPIA, SERIF, SceneProps } from "./ScenesA";

// ---------- Сцена 5: Парето? Джуран! ----------
const PersonCard: React.FC<{
  top: number;
  data: typeof NAMES.pareto;
  color: string;
  enter: number;
  sticker: string;
  stickerOn: number;
  stickerColor: string;
}> = ({ top, data, color, enter, sticker, stickerOn, stickerColor }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 70,
      width: 940,
      height: 270,
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 40px",
      background: C.paper,
      border: `5px solid ${C.ink}`,
      boxShadow: `12px 12px 0 ${C.ink}`,
      opacity: enter,
      transform: `translateX(${(1 - enter) * 600}px)`,
    }}
  >
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 85,
        flexShrink: 0,
        background: color,
        border: `5px solid ${C.ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: 70,
        color: C.ink,
      }}
    >
      {data.initials}
    </div>
    <div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 50,
          color: C.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {data.name}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.ink2,
          marginTop: 6,
        }}
      >
        {data.years}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 32,
          lineHeight: 1.2,
          color: C.ink,
          marginTop: 12,
          whiteSpace: "pre-line",
        }}
      >
        {data.fact}
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        right: -24,
        top: -34,
        width: 110,
        height: 110,
        borderRadius: 55,
        background: stickerColor,
        border: `5px solid ${C.ink}`,
        color: "#fff",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 76,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${stickerOn}) rotate(10deg)`,
      }}
    >
      {sticker}
    </div>
  </div>
);

export const Names: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [c0 = 0, c1 = 90, c2 = 160, c3 = 240] = cue;
  const pareto = spring({
    frame: frame - c0 - 4,
    fps,
    config: { damping: 14 },
  });
  const juran = spring({ frame: frame - c1, fps, config: { damping: 14 } });
  const qMark = spring({ frame: frame - c1 - 10, fps, config: { damping: 8 } });
  const exMark = spring({
    frame: frame - c1 - 18,
    fps,
    config: { damping: 8 },
  });
  const clip = spring({ frame: frame - c2, fps, config: { damping: 12 } });
  const strike = interpolate(frame, [c3 + 20, c3 + 34], [0, 1], clamp);
  const notJuran = spring({ frame: frame - c3, fps, config: { damping: 13 } });
  const [q, ex] = NAMES.headline.split(" ");

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
          fontSize: 96,
          letterSpacing: "-0.03em",
          color: C.ink,
        }}
      >
        <span style={{ opacity: pareto }}>{q}</span>{" "}
        <span
          style={{
            display: "inline-block",
            background: C.tag,
            padding: "0 14px",
            transform: `scale(${exMark})`,
          }}
        >
          {ex}
        </span>
      </div>
      <PersonCard
        top={380}
        data={NAMES.pareto}
        color="#E4E2DA"
        enter={pareto}
        sticker="?"
        stickerOn={qMark}
        stickerColor={C.ink2}
      />
      <PersonCard
        top={700}
        data={NAMES.juran}
        color={C.tag}
        enter={juran}
        sticker="!"
        stickerOn={exMark}
        stickerColor={C.red}
      />
      {/* газетная вырезка Mea Culpa */}
      <div
        style={{
          position: "absolute",
          top: 1020,
          left: 110,
          width: 860,
          background: SEPIA.paper,
          border: `4px solid ${C.ink}`,
          padding: "18px 28px",
          transform: `rotate(-2deg) translateY(${(1 - clip) * 200}px)`,
          opacity: clip,
          color: "#2B1E10",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1.1,
          }}
        >
          {NAMES.clipping}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 24,
            marginTop: 8,
            color: SEPIA.dark,
          }}
        >
          {NAMES.clippingYear}
        </div>
      </div>
      {/* «принцип Джурана» — зачёркнуто */}
      <div
        style={{
          position: "absolute",
          top: 1230,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: notJuran,
        }}
      >
        <span
          style={{
            position: "relative",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 54,
            color: C.ink2,
          }}
        >
          {NAMES.notJuran}
          <span
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              height: 8,
              width: `calc(${strike * 100}% + 20px)`,
              background: C.red,
            }}
          />
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 6: A — никогда не кончаются ----------
const SHELF_Y = [570, 810, 1050];
const SHELF_LEFT = 90;
const SHELF_W = 900;

const Item: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, color, label, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - h,
      width: w,
      height: h,
      background: color,
      border: `4px solid ${C.ink}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: 44,
      color: C.ink,
      ...style,
    }}
  >
    {label}
  </div>
);

export const Owner: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, c1 = 50, c2 = 130, c3 = 200] = cue;
  const eye = interpolate(frame, [c1, c1 + 12], [0, 1], clamp);
  const gone = interpolate(frame, [c2, c2 + 10], [1, 0], clamp);
  const oos = spring({ frame: frame - c2 - 8, fps, config: { damping: 9 } });
  const cut = interpolate(frame, [c3 + 6, c3 + 20], [0, 1], clamp);

  const aItems = [0, 1, 2, 3, 4];
  const missing = 2;

  return (
    <AbsoluteFill>
      <Title text={OWNER.headline} top={150} size={72} />
      {/* стеллаж */}
      <div
        style={{
          position: "absolute",
          left: SHELF_LEFT - 20,
          top: SHELF_Y[0] - 220,
          width: SHELF_W + 40,
          height: SHELF_Y[2] - SHELF_Y[0] + 250,
          border: `5px solid ${C.ink}`,
          background: C.paper,
        }}
      />
      {SHELF_Y.map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: SHELF_LEFT - 20,
            top: y,
            width: SHELF_W + 40,
            height: 18,
            background: i === 1 ? (eye > 0.5 ? C.tag : C.shelf) : C.shelf,
            borderTop: `5px solid ${C.ink}`,
            borderBottom: `5px solid ${C.ink}`,
          }}
        />
      ))}
      {/* верх: группа B */}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Item
          key={k}
          x={SHELF_LEFT + 20 + k * 145}
          y={SHELF_Y[0]}
          w={120}
          h={150}
          color={C.bg}
          label="B"
        />
      ))}
      {/* уровень глаз: группа A */}
      {aItems.map((k) => {
        const isMissing = k === missing;
        return (
          <Item
            key={k}
            x={SHELF_LEFT + 30 + k * 175}
            y={SHELF_Y[1]}
            w={150}
            h={190}
            color={C.tag}
            label="A"
            style={{
              opacity: isMissing ? gone : 1,
              transform: `scale(${1 + eye * 0.04})`,
              boxShadow: eye > 0.5 ? `6px 6px 0 ${C.ink}` : "none",
            }}
          />
        );
      })}
      {/* пустое место — нет в наличии */}
      {frame >= c2 && (
        <div
          style={{
            position: "absolute",
            left: SHELF_LEFT + 30 + missing * 175,
            top: SHELF_Y[1] - 190,
            width: 150,
            height: 190,
            border: `5px dashed ${C.red}`,
            opacity: 1 - gone,
          }}
        />
      )}
      {frame >= c2 + 8 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: SHELF_Y[1] - 150,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              transform: `rotate(-6deg) scale(${interpolate(oos, [0, 1], [2, 1])})`,
              opacity: Math.min(1, oos),
              background: C.red,
              color: "#fff",
              border: `5px solid ${C.ink}`,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 44,
              padding: "10px 26px",
            }}
          >
            {OWNER.outOfStock} {OWNER.loss}
          </div>
        </div>
      )}
      {/* метка «на уровне глаз» */}
      <div
        style={{
          position: "absolute",
          left: SHELF_LEFT,
          top: SHELF_Y[1] + 30,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          color: C.green,
          opacity: eye,
        }}
      >
        ▲ {OWNER.goldShelf}
      </div>
      {/* низ: группа C — на сокращение */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <Item
          key={k}
          x={SHELF_LEFT + 15 + k * 110}
          y={SHELF_Y[2]}
          w={95}
          h={110}
          color={C.shelf}
          label="C"
          style={{ fontSize: 34, opacity: k % 2 ? 1 - cut * 0.75 : 1 }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: SHELF_LEFT - 10,
          top: SHELF_Y[2] - 60,
          height: 7,
          width: (SHELF_W + 20) * cut,
          background: C.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: SHELF_Y[2] + 50,
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 34,
          color: C.red,
          opacity: cut,
        }}
      >
        ✂ C — {OWNER.cut}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Сцена 7: что продаётся → с чем продаётся ----------
const CENTER = { x: 540, y: 820 };
const COMP_POS = [
  { x: 230, y: 600 },
  { x: 850, y: 620 },
  { x: 540, y: 1090 },
];

export const NextLevel: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [, c1 = 80, c2 = 170] = cue;
  const toLinks = interpolate(frame, [c1 - 6, c1 + 10], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const [what, withWhat] = NEXT_LEVEL.headline.split("\n");
  const mark = interpolate(frame, [c1, c1 + 16], [0, 1], clamp);
  const growth = spring({ frame: frame - c2, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          color: C.ink,
        }}
      >
        <div style={{ opacity: 1 - toLinks * 0.55 }}>{what}</div>
        <div>
          <span
            style={{
              backgroundImage: `linear-gradient(${C.tag}, ${C.tag})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${mark * 100}% 80%`,
              backgroundPosition: "0 70%",
              padding: "0 10px",
              opacity: 0.3 + mark * 0.7,
            }}
          >
            {withWhat}
          </span>
        </div>
      </div>

      {/* Фаза 1: рейтинг продаж */}
      {toLinks < 1 && (
        <div
          style={{
            position: "absolute",
            top: 440,
            left: 120,
            right: 120,
            opacity: 1 - toLinks,
            transform: `translateX(${-toLinks * 300}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 28,
              color: C.ink2,
              marginBottom: 20,
            }}
          >
            {NEXT_LEVEL.left}
          </div>
          {NEXT_LEVEL.ranking.map((r, i) => {
            const s = spring({
              frame: frame - 6 - i * 5,
              fps,
              config: { damping: 14 },
            });
            const w = [1, 0.82, 0.66, 0.55][i];
            return (
              <div key={r} style={{ marginBottom: 22, opacity: s }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    height: 92,
                    width: `${w * 100 * s}%`,
                    background: i === 0 ? C.tag : C.paper,
                    border: `4px solid ${C.ink}`,
                    padding: "0 24px",
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 40,
                    color: C.ink,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{ fontFamily: MONO, fontSize: 28, color: C.ink2 }}
                  >
                    {i + 1}
                  </span>
                  {r}
                  {i < 2 && (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: C.ink,
                        color: C.tag,
                        fontFamily: MONO,
                        fontSize: 26,
                        padding: "2px 12px",
                      }}
                    >
                      A
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Фаза 2: с чем продаётся товар A */}
      {toLinks > 0 && (
        <AbsoluteFill style={{ opacity: toLinks }}>
          <svg
            width={1080}
            height={1920}
            style={{ position: "absolute", inset: 0 }}
          >
            {COMP_POS.map((p, i) => {
              const d = interpolate(
                frame,
                [c1 + 8 + i * 6, c1 + 24 + i * 6],
                [0, 1],
                clamp,
              );
              return (
                <line
                  key={i}
                  x1={CENTER.x}
                  y1={CENTER.y}
                  x2={p.x}
                  y2={p.y}
                  stroke={C.green}
                  strokeWidth={12}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - d}
                />
              );
            })}
          </svg>
          {COMP_POS.map((p, i) => {
            const s = spring({
              frame: frame - c1 - 18 - i * 6,
              fps,
              config: { damping: 12 },
            });
            return (
              <Chip
                key={i}
                x={p.x}
                y={p.y}
                scale={s}
                label={NEXT_LEVEL.companions[i]}
              />
            );
          })}
          <Chip
            x={CENTER.x}
            y={CENTER.y}
            scale={1}
            label={NEXT_LEVEL.center}
            main
          />
          {/* рост среднего чека */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1230,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: `scale(${growth})`,
                background: C.green,
                color: "#fff",
                border: `5px solid ${C.ink}`,
                boxShadow: `8px 8px 0 ${C.ink}`,
                padding: "14px 34px",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 52,
              }}
            >
              {NEXT_LEVEL.growth}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Chip: React.FC<{
  x: number;
  y: number;
  scale: number;
  label: string;
  main?: boolean;
}> = ({ x, y, scale, label, main }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      background: main ? C.tag : C.paper,
      border: `5px solid ${C.ink}`,
      boxShadow: `8px 8px 0 ${C.ink}`,
      padding: main ? "24px 40px" : "16px 30px",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: main ? 52 : 42,
      color: C.ink,
      whiteSpace: "nowrap",
    }}
  >
    {main && (
      <span
        style={{
          background: C.ink,
          color: C.tag,
          fontFamily: MONO,
          fontSize: 30,
          padding: "2px 12px",
          marginRight: 16,
          verticalAlign: "middle",
        }}
      >
        A
      </span>
    )}
    {label}
  </div>
);

// ---------- Сцена 8: канал ----------
const qr = QRCode.create(CHANNEL.url, { errorCorrectionLevel: "M" });

const QR: React.FC<{ size: number }> = ({ size }) => {
  const n = qr.modules.size;
  const quiet = 2;
  const cell = size / (n + quiet * 2);
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={(c + quiet) * cell}
            y={(r + quiet) * cell}
            width={cell + 0.5}
            height={cell + 0.5}
            fill={C.ink}
          />,
        );
      }
    }
  }
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <rect width={size} height={size} fill="#fff" />
      {rects}
    </svg>
  );
};

export const Channel: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 10], [0, 1], clamp);
  const code = spring({ frame: frame - 24, fps, config: { damping: 11 } });
  const arrow = frame > 70 ? Math.sin((frame - 70) / 4) * 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity: bg }}>
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 48,
          color: C.paper,
        }}
      >
        Аналитика{" "}
        <span
          style={{
            background: C.tag,
            color: C.ink,
            padding: "2px 14px",
            border: `3px solid ${C.paper}`,
          }}
        >
          ПРО
        </span>
      </div>
      <Kicker text={CHANNEL.kicker} top={290} color={C.tag} />
      <Title
        text={CHANNEL.headline}
        top={350}
        size={78}
        color={C.paper}
        weight={900}
        delay={4}
      />
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: 18,
            background: "#fff",
            border: `6px solid ${C.tag}`,
            boxShadow: `14px 14px 0 ${C.tag}`,
            transform: `scale(${code}) rotate(${(1 - code) * -8}deg)`,
          }}
        >
          <QR size={420} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1110,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: code,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 52,
            color: C.tag,
          }}
        >
          {CHANNEL.handle}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 36,
            color: "rgba(255,255,255,0.8)",
            marginTop: 10,
          }}
        >
          {CHANNEL.sub}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 40,
            color: C.tag,
            marginTop: 26,
            transform: `translateY(${arrow}px)`,
          }}
        >
          {CHANNEL.arrow}
        </div>
      </div>
    </AbsoluteFill>
  );
};
