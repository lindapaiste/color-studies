import React from "react";
import Color from "color";

export interface Props {
  color: Color | string;
  size: number;
}
export const Swatch = ({ color, size }: Props) => (
  <div
    style={{
      backgroundColor:
        typeof color === "string" ? color : color.string(),
      width: size + "px",
      height: size + "px"
    }}
  />
);
