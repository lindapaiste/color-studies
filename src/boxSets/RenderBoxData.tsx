import React, {useState} from "react";
import {Color} from "chroma-js";
import {Evaluation} from "./types";
import "./box-style.css";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {flatten, shuffle} from "lodash";

export interface BoxData {
    color: Color; //the box color
    matches: Evaluation<Color>[]; //the balls
}

export const RenderBoxData = ({data}: { data: BoxData[] }) => {

    const [isShuffle, setIsShuffle] = useState(false);

    const final = isShuffle ? shuffleData(data) : data;

    return (
        <div className={"boxes-screen"}>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isShuffle}
                            onChange={(e) => setIsShuffle(e.target.checked)}
                            name="isShuffle"
                        />
                    }
                    label="Shuffled"
                />
            </FormGroup>
            {final.map((box, i) => (
                    <RenderBox
                        key={i}
                        {...box}
                    />
                )
            )}
        </div>
    )
};

/**
 * keeps the same number of matches in each box, but randomizes
 */
export const shuffleData = (data: BoxData[]): BoxData[] => {
    const allMatches = shuffle(flatten(data.map(o => o.matches)));
    return data.map((box, i) => {
        const start = data.slice(0, i).reduce((sum, obj) => sum + obj.matches.length, 0);
        const end = start + box.matches.length;
        return {
            color: box.color,
            matches: allMatches.slice(start, end)
        }
    });
};

export const RenderBox = ({color, matches}: BoxData) => (
    <div
        className={"boxes-box"}
        style={{borderColor: color.hex()}}
    >
        {matches.map((match, j) => (
                <div
                    key={j}
                    className={"boxes-ball"}
                    style={{backgroundColor: match.color.hex()}}
                    title={`distance: ${match.distance}\n distinctness: ${match.distinctness}`}
                />
            )
        )}
    </div>
);
