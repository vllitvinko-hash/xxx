import React from "react";
import { AbsoluteFill } from "remotion";
import { useFormat, VERTICAL_VIEWBOX } from "./format";

export type Camera = { x?: number; y?: number; zoom?: number; rotate?: number };

// Scene artwork in 1920x1080 stage coordinates. Backgrounds should cover
// y -300..1400 so the taller vertical crop never shows an empty edge.
export const Stage: React.FC<{
  children: React.ReactNode;
  camera?: Camera;
  filter?: string;
  background?: string;
}> = ({ children, camera = {}, filter, background = "#000" }) => {
  const format = useFormat();
  const v = VERTICAL_VIEWBOX;
  const viewBox = format === "vertical" ? `${v.x} ${v.y} ${v.w} ${v.h}` : "0 0 1920 1080";
  const { x = 0, y = 0, zoom = 1, rotate = 0 } = camera;
  // Zoom around the stage centre, then pan.
  const transform = `translate(960 540) rotate(${rotate}) scale(${zoom}) translate(${-960 + x} ${-540 + y})`;
  return (
    <AbsoluteFill style={{ background, filter }}>
      <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "hidden" }}>
        <g transform={transform}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};
