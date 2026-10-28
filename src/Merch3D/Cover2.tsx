import React from "react";
import { AbsoluteFill } from "remotion";

// Обложка «Слепые зоны мерчандайзинга» в стиле статьи: тёмный фон, крупный заголовок, чек с отделами.
const BG = "#17191B",
  Y = "#FFD23F",
  W = "#FFFFFF",
  GREY = "#B9BDC2",
  PAPER = "#F7F6F0",
  INK = "#16181A";
const SANS = "Inter, sans-serif";
const MONO = "'JetBrains Mono', monospace";

type Row = { name: string; dept?: [string, string, string]; price?: string };
// dept: подпись, цвет плашки, цвет подсветки строки
const ROWS: Row[] = [
  { name: "СОУС ТОМАТНЫЙ", dept: ["соусы", "#E5533F", "#F6DDD8"] },
  { name: "ХЛЕБ", price: "56,00" },
  { name: "МАКАРОНЫ", dept: ["бакалея", "#3B82F6", "#DCE7F5"] },
  { name: "ЙОГУРТ", price: "79,00" },
  { name: "КУРИЦА-ГРИЛЬ", dept: ["кулинария", "#16A34A", "#DAF0DF"] },
];

const Receipt: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 1250,
      top: 250,
      width: 600,
      background: PAPER,
      borderRadius: 22,
      padding: "40px 40px 44px",
      transform: "rotate(3deg)",
      boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
      fontFamily: MONO,
      color: INK,
    }}
  >
    <div style={{ textAlign: "center", fontWeight: 800, fontSize: 32 }}>
      МАГАЗИН У ДОМА
    </div>
    <div
      style={{
        textAlign: "center",
        fontSize: 22,
        color: "#7A7F85",
        marginTop: 6,
      }}
    >
      ЧЕК 004812 · 19:40
    </div>
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "22px 0 14px" }} />
    {ROWS.map((r) => (
      <div
        key={r.name}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          marginTop: 8,
          borderRadius: 10,
          background: r.dept ? r.dept[2] : "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: r.dept ? r.dept[1] : "#C9C9C9",
            }}
          />
          <span style={{ fontSize: 30, fontWeight: r.dept ? 800 : 500 }}>
            {r.name}
          </span>
        </div>
        {r.dept ? (
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 20,
              color: W,
              background: r.dept[1],
              padding: "4px 12px",
              borderRadius: 7,
            }}
          >
            {r.dept[0]}
          </span>
        ) : (
          <span style={{ fontSize: 28 }}>{r.price}</span>
        )}
      </div>
    ))}
    <div style={{ borderTop: "3px dashed #C9C6BC", margin: "20px 0 14px" }} />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 800,
        fontSize: 32,
        padding: "0 6px",
      }}
    >
      <span>ИТОГО</span>
      <span>1 318,00</span>
    </div>
  </div>
);

export const MerchCover2: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 900px 700px at 100% 0%, rgba(255,210,63,0.16), rgba(255,210,63,0) 70%), radial-gradient(ellipse 800px 600px at 0% 100%, rgba(70,110,140,0.22), rgba(70,110,140,0) 70%), ${BG}`,
    }}
  >
    <div style={{ position: "absolute", left: 120, top: 140 }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: "0.12em",
          color: Y,
        }}
      >
        ВЫКЛАДКА · ЧЕКИ · ДЕНЬГИ
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 128,
          lineHeight: 0.98,
          letterSpacing: "-0.045em",
          color: W,
          marginTop: 34,
        }}
      >
        <span style={{ color: Y }}>Слепые зоны</span>
        <br />
        мерчандайзинга
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.05,
          letterSpacing: "-0.035em",
          color: W,
          marginTop: 26,
        }}
      >
        что видно только в чеке
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          lineHeight: 1.35,
          color: GREY,
          marginTop: 56,
        }}
      >
        Полка показывает, как товар лежит.
        <br />
        Чек — что покупают вместе.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 120,
        bottom: 90,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 32,
        color: GREY,
      }}
    >
      Аналитика <span style={{ color: Y }}>ПРО</span>
    </div>
    <Receipt />
  </AbsoluteFill>
);
