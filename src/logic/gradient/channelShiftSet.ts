import { ChannelShiftSettings } from "../boxSets/types";
import { ChannelGradient } from "./ChannelGradient";
import { ColorAdapter, randomColor } from "../convert";
import { ChannelAdapter } from "../colorspaces";

const getEnds = (
  initial: ColorAdapter,
  channel: ChannelAdapter,
  shift: number
) => {
  // initial is either start or end depending on what side (min or max) it's closer to
  // if the shift is more than half of the channel width, then may need to go beyond the initial regardless
  // deal with that later because this function is barely used now
  const iValue = initial.get(channel);
  if (iValue + shift > channel.max) {
    return {
      start: iValue - shift,
      end: iValue,
    };
  }
  return {
    start: iValue,
    end: iValue + shift,
  };
};

export const createColors = (props: ChannelShiftSettings): ColorAdapter[] => {
  const { channel, shift, colorCount } = props;
  const initial = randomColor();
  const { start, end } = getEnds(initial, channel, shift);
  const gradient = new ChannelGradient({
    initial,
    channel,
    start,
    end,
  });
  return gradient.colors(colorCount);
};
