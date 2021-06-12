import React, { ReactNode } from "react";
import {
  IGetGroupedResults,
  ResultType,
  TestOutput,
} from "logic/classification/types";
import { ColorSet, ColorSetProps, Title } from "components/index";
import { ColorAdapter } from "logic";

/**
 * breaks a results object into four separate ColorSet components
 * pass in a resultToTooltip prop to handle custom tooltip
 * any other props get passed down to ColorSet
 */

export interface Props<R extends TestOutput<ColorAdapter>> {
  results: IGetGroupedResults<R>;

  // ColorSet: ComponentType<{ results: R[] }>;
  resultToTooltip?(result: R): NonNullable<ReactNode>;
}

export const RenderResultGroups = <R extends TestOutput<ColorAdapter>>({
  results,
  resultToTooltip,
  ...props
}: Props<R> & Partial<ColorSetProps<R>>) => {
  const getGroupProps = (group: ResultType) => ({
    ...props,
    colors: results.getResults(group),
    colorToHex: (r: R) => r.value.hex(),
    colorToTooltip: resultToTooltip,
    wrap: true,
  });

  return (
    <div>
      <Title importance="h3">True Positives</Title>
      <ColorSet {...getGroupProps("truePositives")} />
      <Title importance="h3">False Positives</Title>
      <ColorSet {...getGroupProps("falsePositives")} />
      <Title importance="h3">True Negatives</Title>
      <ColorSet {...getGroupProps("trueNegatives")} />
      <Title importance="h3">False Negatives</Title>
      <ColorSet {...getGroupProps("falseNegatives")} />
    </div>
  );
};
