import React, { useMemo, useState } from "react";
import { shuffledHexes } from "./shuffledData";
import { ColorAdapter } from "../packages/ColorAdapter";
import { channelBoundaries } from "./channelBoundaries";
import { ALL_ACCESSORS } from "../spacesChannels/colorSpaces";
import { SelectGroup } from "../sharedComponents/form/SelectGroup";
import GROUPINGS from "../grouping/group-data";
import {sortBy, round} from "../lib";
import { ExpandableConfusionMatrix } from "./RenderConfusionMatrix";
import {
  accessorKey,
  accessorTitle
} from "../spacesChannels/accessorConversion";
import { Title } from "../sharedComponents/ui/Title";

/**
 * based on the selected group name, calculates a boundary model for every property
 *
 * sorts the models by one key determinant (right now using balancedAccuracy, but could change)
 * can expand to show detailed analysis
 */
export const TestBoundaries = () => {
  const [group, setGroup] = useState(GROUPINGS[0].name);
  //const [property, SelectProperty] = useSelectProperty();
  //const [sampleSize, SampleSizeInput] = useNumberInput(100);

  const data = useMemo(
    () =>
      shuffledHexes().map(({ hex, group }) => ({
        hex,
        group,
        color: new ColorAdapter(hex)
      })),
    []
  );

  const models = useMemo(() => {
    const pairs = ALL_ACCESSORS.map(accessor => ({
      accessor,
      model: channelBoundaries(group, data, accessor)
    }));
    return sortBy(pairs, o => 1 - o.model.accuracy.balancedAccuracy); //do 1 minus to sort descending
  }, [group]);

  return (
    <div>
      <Title>Boundaries for {group}</Title>
      <SelectGroup value={group} onChange={setGroup} label="Select" />
      {models.map(({ accessor, model }) => (
        <div key={accessorKey(accessor)}>
          <Title importance="h3">{accessorTitle(accessor)}</Title>
          <div>
            {model.isGreater ? "Greater" : "Less"} than {round(model.cutoff, 2)}
          </div>
          <div>Accuracy: {model.accuracy.balancedAccuracy}</div>
          <ExpandableConfusionMatrix results={model.accuracy} />
        </div>
      ))}
    </div>
  );
};
