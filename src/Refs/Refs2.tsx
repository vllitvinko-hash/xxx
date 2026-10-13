import React from "react";
import { AbsoluteFill } from "remotion";
import { F, FlatCroissant, FlatMuffin, Label } from "./Refs";

// Вторая серия референсов: плоская иллюстрация + изометрия на разных сценах ролика.
const SANS = "Inter, sans-serif";

// затемнение цвета для рукавов, чтобы руки читались на фоне туловища
export const shade = (hex: string, k = 0.82) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v * k));
  return `rgb(${c.join(",")})`;
};

// ---------- Персонаж с позами ----------
type Pose = "relaxed" | "crossed" | "point" | "notebook";
type Mood = "neutral" | "happy" | "bored";

const Arm: React.FC<{
  from: [number, number];
  elbow: [number, number];
  hand: [number, number];
  sleeve: string;
  skin: string;
}> = ({ from, elbow, hand, sleeve, skin }) => (
  <g>
    <path
      d={`M ${from[0]} ${from[1]} L ${elbow[0]} ${elbow[1]} L ${hand[0]} ${hand[1]}`}
      stroke={sleeve}
      strokeWidth={46}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d={`M ${from[0]} ${from[1]} L ${elbow[0]} ${elbow[1]}`}
      stroke="rgba(0,0,0,0.08)"
      strokeWidth={46}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={hand[0]} cy={hand[1]} r={23} fill={skin} />
  </g>
);

