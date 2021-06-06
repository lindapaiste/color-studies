import { Color } from "chroma-js";


/**
 * makes sure that hue is a number greater than or equal to 0 and less than or equal to 360
 * given the circular nature of hue, this can be done without clamping
 * note: returns 360 instead of 0 for negatives, but 0 instead of 360 for positives
 */
export const fixHue = (hue: number): number => hue > 0 ? hue % 360 : (hue % 360) + 360;

/**
 * hue is unique in that it is cyclical, with 360 = 0
 * so it is ok to overflow over the max
 */
export const nextHue = (initial: Color, shift: number): Color => {
  const hue = initial.get("hsl.h");
  return initial.set("hsl.h", fixHue(hue + shift));
};

export const hueSet = (
  initial: Color,
  count: number,
  totalShift: number = 360
): Color[] => {
  if (count <= 1) return [initial]; // avoid divide by 0 error
  return [...new Array(count)].map((i) =>
    nextHue(initial, (i * totalShift) / (i - 1))
  );
};

export const hueDiff = (a: number, b: number): number => {
  const raw = Math.abs(a - b) % 360;
  return raw > 180 ? 360 - raw : raw;
};
