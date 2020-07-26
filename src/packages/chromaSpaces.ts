import {isColorSpace, spacesWithChannel} from "../spacesChannels/colorSpaces";
import {ChannelAccessor, ChannelName, ColorSpaceName, FixedMaxChannel} from "../spacesChannels/types";
import {ColorSpaces} from "chroma-js";
import {getMax, isFixedMaxChannel} from "../spacesChannels/channelMaxes";
import {accessorToName, nameToAccessor} from "../spacesChannels/accessorConversion";

const chromaColorSpaces: ColorSpaceName[] = ['rgb', 'hsl', 'hsv', 'hsi', 'lab', 'lch', 'cmyk'];

const chromaMaxes: Partial<Record<FixedMaxChannel, number>> = {
    saturationHsl: 1,
    saturationHsv: 1,
    saturationHsi: 1,
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
 * previously stored the channels with letter keys,
 * but now relying on the assumption that the color space name matches the channel letters
 */
export const nameToCode = (name: ChannelName): string => {
    return accessorToCode(nameToAccessor(name));
};

/**
 * maps shorthand to channel name, ie. 'cmyk.y' => 'yellow'
 */
export const codeToName = (code: string): ChannelName => {
    return accessorToName(codeToAccessor(code));
};

export const codeToAccessor = (code: string): ChannelAccessor => {
    const [colorSpace, letter] = code.split('.');
    const offset = colorSpace.indexOf(letter);
    if (!isColorSpace(colorSpace)) {
        throw new Error("invalid color space " + colorSpace);
    }
    if (offset === -1) {
        throw new Error("invalid letter " + letter + " on color space " + colorSpace);
    }
    return [colorSpace, offset];
};

export const accessorToCode = (accessor: ChannelAccessor): string => {
    const [colorSpace, offset] = accessor;
    const letter = colorSpace[offset];
    return colorSpace + '.' + letter;
};

/**
 * doesn't check if the channel is valid, just that it appears valid
 * because this is a text input, so there will be multiple partial entries before a complete one
 */
const isCompleteChannel = (string: string) =>
    string.match(/^\w{3,4}\.\w$/) !== null;
