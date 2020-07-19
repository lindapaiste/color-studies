import {I_ColorAdapter} from "../packages/color-adapter";
import {ChannelProps, getChannelProps} from "../noise/channelNoise";
import _clamp from "lodash/clamp";
import {ChannelName} from "../spacesChannels/types";
import {nameToAccessor} from "../spacesChannels/accessorConversion";

export const transformChannel = (initial: I_ColorAdapter, channel: ChannelName, transform: (v: number) => number): I_ColorAdapter => {
    const props = getChannelProps(channel);
    const value = initial.get(nameToAccessor(channel));
    const newValue = calculateTransformed({...props, value, transform});
    return initial.set(nameToAccessor(channel), newValue);
};

export type CalcProps = ChannelProps & {
    value: number;
    transform(v: number): number;
}

export const calculateTransformed = ({value, transform, clamp = false, max = 100, min = 0, postTransform = c => c, preTransform = c => c}: CalcProps): number => {
    const result = postTransform(transform(preTransform(value)));
    return clamp ? _clamp(result, min, max) : result;
};
