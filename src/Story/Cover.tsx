import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, C, MONO, SANS } from "../brand";
import { Beer, Chips } from "./ScenesA";

// Обложки для Reels / VK Клипов: 1080×1920.
// Всё важное — в центральной зоне 3:4 (y 240–1680): её показывает сетка профиля.

const COVER_A = {
  kicker: "АНАЛИЗ ЧЕКОВ ДЛЯ МАГАЗИНОВ",
  lines: ["Почему он", "не купил"],
  marked: "чипсы?",
  stamp: "−₽ КАЖДЫЙ ДЕНЬ",
};

const COVER_B = {
  lines: ["Ваши чеки знают,"],
  marked: "где вы теряете",
  tail: "деньги",
  types: ["Золотые", "Скрытые", "Опасные"],
};

const Highlight: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = C.tag,
}) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        left: -16,
        right: -16,
        top: "14%",
        bottom: "2%",
        background: color,
        transform: "rotate(-1.5deg)",
      }}
    />
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);

// ---------- Вариант A: чек-интрига ----------
export const CoverA: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div
      style={{
        position: "absolute",
        top: 270,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: 3,
        color: C.green,
      }}
    >
      {COVER_A.kicker}
    </div>
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 30,
        right: 30,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 140,
        lineHeight: 1.0,
        letterSpacing: "-0.045em",
        color: C.ink,
      }}
    >
      {COVER_A.lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
      <div style={{ marginTop: 6 }}>
        <Highlight>{COVER_A.marked}</Highlight>
      </div>
    </div>

    {/* Пиво и чипсы выглядывают из-за чека */}
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 860,
        transform: "rotate(-12deg)",
      }}
    >
      <Beer scale={1.5} />
    </div>
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 900,
        transform: "rotate(10deg)",
      }}
    >
      <Chips scale={1.6} />
      <div
        style={{
          position: "absolute",
          right: -10,
          top: -40,
          width: 110,
          height: 110,
          borderRadius: 55,
          background: C.red,
          border: `5px solid ${C.ink}`,
          color: "#fff",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ?
      </div>
    </div>

    {/* Чек */}
    <div
      style={{
        position: "absolute",
        top: 830,
        left: 190,
        width: 700,
        background: C.paper,
        border: `5px solid ${C.ink}`,
        boxShadow: `16px 16px 0 ${C.ink}`,
        transform: "rotate(-3deg)",
        padding: "34px 42px 40px",
        fontFamily: MONO,
        color: C.ink,
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
        }}
      >
        МАГАЗИН У ДОМА
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 24,
          color: C.ink2,
          marginTop: 6,
        }}
      >
        ЧЕК 004812 · 19:40
      </div>
      <div style={{ borderTop: `3px dashed ${C.line}`, margin: "24px 0" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        <span>ПИВО 0,5</span>
        <span>119,00</span>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 38,
          fontWeight: 700,
          color: C.red,
          marginTop: 22,
        }}
      >
        <span
          style={{ textDecoration: "line-through", textDecorationThickness: 5 }}
        >
          ЧИПСЫ
        </span>
        <span>—</span>
        {/* «обведено маркером» */}
        <svg
          width={340}
          height={110}
          viewBox="0 0 340 110"
          style={{ position: "absolute", left: -40, top: -30 }}
        >
          <path
            d="M20 60 C 20 15, 300 5, 320 45 C 340 90, 60 105, 25 75 C 10 62, 30 40, 60 32"
            fill="none"
            stroke={C.red}
            strokeWidth={7}
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{ borderTop: `3px dashed ${C.line}`, margin: "26px 0 18px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        <span>ИТОГО</span>
        <span>119,00</span>
      </div>
    </div>

    {/* Штамп */}
    <div
      style={{
        position: "absolute",
        top: 1420,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: "rotate(-4deg)",
          background: C.red,
          color: "#fff",
          border: `6px solid ${C.ink}`,
          boxShadow: `10px 10px 0 ${C.ink}`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 66,
          padding: "16px 40px",
        }}
      >
        {COVER_A.stamp}
      </div>
    </div>
  </AbsoluteFill>
);

// ---------- Вариант B: тёмный, «связи» ----------
export const CoverB: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 2px, transparent 2px)`,
        backgroundSize: "44px 44px",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 30,
        right: 30,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 112,
        lineHeight: 1.05,
        letterSpacing: "-0.04em",
        color: C.paper,
      }}
    >
      {COVER_B.lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
      <div style={{ color: C.ink, margin: "8px 0" }}>
        <Highlight>{COVER_B.marked}</Highlight>
      </div>
      <div>{COVER_B.tail}</div>
    </div>

    {/* Разорванная связь пиво ✕ чипсы */}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path
        d="M 330 1080 Q 540 960 750 1080"
        fill="none"
        stroke={C.red}
        strokeWidth={12}
        strokeDasharray="26 20"
      />
      <text
        x={540}
        y={1058}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={110}
        fill={C.red}
      >
        ✕
      </text>
    </svg>
    <div
      style={{
        position: "absolute",
        left: 170,
        top: 900,
        transform: "rotate(-8deg)",
      }}
    >
      <Beer scale={1.5} />
    </div>
    <div
      style={{
        position: "absolute",
        right: 140,
        top: 940,
        transform: "rotate(8deg)",
      }}
    >
      <Chips scale={1.5} />
    </div>

    <div
      style={{
        position: "absolute",
        top: 1420,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 18,
      }}
    >
      {COVER_B.types.map((t, i) => (
        <span
          key={t}
          style={{
            background: [C.tag, C.paper, C.red][i],
            color: i === 2 ? "#fff" : C.ink,
            border: `4px solid ${C.paper}`,
            padding: "12px 24px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 44,
          }}
        >
          {t}
        </span>
      ))}
    </div>
  </AbsoluteFill>
);
