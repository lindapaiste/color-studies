import {typedKeys, typedValues} from '../util';
import {ChannelAccessor, ChannelName, ChannelTuple, ColorSpaceName} from "./types";


/**
 * don't export this.  only local functions should rely on this data structure.  this makes it easy to change the structure
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

const getColorSpace = (cs: ColorSpaceName): Record<string, ChannelName> => {
    return colorSpaceChannels[cs];
};

export const spacesWithChannel = (channel: ChannelName): ColorSpaceName[] => {
    return typedKeys(colorSpaceChannels).filter(
        name => Object.values(colorSpaceChannels[name]).includes(channel)
    );
};

export const getSpaceChannels = <CS extends ColorSpaceName>(cs: CS): ChannelTuple<CS> => {
    return typedValues(getColorSpace(cs)) as ChannelTuple<CS>;
};

/**
 * some channels will have multiple accessors, but just return the first match
 */
export const nameToAccessor = (channel: ChannelName): ChannelAccessor => {
    for (let cs of typedKeys(colorSpaceChannels)) {
        const properties = Object.values(colorSpaceChannels[cs]);
        for (let i = 0; i < properties.length; i++) {
            if (properties[i] === channel) {
                return [cs, i];
            }
        }
    }
    throw new Error("invalid channel " + channel);
    /*
const csKey = typedKeys( colorSpaceChannels ).find(
    name => Object.values(colorSpaceChannels[name]).includes(channel)
) as ColorSpaceName; //assume always found
const offset = Object.values(colorSpaceChannels[csKey])*/
};
