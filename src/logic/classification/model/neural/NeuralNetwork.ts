import {
  ModelFitArgs,
  Sequential,
  sequential,
  tensor2d,
  layers,
  train,
  ModelCompileArgs,
  History,
  tidy,
  Tensor,
} from "@tensorflow/tfjs";
import { orderBy } from "lib";
import { allGroupNames } from "data";
import { ChannelAdapter } from "../../../spacesChannels/ChannelAdapter";
import { GroupedHex } from "../../types";
import { ColorAdapter } from "../../../color/ColorAdapter";
import { OneHotEncoder } from "./OneHotEncoder";

/**
 * Should normalize all channel values from 0 to 1.
 *
 * Can do a binary classification of in or not in group,
 * but need a loss function that's not categoricalCrossentropy.
 *
 * Can do a classification to the correct group,
 * but need to onehot-encode the group names.
 */

export interface NNProps extends ModelFitArgs, Partial<ModelCompileArgs> {
  learningRate?: number;
  channels: ChannelAdapter[];
}

export interface LabelAndConfidence {
  label: string;
  confidence: number;
}

export class NeuralNetwork {
  public readonly learningRate: number;

  public readonly channels: ChannelAdapter[];

  public readonly model: Sequential;

  public readonly fitArgs: ModelFitArgs;

  private readonly groups: OneHotEncoder;

  constructor({
    learningRate,
    channels,
    optimizer,
    loss,
    metrics,
    ...fitArgs
  }: NNProps) {
    this.groups = new OneHotEncoder(allGroupNames());
    this.learningRate = learningRate ?? 0.5;
    this.channels = channels;
    this.model = sequential();
    this.model.add(
      layers.dense({
        /**
         * TODO: what is the desired value for units?
         * "Positive integer, dimensionality of the output space."
         */
        units: 16,
        activation: "relu",
        inputShape: [this.channels.length],
      })
    );
    this.model.add(
      layers.dense({
        /**
         * Based on ml5 source, units here should be the output units.
         */
        units: this.groups.length,
        activation: "softmax",
      })
    );
    this.model.compile({
      loss: loss ?? "categoricalCrossentropy",
      optimizer: optimizer ?? train.sgd(this.learningRate),
      metrics: metrics ?? ["accuracy"],
    });
    this.fitArgs = fitArgs;
  }

  /**
   * Takes a color object and returns an array of normalized channel values
   */
  private extractFeatures = (color: string | ColorAdapter): number[] => {
    const adapter = typeof color === "string" ? new ColorAdapter(color) : color;
    const features = this.channels.map((channel) => adapter.get(channel, true));
    const nanI = features.findIndex((v) => Number.isNaN(v));
    if (nanI !== -1) {
      throw new Error(
        `Color ${adapter.hex()} returned value NaN for channel ${
          this.channels[nanI].key
        }`
      );
    }
    return features;
  };

  public async train(colors: GroupedHex[]): Promise<History> {
    /**
     * Inputs are the features of each color.
     * 2D matrix where the width is the number of features
     * and the height is the count of colors.
     * Don't need to specify shape if the data is provided in a nested format.
     */
    const xs = tensor2d(
      colors.map(({ hex }) => this.extractFeatures(hex)).flat(),
      [colors.length, this.channels.length]
    );
    /**
     * Outputs are the one-hot encoding of the expected group.
     * 2D matrix where the width is the number of groups
     * and the height is the count of colors.
     */
    const ys = tensor2d(colors.map((c) => this.groups.encode(c.group)).flat(), [
      colors.length,
      this.groups.length,
    ]);
    const res = await this.model.fit(xs, ys, this.fitArgs);
    /**
     * Not sure if this is required, might be done internally
     */
    xs.dispose();
    ys.dispose();
    return res;
  }

  /**
   * Prediction from the model is an array of 8 numbers representing the
   * probability of each group.
   *
   * Format this into an object with label and confidence.
   * And sort in descending order of confidence.
   */
  predict(color: string | ColorAdapter): LabelAndConfidence[] {
    return tidy(() => {
      const xs = tensor2d(this.extractFeatures(color), [
        1,
        this.channels.length,
      ]);
      const tensor = this.model.predict(xs) as Tensor;
      const confidences = tensor.dataSync();
      const predictions = [...confidences].map((confidence, i) => ({
        label: this.groups.uniqueValues[i],
        confidence,
      }));
      return orderBy(predictions, (p) => p.confidence, "desc");
    });
  }
}
