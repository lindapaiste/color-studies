import {round} from "lodash";

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
