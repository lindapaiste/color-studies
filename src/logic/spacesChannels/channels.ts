import { sample } from "lodash";
import { flatMap, sortBy } from "lib";
import { allModels, getModel } from "./models";
import { ChannelAdapter } from "./ChannelAdapter";
import { ChannelAccessor, ChannelName } from "./types";

/**
 * array of all channel objects, sorted by name
 */
export const ALL_CHANNELS: ChannelAdapter[] = sortBy(
  flatMap(allModels(), (m) => m.channels),
  (c) => c.name
);

/**
 * a function makes things more flexible BUT don't need to re-sort or re-map every time it is called
 */
export const allChannels = () => ALL_CHANNELS;

/**
 * pick a random channel, usually for an initial value
 */
export const randomChannel = (): ChannelAdapter => sample(allChannels())!;

/**
 * object of channels keyed by channel key for easy lookup
 */
const KEYED_CHANNELS = Object.fromEntries(
  allChannels().map((channel) => [channel.key, channel])
);

/**
 * externalize creation of classes so that they don't need to be created more than once
 */

/**
 * assumes that the key is valid
 * Takes key in the form "hsl.s", "rgb.r", etc.
 */
export const getChannel = (key: string): ChannelAdapter => KEYED_CHANNELS[key];
// alternatively, return allChannels().find( channel => channel.key === key )

/**
 * helper so that ColorAdapter and other can accept channel in multiple forms
 */
export const eitherToAccessor = (
  channel: ChannelAdapter | ChannelAccessor
): ChannelAccessor => (Array.isArray(channel) ? channel : channel.accessor);

const accessorToChannel = (channel: ChannelAccessor): ChannelAdapter => {
  const [cs, offset] = channel;
  return getModel(cs).channels[offset];
};

export const eitherToObject = (
  channel: ChannelAdapter | ChannelAccessor
): ChannelAdapter =>
  Array.isArray(channel) ? accessorToChannel(channel) : channel;

export const eitherToName = (
  channel: ChannelName | ChannelAccessor | ChannelAdapter
): ChannelName =>
  typeof channel === "string" ? channel : eitherToObject(channel).name;
