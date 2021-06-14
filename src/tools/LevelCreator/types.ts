import { Levers } from "logic/boxSets/types";
import { FormulaCalculator } from "logic/difference/types";
import { IModelNoise } from "logic/noise/types";
import { ChannelAdapter } from "logic";

export interface Identifier {
  boxIndex: number;
  ballIndex: number;
}

/**
 * is basically BallCreateSettings but with noise and distance as objects rather than formulas
 */
export interface AdvancedSettings extends Levers {
  formula: FormulaCalculator;
  noise: IModelNoise;
  count: number;
}

/**
 * rather than updating the start and end based on the min/max of the channel,
 * define this interface such that start and end are RELATIVE numbers between 0 and 1
 */
export interface ShiftSettings {
  channel: ChannelAdapter;
  start: number;
  end: number;
}

export interface BallDisplaySettings {
  shuffle: boolean;
  darkBackground: boolean;
  showTools: boolean;
  showRejected: boolean;
}
