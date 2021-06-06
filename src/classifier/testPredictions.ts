import { ConfusionMatrix, I_ConfusionMatrix } from "./ConfusionMatrix";
import { I_BinaryClassifier } from "./types";

/**
 * apply a model's prediction function to two sets of data with known outcomes
 * to generate a confusion matrix
 */
export const testPredictions = <T = number>(
  model: I_BinaryClassifier<T>,
  valuesIn: T[],
  valuesOut: T[]
): I_ConfusionMatrix => {
  let a = new ConfusionMatrix();

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
