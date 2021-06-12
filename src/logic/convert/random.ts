import chroma from "chroma-js";
import { makeArray } from "lib";
import { ColorAdapter } from "./ColorAdapter";

/**
 * make one random color
 */
export const randomColor = (): ColorAdapter =>
  new ColorAdapter(chroma.random());

/**
 * make an array of random colors
 */
export const randomColors = (count: number): ColorAdapter[] =>
  makeArray(count, randomColor);
