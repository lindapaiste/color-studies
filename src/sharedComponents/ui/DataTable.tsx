import React, { ReactNode, useState, useMemo } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import sortBy from "lodash/sortBy";

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
  else if (typeof value === "number") return value.toString();
  else return undefined;
};

export const DataTable = <CF extends ReactNode, LF extends ReactNode>({
  rows = [],
  labels,
  getRowKey = (_, i) => i,
  getColumnKey = (label, i) => maybeToKey(label) || i
}: Props<CF, LF>) => {
  const [isDesc, setIsDesc] = useState(false);
  const [sortColumn, setSortColumn] = useState(-1);

  const getCellKey = (i: number) => {
    if (!!labels && !!labels[i]) return getColumnKey(labels[i], i);
    else return i;
  };

  const _sorted = useMemo(() => {
    const ordered = sortBy(rows, row => row[sortColumn]);
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
        {_sorted.map((row, i) => (
          <TableRow key={getRowKey(row, i)}>
            {row.map((value, i) => (
              <TableCell key={getCellKey(i)}>{value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

//what about component="th" scope={"row"}?  would have to be conditional
