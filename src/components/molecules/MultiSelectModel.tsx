import React from "react";
import { allModels, ColorSpaceName, getModel, ModelAdapter } from "logic";
import { MultiSelect, UserProps } from "./MultiSelect";

export const MultiSelectModel = (props: UserProps<ModelAdapter>) => (
  <MultiSelect
    id="multi-select-model"
    label="Color Spaces"
    options={allModels()}
    keyToObject={(key) => getModel(key as ColorSpaceName)}
    {...props}
  />
);
