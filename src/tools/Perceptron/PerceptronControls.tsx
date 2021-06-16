import React from "react";
import {
  FlexRow,
  MultiSelectChannel,
  NumberInput,
  SelectGroup,
  ToolControlProps,
} from "components";
import { Settings } from "./types";

export const PerceptronControls = ({
  state,
  update,
}: ToolControlProps<Settings>) => (
  <FlexRow>
    <SelectGroup value={state.group} onChange={(v) => update({ group: v })} />
    <MultiSelectChannel
      label="Features"
      value={state.channels}
      onChange={(v) => update({ channels: v })}
      showSelectAll={false}
    />
    <NumberInput
      label="Test Color Count"
      value={state.testCount}
      onChange={(v) => update({ testCount: v })}
    />
  </FlexRow>
);
