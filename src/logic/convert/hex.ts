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
 * convert a hex to color object while also accepting existing color objects
 */
export const eitherToColor = (color: string | ColorAdapter): ColorAdapter =>
  typeof color === "string" ? new ColorAdapter(color) : color;
