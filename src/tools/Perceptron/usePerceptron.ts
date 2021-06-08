import { useMemo, useState } from "react";
import { GroupPerceptron } from "logic/classification/model/perceptron/GroupPerceptron";
import { GroupModelTest } from "logic/classification/accuracy/GroupModelTest";
import { RenderProps, Settings } from "./types";

/**
 * separate the logic which turns settings into a model and a set of results
 *
 * cannot return early because the hooks cannot be conditional,
 * but understand that model and results are useless if channels is empty
 * instead, only include the component which calls this hook if channels are set
 */
export const usePerceptron = ({
  group,
  channels,
  testCount,
  iterations,
}: Settings): RenderProps => {
  const [replay, setReplay] = useState(0); // the stored value doesn't really mean anything, it's just a way to trigger useEffect or useMemo

  const model = useMemo(
    () => new GroupPerceptron({ group, channels, iterations }),
    [group, channels, iterations]
  );

  const results = useMemo(
    () => {
      const tester = new GroupModelTest(model, true);
      tester.test(testCount);
      return tester;
    },
    // eslint-disable-next-line
    [model, testCount, replay]
  );

  const onClickRefresh = () => setReplay((r) => r + 1);

  return {
    model,
    results,
    onClickRefresh,
  };
};
