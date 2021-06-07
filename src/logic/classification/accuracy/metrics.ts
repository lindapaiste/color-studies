/**
 * a confusion matrix contains the predictions of a true/false classifier
 * based on a set of data where the actual true/false outcome is known
 *
 * the only required data is a 2x2 matrix of [actual true, actual false] x [predicted true, predicted false]
 * this is the TestResults interface
 *
 * many probabilities and scores can be computed from the TestResults interface
 * these are grouped into interfaces:
 * Sums (simple addition of TestResults)
 * Conditionals (2x2x2 matrix of conditional probabilities of [actual, predicted] x [true, false]  x (conditional on opposite of [actual, predicted]) [true, false])
 * Scores (various numeric measurements which determine how good the classifier is)
 */

export interface TestResults {
  falsePositives: number;
  truePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export interface Sums {
  actualPositive: number;
  actualNegative: number;
  predictedPositive: number;
  predictedNegative: number;
  total: number;
}

export interface Conditionals {
  truePositiveRate: number;
  falsePositiveRate: number;
  trueNegativeRate: number;
  falseNegativeRate: number;
  positivePredictiveValue: number;
  negativePredictiveValue: number;
  falseDiscoveryRate: number;
  falseOmissionRate: number;
}

export const conditionalsKeys: Array<keyof Conditionals> = [
  "truePositiveRate",
  "falsePositiveRate",
  "trueNegativeRate",
  "falseNegativeRate",
  "positivePredictiveValue",
  "negativePredictiveValue",
  "falseDiscoveryRate",
  "falseOmissionRate",
];

export interface Scores {
  accuracy: number;
  balancedAccuracy: number;
  prevalenceThreshold: number;
  threatScore: number;
  f1Score: number;
  matthewsCorrelationCoefficient: number;
  fowlkesMallowsIndex: number;
  informedness: number;
  markedness: number;
}

export const scoresKeys: Array<keyof Scores> = [
  "accuracy",
  "balancedAccuracy",
  "prevalenceThreshold",
  "threatScore",
  "f1Score",
  "matthewsCorrelationCoefficient",
  "fowlkesMallowsIndex",
  "informedness",
  "markedness",
];
