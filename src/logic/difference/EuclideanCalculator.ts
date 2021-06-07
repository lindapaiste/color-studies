import { ColorSpaceName } from "../spacesChannels/types";
import { FormulaSettings, DeltaECalculator } from "./types";
import { rawDistance } from "./euclideanDistance";
import { IColorAdapter } from "../color/types";
import { ModelAdapter } from "../spacesChannels/ModelAdapter";
import { getModel } from "../spacesChannels/models";

/**
 * CIE 1976 formula uses Euclidean Distance of LAB coordinates,
 * but the same formula can be applied to RGB or any other color space
 *
 * no matter what the weights are, CIE distances always range from 0 to 100
 * result from Euclidean distance must be adjusted accordingly
 *
 * the primary reason that this class exists is to handle that adjustment
 * the maximum is the same as long as the colorSpace and the weights are the same
 * so it does not need to be recalculated for each a/b pairing
 */
export class EuclideanCalculator implements DeltaECalculator {
  private readonly weights: number[];

  private readonly modelName: ColorSpaceName;

  private readonly maximum: number;

  private readonly modelAdapter: ModelAdapter<ColorSpaceName>;

  /**
   * pass weights and model in the constructor to make them readonly
   * calculate and store the maximum
   */
  constructor({ weights, model }: Pick<FormulaSettings, "weights" | "model">) {
    this.weights = weights;
    this.modelName = model;
    this.modelAdapter = getModel(model);
    this.maximum = this.calcMax();
  }

  /**
   * creates one tuple with all the max values and one with all the min values and another with the maxes
   * then uses rawDistance formula to find the distance between these two extrema
   */
  private calcMax(): number {
    const min = this.modelAdapter.channels.map((c) => c.min);
    const max = this.modelAdapter.channels.map((c) => c.max);
    return rawDistance(min, max, this.weights);
  }

  /**
   * returns the distance between two colors, applying this colorSpace and weights,
   * in the range 0 to 100
   */
  public getDeltaE(a: IColorAdapter, b: IColorAdapter): number {
    const raw = rawDistance(
      a.to(this.modelName),
      b.to(this.modelName),
      this.weights
    );
    return (100 * raw) / this.maximum;
  }
}
