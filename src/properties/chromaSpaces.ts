import {ColorSpaceName, getColorSpace, getMax, isColorSpace, isFixedMaxChannel, spacesWithChannel} from "./colorSpaces";
import {FixedMaxChannel, ChannelName} from "./colorSpaces";
import {ColorSpaces} from "chroma-js";
import {typedEntries, typedKeys} from "../util";

const chromaColorSpaces: ColorSpaceName[] = ['rgb', 'hsl', 'hsv', 'hsi', 'lab', 'lch', 'hcl', 'cmyk'];

const chromaMaxes: Partial<Record<FixedMaxChannel, number>> = {
    saturationl: 1,
    saturationv: 1,
    saturationi: 1,
    lightness: 1,
    value: 1,
    intensity: 1,
    cyan: 1,
    magenta: 1,
    yellow: 1,
    black: 1,
};

export const standardizeChromaValue = (channel: ChannelName, value: number): number => {
    //current setup means that variable max channels cannot come into play here
    if (!isFixedMaxChannel(channel)) {
        return value;
    }
    const override = chromaMaxes[channel];
    return override ? value * (getMax(channel) / override) : value;
};

export const isChromaSupportedColorSpace = (colorSpace: ColorSpaceName): colorSpace is ColorSpaceName & keyof ColorSpaces => {
    return chromaColorSpaces.includes(colorSpace);
};

export const isChromaSupportedChannel = (channel: ChannelName): boolean => {
  const spaces = spacesWithChannel(channel);
  return spaces.some(isChromaSupportedColorSpace);
};

/**
 * gets in the form of "hsl.l", "rgb.r", etc.
 */
export const channelToCode = (channel: ChannelName): string | null => {
    for ( let cs of chromaColorSpaces ) {
        const space = getColorSpace(cs);
        for ( let key of typedKeys(space) ) {
            if ( space[key] === channel ) {
                return cs + '.' + key;
            }
        }
    }
    return null;
};

/**
 * maps shorthand to channel name, ie. 'cmyk.y' => 'yellow'
 */
export const codeToChannel = (code: string): ChannelName | null => {
    const [colorSpace, letter] = code.split('.');
    if ( ! isColorSpace(colorSpace) ) {
        console.error("invalid color space " + colorSpace);
        return null;
    }
    const space = getColorSpace(colorSpace);
    if ( ! space.hasOwnProperty( letter) ) {
        console.error("invalid letter " + letter + " on color space " + colorSpace );
        return null;
    }
    return space[letter];
};
