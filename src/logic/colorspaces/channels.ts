import { sample } from "lodash";
import { flatMap, sortBy } from "lib";
import { allModels, getModel } from "./models";
import { ChannelAdapter } from "./ChannelAdapter";
import { ChannelAccessor } from "./types";
import { ChannelSlug, ColorSpaceName } from "./colorSpaces";

/**
 * array of all channel objects, sorted by name
 */
const ALL_CHANNELS: ChannelAdapter[] = sortBy(
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
export const getChannel = (key: ChannelSlug): ChannelAdapter =>
  KEYED_CHANNELS[key];
// alternatively, return allChannels().find( channel => channel.key === key )

/**
 * A channel can be represented by:
 * - an adapter object
 * - an accessor array
 * - a string slug
 */
export type ChannelArg = ChannelAdapter | ChannelAccessor | ChannelSlug;

/**
 * helpers so that ColorAdapter and other can accept channel in multiple forms
 */

const slugToAccessor = (channel: ChannelSlug): ChannelAccessor => {
  const [cs, letter] = channel.split(".");
  return [cs as ColorSpaceName, cs.indexOf(letter)];
};

const accessorToChannel = (channel: ChannelAccessor): ChannelAdapter => {
  const [cs, offset] = channel;
  return getModel(cs).channels[offset];
};

export const toChannelAccessor = (channel: ChannelArg): ChannelAccessor => {
  if (typeof channel === "string") return slugToAccessor(channel);
  return Array.isArray(channel) ? channel : channel.accessor;
};

export const toChannelIndex = (channel: ChannelArg | number): number =>
  typeof channel === "number" ? channel : toChannelAccessor(channel)[1];

export const toChannelObject = (channel: ChannelArg): ChannelAdapter => {
  if (Array.isArray(channel)) return accessorToChannel(channel);
  if (typeof channel === "string")
    return accessorToChannel(slugToAccessor(channel));
  return channel;
};
