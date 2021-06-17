import { createTool } from "components";
import { getChannel } from "logic";
import { randomGroupName } from "data";
import { HistogramControls } from "./HistogramControls";
import { GroupChannelHistogram } from "./GroupChannelHistogram";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export default createTool(
  {
    breakpoints: 6,
    group: randomGroupName(),
    channel: getChannel("hsl.l"),
  },
  HistogramControls,
  GroupChannelHistogram,
  "10%"
);
