import { ChannelAdapter } from "../../logic/colorspaces/ChannelAdapter";
import { allChannels } from "../../logic/colorspaces/channels";

export interface Settings {
  channels: ChannelAdapter[];
  sampleSize: number;
  epochs: number;
  learningRate: number;
}

export const initialSettings: Settings = {
  sampleSize: 400,
  epochs: 50,
  learningRate: 0.5,
  channels: allChannels(),
};
