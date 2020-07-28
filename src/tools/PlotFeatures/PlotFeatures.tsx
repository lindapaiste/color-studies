import React from "react";
import Plot from "react-plotly.js";
import {getSplitSample, GroupedHex} from "../../classifier/shuffledData";
import {Data} from "plotly.js";
import useDimensions from "../../lib/useDimensions";
import {ifDefined} from "../../lib";
import {ChannelAdapter} from "../../spacesChannels/ChannelAdapter";
import {hexToColor} from "../../color";

/**
 * creates a scatter plot based on two color properties (x and y)
 *
 * the plot has two data sets -- comparing those in the specified group to those outside of it
 *
 * the PlotFeatures component creates the data itself from a random sampling
 * based on group and count props
 */

export interface Props {
    colorCount: number;
    xChannel: ChannelAdapter;
    yChannel: ChannelAdapter;
    group: string;
}

export const PlotFeatures = ({colorCount, xChannel, yChannel, group}: Props) => {
    const [inGroup, notInGroup] = getSplitSample(group, colorCount);

    const toTrace = (data: GroupedHex[], label: string): Data => {
        const points: PointTuple[] = data.map(({hex}) => {
            const obj = hexToColor(hex);
            return [obj.get(xChannel), obj.get(yChannel)];
        });
        return {
            ...pointsToVectors(points), //x and y
            xaxis: xChannel.title,
            yaxis: yChannel.title,
            mode: "markers",
            type: "scatter",
            name: label,
            labels: data.map(({hex}) => hex),
            //hoverinfo: "text",
        }
    };

    const [ref, dimensions] = useDimensions();
    //height is harder to measure, so default to an aspect ratio
    const width = ifDefined(dimensions.width, 500);

    return (
        <div ref={ref} style={{width: "100%"}}>
        <Plot
            data={[
                toTrace(inGroup, group),
                toTrace(notInGroup, "not " + group)
            ]}
            layout={{width, height: .75 * width}}
        />
        </div>
    )
};

export type PointTuple = [number, number];

/**
 * convert an array of [x,y] vectors to an array of x values and another of y values
 */
export const pointsToVectors = (
    points: PointTuple[]
): { x: number[]; y: number[] } => {
    return {
        x: points.map(([x]) => x),
        y: points.map(([_, y]) => y)
    };
};
