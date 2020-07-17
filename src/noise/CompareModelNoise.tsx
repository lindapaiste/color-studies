import { Props } from "./CompareNoiseChannels";
import React, { useState } from "react";
import { Swatch } from "../sharedComponents/color/Swatch";
import { NumberInput } from "../sharedComponents/form/NumberInput";
import { getSpaceChannels } from "../spacesChannels/colorSpaces";
import { makeArray, replaceIndex } from "../util";
import { ColorSpaceName, ColorTuple } from "../spacesChannels/types";
import { SelectModel } from "../sharedComponents/form/SelectModel";
import { RenderSet } from "../sharedComponents/color/RenderSet";
import { withModelNoise } from "./modelNoise";
import startCase from "lodash/startCase";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { I_ColorAdapter } from "packages/color-adapter";
import Tooltip from "@material-ui/core/Tooltip";

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
      <ModelNoiseControls settings={settings} onChange={onChange} />
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

/**
 * hook which allows setState to set only a partial state
 */
export const usePartialState = <T extends object>(
  initialState: T
): [T, (v: Partial<T>) => void] => {
  const [state, setState] = useState(initialState);

  return [
    state,
    (changes: Partial<T>) =>
      setState(prevState => ({ ...prevState, ...changes }))
  ];
};

/**
 * could include color here rather than in HOC
 */
export interface NoiseSettings {
  colorSpace: ColorSpaceName;
  noiseRatio: number;
  weights: ColorTuple<ColorSpaceName>;
}

/**
 * need to ensure that the length of weights matches the given model
 * is it easier to just include a fourth value and ignore when not needed?
 * vs. useEffect to update the value when model changes to one with a different length
 * note that a 4-length tuple also fills the interface of a 3-length tuple
 */

export const DEFAULT_SETTINGS: NoiseSettings = {
  colorSpace: "rgb",
  noiseRatio: 0.1,
  weights: [1, 1, 1, 1]
};

export interface _ControlProps {
  initialValue?: Partial<NoiseSettings>;
  onChange(settings: NoiseSettings): void;
}

export interface ControlProps {
  settings: NoiseSettings;
  onChange(settings: Partial<NoiseSettings>): void;
}

/**
 * Not controlling any state here.
 * Expecting the parent to pass down a complete settings object
 * and be able to respond to partial changes
 */
export const ModelNoiseControls = ({ settings, onChange }: ControlProps) => {
  const { noiseRatio, colorSpace, weights } = settings;
  return (
    <div>
      <NumberInput
        label="Noise Ratio"
        helperText="Number Between 0 and 1"
        value={noiseRatio}
        onChange={v => onChange({ noiseRatio: v })}
        isInt={false}
        step={0.05}
        max={1}
        min={0}
      />
      <SelectModel
        value={colorSpace}
        onChange={v => onChange({ colorSpace: v })}
      />
      {getSpaceChannels(colorSpace).map((channel, i) => (
        <NumberInput
          key={channel}
          label={startCase(channel) + " Weight"}
          value={weights[i]}
          onChange={v => onChange({ weights: replaceIndex(weights, i, v) })}
          min={0}
          step={0.25}
        />
      ))}
      <Tooltip title="Reset all weights to 1" arrow>
        <IconButton onClick={() => onChange({ weights: [1, 1, 1, 1] })}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
