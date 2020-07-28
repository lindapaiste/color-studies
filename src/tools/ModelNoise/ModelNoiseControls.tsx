import {StateUpdateProps} from "../../lib/util-hooks";
import {ModelNoiseSettings} from "../../noise/types";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import {SelectModel} from "../../sharedComponents/form/SelectModel";
import React from "react";
import {WeightsInput} from "../../sharedComponents/form/WeightsInput";
import {FlexRow} from "../../sharedComponents/ui/FlexRow";

/**
 * Not controlling any state here.
 * Expecting the parent to pass down a complete settings object
 * and be able to respond to partial changes
 */
export const ModelNoiseControls = ({state, update}: StateUpdateProps<ModelNoiseSettings>) => {
    const {noiseRatio, colorSpace, weights} = state;
    return (
        <FlexRow>
            <NumberInput
                label="Noise Ratio"
                helperText="Number Between 0 and 1"
                value={noiseRatio}
                onChange={v => update({noiseRatio: v})}
                isInt={false}
                step={0.05}
                max={1}
                min={0}
                style={{
                    width: "25%"
                }}
            />
            <SelectModel
                value={colorSpace}
                onChange={v => update({colorSpace: v})}
                style={{
                    width: "25%"
                }}
            />
            <WeightsInput
                model={colorSpace}
                weights={weights}
                onChange={v => update({weights: v})}
                showReset={true}
                containerStyle={{
                    width: "50%"
                }}
            />
        </FlexRow>
    );
};
