import React, { ComponentType, ReactNode } from "react";
import { FormControlLabel, Switch } from "@material-ui/core";
import { GenericProps } from "./types";

interface LabelProps {
  labelPlacement?: "top" | "bottom" | "start" | "end";
  label?: ReactNode;
}

/**
 * Radio, Switch, and Checkbox work with the FormControlLabel component
 * this HOC wraps in FormControlLabel only if prop label is set
 */
export const withMaybeLabel =
  <P extends {}>(Component: ComponentType<P>): ComponentType<P & LabelProps> =>
  (props) =>
    // eslint-disable-next-line react/destructuring-assignment
    props.label ? (
      <FormControlLabel
        control={<Component {...props} />}
        // eslint-disable-next-line react/destructuring-assignment
        label={props.label}
        // eslint-disable-next-line react/destructuring-assignment
        labelPlacement={props.labelPlacement}
      />
    ) : (
      <Component {...props} />
    );

export type Props = GenericProps<boolean> & LabelProps;

const Unlabeled = ({ value, onChange, ...props }: Props) => (
  <Switch
    {...props}
    value={value}
    onChange={(e) => onChange(e.target.checked, e)}
  />
);

export const Toggle = withMaybeLabel(Unlabeled);
