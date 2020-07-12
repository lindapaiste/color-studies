import React, { useState } from "react";
import { Color } from "chroma-js";
import { Evaluation } from "./types";
import "./box-style.css";

export interface BoxData {
    color: Color; //the box color
    matches: Evaluation<Color>[]; //the balls
}

export const RenderBoxData = ({ data }: { data: BoxData[] }) => {
    return (
        <div className={"boxes-area"}>
            {data.map((box, i) => (
                <RenderBox key={i} {...box} />
            ))}
        </div>
    );
};

export const RenderBox = ({ color, matches }: BoxData) => (
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
