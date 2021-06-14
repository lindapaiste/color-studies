import { hasMethod } from "lib";
import { ColorAdapter } from "./ColorAdapter";

/**
 * Don't always need to require a full ColorAdapter.
 * Sometimes it is enough to require any object with a hex() method.
 */
export interface CanGetHex {
  hex(): string;
}

/**
 * checks if a color of unknown type fulfills the CanGetHex interface
 */
export const isGetHex = (obj: any): obj is CanGetHex => hasMethod(obj, "hex");

/**
 * don't want to rely on the class itself, so avoid using new ColorAdapter in code
 */
export const hexToColor = (hex: string): ColorAdapter => new ColorAdapter(hex);

/**
 * functions can accept either a ColorAdapter or a hex
 * and convert to the format that they need
 */
export type ColorArg = string | ColorAdapter;

/**
 * convert a hex to color object while also accepting existing color objects
 */
export const toColorAdapter = (color: ColorArg): ColorAdapter =>
  typeof color === "string" ? new ColorAdapter(color) : color;

/**
 * convert a color object to hex while also accepting existing hexes
 */
export const toHex = (color: ColorArg | CanGetHex): string =>
  typeof color === "string" ? color : color.hex();
