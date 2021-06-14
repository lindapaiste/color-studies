import { makeArray } from "lib";
import { ChannelCountTuple, ColorTuple } from "./types";
import { ChannelAdapter } from "./ChannelAdapter";
import { COLOR_SPACE_ARRAYS, ColorSpaceName } from "./colorSpaces";

/**
 * Not much logic here, primarily serves as a collection of 3 ChannelAdapters.
 *
 * Note: use arrow functions so that `this.model.normalize` in the TupleClass
 * can access `this` properly.
 */
export class ModelAdapter<CS extends ColorSpaceName = ColorSpaceName> {
  public readonly name: CS;

  public readonly channels: ChannelAdapter[];

  /**
   * stores channels as ChannelAdapter objects
   * expect that creation of models comes first and triggers the creation of channels, not the other way around
   */
  constructor(name: CS) {
    this.name = name;
    const channelNames = COLOR_SPACE_ARRAYS[name];
    this.channels = channelNames.map(
      (channel, offset) => new ChannelAdapter(channel, this, offset)
    );
  }

  get channelCount(): number {
    return this.channels.length;
  }

  get key(): CS {
    return this.name;
  }

  /**
   * title is the name in uppercase, aka "RGB", "HSL"
   */
  get title(): string {
    return this.name.toUpperCase();
  }

  /**
   * makes an array of the right length (3 or 4) for the color space
   * mainly needed for typescript knowledge of the array length, as makeArray returns number[]
   * is usually numbers, but can make a tuple of another type too
   */
  public makeTuple = <T = number>(
    value: T | ((i: number) => T)
  ): ChannelCountTuple<CS, T> =>
    makeArray(this.channelCount, value) as ChannelCountTuple<CS, T>;

  /**
   * checks that the length of the array is enough for the color space
   * can include extra entries -- assumes that these will be ignored
   */
  public isValidTuple = (array: number[]): array is ColorTuple<CS> =>
    array.length >= this.channelCount;

  public normalize = (tuple: ColorTuple<CS>): ColorTuple<CS> =>
    // ensure that any extra channels are dropped
    // should not be needed, but cam fix bugs occurring higher-up
    tuple
      .slice(0, this.channelCount)
      .map((value, i) => this.channels[i].normalize(value)) as ColorTuple<CS>;

  /**
   * converts a normalized tuple from 0-1 range back into channel-specific range
   * ie. [.5, .5, 0] in HSL to [180, 50, 0]
   */
  public deNormalize = (tuple: ColorTuple<CS>): ColorTuple<CS> =>
    tuple
      .slice(0, this.channelCount)
      .map((value, i) => this.channels[i].deNormalize(value)) as ColorTuple<CS>;
}
