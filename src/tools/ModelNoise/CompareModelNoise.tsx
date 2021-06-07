import React from "react";
import { ColorSet, Swatch, Title, Tool } from "components";
import { makeArray } from "lib";
import { withModelNoise } from "logic/noise/modelNoise";
import { DEFAULT_NOISE_SETTINGS, ModelNoiseSettings } from "logic/noise/types";
import { IColorAdapter } from "logic/color/types";
import { Props } from "../ChannelNoise/CompareNoiseChannels";
import { ModelNoiseControls } from "./ModelNoiseControls";

/**
 * makes a band of the original color on top of the normal ColorSet
 */
export const NoisyColors = ({
  color,
  countPer = 25,
  settings,
}: Props & { settings: ModelNoiseSettings }) => (
  <div>
    <Swatch color={color.hex()} size="100%" height={30} />
    <ColorSet
      colors={makeArray(countPer, () => withModelNoise({ color, ...settings }))}
    />
  </div>
);

/**
 * tool to visualize the changes made by adjusting weights
 * for noise generation in a color space
 */

export interface CompareProps {
  colors: IColorAdapter[];
  countPer?: number;
}

export const Results = ({
  settings,
  colors,
  countPer,
}: CompareProps & { settings: ModelNoiseSettings }) => (
  <div>
    <Title>Results</Title>
    {colors.map((color) => (
      <NoisyColors color={color} settings={settings} countPer={countPer} />
    ))}
  </div>
);

/**
 * select colors comes from HOC
 */
export const CompareModelNoise = (props: CompareProps) => (
  <Tool
    initialSettings={DEFAULT_NOISE_SETTINGS}
    RenderControls={ModelNoiseControls}
    RenderContents={(settings) => Results({ settings, ...props })}
  />
);
