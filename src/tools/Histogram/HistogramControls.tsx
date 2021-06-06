import React from "react";
import { StateUpdateProps } from "../../lib/util-hooks";
import { ToolSettings } from "./types";
import { NumberInput } from "../../sharedComponents/form/NumberInput";
import { SelectGroup } from "../../sharedComponents/form/SelectGroup";
import { FlexRow } from "../../sharedComponents/ui/FlexRow";
import { SelectChannel } from "../../sharedComponents/form/SelectChannel";

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
