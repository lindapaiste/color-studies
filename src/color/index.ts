import {I_ColorAdapter, I_GetHex} from "./types";
import {hasMethod, makeArray} from "../lib";
import chroma from "chroma-js";
import ColorAdapter from "./ColorAdapter";

/**
 * checks if a color of unknown type fulfills the I_GetHex interface
 */
export const isGetHex = (obj: any): obj is I_GetHex => hasMethod(obj, 'hex');

/**
 * make one random color
 */
export const randomColor = (): I_ColorAdapter => {
    return new ColorAdapter(chroma.random());
};

/**
 * make an array of random colors
 */
export const randomColors = (count: number): I_ColorAdapter[] => {
    return makeArray(count, randomColor);
};


/**
 * don't want to rely on the class itself, so avoid using new ColorAdapter in code
 */
export const hexToColor = (hex: string): I_ColorAdapter => {
    return new ColorAdapter(hex);
}

/**
 * convert a hex to color object while also accepting existing color objects
 */
export const eitherToColor = (color: string | I_ColorAdapter): I_ColorAdapter => {
    return typeof color === "string" ? new ColorAdapter(color) : color;
}
