import React from "react";
import { ColorAdapter } from "logic/convert";
import { IconTooltipButton } from "./IconTooltipButton";
import { RandomIcon } from "./Icons";
import { randomColor } from "../../logic/convert/random";

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
