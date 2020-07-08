import chroma, { Color } from "chroma-js";
import React from "react";
import { random, range } from "lodash";
import { Swatch } from "../Swatch";
import { RenderSet } from "../RenderSet";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely chnage anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

export const CompareRandom = () => {
  return <CompareMethods color={chroma.random().hex()} />;
};

export const CompareMethods = ({ color }: { color: string }) => {
  const base = chroma(color);

  const noiseRatio = 0.15; //5%

  /**
   * noise should not be distributed linearly because of how the channel value actually represents an x-squared
   * with linear method, changes are barely visible in a RGB channel with a low initial value
   * changes in the higher numbers are more impactful
   */
  const withRGBChannelNoise = (channel: string): Color => {
    const max = Math.pow(255, 2);
    const current = Math.pow(base.get(channel), 2);
    const noiseAmount = noiseRatio * max;
    //it is important to remove the possibility of out of range values
    //BEFORE picking the random number in order to distribute properly
    const noisy = random(
      Math.max(0, current - noiseAmount),
      Math.min(max, current + noiseAmount),
      true
    );
    console.log({
      noisy,
      noiseAmount,
      min: Math.max(0, current - noiseAmount),
      max: Math.min(max, current + noiseAmount)
    });
    console.log(base.set(channel, noisy));
    return base.set(channel, Math.pow(noisy, 0.5));
  };

  const withChannelNoise = (channel: string, max: number): Color => {
    //TODO: lookup the max rather than passing in
    const current = base.get(channel);
    const noiseAmount = noiseRatio * max;
    //it is important to remove the possibility of out of range values
    //BEFORE picking the random number in order to distribute properly
    const noisy = random(
      Math.max(0, current - noiseAmount),
      Math.min(max, current + noiseAmount),
      true
    );
    console.log({
      noisy,
      noiseAmount,
      min: Math.max(0, current - noiseAmount),
      max: Math.min(max, current + noiseAmount)
    });
    console.log(base.set(channel, noisy));
    return base.set(channel, noisy);
  };

  const countPer = 10;

  const makeHexArray = (
    noiseGenerator: () => Color,
    count: number = countPer
  ): string[] => {
    return range(count)
      .map(noiseGenerator)
      .map(c => c.hex());
  };

  const renderNoisyChannel = (title: string, channel: string, max: number) => (
    <TitledSet
      colors={makeHexArray(() => withChannelNoise(channel, max), countPer)}
      title={title}
    />
  );

  const renderNoisyRGBChannel = (title: string, channel: string) => (
    <TitledSet
      colors={makeHexArray(() => withRGBChannelNoise(channel), countPer)}
      title={title}
    />
  );

  return (
    <div>
      <Swatch color={base.hex()} size={200} />
      {renderNoisyChannel("Chroma", "lch.c", 100)}
      {renderNoisyChannel("V HSV", "hsv.v", 100)}
      {renderNoisyChannel("Hue HSL", "hsl.h", 360)}
      {renderNoisyChannel("Lightness HSL", "hsl.l", 1)}
      {renderNoisyChannel("Lum LAB", "lab.l", 1)}
      {renderNoisyRGBChannel("Red", "rgb.r")}
      {renderNoisyRGBChannel("Blue", "rgb.b")}
      {renderNoisyRGBChannel("Green", "rgb.g")}
    </div>
  );
};

export const TitledSet = ({
  colors,
  title
}: {
  colors: string[];
  title: string;
}) => (
  <div>
    <h3>{title}</h3>
    <RenderSet colors={colors} />
  </div>
);
