import {getSplitHexes} from "./PlotFeatures";
import {mean, standardDeviation} from "simple-statistics";

export interface BoundaryModel {
    cutoff: number;
    isGreater: boolean;
    accuracy: number;
    predict: (value: number) => boolean;
}

export interface Distribution {
    mean: number;
    stdDev: number;
}

export const getDistribution = (values: number[]): Distribution => ({
    mean: mean(values),
    stdDev: standardDeviation(values),
});
/**
 * this one is not Bayesian, it looks at everything up front
 */
export const buildBoundaryModel = (group: string, valueFromHex: (hex: string) => number, sampleSize: number = 100): BoundaryModel => {
    const [inGroup, notInGroup] = getSplitHexes(group, sampleSize);

    const valuesIn = inGroup.map(({hex}) => valueFromHex(hex));
    const valuesOut = notInGroup.map(({hex}) => valueFromHex(hex));

    const distIn = getDistribution(valuesIn);
    const distOut = getDistribution(valuesOut);

    /**
     * find the number of standard deviations where the two distributions intercept
     * ie. greater.mean - x * greater.stdDev = lesser.mean + x * lesser.stdDev
     */
    const isGreater = distIn.mean > distOut.mean;
    const greater = isGreater ? distIn : distOut;
    const lesser = isGreater ? distOut : distIn;
    const deviations = (greater.mean - lesser.mean) / (greater.stdDev + lesser.stdDev);

    const boundary = greater.mean - deviations * greater.stdDev;
    const check = lesser.mean + deviations * lesser.stdDev;

    console.log({boundary, check});

    /**
     * can compute accuracy based on the number of standard deviations
     * anything in the tail beyond that amount is on the wrong side
     * so more deviations is better ( means the distributions are widely separated )
     *
     * can also look at the actual data to see how many come out on the wrong side
     */

    const predict = predictOnBoundary(boundary, isGreater);

    let correct = 0;
    valuesIn.forEach(value => {
        if (predict(value)) {
            correct++;
        }
    });
    valuesOut.forEach(value => {
        if (!predict(value)) {
            correct++;
        }
    });
    const accuracy = correct / (valuesIn.length + valuesOut.length);

    return {
        cutoff: boundary,
        isGreater,
        predict,
        accuracy,
    }
};
export const predictOnBoundary = (boundary: number, isGreater: boolean) => (value: number): boolean => {
    return value > boundary ? isGreater : !isGreater;
};
