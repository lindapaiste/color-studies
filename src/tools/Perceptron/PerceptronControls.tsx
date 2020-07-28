import {BuildModelProps} from "../../classifier/perceptronModel";
import React from "react";
import {StateUpdateProps} from "../../lib/util-hooks";
import FlexRow from "../../sharedComponents/ui/FlexRow";
import {SelectGroup} from "../../sharedComponents/form/SelectGroup";
import MultiSelectChannel from "../../sharedComponents/form/MultiSelectChannel";
import NumberInput from "../../sharedComponents/form/NumberInput";

export type Settings = BuildModelProps & {
    testCount: number;
}

export const PerceptronControls = ({state, update}: StateUpdateProps<Settings>) => (
    <FlexRow>
        <SelectGroup
            value={state.group}
            onChange={v => update({group: v})}
        />
        <MultiSelectChannel
            label="Features"
            value={state.channels}
            onChange={v => update({channels: v})}
        />
        <NumberInput
            value={state.testCount}
            onChange={v => update({testCount: v})}
        />
    </FlexRow>
)
