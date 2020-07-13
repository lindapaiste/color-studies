import {I_ConvertAdapter} from "../packages/color-adapter";
import {DeltaEFormula, LAB} from "./types";
import DeltaE2000 from "./DeltaE2000";
import DeltaE1994 from "./DeltaE1994";
import {euclideanDistance} from "./euclideanDistance";
import {ColorSpaceName} from "../spacesChannels/types";

/**
 * weights can be partially filled or left off completely
 * each component of weights defaults to 1
 */

export const deltaE00: DeltaEFormula<I_ConvertAdapter> = (a, b, weights): number => {
    const converter = new DeltaE2000(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), weights);
    return converter.getDeltaE();
};


export const deltaE94: DeltaEFormula<I_ConvertAdapter> = (a, b, weights): number => {
    const converter = new DeltaE1994(toKeyedLAB(a.to('lab')), toKeyedLAB(b.to('lab')), weights);
    return converter.getDeltaE();
};

const toKeyedLAB = (tuple: [number, number, number]): LAB => {
    const [L, A, B] = tuple;
    return {L, A, B};
};


export const makeEuclideanDifference = (colorSpace: ColorSpaceName): DeltaEFormula<I_ConvertAdapter> =>
    (a, b): number => {
        return euclideanDistance(a.to(colorSpace), b.to(colorSpace));
    };

export const deltaE76 = makeEuclideanDifference('lab');

export const rgbDist = makeEuclideanDifference('rgb');

//CMC 1984: https://en.wikipedia.org/wiki/Color_difference#CMC_l:c_(1984)

