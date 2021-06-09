import { NumberInput, MultiSelectChannel } from "components";
import { StateUpdateProps } from "lib/util-hooks";
import { Settings } from "./settings";

export const Controls = ({ state, update }: StateUpdateProps<Settings>) => (
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