export const Person: React.FC<{
  x: number;
  y: number;
  s: number;
  skin: string;
  hair: string;
  hairStyle: "bun" | "short" | "long" | "curly";
  top: string;
  apron?: string;
  pose: Pose;
  mood?: Mood;
  target?: [number, number]; // куда указывает (в локальных координатах)
  flip?: boolean;
}> = ({
  x,
  y,
  s,
  skin,
  hair,
  hairStyle,
  top,
  apron,
  pose,
  mood = "neutral",
  target = [260, 120],
  flip,
}) => {
  const shL: [number, number] = [-92, 140];
  const shR: [number, number] = [92, 140];
  const back = (
    <>
      {hairStyle === "long" && (
        <path
          d="M -70 0 Q -84 120 -60 190 L 60 190 Q 84 120 70 0 Z"
          fill={hair}
        />
      )}
    </>
  );
  const arms = (() => {
    switch (pose) {
      case "crossed":
        return (
          <>
            <Arm
              from={shL}
              elbow={[-112, 270]}
              hand={[50, 262]}
              sleeve={shade(top)}
              skin={skin}
            />
            <Arm
              from={shR}
              elbow={[112, 290]}
              hand={[-50, 284]}
              sleeve={shade(top)}
              skin={skin}
            />
          </>
        );
      case "point":
        return (
          <>
            <Arm
              from={shL}
              elbow={[-118, 270]}
              hand={[-108, 390]}
              sleeve={shade(top)}
              skin={skin}
            />
            <Arm
              from={shR}
              elbow={[
                (shR[0] + target[0]) / 2 + 10,
                (shR[1] + target[1]) / 2 + 30,
              ]}
              hand={target}
              sleeve={shade(top)}
              skin={skin}
            />
          </>
        );
      case "notebook":
        return (
          <>
            <Arm
              from={shL}
              elbow={[-112, 280]}
              hand={[-20, 270]}
              sleeve={shade(top)}
              skin={skin}
            />
            <g transform="rotate(-8 0 250)">
              <rect
                x={-70}
                y={200}
                width={130}
                height={170}
                rx={10}
                fill="#fff"
                stroke="#D9D2C8"
                strokeWidth={4}
              />
              {[230, 255, 280, 305, 330].map((yy) => (
                <line
                  key={yy}
                  x1={-56}
                  y1={yy}
                  x2={46}
                  y2={yy}
                  stroke="#B9C9E6"
                  strokeWidth={4}
                />
              ))}
              <text
                x={-50}
                y={262}
                fontFamily={SANS}
                fontWeight={900}
                fontSize={30}
                fill={F.teal}
              >
                ✓✓✓
              </text>
            </g>
            <Arm
              from={shR}
              elbow={[118, 280]}
              hand={[40, 250]}
              sleeve={shade(top)}
              skin={skin}
            />
            <line
              x1={40}
              y1={250}
              x2={10}
              y2={300}
              stroke={F.navy}
              strokeWidth={8}
              strokeLinecap="round"
            />
          </>
        );
      default:
        return (
          <>
            <Arm
              from={shL}
              elbow={[-118, 270]}
              hand={[-108, 390]}
              sleeve={shade(top)}
              skin={skin}
            />
            <Arm
              from={shR}
              elbow={[118, 270]}
              hand={[108, 390]}
              sleeve={shade(top)}
              skin={skin}
            />
          </>
        );
    }
  })();
  const eyes =
    mood === "bored" ? (
      <>
        <path
          d="M -32 30 L -12 30"
          stroke={F.hair}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d="M 12 30 L 32 30"
          stroke={F.hair}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d="M -34 14 L -10 18 M 10 18 L 34 14"
          stroke={F.hair}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </>
    ) : (
      <>
        <ellipse
          cx={-22}
          cy={30}
          rx={6}
          ry={mood === "happy" ? 7 : 8}
          fill={F.hair}
        />
        <ellipse
          cx={22}
          cy={30}
          rx={6}
          ry={mood === "happy" ? 7 : 8}
          fill={F.hair}
        />
        <path
          d="M -34 10 Q -22 4 -10 10 M 10 10 Q 22 4 34 10"
          stroke={F.hair}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  const mouth =
    mood === "happy" ? (
      <path
        d="M -20 64 Q 0 84 20 64"
        stroke={F.hair}
        strokeWidth={5}
        fill="#fff"
        strokeLinecap="round"
      />
    ) : mood === "bored" ? (
      <path
        d="M -14 70 L 14 68"
        stroke={F.hair}
        strokeWidth={5}
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M -16 68 Q 0 78 16 68"
        stroke={F.hair}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {back}
      {/* туловище */}
      <path
        d="M -108 180 Q -108 122 -60 110 L 60 110 Q 108 122 108 180 L 118 480 L -118 480 Z"
        fill={top}
      />
      <path d="M -26 110 L 0 150 L 26 110 Z" fill={skin} />
      {apron && (
        <>
          <path d="M -60 160 L 60 160 L 72 480 L -72 480 Z" fill={apron} />
          <rect
            x={-30}
            y={300}
            width={60}
            height={40}
            rx={8}
            fill="rgba(255,255,255,0.25)"
          />
        </>
      )}
      {/* шея, голова */}
      <rect x={-18} y={74} width={36} height={44} rx={10} fill={skin} />
      <ellipse cx={0} cy={28} rx={58} ry={66} fill={skin} />
      <ellipse cx={-58} cy={34} rx={10} ry={15} fill={skin} />
      <ellipse cx={58} cy={34} rx={10} ry={15} fill={skin} />
      {hairStyle === "curly" ? (
        [
          [-44, -20],
          [-20, -40],
          [8, -44],
          [34, -34],
          [52, -10],
          [-56, 4],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={28} fill={hair} />
        ))
      ) : (
        <path
          d="M -60 22 Q -64 -48 0 -46 Q 64 -48 60 22 Q 48 -8 0 -10 Q -44 -8 -60 22 Z"
          fill={hair}
        />
      )}
      {hairStyle === "bun" && <circle cx={0} cy={-58} r={26} fill={hair} />}
      {eyes}
      <path
        d="M -2 38 Q -8 52 2 54"
        stroke={F.hair}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        opacity={0.45}
      />
      {mouth}
      <circle cx={-36} cy={56} r={10} fill={F.coral} opacity={0.22} />
      <circle cx={36} cy={56} r={10} fill={F.coral} opacity={0.22} />
      {arms}
    </g>
  );
};

