import { randomGroupName } from "data";
import {
  FlexRow,
  NumberInput,
  SelectGroup,
  ToolControlProps,
} from "components";

export interface Settings {
  sampleSize: number;
  group: string;
}

export const initialSettings: Settings = {
  group: randomGroupName(),
  sampleSize: 100,
};

export const Controls = ({ state, update }: ToolControlProps<Settings>) => (
  <FlexRow>
    <SelectGroup
      value={state.group}
      onChange={(v) => update({ group: v })}
      style={{ minWidth: "25%" }}
    />
    <NumberInput
      label="Test Size"
      isInt
      value={state.sampleSize}
      onChange={(v) => update({ sampleSize: v })}
    />
  </FlexRow>
);
