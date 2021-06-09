import { random } from "lib";
import { fixHue } from "../hue/hueShift";
import {
  colorWheelToNormal,
  normalToColorWheel,
} from "../adjustment/colorWheel";
import { IColorAdapter } from "../color/types";
import { ChannelArg, toChannelObject } from "../spacesChannels/channels";

export interface ChannelProps {
  min?: number; // default to 0 if not set
  max?: number;
  clamp?: boolean;

  preTransform?(v: number): number;

  postTransform?(v: number): number;
}

export interface BasicProps {
  value: number;
  noiseRatio: number;
  channel: ChannelArg;
}

export type SpecificProps = ChannelProps & Omit<BasicProps, "channel">;

/**
 * can share this between noise generation and channel shift
 */
export const getChannelProps = (channel: ChannelArg): ChannelProps => {
  const object = toChannelObject(channel);
  const { name } = object;

  let preTransform: (n: number) => number = (c) => c;
  let postTransform: (n: number) => number = (c) => c;
  if (name === "hue") {
    preTransform = normalToColorWheel;
    postTransform = (n) => fixHue(colorWheelToNormal(n));
  } else if (["red", "green", "blue"].includes(name)) {
    /**
     * RGB noise should not be distributed linearly because of how the channel value actually represents an x-squared
     * with linear method, changes are barely visible in a RGB channel with a low initial value
     * changes in the higher numbers are more impactful
     */
    preTransform = (n) => n ** 2;
    postTransform = (n) => n ** 0.5;
  }

  // for now, just avoid clamping with unknown max
  // could calculate based on other channels, but what if all channels are changing?
  let max;
  let clamp = true;
  if (!object.isVariable) {
    max = object.max;
  } else {
    clamp = false;
  }

  return {
    preTransform,
    postTransform,
    max,
    clamp,
  };
};

export const specificNoisyValue = ({
  value,
  max = 100,
  min = 0,
  noiseRatio,
  postTransform = (n) => n,
  preTransform = (n) => n,
  clamp = false,
}: SpecificProps): number => {
  const initial = preTransform(value);
  const vMin = preTransform(min);
  const vMax = preTransform(max);
  // thought about passing noise amount instead of noise ratio, but want to base it on the transformed value of max
  const noiseAmount = vMax * noiseRatio;
  /**
   * it is important to remove the possibility of out of range values
   * BEFORE picking the random number in order to distribute properly
   *
   * clamp property makes constraining optional, which is needed for hue only
   */
  const lower = clamp
    ? Math.max(vMin, initial - noiseAmount)
    : initial - noiseAmount;
  const upper = clamp
    ? Math.min(vMax, initial + noiseAmount)
    : initial + noiseAmount;
  const noisy = postTransform(random(lower, upper, true));
  console.log({
    noisy,
    noiseAmount,
    min: postTransform(lower),
    max: postTransform(upper),
  });
  return noisy;
};

export const noisyChannelValue = ({ channel, ...props }: BasicProps): number =>
  specificNoisyValue({
    ...props,
    ...getChannelProps(channel), // TODO replace with the standard transform version
  });

/**
 * applies channel noise to an IColorAdapter object
 */
export const withChannelNoise = (
  color: IColorAdapter,
  channel: ChannelArg,
  noiseRatio: number
): IColorAdapter => {
  const value = color.get(channel);
  const newValue = noisyChannelValue({ channel, noiseRatio, value });
  return color.set(channel, newValue);
};
