import React, { ReactNode } from "react";
import { LabelAndConfidence } from "logic/classification/model/neural/NeuralNetwork";
import { Accordion, DataTable } from "../molecules";

export interface Props {
  /**
   * Expects that predictions are already in descending order.
   */
  predictions: LabelAndConfidence[];

  /**
   * Take the title as a prop because it might be either the expected group
   * or the predicted group.
   */
  title?: ReactNode;
}

export const ExpandablePredictions = ({ predictions, title }: Props) => (
  <Accordion title={title ?? `Predicted: ${predictions[0]?.label}`}>
    <DataTable
      labels={["Label", "Confidence"]}
      rows={predictions.map(({ label, confidence }) => [label, confidence])}
    />
  </Accordion>
);
