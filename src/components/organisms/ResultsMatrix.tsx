import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { TestResults } from "logic/classification/accuracy/metrics";

/**
 * displays the four possible results in a grid, along with their sums
 */
export const ResultsMatrix = ({
  falsePositives,
  truePositives,
  trueNegatives,
  falseNegatives,
}: TestResults) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell component="th" scope="col" />
        <TableCell component="th" scope="col">
          Predicted True
        </TableCell>
        <TableCell component="th" scope="col">
          Predicted False
        </TableCell>
        <TableCell component="th" scope="col">
          Sum
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
          Actual True
        </TableCell>
        <TableCell className="correct-cell">{truePositives}</TableCell>
        <TableCell className="incorrect-cell">{falseNegatives}</TableCell>
        <TableCell>{truePositives + falseNegatives}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Actual False
        </TableCell>
        <TableCell className="incorrect-cell">{falsePositives}</TableCell>
        <TableCell className="correct-cell">{trueNegatives}</TableCell>
        <TableCell>{trueNegatives + falsePositives}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Sum
        </TableCell>
        <TableCell>{truePositives + falsePositives}</TableCell>
        <TableCell>{trueNegatives + falseNegatives}</TableCell>
        <TableCell>
          {truePositives + falsePositives + trueNegatives + falseNegatives}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
