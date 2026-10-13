import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/cyrillic-800.css";
import "@fontsource/inter/cyrillic-900.css";
import React from "react";
import { AbsoluteFill } from "remotion";

// Стилевые референсы: один и тот же момент («Круассан или маффин?») в пяти стилях.
const SANS = "Inter, sans-serif";

export const Label: React.FC<{ n: number; name: string; dark?: boolean }> = ({
  n,
  name,
  dark,
}) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      left: 60,
      padding: "12px 24px",
      borderRadius: 999,
      background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.75)",
      color: "#fff",
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 30,
      letterSpacing: 1,
    }}
  >
    Референс {n} · {name}
  </div>
);

// ============ 1. Плоская иллюстрация ============
export const F = {
  bg: "#F6E6D6",
  wall: "#FBEFE2",
  navy: "#243B55",
  wood: "#C97B4A",
  teal: "#2BA59B",
  coral: "#EE6A57",
  mustard: "#F2B33D",
  skin1: "#F1C19A",
  skin2: "#A8693F",
  hair: "#2A2626",
};

const FlatPerson: React.FC<{
  x: number;
  y: number;
  s: number;
  skin: string;
  hair: string;
  top: string;
  apron?: string;
  armTo?: [number, number];
  bun?: boolean;
  flip?: boolean;
}> = ({ x, y, s, skin, hair, top, apron, armTo, bun, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {/* туловище */}
    <path
      d="M -110 175 Q -112 120 -62 108 L 62 108 Q 112 120 110 175 L 122 470 L -122 470 Z"
      fill={top}
    />
    {apron && <path d="M -62 150 L 62 150 L 74 470 L -74 470 Z" fill={apron} />}
    {apron && (
      <path
        d="M -40 150 Q 0 120 40 150"
        stroke={apron}
        strokeWidth={10}
        fill="none"
      />
    )}
    {/* шея и голова */}
    <rect x={-20} y={78} width={40} height={40} rx={10} fill={skin} />
    <ellipse cx={0} cy={30} rx={60} ry={68} fill={skin} />
    <ellipse cx={-60} cy={36} rx={10} ry={16} fill={skin} />
    <ellipse cx={60} cy={36} rx={10} ry={16} fill={skin} />
    {/* волосы */}
    <path
      d="M -62 24 Q -64 -46 0 -44 Q 64 -46 62 24 Q 46 -6 0 -8 Q -40 -6 -62 24 Z"
      fill={hair}
    />
    {bun && <circle cx={0} cy={-58} r={26} fill={hair} />}
    {/* лицо */}
    <ellipse cx={-22} cy={32} rx={6} ry={8} fill={F.hair} />
    <ellipse cx={22} cy={32} rx={6} ry={8} fill={F.hair} />
    <path
      d="M -2 40 Q -8 54 2 56"
      stroke={F.hair}
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
      opacity={0.5}
    />
    <path
      d="M -18 70 Q 0 84 18 70"
      stroke={F.hair}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
    />
    <circle cx={-36} cy={58} r={10} fill={F.coral} opacity={0.25} />
    <circle cx={36} cy={58} r={10} fill={F.coral} opacity={0.25} />
    {/* рука */}
    {armTo && (
      <>
        <path
          d={`M 90 150 Q ${armTo[0] * 0.6} ${(150 + armTo[1]) / 2 - 40} ${armTo[0]} ${armTo[1]}`}
          stroke={top}
          strokeWidth={46}
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={armTo[0]} cy={armTo[1]} r={24} fill={skin} />
      </>
    )}
  </g>
);

export const FlatCroissant: React.FC<{ x: number; y: number; s: number }> = ({
  x,
  y,
  s,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -90 10 Q -60 -60 0 -62 Q 60 -60 90 10 Q 60 -10 0 -12 Q -60 -10 -90 10 Z"
      fill="#E9A23B"
    />
    {[-50, -18, 18, 50].map((cx) => (
      <path
        key={cx}
        d={`M ${cx - 12} -54 Q ${cx} -20 ${cx - 6} -10`}
        stroke="#B86E1D"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    ))}
    <path
      d="M -60 -40 Q 0 -70 60 -40"
      stroke="#FFE2A8"
      strokeWidth={8}
      fill="none"
      strokeLinecap="round"
      opacity={0.7}
    />
  </g>
);

export const FlatMuffin: React.FC<{
  x: number;
  y: number;
  s: number;
  dim?: boolean;
}> = ({ x, y, s, dim }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={dim ? 0.45 : 1}>
    <path d="M -48 0 L 48 0 L 36 70 L -36 70 Z" fill={F.coral} />
    {[-24, 0, 24].map((cx) => (
      <line
        key={cx}
        x1={cx}
        y1={4}
        x2={cx * 0.78}
        y2={66}
        stroke="#C24F3F"
        strokeWidth={5}
      />
    ))}
    <path d="M -60 4 Q -66 -64 0 -66 Q 66 -64 60 4 Z" fill="#7A4A2A" />
    {[
      [-22, -34],
      [14, -44],
      [30, -14],
      [-34, -6],
      [2, -18],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={6} fill="#3E2415" />
    ))}
  </g>
);

export const RefFlat: React.FC = () => (
  <AbsoluteFill style={{ background: F.bg }}>
    <svg width={1080} height={1920}>
      <rect width={1080} height={1150} fill={F.wall} />
      {/* меню */}
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
      {/* лампы */}
      {[200, 420].map((lx) => (
        <g key={lx}>
          <line
            x1={lx}
            y1={0}
            x2={lx}
            y2={200}
            stroke={F.navy}
            strokeWidth={4}
          />
          <path
            d={`M ${lx - 60} 260 Q ${lx} 160 ${lx + 60} 260 Z`}
            fill={F.mustard}
          />
          <ellipse cx={lx} cy={262} rx={30} ry={8} fill="#FFF3C4" />
        </g>
      ))}
      {/* растение */}
      <rect x={890} y={1020} width={80} height={110} rx={10} fill={F.coral} />
      {[
        [-40, -90],
        [0, -130],
        [40, -96],
        [-20, -60],
        [26, -64],
      ].map(([dx, dy], i) => (
        <ellipse
          key={i}
          cx={930 + dx}
          cy={1020 + dy}
          rx={22}
          ry={56}
          fill={F.teal}
          transform={`rotate(${dx * 0.8} ${930 + dx} ${1020 + dy})`}
        />
      ))}
      {/* бариста */}
      <FlatPerson
        x={300}
        y={640}
        s={1.25}
        skin={F.skin2}
        hair={F.hair}
        top="#F7F3EE"
        apron={F.teal}
        bun
      />
      {/* кофемашина */}
      <rect x={60} y={900} width={190} height={230} rx={20} fill="#9AA5B1" />
      <rect x={80} y={930} width={150} height={60} rx={10} fill={F.navy} />
      <circle cx={155} cy={1060} r={22} fill={F.navy} />
      {/* прилавок */}
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
      {/* витрина */}
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
      <FlatMuffin x={630} y={1050} s={0.8} dim />
      {/* выбранный круассан — подсветка */}
      <circle
        cx={420}
        cy={1050}
        r={110}
        fill="none"
        stroke={F.mustard}
        strokeWidth={10}
      />
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
        <path
          d="M -20 -60 Q -30 -90 -10 -110 M 10 -60 Q 0 -90 20 -110"
          stroke="#C7B9AA"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* покупатель на переднем плане */}
      <FlatPerson
        x={830}
        y={1250}
        s={1.6}
        skin={F.skin1}
        hair="#7A4A2A"
        top={F.coral}
        flip
        armTo={[300, 120]}
      />
      {/* реплика */}
      <g transform="translate(380 420)">
        <rect x={0} y={0} width={500} height={190} rx={60} fill="#fff" />
        <path d="M 80 180 L 50 250 L 150 186 Z" fill="#fff" />
        <text
          x={250}
          y={86}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={54}
          fill={F.navy}
        >
          Круассан
        </text>
        <text
          x={250}
          y={150}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={54}
          fill={F.navy}
        >
          или маффин?
        </text>
      </g>
      {/* +1 */}
      <g transform="translate(230 820) rotate(-8)">
        <rect x={0} y={0} width={220} height={90} rx={45} fill={F.mustard} />
        <text
          x={110}
          y={62}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={50}
          fill={F.navy}
        >
          +1 в чеке
        </text>
      </g>
    </svg>
    <Label n={1} name="Плоская иллюстрация" />
  </AbsoluteFill>
);

