import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  conditionalsKeys,
  I_ConfusionMatrix,
  scoresKeys,
  TestResults,
} from "../../classifier/ConfusionMatrix";
import { ValuesTable } from "../../sharedComponents/ui/ValuesTable";
import { Accordion } from "../../sharedComponents/ui";
import { percentString } from "../../lib";

/**
 * contains multiple UI components for displaying all or part of the I_ConfusionMatrix interface
 */

export const ExpandableConfusionMatrix = ({
  results,
}: {
  results: I_ConfusionMatrix;
}) => {
  return (
    <>
      <Accordion title="Results Matrix">
        <Render2x2ResultsMatrix {...results} />
      </Accordion>

      <Accordion
        title={"Accuracy: " + percentString(results.balancedAccuracy, 1)}
      >
        <RenderMetrics
          results={results}
          metrics={[...conditionalsKeys, ...scoresKeys]}
        />
      </Accordion>
    </>
  );
};

/**
 * displays a table with the names and values of the specified metrics
 *
 * don't need to individually type out everything.
 * can specify the metrics by their property name and loop through to print them
 * properties have descriptive names, so can use lodash functions to transform to a title
 */
export const RenderMetrics = ({
  results,
  metrics,
}: {
  results: I_ConfusionMatrix;
  metrics: Array<keyof I_ConfusionMatrix>;
}) => {
  const data: [keyof I_ConfusionMatrix, number][] = metrics.map((property) => [
    property,
    results[property],
  ]);

  return <ValuesTable data={data} labels={["Metric", "Value"]} />;
};

/**
 * displays the count and percent for each of the four possible results
 */
export const RenderCounts = ({
  falsePositives,
  truePositives,
  trueNegatives,
  falseNegatives,
  total,
}: TestResults & { total?: number }) => {
  const sum = total || falsePositives + truePositives + falseNegatives + trueNegatives;

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

/**
 * displays the four possible results in a grid, along with their sums
 */
export const Render2x2ResultsMatrix = ({
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
