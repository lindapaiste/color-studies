import React, { useState } from "react";
import { groupBy, replaceIndex } from "lib";
import { ColorSetProps, SelectGroup, Title } from "components";
import { allGroupNames, randomGroupName } from "data";

/**
 * Helper tool to batch assign colors.
 * No longer needed.
 * Logs the output to be copy & pasted into JSON file.
 */

interface Data<T> {
  color: T;
  group: string;
  i: number;
}

const sortByGroup = <T extends any>(data: Data<T>[]) => {
  return groupBy(data, (d) => d.group);
};

export const ClassifyTool = <T extends any>({
  colors,
  colorToHex = (c) => String(c),
}: ColorSetProps<T>) => {
  const [data, setData] = useState<
    Array<{ color: T; group: string; i: number }>
  >(
    colors.map((color, i) => ({
      color,
      group: "Unassigned",
      i,
    }))
  );
  const [assigning, setAssigning] = useState<string>(randomGroupName);

  const getGroupColors = (group: string) =>
    data.filter((o) => o.group === group);

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
      {allGroupNames().map((name) => (
        <div>
          <Title>{name}</Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div>
              {JSON.stringify(getGroupColors(name).map((c) => c.color))}
            </div>
            {getGroupColors(name).map(({ color, i }) => (
              <div
                key={colorToHex(color)}
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: colorToHex(color),
                }}
                onClick={() =>
                  setData(
                    replaceIndex(data, i, {
                      ...data[i],
                      group: assigning,
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
