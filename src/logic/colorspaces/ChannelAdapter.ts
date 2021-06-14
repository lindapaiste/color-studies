import { clamp, proper } from "lib";
import { ChannelAccessor } from "./types";
import { ChannelMaxObject, getChannelMaxes } from "./channelMaxes";
import { ModelAdapter } from "./ModelAdapter";
import { ChannelSlug, ChannelName, ColorSpaceName } from "./colorSpaces";

/**
 * one Channel object per channel name / color space pairing
 * channels appearing in multiple color spaces will need multiple classes
 *
 *
 * wanting to minimize the use of conversion functions through OOP approach
 */

export class ChannelAdapter implements Required<ChannelMaxObject> {
  public readonly modelName: ColorSpaceName;

  public readonly modelObject: ModelAdapter;

  public readonly offset: number;

  public readonly name: ChannelName;

  public readonly max: number;

  public readonly min: number;

  public readonly isLooped: boolean;

  public readonly isVariable: boolean;

  /**
   * assume that models are created first and the model triggers the creation of the channel
   * so want to pass in the model rather than looking up something that might not exist yet
   */
  constructor(name: ChannelName, model: ModelAdapter, offset: number) {
    this.modelObject = model;
    this.modelName = model.name;
    this.offset = offset;
    this.name = name;
    const maxes = getChannelMaxes(this.name);
    this.max = maxes.max;
    this.min = maxes.min || 0;
    this.isLooped = maxes.isLooped || false;
    this.isVariable = maxes.isVariable || false;
  }

  get accessor(): ChannelAccessor {
    return [this.modelName, this.offset];
  }

  /**
   * use the slug as the key
   */
  get key(): ChannelSlug {
    return this.slug;
  }

  /**
   * gets in the form of "hsl.l", "rgb.r", etc.
   * previously stored the channels with letter keys,
   * but now relying on the assumption that the color space name matches the channel letters
   */
  get slug(): ChannelSlug {
    const letter = this.modelName[this.offset];
    return `${this.modelName}.${letter}` as ChannelSlug;
  }

  /**
   * returns in form "Red (RGB)", "Saturation (HSL)"
   * drops off second word which is always for disambiguation and is redundant when the colorspace is included
   */
  get title(): string {
    return `${this.properName} (${this.modelObject.title})`;
  }

  /**
   * returns just the capitalized name without the model
   */
  get properName(): string {
    return proper(this.name).replace(/ .*/, ""); // two word names become "Hue Hsl" so want to remove the redundancy
  }

  /**
   * the width of the colorspace.  will be equal to max unless min is negative
   */
  get range(): number {
    return this.max - this.min;
  }

  /**
   * transforms into a number from 0 to 1
   * where 0 and 1 are the total min and max for the channel (not the limits for this color)
   */
  public normalize(value: number): number {
    return (value - this.min) / this.range;
  }

  /**
   * transforms a normalized number from 0 to 1
   * back into an actual channel value (ie. 0-360, 0-100, etc.)
   */
  public deNormalize(value: number): number {
    return value * this.range + this.min;
  }

  /**
   * Validate a value to the channel
   */
  public isValid(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  /**
   * Constrain a value such that it fits in the channel.
   * If the channel is cyclical, loop around instead of clamping.
   */
  public clamp(value: number): number {
    if (this.isValid(value)) {
      return value;
    }
    if (this.isLooped) {
      // Note: assumes that min is 0 for all looped channels
      const remainder = value % this.max;
      return remainder < 0 ? remainder + this.max : remainder;
    }
    return clamp(value, this.min, this.max);
  }
}
