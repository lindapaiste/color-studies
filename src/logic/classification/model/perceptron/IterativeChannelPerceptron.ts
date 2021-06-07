import { ChannelAdapter } from "../../../spacesChannels/ChannelAdapter";
import { AllChannelBoundaries } from "../boundary/AllChannelBoundaries";
import { getBalancedSample } from "../../training/shuffledData";
import { GroupedColor, HasExpected, PerceptronProps } from "../../types";
import { ColorAdapter } from "../../../color/ColorAdapter";
import { ConfusionMatrix } from "../../accuracy/ConfusionMatrix";
import { GroupPerceptron } from "./GroupPerceptron";
import { TestedModel } from "../../accuracy/TestedModel";

/**
 * start with the highest correlated channel
 * then toy with adding channels one by one, but only if it makes the model better
 *
 * do I get better results from looking at every channel again after one is added, vs just looping once?
 */

export class IterativeChannelPerceptron {
  public readonly group: string;

  public channels: ChannelAdapter[];

  private readonly trainingData: (GroupedColor & HasExpected)[];

  private readonly iterations: number;

  private accuracy: ConfusionMatrix | undefined;

  public model: GroupPerceptron;

  constructor({
    group,
    iterations = 10,
    sampleSize = 100,
  }: Omit<PerceptronProps, "channels">) {
    this.channels = [];
    this.group = group;
    this.iterations = iterations;

    this.trainingData = getBalancedSample(group, sampleSize).map((obj) => ({
      ...obj,
      color: new ColorAdapter(obj.hex),
    }));

    const boundaryCreator = new AllChannelBoundaries(group, this.trainingData);

    // sorted by predictive values so that it starts with the most predictive
    const boundaries = boundaryCreator.mostAccurateModels();

    // only doing this to suppress the TS error that model might not be defined
    this.model = new GroupPerceptron({ group, channels: [] });

    /**
     * get TS errors if doing the assigment of this.model outside of the constructor
     * so use functions to create and check the model, but do the assignment here
     */
    let going = true;
    while (going) {
      boundaries.forEach(
        // going = boundaries.some(
        /**
         * return true if a model was added so that some() is true
         * and the iteration will loop through again
         */
        (boundary) => {
          const model = this.maybeBetterModel(boundary.channel);
          if (model === false) {
            return false;
          }
          this.model = model.model;
          this.accuracy = model.accuracy;
          this.channels.push(boundary.channel);
          console.log("added channel " + boundary.channel.title);
          return true;
        }
      );
      going = false;
    }
  }

  /**
   * return a model with the channel if it is an improvement,
   * or false if the channel is already included or the model is worse
   */
  private maybeBetterModel = (
    channel: ChannelAdapter
  ): TestedModel<GroupPerceptron> | false => {
    if (this.channels.includes(channel)) {
      return false;
    }
    // compare by balanced accuracy to see if it is an improvement
    const newer = this.modelWithChannel(channel);
    if (
      this.accuracy === undefined ||
      newer.accuracy.balancedAccuracy > this.accuracy.balancedAccuracy
    ) {
      return newer;
    }
    return false;
  };

  /**
   * make a new model with the specified channel included
   */
  private modelWithChannel = (
    channel: ChannelAdapter
  ): TestedModel<GroupPerceptron> =>
    new TestedModel(
      new GroupPerceptron({
        group: this.group,
        channels: [...this.channels, channel],
        iterations: this.iterations,
      }),
      100
    );
}

export const makeIterativePerceptron = (
  group: string,
  sampleSize?: number,
  iterations?: number
): GroupPerceptron => {
  const obj = new IterativeChannelPerceptron({ group, sampleSize, iterations });
  return obj.model;
};
