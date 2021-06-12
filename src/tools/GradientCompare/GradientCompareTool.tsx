import React from "react";
import { Tool } from "components";
import { GradientCompareControls } from "./GradientCompareControls";
import { GradientModelCompare } from "./GradientModelCompare";
import { randomColors } from "../../logic/convert/random";

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
