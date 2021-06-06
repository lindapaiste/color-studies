import {
  GroupColorClassifier,
  I_GetGroupedResults,
  I_Predicted,
  ResultType,
} from "./types";
import { ModelTest, Res } from "./ModelTest";
import { I_ColorAdapter } from "../color/types";
import { getBalancedSample } from "./shuffledData";
import ColorAdapter from "../color/ColorAdapter";
import { I_ConfusionMatrix } from "./ConfusionMatrix";

/**
 * handles converting DataPoints to expected true/false, etc.
 *
 * do training here??
 */

export class GroupModelTest<R extends I_Predicted>
  implements I_GetGroupedResults<Res<I_ColorAdapter, R>>
{
  public readonly group: string;
  public results: ModelTest<I_ColorAdapter, R>;

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

  get accuracy(): I_ConfusionMatrix {
    return this.results.matrix;
  }

  getResults = (type: ResultType | undefined): Res<I_ColorAdapter, R>[] => this.results.getResults(type);
}
