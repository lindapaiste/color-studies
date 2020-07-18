import React, { useMemo, useState } from "react";
import { buildIsGroupModel } from "./perceptronModel";
import { testRandom } from "./perceptronModel";
import { BinaryResults } from "./perceptronModel";
import { RenderSet } from "../sharedComponents/color/RenderSet";
import { toHex } from "../packages/chroma-js";
import GROUPINGS from "../grouping/group-data";
import { SelectGroup } from "../sharedComponents/form/SelectGroup";

/**
 * examine the results from applying the model to random colors
 */

export interface Props {
  results: BinaryResults;
  labels?: [string, string];
}

export const RenderResults = ({
  results,
  labels = ["True", "False"]
}: Props) => {
  return (
    <div>
      <h2>{labels[0]}</h2>
      <RenderSet colors={results[0]} colorToString={toHex} wrap={true} />
      <h2>{labels[1]}</h2>
      <RenderSet colors={results[1]} colorToString={toHex} wrap={true} />
    </div>
  );
};

export const TestGroups = () => {
  const [groupName, setGroupName] = useState(GROUPINGS[0].name);
  const [replay, setReplay] = useState(0); //the stored value doesn't really mean anything, it's just a way to trigger useEffect or useMemo

  const model = useMemo(() => buildIsGroupModel(groupName), [groupName]);

  const results = useMemo(() => testRandom(model, 10), [replay, model]);

  return (
    <div>
      <SelectGroup value={groupName} onChange={setGroupName} />
      <div onClick={() => setReplay(r => r + 1)}>Refresh Results</div>
      <RenderResults
        results={results}
        labels={["is " + groupName, "is not " + groupName]}
      />
    </div>
  );
};
