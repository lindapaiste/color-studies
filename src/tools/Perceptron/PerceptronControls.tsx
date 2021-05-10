import React from "react";
import {StateUpdateProps} from "../../lib/util-hooks";
import FlexRow from "../../sharedComponents/ui/FlexRow";
import {SelectGroup} from "../../sharedComponents/form/SelectGroup";
import MultiSelectChannel from "../../sharedComponents/form/MultiSelectChannel";
import NumberInput from "../../sharedComponents/form/NumberInput";
import {Settings} from "./types";

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
            showSelectAll={false}
        />
        <NumberInput
            label="Test Color Count"
            value={state.testCount}
            onChange={v => update({testCount: v})}
        />
    </FlexRow>
)

export default PerceptronControls;
