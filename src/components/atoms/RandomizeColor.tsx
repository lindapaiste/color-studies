import React from "react";
import { randomColor } from "logic/color";
import { IColorAdapter } from "logic/color/types";
import { IconTooltipButton } from "./IconTooltipButton";
import { RandomIcon } from "./Icons";

/**
 * randomize icon button from prop onChange
 */
export const RandomizeColor = ({
  onChange,
}: {
  onChange: (c: IColorAdapter) => void;
}) => (
  <IconTooltipButton
    title="Randomize Color"
    icon={<RandomIcon />}
    onClick={() => onChange(randomColor())}
  />
);
