import { SelectProperty } from "../sharedComponents/form/SelectProperty";
import React, { useState } from "react";
import { PlotFeatures } from "./PlotFeatures";
import { ColorPropKey } from "../packages/types";
import GROUPINGS from "../grouping/group-data";
import { SelectGroup } from "../sharedComponents/form/SelectGroup";
import { NumberInput } from "../sharedComponents/form/NumberInput";

/**
 * tool allows dynamic creation of a PlotFeatures component
 * by allowing the user to select the group, two properties/channels (x and y)
 * and sample size (count) for the plot
 */

export const PlotFeaturesTool = () => {
  const [groupName, setGroupName] = useState(GROUPINGS[0].name);
  const [x, setX] = useState<ColorPropKey>();
  const [y, setY] = useState<ColorPropKey>();
  const [count, setCount] = useState(100);

  return (
    <div>
      <div>
        <SelectProperty slug={x} onChange={setX} />
        <SelectProperty slug={y} onChange={setY} />
        <SelectGroup value={groupName} onChange={setGroupName} />
        <NumberInput value={count} isInt={true} onChange={setCount} />
      </div>
      <div>
        {!!x && !!y && (
          <PlotFeatures count={count} x={x} y={y} group={groupName} />
        )}
      </div>
    </div>
  );
};
