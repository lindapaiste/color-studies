import React from "react";
import { isNumberKey, round, typedKeys, proper } from "lib";
import { Table, TableBody, TableCell, TableHead, TableRow } from "components";
import { ChannelSlug } from "logic/colorspaces/colorSpaces";
import { PropertyAnalysis } from "../../logic/classification/averages/types";

/**
 * Show the detailed analysis of one or two properties.  If two, show a greater than
 * or less than symbol between the two columns.
 */

export interface CompareState {
  property: ChannelSlug;
  group: string;
  analysis: PropertyAnalysis;
}

const ColHeading = ({ property, group }: CompareState) => (
  <TableCell component="th" scope="col">
    <strong>{group}</strong>
    <br />
    {property}
  </TableCell>
);

export const Comparison = ({ compare }: { compare: CompareState[] }) => {
  if (!compare[0]) {
    return null;
  }
  const hasSecond = compare.length > 1;
  return (
    <div>
      <Table style={{ width: "unset" }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <ColHeading {...compare[0]} />
            {hasSecond && (
              <>
                <TableCell component="th" scope="col">
                  vs.
                </TableCell>
                <ColHeading {...compare[1]} />
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {typedKeys(compare[0].analysis).map((key) => {
            // want to skip over array values (ie. values and differences)
            if (!isNumberKey(key, compare[0].analysis)) {
              return null;
            }
            return (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {proper(key)}
                </TableCell>
                <TableCell>{round(compare[0].analysis[key], 2)}</TableCell>
                {hasSecond && (
                  <TableCell>
                    {compare[0].analysis[key] > compare[1].analysis[key]
                      ? ">"
                      : "<"}
                  </TableCell>
                )}
                {hasSecond && (
                  <TableCell>{round(compare[1].analysis[key], 2)}</TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
