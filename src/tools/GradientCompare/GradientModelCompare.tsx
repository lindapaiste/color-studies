import React from "react";
import { Title } from "components";
import { StitchedGradient } from "logic/gradient/StitchedGradient";
import { RenderGradientSet } from "./RenderGradientSet";
import { Settings } from "./GradientCompareControls";

export const GradientModelCompare = ({
  models = [],
  count = 10,
  ...props
}: Settings) => (
  <div>
    {models.map((model) => (
      <div key={model.key}>
        <Title importance="h3">{model.title}</Title>
        <RenderGradientSet
          gradient={
            new StitchedGradient({
              ...props,
              model,
            })
          }
          count={count}
        />
      </div>
    ))}
  </div>
);
