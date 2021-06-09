import { mapValues, typedKeys, typedValues, uniq } from "lib";

// ------------------------------DATA---------------------------------//

/**
 * don't want to rely on any specific data structure as the root, but it is ok to export the data in a known format
 * if changing the data structure in the future, can rearrange into this format and export
 *
 * Channels must be listed in the correct order for the lookup by slug to work,
 * given the current assumptions in the implementation.
 */
export const COLOR_SPACE_ARRAYS = {
  rgb: ["red", "green", "blue"],
  hsl: ["hue", "saturation", "lightness"],
  hsi: ["hue", "saturation", "intensity"],
  hsv: ["hue", "saturation", "value"],
  lab: ["luminance", "a", "b"],
  lch: ["luminance", "chroma", "hue"],
  cmyk: ["cyan", "magenta", "yellow", "black"],
  hwb: ["hue", "white", "black"],
  hcg: ["hue", "chromaHcg", "gray"],
  xyz: ["x", "luminosity", "z"], // TODO: figure out how to have "xyz.y" as the slug and still use luminosity settings.
  ryb: ["red", "yellowRyb", "blue"],
  hpluv: ["hue", "pastel", "luminosity"],
  hsluv: ["hue", "saturation", "luminosity"],
} as const;
/**
 * not included:
 * CMY - has higher values in each channel than cmyk because they are added together to get the black
 * YUV
 */

// ----------------------------DERIVED TYPES-------------------------------//

/**
 * Can derive the TypeScript types from the object.
 */
type CsMap = typeof COLOR_SPACE_ARRAYS;

/**
 * Union type of all lowercase 3/4-letter color space names.
 */
export type ColorSpaceName = keyof CsMap;

/**
 * Union type of all channel names.
 */
export type ChannelName = {
  [K in keyof CsMap]: CsMap[K] extends readonly (infer T)[] ? T : never;
}[keyof CsMap];

/**
 * Helper utility type to get the first letter of the channel.
 */
type FirstLetter<S> = S extends `${infer L}${string}` ? L : never;

/**
 * Union type of all CS-channel slugs, like 'rgb.b', 'hsl.h', etc.
 */
export type ChannelSlug = {
  [K in keyof CsMap]: CsMap[K] extends readonly (infer T)[]
    ? `${K}.${FirstLetter<T>}`
    : never;
}[keyof CsMap];

// ----------------------------DERIVED VALUES-------------------------------//

/**
 * Array of color space names.
 */
export const COLOR_SPACE_NAMES: ColorSpaceName[] =
  typedKeys(COLOR_SPACE_ARRAYS).sort();

/**
 * Array of all channel names, deduplicated.
 */
export const CHANNEL_NAMES: ChannelName[] = uniq(
  typedValues(COLOR_SPACE_ARRAYS).flat().sort()
);

/**
 * Channel slugs, keyed by channel.
 */
export const KEYED_SLUGS: Record<ColorSpaceName, ChannelSlug[]> = mapValues(
  COLOR_SPACE_ARRAYS,
  (channels, cs) =>
    channels.map((channel) => `${cs}.${channel.substr(0, 1)}` as ChannelSlug)
);

/**
 * Array of all channel slugs.
 */
export const CHANNEL_SLUGS: ChannelSlug[] = typedValues(KEYED_SLUGS).flat();
