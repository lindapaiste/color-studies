import React from "react";
import { ConfusionMatrix } from "logic/classification/accuracy/ConfusionMatrix";
import { ValuesTable } from "../molecules";

/**
 * displays a table with the names and values of the specified metrics
 *
 * don't need to individually type out everything.
 * can specify the metrics by their property name and loop through to print them
 * properties have descriptive names, so can use lodash functions to transform to a title
 */
export const ResultMetrics = ({
  results,
  metrics,
}: {
  results: ConfusionMatrix;
  metrics: Array<keyof ConfusionMatrix>;
}) => {
  const data: [keyof ConfusionMatrix, number | string][] = metrics.map(
    (property) => [
      property,
      // for for divide by 0 errors when some of the groups have no entries
      // fixes Warning: Received NaN for the `children` attribute. If this is expected, cast the value to a string.
      Number.isNaN(results[property]) ? "--" : results[property],
    ]
  );

  return <ValuesTable data={data} labels={["Metric", "Value"]} />;
};
