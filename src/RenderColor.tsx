import React from "react";
import Color from "color";
import { Swatch } from "./Swatch";
import { PROPERTIES } from "./grouping/analyzeColors";

export interface Props {
  color: Color;
}

export const RenderColor = ({ color }: Props) => {
  const string = (color: Color) => JSON.stringify(color.toJSON());
  return (
    <div>
      <Swatch color={color} size={100} />
      <ul>
        <li>{color.rgb().string()}</li>
        <li>{color.hsl().string()}</li>
        <li>{string(color.cmyk())}</li>
        <li>{string(color.hsv())}</li>
        <li>{string(color.lab())}</li>
        <li>{string(color.lch())}</li>
      </ul>
      <ul>
        {PROPERTIES.map(o => (
          <li key={o.key}>
            {o.name}: {o.getter(color)}
          </li>
        ))}
      </ul>
    </div>
  );
};
