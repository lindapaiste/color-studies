import {ColorSpaceName} from "../../spacesChannels/types";
import {allModels, getModelFromKey} from "../../spacesChannels/models";
import React from "react";
import {ModelAdapter} from "../../spacesChannels/ModelAdapter";
import MultiSelect, {UserProps} from "./MultiSelect";

export const MultiSelectModel = (props: UserProps<ModelAdapter<ColorSpaceName>>) => (
    <MultiSelect
        id={"multi-select-model"}
        label={"Color Spaces"}
        options={allModels()}
        keyToObject={getModelFromKey}
        {...props}
    />
);

export default MultiSelectModel;
