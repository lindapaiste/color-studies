import {mean, mode, standardDeviation} from "simple-statistics";

/**
 * this one is not Bayesian, it looks at everything up front
 * compares the distributions of in vs out
 * nothing in this file depends on color at all, so can have other uses
 */

export interface BoundaryModel {
    cutoff: number;
    isGreater: boolean;
    predict: (value: number) => boolean;
}

export interface BoundaryModelAcc extends BoundaryModel {
    accuracy: TestAccuracy;
}

export interface TestAccuracy {
    falsePositives: number;
    truePositives: number;
    falseNegatives: number;
    trueNegatives: number;
    accuracy: number;
}

export interface Distribution {
    mean: number;
    stdDev: number;
}

export const getDistribution = (values: number[]): Distribution => ({
    mean: mean(values),
    stdDev: standardDeviation(values),
});

export const boundaryModel = (valuesIn: number[], valuesOut: number[]): BoundaryModelAcc => {
    const model = findBoundary(valuesIn, valuesOut);
    const accuracy = testPredictions(model.predict, valuesIn, valuesOut);

    return {
        ...model,
        accuracy
    }
};

export const findBoundary = (valuesIn: number[], valuesOut: number[]): BoundaryModel => {

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

    const cutoff = greater.mean - deviations * greater.stdDev;
    const check = lesser.mean + deviations * lesser.stdDev;

    console.log({cutoff, check});

    /**
     * can compute accuracy based on the number of standard deviations
     * anything in the tail beyond that amount is on the wrong side
     * so more deviations is better ( means the distributions are widely separated )
     *
     * can also look at the actual data to see how many come out on the wrong side
     */

    const predict = predictOnBoundary(cutoff, isGreater);

    return {
        predict,
        cutoff,
        isGreater
    }
};

export const testPredictions = (predict: (value: number) => boolean, valuesIn: number[], valuesOut: number[]): TestAccuracy => {
    let a ={
        falsePositives: 0,
        truePositives: 0,
        falseNegatives: 0,
        trueNegatives: 0,
        accuracy: 0,
    };

    valuesIn.forEach(value => {
        if (predict(value)) {
            a.truePositives++;
        } else {
            a.falseNegatives++;
        }
    });
    valuesOut.forEach(value => {
        if (predict(value)) {
            a.falsePositives++;
        } else {
            a.trueNegatives++;
        }
    });

    a.accuracy = (a.truePositives + a.trueNegatives) / (valuesIn.length + valuesOut.length);

    return a;
};


export const predictOnBoundary = (boundary: number, isGreater: boolean) => (value: number): boolean => {
    return value > boundary ? isGreater : !isGreater;
};