// ============ 2. Изометрия ============
const ISO = { cx: 540, cy: 980, s: 1 };
const iso = (x: number, y: number, z: number): [number, number] => [
  ISO.cx + (x - y) * 0.866 * ISO.s,
  ISO.cy + (x + y) * 0.5 * ISO.s - z * ISO.s,
];
export const pts = (a: [number, number][]) =>
  a.map((p) => p.join(",")).join(" ");

export const IsoBox: React.FC<{
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  top: string;
  left: string;
  right: string;
}> = ({ x, y, z, w, d, h, top, left, right }) => (
  <g>
    <polygon
      points={pts([
        iso(x, y + d, z),
        iso(x + w, y + d, z),
        iso(x + w, y + d, z + h),
        iso(x, y + d, z + h),
      ])}
      fill={left}
    />
    <polygon
      points={pts([
        iso(x + w, y, z),
        iso(x + w, y + d, z),
        iso(x + w, y + d, z + h),
        iso(x + w, y, z + h),
      ])}
      fill={right}
    />
    <polygon
      points={pts([
        iso(x, y, z + h),
        iso(x + w, y, z + h),
        iso(x + w, y + d, z + h),
        iso(x, y + d, z + h),
      ])}
      fill={top}
    />
  </g>
);

const IsoPerson: React.FC<{
  x: number;
  y: number;
  body: string;
  dark: string;
  skin: string;
}> = ({ x, y, body, dark, skin }) => {
  const [bx, by] = iso(x, y, 0);
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={60} ry={30} fill="rgba(60,50,120,0.15)" />
      <path
        d={`M ${bx - 46} ${by - 10} L ${bx - 46} ${by - 200} Q ${bx} ${by - 250} ${bx + 46} ${by - 200} L ${bx + 46} ${by - 10} Q ${bx} ${by + 14} ${bx - 46} ${by - 10} Z`}
        fill={body}
      />
      <path
        d={`M ${bx} ${by - 236} Q ${bx + 46} ${by - 200} ${bx + 46} ${by - 10} Q ${bx + 20} ${by + 6} ${bx} ${by} Z`}
        fill={dark}
      />
      <circle cx={bx} cy={by - 280} r={44} fill={skin} />
      <path
        d={`M ${bx - 44} ${by - 286} Q ${bx} ${by - 344} ${bx + 44} ${by - 286} Q ${bx} ${by - 300} ${bx - 44} ${by - 286} Z`}
        fill="#2B2350"
      />
    </g>
  );
};

