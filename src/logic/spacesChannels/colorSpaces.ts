import { flatten, typedEntries, typedKeys, typedValues } from "lib";
import { CHANNEL_NAMES } from "./channelMaxes";
import {
  ChannelAccessor,
  ChannelCount,
  ChannelName,
  ChannelObjectAll,
  ChannelTuple,
  ColorSpaceName,
  ColorTuple,
} from "./types";

type ColorSpaceArrays = {
  [K in ColorSpaceName]-?: ChannelTuple<K>;
};

/**
 * don't want to rely on any specific data structure as the root, but it is ok to export the data in a known format
 * if changing the data structure in the future, can rearrange into this format and export
 */
export const COLOR_SPACE_ARRAYS: ColorSpaceArrays = {
  rgb: ["red", "green", "blue"],
  hsl: ["hue", "saturation", "lightness"],
  hsi: ["hue", "saturation", "intensity"],
  hsv: ["hue", "saturation", "value"],
  lab: ["luminance", "a", "b"],
  lch: ["luminance", "chroma", "hue"],
  cmyk: ["cyan", "magenta", "yellow", "black"],
  hwb: ["hue", "white", "black"],
  hcg: ["hue", "chromaHcg", "gray"],
  xyz: ["x", "luminosity", "z"],
  ryb: ["red", "yellowRyb", "blue"],
  hpluv: ["hue", "pastel", "luminosity"],
  hsluv: ["hue", "saturation", "luminosity"],
};
/**
 * not included:
 * CMY - has higher values in each channel than cmyk because they are added together to get the black
 * YUV
 * RYB
 */

export const COLOR_SPACE_NAMES: ColorSpaceName[] =
  typedKeys(COLOR_SPACE_ARRAYS);

type KeyedAccessors = {
  [K in ChannelName]-?: ChannelAccessor[];
};

const getKeyedAccessors = (): KeyedAccessors => {
  const result = Object.fromEntries(
    CHANNEL_NAMES.map((name) => [name, []] as [ChannelName, ChannelAccessor[]])
  ) as KeyedAccessors;
  typedEntries(COLOR_SPACE_ARRAYS).forEach(([colorSpace, channels]) => {
    channels.forEach((channel, i) => {
      result[channel].push([colorSpace, i]);
    });
  });
  return result;
};

const getAllChannels = (): ChannelObjectAll[] =>
  typedEntries(getKeyedAccessors()).map(([name, accessors]) => ({
    name,
    accessors,
  }));

// don't need to recompute because it doesn't change
export const GROUPED_ACCESSORS = getAllChannels();

export const KEYED_ACCESSORS = getKeyedAccessors();

export const ALL_ACCESSORS: ChannelAccessor[] = flatten(
  typedValues(KEYED_ACCESSORS)
);

export const spacesWithChannel = (channel: ChannelName): ColorSpaceName[] =>
  COLOR_SPACE_NAMES.filter((model) =>
    COLOR_SPACE_ARRAYS[model].includes(channel)
  );

export const getSpaceChannelNames = <CS extends ColorSpaceName>(
  cs: CS
): ChannelTuple<CS> => COLOR_SPACE_ARRAYS[cs] as unknown as ChannelTuple<CS>;

export const channelCount = <CS extends ColorSpaceName>(
  cs: CS
): ChannelCount<CS> => COLOR_SPACE_ARRAYS[cs].length as ChannelCount<CS>;

export const isColorSpace = (cs: any): cs is ColorSpaceName =>
  typeof cs === "string" && cs in COLOR_SPACE_ARRAYS;

/**
 * checks that the length of the array is enough for the color space
 * can include extra entries -- assumes that these will be ignored
 */
export const isValidTuple = <CS extends ColorSpaceName>(
  array: number[],
  cs: CS
): array is ColorTuple<CS> => array.length >= channelCount(cs);
