import React, { CSSProperties } from "react";
import { ColorSpaceName, ColorTuple } from "../../spacesChannels/types";
import { NumberInput } from "./NumberInput";
import { replaceIndex, tupleMap } from "../../lib";
import { RefreshIcon } from "../ui/Icons";
import { IconTooltipButton } from "../ui/IconTooltipButton";
import { ModelAdapter } from "../../spacesChannels/ModelAdapter";
import { eitherToModel } from "../../spacesChannels/models";

export interface Props<CS extends ColorSpaceName> {
  model: CS | ModelAdapter<CS>;
  weights: ColorTuple<CS>;

  onChange(weights: ColorTuple<CS>): void;

  inputStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  showReset?: boolean;
}

export const WeightsInput = <CS extends ColorSpaceName>({
  model,
  weights,
  onChange,
  inputStyle = {},
  containerStyle = {},
  showReset = true,
}: Props<CS>) => {
  const modelObj = eitherToModel(model);
  return (
    <div
      style={{
        ...containerStyle,
        display: "flex",
      }}
    >
      {modelObj.channels.map((channel, i) => (
        <NumberInput
          key={channel.key}
          label={channel.title + " Weight"}
          value={weights[i]}
          onChange={(v) => onChange(replaceIndex(weights, i, v))}
          min={0}
          step={0.25}
          style={{
            ...inputStyle,
            width: 100,
            flex: 1,
          }}
        />
      ))}
      {showReset && (
        <IconTooltipButton
          title="Reset all weights to 1"
          icon={<RefreshIcon />}
          onClick={() => onChange(tupleMap(weights, 1))}
        />
      )}
    </div>
  );
};
