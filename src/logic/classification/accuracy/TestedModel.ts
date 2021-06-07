import { GroupColorClassifier } from "../types";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { GroupModelTest } from "./GroupModelTest";

/**
 * Combines a model and it's confusion matrix
 */
export class TestedModel<M extends GroupColorClassifier<any>> {
  public readonly model: M;

  public readonly accuracy: ConfusionMatrix;

  constructor(model: M, testCount: number) {
    const tester = new GroupModelTest(model);
    tester.test(testCount);
    this.model = model;
    this.accuracy = tester.accuracy;
  }
}
