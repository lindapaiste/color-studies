//------------------------------HARD-CODED---------------------------------//

export type ColorSpaceName =
    'rgb'
    | 'hsl'
    | 'hsv'
    | 'hsi'
    | 'lab'
    | 'lch'
    | 'cmyk'
    | 'hwb'
    | 'xyz'
    | 'hcg'
    | 'ryb'
    | 'hsluv'
    | 'hpluv';

export type ChannelCount<CS extends ColorSpaceName> = CS extends 'cmyk' ? 4 : 3;

/**
 * as things become better organized, I think that naming the channels separately doesn't make sense
 * it only comes up if trying to get a value, ie. saturation, without specifying the color space
 * only need separate entries if the channel ranges differ, ie. cmyk yellow is out of 100 whereas ryb yellow is out of 255
 */
export type ChannelName =
//note: cmyk black and hwb blackness seem to be equal, but need to double check
    'hue' | 'saturation'
    | 'lightness' | 'value' | 'intensity'
    | 'red' | 'green' | 'blue'
    | 'cyan' | 'magenta' | 'yellow' | 'black'
    | 'chroma' | 'chromaHcg' | 'a' | 'b'
    | 'luminance'  // from LAB & LCH - LAB refers to L as "lightness" while LCH refers to L as "luminance", but the numeric values are equal - it is the cube root of luminosity
    | 'luminosity' // aka "relative luminance" - from the XYZ color space
    | 'white' | 'gray'
    | 'x' | 'z'
    | 'yellowRyb'
    | 'pastel'


export type VariableMaxChannel = 'a' | 'b';

//------------------------------DEFINITIONS---------------------------------//

/**
 * gives a way to get or set a channel value, ie. ['rgb', 1]
 */
export type ChannelAccessor = [ColorSpaceName, number];

/**
 * define it this way so that a tuple with four entries is always ok, even if only three are actually needed
 * previously TS would give a length mismatch error if passing [number x4] when expecting [number x3]
 */
type BasicTuple<T> = {
    0: T,
    1: T,
    2: T,
    3?: T,
}

/**
 * shared interface between tuple array and tuple class
 * class does not have all array methods, but does have access to indexed values
 */
export type TupleShared<CS extends ColorSpaceName, T = number> = CS extends 'cmky' ? Required<BasicTuple<T>> : BasicTuple<T>;

export type Tuple<N, T> = N extends 3 ? [T, T, T] : N extends 4 ? [T, T, T, T] : never;

export type ColorTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, number>;

export type ChannelCountTuple<CS extends ColorSpaceName, T> = Tuple<ChannelCount<CS>, T>;

export type FixedMaxChannel = Exclude<ChannelName, VariableMaxChannel>

export type _VariableMax = ((c: any) => number) //could rely on adapter here, but don't want to rely on package

export type _Maximum = number | _VariableMax;

export type _ChannelMax<T extends ChannelName> = T extends VariableMaxChannel ? _VariableMax : number

export type _ChannelMaxes = {
    [K in ChannelName]-?: _ChannelMax<K>
};

export type ChannelTuple<CS extends ColorSpaceName> = Tuple<ChannelCount<CS>, ChannelName>;

export interface ChannelObjectCS<C extends ChannelName> {
    name: C;
    maximum: _ChannelMax<C>;
    colorSpace: ColorSpaceName;
    offset: number;
    accessor: ChannelAccessor;
}

export interface ChannelObjectAll {
    name: ChannelName;
    accessors: ChannelAccessor[];
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
