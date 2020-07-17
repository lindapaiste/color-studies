import React from "react";
import {I_ColorAdapter} from "../packages/color-adapter";
import {ChannelAccessor} from "../spacesChannels/types";
import {getMaxObject} from "../spacesChannels/channelMaxes";
import {intervals} from "../util";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {accessorToName} from "../spacesChannels/accessorConversion";

export interface Props {
    initial: I_ColorAdapter;
    channel: ChannelAccessor;
    count: number;
    start?: number;
    end?: number;
}


export const ChannelGradient = (props: Props) => {
    return (
        <RenderSet colors={getGradientColors(props)}/>
    );
};

/**
 * what about pre & post mapping?
 */


/**
 * can pass in a custom start and end point, but defaults to using the channel min and max
 */
export const getGradientColors = ({initial, channel, count, start, end}: Props): I_ColorAdapter[] => {
    const {min, max} = getMaxObject(accessorToName(channel));
    const _start = start === undefined ? min : start;
    const _end = end === undefined ? max : end;

    return intervals(_start, _end, count).map(
        value => initial.set(channel, value)
    );
};
