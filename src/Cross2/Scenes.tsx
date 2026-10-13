import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../brand";
import { SceneProps } from "../Abc/ScenesA";
import { F, FlatCroissant, FlatMuffin } from "../Refs/Refs";
import {
  Bubble,
  Box,
  Cafe,
  Cyl,
  Person,
  Tag,
  Toy,
  makeIso,
  pp,
} from "../Refs/Refs2";
import { CHEAT } from "../Cross/content";

// Ролик «Кросс-продажи» в стиле «плоская иллюстрация + изометрия».
const SANS = "Inter, sans-serif";

const useSp = (at: number, damping = 13, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass } });
};

// появление элемента SVG: масштаб от точки привязки
const Pop: React.FC<{
  s: number;
  x: number;
  y: number;
  children: React.ReactNode;
}> = ({ s, x, y, children }) => (
  <g
    transform={`translate(${x} ${y}) scale(${Math.max(0.001, s)}) translate(${-x} ${-y})`}
    opacity={Math.min(1, s * 1.5)}
  >
    {children}
  </g>
);

// плашка с номером правила
const RuleChip: React.FC<{ n: number; text: string }> = ({ n, text }) => {
  const s = useSp(2, 12);
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 60,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 30px 14px 14px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: "0 14px 30px rgba(36,59,85,0.18)",
        transform: `translateX(${(1 - s) * -400}px)`,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 46,
        color: F.navy,
        zIndex: 5,
      }}
    >
      <span
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          background: F.mustard,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </span>
      {text}
    </div>
  );
};

