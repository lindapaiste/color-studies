//------------------------------HARD-CODED---------------------------------//

export type ColorSpaceName = 'rgb' | 'hsl' | 'hsv' | 'hsi' | 'lab' | 'lch' | 'cmyk' | 'hwb' | 'xyz' | 'hcg';

export type ChannelCount<CS extends ColorSpaceName> = CS extends 'cmyk' ? 4 : 3;

export type ChannelName =
    'hue'
    | 'lightness' | 'saturationl'
    | 'value' | 'saturationv'
    | 'intensity' | 'saturationi'
    | 'red' | 'green' | 'blue'
    | 'cyan' | 'magenta' | 'yellow' | 'black'
    | 'chroma' | 'luminance' | 'a' | 'b' | 'hueL'
    | 'blackness' | 'whiteness' | 'grayness'
    | 'x' | 'y' | 'z'


export type VariableMaxChannel = 'a' | 'b';

//------------------------------DEFINITIONS---------------------------------//

/**
 * gives a way to get or set a channel value, ie. ['rgb', 1]
 */
export type ChannelAccessor = [ColorSpaceName, number];



export type Tuple<N, T> = N extends 3 ? [T, T, T] : N extends 4 ? [T, T, T, T] : never;

export type ColorTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, number>;

export type FixedMaxChannel = Exclude<ChannelName, VariableMaxChannel>

export type VariableMax = ((c: any) => number) //could rely on adapter here, but don't want to rely on package

export type Maximum = number | VariableMax;

export type ChannelMax<T extends ChannelName> = T extends VariableMaxChannel ? VariableMax : number

export type ChannelMaxes = {
    [K in ChannelName]-?: ChannelMax<K>
};

export type ChannelTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, ChannelName>;

export type ModelValues<CS extends ColorSpaceName> = {
    model: CS;
    channels: ChannelTuple<CS>;
    values: ColorTuple<CS>;
    maximums: ColorTuple<CS>;
}

export interface ChannelObject<C extends ChannelName> {
    name: C;
    maximum: ChannelMax<C>;
    colorSpace: ColorSpaceName;
    offset: number;
    accessor: ChannelAccessor;
}
