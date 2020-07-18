import {StateUpdateProps} from "../util-hooks";
import {ToolSettings} from "./types";
import React from "react";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import {SelectGroup} from "../sharedComponents/form/SelectGroup";
import {SelectAccessor} from "../sharedComponents/form/SelectAccessor";

export const HistogramControls = ({state, update}: StateUpdateProps<ToolSettings>) => (
    <div>
        <SelectGroup
            value={state.group}
            onChange={v => update({group: v})}
        />
        <SelectAccessor
            value={state.channel}
            onChange={v => update({channel: v})}
        />
        <NumberInput
            label="Bucket Count"
            value={state.breakpoints}
            onChange={v => update({breakpoints: v})}
            isInt={true}
            min={0}
            step={1}
        />
    </div>
);
