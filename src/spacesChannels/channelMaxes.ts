import {
  _ChannelMax,
  _Maximum,
  _VariableMax,
  ChannelMaxObject,
  ChannelName,
  FixedMaxChannel,
  I_Range,
  VariableMaxChannel,
} from "./types";
import { typedKeys } from "../lib";

export const isFixedMaxChannel = (
  channel: ChannelName
): channel is FixedMaxChannel =>
  typeof STANDARD_MAXES[channel] === "number" ||
  !getMaxObject(channel).isVariable;

export const isVariableMaxChannel = (
  channel: ChannelName
): channel is VariableMaxChannel => !isFixedMaxChannel(channel);

export const isFixedMaximum = (max: _Maximum): max is number =>
  typeof max === "number";

export const isVariableMaximum = (max: _Maximum): max is _VariableMax =>
  !isFixedMaximum(max);

/*
export function standardMax(channel: FixedMaxChannel): number
export function standardMax(channel: VariableMaxChannel, color: Color): number
export function standardMax(channel: ChannelName, color: ChannelName extends VariableMaxChannel ? Color : Color | undefined): number {
    return isVariableMaxChannel(channel) ? standardMaxes[channel](color) : standardMaxes[channel];
}
*/

export type ChannelMaxes = {
  [K in ChannelName]-?: number | (Partial<ChannelMaxObject> & { max: number });
};

const STANDARD_MAXES: ChannelMaxes = {
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
  black: 100,
  x: 95.05,
  z: 109,
  luminosity: {
    max: 100,
    isVariable: true,
  },
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
};

export const CHANNEL_NAMES = typedKeys(STANDARD_MAXES).sort();

export const _getMaxPartialObject = (
  channel: ChannelName
): Partial<ChannelMaxObject> & { max: number } => {
  const max = STANDARD_MAXES[channel];
  return typeof max === "number" ? { max } : max;
};

export const getMaxObject = (
  channel: ChannelName
): ChannelMaxObject & I_Range => {
  const max = STANDARD_MAXES[channel];
  const defaults = {
    min: 0,
    isVariable: false,
    isLooped: false,
  };
  if (typeof max === "number") {
    return {
      ...defaults,
      max,
    };
  } else
    return {
      ...defaults,
      ...max,
    };
};

export const getMaxOrFormula = <C extends ChannelName>(
  channel: C
): _ChannelMax<C> => {
  return STANDARD_MAXES[channel] as _ChannelMax<C>; // don't know why this "as" is needed, but it is
};

export const getMax = (channel: ChannelName): number =>
  getMaxObject(channel).max;

export const getMin = (channel: ChannelName): number =>
  getMaxObject(channel).min || 0;

export const isChannelName = (name: any): name is ChannelName =>
  typeof name === "string" && STANDARD_MAXES.hasOwnProperty(name);

/**
 * transforms into a number from 0 to 1
 * where 0 and 1 are the total min and max for the channel (not the limits for this color)
 */
export const normalize = (value: number, channel: ChannelName): number => {
  const { min, max } = getMaxObject(channel);
  return (value - min) / (max - min);
};

/**
 * transforms a normalized number from 0 to 1
 * back into an actual channel value (ie. 0-360, 0-100, etc.)
 */
export const deNormalize = (value: number, channel: ChannelName): number => {
  const { min, max } = getMaxObject(channel);
  return value * (max - min) + min;
};
