import { ifDefined, makeArray } from "lib";
import { ActivationFunc, Binary, Features, IPerceptron } from "./types";
/**
 * based on: https:// github.com/Elyx0/rosenblattperceptronjs/blob/master/src/Perceptron.js
 *
 * this version has been more heavily modified by me
 * for example, separated training and trainingSet into a separate class
 * separated the bias from the other weights
 *
 * can pass in the activation function in the constructor for more extensibility
 * but in order to use "Binary" typehint, need to make ActivationFunc, PerceptronProps, class, and IPerceptron all generic
 */

/**
 * note: uses 1/0 for outcomes rather than true/false
 *
 * bias is merely the last weight.  it is not updated separately
 */

/**
 * bias is a constant
 * can be included in the sum along with the other features if multiplying it by 1
 * it does not seem like the base is ever anything other than 1
 *
 *
 * can calculate and store together, but for the purpose of the interface and plotting, want to retrieve separately?
 * it does not matter, but I have to pick one and be consistent with it
 */

export interface PerceptronProps {
  /**
   * Set the learning rate for the model.
   */
  learningRate?: number;
  /**
   * Can create with initial weights.
   */
  weights?: number[];
  /**
   * Can pass an initial bias weight.
   */
  bias?: number;
  /**
   * Can pass in a custom activation function, or default to using heaviside.
   */
  activate?: ActivationFunc;
  /**
   * Whether to log everything to the console
   */
  debug?: boolean;
}

/**
 * default activation function for perceptron
 * returns 1 for all positive numbers and 0 for negatives
 * by convention, points that are exactly on the decision boundary are considered negative
 */
export const heaviside = (n: number): Binary => (n > 0 ? 1 : 0);

export class Perceptron implements IPerceptron {
  public readonly learningRate: number;

  public weights: number[];

  public bias: number;

  private readonly activate: ActivationFunc;

  private didInit: boolean;

  private readonly debug: boolean;

  /**
   * if no weights are passed in the constructor,
   * cannot set to random yet because won't know the length of features
   */
  constructor(props: PerceptronProps = {}) {
    this.learningRate = props.learningRate || 0.5;
    this.weights = props.weights || [];
    this.bias = props.bias || 0;
    this.activate = props.activate || heaviside;
    this.debug = props.debug || false;
    this.didInit = false;
  }

  /**
   * some implementations return -1/1 while others return 0/1
   * initializing to 0 makes more sense with -1/1 while random makes more sense with 0/1
   * but the initial value is of little importance either way
   */
  private init(inputs: Features) {
    // if there are some weights passed in but it's too short, preserve those while adding extra
    this.weights = makeArray(inputs.length, (i) =>
      ifDefined(this.weights[i], Math.random())
    );
    if (this.debug) console.log("initialized with weights:", this.weights);
    this.didInit = true;
  }

  /**
   * returns true if no changes needed to be made,
   * or false if the weights were adjusted
   */
  public train(inputs: Features, expected: Binary): boolean {
    if (!this.didInit) this.init(inputs); // initialize on first training

    const actual = this.predict(inputs);
    if (actual === expected) return true; // Correct weights return and don't touch anything.

    // Otherwise update each weight by adding the error * learningRate relative to the input
    if (this.debug) console.log("changed weights from", this.weights);
    this.weights = this.weights.map(
      (w, i) => w + this.delta(actual, expected, inputs[i])
    );
    if (this.debug) console.log("to", this.weights);
    // do the same for the bias, using 1 in place of an input
    if (this.debug) console.log("changed bias from", this.bias);
    this.bias += this.delta(actual, expected, 1);
    if (this.debug) console.log("to", this.bias);
    return false;
  }

  /**
   * Calculates the difference between actual and expected for a given input
   */
  private delta(actual: number, expected: number, input: number): number {
    const error = expected - actual; // the direction of the error
    /**
     * note: error here is either +1 or -1
     * could be more accurate if looking at raw value rather than just true or false
     */
    /**
     * want to learn faster in the beginning but then slow down
     */
    return error * this.learningRate * input;
  }

  /**
   * returns the raw score: sum(inputs * weights) + weighted bias
   */
  public score(inputs: Features, weights: number[] = this.weights): number {
    if (!this.didInit) this.init(inputs);

    // use bias as the initial value of the array reduce rather than adding as a separate step
    return inputs
      .map((inp, i) => inp * weights[i])
      .reduce((sum, curr) => sum + curr, this.bias);
  }

  /**
   * applies the activation function to the raw score
   */
  public predict(inputs: Features): number {
    if (this.debug) console.log("inputs", inputs, "score", this.score(inputs));
    return this.activate(this.score(inputs));
  }
}
