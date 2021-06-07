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
  const data: [keyof ConfusionMatrix, number][] = metrics.map((property) => [
    property,
    results[property],
  ]);

  return <ValuesTable data={data} labels={["Metric", "Value"]} />;
};
