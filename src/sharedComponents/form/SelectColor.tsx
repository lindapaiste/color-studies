import React, {ComponentType} from "react";
import {ColorAdapter, I_ColorAdapter, randomColor} from "../../packages/color-adapter";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import LoopIcon from "@material-ui/icons/Loop";
import TextField from "@material-ui/core/TextField";
import {BaseField} from "./BaseField";
import {GenericProps, WithoutE} from "./types";

/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 */

export interface ExtraProps {
    width?: number;
    height?: number;
}

/**
 * need to remove the second parameter e: ChangeEvent from the callback
 * so that it can be called by randomize button
 */
export type Props<T> = ExtraProps & WithoutE<GenericProps<T>>

export const SelectHex = ({value, onChange, width = 100, height = 40, ...props}: Props<string>) => (
    <BaseField
        {...props}
        value={value}
        onChange={onChange}
        inputProps={{
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

export const SelectColor = ({value, onChange, ...props}: Props<I_ColorAdapter>) => (
    <SelectHex
        {...props}
        value={value ? value.hex() : undefined}
        onChange={hex => onChange(new ColorAdapter(hex))}
    />
);

/**
 * HOC adds a randomize color icon button after the select
 */
export const withRandomize = (Component: ComponentType<Props<I_ColorAdapter>>) =>
    (props: Props<I_ColorAdapter>) => (
    <div>
        <Component {...props} />
        <Tooltip title="Randomize Color">
            <IconButton onClick={() => props.onChange(randomColor())}>
                <LoopIcon/>
            </IconButton>
        </Tooltip>
    </div>
);

export const SelectRandomizeColor = withRandomize(SelectColor);
