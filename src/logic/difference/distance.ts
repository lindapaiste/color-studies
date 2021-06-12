import { WeightedDeltaEFormula, KeyedLCHWeights, LAB } from "./types";
import { ColorSpaceName } from "../colorspaces/types";
import { EuclideanCalculator } from "./EuclideanCalculator";
import { ColorAdapter } from "../convert";

export const toKeyedLAB = (color: ColorAdapter): LAB => {
  const labTuple = color.toCs("lab").deNormalize();
  const [L, A, B] = labTuple;
  return { L, A, B };
};

export const toKeyedWeights = (
  tuple: number[] | undefined
): KeyedLCHWeights | undefined => {
  if (tuple === undefined) return undefined;
  const [lightness, chroma, hue] = tuple;
  return { lightness, chroma, hue };
};

export const makeEuclideanDifference =
  <CS extends ColorSpaceName>(
    colorSpace: CS
  ): WeightedDeltaEFormula<ColorAdapter, CS> =>
  (a, b, weights): number =>
    new EuclideanCalculator({
      model: colorSpace,
      weights: weights || [1, 1, 1, 1],
    }).getDeltaE(a, b);

export const deltaE76 = makeEuclideanDifference("lab");
