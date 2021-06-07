import React from "react";
import { ColorSet, TupleTooltip } from "components";
import { IGradient } from "logic/gradient/types";
import { IColorAdapter } from "logic/color/types";

export interface Props {
  count?: number;
  gradient: IGradient;
}

/**
 * gets the colors from the gradient object
 * uses the model values as the tooltip
 */
export const RenderGradientSet = ({ count = 10, gradient }: Props) => (
  <ColorSet<IColorAdapter>
    colors={gradient.colors(count)}
    colorToTooltip={(color) => TupleTooltip(color.toClassed(gradient.model))}
  />
);

export default RenderGradientSet;
