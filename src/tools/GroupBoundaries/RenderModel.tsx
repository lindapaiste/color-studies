import { Typography } from "@material-ui/core";
import React from "react";
import { round } from "lib";
import { ExpandableConfusionMatrix, Title } from "components";
import { ChannelBoundaryModel } from "logic/classification/model/boundary/ChannelBoundaryModel";
import { ConfusionMatrix } from "logic/classification/accuracy/ConfusionMatrix";
import { ChannelAdapter } from "logic/colorspaces/ChannelAdapter";

/**
 * Render a single model.
 * Shows the boundary value and it's test results.
 */

export interface TestedBoundaryModel {
  model: ChannelBoundaryModel;
  accuracy: ConfusionMatrix;
  channel: ChannelAdapter;
}

export const RenderModel = ({
  model,
  accuracy,
  channel,
}: TestedBoundaryModel) => (
  <div key={channel.key}>
    <Title importance="h3">{channel.title}</Title>
    <Typography>
      {model.isGreater ? "Greater" : "Less"} than {round(model.cutoff, 2)}
    </Typography>
    <Typography>
      Positive Predictive Value: {round(accuracy.positivePredictiveValue, 2)}
    </Typography>
    <Typography>
      Negative Predictive Value: {round(accuracy.negativePredictiveValue, 2)}
    </Typography>
    <ExpandableConfusionMatrix results={accuracy} />
  </div>
);
