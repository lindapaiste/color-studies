//------------------------------HARD-CODED---------------------------------//

export type ColorSpaceName = 'rgb' | 'hsl' | 'hsv' | 'hsi' | 'lab' | 'lch' | 'cmyk' | 'hwb' | 'xyz' | 'hcg';

export type ChannelCount<CS extends ColorSpaceName> = CS extends 'cmyk' ? 4 : 3;

export type ChannelName =
    'hue'
    | 'lightness' | 'saturationHsl'
    | 'value' | 'saturationHsv'
    | 'intensity' | 'saturationHsi'
    | 'red' | 'green' | 'blue'
    | 'cyan' | 'magenta' | 'yellow' | 'black'
    | 'chroma' | 'chromaHcg' | 'a' | 'b' | 'hueLch'
    | 'luminance'  // from LAB & LCH - LAB refers to L as "lightness" while LCH refers to L as "luminance", but the numeric values are equal - it is the cube root of luminosity
    | 'luminosity' // aka "relative luminance" - from the XYZ color space
    | 'blackness' | 'whiteness' | 'grayness'
    | 'x' | 'z'


export type VariableMaxChannel = 'a' | 'b';

//------------------------------DEFINITIONS---------------------------------//

/**
 * gives a way to get or set a channel value, ie. ['rgb', 1]
 */
export type ChannelAccessor = [ColorSpaceName, number];



export type Tuple<N, T> = N extends 3 ? [T, T, T] : N extends 4 ? [T, T, T, T] : never;

export type ColorTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, number>;

export type FixedMaxChannel = Exclude<ChannelName, VariableMaxChannel>

export type _VariableMax = ((c: any) => number) //could rely on adapter here, but don't want to rely on package

export type _Maximum = number | _VariableMax;

export type _ChannelMax<T extends ChannelName> = T extends VariableMaxChannel ? _VariableMax : number

export type _ChannelMaxes = {
    [K in ChannelName]-?: _ChannelMax<K>
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
    maximum: _ChannelMax<C>;
    colorSpace: ColorSpaceName;
    offset: number;
    accessor: ChannelAccessor;
}

export interface ChannelMaxObject {
    max: number;
    min: number;
    isVariable?: boolean;
    isLooped?: boolean;
}

export interface I_Range {
    max: number;
    min: number;
}