export const RefIso: React.FC = () => {
  const label = (
    x: number,
    y: number,
    z: number,
    text: string,
    color: string,
    w: number,
  ) => {
    const [px, py] = iso(x, y, z);
    return (
      <g>
        <line
          x1={px}
          y1={py}
          x2={px}
          y2={py - 120}
          stroke="#5B4BDB"
          strokeWidth={4}
          strokeDasharray="8 8"
        />
        <rect
          x={px - w / 2}
          y={py - 200}
          width={w}
          height={80}
          rx={18}
          fill={color}
        />
        <text
          x={px}
          y={py - 147}
          textAnchor="middle"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={40}
          fill="#1E1650"
        >
          {text}
        </text>
      </g>
    );
  };
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #EEF0FF 0%, #DCE0FF 100%)",
      }}
    >
      <svg width={1080} height={1920}>
        {/* пол */}
        <polygon
          points={pts([
            iso(-420, -420, 0),
            iso(420, -420, 0),
            iso(420, 420, 0),
            iso(-420, 420, 0),
          ])}
          fill="#C9CEFA"
        />
        <polygon
          points={pts([
            iso(-420, 420, 0),
            iso(420, 420, 0),
            iso(420, 420, -30),
            iso(-420, 420, -30),
          ])}
          fill="#A9AEEA"
        />
        <polygon
          points={pts([
            iso(420, -420, 0),
            iso(420, 420, 0),
            iso(420, 420, -30),
            iso(420, -420, -30),
          ])}
          fill="#9298DE"
        />
        {/* стена */}
        <IsoBox
          x={-420}
          y={-420}
          z={0}
          w={840}
          d={20}
          h={420}
          top="#F3F4FF"
          left="#E4E6FF"
          right="#D5D8FF"
        />
        {/* меню на стене */}
        <polygon
          points={pts([
            iso(60, -398, 220),
            iso(340, -398, 220),
            iso(340, -398, 380),
            iso(60, -398, 380),
          ])}
          fill="#3A2F8F"
        />
        {/* бариста */}
        <IsoPerson
          x={-60}
          y={-260}
          body="#3FC1A5"
          dark="#2E9F87"
          skin="#E7B48F"
        />
        {/* прилавок */}
        <IsoBox
          x={-300}
          y={-120}
          z={0}
          w={600}
          d={140}
          h={200}
          top="#FFFFFF"
          left="#7C6CF0"
          right="#6252D9"
        />
        {/* кофемашина */}
        <IsoBox
          x={-280}
          y={-100}
          z={200}
          w={110}
          d={90}
          h={140}
          top="#C9CBD8"
          left="#9EA1B8"
          right="#8A8DA6"
        />
        {/* стакан кофе */}
        {(() => {
          const [cx, cy] = iso(-40, -40, 200);
          return (
            <g>
              <rect
                x={cx - 36}
                y={cy - 110}
                width={72}
                height={110}
                fill="#FFFFFF"
              />
              <rect
                x={cx - 36}
                y={cy - 80}
                width={72}
                height={34}
                fill="#FF7A59"
              />
              <ellipse cx={cx} cy={cy} rx={36} ry={14} fill="#E3E3F0" />
              <ellipse cx={cx} cy={cy - 110} rx={36} ry={14} fill="#6B3E26" />
            </g>
          );
        })()}
        {/* круассан на тарелке */}
        {(() => {
          const [cx, cy] = iso(110, -40, 200);
          return (
            <g>
              <ellipse
                cx={cx}
                cy={cy}
                rx={80}
                ry={36}
                fill="#FFFFFF"
                stroke="#D6D8F5"
                strokeWidth={4}
              />
              <path
                d={`M ${cx - 60} ${cy - 4} Q ${cx} ${cy - 80} ${cx + 60} ${cy - 4} Q ${cx} ${cy - 30} ${cx - 60} ${cy - 4} Z`}
                fill="#F5A623"
              />
              <path
                d={`M ${cx - 20} ${cy - 54} Q ${cx - 10} ${cy - 30} ${cx - 16} ${cy - 20} M ${cx + 16} ${cy - 54} Q ${cx + 22} ${cy - 30} ${cx + 14} ${cy - 20}`}
                stroke="#C27A0E"
                strokeWidth={5}
                fill="none"
              />
            </g>
          );
        })()}
        {/* маффин */}
        {(() => {
          const [cx, cy] = iso(230, -10, 200);
          return (
            <g opacity={0.5}>
              <path
                d={`M ${cx - 32} ${cy - 40} L ${cx + 32} ${cy - 40} L ${cx + 24} ${cy} L ${cx - 24} ${cy} Z`}
                fill="#FF7A9A"
              />
              <ellipse cx={cx} cy={cy - 46} rx={40} ry={30} fill="#7A4A2A" />
            </g>
          );
        })()}
        {/* покупатель */}
        <IsoPerson
          x={140}
          y={200}
          body="#FF7A59"
          dark="#E0603F"
          skin="#F1C7A3"
        />
        {/* подписи */}
        {label(110, -40, 300, "✓ Круассан", "#FFD84D", 280)}
        {label(-60, -260, 380, "Или маффин?", "#FFFFFF", 300)}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 1560,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 84,
          color: "#1E1650",
        }}
      >
        +1 в чеке
      </div>
      <Label n={2} name="Изометрия" />
    </AbsoluteFill>
  );
};

