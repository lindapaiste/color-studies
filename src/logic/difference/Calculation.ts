import { FormulaCalculator } from "./types";
import { eitherToModel } from "../colorspaces/models";
import { ChannelAdapter } from "../colorspaces/ChannelAdapter";
import { ColorAdapter } from "../convert";

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

  private target: ColorAdapter;

  private color: ColorAdapter;

  public readonly deltaE: number;

  constructor(formula: FormulaCalculator, a: ColorAdapter, b: ColorAdapter) {
    this.formula = formula;
    this.color = a;
    this.target = b;
    this.deltaE = formula.getDeltaE(a, b);
  }

  get channelDiffs(): ChannelDiff[] {
    const model = eitherToModel(this.formula.model);
    const first = this.target.toCs(model).deNormalize();
    const second = this.color.toCs(model).deNormalize();
    const { channels } = model;

    return second.values.map((value, i) => ({
      channel: channels[i],
      value,
      diff: value - first[i], // not abs
    }));
  }
}
