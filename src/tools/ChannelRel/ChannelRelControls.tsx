import React from "react";
import {
  FlexRow,
  NumberInput,
  SelectChannel,
  ToolControlProps,
} from "components";
import { Settings } from "./settings";

export const ChannelRelControls = ({
  state,
  update,
}: ToolControlProps<Settings>) => (
  <FlexRow>
    <SelectChannel
      label="X Axis Channel"
      value={state.xChannel}
      onChange={(v) => update({ xChannel: v })}
      style={{
        width: "30%",
      }}
    />
    <SelectChannel
      label="Y Axis Channel"
      value={state.yChannel}
      onChange={(v) => update({ yChannel: v })}
      style={{
        width: "30%",
      }}
    />
    <NumberInput
      label="Number of Lines"
      value={state.colorCount}
      onChange={(v) => update({ colorCount: v })}
      isInt
      min={1}
      style={{
        width: "20%",
      }}
    />
    <NumberInput
      label="Points Per Line"
      value={state.stepCount}
      onChange={(v) => update({ stepCount: v })}
      isInt
      min={2}
      style={{
        width: "20%",
      }}
    />
  </FlexRow>
);
