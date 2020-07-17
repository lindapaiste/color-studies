import React, { ChangeEvent } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export interface Props {
  value: number | undefined;
  onChange(
    n: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void;
  isInt?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export type WithTextFieldProps<T> = T & Omit<TextFieldProps, keyof T>;

/**
 * any props can be passed via inputProps, but pass though min/max/step directly because they are important
 */

export const NumberInput = ({value, onChange, isInt, min, max, step, inputProps = {}, ...props}: WithTextFieldProps<Props>) => (
  <TextField
    variant="outlined"
    {...props}
    value={value}
    onChange={e =>
      onChange(isInt ? parseInt(e.target.value, 10) : parseFloat(e.target.value), e)
    }
    inputProps={{
      ...inputProps,
      type: "number",
      step,
      max,
      min
    }}
  />
);
