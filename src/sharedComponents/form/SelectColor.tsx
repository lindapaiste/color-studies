import React, { ChangeEvent, ComponentType } from "react";
import {
  ColorAdapter,
  I_ColorAdapter,
  randomColor
} from "../../packages/color-adapter";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LoopIcon from "@material-ui/icons/Loop";
import TextField from "@material-ui/core/TextField";
import { WithTextFieldProps } from "./NumberInput";
/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 */

export interface OwnProps<T> {
  color: T | undefined;
  width?: number;
  height?: number;
  /**
   * removed the second parameter e: ChangeEvent from the callback
   * so that it could be called by randomize button
   */
  onChange(color: T): void;
}

export type Props<T> = WithTextFieldProps<OwnProps<T>>;

export const SelectHex = ({
  color,
  onChange,
  width = 100,
  height = 40,
  inputProps = {},
  ...props
}: Props<string>) => (
  <TextField
    variant="outlined"
    {...props}
    value={color}
    onChange={e => onChange(e.target.value)}
    inputProps={{
      ...inputProps,
      type: "color",
      style: {
        width,
        height,
        padding: 5
      }
    }}
  />
);

/**
 * SelectColor passes through to SelectHex since the base HTML element uses hex
 */

export const SelectColor = ({
  color,
  onChange,
  ...props
}: Props<I_ColorAdapter>) => (
  <SelectHex
    {...props}
    color={color ? color.hex() : undefined}
    onChange={hex => onChange(new ColorAdapter(hex))}
  />
);

export const withRandomize = (
  Component: ComponentType<Props<I_ColorAdapter>>
): ComponentType<Props<I_ColorAdapter>> => props => (
  <div>
    <Component {...props} />
    <Tooltip title="Randomize Color">
      <IconButton onClick={() => props.onChange(randomColor())}>
        <LoopIcon />
      </IconButton>
    </Tooltip>
  </div>
);

export const SelectRandomizeColor = withRandomize(SelectColor);
