import { GroupColorClassifier } from "./types";
import { I_ConfusionMatrix } from "./ConfusionMatrix";
import { GroupModelTest } from "./GroupModelTest";

export class TestedModel<M extends GroupColorClassifier<any>> {
  public readonly model: M;

  public readonly accuracy: I_ConfusionMatrix;

  constructor(model: M, testCount: number) {
    const tester = new GroupModelTest(model);
    tester.test(testCount);
    this.model = model;
    this.accuracy = tester.accuracy;
  }
}
