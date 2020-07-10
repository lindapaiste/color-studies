import { makeHueShiftSet } from "./hue-shared";
import {HSL} from "../util";

export const randomHsluv = (): HSL => [
  360 * Math.random(),
  20 + 80 * Math.random(), //ignore low numbers which are gray
  50 + 50 * Math.random() //ignore low numbers which are black
];

export const randomMultiHueSet = (count: number, totalDiff: number): HSL[] => {
  return makeHueShiftSet(randomHsluv(), count, totalDiff);
};
