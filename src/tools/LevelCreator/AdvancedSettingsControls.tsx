import React from "react";
import { NumberInput, Title } from "components";
import { StateUpdateProps } from "lib";
import { Formula } from "logic/difference/Formula";
import { ModelNoise } from "logic/noise/modelNoise";
import { BallCreateSettings } from "logic/boxSets/generateBoxBalls";
import { DifferenceControls } from "../DistanceGrid/DifferenceControls";
import { LeverControls } from "../NoisyBoxes/LeverControls";
import { ModelNoiseControls } from "../ModelNoise/ModelNoiseControls";
import { AdvancedSettings } from "./types";

/**
 * thoughts:
 * can combine all settings into one object
 * this is ok because of usePartialState, as long as the properties are all at the root of the object (not nested)
 * but there is some naming collision -- noise and formula both have weights -- can they be the same?
 * can store nested, but need to write custom update function for components
 */

export const AdvancedSettingsControls = ({
  state,
  update,
}: StateUpdateProps<AdvancedSettings>) => (
  <div>
    <Title importance="h4">BallsPerBox</Title>
    <NumberInput value={state.count} onChange={(v) => update({ count: v })} />
    <Title importance="h4">Difference Formula</Title>
    <DifferenceControls
      state={state.formula}
      update={(changes) =>
        update({ formula: new Formula({ ...state.formula, ...changes }) })
      }
    />
    <Title importance="h4">Difference Requirements</Title>
    <LeverControls state={state} update={update} />
    <Title importance="h4">Noise Settings</Title>
    <ModelNoiseControls
      state={state.noise}
      update={(changes) =>
        update({ noise: new ModelNoise({ ...state.noise, ...changes }) })
      }
    />
  </div>
);

export const mapSettingsInterface = (
  settings: AdvancedSettings
): BallCreateSettings => ({
  ...settings,
  getDistance: (a, b) => settings.formula.getDeltaE(a, b),
  createNoisy: (c) => settings.noise.getNoisy(c),
});
