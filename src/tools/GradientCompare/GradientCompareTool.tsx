import React from "react";
import { ModelAdapter } from "../../spacesChannels/ModelAdapter";
import { ColorSpaceName } from "../../spacesChannels/types";
import { Tool } from "../../sharedComponents/tool/Tool";
import { GradientCompareControls } from "./GradientCompareControls";
import GradientModelCompare from "./GradientModelCompare";
import { I_ColorAdapter } from "../../color/types";
import { randomColors } from "../../color";

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
  colors: I_ColorAdapter[];
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
