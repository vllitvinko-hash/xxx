import React, { createContext, useContext } from "react";

export type Format = "landscape" | "vertical";

export const FormatContext = createContext<Format>("landscape");

export const useFormat = () => useContext(FormatContext);

// Stage coordinates are 1920x1080. The vertical cut shows the middle of the
// stage, scaled up, so key objects must stay roughly within x 530..1390.
export const VERTICAL_VIEWBOX = { x: 528, y: -228, w: 864, h: 1536 };

export const FONT_DISPLAY = "'Russo One', sans-serif";
export const FONT_TEXT = "'Rubik', sans-serif";
export const FONT_ROMAN = "'Cormorant SC', serif";

export const C = {
  ink: "#24160d",
  marble: "#efe6d6",
  marbleShade: "#d9cbb3",
  gold: "#e2b53e",
  goldDark: "#a97c1c",
  purple: "#6b2d8c",
  purpleDark: "#4a1d63",
  red: "#b3261e",
  skin: "#ebbe95",
  skinShade: "#cf9a70",
  toga: "#f4f1ea",
  togaShade: "#d8d2c4",
  sky: "#9fd3ef",
  green: "#5e8c3a",
};

export const FormatProvider: React.FC<{ format: Format; children: React.ReactNode }> = ({
  format,
  children,
}) => <FormatContext.Provider value={format}>{children}</FormatContext.Provider>;
