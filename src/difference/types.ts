import { ColorSpaceName, ColorTuple } from "../spacesChannels/types";
import { I_ColorAdapter } from "../color/types";

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

export interface _DeltaEFormula<T, CS extends ColorSpaceName = "lch"> {
  (a: T, b: T, weights?: ColorTuple<CS>): number;
}

export type BasicFormula = (a: I_ColorAdapter, b: I_ColorAdapter) => number;

/**
 * assume that the calculator takes weights into account internally
 */
export interface DeltaEFormula {
  (a: I_ColorAdapter, b: I_ColorAdapter): number;
}

/**
 * an object which can be constructed from FormulaSettings
 * and has a getDeltaE method for two colors
 */
export interface I_DeltaECalculator {
  getDeltaE(a: I_ColorAdapter, b: I_ColorAdapter): number;
}

export interface I_CalculatorConstructor {
  new (settings: FormulaSettings): I_DeltaECalculator;
}

export type Algo = "CIE2000" | "CIE1994" | "Euclidean";

export interface FormulaSettings {
  algo: Algo;
  model: ColorSpaceName;
  weights: number[]; // having a tuple of variable length is such a headache...
}

export type I_FormulaClass = I_DeltaECalculator & FormulaSettings;
