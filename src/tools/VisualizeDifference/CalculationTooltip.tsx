import React from "react";
import {DebugDeltaE} from "../../difference/Calculation";
import {proper, round} from "../../lib";

/**
 * for each channel, show the channel name, value, and how much it differs from the target
 *
 * originally had this in the Calculation class, but I prefer the classes to not use React
 */
export const CalculationTooltip = ({channelDiffs}: DebugDeltaE) => (
    <>
        {channelDiffs.map(({value, diff, channel}, i) => (
            <div key={i}>{proper(channel)}: {round(value)} ({diff > 0 ? "+" : "-"}{round(diff)})</div>
        ))}
    </>
)
