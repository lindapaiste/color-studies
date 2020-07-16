import React from "react";
import {BoxData} from "./types";
import "./box-style.css";
import {I_GetHex} from "../packages/color-adapter";

export const RenderBoxData = ({ data }: { data: BoxData<I_GetHex>[] }) => {
    return (
        <div className={"boxes-area"}>
            {data.map((box, i) => (
                <RenderBox key={i} {...box} />
            ))}
        </div>
    );
};

export const RenderBox = ({ color, matches }: BoxData<I_GetHex>) => (
    <div className={"boxes-box"} style={{ borderColor: color.hex() }}>
        {matches.map((match, j) => (
            <div
                key={j}
                className={"boxes-ball"}
                style={{ backgroundColor: match.color.hex() }}
                title={`distance: ${match.distance}\n distinctness: ${
                    match.distinctness
                    }`}
            />
        ))}
    </div>
);
