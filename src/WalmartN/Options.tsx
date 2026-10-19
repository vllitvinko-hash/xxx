import React from "react";
import { AbsoluteFill } from "remotion";
import {
  B,
  Backdrop,
  Check,
  Display,
  Label,
  ThemeProvider,
  useT,
} from "./Theme";

// Варианты кадра «говорят / покупают» (9–11 с) — на согласование.
const Shell: React.FC<{ tag: string; children: React.ReactNode }> = ({
  tag,
  children,
}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <Backdrop />
      {children}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 30,
          fontFamily: t.mono,
          fontWeight: 700,
          fontSize: 40,
          color: t.accent,
        }}
      >
        {tag}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 920,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#111",
            color: "#fff",
            padding: "16px 30px",
            fontFamily: t.body,
            fontWeight: 800,
            fontSize: 40,
          }}
        >
          …а из того, что они <span style={{ color: t.beer }}>покупают.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// А: слова покупателя против его чека — пиво «всплывает»
const A: React.FC = () => {
  const t = useT();
  return (
    <Shell tag="ВАРИАНТ А">
      <div style={{ position: "absolute", left: 110, top: 120, width: 760 }}>
        <Label>Говорит покупатель</Label>
        <div
          style={{
            marginTop: 26,
            background: t.surface,
            border: "3px solid #111",
            padding: "34px 40px",
            position: "relative",
          }}
        >
          <Display size={92}>«Я зашёл только за подгузниками»</Display>
          <div
            style={{
              position: "absolute",
              left: 60,
              bottom: -36,
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderTop: "36px solid #111",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 930,
          top: 300,
          fontFamily: t.display,
          fontWeight: 900,
          fontSize: 200,
          color: t.ink,
        }}
      >
        ≠
      </div>
      <div style={{ position: "absolute", left: 1150, top: 110 }}>
        <Label>Его чек</Label>
      </div>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Check
          x={1150}
          y={170}
          w={520}
          rows={["Подгузники", "Салфетки", "Пиво ×6", "Чипсы"]}
          hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
          head="ПТ · 19:42"
          s={1.15}
        />
        </svg>
      <div
        style={{
          position: "absolute",
          left: 1150,
          top: 640,
          fontFamily: t.body,
          fontWeight: 900,
          fontSize: 34,
          color: t.ink,
          background: t.beer,
          padding: "8px 16px",
        }}
      >
        ↑ пиво — об этом он не сказал
      </div>
    </Shell>
  );
};

// Б: «СЛОВА» гаснут, «ЧЕК» крупнее — без зачёркивания, иерархией
const Bv: React.FC = () => {
  const t = useT();
  return (
    <Shell tag="ВАРИАНТ Б">
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 150,
          width: 700,
          opacity: 0.35,
        }}
      >
        <Label>Слова</Label>
        <Display size={84} style={{ marginTop: 20 }}>
          {"«Покупаю\nтолько\nдля ребёнка»"}
        </Display>
      </div>
      <div style={{ position: "absolute", left: 800, top: 100 }}>
        <Label color={t.ink}>Поступки</Label>
        <Display size={150} style={{ marginTop: 10 }}>
          Чек <B>не врёт</B>
        </Display>
      </div>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <Check
          x={820}
          y={360}
          w={480}
          rows={["Подгузники", "Пиво ×6", "Чипсы"]}
          hi={{ Подгузники: "diaper", "Пиво ×6": "beer" }}
          head="ПТ · 19:42"
          r={-3}
        />
        <Check
          x={1360}
          y={400}
          w={420}
          rows={["Подгузники", "Пиво ×4", "Орешки"]}
          hi={{ Подгузники: "diaper", "Пиво ×4": "beer" }}
          head="ПТ · 20:05"
          r={3}
        />
      </svg>
    </Shell>
  );
};

// В: опрос «что купите?» → ответы; рядом то, что видно в чеках
const C: React.FC = () => {
  const t = useT();
  const bar = (label: string, w: number, color: string, txt = "#fff") => (
    <div
      style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}
    >
      <div style={{ width: w, height: 56, background: color }} />
      <div
        style={{
          fontFamily: t.body,
          fontWeight: 800,
          fontSize: 32,
          color: txt === "#fff" ? t.ink : txt,
        }}
      >
        {label}
      </div>
    </div>
  );
  return (
    <Shell tag="ВАРИАНТ В">
      <div style={{ position: "absolute", left: 110, top: 110, width: 780 }}>
        <Label>Что говорят в опросе</Label>
        <div
          style={{
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 30,
            color: t.muted,
            marginTop: 14,
          }}
        >
          «Что берёте вместе с подгузниками?»
        </div>
        {bar("салфетки", 420, t.dim)}
        {bar("детское питание", 300, t.dim)}
        {bar("пиво", 8, t.dim)}
      </div>
      <div style={{ position: "absolute", left: 1010, top: 110, width: 800 }}>
        <Label color={t.ink}>Что видно в чеках</Label>
        <div
          style={{
            fontFamily: t.body,
            fontWeight: 700,
            fontSize: 30,
            color: t.muted,
            marginTop: 14,
          }}
        >
          чеки с подгузниками, пятница вечер
        </div>
        {bar("салфетки", 380, t.diaper)}
        {bar("детское питание", 260, t.diaper)}
        {bar("пиво", 520, t.beer, t.ink)}
      </div>
      <div style={{ position: "absolute", left: 1010, top: 560 }}>
        <Display size={96}>
          Разница — <B>в чеках</B>
        </Display>
      </div>
    </Shell>
  );
};

export const OptA: React.FC = () => (
  <ThemeProvider id="swiss">
    <A />
  </ThemeProvider>
);
export const OptB: React.FC = () => (
  <ThemeProvider id="swiss">
    <Bv />
  </ThemeProvider>
);
export const OptC: React.FC = () => (
  <ThemeProvider id="swiss">
    <C />
  </ThemeProvider>
);
