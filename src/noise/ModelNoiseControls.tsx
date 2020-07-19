import {StateUpdateProps} from "../util-hooks";
import {NoiseSettings} from "./types";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import {SelectModel} from "../sharedComponents/form/SelectModel";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";
import React from "react";
import {WeightsInput} from "../sharedComponents/form/WeightsInput";

/**
 * Not controlling any state here.
 * Expecting the parent to pass down a complete settings object
 * and be able to respond to partial changes
 */
export const ModelNoiseControls = ({state, update}: StateUpdateProps<NoiseSettings>) => {
    const {noiseRatio, colorSpace, weights} = state;
    return (
        <div>
            <NumberInput
                label="Noise Ratio"
                helperText="Number Between 0 and 1"
                value={noiseRatio}
                onChange={v => update({noiseRatio: v})}
                isInt={false}
                step={0.05}
                max={1}
                min={0}
            />
            <SelectModel
                value={colorSpace}
                onChange={v => update({colorSpace: v})}
            />
            <WeightsInput colorSpace={colorSpace} weights={weights} onChange={v => update({weights: v})}/>
            <Tooltip title="Reset all weights to 1" arrow>
                <IconButton onClick={() => update({weights: [1, 1, 1, 1]})}>
                    <RefreshIcon/>
                </IconButton>
            </Tooltip>
        </div>
    );
};
