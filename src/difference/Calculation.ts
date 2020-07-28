import {getSpaceChannelNames} from "../spacesChannels/colorSpaces";
import {ChannelName} from "../spacesChannels/types";
import {I_FormulaClass} from "./types";
import {I_ColorAdapter} from "../color/types";

/**
 * includes additional information used for debugging and visualizing via tooltips, etc.
 * the result of the calculation is all that really matters
 */

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
    private formula: I_FormulaClass;
    private target: I_ColorAdapter;
    private color: I_ColorAdapter;
    public readonly deltaE: number;

    constructor(formula: I_FormulaClass, a: I_ColorAdapter, b: I_ColorAdapter) {
        this.formula = formula;
        this.color = a;
        this.target = b;
        this.deltaE = formula.getDeltaE(a, b);
    }

    get channelDiffs(): ChannelDiff[] {
        const first = this.target.to(this.formula.model);
        const second = this.color.to(this.formula.model);
        const names = getSpaceChannelNames(this.formula.model);

        return second.map((value, i) => ({
            channel: names[i],
            value,
            diff: value - first[i], //not abs
        }))
    }

}
