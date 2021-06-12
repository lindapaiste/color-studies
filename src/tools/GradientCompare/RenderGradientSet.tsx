import React from "react";
import { ColorSet, tupleTooltipFactory } from "components";
import { IGradient } from "logic/gradient/types";
import { ColorAdapter } from "logic";

export interface Props {
  count?: number;
  gradient: IGradient;
}

/**
 * gets the colors from the gradient object
 * uses the model values as the tooltip
 */
export const RenderGradientSet = ({ count = 10, gradient }: Props) => (
  <ColorSet<ColorAdapter>
    colors={gradient.colors(count)}
    colorToTooltip={tupleTooltipFactory(gradient.model)}
  />
);
