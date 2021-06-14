import { ColorSpaceName } from "./colorSpaces";

// ------------------------------HARD-CODED---------------------------------//

export type ChannelCount<CS extends ColorSpaceName> = CS extends "cmyk" ? 4 : 3;

// ------------------------------DEFINITIONS---------------------------------//

/**
 * gives a way to get or set a channel value, ie. ['rgb', 1]
 */
export type ChannelAccessor = [ColorSpaceName, number];

/**
 * define it this way so that a tuple with four entries is always ok, even if only three are actually needed
 * previously TS would give a length mismatch error if passing [number x4] when expecting [number x3]
 */
export type BasicTuple<T> = {
  0: T;
  1: T;
  2: T;
  3?: T;
};

/**
 * shared interface between tuple array and tuple class
 * class does not have all array methods, but does have access to indexed values
 */

export type Tuple<N, T> = N extends 3
  ? [T, T, T]
  : N extends 4
  ? [T, T, T, T]
  : [T, T, T, T] | [T, T, T];

export type ColorTuple<CS extends ColorSpaceName = ColorSpaceName> = Tuple<
  ChannelCount<CS>,
  number
>;

export type ChannelCountTuple<CS extends ColorSpaceName, T> = Tuple<
  ChannelCount<CS>,
  T
>;
