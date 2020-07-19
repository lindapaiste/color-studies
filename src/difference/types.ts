import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {I_ColorAdapter} from "../packages/color-adapter";

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

export interface DeltaEFormula<T, CS extends ColorSpaceName = "lch"> {
    (a: T, b: T, weights?: ColorTuple<CS>): number;
}

export type BasicFormula = (a: I_ColorAdapter, b: I_ColorAdapter) => number;

/**
 * assume that the calculator takes weights into account internally
 */
export interface DeltaECalculator {
    (a: I_ColorAdapter, b: I_ColorAdapter): number;
}

export type Algo = "CIE2000" | "CIE1994" | "Euclidean";

export interface FormulaSettings {
    algo: Algo;
    model: ColorSpaceName;
    weights: number[];  //having a tuple of variable length is such a headache...
}
