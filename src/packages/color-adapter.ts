import chroma, {Color} from "chroma-js";
import {ChannelAccessor, ChannelName} from "../spacesChannels/types";
import convert from "color-convert";
import {hasMethod, replaceIndex} from "../util";
import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {nameToAccessor} from "../spacesChannels/accessorConversion";

/**
 * interface requires that object can be converted to a number tuple of any type
 * and that it can be constructed from a number tuple of any type
 */
export interface I_ConvertAdapter {

    //to(colorSpace: ColorSpaceName, rounded?: boolean): ColorTuple<typeof colorSpace>;
    //from(values: ColorTuple<typeof colorSpace>, colorSpace: ColorSpaceName): ConvertAdapter;

    //these definition work well by themselves, but are difficult to implement in the class because the switch will not refine the type
    to<CS extends ColorSpaceName>(colorSpace: CS, rounded?: boolean): ColorTuple<CS>;
    from<CS extends ColorSpaceName>(values: ColorTuple<CS>, colorSpace: CS): I_ConvertAdapter;
}

export interface I_GetHex {
    hex(): string;
}

export const isGetHex = (obj: any): obj is I_GetHex => hasMethod(obj, 'hex');

export interface I_ChannelAdapter {
    get(accessor: ChannelAccessor): number;
    set(accessor: ChannelAccessor, value: number): I_ChannelAdapter;
}

/**
 * override the return statements such that the returned object fits both interfaces
 */
export interface I_ColorAdapter extends I_ChannelAdapter, I_ConvertAdapter, I_GetHex {
    from<CS extends ColorSpaceName>(values: ColorTuple<CS>, colorSpace: CS): I_ColorAdapter;
    set(accessor: ChannelAccessor, value: number): I_ColorAdapter;
}

export class ColorAdapter implements I_ConvertAdapter, I_ChannelAdapter, I_ColorAdapter, I_GetHex {

    public internal: Color;

    public constructor(color: string | number | Color) {
        this.internal = typeof color === "object" ? color : chroma(color);
    }

    /**
     * this public/private thing is stupid, but it is easier than rewriting the whole function with generics
     * when using a generic for colorSpace, TS will not infer the type within the switch statement
     */
    public to<CS extends ColorSpaceName>(colorSpace: CS, rounded?: boolean): ColorTuple<CS> {
        return this._to(colorSpace, rounded) as ColorTuple<CS>;
    }

    private _to(colorSpace: ColorSpaceName, rounded: boolean = false): ColorTuple<typeof colorSpace> {
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

    public from<CS extends ColorSpaceName>(values: ColorTuple<CS>, colorSpace: CS): ColorAdapter {
        return ColorAdapter._from(values, colorSpace);
    }

    private static _from(values: ColorTuple<typeof colorSpace>, colorSpace: ColorSpaceName): ColorAdapter {
        switch (colorSpace) {
            case 'rgb':
            case 'lch':
            case 'lab':
                return new ColorAdapter(chroma(values, colorSpace));
            case 'cmyk':
                return new ColorAdapter(chroma(values.map(v => v / 100), colorSpace));
            case 'hsv':
            case 'hsl':
            case 'hsi':
                return new ColorAdapter(chroma([values[0], values[1] / 100, values[2] / 100], colorSpace));
            case 'xyz':
            case 'hwb':
            case 'hcg':
                const rgb = convert[colorSpace].rgb(values as ColorTuple<'rgb'>);
                return new ColorAdapter(chroma(rgb, 'rgb'));
        }
    }

    public get(accessor: ChannelAccessor): number {
        const [cs, offset] = accessor;
        return this.to(cs)[offset];
    }

    public set(accessor: ChannelAccessor, value: number): ColorAdapter {
        const [cs, offset] = accessor;
        const values = this.to(cs);
        return this.from( replaceIndex(values, offset, value) as typeof values, cs);
    }

    public hex(): string {
        return this.internal.hex();
    }
}


export const hexProperty = (hex: string, property: ChannelName): number => {
  return (new ColorAdapter(hex)).get(nameToAccessor(property));
};

export const randomColor = (): I_ColorAdapter => {
    return new ColorAdapter(chroma.random());
};
