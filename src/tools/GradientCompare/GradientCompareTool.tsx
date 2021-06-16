import React from "react";
import { Tool } from "components";
import { randomColors, randomModels } from "logic";
import { GradientCompareControls } from "./GradientCompareControls";
import { GradientModelCompare } from "./GradientModelCompare";

export const GradientCompareTool = () => (
  <Tool
    initialSettings={{
      count: 10,
      colors: randomColors(3),
      models: randomModels(2),
      transform: false,
    }}
    RenderControls={GradientCompareControls}
    RenderContents={GradientModelCompare}
  />
);
