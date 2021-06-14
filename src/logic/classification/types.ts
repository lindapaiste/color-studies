import { ChannelAdapter } from "../colorspaces";
import { TestResults } from "./accuracy/metrics";
import { ColorAdapter } from "../convert";

/**
 * define a Binary Classifier as an object with a predict() method
 * that takes an input of the specified type T and returns a true or false prediction
 */
export interface BinaryClassifier<T> {
  predict(input: T): boolean;
}

/**
 * a testable classifier has a prediction method that returns the prediction
 * but also returns any other data, such as features, channelValue, score, etc.
 */
export interface Testable<T, R extends HasPredicted> {
  predictResult(input: T, debug?: boolean): R;
}

export interface GroupColorClassifier<R extends HasPredicted>
  extends Testable<ColorAdapter, R> {
  group: string;
  predictResult(input: ColorAdapter, debug?: boolean): R;
}

/**
 * a test requires a value and an expected result
 */
export interface TestInput<T> {
  value: T;
  expected: boolean;
}

export interface HasPredicted {
  predicted: boolean;
}

export interface HasExpected {
  expected: boolean;
}

/**
 * at the minimum, a test returns the value and expected along with the prediction
 */
export interface TestOutput<T> {
  value: T;
  expected: boolean;
  predicted: boolean;
}

export type ResultType = keyof TestResults;

/**
 * a shared interface can be used both for the counts
 * and for result objects which are separated into groups
 */
export type ResultGroups<T> = Record<ResultType, T>;

/**
 * interface for retrieving test results which are broken up into the four output categories
 */
export interface CanGetGroupedResults<R extends TestOutput<any>> {
  getResults(type: ResultType | undefined): R[];
}

/**
 * a boundary model is defined by its cutoff value (the boundary)
 * and whether true refers to values greater than or less than that cutoff
 */
export interface Boundary {
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
  group: string;
  color: ColorAdapter;
}

/**
 * hex with known group
 */
export interface GroupedHex {
  hex: string;
  group: string;
}

/**
 * need the model itself, but also what group it's for and what properties are used
 */
export interface IGroupPerceptron
  extends GroupColorClassifier<PerceptronResult> {
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
  color: ColorAdapter;
  score: number;
}

/**
 * see if a model fails to divide the inputs because all fall into the same group
 */
export interface ImpossibleCheck {
  maxScore: number;
  minScore: number;
  isImpossible: boolean;
}
