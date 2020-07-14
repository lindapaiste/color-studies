import React from "react";
import Plot from "react-plotly.js";
import {ColorPropKey} from "../packages/types";
import {sampleSize, partition} from "lodash";
import {GroupedHex, shuffledHexes} from "./buildModel";
import {pointsToVectors, PointTuple} from "../luminosity/LuminosityChart";
import {Data} from "plotly.js";
import {ChromaAdapter} from "../packages/chroma-adapter-profile";

export interface Props {
    count: number;
    x: ColorPropKey;
    y: ColorPropKey;
    group: string;
}

/**
 * utility function which provides a random sampling of hexes in the specified group
 * and outside of it, with the group name included
 */
export const getSplitSample = (group: string, count: number): [GroupedHex[], GroupedHex[]] => {
    const dataSet = shuffledHexes();
    const [inGroup, notInGroup] = splitInGroup(dataSet, group);
    return [sampleSize(inGroup, count), sampleSize(notInGroup, count)];
};

/**
 * returns two arrays: first is inGroup, second is notInGroup
 */
export const splitInGroup = <T extends {group: string}>(dataSet: T[], group: string): [T[], T[]] => {
  return partition( dataSet, o => o.group === group );
};

/**
 * plot features within a group against those from outside the group
 */

export const PlotFeatures = ({count, x, y, group}: Props) => {
    const [inGroup, notInGroup] = getSplitSample(group, count);

    const toTrace = (data: GroupedHex[], label: string): Data => {
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
            text: label,
        }
    };

    return (
        <Plot
            data={[
            toTrace(inGroup, group),
            toTrace(notInGroup, "not " + group)
        ]}
              layout={{width: 1400, height: 1000}}
        />
    )
};
