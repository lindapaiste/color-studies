import React, { ChangeEvent } from "react";
import { ColorSpaceName } from "../../spacesChannels/types";
import { COLOR_SPACE_NAMES } from "../../spacesChannels/colorSpaces";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

export interface Props {
  value: ColorSpaceName | undefined | null;

  onChange(model: ColorSpaceName, e: ChangeEvent<HTMLSelectElement>): void;
}

export const SelectModel = ({ value, onChange }: Props) => (
  <TextField
    id="select-color-space"
    select
    label="Color Space"
    value={value || ""}
    onChange={e => onChange(e.target.value as ColorSpaceName, e)}
    variant="outlined"
    helperText="Select Color Space"
  >
    {COLOR_SPACE_NAMES.map(name => (
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    ))}
  </TextField>
);
