import { FormulaCalculator } from "./types";
import { IColorAdapter } from "../color/types";
import { eitherToModel } from "../spacesChannels/models";
import { ChannelAdapter } from "../spacesChannels/ChannelAdapter";

/**
 * includes additional information used for debugging and visualizing via tooltips, etc.
 * the result of the calculation is all that really matters
 */

export interface ChannelDiff {
  channel: ChannelAdapter;
  value: number;
  diff: number;
}

export interface DebugDeltaE {
  deltaE: number;
  channelDiffs: ChannelDiff[];
}

export class Calculation implements DebugDeltaE {
  private formula: FormulaCalculator;

  private target: IColorAdapter;

  private color: IColorAdapter;

  public readonly deltaE: number;

  constructor(formula: FormulaCalculator, a: IColorAdapter, b: IColorAdapter) {
    this.formula = formula;
    this.color = a;
    this.target = b;
    this.deltaE = formula.getDeltaE(a, b);
  }

  get channelDiffs(): ChannelDiff[] {
    const model = eitherToModel(this.formula.model);
    const first = this.target.to(model);
    const second = this.color.to(model);
    const { channels } = model;

    return second.map((value, i) => ({
      channel: channels[i],
      value,
      diff: value - first[i], // not abs
    }));
  }
}
