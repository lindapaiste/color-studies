import {Color} from 'chroma-js';
import {typedKeys, typedValues} from '../util';
import {I_ConvertAdapter} from "./convert-adapter";

export type ChannelName = 'hue' | 'lightness' | 'saturationl' | 'saturationv' | 'blackness' | 'whiteness' | 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow' | 'intensity' | 'value' | 'chroma' | 'a' | 'b' | 'hueL' | 'saturationi' | 'luminance' | 'black' | 'grayness' | 'x' | 'y' | 'z'

export type VariableMaxChannel = 'a' | 'b'
export type FixedMaxChannel = Exclude<ChannelName, VariableMaxChannel>

type VariableMax = ((c: Color) => number)

export type Maximum = number | VariableMax;

export const isFixedMaxChannel = (channel: ChannelName): channel is FixedMaxChannel => {
    return typeof standardMaxes[channel] === 'number'
};

export const isVariableMaxChannel = (channel: ChannelName): channel is VariableMaxChannel => {
    return !isFixedMaxChannel(channel);
};

export const isFixedMaximum = (max: Maximum): max is number => {
    return typeof max === 'number'
};

export const isVariableMaximum = (max: Maximum): max is (c: Color) => number => {
    return !isFixedMaximum(max);
};

export type ChannelMaxes = {
    [K in ChannelName]-?: K extends VariableMaxChannel ? VariableMax : number
};

//TODO: chroma uses 1 max for cmyk while color-convert uses 100
const standardMaxes: ChannelMaxes = {
    red: 255,
    green: 255,
    blue: 255,
    hue: 360,
    hueL: 360,
    saturationl: 100,
    saturationv: 100,
    saturationi: 100,
    lightness: 100,
    value: 100,
    whiteness: 100,
    blackness: 100,
    cyan: 100,
    magenta: 100,
    yellow: 100,
    black: 100,
    x: 100,
    y: 100,
    z: 100,
    luminance: 0, //TODO find maxes
    intensity: 100,
    chroma: 0,
    a: c => 0, //TODO
    b: c => 0, //TODO
    grayness: 100,

};

export const getMax = (channel: FixedMaxChannel): number => {
  return standardMaxes[channel];
};
/*
export function standardMax(channel: FixedMaxChannel): number
export function standardMax(channel: VariableMaxChannel, color: Color): number
export function standardMax(channel: ChannelName, color: ChannelName extends VariableMaxChannel ? Color : Color | undefined): number {
    return isVariableMaxChannel(channel) ? standardMaxes[channel](color) : standardMaxes[channel];
}
*/

const colorSpaceChannels: Record<ColorSpaceName, Record<string, ChannelName>> = {
    rgb: {
        r: 'red',
        g: 'green',
        b: 'blue',
    },
    hsl: {
        h: 'hue',
        s: 'saturationl',
        l: 'lightness',
    },
    hsi: {
        h: 'hue',
        s: 'saturationi',
        i: 'intensity',
    },
    hsv: {
        h: 'hue',
        s: 'saturationv',
        v: 'value',
    },
    /**
     * note: LAB refers to L as "lightness" while LCH refers to L as "luminance", but the numeric value appear equal
     * LAB lightness is the cube root of relative luminance
     */
    lab: {
        l: 'luminance',
        a: 'a',
        b: 'b',
    },
    lch: {
        l: 'luminance',
        c: 'chroma',
        h: 'hueL'
    },
    cmyk: {
        c: 'cyan',
        m: 'magenta',
        y: 'yellow',
        b: 'black',
    },
    hwb: {
        h: 'hue',
        w: 'whiteness',
        b: 'blackness',
    },
    hcg: {
        h: 'hue',
        c: 'chroma',
        g: 'grayness',
    },
    xyz: {
        x: 'x',
        y: 'y',
        z: 'z',
    }
};

export const isColorSpace = (cs: string): cs is ColorSpaceName => {
    return colorSpaceChannels.hasOwnProperty(cs);
};

export const getColorSpace = (cs: ColorSpaceName): Record<string, ChannelName> => {
    return colorSpaceChannels[cs];
};

export const spacesWithChannel = (channel: ChannelName): ColorSpaceName[] => {
    return typedKeys( colorSpaceChannels ).filter(
        name => Object.values(colorSpaceChannels[name]).includes(channel)
    );
};

export const getSpaceChannels = <CS extends ColorSpaceName>(cs: CS): ChannelTuple<CS> => {
  return typedValues(getColorSpace(cs)) as ChannelTuple<CS>;
};

export const getChannelValue = (color: I_ConvertAdapter, channel: ChannelName ): number => {
  for ( let cs of typedKeys( colorSpaceChannels ) ) {
      const properties = Object.values(colorSpaceChannels[cs]);
      for ( let i = 0; i < properties.length; i++ ) {
          if (properties[i] === channel) {
              const values = color.to(cs);
              return values[i];
          }
      }
  }
  console.error( "cannot find channel " + channel );
  return 0;
    /*
    const csKey = typedKeys( colorSpaceChannels ).find(
        name => Object.values(colorSpaceChannels[name]).includes(channel)
    ) as ColorSpaceName; //assume always found
  const offset = Object.values(colorSpaceChannels[csKey])*/
};

export type ColorSpaceName = 'rgb' | 'hsl' | 'hsv' | 'hsi' | 'lab' | 'lch' | 'cmyk' | 'hwb' | 'xyz' | 'hcg';

export type ChannelCount<CS extends ColorSpaceName> = CS extends 'cmyk' ? 4 : 3;

export type Tuple<N, T> = N extends 3 ? [T, T, T] : N extends 4 ? [T, T, T, T] : never;

export type ColorTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, number>;

export type ChannelTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, ChannelName>;

export type ModelValues<CS extends ColorSpaceName> = {
    model: CS;
    channels: ChannelTuple<CS>;
    values: ColorTuple<CS>;
    maximums: ColorTuple<CS>;
}
