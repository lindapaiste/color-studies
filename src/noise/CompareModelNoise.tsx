import {Props} from "./CompareNoiseChannels";
import React from "react";
import {Swatch} from "../sharedComponents/color/Swatch";
import {makeArray} from "../util";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {withModelNoise} from "./modelNoise";
import Typography from "@material-ui/core/Typography";
import {I_ColorAdapter} from "packages/color-adapter";
import {usePartialState} from "../util-hooks";
import {DEFAULT_SETTINGS, NoiseSettings} from "./types";
import {ModelNoiseControls} from "./ModelNoiseControls";

/**
 * tool to visualize the changes made by adjusting weights
 * for noise generation in a color space
 */

export const CompareModelNoise = (props: {
  colors: I_ColorAdapter[];
  countPer?: number;
}) => {
  const [settings, onChange] = usePartialState(DEFAULT_SETTINGS);

  return (
    <div>
      <ModelNoiseControls state={settings} update={onChange} />
      <Typography variant="h2">Results</Typography>
      {props.colors.map(color => (
        <NoisyColors {...props} color={color} settings={settings} />
      ))}
    </div>
  );
};

/**
 * makes a band of the original color on top of the normal RenderSet
 */
export const NoisyColors = ({
  color,
  countPer = 25,
  settings
}: Props & { settings: NoiseSettings }) => (
  <div>
    <Swatch color={color.hex()} size={"100%"} height={30} />
    <RenderSet
      colors={makeArray(countPer, () => withModelNoise({ color, ...settings }))}
    />
  </div>
);

