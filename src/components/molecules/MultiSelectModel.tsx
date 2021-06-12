import React from "react";
import { ColorSpaceName } from "logic/colorspaces/types";
import { allModels, getModelFromKey } from "logic/colorspaces/models";
import { ModelAdapter } from "logic/colorspaces/ModelAdapter";
import { MultiSelect, UserProps } from "./MultiSelect";

export const MultiSelectModel = (
  props: UserProps<ModelAdapter<ColorSpaceName>>
) => (
  <MultiSelect
    id="multi-select-model"
    label="Color Spaces"
    options={allModels()}
    keyToObject={getModelFromKey}
    {...props}
  />
);
