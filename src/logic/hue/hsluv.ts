import { makeHueShiftSet } from "./hue-shared";
import { ColorTuple } from "../colorspaces/types";

export const randomHsluv = (): ColorTuple<"hsl"> => [
  360 * Math.random(),
  20 + 80 * Math.random(), // ignore low numbers which are gray
  50 + 50 * Math.random(), // ignore low numbers which are black
];

export const randomMultiHueSet = (
  count: number,
  totalDiff: number
): ColorTuple<"hsl">[] => makeHueShiftSet(randomHsluv(), count, totalDiff);
