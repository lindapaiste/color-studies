import { colorWheelToNormal, normalToColorWheel } from "./colorWheel";
import { fixHue } from "../hue/hueShift";
import { ChannelAdapter } from "../spacesChannels/ChannelAdapter";

/**
 * want to be able to use either no transform ( false ), the standard channel transform ( true ), or a custom transform
 */

export type Transform = (v: number) => number;

// pairing of pre and post transformation
export interface TransformPair {
  pre: Transform;
  post: Transform;
}

/**
 * can share this between noise generation and channel shift
 */
export const getStandardTransform = (
  channel: ChannelAdapter,
  normalized: boolean = false
): TransformPair | false => {
  /**
   * tbh don't know if I need this any more with the addition of RYB
   */
  if (channel.name === "hue") {
    return {
      pre: (n) =>
        normalized ? normalToColorWheel(360 * n) / 360 : normalToColorWheel(n),
      post: (n) => fixHue(colorWheelToNormal(normalized ? 360 * n : n)) / 360,
    };
  }
  if (channel.modelName === "rgb" || channel.modelName === "ryb") {
    /**
     * RGB noise should not be distributed linearly because of how the channel value actually represents an x-squared
     * with linear method, changes are barely visible in a RGB channel with a low initial value
     * changes in the higher numbers are more impactful
     */
    return {
      pre: (n) => n ** 2,
      post: (n) => n ** 0.5,
    };
  }
  return false;
  /**
   * return false if no special handling
   */
};

/**
 * null object pattern - a transform which doesn't do anything
 */
export const nullTransform: TransformPair = {
  pre: (c) => c,
  post: (c) => c,
};

export const maybePreTransform = (
  value: number,
  transform: false | TransformPair
) => (transform === false ? value : transform.pre(value));

export const maybePostTransform = (
  value: number,
  transform: false | TransformPair
) => (transform === false ? value : transform.post(value));
