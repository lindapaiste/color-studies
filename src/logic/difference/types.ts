import { ColorSpaceName, ColorTuple } from "../spacesChannels/types";
import { IColorAdapter } from "../color/types";

export interface LAB {
  L: number;
  A: number;
  B: number;
}

export interface KeyedLCHWeights {
  lightness?: number;
  chroma?: number;
  hue?: number;
}

export interface WeightedDeltaEFormula<T, CS extends ColorSpaceName = "lch"> {
  (a: T, b: T, weights?: ColorTuple<CS>): number;
}

/**
 * assume that the calculator takes weights into account internally
 */
export interface DeltaEFormula {
  (a: IColorAdapter, b: IColorAdapter): number;
}

/**
 * an object which can be constructed from FormulaSettings
 * and has a getDeltaE method for two colors
 */
export interface DeltaECalculator {
  getDeltaE(a: IColorAdapter, b: IColorAdapter): number;
}

export type Algo = "CIE2000" | "CIE1994" | "Euclidean";

export interface FormulaSettings {
  algo: Algo;
  model: ColorSpaceName;
  weights: number[]; // having a tuple of variable length is such a headache...
}

export type FormulaCalculator = DeltaECalculator & FormulaSettings;
