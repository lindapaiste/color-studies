import React from "react";
import {
  CheckboxInput,
  FlexRow,
  MultiSelectModel,
  NumberInput,
  SelectMultipleColors,
} from "components";
import { StateUpdateProps } from "lib/util-hooks";
import { Props } from "./GradientCompareTool";

export const GradientCompareControls = ({
  state,
  update,
}: StateUpdateProps<Props>) => (
  <div>
    <FlexRow>
      <SelectMultipleColors
        value={state.colors}
        onChange={(v) => update({ colors: v })}
      />
    </FlexRow>
    <FlexRow>
      <MultiSelectModel
        value={state.models}
        onChange={(v) => update({ models: v })}
      />
      <NumberInput
        label="Output Count"
        value={state.count}
        onChange={(v) => update({ count: v })}
      />
      <CheckboxInput
        label="Apply Transform?"
        value={state.transform}
        onChange={(v) => update({ transform: v })}
      />
    </FlexRow>
  </div>
);
