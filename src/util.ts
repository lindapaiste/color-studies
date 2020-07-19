import { round, isFunction, range } from "lodash";
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

/**
 * special casting to give support for tuples
 * ok because this function will not change the length (unless i outside tuple)
 */
export const replaceIndex = <T, AT extends T[]>(
  array: AT,
  i: number,
  value: T
): AT => {
  //export const replaceIndex = <T extends Array<any>>(array: T, i: number, value: Unpack<T>): T => {
  return Object.assign([...array], { [i]: value }) as AT;
};

/**
 * takes the element at the given index out of the array
 *
 * has side effects:
 * reduces the array length from n to n-1
 * changes the indexes of values past i
 */
export const removeIndex = <T>(array: T[], i: number): T[] => {
  return [...array.slice(0, i), ...array.slice(i + 1)];
};

export type Unpack<A> = A extends Array<infer E> ? E : A;

/**
 * expects the number to be a fraction of 1, but can be out of 100 with optional third parameter is100
 */
export const percentString = (
  float: number,
  decimals: number = 2,
  is100: boolean = false
) => {
  const percent = is100 ? float : 100 * float;
  const rounded = round(percent, decimals);
  return rounded + "%";
};

export const randomHex = (): string => {
  return chroma.random().hex();
};

export const randomRgb = (): RGB => [
  255 * Math.random(),
  255 * Math.random(),
  255 * Math.random()
];

type Entry<T> = { [K in keyof T]: [K & string, T[K]] }[keyof T];

type Entries<T> = Entry<T>[];

/**
 * applies TS type to Object.keys() if the key type is a subset of string
 * will not return number[] because Object.keys() casts the keys to strings
 */
export const typedKeys = <OT>(object: OT) => {
  return Object.keys(object) as Array<
    keyof OT extends string ? keyof OT : string
  >;
};
//export type KeyType<OT> = keyof OT extends string ? keyof OT : string;

export const typedEntries = <OT>(object: OT) => {
  return Object.entries(object) as Entries<OT>;
};

export const typedValues = <OT>(object: OT) => {
  return Object.values(object) as Array<OT[keyof OT]>;
};

export const makeArray = <T>(
  length: number,
  value: T | ((i: number) => T)
): T[] => {
  return [...new Array(length)].map((_, i) =>
    isFunction(value) ? value(i) : value
  );
};

/**
 * range with defined start and end and number of points
 * includes both min and max
 */
export const intervals = (
  start: number,
  end: number,
  count: number
): number[] => {
  const step = (end - start) / (count - 1);
  return [...new Array(count)].map((_, i) => start + i * step);
  //return range(start, end + step, step)
};

export const withHash = (hex: string): string => {
  return hex.substr(0, 1) === "#" ? hex : "#" + hex;
};

export const hasMethod = (obj: any, method: string): boolean => {
  //note: cannot use hasOwnProperty because the property might be inherited
  return typeof obj === "object" && isFunction(obj[method]);
};

export const isDefined = <T>(a: T | undefined): a is T => a !== undefined;
export const isUndefined = <T>(a: T | undefined): a is undefined =>
  a === undefined;


export type TypePropertyKeys<T, E> = {
  [K in keyof T]-?: Required<T>[K] extends E ? K : never
}[keyof T];

export const isNumberKey = <T>(key: keyof T, data: T): key is TypePropertyKeys<T, number> => {
  return typeof data[key] === "number";
}

export const isArrayKey = <T>(key: keyof T, data: T): key is TypePropertyKeys<T, any[]> => {
  return Array.isArray( data[key] );
}
