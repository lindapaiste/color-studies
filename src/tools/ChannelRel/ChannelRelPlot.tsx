import {I_ColorAdapter, randomColors} from "../../packages/ColorAdapter";
import {Data} from "plotly.js";
import {intervals} from "../../lib";
import {Size} from "../../sharedComponents/form/types";
import React, {useMemo} from "react";
import Plot from "react-plotly.js";
import {Settings} from "./ChannelRelTool";

/**
 * each initial color becomes one line
 * the points on that line are made from transforming the x-axis property
 */
const getTrace = ({stepCount, xChannel, yChannel}: Omit<Settings, 'colorCount'>) =>
    (initial: I_ColorAdapter): Data => {
        //x values are evenly spaces increments
        const x = intervals(xChannel.min, xChannel.max, stepCount);
        //y values are calculated by setting the x
        const y = x.map(xVal => initial.set(xChannel, xVal).get(yChannel));
        return {
            x,
            y,
            mode: "lines",
            type: "scatter",
            line: {
                color: initial.hex()
            },
            text: initial.hex(),
            hoverinfo: "x+y+text"
        }
    }


export const ChannelRelPlot = ({xChannel, yChannel, colorCount, stepCount, width = 1400, height = 1000}: Settings & Partial<Size>) => {

    /**
     * don't want to recalculate data on resize
     */
    const data = useMemo(
        () => randomColors(colorCount).map(getTrace({xChannel, yChannel, stepCount})),
        [xChannel, yChannel, colorCount, stepCount]
    )

    return (
        <Plot
            data={data}
            layout={{
                showlegend: false,
                width,
                height,
                'xaxis.title': xChannel.title,
                'yaxis.title': yChannel.title
            }}
        />
    );
}
