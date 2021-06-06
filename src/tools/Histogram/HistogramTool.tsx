import React from "react";
import { HistogramControls } from "./HistogramControls";
import { Tool } from "../../sharedComponents/tool/Tool";
import { GroupChannelHistogram } from "./GroupChannelHistogram";
import { getChannel } from "../../spacesChannels/channels";
import { randomGroup } from "../../grouping";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => (
  <Tool
    initialSettings={{
      breakpoints: 6,
      group: randomGroup().name,
      channel: getChannel("hsl.l"),
    }}
    RenderControls={HistogramControls}
    RenderContents={GroupChannelHistogram}
    toolPadding={"10%"}
  />
);

export default HistogramTool;
