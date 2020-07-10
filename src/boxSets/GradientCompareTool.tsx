import React, {useMemo} from "react";
import {Scale} from "chroma-js";
import {useNumberInput} from "../sharedComponents/form/useNumberInput";
import {useGenericInput} from "../sharedComponents/form/useGenericInput";
import {channelShift} from "./channelShift";
import {CompareScaleModes} from "./CompareScaleModes";

/**
 * doesn't check if the channel is valid, just that it appears valid
 * because this is a text input, so there will be multiple partial entries before a complete one
 */
const isCompleteChannel = (string: string) => string.match(/^\w{3,4}\.\w$/) !== null;

export const GradientCompareTool = () => {
    const [channel, InputChannel] = useGenericInput('lab.l');
    const [shift, InputShift] = useNumberInput(50);
    const [max, InputMax] = useNumberInput(100);
    const [count, InputCount] = useNumberInput(4);

    const scale: Scale | null = useMemo(
        () => {
            if (!isCompleteChannel(channel)) {
                return null;
            }
            try {
                return channelShift(channel, shift, max);
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        [channel, shift, max]
    );

    return (
        <div>
            <div>
                <span>Channel: <InputChannel/></span>
                <span>Channel Max: <InputMax/></span>
                <span>Shift Amount: <InputShift/></span>
                <span>Color Count: <InputCount/></span>
            </div>
            {shift > max * .5 &&
            <div>WARNING: Shift amount should not be more than half of the channel range due to limitations of the
                current method. This will likely be fixed in the future.</div>}
            {
                scale !== null && count > 0 &&
                <CompareScaleModes
                    scale={scale}
                    count={count}
                />
            }
        </div>
    )
};
