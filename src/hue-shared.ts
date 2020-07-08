/**
 * defined such that it can be any length, but needs hue first
 */
export interface HueFirstTuple extends Array<any> {
  0: number;
}

/**
 * can take a number value OR a function that maps hue to a number
 * includes over 360 fix to make things easier
 */
export const replaceHue = <T extends HueFirstTuple>(
  color: T,
  replacement: ((hue: number, color: T) => number) | number
): T => {
  const newHue =
    typeof replacement === "number"
      ? replacement
      : replacement(color[0], color);
  const fixed = newHue > 360 ? newHue - 360 : newHue;
  return Object.assign([...color], { 0: fixed }) as T;
};
/**
 * originally designed for hsluv but works with any hue-first three tuple
 */
export const shiftHue = <T extends HueFirstTuple>(color: T, diff: number): T =>
  replaceHue(color, h => h + diff);

export const makeHueShiftSet = <T extends HueFirstTuple>(
  start: T,
  count: number,
  totalDiff: number
): T[] => {
  const eachDiff = totalDiff / (count - 1);
  return [...new Array(count)].map((_, i) => shiftHue(start, eachDiff * i));
};

/**
 * based off a generateColor function
 * that gets the index, the previously generated color, and all color generated up to this point
 * initial value is not included in the set -- should it be?
 */
export const generateSet = <T extends HueFirstTuple>(
  count: number,
  generateColor: (i: number, previous: T | null, all: T[]) => T,
  initial: T | null = null
): T[] => {
  const set: T[] = [];
  for (let i = 0; i < count; i++) {
    set.push(generateColor(i, i === 0 ? initial : set[i - 1], set));
  }
  return set;
};
