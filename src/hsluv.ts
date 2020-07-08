import { makeHueShiftSet } from "./hue-shared";
import { HueFirstTuple } from "./hue-shared";

export const randomHsluv = (): number[] & HueFirstTuple => [
  360 * Math.random(),
  20 + 80 * Math.random(), //ignore low numbers which are gray
  50 + 50 * Math.random() //ignore low numbers which are black
];

export const randomMultiHueSet = (count, totalDiff) => {
  return makeHueShiftSet(randomHsluv(), count, totalDiff);
};
