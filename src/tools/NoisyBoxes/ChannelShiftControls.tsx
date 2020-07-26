import {ChannelShiftSettings} from "../../boxSets/types";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import React from "react";
import {StateUpdateProps, usePartialState} from "../../lib/util-hooks";
import {SelectAccessor} from "../../sharedComponents/form/SelectAccessor";
import {accessorToCode, codeToAccessor} from "../../packages/chromaSpaces";

export const CHANNEL_SHIFT_DEFAULT: ChannelShiftSettings = {
    channel: "lab.l",
    channelMax: 100,
    shift: 50,
    colorCount: 4
};
/**
 * hook automatically applies default settings so that the state is never empty
 */
export const useControls = (initialValue?: Partial<ChannelShiftSettings>) => {
    return usePartialState<ChannelShiftSettings>({
        ...CHANNEL_SHIFT_DEFAULT,
        ...initialValue
    });
};
/**
 * separated the controls from the results so that other components can use the same set of controls
 */
export const ChannelShiftControls = ({state, update}: StateUpdateProps<ChannelShiftSettings>) => {
    return (
        <div>
            <div>
                <div
                    style={{
                        display: "flex",
                        //justifyContent: "space-between"
                    }}>
                    <SelectAccessor
                        label="Channel"
                        value={codeToAccessor(state.channel)}
                        onChange={v => update({channel: accessorToCode(v)})}
                    />
                    <NumberInput
                        label="Channel Max"
                        disabled={true}
                        value={state.channelMax}
                        onChange={v => update({channelMax: v})}
                    />
                    <NumberInput
                        label="Shift Amount"
                        value={state.shift}
                        onChange={v => update({shift: v})}
                    />
                    <NumberInput
                        label="Color Count"
                        value={state.colorCount}
                        onChange={v => update({colorCount: v})}
                    />
                </div>
            </div>
            {state.shift > state.channelMax * 0.5 && (
                <div>
                    WARNING: Shift amount should not be more than half of the channel
                    range due to limitations of the current method. This will likely be
                    fixed in the future.
                </div>
            )}
        </div>
    );
};
