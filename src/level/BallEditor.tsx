import React, {useEffect, useMemo, useState} from "react";
import {BallCreateSettings, generateBall} from "../boxSets/generateBoxBalls";
import {replaceIndex} from "../lib";
import {Button} from "../sharedComponents/ui/Button";
import {Box, Ball, TooltipContent} from "../tools/NoisyBoxes/RenderBoxData";
import {IconTooltipButton} from "../sharedComponents/ui/IconTooltipButton";
import {EditIcon, XCircleIcon} from "../sharedComponents/ui/Icons";
import {I_ColorAdapter} from "../packages/ColorAdapter";
import {getError, matchToChoices} from "../boxSets/colorMatchesBox";
import {SelectColor} from "../sharedComponents/form/SelectColor";
import {BoxData, Rejection} from "../boxSets/types";
import {BallDisplaySettings, Identifier} from "./types";
import {shuffleData} from "../boxSets/shuffleData";
import {Tooltip} from "../sharedComponents/ui/Tooltip";

export interface DataProps {
    data: BoxData[];

    setData(data: BoxData[]): void;

    settings: BallCreateSettings;
}

export type Props = DataProps & BallDisplaySettings

/**
 * only allow editing when not shuffled
 * otherwise, need to redo because would not know the actual position/id in the data object
 */
export const BallsEditor = ({data, setData, settings, darkBackground, shuffle, showTools, showRejected}: Props) => {
    const [editing, setEditing] = useState<Identifier | null>(null);

    //no reason to append at the end, why not just replace this one?
    const handleRemove = (id: Identifier) => {
        const box = data[id.boxIndex];
        const replacement = generateBall(box.color, settings, data.map(b => b.color));
        setData(replaceIndex(data, id.boxIndex, {
            ...box,
            matches: replaceIndex(box.matches, id.ballIndex, replacement)
        }));
    }

    const _data = useMemo( () => shuffle ? shuffleData(data) : data, [data, shuffle] );


    return (
        <div>
            {editing !== null &&
            <>
                <Button onClick={() => setEditing(null)}>Close</Button>
                <EditingBall data={data} setData={setData} settings={settings} id={editing}/>
            </>
            }
            <div className={"boxes-area"} style={{backgroundColor: darkBackground ? "black" : "white"}}>
                {_data.map((box, boxIndex) => (
                    <Box key={boxIndex} color={box.color}>
                        {box.matches.map((match, ballIndex) => (
                            <div key={ballIndex}>
                                <Ball {...match} />
                                {showTools && ! shuffle &&
                                <div>
                                    <IconTooltipButton
                                        title={"Edit Color"}
                                        icon={<EditIcon htmlColor={darkBackground ? "white" : "black"} fontSize={"small"}/>}
                                        onClick={() => setEditing({boxIndex, ballIndex})}
                                        style={{
                                            padding: 2,
                                        }}
                                    />
                                    <IconTooltipButton
                                        title={"Remove"}
                                        icon={<XCircleIcon htmlColor={darkBackground ? "white" : "black"} fontSize={"small"}/>}
                                        onClick={() => handleRemove({boxIndex, ballIndex})}
                                        style={{
                                            padding: 2,
                                        }}
                                    />
                                </div>
                                }
                            </div>
                        ))}
                        {showRejected && (box.rejected || []).map((match, i) => (
                            <Ball
                                key={i}
                                {...match}
                                RenderTooltip={() => RejectionTooltip(match)}
                            />
                        ))}
                    </Box>
                ))}
            </div>
        </div>
    );
}
/**
 * the distance property of evaluation stores the distance to the matched box, not to the intended match
 * need to know the index of intended match to show that
 */
export const RejectionTooltip = (props: Rejection) => (
    <div>
        <div>{props.error.message}</div>
        <div>matches box #{props.distances.findIndex(v => v === Math.min(...props.distances)) + 1}</div>
        <TooltipContent {...props}/>
    </div>
)

export const EditingBall = ({data, setData, settings, id}: DataProps & { id: Identifier }) => {

    const setBallColor = (color: I_ColorAdapter) => {
        const box = data[id.boxIndex];
        const ball = box.matches[id.ballIndex];
        setData(replaceIndex(data, id.boxIndex, {
            ...box,
            matches: replaceIndex(box.matches, id.ballIndex, {...ball, color})
        }));
    }

    const ballColor = () => data[id.boxIndex].matches[id.ballIndex].color;

    const [color, setColor] = useState<I_ColorAdapter>(ballColor);

    //change color when switching id
    useEffect(() => {
        setColor(ballColor());
    }, [id]);

    const evaluation = matchToChoices(settings.getDistance, color, data.map(box => box.color));

    const error = getError(evaluation, settings, data[id.boxIndex].color)

    useEffect(() => {
        if (error === false) {
            setBallColor(color);
        }
    }, [color, error]);

    return (
        <div>
            <SelectColor value={color} onChange={setColor}/>
            {error &&
            <div>{error.message}</div>
            }
        </div>
    )

}
