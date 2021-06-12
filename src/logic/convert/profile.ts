import { ColorAdapter } from "./ColorAdapter";
import { allChannels } from "../colorspaces/channels";
import { eitherToColor } from "./hex";
import { ChannelSlug } from "../colorspaces/colorSpaces";

/**
 * A keyed object where the keys are the keys for each channel and
 * the values are the corresponding non-normalized color values.
 */
export type ColorProfile = {
  [K in ChannelSlug]: number;
};

export const getProfile = (color: ColorAdapter): ColorProfile =>
  Object.fromEntries(
    allChannels().map((channel) => [channel.key, color.get(channel)])
  ) as ColorProfile;

export const logProfile = (color: ColorAdapter | string): void => {
  // use try catch because not all strings are valid colors
  try {
    const object = eitherToColor(color);
    // could also use alert here - alert allows \t and \n but not html
    console.log(getProfile(object));
  } catch (e) {
    console.log(e);
  }
};
