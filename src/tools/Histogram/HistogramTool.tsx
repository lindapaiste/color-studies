import React from "react";
import GROUPINGS from "../../grouping/group-data";
import {HistogramControls} from "./HistogramControls";
import {Tool} from "../../sharedComponents/tool/Tool";
import {GroupChannelHistogram} from "./GroupChannelHistogram";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => (
    <Tool
        initialSettings={{
            breakpoints: 6,
            group: GROUPINGS[0].name,
            channel: ['hsl', 2],
        }}
        RenderControls={HistogramControls}
        RenderTool={GroupChannelHistogram}
        toolPadding={"10%"}
    />
);

export default HistogramTool;
