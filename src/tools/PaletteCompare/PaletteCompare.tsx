import React from "react";
import { MultiSelectModel, Title, Tool } from "components";
import { randomModels } from "logic";
import { ModelPalette } from "./ModelPalette";

/**
 * this does work, but selecting too many leads to a call stack size exceeded error
 * reduced from 1000 (10^3) per to 512 (8^3) per
 */
export const PaletteCompareTool = () => (
  <Tool
    initialSettings={{ models: randomModels(2) }}
    RenderControls={({ state, update }) => (
      <MultiSelectModel
        value={state.models}
        onChange={(v) => update({ models: v })}
      />
    )}
    RenderContents={({ models, width }) => (
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
    )}
  />
);
