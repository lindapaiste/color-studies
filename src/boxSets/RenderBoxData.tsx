import React from "react";
import {Color} from "chroma-js";
import {Evaluation} from "./types";

export interface BoxData {
    color: Color; //the box color
    matches: Evaluation<Color>[]; //the balls
}

export const RenderBoxData = ({data}: { data: BoxData[] }) => {
    return (
        <div className={"boxes-screen"}>
            {data.map(({color: boxColor, matches}, i) => (
                    <div
                        key={i}
                        className={"boxes-box"}
                        style={{borderColor: boxColor.hex()}}
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
                )
            )}
        </div>
    )
};
