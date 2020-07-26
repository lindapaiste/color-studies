import chroma, {Color} from "chroma-js";
import {ChannelAccessor, ChannelName} from "../spacesChannels/types";
import convert from "color-convert";
import {hasMethod, makeArray, replaceIndex, tupleMap} from "../lib";
import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {nameToAccessor} from "../spacesChannels/accessorConversion";
import {ChannelAdapter} from "../spacesChannels/ChannelAdapter";
import {eitherToAccessor} from "../spacesChannels/channels";
import {ModelAdapter} from "../spacesChannels/ModelAdapter";
import {eitherToName} from "../spacesChannels/models";
import {rgbToRyb,rybToRgb} from "./ryb";
import {round} from "../lib";
import {TupleClass} from "../spacesChannels/TupleClass";
/**
 * interface requires that object can be converted to a number tuple of any type
 * and that it can be constructed from a number tuple of any type
 *
 * can get or set the value of any channel
 *
 * ideally from() would be static, but this gets complicated with typescript
 */
export interface I_ColorAdapter extends I_GetHex {
    to<CS extends ColorSpaceName>(colorSpace: CS | ModelAdapter<CS>, rounded?: boolean): ColorTuple<CS>;
    //eventually want toClassed() to replace existing to(), but don't want to break anything
    toClassed<CS extends ColorSpaceName>(colorSpace: CS | ModelAdapter<CS>): TupleClass<CS>;
    from<CS extends ColorSpaceName>(values: ColorTuple<CS> | TupleClass<CS>, colorSpace: CS | ModelAdapter<CS>): I_ColorAdapter;
    get(accessor: ChannelAccessor | ChannelAdapter): number;
    set(accessor: ChannelAccessor | ChannelAdapter, value: number): I_ColorAdapter;
}

export interface I_GetHex {
    hex(): string;
}

export const isGetHex = (obj: any): obj is I_GetHex => hasMethod(obj, 'hex');


export class ColorAdapter implements I_ColorAdapter, I_GetHex {

    public internal: Color;

    public constructor(color: string | number | Color) {
        this.internal = typeof color === "object" ? color : chroma(color);
    }

    /**
     * this public/private thing is stupid, but it is easier than rewriting the whole function with generics
     * when using a generic for colorSpace, TS will not infer the type within the switch statement
     */
    public to<CS extends ColorSpaceName>(colorSpace: CS | ModelAdapter<CS>, rounded?: boolean): ColorTuple<CS> {
        return this._to(eitherToName(colorSpace), rounded) as ColorTuple<CS>;
    }

    public toClassed<CS extends ColorSpaceName>(colorSpace: ModelAdapter<CS> | CS): TupleClass<CS> {
        return new TupleClass(this.to(colorSpace, false), colorSpace, false);
    }

    private _to(colorSpace: ColorSpaceName, rounded: boolean = false): ColorTuple<typeof colorSpace> {
        switch (colorSpace) {
            case 'rgb':
                return this.internal.rgb(rounded);
            case 'ryb':
                return this._round(rgbToRyb(this.internal.rgb(false)));
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
                //have to get raw and then round because s and i are decimals
                const [h, s, i] = this.internal.hsi();
                return this._round([h, 100 * s, 100 * i]);
            case 'lch':
                return this._round(this.internal.lch());
        }
    }

    private _round<CS extends ColorSpaceName>(values: ColorTuple<CS>): ColorTuple<CS> {
        return tupleMap(values, v => round(v, 0))
    }

    public from<CS extends ColorSpaceName>(values: ColorTuple<CS> | TupleClass<CS>, colorSpace: CS | ModelAdapter<CS>): ColorAdapter {
        return ColorAdapter.staticFrom(values, colorSpace);
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
            case 'ryb':
                return new ColorAdapter(chroma(rybToRgb(values as ColorTuple<'ryb'>), 'rgb'));
        }
    }

    /**
     * really stupid hack to allow static factory method while avoiding the underlying issue that TS doesn't support static methods in interfaces
     */
    public static staticFrom<CS extends ColorSpaceName>(values: ColorTuple<CS> | TupleClass<CS>, colorSpace: CS | ModelAdapter<CS>): ColorAdapter {
        const raw = Array.isArray(values) ? values : values.deNormalized;
        return ColorAdapter._from(raw, eitherToName(colorSpace));
    }

    /**
     * don't need a second parameter for colorSpace if using a classed tuple object, which knows its own colorSpace
     */
    public static fromTuple<CS extends ColorSpaceName>(values: TupleClass<CS>): ColorAdapter {
        return ColorAdapter.staticFrom(values, values.model);
    }

    public get(channel: ChannelAccessor | ChannelAdapter): number {
        const [cs, offset] = eitherToAccessor(channel);
        return this.to(cs)[offset];
    }

    public set(channel: ChannelAccessor | ChannelAdapter, value: number): ColorAdapter {
        const [cs, offset] = eitherToAccessor(channel);
        const values = this.to(cs);
        return this.from( replaceIndex(values, offset, value) as typeof values, cs);
    }

    public hex(): string {
        return this.internal.hex();
    }

    public toString(): string {
        return this.hex();
    }
}

export default ColorAdapter;

export const hexProperty = (hex: string, property: ChannelName): number => {
  return (new ColorAdapter(hex)).get(nameToAccessor(property));
};

export const randomColor = (): I_ColorAdapter => {
    return new ColorAdapter(chroma.random());
};

export const randomColors = (count: number): I_ColorAdapter[] => {
    return makeArray(count, randomColor);
};

export interface PropColor {
    color: I_ColorAdapter;
}
