import React from "react";
import { Title } from "components";
import { StitchedGradient } from "logic/gradient/StitchedGradient";
import { Props } from "./GradientCompareTool";
import { RenderGradientSet } from "./RenderGradientSet";

export const GradientModelCompare = ({
  models = [],
  count = 10,
  ...props
}: Props) => (
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
