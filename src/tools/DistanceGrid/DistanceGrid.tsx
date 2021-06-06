import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { I_DeltaECalculator } from "../../difference/types";
import { round } from "../../lib";
import { I_ColorAdapter } from "../../color/types";

/**
 * takes an array of colors and compares each one to all of the others
 */

export interface Props {
  calculator: I_DeltaECalculator;
  colors: I_ColorAdapter[];
}

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
        <TableCell />
        {colors.map((color) => label(color.hex()))}
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

/**
 * renders the deltaE number next to the two colors, vertically stacked
 */
export const DistanceCell = ({
  a,
  b,
  calculator,
}: {
  a: I_ColorAdapter;
  b: I_ColorAdapter;
  calculator: I_DeltaECalculator;
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