const Pill: React.FC<{
  text: string;
  bg: string;
  fg?: string;
  size?: number;
  s: number;
  rotate?: number;
}> = ({ text, bg, fg = F.navy, size = 54, s, rotate = -4 }) => (
  <div
    style={{
      transform: `scale(${s}) rotate(${rotate}deg)`,
      background: bg,
      color: fg,
      borderRadius: 999,
      padding: "14px 40px",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      boxShadow: "0 14px 30px rgba(36,59,85,0.2)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

// лёгкое «дыхание» персонажей
const useBreath = (phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / 18 + phase) * 4;
};

// витрина с выпечкой на прилавке кафе
const CafeCounter: React.FC<{ dimMuffin?: number; ring?: number }> = ({
  dimMuffin = 0,
  ring = 0,
}) => (
  <>
    <rect x={60} y={900} width={190} height={230} rx={20} fill="#9AA5B1" />
    <rect x={80} y={930} width={150} height={60} rx={10} fill={F.navy} />
    <circle cx={155} cy={1060} r={22} fill={F.navy} />
    <rect x={0} y={1130} width={1080} height={40} fill={F.wood} />
    <rect x={0} y={1170} width={1080} height={750} fill={F.navy} />
    {[0, 1, 2, 3, 4].map((k) => (
      <rect
        key={k}
        x={40 + k * 210}
        y={1230}
        width={170}
        height={600}
        rx={14}
        fill="#2C4766"
      />
    ))}
    <rect
      x={300}
      y={950}
      width={440}
      height={180}
      rx={20}
      fill="#DDF2F0"
      opacity={0.85}
    />
    <FlatCroissant x={420} y={1080} s={0.9} />
    <g opacity={1 - dimMuffin * 0.6}>
      <FlatMuffin x={630} y={1050} s={0.8} />
    </g>
    {ring > 0 && (
      <circle
        cx={420}
        cy={1050}
        r={110}
        fill="none"
        stroke={F.mustard}
        strokeWidth={12}
        strokeDasharray={`${ring * 700} 700`}
        transform="rotate(-90 420 1050)"
      />
    )}
    {/* кофе */}
    <g transform="translate(830 1060)">
      <path d="M -50 -40 L 50 -40 L 40 60 L -40 60 Z" fill="#fff" />
      <rect x={-50} y={-10} width={100} height={30} fill={F.coral} />
      <path
        d="M 50 -20 Q 86 -10 50 30"
        stroke="#fff"
        strokeWidth={14}
        fill="none"
      />
    </g>
  </>
);

// ---------- 0. Касса: «Что-нибудь ещё?» — «Нет.» ----------
export const S0Checkout: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 60, c2 = 120] = cue;
  const ask = interpolate(frame, [0, 6], [0.9, 1], clamp); // видна с первого кадра
  const walk = useSp(4, 16);
  const no = useSp(18, 9);
  const cross = interpolate(frame, [c1 - 8, c1 + 8], [0, 1], clamp);
  const save = useSp(c2, 10);
  const b = useBreath();
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <svg width={1080} height={1920}>
        <Cafe />
        <g transform={`translate(0 ${b * 0.5})`}>
          <Person
            x={300}
            y={640}
            s={1.25}
            skin={F.skin2}
            hair={F.hair}
            hairStyle="bun"
            top="#F7F3EE"
            apron={F.teal}
            pose="relaxed"
          />
        </g>
        <CafeCounter />
        <g transform={`translate(${(1 - walk) * 500} ${b})`}>
          <Person
            x={810}
            y={1230}
            s={1.6}
            skin={F.skin1}
            hair="#6B3B23"
            hairStyle="short"
            top="#5C7CFA"
            pose="crossed"
            mood="bored"
            flip
          />
        </g>
        <Pop s={ask} x={120} y={560}>
          <Bubble x={60} y={420} w={560} lines={["Что-нибудь ещё?"]} />
        </Pop>
        {cross > 0 && (
          <line
            x1={90}
            y1={500}
            x2={90 + 500 * cross}
            y2={500 - 20 * cross}
            stroke={F.coral}
            strokeWidth={14}
            strokeLinecap="round"
          />
        )}
        <Pop s={no} x={900} y={1010}>
          <Bubble
            x={640}
            y={880}
            w={300}
            lines={["Нет."]}
            color={F.coral}
            text="#fff"
            tail="right"
          />
        </Pop>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pill text="🔖 Сохрани, пригодится" bg={F.mustard} s={save} size={56} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 1. Нарезка пар ----------
const Scissors: React.FC = () => (
  <g>
    <circle
      cx={-30}
      cy={40}
      r={22}
      fill="none"
      stroke={F.coral}
      strokeWidth={12}
    />
    <circle
      cx={30}
      cy={40}
      r={22}
      fill="none"
      stroke={F.coral}
      strokeWidth={12}
    />
    <path
      d="M -16 22 L 30 -60 M 16 22 L -30 -60"
      stroke="#9AA5B1"
      strokeWidth={14}
      strokeLinecap="round"
    />
  </g>
);
const Jar: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <rect x={-36} y={-40} width={72} height={90} rx={16} fill={color} />
    <rect x={-30} y={-62} width={60} height={26} rx={8} fill={F.navy} />
    <rect
      x={-22}
      y={-10}
      width={44}
      height={30}
      rx={6}
      fill="#fff"
      opacity={0.7}
    />
  </g>
);
const OilCan: React.FC = () => (
  <g>
    <rect x={-44} y={-50} width={88} height={110} rx={12} fill={F.mustard} />
    <rect x={10} y={-74} width={26} height={26} rx={6} fill={F.navy} />
    <rect
      x={-30}
      y={-20}
      width={60}
      height={40}
      rx={6}
      fill="#fff"
      opacity={0.8}
    />
  </g>
);
const Filter: React.FC = () => (
  <g>
    <rect x={-40} y={-50} width={80} height={100} rx={18} fill="#5C7CFA" />
    {[-30, -10, 10, 30].map((y) => (
      <line
        key={y}
        x1={-40}
        y1={y}
        x2={40}
        y2={y}
        stroke="#3F5BD8"
        strokeWidth={6}
      />
    ))}
  </g>
);
const Battery: React.FC = () => (
  <g>
    <rect x={-26} y={-60} width={52} height={120} rx={10} fill={F.teal} />
    <rect x={-12} y={-72} width={24} height={14} rx={4} fill={F.navy} />
    <path d="M 4 -30 L -12 6 L 2 6 L -6 34 L 14 -4 L 0 -4 Z" fill="#fff" />
  </g>
);
const Cup: React.FC = () => (
  <g>
    <path d="M -50 -40 L 50 -40 L 40 60 L -40 60 Z" fill="#fff" />
    <rect x={-50} y={-10} width={100} height={30} fill={F.coral} />
    <path
      d="M -10 -60 Q -20 -86 0 -104"
      stroke="#C7B9AA"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

export const S1Montage: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 150, c2 = 230] = cue;
  const head = useSp(2, 12);
  const free = useSp(c2 + 8, 9);
  const cards: {
    a: React.ReactNode;
    b: React.ReactNode;
    label: string;
    bg: string;
  }[] = [
    {
      a: <Cup />,
      b: <FlatCroissant x={0} y={20} s={0.9} />,
      label: "кофейня",
      bg: "#FFF1DA",
    },
    {
      a: (
        <g transform="scale(0.55) translate(0 160)">
          <Toy x={0} y={0} s={1} on />
        </g>
      ),
      b: <Battery />,
      label: "игрушки",
      bg: "#E4F6F3",
    },
    {
      a: <Scissors />,
      b: <Jar color="#C8B6E2" />,
      label: "салон",
      bg: "#F3EAFB",
    },
    { a: <OilCan />, b: <Filter />, label: "автосервис", bg: "#E8EEFF" },
  ];
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.05,
          color: F.navy,
          letterSpacing: "-0.03em",
          opacity: head,
          transform: `translateY(${(1 - head) * 30}px)`,
        }}
      >
        Кросс-продажа
        <br />
        <span style={{ color: F.coral }}>= вдобавок</span>
      </div>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {cards.map((c, i) => {
          const s = spring({
            frame: frame - c0 - 10 - i * 14,
            fps: 30,
            config: { damping: 12 },
          });
          const x = 80 + (i % 2) * 470;
          const y = 380 + Math.floor(i / 2) * 450;
          const bob = Math.sin(frame / 14 + i) * 6;
          return (
            <Pop key={i} s={s} x={x + 215} y={y + 215}>
              <rect
                x={x}
                y={y + 14}
                width={430}
                height={430}
                rx={50}
                fill="rgba(36,59,85,0.12)"
              />
              <rect x={x} y={y} width={430} height={430} rx={50} fill={c.bg} />
              <g transform={`translate(${x + 120} ${y + 190 + bob})`}>{c.a}</g>
              <text
                x={x + 215}
                y={y + 210}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={900}
                fontSize={70}
                fill={F.coral}
              >
                +
              </text>
              <g transform={`translate(${x + 310} ${y + 190 - bob})`}>{c.b}</g>
              <text
                x={x + 215}
                y={y + 380}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={800}
                fontSize={38}
                fill={F.navy}
              >
                {c.label}
              </text>
            </Pop>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1285,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 16,
          opacity: interpolate(frame, [c1, c1 + 10], [0, 1], clamp),
        }}
      >
        {["кофейня", "аптека", "салон", "автосервис"].map((p) => (
          <span
            key={p}
            style={{
              background: "#fff",
              borderRadius: 999,
              padding: "8px 20px",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 30,
              color: F.teal,
            }}
          >
            ✓ {p}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 790,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pill text="0 ₽ на рекламу" bg={F.teal} fg="#fff" s={free} size={50} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. Выбор из двух ----------
export const S2Choice: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 90, c2 = 160] = cue;
  const ask = useSp(c0 + 8, 10);
  const think = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  const point = interpolate(frame, [c2, c2 + 18], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const ring = interpolate(frame, [c2 + 12, c2 + 34], [0, 1], clamp);
  const plus = useSp(c2 + 30, 9);
  const b = useBreath(1);
  // рука покупателя тянется от тела к круассану (локальные координаты, персонаж отражён)
  const target: [number, number] = [
    interpolate(point, [0, 1], [110, 250]),
    interpolate(point, [0, 1], [380, -110]),
  ];
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <svg width={1080} height={1920}>
        <Cafe />
        <g transform={`translate(0 ${b * 0.5})`}>
          <Person
            x={300}
            y={640}
            s={1.25}
            skin={F.skin2}
            hair={F.hair}
            hairStyle="bun"
            top="#F7F3EE"
            apron={F.teal}
            pose="relaxed"
            mood="happy"
          />
        </g>
        <CafeCounter dimMuffin={ring} ring={ring} />
        <g transform={`translate(0 ${b})`}>
          <Person
            x={810}
            y={1230}
            s={1.6}
            skin={F.skin1}
            hair="#6B3B23"
            hairStyle="short"
            top="#5C7CFA"
            pose="point"
            target={target}
            mood={ring > 0.5 ? "happy" : "neutral"}
            flip
          />
        </g>
        <Pop s={ask} x={120} y={600}>
          <Bubble
            x={60}
            y={400}
            w={560}
            lines={["К кофе круассан", "или маффин?"]}
          />
        </Pop>
        {think > 0 && ring < 0.2 && (
          <g opacity={think}>
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={880 + i * 40}
                cy={860}
                r={14}
                fill={F.navy}
                opacity={Math.floor(frame / 6) % 3 >= i ? 1 : 0.25}
              />
            ))}
          </g>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 790,
          left: 600,
          transform: `scale(${plus})`,
        }}
      >
        <Pill text="+1 в чеке" bg={F.mustard} s={1} size={56} />
      </div>
      <RuleChip n={1} text="Выбор из двух" />
    </AbsoluteFill>
  );
};

