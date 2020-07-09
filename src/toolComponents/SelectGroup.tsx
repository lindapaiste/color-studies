import {ColorClassification} from "../grouping/types";
import {getFromName, GROUPINGS} from "../grouping/group-data";
import React from "react";

export const SelectGroup = ({name, onChange}: { name: string | undefined | null, onChange: (group: ColorClassification) => void }) => {
    return (
        <select value={name || ''} onChange={e => {
            const object = getFromName(e.target.value);
            if (object) {
                onChange(object);
            }
        }}>
            {GROUPINGS.map(o => (
                <option key={o.name} value={o.name}>{o.name}</option>
            ))}
        </select>
    )
};

