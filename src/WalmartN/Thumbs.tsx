import React from "react";
import { AbsoluteFill } from "remotion";
import { Beer, Check, Diapers, ThemeProvider, useT } from "./Theme";

// Заставки-миниатюры: 3–5 слов, огромные буквы, товары крупно, чек — фирменный приём.
const GREEN = "#0E4D2E";
const YELLOW = "#FFD23F";
const INK = "#16181A";
const W = (s: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: "Inter, sans-serif",
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.045em",
  lineHeight: 0.92,
  ...s,
});

// 1: зелёный фон — «пиво рядом с подгузниками?!» + «продажи ↑»
const T1: React.FC = () => {
  useT();
  return (
    <AbsoluteFill style={{ background: GREEN }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Check
          x={1180}
          y={90}
          w={520}
          rows={["Подгузники", "Пиво ×6"]}
          hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
          head="ПТ · 19:42"
          r={6}
          s={1.25}
        />
        <rect
          x={1110}
          y={430}
          width={780}
          height={600}
          rx={40}
          fill="#F4F3EE"
        />
        <Diapers x={1330} y={740} s={1.15} r={-6} id="t1d" />
        <Beer x={1680} y={760} s={1.15} r={7} id="t1b" />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={W({ fontSize: 300, color: YELLOW })}>Пиво</div>
        <div style={W({ fontSize: 150, color: "#fff", marginTop: 14 })}>
          рядом с
        </div>
        <div style={W({ fontSize: 150, color: "#fff" })}>подгуз-</div>
        <div style={W({ fontSize: 150, color: "#fff" })}>никами?!</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          bottom: 60,
          background: YELLOW,
          padding: "14px 30px",
          ...W({ fontSize: 64, color: INK, lineHeight: 1 }),
        }}
      >
        Продажи ↑
      </div>
    </AbsoluteFill>
  );
};

// 2: светлый фон — «поставили рядом → продажи выросли», жёлтая стрелка соединяет товары
const T2: React.FC = () => {
  useT();
  return (
    <AbsoluteFill style={{ background: "#F4F3EE" }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <rect x={1100} y={0} width={820} height={1080} fill="#FFFFFF" />
        <rect x={1100} y={0} width={24} height={1080} fill={YELLOW} />
        <Diapers x={1370} y={560} s={1.4} r={-5} id="t2d" />
        <Beer x={1730} y={590} s={1.4} r={6} id="t2b" />
        <rect x={1160} y={880} width={720} height={26} fill={INK} />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 120 }}>
        <div style={W({ fontSize: 150, color: INK })}>Поставили</div>
        <div style={W({ fontSize: 150, color: INK })}>рядом —</div>
        <div style={W({ fontSize: 150, color: GREEN, marginTop: 30 })}>
          продажи
        </div>
        <div style={W({ fontSize: 150, color: GREEN })}>выросли</div>
      </div>
    </AbsoluteFill>
  );
};

// 3: жёлтый фон — огромный чек и вопрос владельцу
const T3: React.FC = () => {
  useT();
  return (
    <AbsoluteFill style={{ background: YELLOW }}>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Check
          x={1140}
          y={70}
          w={620}
          rows={["Хлеб", "Подгузники", "Пиво ×6", "Чипсы"]}
          hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
          head="ПТ · 19:42"
          r={-5}
          s={1.2}
        />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <div style={W({ fontSize: 140, color: INK })}>Что этот</div>
        <div style={W({ fontSize: 140, color: INK })}>чек знает</div>
        <div style={W({ fontSize: 140, color: INK })}>о вашем</div>
        <div
          style={{
            ...W({ fontSize: 140, color: "#fff" }),
            background: GREEN,
            display: "inline-block",
            padding: "8px 20px",
            marginTop: 10,
          }}
        >
          магазине?
        </div>
      </div>
    </AbsoluteFill>
  );
};

const wrap = (C: React.FC) => {
  const X: React.FC = () => (
    <ThemeProvider id="swiss">
      <C />
    </ThemeProvider>
  );
  return X;
};
export const Thumb1 = wrap(T1);
export const Thumb2 = wrap(T2);
export const Thumb3 = wrap(T3);
