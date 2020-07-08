import React, { useState } from "react";
import { PropsSingle } from "../RenderSet";
import { replaceIndex } from "../util";
import { groupBy } from "lodash";
import { GROUPINGS } from "./data";
//import pantone from "./sources/pantone.js";

const GROUP_NAMES = GROUPINGS.map(o => o.name);

interface Data<T> {
  color: T;
  group: string;
  i: number;
}

const sortByGroup = <T extends any>(data: Data<T>[]) => {
  return groupBy(data, d => d.group);
};

export const Classify = <T extends any>({
  colors,
  colorToString
}: PropsSingle<T>) => {
  const [data, setData] = useState<
    Array<{ color: T; group: string; i: number }>
  >(colors.map((color, i) => ({ color, group: "Unassigned", i })));
  const [assigning, setAssigning] = useState<string>(GROUP_NAMES[0]);

  const getGroupColors = (group: string) => data.filter(o => o.group === group);

  return (
    <div>
      <h3>Assigning {assigning}</h3>
      <h4>Switch To:</h4>
      <ul>
        <li>
          {GROUP_NAMES.map(group => (
            <div onClick={() => setAssigning(group)}>{group}</div>
          ))}
        </li>
      </ul>
      <h4
        onClick={() => {
          console.log(sortByGroup(data));
        }}
      >
        Log
      </h4>
      {GROUP_NAMES.map(group => (
        <div>
          <h3>{group}</h3>
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
