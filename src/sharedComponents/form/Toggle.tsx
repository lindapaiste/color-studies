import React, {ComponentType, ReactNode} from 'react';
import MSwitch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {GenericProps} from "./types";

interface LabelProps {
    labelPlacement?: "top" | "bottom" | "start" | "end";
    label?: ReactNode;
}

/**
 * Radio, Switch, and Checkbox work with the FormControlLabel component
 * this HOC wraps in FormControlLabel only if prop label is set
 */
export const withMaybeLabel = <P extends {}>(Component: ComponentType<P>): ComponentType<P & LabelProps> =>
    (props) => {
        return ( props.label ) ? <FormControlLabel
            control={<Component {...props}/>}
            label={props.label}
            labelPlacement={props.labelPlacement}
        /> : <Component {...props} />;
    }

export type Props = GenericProps<boolean> & LabelProps;

const _Unlabeled = ({value, onChange, ...props}: Props) => (
    <MSwitch
        {...props}
        value={value}
        onChange={e => onChange(e.target.checked, e)}
    />
);

export const Toggle = withMaybeLabel(_Unlabeled);
