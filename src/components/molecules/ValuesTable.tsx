import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { typedEntries, round, proper } from "lib";

/**
 * renders a table of properties and values
 * can accept a key-value object/record or an array of entries
 */
export interface Props<T> {
  data: [string, T][] | Record<keyof any, T>;
  transformKey?(key: string): ReactNode;
  transformValue?(value: T): ReactNode;
  labels?: [string, string];
}

const defaultTransformValue = <T extends any>(value: T): string | number =>
  typeof value === "number" ? round(value, 2) : String(value);

export const ValuesTable = <T extends {}>({
  data = [],
  transformKey = proper,
  transformValue = defaultTransformValue,
  labels = ["Property", "Value"],
}: Props<T>) => {
  const entries = Array.isArray(data) ? data : typedEntries(data);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="col">
            {labels[0]}
          </TableCell>
          <TableCell component="th" scope="col">
            {labels[1]}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {entries.map(([key, value]) => (
          <TableRow key={key}>
            <TableCell component="th" scope="row">
              {transformKey(key)}
            </TableCell>
            <TableCell>{transformValue(value)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
