import { makeArray } from "lib";
import { getBalancedSample } from "../../training/shuffledData";
import { ChannelAdapter } from "../../../spacesChannels/ChannelAdapter";
import { hexToColor } from "../../../color";
import { IColorAdapter } from "../../../color/types";
import {
  IGroupPerceptron,
  ImpossibleCheck,
  PerceptronProps,
  PerceptronResult,
} from "../../types";
import { Perceptron } from "./Perceptron";
import { Binary, IPerceptron } from "./types";
import { Trainer } from "./PerceptronTrainer";

/**
 * Sometimes works, but only with the right combination of channels
 *
 * problems with using perceptron:
 *
 * --Expects normally distributed data, but some sets are clustered towards a hard cutoff at the end (like neons and saturation)
 *
 * --Expects features to be independent, but color properties are only independent if they come from the same model.
 * Will create problems if using properties from different color spaces because they are codependent.
 *
 * use manually defined color groups as the training data to create a model which assigns group
 *
 * based on how the model is built -- by going through each color, predicting, and adjusting,
 * the order of inputs matters
 *
 */

export class GroupPerceptron implements IGroupPerceptron {
  private readonly model: IPerceptron;

  public readonly channels: ChannelAdapter[];

  public readonly group: string;

  constructor({
    group,
    channels,
    iterations = 15,
    sampleSize = 100,
  }: PerceptronProps) {
    this.channels = channels;
    this.group = group;

    const trainingData = getBalancedSample(group, sampleSize).map(
      ({ hex, expected }) => ({
        expected: (expected ? 1 : 0) as Binary,
        features: this.getFeatures(hexToColor(hex)),
      })
    );
    /*
        const trainingData = shuffledGroupData(hex => this.getFeatures(hexToColor(hex)))
            .map(datum => ({...datum, expected: (datum.group === group ? 1 : 0) as Binary})); */

    const trainer = new Trainer(
      new Perceptron({ activate: (n) => n }),
      trainingData.slice(0, 10),
      iterations
    );
    // can recreate the perceptron with identity instead of heaviside as activate
    this.model = trainer.model;

    console.log(this.model);
  }

  /**
   * convert a color to features based on the model channels
   */
  getFeatures = (color: IColorAdapter): number[] =>
    this.channels.map(
      // need to normalize value
      (channel) => channel.normalize(color.get(channel))
    );

  /**
   * internal model returns 1 or 0
   * in order to get a numeric score and not just 1/0, need to replicate the internal prediction logic of the perceptron
   */
  private logPredict = (features: number[]): number => {
    // Calculate the sum of features times weights,
    // with the bias added (implicitly times one).
    let score = 0;
    for (let i = 0; i < this.weights.length; i++) {
      score += this.weights[i] * features[i];
      console.log(
        "adding " +
          this.weights[i] * features[i] +
          " for a new score of " +
          score
      );
    }
    score += this.bias;
    console.log(
      "adding bias of " + this.bias + " for a final score of " + score
    );
    return score;
  };

  public predictResult = (
    color: IColorAdapter,
    debug: boolean = false
  ): PerceptronResult => {
    const features = this.getFeatures(color);
    const score = debug
      ? this.logPredict(features)
      : this.model.predict(features);
    const predicted = score > 0;
    return {
      color,
      features,
      score,
      predicted,
    };
  };

  /**
   * if everything returns the same result, then the model sucks
   * cannot just compare all 1s to all 0s because some weight are positive while others are negative
   */
  public impossibleCheck = (): ImpossibleCheck => {
    const maxScore = this.model.predict(
      makeArray(this.channels.length, (i) => (this.weights[i] > 0 ? 1 : 0))
    );
    const minScore = this.model.predict(
      makeArray(this.channels.length, (i) => (this.weights[i] > 0 ? 0 : 1))
    );
    const isImpossible =
      (maxScore > 0 && minScore > 0) || (maxScore < 0 && minScore < 0);
    return {
      isImpossible,
      maxScore,
      minScore,
    };
  };

  get weights() {
    return this.model.weights;
  }

  get bias() {
    return this.model.bias;
  }
}
