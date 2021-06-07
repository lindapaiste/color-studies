import { makeArray } from "lib";
import { IPerceptron, DataPoint, Stage } from "./types";

/**
 * the set of data must be passed through multiple times in order to properly fit the model
 * each pass of the whole set is an epoch
 *
 * note that one run without errors does not guarantee perfect fit if changes were made during that run
 * needs a run with no errors and no changes
 * OR needs to check for errors after the mutations
 */

export class Trainer {
  public readonly model: IPerceptron;

  public readonly stages: Stage[];

  private readonly isTrained: boolean; // will usually be true by the time that the constructor is done, but not if the max epochs was reached first

  private readonly log: boolean;

  // public readonly epochs: number;

  /**
   * the computation is all done in the constructor
   * this is a class mainly for storing and accessing the values encountered along the way
   * and separation of concerns in general
   */
  constructor(
    model: IPerceptron,
    trainingSet: DataPoint[],
    maxEpochs: number = 10,
    log: boolean = false
  ) {
    this.model = model;
    // this.epochs = 0;
    this.stages = [];
    this.isTrained = false;
    this.log = log;

    /**
     * loops through training data multiple times
     * but will create an infinite loop if it never converges to a good model,
     * ie. if the data is not linearly separable
     * so it needs a maximum number of epochs
     */
    let i = 0;
    while (!this.isTrained && this.stages.length < maxEpochs) {
      if (this.log) console.log("starting epoch " + i);
      this.isTrained = this.epoch(trainingSet);
      if (this.log) console.log("is trained? " + this.isTrained);
      i++;
    }
  }

  /**
   * loops through every element in the training set once
   * returns true if there were no changes made during this epoch
   */
  private epoch(trainingSet: DataPoint[]): boolean {
    /**
     * train the model and receive an array of booleans showing if each data point was ok
     *
     * does the perceptron always return its result in train()?  might need a forward and a backwards pass
     */
    const results = trainingSet.map((t) =>
      this.model.train(t.features, t.expected)
    );

    // number of errors
    const errors = results.filter((b) => !b).length;

    // compare to the previously stored stage to get the change amount
    const previous = this.stages[this.stages.length - 1];
    // needs to include the bias
    // special case for the first iteration shows change from 0
    const prevWeights = previous
      ? [...previous.weights, previous.bias]
      : makeArray(this.model.weights.length + 1, 0);

    const netSquaredAdjustment = this.model.weights.reduce(
      (acc, weight, i) => acc + (weight - prevWeights[i]) ** 2,
      0
    );

    // must clone the data rather than storing a reference, as the model will mutate its internal data
    const stage = {
      weights: [...this.model.weights],
      bias: this.model.bias,
      errors,
      netSquaredAdjustment,
    };
    if (this.log) console.log(stage);

    this.stages.push(stage);

    return this.isSuccess(stage);
  }

  private isSuccess(stage: Stage): boolean {
    // in the future want to also consider stopping when adjustments become minimal
    return stage.errors === 0;
  }

  // don't need to store the epoch count if storing stages, it's an either or
  get epochs() {
    return this.stages.length;
  }
}

/**
 https:// stackoverflow.com/questions/36740533/what-are-forward-and-backward-passes-in-neural-networks

 The "forward pass" refers to calculation process, values of the output layers from the inputs data. It's traversing through all neurons from first to last layer.

 A loss function is calculated from the output values.

 And then "backward pass" refers to process of counting changes in weights (de facto learning), using gradient descent algorithm (or similar). Computation is made from last layer, backward to the first layer.

 Backward and forward pass makes together one "iteration".
 */
