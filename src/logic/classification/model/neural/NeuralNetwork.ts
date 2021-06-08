import {
  ModelFitArgs,
  Sequential,
  sequential,
  tensor1d,
  tensor2d,
  layers,
  train,
  ModelCompileArgs,
  History,
  tidy,
} from "@tensorflow/tfjs";
import { ChannelAdapter } from "../../../spacesChannels/ChannelAdapter";
import { GroupedHex } from "../../types";
import { ColorAdapter } from "../../../color/ColorAdapter";

/**
 * Should normalize all channel values from 0 to 1.
 * Can do a binary classification of in or not in group.
 * Can do a classification to the correct group, but need to onehot-encode the group names.
 */

export interface NNProps extends ModelFitArgs, Partial<ModelCompileArgs> {
  learningRate?: number;
  channels: ChannelAdapter[];
}

export interface BinaryNNProps extends NNProps {
  group: string;
}

export class BinaryNeuralNetwork {
  public readonly learningRate: number;

  public readonly channels: ChannelAdapter[];

  public readonly group: string;

  public readonly model: Sequential;

  public readonly fitArgs: ModelFitArgs;

  constructor({
    learningRate,
    channels,
    group,
    optimizer,
    loss,
    metrics,
    ...fitArgs
  }: BinaryNNProps) {
    this.learningRate = learningRate ?? 0.5;
    this.channels = channels;
    this.group = group;
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
        units: 1,
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
    return this.channels.map((channel) => adapter.get(channel, true));
  };

  public async train(colors: GroupedHex[]): Promise<History> {
    /**
     * Inputs are the features of each color.
     * 2D matrix where the width is the number of features
     * and the height is the count of colors.
     * Don't need to specify shape if the data is provided in a nested format.
     */
    const xs = tensor2d(colors.map(({ hex }) => this.extractFeatures(hex)));
    /**
     * Outputs are whether or not the training color matches the model group.
     * 1D matrix with boolean 0/1 values.
     */
    const ys = tensor1d(colors.map((c) => c.group === this.group));
    const res = await this.model.fit(xs, ys, this.fitArgs);
    /**
     * Not sure if this is required, might be done internally
     */
    xs.dispose();
    ys.dispose();
    return res;
  }

  predict(color: ColorAdapter) {
    return tidy(() => {
      const xs = tensor1d(this.extractFeatures(color));
      return this.model.predict(xs);
    });
  }
}
