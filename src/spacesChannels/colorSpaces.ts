import {typedEntries, typedKeys, typedValues} from '../util';
import {CHANNEL_NAMES} from "./channelMaxes";
import {ChannelAccessor, ChannelCount, ChannelName, ChannelObjectAll, ChannelTuple, ColorSpaceName} from "./types";
import {flatten} from "lodash";

type ColorSpaceArrays = {
    [K in ColorSpaceName]-?: ChannelTuple<K>
};

/**
 * don't want to rely on any specific data structure as the root, but it is ok to export the data in a known format
 * if changing the data structure in the future, can rearrange into this format and export
 */
export const COLOR_SPACE_ARRAYS: ColorSpaceArrays = {
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

export const COLOR_SPACE_NAMES: ColorSpaceName[] = typedKeys(COLOR_SPACE_ARRAYS);

type KeyedAccessors = {
    [K in ChannelName]-?: ChannelAccessor[]
};

const getKeyedAccessors = (): KeyedAccessors => {
    const result = Object.fromEntries(CHANNEL_NAMES.map(name => [name, []] as [ChannelName, ChannelAccessor[]])) as KeyedAccessors;
    typedEntries(COLOR_SPACE_ARRAYS).forEach(([colorSpace, channels]) => {
        channels.forEach((channel, i) => {
            result[channel].push([colorSpace, i])
        })
    });
    return result;
};

const getAllChannels = (): ChannelObjectAll[] => {
    return typedEntries(getKeyedAccessors()).map( ([name, accessors]) => ({name, accessors}));
};

//don't need to recompute because it doesn't change
export const GROUPED_ACCESSORS = getAllChannels();

export const KEYED_ACCESSORS = getKeyedAccessors();

export const ALL_ACCESSORS: ChannelAccessor[] = flatten(typedValues(KEYED_ACCESSORS));


export const spacesWithChannel = (channel: ChannelName): ColorSpaceName[] => {
    return COLOR_SPACE_NAMES.filter(
        name => getSpaceChannels(name).includes(channel)
    );
};

export const getSpaceChannels = <CS extends ColorSpaceName>(cs: CS): ChannelTuple<CS> => {
    return COLOR_SPACE_ARRAYS[cs] as ChannelTuple<CS>;
};


export const channelCount = <CS extends ColorSpaceName>(cs: CS): ChannelCount<CS> => {
    return COLOR_SPACE_ARRAYS[cs].length as ChannelCount<CS>;
};

export const isColorSpace = (cs: any): cs is ColorSpaceName => {
    return typeof cs === "string" && COLOR_SPACE_ARRAYS.hasOwnProperty(cs);
};
