import { PerceptronProps, PerceptronResult } from "logic/classification/types";
import { GroupPerceptron } from "logic/classification/model/perceptron/GroupPerceptron";
import { GroupModelTest } from "logic/classification/accuracy/GroupModelTest";

export type Settings = PerceptronProps & {
  testCount: number;
};

export interface RenderProps {
  model: GroupPerceptron;
  results: GroupModelTest<PerceptronResult>;

  onClickRefresh(): void;
}
