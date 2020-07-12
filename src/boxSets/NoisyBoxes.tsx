import chroma, { Color } from "chroma-js";
import React, { useMemo, useState } from "react";
import { ChannelShiftControls, useControls } from "./ChannelShiftControls";
import { createColors } from "./channelShift";
import { getDistance, randomColors } from "../properties/chroma-js";
import { Evaluation, Levers } from "./types";
import { getError, matchToChoices } from "./colorMatchesBox";
import { BoxData, RenderBoxData } from "./RenderBoxData";
import { LeverControls, useLevers } from "./LeverControls";
import "./box-style.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { shuffleData } from "./shuffleData";
import {flatMap} from "lodash";
import {getNoisy} from "../noise/modelNoise";
import {ConvertAdapter} from "../properties/convert-adapter";
/**
 * right now just looks at a bunch of random colors and filters
 * rather than computing a noisy color that is expected to match
 */

export interface Props {
    colors: Color[];
    levers: Levers;
    isShuffle: boolean;
}

export const NoisyBoxes = ({ colors, levers, isShuffle }: Props) => {
    /**
     * use Memos to reduce re-rendering because want to
     * be able to tweak levers with the same color choices
     * the evaluation itself does not need the levers,
     * they are used when seeing if the evaluation is a match
     */
    const evaluations: Evaluation<Color>[] = useMemo(() => {
       // const random = randomColors(200);
        const random = flatMap( colors, c => [...new Array(100)].map( () => chroma( getNoisy({color: new ConvertAdapter(c), colorSpace: "rgb", noiseRatio: .3}).to("rgb") ) ) );
        return random.map(c => matchToChoices(getDistance, c, colors));
    }, [colors]);

    const boxData: BoxData[] = colors.map(color => ({
        color,
        matches: [] as Evaluation<Color>[]
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

    const final = isShuffle ? shuffleData(boxData) : boxData;

    return <RenderBoxData data={final} />;
};

export const NoisyBoxTool = () => {
    const initialControls = {};
    const [controls, setControls] = useControls(initialControls);
    const [levers, setLevers] = useLevers();
    const [isShuffle, setIsShuffle] = useState(false);

    const colors = useMemo(() => {
            try {
                const colors = createColors(controls);
                console.log("distance between boxes");
                colors.map( c => colors.map( t => console.log( getDistance(c, t) ) ) );
                return colors;
            } catch (e) {
                return [];
            }
        }, [controls]
    );

    return (
        <div className="boxes-tool-screen">
            <div>
                <ChannelShiftControls
                    initialValue={initialControls}
                    onChange={setControls}
                />
                <LeverControls onChange={setLevers} />
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isShuffle}
                                onChange={e => setIsShuffle(e.target.checked)}
                                name="isShuffle"
                            />
                        }
                        label="Shuffled"
                    />
                </FormGroup>
            </div>
            <NoisyBoxes colors={colors} levers={levers} isShuffle={isShuffle} />
        </div>
    );
};
