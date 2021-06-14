import React from "react";
import { Tool } from "components";
import { randomColors } from "logic";
import { GradientCompareControls } from "./GradientCompareControls";
import { GradientModelCompare } from "./GradientModelCompare";

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