// ============ 3. Кинетическая типографика ============
export const RefType: React.FC = () => (
  <AbsoluteFill style={{ background: "#2D5BFF", overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={980} cy={1500} r={520} fill="#2450F0" />
      <circle cx={100} cy={300} r={260} fill="#3A66FF" />
    </svg>
    <div
      style={{
        position: "absolute",
        top: 220,
        left: 70,
        right: 70,
        fontFamily: SANS,
        color: "#fff",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 64,
          opacity: 0.55,
          position: "relative",
          display: "inline-block",
        }}
      >
        «Что-нибудь ещё?»
        <div
          style={{
            position: "absolute",
            left: -10,
            right: -10,
            top: "52%",
            height: 10,
            background: "#FF4D4D",
            transform: "rotate(-3deg)",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 60,
          fontWeight: 900,
          fontSize: 210,
          lineHeight: 0.9,
          letterSpacing: "-0.06em",
          color: "#FFE14D",
        }}
      >
        Круассан
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          marginTop: 10,
        }}
      >
        или
      </div>
      <div
        style={{
          fontWeight: 900,
          fontSize: 210,
          lineHeight: 0.9,
          letterSpacing: "-0.06em",
          WebkitTextStroke: "6px #fff",
          color: "transparent",
        }}
      >
        маффин?
      </div>
    </div>
    {/* большой круассан */}
    <svg
      width={900}
      height={600}
      style={{ position: "absolute", left: 90, top: 1050 }}
    >
      <defs>
        <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD27A" />
          <stop offset="1" stopColor="#D9861E" />
        </linearGradient>
      </defs>
      <ellipse cx={450} cy={520} rx={330} ry={40} fill="#1E3FCC" />
      <path
        d="M 120 470 Q 160 160 450 140 Q 740 160 780 470 Q 620 380 450 376 Q 280 380 120 470 Z"
        fill="url(#cr)"
      />
      {[260, 360, 450, 540, 640].map((x, i) => (
        <path
          key={x}
          d={`M ${x - 30} ${170 + Math.abs(i - 2) * 30} Q ${x} 300 ${x - 14} ${376 + Math.abs(i - 2) * 10}`}
          stroke="#B56A12"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M 300 200 Q 450 150 600 200"
        stroke="#FFF1C9"
        strokeWidth={16}
        fill="none"
        strokeLinecap="round"
        opacity={0.7}
      />
    </svg>
    <div
      style={{
        position: "absolute",
        top: 1630,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#FFE14D",
          color: "#1B2A6B",
          borderRadius: 999,
          padding: "18px 50px",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 64,
        }}
      >
        +1 в чеке
      </div>
    </div>
    <Label n={3} name="Кинетическая типографика" dark />
  </AbsoluteFill>
);

// ============ 4. Тёмный data-стиль ============
export const RefData: React.FC = () => {
  const glow = (c: string) =>
    `drop-shadow(0 0 12px ${c}) drop-shadow(0 0 30px ${c})`;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 40%, #16204A 0%, #070A18 70%)",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,120,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(80,120,255,0.12) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* силуэты */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <g
          style={{ filter: glow("#28E0FF") }}
          fill="#070A18"
          stroke="#28E0FF"
          strokeWidth={4}
        >
          <path d="M 70 1600 L 70 1240 Q 70 1160 160 1150 L 300 1150 Q 390 1160 390 1240 L 390 1600" />
          <circle cx={230} cy={1060} r={80} />
        </g>
        <g
          style={{ filter: glow("#FF3DCB") }}
          fill="#070A18"
          stroke="#FF3DCB"
          strokeWidth={4}
        >
          <path d="M 690 1700 L 690 1300 Q 690 1220 780 1210 L 930 1210 Q 1020 1220 1020 1300 L 1020 1700" />
          <circle cx={855} cy={1110} r={86} />
          <path
            d="M 700 1320 Q 600 1230 520 1180"
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
      {/* чек */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 240,
          width: 600,
          padding: "40px 44px",
          border: "3px solid #28E0FF",
          borderRadius: 18,
          background: "rgba(8,14,40,0.85)",
          boxShadow:
            "0 0 40px rgba(40,224,255,0.45), inset 0 0 30px rgba(40,224,255,0.15)",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#BFEFFF",
          fontSize: 38,
        }}
      >
        <div style={{ fontSize: 26, opacity: 0.6, marginBottom: 24 }}>
          ЧЕК #004812 · 08:41
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>КОФЕ</span>
          <span>190,00</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 18,
            color: "#3DFF9A",
            textShadow: "0 0 14px #3DFF9A",
          }}
        >
          <span>КРУАССАН</span>
          <span>+150,00</span>
        </div>
        <div
          style={{
            borderTop: "2px dashed rgba(191,239,255,0.3)",
            margin: "28px 0 18px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
          }}
        >
          <span>ИТОГО</span>
          <span>340,00</span>
        </div>
      </div>
      {/* график */}
      <svg
        width={600}
        height={200}
        style={{ position: "absolute", top: 820, left: 240 }}
      >
        <polyline
          points="0,170 100,160 200,150 300,140 380,120 440,60 520,40 600,10"
          fill="none"
          stroke="#3DFF9A"
          strokeWidth={8}
          style={{ filter: glow("#3DFF9A") }}
        />
        <text
          x={600}
          y={60}
          textAnchor="end"
          fontFamily={SANS}
          fontWeight={900}
          fontSize={44}
          fill="#3DFF9A"
        >
          средний чек ↑
        </text>
      </svg>
      {/* реплика */}
      <div
        style={{
          position: "absolute",
          top: 1030,
          left: 300,
          padding: "22px 34px",
          border: "3px solid #FF3DCB",
          borderRadius: 30,
          color: "#fff",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 48,
          background: "rgba(7,10,24,0.8)",
          boxShadow: "0 0 30px rgba(255,61,203,0.6)",
        }}
      >
        Круассан или маффин?
      </div>
      <Label n={4} name="Тёмный data-стиль" dark />
    </AbsoluteFill>
  );
};

