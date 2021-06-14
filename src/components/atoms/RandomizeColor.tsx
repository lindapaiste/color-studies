import React from "react";
import { ColorAdapter, randomColor } from "logic";
import { IconTooltipButton } from "./IconTooltipButton";
import { RandomIcon } from "./Icons";

/**
 * randomize icon button from prop onChange
 */
export const RandomizeColor = ({
  onChange,
}: {
  onChange: (c: ColorAdapter) => void;
}) => (
  <IconTooltipButton
    title="Randomize Color"
    icon={<RandomIcon />}
    onClick={() => onChange(randomColor())}
  />
);