export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  lines: string[];
  color?: string;
  text?: string;
  tail?: "left" | "right";
}> = ({ x, y, w, lines, color = "#fff", text = F.navy, tail = "left" }) => {
  const h = 70 + lines.length * 64;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={h} rx={56} fill={color} />
      {tail === "left" ? (
        <path
          d={`M 70 ${h - 10} L 40 ${h + 60} L 140 ${h - 6} Z`}
          fill={color}
        />
      ) : (
        <path
          d={`M ${w - 70} ${h - 10} L ${w - 40} ${h + 60} L ${w - 140} ${h - 6} Z`}
          fill={color}
        />
      )}
      {lines.map((l, i) => (
        <text
          key={i}
          x={w / 2}
          y={86 + i * 64}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={54}
          fill={text}
        >
          {l}
        </text>
      ))}
    </g>
  );
};

export const Cafe: React.FC = () => (
  <>
    <rect width={1080} height={1150} fill={F.wall} />
    <rect x={560} y={220} width={420} height={300} rx={18} fill={F.navy} />
    {[270, 320, 370, 420, 470].map((yy, i) => (
      <g key={yy}>
        <rect
          x={600}
          y={yy - 12}
          width={[200, 160, 220, 140, 180][i]}
          height={14}
          rx={7}
          fill="#fff"
          opacity={0.75}
        />
        <rect
          x={890}
          y={yy - 12}
          width={50}
          height={14}
          rx={7}
          fill={F.mustard}
        />
      </g>
    ))}
    {[200, 420].map((lx) => (
      <g key={lx}>
        <line x1={lx} y1={0} x2={lx} y2={200} stroke={F.navy} strokeWidth={4} />
        <path
          d={`M ${lx - 60} 260 Q ${lx} 160 ${lx + 60} 260 Z`}
          fill={F.mustard}
        />
      </g>
    ))}
  </>
);

export const Counter: React.FC = () => (
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
    <FlatMuffin x={630} y={1050} s={0.8} />
  </>
);

// ============ 1.1 Касса: «Что-нибудь ещё?» — «Нет.» ============
export const Ref6Checkout: React.FC = () => (
  <AbsoluteFill style={{ background: F.bg }}>
    <svg width={1080} height={1920}>
      <Cafe />
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
        mood="neutral"
      />
      <Counter />
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
      <Bubble x={60} y={420} w={560} lines={["Что-нибудь ещё?"]} />
      <Bubble
        x={640}
        y={880}
        w={300}
        lines={["Нет."]}
        color={F.coral}
        text="#fff"
        tail="right"
      />
    </svg>
    <Label n={6} name="Касса: «нет»" />
  </AbsoluteFill>
);

// ============ 1.2 Дома: игрушка не работает ============
export const Toy: React.FC<{ x: number; y: number; s: number; on: boolean }> = ({
  x,
  y,
  s,
  on,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {on &&
      Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 150}
            y1={-120 + Math.sin(a) * 150}
            x2={Math.cos(a) * 185}
            y2={-120 + Math.sin(a) * 185}
            stroke={F.mustard}
            strokeWidth={12}
            strokeLinecap="round"
          />
        );
      })}
    <rect
      x={-80}
      y={-230}
      width={160}
      height={120}
      rx={26}
      fill={on ? F.teal : "#AEB6BF"}
    />
    <circle cx={-34} cy={-170} r={20} fill={on ? "#FFF6C9" : "#6E7781"} />
    <circle cx={34} cy={-170} r={20} fill={on ? "#FFF6C9" : "#6E7781"} />
    <line x1={0} y1={-230} x2={0} y2={-268} stroke={F.navy} strokeWidth={8} />
    <circle cx={0} cy={-274} r={12} fill={on ? F.coral : "#6E7781"} />
    <rect
      x={-70}
      y={-100}
      width={140}
      height={110}
      rx={20}
      fill={on ? F.coral : "#949CA5"}
    />
    <rect
      x={-40}
      y={-76}
      width={80}
      height={50}
      rx={8}
      fill={on ? "#3E8E4A" : "#4A525B"}
    />
    <rect
      x={-100}
      y={-90}
      width={30}
      height={80}
      rx={14}
      fill={on ? F.coral : "#949CA5"}
    />
    <rect
      x={70}
      y={-90}
      width={30}
      height={80}
      rx={14}
      fill={on ? F.coral : "#949CA5"}
    />
  </g>
);

