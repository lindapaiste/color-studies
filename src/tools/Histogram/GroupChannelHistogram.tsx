import React from "react";
import {ToolSettings} from "./types";
import {Size} from "../../sharedComponents/form/types";
import {createBuckets} from "./createBuckets";
import {RenderAutoSizeHistogram} from "./AutosizeHistogram";
import {hexToColor} from "../../color";
import {getGroupHexes} from "../../grouping";

/**
 * combines the computation and the render
 */
export const GroupChannelHistogram = (props: ToolSettings & Partial<Size> & {padPercent?: number}) => {
    const {channel, breakpoints, group} = props;
    const buckets = createBuckets({
        hexToValue: hex => hexToColor(hex).get(channel),
        hexes: getGroupHexes(group),
        breakpoints
    });
    return (
        <RenderAutoSizeHistogram {...props} buckets={buckets}/>
    )
}

export default GroupChannelHistogram;
