import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { percentString } from "lib";
import { TestResults } from "logic/classification/accuracy/metrics";

/**
 * displays the count and percent for each of the four possible results
 */
export const ResultCounts = ({
  falsePositives,
  truePositives,
  trueNegatives,
  falseNegatives,
  total,
}: TestResults & { total?: number }) => {
  const sum =
    total || falsePositives + truePositives + falseNegatives + trueNegatives;

  const percent = (n: number): string => `${n} - ${percentString(n / sum, 2)}`;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="col">
            Type
          </TableCell>
          <TableCell component="th" scope="col">
            Count
          </TableCell>
          <TableCell component="th" scope="col">
            Percent
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">
            True Positives
          </TableCell>
          <TableCell>{truePositives}</TableCell>
          <TableCell>{percent(truePositives)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            False Positives
          </TableCell>
          <TableCell>{falsePositives}</TableCell>
          <TableCell>{percent(falsePositives)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            True Negatives
          </TableCell>
          <TableCell>{trueNegatives}</TableCell>
          <TableCell>{percent(trueNegatives)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">
            False Negatives
          </TableCell>
          <TableCell>{falseNegatives}</TableCell>
          <TableCell>{percent(falseNegatives)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
