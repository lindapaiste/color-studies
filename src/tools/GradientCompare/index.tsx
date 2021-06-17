import { createTool } from "components";
import { randomColors, randomModels } from "logic";
import { GradientCompareControls } from "./GradientCompareControls";
import { GradientModelCompare } from "./GradientModelCompare";

export default createTool(
  {
    count: 10,
    colors: randomColors(3),
    models: randomModels(2),
    transform: false,
  },
  GradientCompareControls,
  GradientModelCompare
);
