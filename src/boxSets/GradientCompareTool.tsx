import React, {useMemo} from "react";
import {Scale} from "chroma-js";
import {channelShift} from "./channelShiftSet";
import {CompareScaleModes} from "./CompareScaleModes";
import {ChannelShiftSettings} from "./types";
import {ChannelShiftControls, useControls} from "./ChannelShiftControls";

/**
 * doesn't check if the channel is valid, just that it appears valid
 * because this is a text input, so there will be multiple partial entries before a complete one
 */
const isCompleteChannel = (string: string) =>
    string.match(/^\w{3,4}\.\w$/) !== null;

export const GradientCompareTool = () => {
    const [state, setState] = useControls();

    return (
        <div>
            <ChannelShiftControls initialValue={state} onChange={setState}/>
            <RenderMultiModeScale {...state} />
        </div>
    );
};

export const RenderMultiModeScale = ({
                                         channel,
                                         shift,
                                         channelMax,
                                         colorCount
                                     }: ChannelShiftSettings) => {
    const scale: Scale | null = useMemo(() => {
        if (!isCompleteChannel(channel)) {
            return null;
        }
        try {
            return channelShift(channel, shift, channelMax);
        } catch (e) {
            console.error(e);
            return null;
        }
    }, [channel, shift, channelMax]);

    return (
        <div>
            {scale !== null && colorCount > 0 && (
                <CompareScaleModes scale={scale} count={colorCount}/>
            )}
        </div>
    );
};


