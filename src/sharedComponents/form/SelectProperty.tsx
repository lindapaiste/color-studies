import {ColorPropKey} from "../../properties/types";
import {getTitle, propertyKeys} from "../../properties";
import React, {ChangeEvent} from "react";

export interface Props {
    slug: ColorPropKey | undefined | null;
    onChange: (key: ColorPropKey,  e: ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectProperty = ({slug, onChange}: Props) => (
    <select
        value={slug || ''}
        onChange={e => onChange(e.target.value as ColorPropKey, e)}
    >
        {propertyKeys.map(key => (
            <option key={key} value={key}>{getTitle(key)}</option>
        ))}
    </select>
);