export const Ref7Home: React.FC = () => (
  <AbsoluteFill style={{ background: "#E9E2F5" }}>
    <svg width={1080} height={1920}>
      {/* стена и окно */}
      <rect width={1080} height={1250} fill="#EFE8FA" />
      <rect x={620} y={220} width={340} height={420} rx={20} fill="#2D3A66" />
      <circle cx={860} cy={320} r={44} fill="#FFF3C4" />
      {[
        [700, 300],
        [760, 420],
        [900, 500],
        [690, 520],
      ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={5} fill="#fff" />
      ))}
      <rect x={612} y={420} width={356} height={14} fill="#EFE8FA" />
      <rect x={784} y={212} width={14} height={436} fill="#EFE8FA" />
      {/* торшер */}
      <line
        x1={150}
        y1={420}
        x2={150}
        y2={1240}
        stroke={F.navy}
        strokeWidth={10}
      />
      <path d="M 70 430 L 230 430 L 200 300 L 100 300 Z" fill={F.mustard} />
      {/* диван */}
      <rect x={300} y={830} width={720} height={260} rx={50} fill="#7C6CF0" />
      <rect x={340} y={760} width={640} height={150} rx={50} fill="#9A8CF6" />
      {/* пол и ковёр */}
      <rect y={1250} width={1080} height={670} fill="#D8CDEF" />
      <ellipse
        cx={540}
        cy={1500}
        rx={460}
        ry={170}
        fill={F.coral}
        opacity={0.85}
      />
      <ellipse
        cx={540}
        cy={1500}
        rx={380}
        ry={130}
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeDasharray="20 16"
        opacity={0.6}
      />
      {/* ребёнок */}
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
      {/* игрушка не работает */}
      <Toy x={560} y={1640} s={1.15} on={false} />
      <text
        x={560}
        y={1300}
        textAnchor="middle"
        fontFamily={SANS}
        fontWeight={900}
        fontSize={120}
        fill={F.navy}
      >
        ?
      </text>
      {/* вставка: с батарейками */}
      <g transform="translate(850 1120)">
        <circle r={190} fill="#fff" />
        <circle r={190} fill="none" stroke={F.teal} strokeWidth={12} />
        <g transform="translate(0 120) scale(0.62)">
          <Toy x={0} y={0} s={1} on />
        </g>
        <g transform="translate(-130 -110) rotate(-20)">
          <rect width={70} height={34} rx={8} fill={F.mustard} />
          <rect x={70} y={10} width={10} height={14} fill={F.navy} />
        </g>
      </g>
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1310,
        left: 660,
        width: 380,
        whiteSpace: "nowrap",
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 40,
        color: F.teal,
      }}
    >
      🔋 с батарейками
    </div>
    <Label n={7} name="Дома: «не работает»" />
  </AbsoluteFill>
);

// ============ Изометрия ============
export const makeIso =
  (cx: number, cy: number) =>
  (x: number, y: number, z: number): [number, number] => [
    cx + (x - y) * 0.866,
    cy + (x + y) * 0.5 - z,
  ];
export const pp = (a: [number, number][]) => a.map((p) => p.join(",")).join(" ");

export const Box: React.FC<{
  iso: ReturnType<typeof makeIso>;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  c: [string, string, string];
}> = ({ iso, x, y, z, w, d, h, c }) => (
  <g>
    <polygon
      points={pp([
        iso(x, y + d, z),
        iso(x + w, y + d, z),
        iso(x + w, y + d, z + h),
        iso(x, y + d, z + h),
      ])}
      fill={c[1]}
    />
    <polygon
      points={pp([
        iso(x + w, y, z),
        iso(x + w, y + d, z),
        iso(x + w, y + d, z + h),
        iso(x + w, y, z + h),
      ])}
      fill={c[2]}
    />
    <polygon
      points={pp([
        iso(x, y, z + h),
        iso(x + w, y, z + h),
        iso(x + w, y + d, z + h),
        iso(x, y + d, z + h),
      ])}
      fill={c[0]}
    />
  </g>
);

