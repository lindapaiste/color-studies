import React from "react";
import {
  FlexRow,
  NumberInput,
  SelectChannel,
  SelectGroup,
  StateUpdateProps,
} from "components";
import { ToolSettings } from "./types";

export const HistogramControls = ({
  state,
  update,
}: StateUpdateProps<ToolSettings>) => (
  <FlexRow>
    <SelectGroup
      value={state.group}
      onChange={(v) => update({ group: v })}
      style={{ width: "33.3%" }}
    />
    <SelectChannel
      value={state.channel}
      onChange={(v) => update({ channel: v })}
      style={{ width: "33.3%" }}
    />
    <NumberInput
      label="Bucket Count"
      value={state.breakpoints}
      onChange={(v) => update({ breakpoints: v })}
      isInt
      min={1}
      step={1}
      style={{ width: "33.3%" }}
    />
  </FlexRow>
);
