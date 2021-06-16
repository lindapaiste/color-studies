import React from "react";
import {
  ToolControlProps,
  FlexRow,
  NumberInput,
  SelectChannel,
  SelectGroup,
} from "components";
import { Settings } from "./PlotFeatures";

/**
 * using partial settings because does not set a default x and y axis
 */
export const PlotFeaturesControls = ({
  state,
  update,
}: ToolControlProps<Settings>) => {
  const style = {
    width: "25%",
    minWidth: 75,
    flex: 1,
  };
  return (
    <FlexRow>
      <SelectChannel
        label="X Axis"
        value={state.xChannel}
        onChange={(v) => update({ xChannel: v })}
        style={style}
      />
      <SelectChannel
        label="Y Axis"
        value={state.yChannel}
        onChange={(v) => update({ yChannel: v })}
        style={style}
      />
      <SelectGroup
        label="Grouping"
        value={state.group}
        onChange={(v) => update({ group: v })}
        style={style}
      />
      <NumberInput
        label="Sample Size"
        value={state.colorCount}
        onChange={(v) => update({ colorCount: v })}
        isInt
        style={style}
      />
    </FlexRow>
  );
};
