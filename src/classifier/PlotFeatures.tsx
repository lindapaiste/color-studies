import React from "react";
import Plot from "react-plotly.js";
import {ColorPropKey} from "../packages/types";
import {GroupedHex} from "./shuffledData";
import {pointsToVectors, PointTuple} from "../luminosity/LuminosityChart";
import {Data} from "plotly.js";
import {ChromaAdapter} from "../packages/chroma-adapter-profile";
import {getSplitSample} from "./shuffledData";
import {ChannelAccessor} from "../spacesChannels/types";
import {accessorTitle} from "../spacesChannels/accessorConversion";
import {ColorAdapter} from "../packages/color-adapter";

/**
 * creates a scatter plot based on two color properties (x and y)
 *
 * the plot has two data sets -- comparing those in the specified group to those outside of it
 *
 * the PlotFeatures component creates the data itself from a random sampling
 * based on group and count props
 */

export interface Props {
    count: number;
    x: ChannelAccessor;
    y: ChannelAccessor;
    group: string;
}

export const PlotFeatures = ({count, x, y, group}: Props) => {
    const [inGroup, notInGroup] = getSplitSample(group, count);

    const toTrace = (data: GroupedHex[], label: string): Data => {
        const points: PointTuple[] = data.map( ({hex}) => {
            const obj = new ColorAdapter(hex);
            return [obj.get(x), obj.get(y)];
        });
        return {
            ...pointsToVectors(points), //x and y
            xaxis: accessorTitle(x),
            yaxis: accessorTitle(y),
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
