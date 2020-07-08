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
