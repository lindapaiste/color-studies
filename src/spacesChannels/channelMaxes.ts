import {
  _ChannelMax,
  _ChannelMaxes,
  ChannelName,
  FixedMaxChannel,
  _Maximum,
  _VariableMax,
  VariableMaxChannel,
  ChannelMaxObject,
  I_Range
} from "./types";
import { typedKeys } from "../lib";
import {I_ColorAdapter} from "../color/types";

export const isFixedMaxChannel = (
  channel: ChannelName
): channel is FixedMaxChannel => {
  return (
    typeof STANDARD_MAXES[channel] === "number" ||
    !getMaxObject(channel).isVariable
  );
};

export const isVariableMaxChannel = (
  channel: ChannelName
): channel is VariableMaxChannel => {
  return !isFixedMaxChannel(channel);
};

export const isFixedMaximum = (max: _Maximum): max is number => {
  return typeof max === "number";
};

export const isVariableMaximum = (max: _Maximum): max is _VariableMax => {
  return !isFixedMaximum(max);
};

/*
export function standardMax(channel: FixedMaxChannel): number
export function standardMax(channel: VariableMaxChannel, color: Color): number
export function standardMax(channel: ChannelName, color: ChannelName extends VariableMaxChannel ? Color : Color | undefined): number {
    return isVariableMaxChannel(channel) ? standardMaxes[channel](color) : standardMaxes[channel];
}
*/

export type ChannelMaxes = {
  [K in ChannelName]-?: number | (Partial<ChannelMaxObject> & { max: number })
};

const STANDARD_MAXES: ChannelMaxes = {
  //note: chroma uses 1 max for cmyk while color-convert uses 100
  red: 255,
  green: 255,
  blue: 255,
  hue: {
    max: 360,
    isLooped: true
  },
  hueLch: {
    max: 360,
    isLooped: true
  },
  saturationHsl: 100,
  saturationHsv: 100,
  saturationHsi: 100,
  lightness: 100,
  value: 100,
  whiteness: 100,
  blackness: 100,
  cyan: 100,
  magenta: 100,
  yellow: 100,
  black: 100,
  x: 95.05,
  z: 109,
  luminosity: {
    max: 100,
    isVariable: true
  },
  luminance: {
    //hard max at 100, but cannot always reach 100 without changing hue
    max: 100,
    isVariable: true
  },
  intensity: 100,
  chroma: 133.9,
  chromaHcg: 100,
  a: {
    max: 98.25,
    min: -86,
    isVariable: true
  },
  b: {
    max: 94.5,
    min: -108,
    isVariable: true
  },
  grayness: 100,
  redRyb: 255,
  yellowRyb: 255,
  blueRyb: 255,
};

export const CHANNEL_NAMES = typedKeys(STANDARD_MAXES).sort();

export const _getMaxPartialObject = ( channel: ChannelName ): Partial<ChannelMaxObject> & { max: number } => {
  const max = STANDARD_MAXES[channel];
  return typeof max === "number" ? {max} : max;
}

export const getMaxObject = (
  channel: ChannelName
): ChannelMaxObject & I_Range => {
  const max = STANDARD_MAXES[channel];
  const defaults = {
    min: 0,
    isVariable: false,
    isLooped: false
  };
  if (typeof max === "number") {
    return {
      ...defaults,
      max
    };
  } else
    return {
      ...defaults,
      ...max
    };
};

export const getMaxOrFormula = <C extends ChannelName>(
  channel: C
): _ChannelMax<C> => {
  return STANDARD_MAXES[channel] as _ChannelMax<C>; //don't know why this "as" is needed, but it is
};

export const getMax = (channel: ChannelName): number => {
  return getMaxObject(channel).max;
};

export const getMin = (channel: ChannelName): number => {
  return getMaxObject(channel).min || 0;
};

export const isChannelName = (name: any): name is ChannelName => {
  return typeof name === "string" && STANDARD_MAXES.hasOwnProperty(name);
};

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
  return value * (max - min ) + min;
};


/**
 * transforms a fuzz percent into a number
 * ie. 0.05 for hue => 18, 0.05 for saturation => 5
 * take into account the color-specific range?
 */
export const getAllowance = (channel: ChannelName, fuzzPercent: number, color?: I_ColorAdapter) => {
  const { min, max } = getMaxObject(channel);
  return (max - min) * fuzzPercent //is is divided by 100 or not?
}