export const Cyl: React.FC<{
  iso: ReturnType<typeof makeIso>;
  x: number;
  y: number;
  z: number;
  r: number;
  h: number;
  body: string;
  dark: string;
  cap: string;
}> = ({ iso, x, y, z, r, h, body, dark, cap }) => {
  const [bx, by] = iso(x, y, z);
  return (
    <g>
      <rect x={bx - r} y={by - h} width={r * 2} height={h} fill={body} />
      <rect x={bx} y={by - h} width={r} height={h} fill={dark} />
      <ellipse cx={bx} cy={by} rx={r} ry={r * 0.5} fill={dark} />
      <ellipse cx={bx} cy={by - h} rx={r} ry={r * 0.5} fill={cap} />
    </g>
  );
};

export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  bg: string;
  fg?: string;
  w: number;
}> = ({ x, y, text, bg, fg = F.navy, w }) => (
  <g>
    <rect x={x - w / 2} y={y - 50} width={w} height={84} rx={22} fill={bg} />
    <text
      x={x}
      y={y + 6}
      textAnchor="middle"
      fontFamily={SANS}
      fontWeight={900}
      fontSize={40}
      fill={fg}
    >
      {text}
    </text>
  </g>
);

// ============ 2.1 Полка: паста + соус ============
export const Ref8Shelf: React.FC = () => {
  const iso = makeIso(540, 900);
  const shelf: [string, string, string] = ["#F3F4FF", "#C9CCF5", "#B1B5EE"];
  const slots = [0, 90, 180];
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
        {/* стеллаж */}
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
        {/* нижние полки — обычные товары */}
        {[-320, -230, -140, -50, 40, 130, 220].map((x, i) => (
          <Box
            key={x}
            iso={iso}
            x={x}
            y={-110}
            z={20}
            w={70}
            d={60}
            h={100 + (i % 3) * 14}
            c={["#FFFFFF", "#E1E3F8", "#CDD0F2"]}
          />
        ))}
        {[-320, -200, -80, 40, 160, 280].map((x) => (
          <Box
            key={x}
            iso={iso}
            x={x}
            y={-110}
            z={346}
            w={80}
            d={60}
            h={90}
            c={["#FFFFFF", "#E1E3F8", "#CDD0F2"]}
          />
        ))}
        {/* средняя полка: паста рядом с соусом */}
        {slots.map((dx) => (
          <Box
            key={dx}
            iso={iso}
            x={-300 + dx}
            y={-110}
            z={166}
            w={70}
            d={60}
            h={150}
            c={["#FFE37A", "#F5B92E", "#E09E12"]}
          />
        ))}
        {[0, 70].map((dx) => (
          <Cyl
            key={dx}
            iso={iso}
            x={20 + dx}
            y={-70}
            z={166}
            r={30}
            h={110}
            body="#F2604A"
            dark="#C8432F"
            cap="#3A2F8F"
          />
        ))}
        {[180, 260].map((dx) => (
          <Box
            key={dx}
            iso={iso}
            x={dx}
            y={-110}
            z={166}
            w={60}
            d={60}
            h={120}
            c={["#FFFFFF", "#E1E3F8", "#CDD0F2"]}
          />
        ))}
        {/* дуга «на расстоянии руки» */}
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
            />
          );
        })()}
        {(() => {
          const [tx, ty] = iso(-200, -40, 560);
          const [sx, sy] = iso(60, -40, 520);
          return (
            <>
              <Tag x={tx - 40} y={ty} text="Паста" bg="#FFD84D" w={200} />
              <Tag
                x={sx + 60}
                y={sy}
                text="Соус"
                bg="#F2604A"
                fg="#fff"
                w={180}
              />
            </>
          );
        })()}
        {/* корзина */}
        {(() => {
          const [bx, by] = iso(220, 300, 0);
          return (
            <g>
              <path
                d={`M ${bx - 120} ${by - 90} L ${bx + 120} ${by - 90} L ${bx + 90} ${by + 20} L ${bx - 90} ${by + 20} Z`}
                fill="#7C6CF0"
              />
              <rect
                x={bx - 70}
                y={by - 160}
                width={60}
                height={80}
                fill="#FFE37A"
              />
              <rect
                x={bx + 4}
                y={by - 150}
                width={50}
                height={70}
                rx={14}
                fill="#F2604A"
              />
              <path
                d={`M ${bx - 100} ${by - 90} Q ${bx} ${by - 240} ${bx + 100} ${by - 90}`}
                fill="none"
                stroke="#5B4BDB"
                strokeWidth={14}
              />
            </g>
          );
        })()}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1480,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 70,
          color: "#1E1650",
        }}
      >
        ✋ на расстоянии руки
      </div>
      <Label n={8} name="Изометрия: полка" />
    </AbsoluteFill>
  );
};

