import { MultiSelectChannel, NumberInput, ToolControlProps } from "components";
import { Settings } from "./settings";

export const Controls = ({ state, update }: ToolControlProps<Settings>) => (
  <>
    <NumberInput
      label="Epochs"
      value={state.epochs}
      onChange={(v) => update({ epochs: v })}
      isInt
    />
    <NumberInput
      label="Learning Rate"
      value={state.learningRate}
      onChange={(v) => update({ learningRate: v })}
      isInt={false}
    />
    <NumberInput
      label="Sample Size"
      value={state.sampleSize}
      onChange={(v) => update({ sampleSize: v })}
      isInt
    />
    <MultiSelectChannel
      value={state.channels}
      onChange={(v) => update({ channels: v })}
    />
  </>
);
