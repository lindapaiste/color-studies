import React, {CSSProperties} from "react";
import {ColorSpaceName, ColorTuple} from "../../spacesChannels/types";
import {getSpaceChannelNames} from "../../spacesChannels/colorSpaces";
import {NumberInput} from "./NumberInput";
import {replaceIndex, tupleMap, proper} from "../../lib";
import {RefreshIcon} from "../ui/Icons";
import {IconTooltipButton} from "../ui/IconTooltipButton";

export interface Props<CS extends ColorSpaceName> {
    colorSpace: CS;
    weights: ColorTuple<CS>;

    onChange(weights: ColorTuple<CS>): void;

    inputStyle?: CSSProperties;
    containerStyle?: CSSProperties;
    showReset?: boolean;
}

export const WeightsInput = <CS extends ColorSpaceName>({colorSpace, weights, onChange, inputStyle = {}, containerStyle = {}, showReset = true}: Props<CS>) => {
    const channels = getSpaceChannelNames(colorSpace);
    return (
        <div style={{
            ...containerStyle,
            display: "flex",
        }}>
            {channels.map((channel, i) => (
                <NumberInput
                    key={channel}
                    label={proper(channel) + " Weight"}
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
                <IconTooltipButton
                    title={"Reset all weights to 1"}
                    icon={<RefreshIcon/>}
                    onClick={() => onChange(tupleMap(weights, 1))}
                />
            }
        </div>

    )
}
