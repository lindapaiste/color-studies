import { ConfusionMatrix } from "./ConfusionMatrix";
import { BinaryClassifier } from "../types";

/**
 * apply a model's prediction function to two sets of data with known outcomes
 * to generate a confusion matrix
 */
export const testPredictions = <T = number>(
  model: BinaryClassifier<T>,
  valuesIn: T[],
  valuesOut: T[]
): ConfusionMatrix => {
  const a = new ConfusionMatrix();

  valuesIn.forEach((value) => {
    if (model.predict(value)) {
      a.truePositives++;
    } else {
      a.falseNegatives++;
    }
  });
  valuesOut.forEach((value) => {
    if (model.predict(value)) {
      a.falsePositives++;
    } else {
      a.trueNegatives++;
    }
  });

  return a;
};
