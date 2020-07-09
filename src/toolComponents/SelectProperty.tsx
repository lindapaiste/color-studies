import {ColorPropKey} from "../properties/types";
import {getTitle, propertyKeys} from "../properties";
import React from "react";

export const SelectProperty = ({slug, onChange}: { slug: ColorPropKey | undefined | null, onChange: (key: ColorPropKey) => void }) => (
    <select
        value={slug || ''}
        onChange={e => onChange(e.target.value as ColorPropKey)}
    >
        {propertyKeys.map(key => (
            <option value={key}>{getTitle(key)}</option>
        ))}
    </select>
);
