import { ConfusionMatrix, I_ConfusionMatrix } from "./ConfusionMatrix";
import {
  I_GetGroupedResults,
  I_Predicted,
  I_ResultGroups,
  I_Testable,
  I_TestInput,
  ResultType,
} from "./types";

/**
 * can test any model which fits the I_Testable interface
 *
 * in order for confusion matrix to make any sense, expected has to be known
 *
 *
 * could keep the same matrix and increment its values
 * could also create a new matrix each time from the lengths of the groups
 *
 *
 *
 * T is the type of the input (I_ColorAdapter)
 * S is what the model returns from its getResult function
 * Res is the returned result plus {expected}
 *
 * don't define Res as a generic for the function, otherwise get errors about how
 * it could be fulfilled with another subtype.
 * need to say that the expected Res is JUST I_TestInput<T> & S and nothing else
 */

export type Res<T, S> = I_TestInput<T> & S;

export class ModelTest<T, S extends I_Predicted>
  implements I_ResultGroups<Res<T, S>[]>, I_GetGroupedResults<Res<T, S>>
{
  public readonly matrix: I_ConfusionMatrix;

  public readonly falseNegatives: Res<T, S>[];

  public readonly falsePositives: Res<T, S>[];

  public readonly trueNegatives: Res<T, S>[];

  public readonly truePositives: Res<T, S>[];

  private readonly debug: boolean; // how is this used??

  private readonly model: I_Testable<T, S>;

  constructor(model: I_Testable<T, S>, debug: boolean = false) {
    console.log({ model, debug });
    this.model = model;
    this.debug = debug;
    this.matrix = new ConfusionMatrix();
    this.truePositives = [];
    this.trueNegatives = [];
    this.falsePositives = [];
    this.falseNegatives = [];
  }

  /**
   * test a single item
   * adds the data to this, but also returns the result
   */
  public test = (input: I_TestInput<T>) => {
    const result = {
      ...input,
      ...this.model.predictResult(input.value, this.debug),
    };
    if (result.predicted) {
      if (input.expected) {
        this.truePositives.push(result);
        this.matrix.truePositives++;
      } else {
        this.falsePositives.push(result);
        this.matrix.falsePositives++;
      }
    } else {
      if (input.expected) {
        this.falseNegatives.push(result);
        this.matrix.falseNegatives++;
      } else {
        this.trueNegatives.push(result);
        this.matrix.trueNegatives++;
      }
    }

    return result;
  };

  public testMany = (inputs: Array<I_TestInput<T>>): void => {
    inputs.forEach(this.test);
  };

  /**
   * return all results in one long array
   */
  public get results(): Res<T, S>[] {
    return [
      ...this.truePositives,
      ...this.falsePositives,
      ...this.trueNegatives,
      ...this.falseNegatives,
    ];
  }

  public getResults = (type: ResultType | undefined): Res<T, S>[] => {
    if (type === undefined) {
      return this.results;
    } else {
      return this[type];
    }
  };
}
