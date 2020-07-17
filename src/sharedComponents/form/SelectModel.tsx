import React from "react";
import {ColorSpaceName} from "../../spacesChannels/types";
import {COLOR_SPACE_NAMES} from "../../spacesChannels/colorSpaces";
import MenuItem from "@material-ui/core/MenuItem";
import {GenericProps} from "./types";
import {BaseField} from "./BaseField";
import {Option} from "./Option";

type Props = GenericProps<ColorSpaceName>

export const SelectModel = ({value, onChange, label = "Color Space"}: Props) => (
    <BaseField
        select
        label={label}
        value={value}
        onChange={onChange} //(v, e) => onChange(v as ColorSpaceName, e)
    >
        {COLOR_SPACE_NAMES.map(name => (
            <Option key={name} value={name} label={name}/>
        ))}
    </BaseField>
);
