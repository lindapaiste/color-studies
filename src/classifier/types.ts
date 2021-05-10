import {I_ColorAdapter} from "../color/types";
import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import {PerceptronModel} from "simple-statistics";

/**
 * define a Binary Classifier as an object with a predict() method
 * that takes an input of the specified type T and returns a true or false prediction
 */
export interface I_BinaryClassifier<T> {
    predict( input: T ): boolean;
}

/**
 * a testable classifier has a prediction method that returns the prediction
 * but also returns any other data, such as features, channelValue, score, etc.
 */
export interface I_Testable<T, R extends I_Predicted> {
    predictResult(input: T, debug?: boolean): R;
}

export interface GroupColorClassifier<R extends I_Predicted> extends I_Testable<I_ColorAdapter, R> {
    group: string;
    predictResult(input: I_ColorAdapter, debug?: boolean): R;
}

/**
 * a test requires a value and an expected result
 */
export interface I_TestInput<T> {
    value: T;
    expected: boolean;
}

export interface I_Predicted {
    predicted: boolean;
}

export interface I_Expected {
    expected: boolean;
}

/**
 * at the minimum, a test returns the value and expected along with the prediction
 */
export interface I_TestOutput<T> {
    value: T;
    expected: boolean;
    predicted: boolean;
}

/**
 * a shared interface can be used both for the counts
 * and for result objects which are separated into groups
 */
export interface I_ResultGroups<T> {
    falsePositives: T;
    truePositives: T;
    falseNegatives: T;
    trueNegatives: T;
}

export type ResultType = keyof I_ResultGroups<any>;

/**
 * interface for retrieving test results which are broken up into the four output categories
 */
export interface I_GetGroupedResults<R extends I_TestOutput<any>> {
    getResults(type: ResultType | undefined): R[];
}


/**
 * a boundary model is defined by it's cutoff value (the boundary)
 * and whether true refers to values greater than or less than that cutoff
 */
export interface I_Boundary {
    cutoff: number;
    isGreater: boolean;
}

/**
 * define a distribution as a mean and standard deviation
 */
export interface Distribution {
    mean: number;
    stdDev: number;
}

/**
 * color with known group
 */
export interface GroupedColor {
    group: string,
    color: I_ColorAdapter,
}

/**
 * hex with known group
 */
export interface GroupedHex {
    hex: string,
    group: string
}

/**
 * need the model itself, but also what group it's for and what properties are used
 */
export interface I_GroupPerceptron extends GroupColorClassifier<PerceptronResult> {
    group: string;
    channels: ChannelAdapter[];
    weights: number[];
    bias: number;
}

/**
 * props used to create the perceptron model
 */
export interface PerceptronProps {
    group: string;
    channels: ChannelAdapter[];
    iterations?: number;
    sampleSize?: number;
}

/**
 * result returned from the perceptron includes the array of features and the raw score
 */
export interface PerceptronResult {
    predicted: boolean;
    features: number[];
    color: I_ColorAdapter;
    score: number;
}

/**
 * see if a model fails to divide the inputs because all fall into the same group
 */
export interface I_ImpossibleCheck {
    maxScore: number;
    minScore: number;
    isImpossible: boolean;
}
