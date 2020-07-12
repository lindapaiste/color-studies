import chroma, {Color} from "chroma-js";
import {ColorSpaceName, ColorTuple} from "./colorSpaces";
import convert from "color-convert";

/**
 * interface requires that object can be converted to a number tuple of any type
 * and that it can be constructed from a number tuple of any type
 */
export interface I_ConvertAdapter {

    to(colorSpace: ColorSpaceName, rounded?: boolean): ColorTuple<typeof colorSpace>;
    from(values: ColorTuple<typeof colorSpace>, colorSpace: ColorSpaceName): ConvertAdapter;

    //these definition work well by themselves, but are difficult to implement in the class because the switch will not refine the type
    // to<CS extends ColorSpaceName>(colorSpace: CS, rounded?: boolean): ColorTuple<CS>;
    // from<CS extends ColorSpaceName>(values: ColorTuple<CS>, colorSpace: CS): I_ConvertAdapter;
}

export class ConvertAdapter implements I_ConvertAdapter {

    public internal: Color;

    public constructor(color: string | number | Color) {
        this.internal = typeof color === "object" ? color : chroma(color);
    }

    public to(colorSpace: ColorSpaceName, rounded: boolean = false): ColorTuple<typeof colorSpace> {
        switch (colorSpace) {
            case 'rgb':
                return this.internal.rgb(rounded);
            case 'hwb':
            case 'hcg':
            case 'xyz':
            case 'lab':
            case 'hsl':
            case 'hsv':
            case 'cmyk':
                if (rounded) {
                    return convert.rgb[colorSpace](this.internal.rgb(false));
                } else {
                    return convert.rgb[colorSpace].raw(this.internal.rgb(false));
                }
            case 'hsi':
                const [h, s, i] = this.internal.hsi();
                return [h, 100 * s, 100 * i];
            case 'lch':
                return this.internal.lch();
        }
    }

    public from(values: ColorTuple<typeof colorSpace>, colorSpace: ColorSpaceName): ConvertAdapter {
        switch (colorSpace) {
            case 'rgb':
            case 'lch':
            case 'lab':
                return new ConvertAdapter(chroma(values, colorSpace));
            case 'cmyk':
                return new ConvertAdapter(chroma(values.map(v => v / 100), colorSpace));
            case 'hsv':
            case 'hsl':
            case 'hsi':
                return new ConvertAdapter(chroma([values[0], values[1] / 100, values[2] / 100], colorSpace));
            case 'xyz':
            case 'hwb':
            case 'hcg':
                const rgb = convert[colorSpace].rgb(values as ColorTuple<'rgb'>);
                return new ConvertAdapter(chroma(rgb, 'rgb'));
        }
    }
}
