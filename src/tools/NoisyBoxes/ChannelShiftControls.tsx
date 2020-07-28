import {ChannelShiftSettings} from "../../boxSets/types";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import React from "react";
import {StateUpdateProps, usePartialState} from "../../lib/util-hooks";
import {getChannel} from "../../spacesChannels/channels";
import {SelectChannel} from "../../sharedComponents/form/SelectChannel";
import FlexRow from "../../sharedComponents/ui/FlexRow";

export const CHANNEL_SHIFT_DEFAULT: ChannelShiftSettings = {
    channel: getChannel("lab.l"),
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
            <FlexRow>
                <SelectChannel
                    label="Channel"
                    value={state.channel}
                    onChange={v => update({channel: v})}
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
            </FlexRow>
            {state.channel && state.shift > state.channel.max * 0.5 && (
                <div>
                    WARNING: Shift amount should not be more than half of the channel
                    range due to limitations of the current method. This will likely be
                    fixed in the future.
                </div>
            )}
        </div>
    );
};
