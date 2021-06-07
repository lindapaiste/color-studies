import { ChannelAccessor } from "./types";
import { isChannelName } from "./channelMaxes";
import { channelCount } from "./colorSpaces";

/**
 * only check that it matches the TS interface, but doesn't check for offset validity
 */
export const isAccessor = (accessor: any): accessor is ChannelAccessor => {
  if (!Array.isArray(accessor)) {
    return false;
  }
  const [channel, offset] = accessor;
  return isChannelName(channel) && typeof offset === "number";
};

export const isValidAccessor = (accessor: ChannelAccessor): boolean => {
  const [channel, offset] = accessor;
  const count = channelCount(channel);
  return offset >= 0 && offset < count;
};
