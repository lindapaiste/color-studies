import React from "react";
import { createTool, MultiSelectModel, Title } from "components";
import { randomModels } from "logic";
import { ModelPalette } from "./ModelPalette";

/**
 * this does work, but selecting too many leads to a call stack size exceeded error
 * reduced from 1000 (10^3) per to 512 (8^3) per
 */
export default createTool(
  { models: randomModels(2) },
  ({ state, update }) => (
    <MultiSelectModel
      value={state.models}
      onChange={(v) => update({ models: v })}
    />
  ),
  ({ models, width }) => (
    <div>
      {models.map((model) => (
        <div key={model.key}>
          <Title>{model.title}</Title>
          <ModelPalette
            width={width}
            model={model}
            totalCount={512}
            perRow={32}
          />
        </div>
      ))}
    </div>
  )
);
