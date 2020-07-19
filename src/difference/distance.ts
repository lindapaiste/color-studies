import {I_ColorAdapter, I_ConvertAdapter} from "../packages/color-adapter";
import {DeltaECalculator, DeltaEFormula, FormulaSettings, KeyedLCHWeights, LAB} from "./types";
import DeltaE2000 from "./DeltaE2000";
import DeltaE1994 from "./DeltaE1994";
import {ColorSpaceName} from "../spacesChannels/types";
import {Formula} from "./Formula";
import {EuclideanCalculator} from "./EuclideanCalculator";
import {getDistance} from "../packages/chroma-js";



const toKeyedLAB = (tuple: [number, number, number]): LAB => {
    const [L, A, B] = tuple;
    return {L, A, B};
};

const toKeyedWeights = (tuple: number[] | undefined): KeyedLCHWeights | undefined => {
    if (tuple === undefined) return undefined;
    const [lightness, chroma, hue] = tuple;
    return {lightness, chroma, hue};
}

export const makeEuclideanDifference = <CS extends ColorSpaceName>(colorSpace: CS): DeltaEFormula<I_ColorAdapter, CS> =>
    (a, b, weights): number => {
        return (new EuclideanCalculator({model: colorSpace, weights: weights || [1,1,1,1]})).getDeltaE(a, b);
    };

export const deltaE76 = makeEuclideanDifference('lab');

export const rgbDist = makeEuclideanDifference('rgb');

//CMC 1984: https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_(1984)

export const makeDeltaE00 = (weights?: number[]): DeltaECalculator =>
    (a, b): number => {
        const converter = new DeltaE2000(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), toKeyedWeights(weights));
        return converter.getDeltaE();
    }

export const makeDeltaE94 = (weights?: number[]): DeltaECalculator =>
    (a, b): number => {
        const converter = new DeltaE1994(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), toKeyedWeights(weights));
        return converter.getDeltaE();
    };

/**
 * also export basic one-step formulas
 * weights can be partially filled or left off completely
 * each component of weights defaults to 1
 */

export const deltaE00: DeltaEFormula<I_ColorAdapter> = (a, b, weights): number => makeDeltaE00(weights)(a,b);

export const deltaE94: DeltaEFormula<I_ColorAdapter> = (a, b, weights): number => makeDeltaE94(weights)(a,b);
