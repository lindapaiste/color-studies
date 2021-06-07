import chroma from "chroma-js";
import { hasMethod, makeArray } from "lib";
import { IColorAdapter, CanGetHex } from "./types";
import { ColorAdapter } from "./ColorAdapter";

/**
 * checks if a color of unknown type fulfills the CanGetHex interface
 */
export const isGetHex = (obj: any): obj is CanGetHex => hasMethod(obj, "hex");

/**
 * make one random color
 */
export const randomColor = (): IColorAdapter =>
  new ColorAdapter(chroma.random());

/**
 * make an array of random colors
 */
export const randomColors = (count: number): IColorAdapter[] =>
  makeArray(count, randomColor);

/**
 * don't want to rely on the class itself, so avoid using new ColorAdapter in code
 */
export const hexToColor = (hex: string): IColorAdapter => new ColorAdapter(hex);

/**
 * convert a hex to color object while also accepting existing color objects
 */
export const eitherToColor = (color: string | IColorAdapter): IColorAdapter =>
  typeof color === "string" ? new ColorAdapter(color) : color;