// ============ 2.2 Набор на шашлык ============
export const Ref9Bundle: React.FC = () => {
  const iso = makeIso(540, 1060);
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
        {/* коробка */}
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
        {/* внутренность */}
        <polygon
          points={pp([
            iso(-200, -140, 210),
            iso(200, -140, 210),
            iso(200, 140, 210),
            iso(-200, 140, 210),
          ])}
          fill="#7A4E2A"
        />
        {/* уголь */}
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
        {/* розжиг */}
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
        {/* шампуры */}
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
        {/* бирки «решение» над товарами */}
        {(() => {
          const a = iso(-90, -50, 470);
          const b = iso(70, -60, 470);
          const c = iso(10, 80, 560);
          return (
            <>
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
            </>
          );
        })()}
        {/* лента-ярлык на коробке */}
        {(() => {
          const [lx, ly] = iso(0, 160, 110);
          return (
            <g transform={`translate(${lx} ${ly}) skewY(30)`}>
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
          top: 1480,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 72,
          color: F.navy,
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
            padding: "0 18px",
            borderRadius: 18,
          }}
        >
          1
        </span>
      </div>
      <Label n={9} name="Изометрия: набор" />
    </AbsoluteFill>
  );
};

// ============ 1.3 + 2: бонус продавцу и тест пары ============
export const Ref10Bonus: React.FC = () => {
  const iso = makeIso(800, 1560);
  return (
    <AbsoluteFill style={{ background: F.bg }}>
      <svg width={1080} height={1920}>
        <Cafe />
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
          mood="happy"
        />
        <rect x={0} y={1130} width={1080} height={40} fill={F.wood} />
        <rect x={0} y={1170} width={1080} height={750} fill={F.navy} />
        {/* монета-бонус */}
        <g transform="translate(820 640)">
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
        {/* изометрический график недель */}
        <Box
          iso={iso}
          x={-260}
          y={-60}
          z={0}
          w={160}
          d={120}
          h={300}
          c={["#6EE7B7", F.teal, "#1F7F77"]}
        />
        <Box
          iso={iso}
          x={60}
          y={-60}
          z={0}
          w={160}
          d={120}
          h={90}
          c={["#E3E8EF", "#B8C2CF", "#9AA5B1"]}
        />
        {(() => {
          const a = iso(-180, 0, 330);
          const b = iso(140, 0, 120);
          return (
            <>
              <Tag
                x={a[0]}
                y={a[1] - 20}
                text="Неделя 1 ✓"
                bg={F.mustard}
                w={270}
              />
              <Tag x={b[0]} y={b[1] - 20} text="Неделя 2 ✕" bg="#fff" w={270} />
            </>
          );
        })()}
      </svg>
      <Label n={10} name="Бонус + тест пары" />
    </AbsoluteFill>
  );
};
