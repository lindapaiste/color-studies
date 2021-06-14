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

export const conditionalsKeys = [
  "truePositiveRate",
  "falsePositiveRate",
  "trueNegativeRate",
  "falseNegativeRate",
  "positivePredictiveValue",
  "negativePredictiveValue",
  "falseDiscoveryRate",
  "falseOmissionRate",
] as const;

export type Conditionals = Record<typeof conditionalsKeys[number], number>;

export const scoresKeys = [
  "accuracy",
  "balancedAccuracy",
  "prevalenceThreshold",
  "threatScore",
  "f1Score",
  "matthewsCorrelationCoefficient",
  "fowlkesMallowsIndex",
  "informedness",
  "markedness",
] as const;

export type Scores = Record<typeof scoresKeys[number], number>;
