import chroma, { Scale, Color } from "chroma-js";
import { ChannelShiftSettings } from "./types";

/**
 * this depends on chroma-js at the moment
 * and channel is the key rather than the channel name
 */
export const channelShift = (
  channel: string,
  shift: number,
  max: number
): Scale => {
  const color = chroma.random();
  const initial = color.get(channel);
  //this needs to be tweaked if shift is more than half the max
  const shifted = color.set(
    channel,
    initial + shift > max ? initial - shift : initial + shift
  );
  console.log({ color, shifted });
  return chroma.scale([color, shifted]);
};

export const createColors = (props: ChannelShiftSettings): Color[] => {
  const { channel, channelMax, shift, colorCount } = props;
  const scale = channelShift(channel, shift, channelMax);
  return scale.colors(colorCount, null);
};
