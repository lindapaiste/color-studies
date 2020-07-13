import {ChannelMax, ChannelMaxes, ChannelName, FixedMaxChannel, Maximum, VariableMax, VariableMaxChannel} from "./types";

export const isFixedMaxChannel = (channel: ChannelName): channel is FixedMaxChannel => {
    return typeof standardMaxes[channel] === 'number'
};

export const isVariableMaxChannel = (channel: ChannelName): channel is VariableMaxChannel => {
    return !isFixedMaxChannel(channel);
};

export const isFixedMaximum = (max: Maximum): max is number => {
    return typeof max === 'number'
};

export const isVariableMaximum = (max: Maximum): max is VariableMax => {
    return !isFixedMaximum(max);
};

/*
export function standardMax(channel: FixedMaxChannel): number
export function standardMax(channel: VariableMaxChannel, color: Color): number
export function standardMax(channel: ChannelName, color: ChannelName extends VariableMaxChannel ? Color : Color | undefined): number {
    return isVariableMaxChannel(channel) ? standardMaxes[channel](color) : standardMaxes[channel];
}
*/

const standardMaxes: ChannelMaxes = { //note: chroma uses 1 max for cmyk while color-convert uses 100
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
export const getMaxOrFormula = <C extends ChannelName>(channel: C): ChannelMax<C> => {
    return standardMaxes[channel] as ChannelMax<C>; //don't know why this "as" is needed, but it is
};
export const getMax = (channel: FixedMaxChannel): number => {
    return standardMaxes[channel];
};
