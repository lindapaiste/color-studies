import {round, isFunction} from "lodash";
import chroma from "chroma-js";

type Prefixes = "rgb" | "rgba" | "hsl" | "hsla";

export type HSL = [number, number, number];
export type RGB = [number, number, number];

export const makeColorString = (type: Prefixes) => (
  color: Array<string | number>
): string => {
  return type + "(" + color.join(",") + ")";
};

/**
 * hsl requires the % sign in the string
 */
export const hslToString = ([h, s, l]: [number, number, number]): string => {
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const replaceIndex = <T>(array: T[], i: number, value: T): T[] => {
  return Object.assign([...array], { [i]: value });
};

/**
 * expects the number to be a fraction of 1, but can be out of 100 with optional third parameter is100
 */
export const percentString = (float: number, decimals: number = 2, is100: boolean = false) => {
  const percent = is100 ? float : 100*float;
  const rounded = round(percent, decimals);
  return rounded + '%';
};

export const randomHex = (): string => {
  return chroma.random().hex();
};

export const randomRgb = (): RGB => [
    255 * Math.random(),
    255 * Math.random(),
    255 * Math.random()
];

type Entry<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T]

type Entries<T> = Entry<T>[];

/**
 * applies TS type to Object.keys() if the key type is a subset of string
 * will not return number[] because Object.keys() casts the keys to strings
 */
export const typedKeys = <OT>(object: OT) => {
    return Object.keys( object ) as Array<keyof OT extends string ? keyof OT : string>;
};
//export type KeyType<OT> = keyof OT extends string ? keyof OT : string;


export const typedEntries = <OT>(object: OT) => {
  return Object.entries(object) as Entries<OT>;
};

export const typedValues = <OT>(object: OT) => {
    return Object.values(object) as Array<OT[keyof OT]>;
};

export const makeArray = <T>(length: number, value: T | ((i: number) => T)): T[] => {
  return [...new Array(length)].map((_, i) => isFunction(value) ? value(i) : value);
};
