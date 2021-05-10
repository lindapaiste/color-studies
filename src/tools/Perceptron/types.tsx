import {PerceptronProps, PerceptronResult} from "../../classifier/types";
import {GroupPerceptron} from "../../classifier/GroupPerceptron";
import {GroupModelTest} from "../../classifier/GroupModelTest";

export type Settings = PerceptronProps & {
    testCount: number;
}

export interface RenderProps {
    model: GroupPerceptron;
    results: GroupModelTest<PerceptronResult>;

    onClickRefresh(): void;
}
