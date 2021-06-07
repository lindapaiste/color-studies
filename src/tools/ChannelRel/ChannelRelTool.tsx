import React from "react";
import { ChannelAdapter } from "logic/spacesChannels/ChannelAdapter";
import { getChannel } from "logic/spacesChannels/channels";
import { Tool } from "components";
import { ChannelRelControls } from "./ChannelRelControls";
import { ChannelRelPlot } from "./ChannelRelPlot";

/**
 * see how changes to one channel impact another channel
 *
 * initially plotted lightness/luminosity relationship, but can apply that to any pairing
 */

export interface Settings {
  colorCount: number;
  stepCount: number;
  xChannel: ChannelAdapter;
  yChannel: ChannelAdapter;
}

const initialSettings: Settings = {
  xChannel: getChannel("hsl.l"),
  yChannel: getChannel("lab.l"),
  colorCount: 25,
  stepCount: 10,
};

export const ChannelRelTool = () => (
  <Tool
    initialSettings={initialSettings}
    RenderControls={ChannelRelControls}
    RenderContents={ChannelRelPlot}
  />
);
