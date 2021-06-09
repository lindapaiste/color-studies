import React, { useMemo, useState } from "react";
import { groupBy, partition } from "lib";
import { GroupedHex } from "logic/classification/types";
import { LabelAndConfidence } from "logic/classification/model/neural/NeuralNetwork";
import { allGroupNames } from "data";
import { ColorSet } from "../molecules";
import { ExpandablePredictions } from "./ExpandablePredictions";

export type Result = GroupedHex & { predictions: LabelAndConfidence[] };
export type Results = Result[];
/**
 * Each group controls its own expandable details
 */
export const PredictionsGroupSection = ({
  results,
  group,
}: {
  results: Results;
  group: string;
}) => {
  const [selected, setSelected] = useState<Result>();

  const [correct, incorrect] = useMemo(
    () => partition(results, (r) => r.group === group),
    [results]
  );

  return (
    <div>
      <h2>{group}</h2>
      <h3>True Positives</h3>
      <ColorSet<Result>
        colors={correct}
        colorToHex={(c) => c.hex}
        onClickColor={setSelected}
        height={40}
        wrap
      />
      <h3>False Positives</h3>
      <ColorSet<Result>
        colors={incorrect}
        colorToHex={(c) => c.hex}
        onClickColor={setSelected}
        height={40}
        wrap
      />
      {selected !== undefined && (
        <ExpandablePredictions
          predictions={selected.predictions}
          title={`Expected: ${selected.group}`}
        />
      )}
    </div>
  );
};
/**
 * Sort predictions based on the group that they were assigned to by the model.
 */
export const PredictionsByGroup = ({ results }: { results: Results }) => {
  const groupedPredictions = groupBy(results, (r) => r.predictions[0].label);

  return (
    <div>
      {allGroupNames().map((group) => (
        <PredictionsGroupSection
          results={groupedPredictions[group]}
          group={group}
        />
      ))}
    </div>
  );
};
