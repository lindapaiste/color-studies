import {FormulaSettings} from "./types";
import {I_ColorAdapter} from "../packages/color-adapter";
import React, {ReactNode} from "react";
import {getSpaceChannels} from "../spacesChannels/colorSpaces";
import {round, startCase} from "lodash";
import {I_Formula} from "./Formula";
import {ChannelName, ColorSpaceName} from "../spacesChannels/types";

/**
 * includes additional information used for debugging and visualizing via tooltips, etc.
 * the result of the calculation is all that really matters
 */

export interface I_Calculation {
    result: number;
    tooltip: ReactNode;
    raw: any;
}

export interface ChannelDiff {
    channel: ChannelName;
    value: number;
    diff: number;
}

export interface DebugDeltaE {
    deltaE: number;
    channelDiffs: ChannelDiff[];
}

export class Calculation implements DebugDeltaE {
    private formula: I_Formula;
    private target: I_ColorAdapter;
    private color: I_ColorAdapter;
    public readonly deltaE: number;

    constructor(formula: I_Formula, a: I_ColorAdapter, b: I_ColorAdapter) {
        this.formula = formula;
        this.color = a;
        this.target = b;
        this.deltaE = formula.deltaE(a, b);
    }

    get channelDiffs(): ChannelDiff[] {
        const first = this.target.to(this.formula.model);
        const second = this.color.to(this.formula.model);
        const names = getSpaceChannels(this.formula.model);

        return second.map((value, i) => ({
            channel: names[i],
            value,
            diff: value - first[i], //not abs
        }))
    }

    get tooltip(): ReactNode {
        return (
            <>
                {this.channelDiffs.map(({value, diff, channel}, i) => (
                    <div key={i}>{startCase(channel)}: {round(value)} ({diff > 0 ? "+" : "-"}{round(diff)})</div>
                ))}
            </>
        )
    }

}
