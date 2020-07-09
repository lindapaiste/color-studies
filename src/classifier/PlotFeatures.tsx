import React from "react";
import Plot from "react-plotly.js";
import {ColorPropKey} from "../properties/types";
import {sampleSize} from "lodash";
import {GroupedHex, shuffledHexes} from "./buildModel";
import {pointsToVectors, PointTuple} from "../luminosity/LuminosityChart";
import {Data} from "plotly.js";
import {ChromaAdapter} from "../properties/chroma-adapter";

export interface Props {
    count: number;
    x: ColorPropKey;
    y: ColorPropKey;
    group: string;
}

/**
 * plot features within a group against those from outside the group
 */

export const PlotFeatures = ({count, x, y, group}: Props) => {
    const dataSet = shuffledHexes();
    const inGroup = sampleSize( dataSet.filter( o => o.group === group ), count );
    const notInGroup = sampleSize( dataSet.filter( o => o.group !== group ), count );

    const toTrace = (data: GroupedHex[]): Data => {
        const points: PointTuple[] = data.map( ({hex}) => {
            const obj = new ChromaAdapter(hex);
            return [obj[x], obj[y]];
        });
        return {
            ...pointsToVectors(points), //x and y
            xaxis: x,
            yaxis: y,
            mode: "markers",
            type: "scatter",
        }
    };

    return (
        <Plot
            data={[
            toTrace(inGroup),
            toTrace(notInGroup)
        ]}
              layout={{width: 1400, height: 1000}}
        />
    )
};
