import {mean, standardDeviation} from "simple-statistics";
import {ConfusionMatrix, I_ConfusionMatrix} from "./ConfusionMatrix";

/**
 * this model is not Bayesian since it looks at everything up front
 * compares the distributions of values which are known to be true (in) with those known to be false (out)
 *
 * nothing in this file depends on color at all, so the model can have other uses
 */

/**
 * a boundary model is defined by it's cutoff value (the boundary)
 * and whether true refers to values greater than or less than that cutoff
 *
 * the interface also requires a predict function, though this can be created based on cutoff and isGreater
 */
export interface BoundaryModel {
    cutoff: number;
    isGreater: boolean;
    predict: (value: number) => boolean;
}

/**
 * make this generic because the accuracy property does not always have to implement
 * the complete I_ConfusionMatrix interface
 * could be just a number, or just the raw TestResults
 * but in implementation, all current implementations DO return a ConfusionMatrix object
 */
export interface BoundaryModelAcc<T> extends BoundaryModel {
    accuracy: T;
}

/**
 * define a distribution as a mean and standard deviation
 */
export interface Distribution {
    mean: number;
    stdDev: number;
}

/**
 * use functions from simple-statistics package to get the distribution for an array or numbers
 */
export const getDistribution = (values: number[]): Distribution => ({
    mean: mean(values),
    stdDev: standardDeviation(values),
});


/**
 * find the boundary between two sets of numbers by comparing their standard deviations
 * the boundary is the number which is an equal number of standard deviations from each mean
 *
 * therefore the portion of the tail on the wrong side of the boundary
 * has the same area for both groups (but not the same width)
 */
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
     * can get an idea of accuracy based on the number of standard deviations
     * anything in the tail beyond that amount is on the wrong side
     * so more deviations is better ( means the distributions are widely separated )
     *
     * but currently I am looking at the actual data to see how many come out on the wrong side
     */

    const predict = predictOnBoundary(cutoff, isGreater);

    return {
        predict,
        cutoff,
        isGreater
    }
};

/**
 * can predict whether a value is true or false based on whether it is greater than the cutoff
 * and whether being greater means true or false
 */
export const predictOnBoundary = (boundary: number, isGreater: boolean) => (value: number): boolean => {
    return value > boundary ? isGreater : !isGreater;
};


/**
 * apply the passed in prediction function to two sets of data with known outcomes
 * to generate a confusion matrix
 */
export const testPredictions = (predict: (value: number) => boolean, valuesIn: number[], valuesOut: number[]): I_ConfusionMatrix => {
    let a = new ConfusionMatrix();

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

    return a;
};


/**
 * combines the methods to create the model with those to calculate its accuracy
 */
export const boundaryModel = (valuesIn: number[], valuesOut: number[]): BoundaryModelAcc<I_ConfusionMatrix> => {
    const model = findBoundary(valuesIn, valuesOut);
    const accuracy = testPredictions(model.predict, valuesIn, valuesOut);

    return {
        ...model,
        accuracy
    }
};
