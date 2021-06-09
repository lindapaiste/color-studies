import React from "react";
import { percentString } from "lib";
import { ConfusionMatrix } from "logic/classification/accuracy/ConfusionMatrix";
import {
  conditionalsKeys,
  scoresKeys,
} from "logic/classification/accuracy/metrics";
import { ResultsMatrix } from "./ResultsMatrix";
import { ResultMetrics } from "./ResultMetrics";
import { Accordion } from "../molecules";

/**
 * contains multiple UI components for displaying all or part of the ConfusionMatrix interface
 */

export const ExpandableConfusionMatrix = ({
  results,
}: {
  results: ConfusionMatrix;
}) => (
  <>
    <Accordion title="Results Matrix">
      <ResultsMatrix {...results} />
    </Accordion>

    <Accordion
      title={`Accuracy: ${percentString(results.balancedAccuracy, 1)}`}
    >
      <ResultMetrics
        results={results}
        metrics={[...conditionalsKeys, ...scoresKeys]}
      />
    </Accordion>
  </>
);
