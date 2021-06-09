import React from "react";
import { ColorSpaceName } from "logic/spacesChannels/types";
import { allModels, getModelFromKey } from "logic/spacesChannels/models";
import { ModelAdapter } from "logic/spacesChannels/ModelAdapter";
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
