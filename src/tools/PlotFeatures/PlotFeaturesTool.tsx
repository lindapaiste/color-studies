import React from "react";
import {
  FlexRow,
  NumberInput,
  SelectChannel,
  SelectGroup,
  Tool,
} from "components";
import { StateUpdateProps } from "lib/util-hooks";
import { MaybeUndefined } from "lib";
import { randomChannel } from "logic";
import { randomGroupName } from "data";
import { PlotFeatures, Props } from "./PlotFeatures";

/**
 * using partial settings because does not set a default x and y axis
 */
export const PlotFeaturesControls = ({
  state,
  update,
}: StateUpdateProps<MaybeUndefined<Props>>) => {
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

/**
 * tool allows dynamic creation of a PlotFeatures component
 * by allowing the user to select the group, two properties/channels (x and y)
 * and sample size (count) for the plot
 */
export const PlotFeaturesTool = () => (
  <Tool
    initialSettings={{
      colorCount: 100,
      group: randomGroupName(),
      xChannel: randomChannel(),
      yChannel: randomChannel(),
    }}
    RenderControls={PlotFeaturesControls}
    RenderContents={PlotFeatures}
  />
);
