import chroma, {Color} from "chroma-js";
import React, {useEffect, useMemo, useState} from "react";
import {ChannelShiftControls, useControls} from "./ChannelShiftControls";
import {createColors} from "../../channel/channelShiftSet";
import {BoxData, Evaluation, Levers} from "../../boxSets/types";
import {getError, matchToChoices} from "../../boxSets/colorMatchesBox";
import {RenderBoxData} from "./RenderBoxData";
import {LeverControls} from "./LeverControls";
import "./box-style.css";
import {shuffleData} from "../../boxSets/shuffleData";
import {flatMap} from "../../lib";
import {withModelNoise} from "../../noise/modelNoise";
import {ColorAdapter} from "../../color/ColorAdapter";
import {Toggle} from "../../sharedComponents/form/Toggle";
import {usePartialState} from "../../lib/util-hooks";

//export const getDistance = (a: Color, b: Color) => chroma.deltaE(a, b, 1, 5);
export const getDistance = chroma.deltaE;

/**
 * right now just looks at a bunch of random colors and filters
 * rather than computing a noisy color that is expected to match
 */

export interface Props {
    colors: Color[];
    levers: Levers;
    isShuffle: boolean;
}

export const NoisyBoxes = ({colors, levers, isShuffle}: Props) => {
    /**
     * use Memos to reduce re-rendering because want to
     * be able to tweak levers with the same color choices
     * the evaluation itself does not need the levers,
     * they are used when seeing if the evaluation is a match
     */
    const evaluations: Evaluation<Color>[] = useMemo(() => {
        // const random = randomColors(200);
        const random = flatMap(colors, c => [...new Array(100)].map(() => chroma(withModelNoise({
            color: new ColorAdapter(c),
            colorSpace: "rgb",
            noiseRatio: .3
        }).to("rgb"))));
        return random.map(c => matchToChoices(getDistance, c, colors));
    }, [colors]);

    const boxData: BoxData<Color>[] = colors.map(color => ({
        color,
        matches: [],
        rejected: [],
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

    useEffect(
        () => {
            console.log("distance between boxes");
            colors.map(c => colors.map(t => console.log(getDistance(c, t))));
        }, [colors]
    );

    const final = isShuffle ? shuffleData(boxData) : boxData;

    return <RenderBoxData data={final}/>;
};


export const DEFAULT_LEVERS: Levers = {
    minDistance: 0,
    maxDistance: 20,
    minDistinctness: 10,
    maxDistinctness: 50
};

export const NoisyBoxTool = () => {
    const [controls, setControls] = useControls();
    const [levers, updateLevers] = usePartialState(DEFAULT_LEVERS);
    const [isShuffle, setIsShuffle] = useState(false);

    const colors = useMemo(() => {
            try {
                return createColors(controls);
            } catch (e) {
                return [];
            }
        }, [controls]
    );

    return (
        <div className="boxes-tool-screen">
            <div>
                <ChannelShiftControls
                    state={controls}
                    update={setControls}
                />
                <LeverControls state={levers} update={updateLevers}/>
                <Toggle
                    value={isShuffle}
                    onChange={setIsShuffle}
                    label="Shuffled"
                />
            </div>
            <NoisyBoxes colors={colors} levers={levers} isShuffle={isShuffle}/>
        </div>
    );
};
