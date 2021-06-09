import React from "react";
import {
  CheckboxInput,
  FlexRow,
  MultiSelectModel,
  NumberInput,
  SelectMultipleColors,
} from "components";
import { StateUpdateProps } from "lib/util-hooks";
import { IColorAdapter } from "logic/color/types";
import { ModelAdapter } from "logic/spacesChannels/ModelAdapter";
import { ColorSpaceName } from "logic/spacesChannels/types";

/**
 * observations:
 * lab ( followed by rgb ) has the smoothest transition, though intermediate colors can appear dingy
 * hsv and hsl have good results on hue shift scales because intermediates are just as bright
 * hcl can have problem with intermediate cyans being too bright, while hsv appears to tone it down a bit more
 * hcl has much more consistent tone tha hsv on purple to orange and green to red
 *
 * difference is most obvious from royal blue to yellow
 * rgb goes though lighter blues
 * lab through lilacs
 * hcl through bright purple, pink, orange
 * hsv through cyan and green
 */

export interface Settings {
  colors: IColorAdapter[];
  count?: number;
  models?: ModelAdapter<ColorSpaceName>[];
  transform?: boolean;
}

export const GradientCompareControls = ({
  state,
  update,
}: StateUpdateProps<Settings>) => (
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
