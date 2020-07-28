import chroma, {Color as ChromaColor} from "chroma-js";
import {ChannelAccessor, ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import convert from "color-convert";
import {isDefined, replaceIndex} from "../lib";
import {ChannelAdapter} from "../spacesChannels/ChannelAdapter";
import {eitherToAccessor, eitherToObject} from "../spacesChannels/channels";
import {ModelAdapter} from "../spacesChannels/ModelAdapter";
import {eitherToModel, eitherToName} from "../spacesChannels/models";
import {rgbToRyb, rybToRgb} from "./ryb";
import {TupleClass} from "../spacesChannels/TupleClass";
import {I_ColorAdapter, I_GetHex} from "./types";

/**
 * --doesn't work--
 * do this rather than Record so that the generic of the TupleClass matches the key
 */
type KeyedConversions = {
    [P in ColorSpaceName]: TupleClass<P>;
};

export class ColorAdapter implements I_ColorAdapter, I_GetHex {

    /**
     * internally stores a Chroma.js color object
     */
    public internal: ChromaColor;

    /**
     * save known conversions so that the math doesn't have to be executed multiple times if doing back and forth conversions
     * key by model for easy lookup
     * readonly because it is never replaced, but it IS added to
     */
    private readonly conversions: Partial<Record<ColorSpaceName, TupleClass<ColorSpaceName>>>


    /**
     * can construct from a Chroma object
     * or from a string that Chroma is capable of parsing
     */
    public constructor(color: string | number | ChromaColor) {
        this.internal = typeof color === "object" ? color : chroma(color);
        this.conversions = {};
    }

    /**
     * mainly for back-compat, want to access just the tuple array
     * but goes through toClassed anyways so that it goes through local lookup and storage
     */
    public to<CS extends ColorSpaceName>(colorSpace: CS | ModelAdapter<CS>, rounded?: boolean): ColorTuple<CS> {
        const tuple = this.toClassed(colorSpace);
        return rounded ? tuple.rounded : tuple.deNormalized;
    }

    /**
     * returns an existing tuple if the conversion is already known,
     * or converts the color and stores for later access
     */
    public toClassed<CS extends ColorSpaceName>(colorSpace: ModelAdapter<CS> | CS): TupleClass<CS> {
        const key = eitherToName(colorSpace);
        const existing = this.conversions[key];
        if (isDefined(existing)) {
            return existing as TupleClass<CS>;
        }
        const tuple = this._createTuple(key) as ColorTuple<CS>;
        const classed = new TupleClass(tuple, colorSpace, false);
        this.conversions[key] = classed;
        return classed;
    }

    /**
     * get a raw numeric conversion
     *
     * don't do any rounding here, save that for the getters
     *
     * not using a generic for colorSpace because TS will not infer the type within the switch statement
     * this means I have to use "as" on the returned tuple
     */
    private _createTuple(colorSpace: ColorSpaceName): ColorTuple<typeof colorSpace> {
        switch (colorSpace) {
            case 'rgb':
                return this.internal.rgb(false);
            case 'ryb':
                return rgbToRyb(this.internal.rgb(false));
            case 'hwb':
            case 'hcg':
            case 'xyz':
            case 'lab':
            case 'hsl':
            case 'hsv':
            case 'cmyk':
                return convert.rgb[colorSpace].raw(this.internal.rgb(false));
            case 'hsi':
                const [h, s, i] = this.internal.hsi();
                return [h, 100 * s, 100 * i];
            case 'lch':
                return this.internal.lch();
        }
    }

    /**
     * can accept a tuple object or an array of numbers
     * if passing raw values, it is assumed that they are NOT normalized
     */
    public static staticFrom<CS extends ColorSpaceName>(values: ColorTuple<CS> | TupleClass<CS>, colorSpace: CS | ModelAdapter<CS>): ColorAdapter {
        const tuple = Array.isArray(values) ? new TupleClass(values, eitherToModel(colorSpace), false) : values;
        return this.fromTuple(tuple);
    }

    /**
     * cannot make this static because TS doesn't support static methods in interfaces
     * stupid hack is to have 2 separate functions in order to both fulfill the interface and have a static factory method
     */
    public from<CS extends ColorSpaceName>(values: ColorTuple<CS> | TupleClass<CS>, colorSpace: CS | ModelAdapter<CS>): ColorAdapter {
        return ColorAdapter.staticFrom(values, colorSpace);
    }

    /**
     * don't need a second parameter for colorSpace if using a classed tuple object, which knows its own colorSpace
     * store this tuple as a known conversion on the new object
     */
    public static fromTuple<CS extends ColorSpaceName>(tuple: TupleClass<CS>): ColorAdapter {
        const adapter = new ColorAdapter(this._createChroma(tuple.deNormalized, tuple.model.name));
        adapter.conversions[tuple.model.name] = tuple;
        return adapter;
    }

    /**
     * all static creations go through creating a Chroma.js object, so separate this step
     *
     * again cannot use generic with switch statement
     */
    private static _createChroma(values: ColorTuple<typeof colorSpace>, colorSpace: ColorSpaceName): ChromaColor {
        switch (colorSpace) {
            case 'rgb':
            case 'lch':
            case 'lab':
                //simplest cases can be handled automatically
                return chroma(values, colorSpace);
            case 'cmyk':
                //chroma expects decimals 0 to 1 for cmyk
                return chroma(values.map(v => v / 100), colorSpace);
            case 'hsv':
            case 'hsl':
            case 'hsi':
                //hue is out of 360, but the other two are decimals
                return chroma([values[0], values[1] / 100, values[2] / 100], colorSpace);
            case 'xyz':
            case 'hwb':
            case 'hcg':
                //chroma does not handle these, so use color-convert package to get rgb
                const rgb = convert[colorSpace].rgb(values as ColorTuple<'rgb'>);
                return chroma(rgb, 'rgb');
            case 'ryb':
                //converted to rgb via a custom function
                return chroma(rybToRgb(values as ColorTuple<'ryb'>), 'rgb');
        }
    }

    /**
     * get a single channel value
     */
    public get(channel: ChannelAccessor | ChannelAdapter, normalized: boolean = false, precision?: number ): number {
        const _channel = eitherToObject(channel);
        const tuple = this.toClassed(_channel.modelObject);
        return tuple.getEither(normalized, precision)[_channel.offset];
    }

    /**
     * create a new Color object where one property has been changed
     *
     * doesn't check that the new tuple is valid, like for ones where the full range cannot be reached by every color
     * can do this by going to rgb and back
     *
     * when the new color is created, it will have saved the potentially invalid value as a known conversion
     */
    public set(channel: ChannelAccessor | ChannelAdapter, value: number, normalized: boolean = false): ColorAdapter {
        const [cs, offset] = eitherToAccessor(channel);
        const initial = this.toClassed(cs).getEither(normalized);
        const edited = replaceIndex( initial, offset, value );
        return ColorAdapter.fromTuple(new TupleClass( edited, cs, normalized ));
    }

    /**
     * gets the hex code
     */
    public hex(): string {
        return this.internal.hex();
    }

    /**
     * use the hex as the toString for this class
     */
    public toString(): string {
        return this.hex();
    }
}

export default ColorAdapter;

