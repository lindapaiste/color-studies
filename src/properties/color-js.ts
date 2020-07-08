import {ColorPropDef} from "./types";
import {colorWheelToNormal, normalToColorWheel} from "../rainbow/colorWheel";
import {setLuminosity} from "../luminosity/luminosity";
import ColorObject from "color";
import {makePackageUtil} from "./makePackageUtil";
import {RGB} from "../util";

export type Color = ColorObject; //is weirdly confusing to differentiate between the class and the type of the same name

export const PROPERTIES: ColorPropDef<Color>[] = [
    {
        name: "Hue",
        key: "hue",
        getter: c => c.hue(),
        setter: (c, v) => c.hue(v),
        range: 360
    },
    {
        name: "Color Wheel Hue",
        key: "wheelHue",
        getter: c => normalToColorWheel(c.hue()),
        setter: (c, v) => c.hue(colorWheelToNormal(v)),
        range: 360
    },
    {
        name: "Luminosity",
        key: "luminosity",
        getter: c => c.luminosity(),
        setter: setLuminosity,
        range: 1
    },
    {
        name: "Lightness",
        key: "lightness",
        getter: c => c.lightness(),
        setter: (c, v) => c.lightness(v),
        range: 100
    },
    {
        name: "Saturation L",
        key: "saturationl",
        getter: c => c.saturationl(),
        setter: (c, v) => c.saturationl(v),
        range: 100
    },
    {
        name: "Saturation V",
        key: "saturationv",
        getter: c => c.saturationv(),
        setter: (c, v) => c.saturationv(v),
        range: 100
    },
    {
        name: "Blackness",
        key: "blackness",
        getter: c => c.black(),
        setter: (c, v) => c.black(v),
        range: 100
    },
    {
        name: "Whiteness",
        key: "whiteness",
        getter: c => c.white(),
        setter: (c, v) => c.white(v),
        range: 100
    }
];

export const util = makePackageUtil(PROPERTIES);

export const fromHex = (hex: string): Color => new ColorObject(hex);

export const fromRgb = (rgb: RGB): Color => ColorObject.rgb(rgb);

export const getHex = (color: Color) => color.hex();
