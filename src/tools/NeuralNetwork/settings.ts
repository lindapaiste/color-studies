import { allChannels, ChannelAdapter } from "logic";

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
