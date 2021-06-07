import React from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { GenericProps } from "./types";

/**
 * base element can accept any string, number, or undefined as the value
 * but the onChange is based on e.target.value which is always a string
 * prop variant is no longer required
 */
export type FieldProps = Partial<Omit<TextFieldProps, "onChange">> &
  Pick<GenericProps<string>, "onChange">;

/**
 * basically just maps the onChange and adds variant = outlined
 *
 * this set up is designed for setting of input props from one level up ( ie. NumberInput, SelectColor )
 * but not passing input props from specific instances of those components
 */

export const Field = ({ value, onChange, ...props }: FieldProps) => (
  <TextField
    variant="outlined"
    {...props}
    value={value}
    onChange={(e) => onChange(e.target.value, e)}
  />
);
