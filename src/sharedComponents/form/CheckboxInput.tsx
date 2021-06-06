import React from "react";
import { Checkbox } from "@material-ui/core";
import { withMaybeLabel } from "./Toggle";
import { GenericProps } from "./types";

export const CheckboxInput = withMaybeLabel(
  ({ value, onChange }: GenericProps<boolean>) => (
    <Checkbox checked={value} onChange={(e, checked) => onChange(checked, e)} />
  )
);

export default CheckboxInput;
