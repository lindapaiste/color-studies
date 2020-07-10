import {ChannelShiftSettings} from "./types";
import {TextInput} from "../sharedComponents/form/TextInput";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import React, {useState} from "react";

export const DEFAULT_SETTINGS: ChannelShiftSettings = {
    channel: "lab.l",
    channelMax: 100,
    shift: 50,
    colorCount: 4
};
/**
 * hook automatically applies default settings so that the state is never empty
 */
export const useControls = (initialValue?: Partial<ChannelShiftSettings>) => {
    return useState<ChannelShiftSettings>({
        ...DEFAULT_SETTINGS,
        ...initialValue
    });
};
/**
 * separated the controls from the results so that other components can use the same set of controls
 */
export const ChannelShiftControls = ({
                                         initialValue = {},
                                         onChange
                                     }: {
    initialValue?: Partial<ChannelShiftSettings>;
    onChange: (s: ChannelShiftSettings) => void;
}) => {
    const [state, _setState] = useControls(initialValue);

    const applySettings = (settings: Partial<ChannelShiftSettings>): void => {
        const combined = {...state, settings};
        _setState(combined);
        onChange(combined);
    };

    return (
        <div>
            <div>
        <span>
          Channel:{" "}
            <TextInput
                value={state.channel}
                onChange={v => applySettings({channel: v})}
            />
        </span>
                <span>
          Channel Max:{" "}
                    <NumberInput
                        value={state.channelMax}
                        onChange={v => applySettings({channelMax: v})}
                    />
        </span>
                <span>
          Shift Amount:{" "}
                    <NumberInput
                        value={state.shift}
                        onChange={v => applySettings({shift: v})}
                    />
        </span>
                <span>
          Color Count:{" "}
                    <NumberInput
                        value={state.colorCount}
                        onChange={v => applySettings({colorCount: v})}
                    />
        </span>
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
