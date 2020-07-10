import chroma, {Color} from "chroma-js";
import {ColorPropDef} from "./types";
import {colorWheelToNormal, normalToColorWheel} from "../rainbow/colorWheel";
import {RGB} from "../util";
import {makePackageUtil} from "./makePackageUtil";
const getSetChannel = (channel: string): Pick<ColorPropDef<Color>, 'getter' | 'setter'> => ({
  getter: (c: Color) => c.get(channel),
  setter: (c: Color, v: number) => c.set(channel, v),
});

const PROPERTIES: ColorPropDef<Color>[] = [
    {
        name: "Hue",
        key: "hue",
        range: 360,
        ...getSetChannel('hsl.h')
    },
    {
        name: "Color Wheel Hue",
        key: "wheelHue",
        getter: c => normalToColorWheel(c.get('hsl.h')),
        setter: (c, v) => c.set('hsl.h', colorWheelToNormal(v)),
        range: 360
    },
    {
        name: "Luminosity",
        key: "luminosity",
        getter: c => c.luminance(),
        setter: (c, v) => c.luminance(v, 'lab'), //test what difference mode makes
        range: 1
    },
    {
        name: "Lightness",
        key: "lightness",
        range: 100,
        ...getSetChannel('hsl.l'),
    },
    {
        name: "Saturation L",
        key: "saturationl",
        range: 1,
        ...getSetChannel('hsl.s'),
    },
    {
        name: "Saturation V",
        key: "saturationv",
        range: 1,
        ...getSetChannel('hsv.s'),
    },
    {
        name: "Blackness",
        key: "blackness",
        ...getSetChannel('cmyk.k'),
        range: 1
    },
    {
        /**
         * whiteness comes from uncommon model hwb (hue, white, black) which is not part of chroma
         * could say that if one package doesn't support a property, covert via string and get from the other package
         */
        name: "Whiteness",
        key: "whiteness",
        getter: c => 0, //TODO
        setter: (c, v) => c, //TODO
        range: 100
    }
];

export const fromHex = (hex: string): Color => chroma(hex);

export const fromRgb = (rgb: RGB): Color => chroma(rgb);

export const toHex = (c: Color): string => c.hex();

export const util = makePackageUtil(PROPERTIES);


export const eitherToString = (color: string | Color ): string => {
    if ( typeof color === "string" ) {
        return color;
    } else return color.hex();
};

export const eitherToObject = ( color: string | Color ): Color => {
    if ( typeof color === "string" ) {
        return chroma(color);
    } else return color;
};
