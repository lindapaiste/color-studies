import { getChannel } from "../../logic/spacesChannels/channels";
import { ChannelAdapter } from "../../logic/spacesChannels/ChannelAdapter";

export interface Settings {
  colorCount: number;
  stepCount: number;
  xChannel: ChannelAdapter;
  yChannel: ChannelAdapter;
}

export const initialSettings: Settings = {
  xChannel: getChannel("hsl.l"),
  yChannel: getChannel("lab.l"),
  colorCount: 25,
  stepCount: 10,
};
