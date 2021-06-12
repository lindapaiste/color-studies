import React from "react";
import { Tool } from "components";
import { getChannel } from "logic/colorspaces/channels";
import { randomGroupName } from "data";
import { HistogramControls } from "./HistogramControls";
import { GroupChannelHistogram } from "./GroupChannelHistogram";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => (
  <Tool
    initialSettings={{
      breakpoints: 6,
      group: randomGroupName(),
      channel: getChannel("hsl.l"),
    }}
    RenderControls={HistogramControls}
    RenderContents={GroupChannelHistogram}
    toolPadding="10%"
  />
);

export default HistogramTool;
