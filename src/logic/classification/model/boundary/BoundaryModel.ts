import { mean, standardDeviation } from "simple-statistics";
import { BinaryClassifier, Boundary, Distribution } from "../../types";

/**
 * use functions from simple-statistics package to get the distribution for an array or numbers
 */
export const getDistribution = (values: number[]): Distribution => ({
  mean: mean(values),
  stdDev: standardDeviation(values),
});

/**
 * nothing in this file depends on color at all, so the model can have other uses
 *
 * this model is not Bayesian since it looks at everything up front
 * compares the distributions of values which are known to be true (in) with those known to be false (out)
 */

export class BoundaryModel implements Boundary, BinaryClassifier<number> {
  public readonly cutoff: number;

  public readonly isGreater: boolean;

  /**
   * find the boundary between two sets of numbers by comparing their standard deviations
   * the boundary is the number which is an equal number of standard deviations from each mean
   *
   * therefore the portion of the tail on the wrong side of the boundary
   * has the same area for both groups (but not the same width)
   */
  constructor(valuesIn: number[], valuesOut: number[]) {
    const distIn = getDistribution(valuesIn);
    const distOut = getDistribution(valuesOut);

    /**
     * find the number of standard deviations where the two distributions intercept
     * ie. greater.mean - x * greater.stdDev = lesser.mean + x * lesser.stdDev
     */
    const isGreater = distIn.mean > distOut.mean;
    const greater = isGreater ? distIn : distOut;
    const lesser = isGreater ? distOut : distIn;
    const deviations =
      (greater.mean - lesser.mean) / (greater.stdDev + lesser.stdDev);
    const cutoff = greater.mean - deviations * greater.stdDev;

    /**
     * can get an idea of accuracy based on the number of standard deviations
     * anything in the tail beyond that amount is on the wrong side
     * so more deviations is better ( means the distributions are widely separated )
     *
     * but currently I am looking at the actual data to see how many come out on the wrong side
     */
    this.isGreater = isGreater;
    this.cutoff = cutoff;
  }

  /**
   * can predict whether a value is true or false based on whether it is greater than the cutoff
   * and whether being greater means true or false
   */
  predict = (value: number): boolean =>
    value > this.cutoff ? this.isGreater : !this.isGreater;
}
