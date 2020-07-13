import React, { useState } from "react";
import { PropertyAnalysis, GroupColorAnalysis } from "./analyzeColors";
import { GROUPINGS } from "./group-data";
import { getGroupData } from "./analyzeColors";
import { round } from "lodash";

export const GroupsAnalysis = () => (
  <ResultsTable
    columns={GROUPINGS.map(set => ({
      group: set.name,
      data: getGroupData(set.hexes)
    }))}
  />
);

export interface Column {
  group: string;
  data: GroupColorAnalysis;
}

export interface Props {
  columns: Column[];
}

export interface CompareState {
  property: string;
  group: string;
  analysis: PropertyAnalysis;
}

export const ResultsTable = ({ columns }: Props) => {
  /**
   * will have between 0 and 2 entries.  drop left when more than 2
   *
   * makes most sense to compare same property across groups,
   * but can also compare packages within group
   * so I am not forcing that the property is the same
   */
  const [compare, setCompare] = useState<CompareState[]>([]);

  const isCompare = (group: string, property: string) => {
    return compare.some(o => o.group === group && o.property === property);
  };
  //empty array not allowed because gets column names from first object
  const first = columns[0];
  if (!first) {
    return null;
  }
  return (
    <div>
      <RenderCompare compare={compare} />
      <table>
        <thead>
          <tr>
            <th scope="col">Group</th>
            {Object.keys(columns[0].data).map(key => (
              <th scope="col" key={key}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map(({ group, data }) => (
            <tr key={group}>
              <th scope="row">{group}</th>
              {Object.keys(data).map(property => {
                const analysis: PropertyAnalysis = data[property];
                return (
                  <td
                    style={
                      isCompare(group, property)
                        ? { backgroundColor: "yellow" }
                        : {}
                    }
                    key={property}
                    onClick={() => {
                      if (!isCompare(group, property)) {
                        //guard against adding the same twice
                        setCompare([
                          ...compare.slice(-1),
                          { group, property, analysis }
                        ]);
                      }
                    }}
                  >
                    {round(analysis.mean, 2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RenderCompare = ({ compare }: { compare: CompareState[] }) => {
  if (!compare[0]) {
    return null;
  }
  const hasSecond = compare.length > 1;
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td />
            <th scope="col">{compare[0].group}</th>
            {hasSecond && (
              <>
                <th scope="col">vs.</th>
                <th scope="col">{compare[1].group}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Object.keys(compare[0].analysis).map(key => {
            //want to skip over array packages (ie. values and differences)
            if (typeof compare[0].analysis[key] !== "number") {
              return null;
            }
            return (
              <tr key={key}>
                <th scope="row">{key}</th>
                <td>{round(compare[0].analysis[key], 4)}</td>
                {hasSecond && (
                  <td>
                    {compare[0].analysis[key] > compare[1].analysis[key]
                      ? ">"
                      : "<"}
                  </td>
                )}
                {hasSecond && <td>{round(compare[1].analysis[key], 4)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
