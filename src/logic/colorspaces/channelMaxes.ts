import { mapValues } from "lib";
import { ChannelName } from "./colorSpaces";

export interface ChannelMaxObject {
  /**
   * The maximum value for this channel in its unnormalized form,
   * such as 255 for RGB, 360 for hue, etc.
   */
  max: number;
  /**
   * The minimum value for this channel in its unnormalized form.
   * Is typically 0.
   */
  min?: number;
  /**
   * If true, the min and max depend on the values of the other channels.
   * Thus the min and max cannot always be reached for an arbitrary color.
   * True for a and b in LAB.
   */
  isVariable?: boolean;
  /**
   * If true, the values of this channel are cyclical such that
   * the min and the max are equal.
   * True for hue channel in all models.
   */
  isLooped?: boolean;
}

/**
 * Use a function to create maxes.
 * Assigns numbers to the max property. Does not fill in optional entries.
 * Previously inferred the ChannelName type from this map.
 * Now using the ChannelName from the color space map to ensure that every
 * channel name must be included.
 */
const createKeyedMaxes = (
  maxes: Record<ChannelName, number | ChannelMaxObject>
): Record<ChannelName, ChannelMaxObject> =>
  mapValues<Record<ChannelName, number | ChannelMaxObject>, ChannelMaxObject>(
    maxes,
    (v) => (typeof v === "number" ? { max: v } : v)
  );

/**
 * As things become better organized, I think that naming the channels separately for each colorspace doesn't make sense.
 * It only comes up if trying to get a value, ie. saturation, without specifying the color space.
 * Only need separate entries if the channel ranges differ, ie. cmyk yellow is out of 100 whereas ryb yellow is out of 255.
 */
export const STANDARD_MAXES = createKeyedMaxes({
  // note: chroma uses 1 max for cmyk while color-convert uses 100
  red: 255,
  green: 255,
  blue: 255,
  hue: {
    max: 360,
    isLooped: true,
  },
  saturation: 100,
  lightness: 100,
  value: 100,
  white: 100,
  cyan: 100,
  magenta: 100,
  yellow: 100,
  // note: cmyk black and hwb blackness seem to be equal, but need to double check
  black: 100,
  x: 95.05,
  z: 109,
  // aka "relative luminance" - from the XYZ color space
  luminosity: {
    max: 100,
    isVariable: true,
  },
  // from LAB & LCH - LAB refers to L as "lightness" while LCH refers to L as "luminance", but the numeric values are equal - it is the cube root of luminosity
  luminance: {
    // hard max at 100, but cannot always reach 100 without changing hue
    max: 100,
    isVariable: true,
  },
  intensity: 100,
  chroma: 133.9,
  chromaHcg: 100,
  a: {
    max: 98.25,
    min: -86,
    isVariable: true,
  },
  b: {
    max: 94.5,
    min: -108,
    isVariable: true,
  },
  gray: 100,
  yellowRyb: 255,
  pastel: 100,
});

/**
 * Instead of exporting the raw data, just export a lookup function.
 */
export const getChannelMaxes = (channel: ChannelName): ChannelMaxObject =>
  STANDARD_MAXES[channel];
