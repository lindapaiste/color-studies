import {I_ConvertAdapter} from "../packages/color-adapter";
import {BasicFormula, DeltaEFormula, FormulaSettings, KeyedLCHWeights, LAB} from "./types";
import DeltaE2000 from "./DeltaE2000";
import DeltaE1994 from "./DeltaE1994";
import {euclideanDistance, weightedEuclideanDistance} from "./euclideanDistance";
import {ColorSpaceName} from "../spacesChannels/types";

/**
 * weights can be partially filled or left off completely
 * each component of weights defaults to 1
 */

export const deltaE00: DeltaEFormula<I_ConvertAdapter> = (a, b, weights): number => {
    const converter = new DeltaE2000(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), toKeyedWeights(weights));
    return converter.getDeltaE();
};


export const deltaE94: DeltaEFormula<I_ConvertAdapter> = (a, b, weights): number => {
    const converter = new DeltaE1994(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), toKeyedWeights( weights));
    return converter.getDeltaE();
};

const toKeyedLAB = (tuple: [number, number, number]): LAB => {
    const [L, A, B] = tuple;
    return {L, A, B};
};

const toKeyedWeights = (tuple: [number, number, number] | undefined): KeyedLCHWeights | undefined => {
    if ( tuple === undefined ) return undefined;
    const [lightness, chroma, hue] = tuple;
    return {lightness, chroma, hue};
}

export const makeEuclideanDifference = <CS extends ColorSpaceName>(colorSpace: CS): DeltaEFormula<I_ConvertAdapter, CS> =>
    (a, b, weights): number => {
        return weightedEuclideanDistance(a.to(colorSpace), b.to(colorSpace), weights);
    };

export const deltaE76 = makeEuclideanDifference('lab');

export const rgbDist = makeEuclideanDifference('rgb');

//CMC 1984: https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_(1984)

export const toFormula = ( settings: FormulaSettings ): BasicFormula => {
    switch ( settings.algo ) {
        case "CIE1994":
            // @ts-ignore
            return (a, b) => deltaE94(a, b, settings.weights)
        case "CIE2000":
            // @ts-ignore
            return (a, b) => deltaE00(a, b, settings.weights)
        case "Euclidean":
            return makeEuclideanDifference(settings.model || 'lab');
    }
}
