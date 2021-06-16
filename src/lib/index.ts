import { isFunction, round } from "lodash";
import { ColorTuple } from "../logic";

export {
  shuffle,
  partition,
  flatMap,
  sampleSize,
  range,
  random,
  round,
  startCase as proper,
  sortBy,
  groupBy,
  isFunction,
  flatten,
  isEqual,
  identity,
  clamp,
  debounce,
  find,
  findIndex,
  mapValues,
  pick,
  omit,
  sample,
  omitBy,
  uniq,
  orderBy,
  keyBy,
} from "lodash";
export { mean, standardDeviation } from "simple-statistics";
export * from "./usePartialState";
export * from "./useDimensions";
// for back compat
export type HSL = ColorTuple<"hsl">;
export type RGB = ColorTuple<"rgb">;

/**
 * special casting to give support for tuples
 * ok because this function will not change the length (unless i outside tuple)
 */
export const replaceIndex = <T, AT extends T[]>(
  array: AT,
  i: number,
  value: T
): AT => Object.assign([...array], { [i]: value }) as AT;

/**
 * takes the element at the given index out of the array
 *
 * has side effects:
 * reduces the array length from n to n-1
 * changes the indexes of values past i
 */
export const removeIndex = <T>(array: T[], i: number): T[] => [
  ...array.slice(0, i),
  ...array.slice(i + 1),
];

export type Unpack<A> = A extends Array<infer E> ? E : A;

export type NonEmpty<A> = A & { 0: Unpack<A> };

export type NonEmptyArray<T> = T[] & [T];

export const isNotEmpty = <T>(array: T[]): array is NonEmptyArray<T> =>
  array.length > 0;

/**
 * lodash version returns T | undefined
 * JS array[i] return T even though it could be undefined
 * could define the last() function such that it knows it cannot return undefined only if the array cannot be empty
 * ...but can't get this quite right...
 */
export const last = <T>(
  array: T[]
): typeof array extends NonEmptyArray<T> ? T : T | undefined =>
  isNotEmpty(array) ? array[array.length - 1] : undefined;

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
  return `${rounded}%`;
};

type Entry<T> = { [K in keyof T]: [K & string, T[K]] }[keyof T];

type Entries<T> = Entry<T>[];

/**
 * applies TS type to Object.keys() if the key type is a subset of string
 * will not return number[] because Object.keys() casts the keys to strings
 */
export const typedKeys = <OT>(object: OT) =>
  Object.keys(object) as Array<keyof OT extends string ? keyof OT : string>;
// export type KeyType<OT> = keyof OT extends string ? keyof OT : string;

export const typedEntries = <OT>(object: OT) =>
  Object.entries(object) as Entries<OT>;

export const typedValues = <OT>(object: OT) =>
  Object.values(object) as Array<OT[keyof OT]>;

export const makeArray = <T>(
  length: number,
  value: T | ((i: number) => T)
): T[] =>
  [...new Array(length)].map((_, i) => (isFunction(value) ? value(i) : value));

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
  return makeArray(count, (i) => start + i * step);
};

export const withHash = (hex: string): string =>
  hex.substr(0, 1) === "#" ? hex : `#${hex}`;

export const hasMethod = (obj: any, method: string): boolean =>
  // note: cannot use hasOwnProperty because the property might be inherited
  typeof obj === "object" && isFunction(obj[method]);

export const isDefined = <T>(value: T | undefined): value is T =>
  value !== undefined;
export const isUndefined = <T>(value: T | undefined): value is undefined =>
  value === undefined;

export const ifDefined = <T, B>(value: T | undefined, fallback: B): T | B =>
  isDefined(value) ? value : fallback;

export type TypePropertyKeys<T, E> = {
  [K in keyof T]-?: Required<T>[K] extends E ? K : never;
}[keyof T];

export const isNumberKey = <T>(
  key: keyof T,
  data: T
): key is TypePropertyKeys<T, number> => typeof data[key] === "number";

export const isArrayKey = <T>(
  key: keyof T,
  data: T
): key is TypePropertyKeys<T, any[]> => Array.isArray(data[key]);

/**
 * is basically the same as array map except that it preserves the type ( length )
 * of the input so that TS knows it is the same
 * use carefully - if T is anything beyond a tuple then it is NOT guaranteed that type T is really preserved
 * as written, cannot cast tuple to a different type of same length
 */
export const tupleMap = <T extends any[]>(
  array: T,
  mapper: ((value: T[number], index: number, tuple: T) => T[number]) | T[number]
): T => {
  const callback = isFunction(mapper) ? mapper : () => mapper;
  return array.map(callback as any) as T;
};

export type SelectivePartial<T, U extends keyof T> = Omit<T, U> &
  Partial<Pick<T, U>>;

/**
 * the property has to be set, but can be set to undefined
 */
export type MaybeUndefined<T> = {
  [P in keyof T]-?: T[P] | undefined;
};

export type NoUndefined<T> = {
  [P in keyof T]-?: Exclude<T[P], undefined>;
};

/**
 * checks that a MaybeUndefined<> interface does not actually have an undefined values
 * WILL NOT WORK IF THE KEY IS MISSING RATHER THAN UNDEFINED,
 * so can't use the same check on Partial<>
 */
export const isComplete = <T>(props: T): props is NoUndefined<T> =>
  Object.values(props).every(isDefined);

export interface Size {
  width: number;
  height: number;
}
