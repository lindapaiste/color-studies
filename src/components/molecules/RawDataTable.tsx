import React, { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { orderBy } from "lib";

type KeyableLabel =
  | {
      /**
       * The unique key for the column. Required if the label is not a string.
       */
      key: string | number;
      /**
       * The label for the column. Can be a string or a complex JSX element.
       */
      label: ReactNode;
    }
  | {
      /**
       * If label is a string then the key is not required because the
       * label can be used as the key.
       */
      label: string;
    };

/**
 * Raw value types which are sortable.
 */
type Value = string | number | boolean;

/**
 * Note: Could potentially use a property name, but this means adding additional
 * cases to the union type, as callbacks which take a union are hard to implement.
 */
type ValueGetter<T, V> = {
  /**
   * A function which gets a value from the row object.
   * This is the raw value which is used for sorting.
   */
  getValue: (row: T) => V;
  /**
   * Can optionally provide a function to format the value for display.
   * Receives the raw value and the entire row object.
   */
  prepareValue?: (value: V, row: T) => ReactNode;
};

export type Column<T, V> = KeyableLabel &
  ValueGetter<T, V> & {
    /**
     * True if this column is the labels for the row.
     */
    isRowLabels?: boolean;
  };

/**
 * This version of a table accepts raw data,
 * which allows for better mapping of rows to unique keys.
 */
export interface Props<T> {
  /**
   * An array of values, presumably objects, representing each row.
   */
  rows: T[];
  /**
   * A function to get the unique key for each row.
   */
  getRowKey(row: T, i: number): string | number;
  /**
   * The schemas for each column.
   */
  columns: Column<T, Value>[];
}

/**
 * getColKey function makes use of the discriminated union.
 * If no key property is present then the label must be a valid key.
 */
const getColKey = (column: KeyableLabel): string | number => {
  if ("key" in column) {
    return column.key;
  }
  return column.label;
};

export const DataTable = <T,>({
  rows = [],
  columns = [],
  getRowKey,
}: Props<T>) => {
  /**
   * Sort order -- ascending or descending
   */
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  /**
   * Key of the column object to sort by
   * Note: this initial value assumes at least one column, so may cause errors.
   */
  const [sortKey, setSortKey] = useState(getColKey(columns[0]));

  /**
   * Could store the whole column object in state, but what if it changes?
   */
  const sortColumn = columns.find((c) => getColKey(c) === sortKey);

  /**
   * Note: the getValue callback is probably not memoized, so it would be
   * hard to properly memoize the sorting.
   */
  const sorted = sortColumn ? orderBy(rows, sortColumn.getValue, order) : rows;

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => {
            const key = getColKey(column);
            const isSort = sortKey === key;
            return (
              <TableCell component="th" scope="col" key={getColKey(column)}>
                <TableSortLabel
                  active={isSort}
                  direction={isSort ? order : "asc"}
                  onClick={() => {
                    if (isSort) {
                      // toggle direction if already sorted by this column
                      setOrder((current) =>
                        current === "asc" ? "desc" : "asc"
                      );
                    } else {
                      // make this be the sort column
                      setOrder("asc");
                      setSortKey(key);
                    }
                  }}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((row, i) => (
          <TableRow key={getRowKey(row, i)}>
            {columns.map((column) => {
              const rawValue = column.getValue(row);
              const displayValue = column.prepareValue
                ? column.prepareValue(rawValue, row)
                : rawValue;
              // semantic HTML for row labels
              const addedProps = column.isRowLabels
                ? ({ component: "th", scope: "row" } as const)
                : {};
              return (
                <TableCell key={getColKey(column)} {...addedProps}>
                  {displayValue}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
