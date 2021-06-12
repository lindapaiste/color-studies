import chroma, { Color as ChromaColor } from "chroma-js";
import convert from "color-convert";
import { tupleMap, round } from "lib";
import { hpluvToRgb, hsluvToRgb, rgbToHpluv, rgbToHsluv } from "hsluv";
import { ColorSpaceName, ColorTuple } from "../colorspaces/types";
import {
  ChannelArg,
  toChannelAccessor,
  toChannelObject,
} from "../colorspaces/channels";
import { ModelAdapter } from "../colorspaces/ModelAdapter";
import { eitherToModel, eitherToName } from "../colorspaces/models";
import { rgbToRyb, rybToRgb } from "./ryb/ryb";
import { TupleClass } from "../colorspaces/TupleClass";

/**
 * Wraps the chroma.js object and adds a few additional color spaces.
 *
 * Color can be converted to a tuple of any type.
 *
 * Can get or set the value of any channel.
 */
export class ColorAdapter {
  /**
   * Internally stores a Chroma.js color object.
   */
  public internal: ChromaColor;

  /**
   * Save known conversions so that the math doesn't have to be
   * executed multiple times if doing back and forth conversions.
   * Key by model for easy lookup.
   * Readonly because it is never replaced, but it IS added to.
   */
  private readonly conversions: {
    [K in ColorSpaceName]?: TupleClass<ColorSpaceName>;
  };

  /**
   * can construct from a Chroma object
   * or from a string that Chroma is capable of parsing
   */
  public constructor(color: string | number | ChromaColor) {
    this.internal = typeof color === "object" ? color : chroma(color);
    this.conversions = {};
  }

  /**
   * Converts to a specific color space.
   *
   * Returns an existing tuple if the conversion is already known,
   * or converts the color and stores for later access.
   *
   * ALWAYS returns the raw/denormalized version for consistency.
   */
  public toCs<CS extends ColorSpaceName>(
    colorSpace: ModelAdapter<CS> | CS
  ): TupleClass<CS> {
    const key = eitherToName(colorSpace);
    const existing = this.conversions[key]?.deNormalize();
    if (existing) {
      return existing as TupleClass<CS>;
    }
    const tuple = this.createTuple(key) as ColorTuple<CS>;
    const classed = new TupleClass(tuple, colorSpace, false);
    this.conversions[key] = classed;
    return classed;
  }

  /**
   * RGB is used as an intermediary for conversion which are not accepted by every model.
   */
  private get rawRgb() {
    return this.internal.rgb(false);
  }

  /**
   * get a raw numeric conversion
   *
   * don't do any rounding here, save that for the getters
   *
   * not using a generic for colorSpace because TS will not infer the type within the switch statement
   * this means I have to use "as" on the returned tuple
   */
  private createTuple(
    colorSpace: ColorSpaceName
  ): ColorTuple<typeof colorSpace> {
    switch (colorSpace) {
      case "rgb":
        return this.rawRgb;
      case "ryb":
        return rgbToRyb(this.rawRgb);
      case "hwb":
      case "hcg":
      case "xyz":
      case "lab":
      case "hsl":
      case "hsv":
      case "cmyk":
        return convert.rgb[colorSpace].raw(this.rawRgb);
      case "hsi":
        // eslint-disable-next-line no-case-declarations
        const [h, s, i] = this.internal.hsi();
        return [h, 100 * s, 100 * i];
      case "lch":
        return this.internal.lch();
      case "hsluv":
        return rgbToHsluv(this.toCs("rgb").normalize().values);
      case "hpluv":
        return rgbToHpluv(this.toCs("rgb").normalize().values);
      default:
        throw new Error(`unknown color space ${colorSpace}`);
    }
  }

  /**
   * Can accept:
   *  - a string hex
   *  - a Tuple object, which knows its own colorSpace and isNormalized
   *  - an array of numbers and the colorSpace that they represent.
   *    When passing raw values, it is assumed that they are NOT normalized.
   */
  public static staticFrom<CS extends ColorSpaceName>(
    values: ColorTuple<CS> | TupleClass<CS>,
    colorSpace: CS | ModelAdapter<CS>
  ): ColorAdapter {
    const tuple = Array.isArray(values)
      ? new TupleClass(values, eitherToModel(colorSpace), false)
      : values;
    return this.fromTuple(tuple);
  }

  /**
   * don't need a second parameter for colorSpace if using a classed tuple object, which knows its own colorSpace
   * store this tuple as a known conversion on the new object
   */
  public static fromTuple<CS extends ColorSpaceName>(
    tuple: TupleClass<CS>
  ): ColorAdapter {
    const adapter = new ColorAdapter(
      this.createChroma(tuple.deNormalize().values, tuple.model.name)
    );
    adapter.conversions[tuple.model.name] = tuple;
    return adapter;
  }

  /**
   * All static creations go through creating a Chroma.js object, so separate this step
   * Models which lack built-in support from Chroma.js will get converted to RGB.
   *
   * again cannot use generic with switch statement
   */
  private static createChroma(
    values: ColorTuple,
    colorSpace: ColorSpaceName
  ): ChromaColor {
    switch (colorSpace) {
      case "rgb":
      case "lch":
      case "lab":
        // simplest cases can be handled automatically
        return chroma(values, colorSpace);
      case "cmyk":
        // chroma expects decimals 0 to 1 for cmyk
        return chroma(
          values.map((v) => v / 100),
          colorSpace
        );
      case "hsv":
      case "hsl":
      case "hsi":
        // hue is out of 360, but the other two are decimals
        return chroma(
          [values[0], values[1] / 100, values[2] / 100],
          colorSpace
        );
      case "xyz":
      case "hwb":
      case "hcg":
        // chroma does not handle these, so use color-convert package to get rgb
        return chroma(
          convert[colorSpace].rgb(values as ColorTuple<"rgb">),
          "rgb"
        );
      case "ryb":
        // converted to rgb via a custom function
        return chroma(rybToRgb(values as ColorTuple<"ryb">), "rgb");
      case "hsluv":
        // use hsluv package
        return chroma(
          tupleMap(hsluvToRgb(values as ColorTuple<"hsluv">), (v) => v * 255),
          "rgb"
        );
      case "hpluv":
        return chroma(
          tupleMap(hpluvToRgb(values as ColorTuple<"hpluv">), (v) => v * 255),
          "rgb"
        );
      default:
        throw new Error(`unknown color space ${colorSpace}`);
    }
  }

  /**
   * get a single channel value
   */
  public get(
    channel: ChannelArg,
    normalized: boolean = false,
    precision?: number
  ): number {
    const channelObj = toChannelObject(channel);
    const tuple = this.toCs(channelObj.modelObject);
    return round(tuple.to(normalized)[channelObj.offset], precision);
  }

  /**
   * create a new Color object where one property has been changed
   *
   * doesn't check that the new tuple is valid, like for ones where the full range cannot be reached by every color
   * can do this by going to rgb and back
   *
   * when the new color is created, it will have saved the potentially invalid value as a known conversion
   */
  public set(
    channel: ChannelArg,
    value: number,
    normalized: boolean = false
  ): ColorAdapter {
    const [cs, offset] = toChannelAccessor(channel);
    return ColorAdapter.fromTuple(
      this.toCs(cs).to(normalized).replace(offset, value)
    );
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
