import React from "react";
import {ColorSpaceName, ColorTuple} from "../../spacesChannels/types";
import {getSpaceChannels} from "../../spacesChannels/colorSpaces";
import {NumberInput} from "./NumberInput";
import startCase from "lodash/startCase";
import {replaceIndex, percentString} from "../../util";

export interface Props<CS extends ColorSpaceName> {
    colorSpace: CS;
    weights: ColorTuple<CS>;
    onChange( weights: ColorTuple<CS> ): void;
}

export const WeightsInput = <CS extends ColorSpaceName>({colorSpace, weights, onChange}: Props<CS>) => {
    const channels = getSpaceChannels(colorSpace);
    return (
        <div style={{
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
                        width: 100,
                        flex: 1,
                    }}
                />
            ))}
        </div>

    )
}
