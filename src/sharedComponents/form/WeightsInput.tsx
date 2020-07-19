import React, {CSSProperties} from "react";
import {ColorSpaceName, ColorTuple} from "../../spacesChannels/types";
import {getSpaceChannels} from "../../spacesChannels/colorSpaces";
import {NumberInput} from "./NumberInput";
import startCase from "lodash/startCase";
import {replaceIndex, tupleMap} from "../../util";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import RefreshIcon from "@material-ui/icons/Refresh";

export interface Props<CS extends ColorSpaceName> {
    colorSpace: CS;
    weights: ColorTuple<CS>;

    onChange(weights: ColorTuple<CS>): void;

    inputStyle?: CSSProperties;
    containerStyle?: CSSProperties;
    showReset?: boolean;
}

export const WeightsInput = <CS extends ColorSpaceName>({colorSpace, weights, onChange, inputStyle = {}, containerStyle = {}, showReset = true}: Props<CS>) => {
    const channels = getSpaceChannels(colorSpace);
    return (
        <div style={{
            ...containerStyle,
            display: "flex",
        }}>
            {channels.map((channel, i) => (
                <NumberInput
                    key={channel}
                    label={startCase(channel) + " Weight"}
                    value={weights[i]}
                    onChange={v => onChange(replaceIndex(weights, i, v))}
                    min={0}
                    step={0.25}
                    style={{
                        ...inputStyle,
                        width: 100,
                        flex: 1,
                    }}
                />
            ))}
            {showReset &&
            <Tooltip title="Reset all weights to 1" arrow>
                <IconButton onClick={() => onChange(tupleMap(weights, 1))}>
                    <RefreshIcon/>
                </IconButton>
            </Tooltip>
            }
        </div>

    )
}
