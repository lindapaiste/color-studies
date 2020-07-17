import React from "react";
import {ChannelAccessor} from "../../spacesChannels/types";
import {ALL_ACCESSORS} from "../../spacesChannels/colorSpaces";
import {BaseField} from "./BaseField";
import {GenericProps} from "./types";
import {accessorKey, accessorTitle, keyToAccessor} from "../../spacesChannels/accessorConversion";
import {Option} from "./Option";

/**
 * here, the accessor tuple is the value
 * same property from different color space is a different option & value
 */

export const SelectAccessor = ({value, onChange, ...props}: GenericProps<ChannelAccessor>) => (
    <BaseField
        label="Channel"
        {...props}
        select
        value={value ? accessorKey(value) : undefined}
        onChange={(key, e) => onChange(keyToAccessor(key), e)}
    >
        {ALL_ACCESSORS.map((accessor) => (
            <Option
                key={accessorKey(accessor)}
                value={accessorKey(accessor)}
                label={accessorTitle(accessor)}
            />
        ))}
    </BaseField>
);
