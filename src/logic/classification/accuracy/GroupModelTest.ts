import {
  GroupColorClassifier,
  IGetGroupedResults,
  HasPredicted,
  ResultType,
} from "../types";
import { ModelTest, Res } from "./ModelTest";
import { IColorAdapter } from "../../color/types";
import { getBalancedSample } from "../training/shuffledData";
import { ColorAdapter } from "../../color/ColorAdapter";
import { ConfusionMatrix } from "./ConfusionMatrix";

/**
 * handles converting DataPoints to expected true/false, etc.
 *
 * do training here??
 */

export class GroupModelTest<R extends HasPredicted>
  implements IGetGroupedResults<Res<IColorAdapter, R>>
{
  public readonly group: string;

  public results: ModelTest<IColorAdapter, R>;

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

  getResults = (type: ResultType | undefined): Res<IColorAdapter, R>[] =>
    this.results.getResults(type);
}
