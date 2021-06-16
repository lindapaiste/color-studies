import {
  GroupColorClassifier,
  HasPredicted,
  CanGetGroupedResults,
  ResultType,
} from "../types";
import { ModelTest, Res } from "./ModelTest";
import { getBalancedSample } from "../training/shuffledData";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { ColorAdapter } from "../../convert";

/**
 * Wrapper around ModelTest can create training data just based on the group.
 */

export class GroupModelTest<R extends HasPredicted>
  implements CanGetGroupedResults<Res<ColorAdapter, R>>
{
  public readonly group: string;

  public results: ModelTest<ColorAdapter, R>;

  constructor(model: GroupColorClassifier<R>, debug: boolean = false) {
    this.group = model.group;
    this.results = new ModelTest(model, debug);
  }

  public test = (count: number): void => {
    const data = getBalancedSample(this.group, count);

    this.results.testMany(
      data.map((obj) => ({
        ...obj,
        value: new ColorAdapter(obj.hex),
      }))
    );
  };

  get accuracy(): ConfusionMatrix {
    return this.results.matrix;
  }

  getResults = (type: ResultType | undefined): Res<ColorAdapter, R>[] =>
    this.results.getResults(type);
}
