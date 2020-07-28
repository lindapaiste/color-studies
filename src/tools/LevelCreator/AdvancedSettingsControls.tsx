import {StateUpdateProps} from "../../lib/util-hooks";
import {Title} from "../../sharedComponents/ui/Title";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import {DifferenceControls} from "../DistanceGrid/DifferenceControls";
import {Formula} from "../../difference/Formula";
import {LeverControls} from "../NoisyBoxes/LeverControls";
import {ModelNoiseControls} from "../ModelNoise/ModelNoiseControls";
import {ModelNoise} from "../../noise/modelNoise";
import React from "react";
import {BallCreateSettings} from "../../boxSets/generateBoxBalls";
import {AdvancedSettings} from "./types";

/**
 * thoughts:
 * can combine all settings into one object
 * this is ok because of usePartialState, as long as the properties are all at the root of the object (not nested)
 * but there is some naming collision -- noise and formula both have weights -- can they be the same?
 * can store nested, but need to write custom update function for components
 */

export const AdvancedSettingsControls = ({state, update}: StateUpdateProps<AdvancedSettings>) => {
    return (
        <div>
            <Title importance={"h4"}>BallsPerBox</Title>
            <NumberInput
                value={state.count}
                onChange={v => update({count: v})}
            />
            <Title importance={"h4"}>Difference Formula</Title>
            <DifferenceControls
                state={state.formula}
                update={changes => update({formula: new Formula({...state.formula, ...changes})})}
            />
            <Title importance={"h4"}>Difference Requirements</Title>
            <LeverControls
                state={state}
                update={update}
            />
            <Title importance={"h4"}>Noise Settings</Title>
            <ModelNoiseControls
                state={state.noise}
                update={changes => update({noise: new ModelNoise({...state.noise, ...changes})})}
            />
        </div>
    )
}
export const mapSettingsInterface = (settings: AdvancedSettings): BallCreateSettings => {
    return {
        ...settings,
        getDistance: (a, b) => settings.formula.getDeltaE(a, b),
        createNoisy: (c) => settings.noise.getNoisy(c),
    }
}
