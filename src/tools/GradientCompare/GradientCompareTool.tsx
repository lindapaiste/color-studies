import React from "react";
import { Tool } from "components";
import { ModelAdapter } from "logic/spacesChannels/ModelAdapter";
import { ColorSpaceName } from "logic/spacesChannels/types";
import { IColorAdapter } from "logic/color/types";
import { randomColors } from "logic/color";
import { GradientCompareControls } from "./GradientCompareControls";
import { GradientModelCompare } from "./GradientModelCompare";

/**
 * observations:
 * lab ( followed by rgb ) has the smoothest transition, though intermediate colors can appear dingy
 * hsv and hsl have good results on hue shift scales because intermediates are just as bright
 * hcl can have problem with intermediate cyans being too bright, while hsv appears to tone it down a bit more
 * hcl has much more consistent tone tha hsv on purple to orange and green to red
 *
 * difference is most obvious from royal blue to yellow
 * rgb goes though lighter blues
 * lab through lilacs
 * hcl through bright purple, pink, orange
 * hsv through cyan and green
 */

export interface Props {
  colors: IColorAdapter[];
  count?: number;
  models?: ModelAdapter<ColorSpaceName>[];
  transform?: boolean;
}

export const GradientCompareTool = () => (
  <Tool
    initialSettings={{
      count: 10,
      colors: randomColors(3),
    }}
    RenderControls={GradientCompareControls}
    RenderContents={GradientModelCompare}
  />
);
