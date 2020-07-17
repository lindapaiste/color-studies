import MenuItem from "@material-ui/core/MenuItem";
import React, { ReactNode } from "react";

export interface _Props {
  value: string | number;
  label: string | number | ReactNode;
}

/**
 * right now does not work. need to use MenuItem directly.
 * could probably fix by forwarding ref
 */

export const _Option = ({ value, label }: _Props) => (
  <MenuItem value={value}>{label}</MenuItem>
);

export const Option = MenuItem;
