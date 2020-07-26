import React, { useState } from "react";
import { Props } from "../sharedComponents/color/RenderSet";
import { replaceIndex, groupBy } from "../lib";
import { GROUPINGS } from "./group-data";
import { SelectGroup } from "../sharedComponents/form/SelectGroup";
import { Title } from "../sharedComponents/ui/Title";

const GROUP_NAMES = GROUPINGS.map(o => o.name);

interface Data<T> {
  color: T;
  group: string;
  i: number;
}

const sortByGroup = <T extends any>(data: Data<T>[]) => {
  return groupBy(data, d => d.group);
};

export const ClassifyTool = <T extends any>({
  colors,
  colorToString = c => c
}: Props<T>) => {
  const [data, setData] = useState<
    Array<{ color: T; group: string; i: number }>
  >(colors.map((color, i) => ({ color, group: "Unassigned", i })));
  const [assigning, setAssigning] = useState<string>(GROUP_NAMES[0]);

  const getGroupColors = (group: string) => data.filter(o => o.group === group);

  return (
    <div>
      <Title>Assigning {assigning}</Title>
      <SelectGroup
        label="Switch To"
        value={assigning}
        onChange={setAssigning}
      />
      <h4
        onClick={() => {
          console.log(sortByGroup(data));
        }}
      >
        Log
      </h4>
      {GROUP_NAMES.map(group => (
        <div>
          <Title>{group}</Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div>{JSON.stringify(getGroupColors(group).map(c => c.color))}</div>
            {getGroupColors(group).map(({ color, i }) => (
              <div
                key={colorToString(color)}
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: colorToString(color)
                }}
                onClick={() =>
                  setData(
                    replaceIndex(data, i, {
                      ...data[i],
                      group: assigning
                    })
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
