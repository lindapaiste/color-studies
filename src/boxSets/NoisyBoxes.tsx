import {Color} from "chroma-js";
import React, {useMemo} from "react";
import {ChannelShiftControls, useControls} from "./ChannelShiftControls";
import {createColors} from "./channelShift";
import {getDistance, randomColors} from "../properties/chroma-js";
import {Evaluation, Levers} from "./types";
import {getError, matchToChoices} from "./colorMatchesBox";
import {BoxData, RenderBoxData} from "./RenderBoxData";
import {LeverControls, useLevers} from "./LeverControls";

/**
 * right now just looks at a bunch of random colors and filters
 * rather than computing a noisy color that is expected to match
 */

export interface Props {
    colors: Color[];
    levers: Levers;
}

export const NoisyBoxes = ({colors, levers}: Props) => {

    /**
     * use Memos to reduce re-rendering because want to
     * be able to tweak levers with the same color choices
     * the evaluation itself does not need the levers,
     * they are used when seeing if the evaluation is a match
     */
    const evaluations: Evaluation<Color>[] = useMemo(
        () => {
            const random = randomColors(200);
            return random.map(c => matchToChoices(getDistance, c, colors))
        },
        [colors]
    );

    const boxData: BoxData[] = colors.map(color => ({
        color,
        matches: [] as Evaluation<Color>[],
    }));

    evaluations.forEach(evaluation => {
        const isError = getError(evaluation, levers);
        if (isError) return;
        const i = colors.indexOf(evaluation.match);
        if (i === -1) {
            console.error("cannot find index for color object");
            return;
        }
        boxData[i].matches.push(evaluation);
    });

    return (
        <RenderBoxData data={boxData}/>
    )

};

export const NoisyBoxTool = () => {
    const initialControls = {};
    const [controls, setControls] = useControls(initialControls);
    const [levers, setLevers] = useLevers();

    const colors = createColors(controls);

    return (
        <div>
            <ChannelShiftControls initialValue={initialControls} onChange={setControls}/>
            <LeverControls onChange={setLevers}/>
            <NoisyBoxes colors={colors} levers={levers}/>
        </div>
    );
};
