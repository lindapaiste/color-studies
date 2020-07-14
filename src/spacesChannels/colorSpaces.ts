import {typedKeys} from '../util';
import {getMaxOrFormula} from "./channelMaxes";
import {ChannelAccessor, ChannelName, ChannelObject, ChannelTuple, ColorSpaceName} from "./types";


/**
 * don't export this.  only local functions should rely on this data structure.  this makes it easy to change the structure
 */
const colorSpaceChannelsArrays: ColorSpaceArrays = {
    rgb: ['red', 'green', 'blue'],
    hsl: ['hue', 'saturationHsl', 'lightness'],
    hsi: ['hue', 'saturationHsi', 'intensity'],
    hsv: ['hue', 'saturationHsv', 'value'],
    lab: ['luminance', 'a', 'b'],
    lch: ['luminance', 'chroma', 'hueLch'],
    cmyk: ['cyan', 'magenta', 'yellow', 'black'],
    hwb: ['hue', 'whiteness', 'blackness'],
    hcg: ['hue', 'chromaHcg', 'grayness'],
    xyz: ['x', 'luminosity', 'z'],
};

export const COLOR_SPACE_NAMES: ColorSpaceName[] = typedKeys(colorSpaceChannelsArrays);

type ColorSpaceArrays = {
    [K in ColorSpaceName]-?: ChannelTuple<K>
};

export const isColorSpace = (cs: string): cs is ColorSpaceName => {
    return colorSpaceChannelsArrays.hasOwnProperty(cs);
};

export const spacesWithChannel = (channel: ChannelName): ColorSpaceName[] => {
    return COLOR_SPACE_NAMES.filter(
        name => getSpaceChannels(name).includes(channel)
    );
};

export const getSpaceChannels = <CS extends ColorSpaceName>(cs: CS): ChannelTuple<CS> => {
    return colorSpaceChannelsArrays[cs] as ChannelTuple<CS>;
};

/**
 * some channels will have multiple accessors, but just return the first match
 */
export const nameToAccessor = (channel: ChannelName): ChannelAccessor => {
    for (let cs of COLOR_SPACE_NAMES) {
        const channels = getSpaceChannels(cs);
        const i = channels.indexOf(channel);
        if (i !== -1) {
            return [cs, i];
        }
    }
    throw new Error("invalid channel " + channel);
};

export const accessorToName = (accessor: ChannelAccessor): ChannelName => {
    const [colorSpace, offset] = accessor;
    return getSpaceChannels(colorSpace)[offset];
};

const makeObject = <C extends ChannelName>(name: C, accessor: ChannelAccessor): ChannelObject<C> => {
    const [colorSpace, offset] = accessor;
    const maximum = getMaxOrFormula(name);
    return {
        name,
        maximum,
        colorSpace,
        offset,
        accessor
    }
};

export const nameToObject = <C extends ChannelName>(name: C): ChannelObject<C> => {
    const accessor = nameToAccessor(name);
    return makeObject(name, accessor);
};

export const objectToName = <C extends ChannelName>(object: ChannelObject<C>): C => {
    return object.name;
};

export const objectToAccessor = (object: ChannelObject<ChannelName>): ChannelAccessor => {
    //don't have to include accessor as a property, could just store colorSpace and offset
    return object.accessor;
};

//TS will not be able to infer channel name off of accessor
export const accessorToObject = (accessor: ChannelAccessor): ChannelObject<ChannelName> => {
    const name = accessorToName(accessor);
    return makeObject(name, accessor);
};
