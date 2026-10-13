import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrutalButton, MONO } from "../brand";

// Кнопка сайта под карточкой канала — как в финале первого ролика.
export const SiteButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const btn = spring({ frame: frame - 40, fps, config: { damping: 9 } });
  const pulse = frame > 70 ? 1 + Math.sin((frame - 70) / 5) * 0.025 : 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 1640,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <BrutalButton text="analytic-pro.ru" scale={btn * pulse} />
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 600,
          fontSize: 32,
          color: "rgba(255,255,255,0.8)",
          opacity: btn,
        }}
      >
        бесплатный экспресс-разбор чеков
      </div>
    </div>
  );
};
