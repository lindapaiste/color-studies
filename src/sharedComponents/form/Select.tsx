/**
 * takes options as a prop rather than as children
 */
import {GenericProps, Option} from "./types";
import TextField from "@material-ui/core/TextField";
import {ColorSpaceName} from "../../spacesChannels/types";
import {COLOR_SPACE_NAMES} from "../../spacesChannels/colorSpaces";
import MenuItem from "@material-ui/core/MenuItem";
import React, {useEffect, useState} from "react";
import {BaseField, BaseProps} from "./BaseField";

export type Props<T> = GenericProps<T> & {
    options: Option<T>[];
}

/**
 * problem: what is the passed-down value?
 * does it match o.raw?  o.key?
 */

export const Select = <T extends any>({ value, onChange, options }: Props<T>) => {
    const [selectedOption, setSelectedOption] = useState<Option<T> | undefined>(options.find( o => o.raw === value));

    const stringFromValue = () => {
        const opt = options.find( o => o.raw === value); //use of === could create problems if o.raw is an object that gets re-created
        return opt ? opt.key : undefined;
    }

    const [string, setString] = useState(stringFromValue());

    //respond to external changes
    useEffect( () => setString(stringFromValue()), [value] );


    const _onChange: BaseProps['onChange'] = (key, e) => {
        const option = options.find(o => o.key === key);
        if ( option ) {
            onChange(option.raw, e);
        }
    }

    return (
        <BaseField
            select={true}
            value={selectedOption ? selectedOption.key : undefined}
            onChange={key => setSelectedOption(options.find(o => o.key === key))}
        >
            {COLOR_SPACE_NAMES.map(name => (
                <MenuItem key={name} value={name}>
                    {name}
                </MenuItem>
            ))}
        </BaseField>
    );
}
