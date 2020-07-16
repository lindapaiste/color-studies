import React, {ChangeEvent} from "react";
import {ColorSpaceName} from "../../spacesChannels/types";
import {COLOR_SPACE_NAMES} from "../../spacesChannels/colorSpaces";

export interface Props {
    value: ColorSpaceName | undefined | null;

    onChange(model: ColorSpaceName, e: ChangeEvent<HTMLSelectElement>): void;
}

export const SelectModel = ({value, onChange}: Props) => (
    <select
        value={value || ''}
        onChange={e => onChange(e.target.value as ColorSpaceName, e)}
    >
        {COLOR_SPACE_NAMES.map(name => (
            <option key={name} value={name}>{name}</option>
        ))}
    </select>
);
