import { createTool } from "components";
import { randomChannel } from "logic";
import { randomGroupName } from "data";
import { PlotFeatures } from "./PlotFeatures";
import { PlotFeaturesControls } from "./PlotFeaturesControls";

/**
 * tool allows dynamic creation of a PlotFeatures component
 * by allowing the user to select the group, two properties/channels (x and y)
 * and sample size (count) for the plot
 */
export default createTool(
  {
    colorCount: 100,
    group: randomGroupName(),
    xChannel: randomChannel(),
    yChannel: randomChannel(),
  },
  PlotFeaturesControls,
  PlotFeatures
);
