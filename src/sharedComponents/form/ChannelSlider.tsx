import React from "react";
import {Slider} from "@material-ui/core";
import {I_ColorAdapter} from "../../packages/ColorAdapter";
import {ChannelAccessor} from "../../spacesChannels/types";
import {GenericProps, Size, WithoutE} from "./types";
import {GradientBar} from "../color/GradientBar";
import {FormLabelWrapper} from "./LabelWrapper";
import {ChannelAdapter} from "../../spacesChannels/ChannelAdapter";
import {eitherToObject} from "../../spacesChannels/channels";

/**
 * expects a normalized value between 0 and 1
 */
//number | [number, number];
export interface ExtraProps {
    color: I_ColorAdapter;
    channel: ChannelAccessor | ChannelAdapter;
    normalized: boolean;
}

type Props<T> = WithoutE<GenericProps<T>> & ExtraProps & Partial<Size>

/**
 * just the slider itself, without labels or borders
 */
export const ChannelSlider = <T extends (number | number[])>({color, channel, normalized, onChange, width = 200, height = 50, ...props}: Props<T>) => {
    const _channel = eitherToObject(channel);
    return (
        <div style={{position: "relative"}}>
            <GradientBar
                width={width}
                height={height}
                initial={color}
                channel={_channel}
            />
            <div style={{position: "absolute", top: 0, left: 0, width, height, display: "flex", alignItems: "center"}}>
                <Slider
                    {...props}
                    min={normalized ? 0 : _channel.min}
                    max={normalized ? 1 : _channel.max}
                    //step MUST be defined in order to use normalized values because the default step is 1
                    step={.001}
                    onChange={(_, v) => onChange(v as T)}
                />
            </div>
        </div>
    )
}

/**
 * version with label and border for consistency with other input elements
 */
export const ChannelSliderInput = <T extends (number | number[])>({label = "Channel Range", ...props}: Props<T>) => (
    <FormLabelWrapper label={label} padding={8}>
        <ChannelSlider {...props}/>
    </FormLabelWrapper>
);

