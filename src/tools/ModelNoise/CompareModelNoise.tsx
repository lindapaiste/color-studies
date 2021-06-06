import React from "react";
import { Props } from "../ChannelNoise/CompareNoiseChannels";
import { Swatch } from "../../sharedComponents/color/Swatch";
import { makeArray } from "../../lib";
import { RenderSet } from "../../sharedComponents/color/RenderSet";
import { withModelNoise } from "../../noise/modelNoise";
import { DEFAULT_NOISE_SETTINGS, ModelNoiseSettings } from "../../noise/types";
import { ModelNoiseControls } from "./ModelNoiseControls";
import { Title } from "../../sharedComponents/ui/Title";
import { Tool } from "../../sharedComponents/tool/Tool";
import { I_ColorAdapter } from "../../color/types";

/**
 * tool to visualize the changes made by adjusting weights
 * for noise generation in a color space
 */

export interface CompareProps {
  colors: I_ColorAdapter[];
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

/**
 * makes a band of the original color on top of the normal RenderSet
 */
export const NoisyColors = ({
  color,
  countPer = 25,
  settings,
}: Props & { settings: ModelNoiseSettings }) => (
  <div>
    <Swatch color={color.hex()} size="100%" height={30} />
    <RenderSet
      colors={makeArray(countPer, () => withModelNoise({ color, ...settings }))}
    />
  </div>
);
