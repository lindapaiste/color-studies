import React, {useMemo, useState} from "react";
import {buildIsGroupModel} from "./buildModel";
import {testRandom} from "./testRandom";
import {BinaryResults} from "./types";
import {RenderSet} from "../RenderSet";
import {toHex} from "../properties/chroma-js";
import GROUPINGS from "../grouping/group-data";
import {SelectGroup} from "../histogram/HistogramTool";

/**
 * examine the results from applying the model to random colors
 */

export interface Props {
    results: BinaryResults;
    labels?: [string, string];
}

export const RenderResults = ({results, labels = ["True", "False"]}: Props) => {
  return (
      <div>
          <h2>{labels[0]}</h2>
          <RenderSet colors={results[0]} colorToString={toHex} wrap={true}/>
          <h2>{labels[1]}</h2>
          <RenderSet colors={results[1]} colorToString={toHex} wrap={true}/>
      </div>
  )
};

export const TestGroups = () => {
  const [index, setIndex] = useState(0);
  const [replay, setReplay] = useState(0); //the stored value doesn't really mean anything, it's just a way to trigger useEffect or useMemo

    const groupName = GROUPINGS[index].name;

    const model = useMemo(
        () => buildIsGroupModel(index),
    [index]
    );

    const results = useMemo(
        () => testRandom(model, 200),
        [replay, model]
    );

    return (
     <div>
         <SelectGroup
             name={groupName}
             onChange={(group) => setIndex(GROUPINGS.indexOf(group))}
         />
         <div
            onClick={() => setReplay((r) => r + 1)}
         >Refresh Results</div>
         <RenderResults
             results={results}
             labels={["is " + groupName, "is not " + groupName]}
         />
     </div>
    );
};
