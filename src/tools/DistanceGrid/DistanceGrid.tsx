import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { DeltaECalculator } from "logic/difference/types";
import { round } from "lib";
import { ColorAdapter } from "logic";

/**
 * takes an array of colors and compares each one to all of the others
 */

export interface Props {
  calculator: DeltaECalculator;
  colors: ColorAdapter[];
}

/**
 * renders the deltaE number next to the two colors, vertically stacked
 */
export const DistanceCell = ({
  a,
  b,
  calculator,
}: {
  a: ColorAdapter;
  b: ColorAdapter;
  calculator: DeltaECalculator;
}) => {
  const deltaE = round(calculator.getDeltaE(a, b), 2);
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: 50,
        }}
      >
        {deltaE}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            backgroundColor: a.hex(),
            flex: 1,
          }}
        />
        <div
          style={{
            backgroundColor: b.hex(),
            flex: 1,
          }}
        />
      </div>
    </div>
  );
};

/**
 * can do a simple render of deltaEs using DataTable, but need to use root table elements in order to have custom background colors
 */
export const DistanceGrid = ({ colors, calculator }: Props) => {
  const label = (hex: string) => (
    <TableCell key={hex} style={{ backgroundColor: hex }}>
      {hex}
    </TableCell>
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          {colors.map((color) => label(color.hex()))}
        </TableRow>
      </TableHead>
      <TableBody>
        {colors.map((color) => (
          <TableRow key={color.hex()}>
            {label(color.hex())}
            {colors.map((c) => (
              <TableCell key={c.hex()}>
                <DistanceCell a={c} b={color} calculator={calculator} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
