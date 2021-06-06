import React from "react";
import { ColorSpaceName } from "../../spacesChannels/types";
import { GenericProps } from "./types";
import { BaseField } from "./BaseField";
import { Option } from "./Option";
import { COLOR_SPACE_NAMES } from "../../spacesChannels/colorSpaces";

type Props = GenericProps<ColorSpaceName>;

/**
 * can use BaseField for most consistent styling, but select multiple requires using the Select component
 * can get options from objects or from names, but still rely on toUpperCase if using a custom renderValue in multi select
 */
export const SelectModel = ({
  value,
  onChange,
  label = "Color Space",
  ...props
}: Props) => (
  <BaseField
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
  </BaseField>
);

export default SelectModel;
