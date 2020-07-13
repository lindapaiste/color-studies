import {GroupColorAnalysis} from "../grouping/analyzeColors";

/**
 * make generic interfaces so that the project is not so heavily tied to any one color package (ie. color.js vs chroma.js)
 */

export interface ColorPropGetter<T> {
    (c: T): number;
}

export interface ColorPropSetter<T> {
    (c: T, value: number): T;
}

export type ColorPropKey = keyof GroupColorAnalysis & string; //"hue" | "wheelHue" | "luminosity" | "lightness" | "saturationl" | "saturationv" | "blackness" | "whiteness"

export interface ColorPropDef<T> {
    name: string;
    key: ColorPropKey;
    getter: ColorPropGetter<T>;
    setter: ColorPropSetter<T>;
    range: number | ((c: T) => number); //some packages have variable range, so must calculate individually only providing the max value because assuming that all start at 0
}

export type PackageDefs<T> = ColorPropDef<T>[]; //Record<ColorPropKey, ColorPropDef<T>>

export interface PackageUtil<T> {
    //maybe include packages such that some can be different?
    propertyKeys: ColorPropKey[];
    getTitle(property: ColorPropKey): string;
    getMaximum(property: ColorPropKey, color: T): number;
    getAllowance(property: ColorPropKey, fuzzPercent: number, color: T): number;
    getPropDef(property: ColorPropKey): ColorPropDef<T>;
    getGetter(property: ColorPropKey): ColorPropGetter<T>;
    getColorProp(color: T, property: ColorPropKey): number;
    getSetter(property: ColorPropKey): ColorPropSetter<T>;
    setColorProp(color: T, property: ColorPropKey, value: number): T;
    getProfile(color: T): ColorProfile;
}

export interface Package<T> extends PackageUtil<T> {
    fromHex(hex: string): T;
    fromRgb(rgb: string): T;
    getHex(color: T): string;
}

export type ColorProfile = Record<ColorPropKey, number>
