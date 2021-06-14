export type Features = number[];

export type Binary = 0 | 1;

export interface IPerceptron<T = number> {
  /**
   * expect that weights DOES NOT INCLUDE the bias
   */
  weights: number[];
  /**
   * the weight assigned to the bias
   */
  bias: number;
  /**
   * require train to return a boolean
   * true means no adjustments needed
   * false means changes were made
   */
  train(data: Features, expected: T): boolean;
  predict(data: Features): T;
}

export interface DataPoint {
  features: number[];
  expected: Binary;
}

/**
 * an activation function is one which maps a number to another number
 */
export type ActivationFunc = (n: number) => number;

/**
 * stage defines the state of the perceptron at specific moment in the training cycle
 * netSquaredAdjustment shows the change since the previous stage
 */
export interface Stage {
  weights: number[];
  bias: number;
  errors: number;
  netSquaredAdjustment: number;
}