// ---------- 3. Без этого не работает ----------
export const S3Home: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [, c1 = 70, c2 = 150, c3 = 230] = cue;
  const inset = useSp(c1, 11);
  const list = useSp(c3, 12);
  const q = Math.sin(frame / 8) * 10;
  return (
    <AbsoluteFill style={{ background: "#E9E2F5" }}>
      <svg width={1080} height={1920}>
        <rect width={1080} height={1250} fill="#EFE8FA" />
        <rect x={620} y={220} width={340} height={420} rx={20} fill="#2D3A66" />
        <circle cx={860} cy={320} r={44} fill="#FFF3C4" />
        <rect x={612} y={420} width={356} height={14} fill="#EFE8FA" />
        <rect x={784} y={212} width={14} height={436} fill="#EFE8FA" />
        <line
          x1={150}
          y1={420}
          x2={150}
          y2={1240}
          stroke={F.navy}
          strokeWidth={10}
        />
        <path d="M 70 430 L 230 430 L 200 300 L 100 300 Z" fill={F.mustard} />
        <rect x={300} y={830} width={720} height={260} rx={50} fill="#7C6CF0" />
        <rect x={340} y={760} width={640} height={150} rx={50} fill="#9A8CF6" />
        <rect y={1250} width={1080} height={670} fill="#D8CDEF" />
        <ellipse
          cx={540}
          cy={1500}
          rx={460}
          ry={170}
          fill={F.coral}
          opacity={0.85}
        />
        <Person
          x={240}
          y={1010}
          s={1.05}
          skin={F.skin1}
          hair="#C2702E"
          hairStyle="curly"
          top={F.mustard}
          pose="relaxed"
          mood="bored"
        />
        <Toy x={560} y={1640} s={1.15} on={false} />
        <text
          x={560}
          y={1300 + q}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={120}
          fill={F.navy}
        >
          ?
        </text>
        <Pop s={inset} x={850} y={1120}>
          <g transform="translate(850 1120)">
            <circle r={190} fill="#fff" />
            <circle r={190} fill="none" stroke={F.teal} strokeWidth={12} />
            <g transform="translate(0 120) scale(0.62)">
              <Toy x={0} y={0} s={1} on />
            </g>
          </g>
        </Pop>
      </svg>
      {/* примеры и вопрос */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 60,
          width: 560,
          padding: "28px 30px",
          borderRadius: 36,
          background: "#fff",
          boxShadow: "0 18px 40px rgba(36,59,85,0.18)",
          opacity: interpolate(frame, [c2, c2 + 10], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [c2, c2 + 14], [40, 0], clamp)}px)`,
        }}
      >
        {[
          ["игрушка", "батарейки"],
          ["зарядка", "кабель"],
          ["уголь", "розжиг"],
        ].map(([a, b2]) => (
          <div
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 38,
              color: F.navy,
              marginBottom: 12,
            }}
          >
            <span style={{ width: 170 }}>{a}</span>
            <span style={{ color: F.coral }}>→</span>
            <span
              style={{
                background: "#E4F6F3",
                color: F.teal,
                borderRadius: 14,
                padding: "2px 14px",
              }}
            >
              {b2}
            </span>
          </div>
        ))}
        <div
          style={{
            marginTop: 10,
            transform: `scale(${list})`,
            transformOrigin: "left center",
            background: F.navy,
            color: "#fff",
            borderRadius: 18,
            padding: "12px 18px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 27,
            whiteSpace: "nowrap",
          }}
        >
          ТОП-20 → чего не хватит дома?
        </div>
      </div>
      <RuleChip n={2} text="Без этого не работает" />
    </AbsoluteFill>
  );
};

// ---------- 4. Полка продаёт сама (изометрия) ----------
export const S4Shelf: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 110] = cue;
  const iso = makeIso(540, 1000);
  const rise = (i: number) =>
    spring({ frame: frame - c0 - 4 - i * 2, fps: 30, config: { damping: 13 } });
  const arc = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  const tags = useSp(c1 + 10, 10);
  const fly = interpolate(frame, [c2 + 16, c2 + 46], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const shelf: [string, string, string] = ["#F3F4FF", "#C9CCF5", "#B1B5EE"];
  const white: [string, string, string] = ["#FFFFFF", "#E1E3F8", "#CDD0F2"];
  const [bx, by] = iso(220, 300, 0);
  const pasta = iso(-120, -110, 166);
  const sauce = iso(20, -70, 166);
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #EEF0FF 0%, #DCE0FF 100%)",
      }}
    >
      <svg width={1080} height={1920}>
        <polygon
          points={pp([
            iso(-500, -300, 0),
            iso(500, -300, 0),
            iso(500, 500, 0),
            iso(-500, 500, 0),
          ])}
          fill="#C9CEFA"
        />
        <Box
          iso={iso}
          x={-360}
          y={-140}
          z={0}
          w={720}
          d={120}
          h={20}
          c={shelf}
        />
        {[0, 1, 2].map((lvl) => (
          <Box
            key={lvl}
            iso={iso}
            x={-360}
            y={-140}
            z={150 + lvl * 180}
            w={720}
            d={120}
            h={16}
            c={shelf}
          />
        ))}
        <Box
          iso={iso}
          x={-360}
          y={-150}
          z={0}
          w={720}
          d={14}
          h={560}
          c={["#DADDFB", "#C3C7F4", "#AFB3EC"]}
        />
        {[-320, -230, -140, -50, 40, 130, 220].map((x, i) => (
          <Box
            key={x}
            iso={iso}
            x={x}
            y={-110}
            z={20}
            w={70}
            d={60}
            h={(100 + (i % 3) * 14) * rise(i)}
            c={white}
          />
        ))}
        {[-320, -200, -80, 40, 160, 280].map((x, i) => (
          <Box
            key={x}
            iso={iso}
            x={x}
            y={-110}
            z={346}
            w={80}
            d={60}
            h={90 * rise(i + 6)}
            c={white}
          />
        ))}
        {[0, 90, 180].map((dx, i) => (
          <Box
            key={dx}
            iso={iso}
            x={-300 + dx}
            y={-110}
            z={166}
            w={70}
            d={60}
            h={150 * rise(i + 2)}
            c={["#FFE37A", "#F5B92E", "#E09E12"]}
          />
        ))}
        {[0, 70].map((dx, i) => (
          <Cyl
            key={dx}
            iso={iso}
            x={20 + dx}
            y={-70}
            z={166}
            r={30}
            h={110 * rise(i + 4)}
            body="#F2604A"
            dark="#C8432F"
            cap="#3A2F8F"
          />
        ))}
        {[180, 260].map((dx, i) => (
          <Box
            key={dx}
            iso={iso}
            x={dx}
            y={-110}
            z={166}
            w={60}
            d={60}
            h={120 * rise(i + 8)}
            c={white}
          />
        ))}
        {(() => {
          const a = iso(-200, -40, 360);
          const b = iso(60, -40, 330);
          return (
            <path
              d={`M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${a[1] - 160} ${b[0]} ${b[1]}`}
              fill="none"
              stroke="#5B4BDB"
              strokeWidth={8}
              strokeDasharray="16 12"
              opacity={arc}
            />
          );
        })()}
        {(() => {
          const [tx, ty] = iso(-200, -40, 560);
          const [sx, sy] = iso(60, -40, 520);
          return (
            <>
              <Pop s={tags} x={tx - 40} y={ty}>
                <Tag x={tx - 40} y={ty} text="Паста" bg="#FFD84D" w={200} />
              </Pop>
              <Pop s={tags} x={sx + 60} y={sy}>
                <Tag
                  x={sx + 60}
                  y={sy}
                  text="Соус"
                  bg="#F2604A"
                  fg="#fff"
                  w={180}
                />
              </Pop>
            </>
          );
        })()}
        {/* корзина и летящие покупки */}
        <path
          d={`M ${bx - 120} ${by - 90} L ${bx + 120} ${by - 90} L ${bx + 90} ${by + 20} L ${bx - 90} ${by + 20} Z`}
          fill="#7C6CF0"
        />
        <path
          d={`M ${bx - 100} ${by - 90} Q ${bx} ${by - 240} ${bx + 100} ${by - 90}`}
          fill="none"
          stroke="#5B4BDB"
          strokeWidth={14}
        />
        {fly > 0 && (
          <>
            <rect
              x={interpolate(fly, [0, 1], [pasta[0] - 30, bx - 70])}
              y={interpolate(fly, [0, 1], [pasta[1] - 150, by - 160])}
              width={60}
              height={80}
              fill="#FFE37A"
            />
            <rect
              x={interpolate(fly, [0, 1], [sauce[0] - 25, bx + 4])}
              y={interpolate(fly, [0, 1], [sauce[1] - 110, by - 150])}
              width={50}
              height={70}
              rx={14}
              fill="#F2604A"
            />
          </>
        )}
        <path
          d={`M ${bx - 120} ${by - 90} L ${bx + 120} ${by - 90} L ${bx + 104} ${by - 40} L ${bx - 104} ${by - 40} Z`}
          fill="#6A5AE6"
          opacity={0.6}
        />
      </svg>
      <RuleChip n={3} text="Полка продаёт сама" />
    </AbsoluteFill>
  );
};

// ---------- 5. Набор на шашлык (изометрия) ----------
export const S5Bundle: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 50, c2 = 130] = cue;
  const iso = makeIso(540, 1060);
  const box = useSp(c0 + 2, 12);
  const drop = (i: number) =>
    interpolate(frame, [c0 + 16 + i * 10, c0 + 34 + i * 10], [400, 0], {
      ...clamp,
      easing: Easing.bounce,
    });
  const tags = useSp(c0 + 50, 11);
  const ribbon = useSp(c1 + 8, 10);
  const math = useSp(c2 + 4, 10);
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FFF1E6 0%, #FFE0CC 100%)",
      }}
    >
      <svg width={1080} height={1920}>
        <polygon
          points={pp([
            iso(-420, -420, 0),
            iso(420, -420, 0),
            iso(420, 420, 0),
            iso(-420, 420, 0),
          ])}
          fill="#F8D2B8"
        />
        <Pop s={box} x={540} y={1060}>
          <Box
            iso={iso}
            x={-220}
            y={-160}
            z={0}
            w={440}
            d={320}
            h={210}
            c={["#D9A06A", "#C4874E", "#A9703E"]}
          />
          <polygon
            points={pp([
              iso(-200, -140, 210),
              iso(200, -140, 210),
              iso(200, 140, 210),
              iso(-200, 140, 210),
            ])}
            fill="#7A4E2A"
          />
        </Pop>
        <g transform={`translate(0 ${-drop(0)})`}>
          <Box
            iso={iso}
            x={-180}
            y={-120}
            z={150}
            w={180}
            d={140}
            h={190}
            c={["#5B6270", "#3E4450", "#2D323C"]}
          />
        </g>
        <g transform={`translate(0 ${-drop(1)})`}>
          <Cyl
            iso={iso}
            x={70}
            y={-60}
            z={150}
            r={44}
            h={200}
            body="#F2604A"
            dark="#C8432F"
            cap="#FFD84D"
          />
        </g>
        <g transform={`translate(0 ${-drop(2)})`}>
          {[0, 1, 2].map((k) => {
            const [ax, ay] = iso(-60 + k * 40, 80, 150);
            return (
              <line
                key={k}
                x1={ax}
                y1={ay}
                x2={ax + 120}
                y2={ay - 330}
                stroke="#9AA5B1"
                strokeWidth={10}
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {(() => {
          const a = iso(-90, -50, 470);
          const b = iso(70, -60, 470);
          const c = iso(10, 80, 560);
          return (
            <g opacity={tags * (1 - math * 0.7)}>
              <Tag
                x={a[0] - 130}
                y={a[1] + 40}
                text="Уголь"
                bg="#fff"
                w={180}
              />
              <Tag
                x={b[0] + 120}
                y={b[1] + 30}
                text="Розжиг"
                bg="#fff"
                w={200}
              />
              <Tag
                x={c[0] + 40}
                y={c[1] - 150}
                text="Шампуры"
                bg="#fff"
                w={230}
              />
            </g>
          );
        })()}
        {(() => {
          const [lx, ly] = iso(0, 160, 110);
          return (
            <g transform={`translate(${lx} ${ly}) skewY(30) scale(${ribbon})`}>
              <rect
                x={-170}
                y={-40}
                width={340}
                height={80}
                rx={12}
                fill="#FFD84D"
              />
              <text
                x={0}
                y={14}
                textAnchor="middle"
                fontFamily={SANS}
                fontWeight={900}
                fontSize={34}
                fill={F.navy}
              >
                НАБОР НА ШАШЛЫК
              </text>
            </g>
          );
        })()}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1280,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 72,
          color: F.navy,
          transform: `scale(${math})`,
        }}
      >
        <span style={{ color: F.coral, textDecoration: "line-through" }}>
          3 решения
        </span>{" "}
        →{" "}
        <span
          style={{
            background: F.teal,
            color: "#fff",
            padding: "0 22px",
            borderRadius: 20,
          }}
        >
          1
        </span>
      </div>
      <RuleChip n={4} text="Имя для набора" />
    </AbsoluteFill>
  );
};

// ---------- 6. Бонус + тест пары ----------
export const S6Bonus: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 100, c2 = 170, c3 = 260] = cue;
  const iso = makeIso(700, 1380);
  const coin = useSp(c0 + 40, 9);
  const spin = Math.cos(frame / 10);
  const bar1 = interpolate(frame, [c2, c2 + 30], [0, 230], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const bar2 = interpolate(frame, [c2 + 10, c2 + 40], [0, 70], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const verdict = useSp(c3 + 8, 10);
  const dim = interpolate(frame, [c1, c1 + 20], [0, 1], clamp);
  const b = useBreath(2);
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <svg width={1080} height={1920}>
        <Cafe />
        <g transform={`translate(0 ${b * 0.5})`}>
          <Person
            x={330}
            y={600}
            s={1.3}
            skin={F.skin1}
            hair="#2A2626"
            hairStyle="long"
            top="#F7F3EE"
            apron={F.teal}
            pose="notebook"
            mood={dim > 0.5 && frame < c2 ? "neutral" : "happy"}
          />
        </g>
        <rect x={0} y={1130} width={1080} height={40} fill={F.wood} />
        <rect x={0} y={1170} width={1080} height={750} fill={F.navy} />
        <Pop s={coin} x={820} y={640}>
          <g
            transform={`translate(820 640) scale(${0.4 + 0.6 * Math.abs(spin)} 1)`}
          >
            <circle r={92} fill={F.mustard} />
            <circle
              r={70}
              fill="none"
              stroke="#fff"
              strokeWidth={8}
              opacity={0.6}
            />
            <text
              y={30}
              textAnchor="middle"
              fontFamily={SANS}
              fontWeight={900}
              fontSize={86}
              fill={F.navy}
            >
              ₽
            </text>
          </g>
          <text
            x={800}
            y={790}
            textAnchor="middle"
            fontFamily={SANS}
            fontWeight={900}
            fontSize={40}
            fill={F.navy}
          >
            + за допродажу
          </text>
        </Pop>
        {bar1 > 1 && (
          <Box
            iso={iso}
            x={-260}
            y={-60}
            z={0}
            w={160}
            d={120}
            h={bar1}
            c={["#6EE7B7", F.teal, "#1F7F77"]}
          />
        )}
        {bar2 > 1 && (
          <Box
            iso={iso}
            x={-60}
            y={-260}
            z={0}
            w={160}
            d={120}
            h={bar2}
            c={["#E3E8EF", "#B8C2CF", "#9AA5B1"]}
          />
        )}
        {(() => {
          const a = iso(-180, 0, 260);
          const bb = iso(20, -200, 100);
          return (
            <>
              <g
                opacity={interpolate(frame, [c2 + 20, c2 + 30], [0, 1], clamp)}
              >
                <Tag
                  x={a[0]}
                  y={a[1] - 20}
                  text={verdict > 0.5 ? "Неделя 1 ✓" : "Неделя 1"}
                  bg={F.mustard}
                  w={270}
                />
                <Tag
                  x={bb[0]}
                  y={bb[1] - 20}
                  text={verdict > 0.5 ? "Неделя 2 ✕" : "Неделя 2"}
                  bg="#fff"
                  w={270}
                />
              </g>
            </>
          );
        })()}
      </svg>
      <RuleChip n={5} text="Бонус + тест пары" />
    </AbsoluteFill>
  );
};

// ---------- 7. Пары — в ваших чеках ----------
export const S7Receipts: React.FC<SceneProps> = ({ cue }) => {
  const frame = useCurrentFrame();
  const [c0 = 0, c1 = 90] = cue;
  const link = interpolate(frame, [c1, c1 + 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const receipts = [
    ["Кофе", "Круассан", "Вода"],
    ["Паста", "Соус", "Хлеб"],
    ["Кофе", "Круассан", "Сок"],
  ];
  const col: Record<string, string> = {
    Кофе: F.mustard,
    Круассан: F.mustard,
    Паста: "#FFB4A8",
    Соус: "#FFB4A8",
  };
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #FBEFE2 0%, #F6E6D6 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.05,
          color: F.navy,
          letterSpacing: "-0.03em",
        }}
      >
        Пары —<br />
        <span style={{ color: F.coral }}>в ваших чеках</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 460,
          left: 50,
          right: 50,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {receipts.map((r, i) => {
          const s = spring({
            frame: frame - c0 - 6 - i * 8,
            fps: 30,
            config: { damping: 12 },
          });
          return (
            <div
              key={i}
              style={{
                width: 300,
                background: "#fff",
                borderRadius: "24px 24px 6px 6px",
                padding: "26px 22px 34px",
                boxShadow: "0 20px 40px rgba(36,59,85,0.18)",
                transform: `translateY(${(1 - s) * 200}px) rotate(${(i - 1) * 3}deg)`,
                opacity: s,
                fontFamily: SANS,
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 24,
                  color: "#9AA5B1",
                  marginBottom: 14,
                }}
              >
                ЧЕК №{4812 + i}
              </div>
              {r.map((it) => (
                <div
                  key={it}
                  style={{
                    fontWeight: 800,
                    fontSize: 38,
                    color: F.navy,
                    padding: "8px 12px",
                    marginBottom: 8,
                    borderRadius: 14,
                    background: link > 0.3 && col[it] ? col[it] : "transparent",
                  }}
                >
                  {it}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1020,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 30,
          opacity: link,
          transform: `translateY(${(1 - link) * 30}px)`,
        }}
      >
        {[
          ["Кофе", "Круассан", F.mustard],
          ["Паста", "Соус", "#FFB4A8"],
        ].map(([a, b2, c]) => (
          <div
            key={a}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              borderRadius: 999,
              padding: "10px 16px",
              boxShadow: "0 12px 26px rgba(36,59,85,0.15)",
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 38,
              color: F.navy,
            }}
          >
            <span
              style={{ background: c, borderRadius: 999, padding: "4px 16px" }}
            >
              {a}
            </span>
            <span style={{ color: F.coral }}>+</span>
            <span
              style={{ background: c, borderRadius: 999, padding: "4px 16px" }}
            >
              {b2}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 8. Шпаргалка ----------
export const S8Cheat: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 50,
          width: 980,
          background: "#fff",
          borderRadius: 48,
          boxShadow: "0 30px 60px rgba(36,59,85,0.2)",
          padding: "44px 46px 36px",
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 62,
            color: F.navy,
            letterSpacing: "-0.03em",
          }}
        >
          5 правил <span style={{ color: F.coral }}>кросс-продаж</span>
        </div>
        {CHEAT.rules.map(([t, d], i) => {
          const s = spring({
            frame: frame - 6 - i * 6,
            fps: 30,
            config: { damping: 14 },
          });
          return (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 22,
                marginTop: 30,
                opacity: s,
                transform: `translateX(${(1 - s) * 60}px)`,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  flexShrink: 0,
                  borderRadius: 36,
                  background: [
                    F.mustard,
                    F.teal,
                    "#7C6CF0",
                    F.coral,
                    "#5C7CFA",
                  ][i],
                  color: "#fff",
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 900,
                    fontSize: 42,
                    color: F.navy,
                    lineHeight: 1.1,
                  }}
                >
                  {t}
                </div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: 31,
                    color: "#6B7A90",
                    marginTop: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {d}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 34,
            paddingTop: 22,
            borderTop: "3px dashed #E6DED3",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: SANS,
            fontWeight: 800,
          }}
        >
          <span style={{ fontSize: 32, color: F.teal }}>{CHEAT.channel}</span>
          <span style={{ fontSize: 28, color: "#9AA5B1" }}>{CHEAT.pause}</span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 34,
            color: F.navy,
          }}
        >
          {CHEAT.next}
        </div>
      </div>
    </AbsoluteFill>
  );
};
