import React, { ChangeEvent } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export interface BaseProps<T> {
  value: T | undefined;
  onChange( value: T, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void;
}

export type WithTextFieldProps<T> = T & Omit<TextFieldProps, keyof T>;

/**
 * basically just maps the onChange and adds variant = outlined
 */

export const BaseField = <T extends any>({value, onChange, inputProps = {}, ...props}: WithTextFieldProps<BaseProps<string>>) => (
  <TextField
    variant="outlined"
    {...props}
    value={value}
    onChange={e => onChange(e.target.value, e)}
    inputProps={{
      ...inputProps,
    }}
  />
);
