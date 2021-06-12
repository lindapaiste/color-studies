import React from "react";
import { MenuItem as Option } from "@material-ui/core";
import { COLOR_SPACE_NAMES } from "logic/colorspaces/colorSpaces";
import { ColorSpaceName } from "logic/colorspaces/types";
import { GenericProps } from "./types";
import { Field } from "./Field";

type Props = GenericProps<ColorSpaceName>;

/**
 * can use Field for most consistent styling, but select multiple requires using the Select component
 * can get options from objects or from names, but still rely on toUpperCase if using a custom renderValue in multi select
 */
export const SelectModel = ({
  value,
  onChange,
  label = "Color Space",
  ...props
}: Props) => (
  <Field
    {...props}
    select
    label={label}
    value={value}
    onChange={(v, e) => {
      console.log(v, e);
      onChange(v as ColorSpaceName, e);
    }}
  >
    {COLOR_SPACE_NAMES.map((name) => (
      <Option key={name} value={name}>
        {name.toUpperCase()}
      </Option>
    ))}
  </Field>
);

export default SelectModel;
