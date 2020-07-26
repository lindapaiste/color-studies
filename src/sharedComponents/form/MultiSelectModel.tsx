import {GenericProps, WithoutE} from "./types";
import {ColorSpaceName} from "../../spacesChannels/types";
import {Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select} from "@material-ui/core";
import {allModels, getModel} from "../../spacesChannels/models";
import React from "react";
import {ModelAdapter} from "../../spacesChannels/ModelAdapter";
import CheckboxInput from "./CheckboxInput";


export type Props = WithoutE<GenericProps<ModelAdapter<ColorSpaceName>[]>> & {
    selectAll?: boolean;
}

export const MultiSelectModel = ({value, onChange, label = "Color Spaces", selectAll = true, ...props}: Props) => {
    const selectedNames = (value || []).map(model => model.name);

    //could lookup model in renderValue rather than using toUpperCase
    return (
        <div style={{display: "flex"}}>
            <FormControl>
                <InputLabel id="multi-select-model">{label}</InputLabel>
                <Select
                    {...props}
                    multiple={true}
                    label={label}
                    labelId="multi-select-model"
                    value={selectedNames}
                    variant="outlined"
                    onChange={(e) => onChange((e.target.value as ColorSpaceName[] || []).map(getModel))}
                    renderValue={(names) => (
                        <div>
                            {(names as ColorSpaceName[]).map(name => (
                                <Chip key={name} label={name.toUpperCase()}/>
                            ))}
                        </div>
                    )}
                    style={{
                        minWidth: 175,
                        flex: 1,
                    }}
                >
                    {allModels().map(model => (
                        <MenuItem key={model.key} value={model.name}>
                            <Checkbox checked={selectedNames.indexOf(model.name) > -1}/>
                            <ListItemText primary={model.title}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectAll &&
            <CheckboxInput
                label={"Select All"}
                value={value?.length === allModels().length}
                onChange={(checked) => {
                    if (checked) {
                        onChange(allModels());
                    } else {
                        onChange([]);
                    }
                }}
            />
            }
        </div>
    )
};

export default MultiSelectModel;
