import React from "react";
import {BaseField} from "./BaseField";
import {GenericProps} from "./types";
import {isDefined, isUndefined} from "../../lib";

export interface ExtraProps {
    isInt?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

const convertValue = (v: string, isInt: boolean = false): number => {
    const num = isInt ? parseInt(v, 10) : parseFloat(v);
    //don't want to return NaN
    return isNaN(num) ? 0 : num;
}

/**
 * any props can be passed via inputProps, but pass though min/max/step directly because they are important
 */

export const NumberInput = ({value, onChange, isInt, min, max, step, ...props}: GenericProps<number> & ExtraProps) => (
    <BaseField
        {...props}
        value={value}
        onChange={(v, e) => onChange(convertValue(v, isInt), e)}
        inputProps={{
            type: "number",
            step: isInt && isUndefined(step) ? 1 : step,
            max,
            min
        }}
    />
);

export default NumberInput;
