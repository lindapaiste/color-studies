import React, { ReactNode, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { sortBy } from "lodash";

/**
 * TODO: add sorting
 */

/**
 * here, it is expected that data is already formatted
 * in a way that React can print out, ie. numbers, strings, or ReactNodes
 */
export interface Props<CF extends ReactNode, LF extends ReactNode> {
  rows: CF[][];
  labels?: LF[];

  /**
   * is ok to use i for column key because columns don't change
   * unsure how sorting would impact row key because it is done internally
   * and the rows prop never changes
   *
   * could get row key from the first entry, but this only works if the first entry is a label
   * if it's a value then there will be duplicated keys
   */

  getRowKey?(row: CF[], i: number): string | number;

  getColumnKey?(label: LF, i: number): string | number;
}

const maybeToKey = (value: any): string | undefined => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  return undefined;
};

export const DataTable = <CF extends ReactNode, LF extends ReactNode>({
  rows = [],
  labels,
  getRowKey = (_, i) => i,
  getColumnKey = (label, i) => maybeToKey(label) || i,
}: Props<CF, LF>) => {
  const [isDesc, setIsDesc] = useState(false);
  const [sortColumn, setSortColumn] = useState(-1);

  const getCellKey = (i: number) =>
    !!labels && !!labels[i] ? getColumnKey(labels[i], i) : i;

  const sorted = useMemo(() => {
    const ordered = sortBy(rows, (row) => row[sortColumn]);
    return isDesc ? ordered.reverse() : ordered;
  }, [isDesc, sortColumn, rows]);

  return (
    <Table>
      {labels !== undefined && (
        <TableHead>
          <TableRow>
            {labels.map((label, i) => (
              <TableCell
                component="th"
                scope="col"
                key={getColumnKey(label, i)}
              >
                <TableSortLabel
                  active={sortColumn === i}
                  direction={sortColumn === i && isDesc ? "desc" : "asc"}
                  onClick={() => {
                    if (sortColumn === i) {
                      setIsDesc(!isDesc);
                    } else {
                      setIsDesc(false);
                      setSortColumn(i);
                    }
                  }}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {sorted.map((row, i) => (
          <TableRow key={getRowKey(row, i)}>
            {row.map((value, j) => (
              <TableCell key={getCellKey(j)}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// what about component="th" scope={"row"}?  would have to be conditional