// ============ 5. Мягкий 3D (клей) ============
export const RefClay: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(160deg, #FFE1D2 0%, #F3D9FF 55%, #D8E6FF 100%)",
    }}
  >
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="skin" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFE0C8" />
          <stop offset="1" stopColor="#E09A72" />
        </radialGradient>
        <radialGradient id="body1" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#9EF0DC" />
          <stop offset="1" stopColor="#23A98A" />
        </radialGradient>
        <radialGradient id="body2" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#FFC0A8" />
          <stop offset="1" stopColor="#F0644A" />
        </radialGradient>
        <radialGradient id="dough" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#FFE6A6" />
          <stop offset="1" stopColor="#E08A1E" />
        </radialGradient>
        <radialGradient id="cup" cx="30%" cy="30%" r="90%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D8D3EE" />
        </radialGradient>
        <radialGradient id="counter" cx="50%" cy="0%" r="120%">
          <stop offset="0" stopColor="#B9A6FF" />
          <stop offset="1" stopColor="#7A63E8" />
        </radialGradient>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="24"
            stdDeviation="22"
            floodColor="#6A4FB8"
            floodOpacity="0.28"
          />
        </filter>
      </defs>
      {/* бариста-«фасолька» */}
      <g filter="url(#soft)">
        <rect
          x={170}
          y={700}
          width={300}
          height={520}
          rx={150}
          fill="url(#body1)"
        />
        <circle cx={320} cy={600} r={140} fill="url(#skin)" />
        <path
          d="M 190 560 Q 320 430 450 560 Q 400 500 320 498 Q 240 500 190 560 Z"
          fill="#3B2A55"
        />
        <ellipse cx={275} cy={610} rx={14} ry={20} fill="#2B1E3F" />
        <ellipse cx={365} cy={610} rx={14} ry={20} fill="#2B1E3F" />
        <circle cx={280} cy={602} r={5} fill="#fff" />
        <circle cx={370} cy={602} r={5} fill="#fff" />
        <path
          d="M 290 660 Q 320 684 350 660"
          stroke="#8C3B2C"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* прилавок */}
      <g filter="url(#soft)">
        <rect
          x={40}
          y={1150}
          width={1000}
          height={460}
          rx={90}
          fill="url(#counter)"
        />
        <rect x={40} y={1150} width={1000} height={70} rx={35} fill="#D7CCFF" />
      </g>
      {/* стакан */}
      <g filter="url(#soft)">
        <path
          d="M 160 960 L 300 960 L 284 1160 L 176 1160 Z"
          fill="url(#cup)"
        />
        <rect x={164} y={1020} width={132} height={56} fill="#FF8A6B" />
        <ellipse cx={230} cy={960} rx={74} ry={22} fill="#EDE8FF" />
      </g>
      {/* круассан */}
      <g filter="url(#soft)">
        {[
          [-140, 30, 70],
          [-75, -20, 85],
          [0, -40, 95],
          [75, -20, 85],
          [140, 30, 70],
        ].map(([dx, dy, r], i) => (
          <ellipse
            key={i}
            cx={560 + dx}
            cy={1060 + dy}
            rx={r}
            ry={r * 0.78}
            fill="url(#dough)"
          />
        ))}
      </g>
      {/* маффин */}
      <g filter="url(#soft)" opacity={0.55}>
        <path
          d="M 820 1070 L 960 1070 L 940 1160 L 840 1160 Z"
          fill="#FF9BB7"
        />
        <ellipse cx={890} cy={1060} rx={84} ry={64} fill="#8A5634" />
      </g>
      {/* покупатель-«фасолька» */}
      <g filter="url(#soft)">
        <rect
          x={700}
          y={1360}
          width={320}
          height={560}
          rx={160}
          fill="url(#body2)"
        />
        <circle cx={860} cy={1260} r={150} fill="url(#skin)" />
        <path
          d="M 712 1230 Q 860 1080 1008 1230 Q 950 1170 860 1166 Q 770 1170 712 1230 Z"
          fill="#6B3B23"
        />
        <ellipse cx={815} cy={1270} rx={14} ry={20} fill="#2B1E3F" />
        <ellipse cx={905} cy={1270} rx={14} ry={20} fill="#2B1E3F" />
        <path
          d="M 830 1330 Q 860 1356 890 1330"
          stroke="#8C3B2C"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 720 1440 Q 640 1300 600 1170"
          stroke="url(#body2)"
          strokeWidth={70}
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
    {/* реплика */}
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 470,
        width: 520,
        padding: "34px 40px",
        borderRadius: 60,
        background: "linear-gradient(160deg, #FFFFFF, #F1ECFF)",
        boxShadow: "0 30px 60px rgba(106,79,184,0.25)",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 60,
        lineHeight: 1.1,
        color: "#3B2A55",
      }}
    >
      Круассан
      <br />
      или маффин?
    </div>
    <div
      style={{
        position: "absolute",
        top: 830,
        left: 470,
        padding: "16px 34px",
        borderRadius: 999,
        background: "linear-gradient(160deg, #FFE88A, #FFC23D)",
        boxShadow: "0 20px 40px rgba(240,160,40,0.35)",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 54,
        color: "#5A3A00",
      }}
    >
      ✓ +1 в чеке
    </div>
    <Label n={5} name="Мягкий 3D" />
  </AbsoluteFill>
);
