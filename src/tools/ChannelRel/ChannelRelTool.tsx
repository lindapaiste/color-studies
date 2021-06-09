import React from "react";
import { Tool } from "components";
import { ChannelRelControls } from "./ChannelRelControls";
import { ChannelRelPlot } from "./ChannelRelPlot";
import { initialSettings } from "./settings";

/**
 * see how changes to one channel impact another channel
 *
 * initially plotted lightness/luminosity relationship, but can apply that to any pairing
 */

export const ChannelRelTool = () => (
  <Tool
    initialSettings={initialSettings}
    RenderControls={ChannelRelControls}
    RenderContents={ChannelRelPlot}
  />
);
