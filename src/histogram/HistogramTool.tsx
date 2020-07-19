import React from "react";
import {VisualHistogram} from "./VisualHistogram";
import {ColorAdapter} from "../packages/color-adapter";
import {usePartialState} from "../util-hooks";
import {ToolSettings} from "./types";
import GROUPINGS, {getGroupHexes} from "../grouping/group-data";
import {HistogramControls} from "./HistogramControls";

/**
 * tool which allows me to interactively create property histograms for any of the stored color groupings
 */
export const HistogramTool = () => {
    const [state, update] = usePartialState<ToolSettings>({
        breakpoints: 6,
        group: GROUPINGS[0].name,
        channel: ['hsl', 2],
    })
    return (
        <div>
            <HistogramControls
                state={state}
                update={update}
            />
            <VisualHistogram
                hexToValue={hex => (new ColorAdapter(hex)).get(state.channel)}
                hexes={getGroupHexes(state.group)}
                breakpoints={state.breakpoints}
                colorSize={50}
            />
        </div>
    );
};
