import {ColorClassification} from "../../grouping/types";
import {getFromName, GROUPINGS} from "../../grouping/group-data";
import React, {ChangeEvent} from "react";

export interface Props {
    name: string | undefined | null;
    onChange(group: ColorClassification, e: ChangeEvent<HTMLSelectElement>): void;
}

export const SelectGroup = ({name, onChange}: Props) => {
    return (
        <select value={name || ''} onChange={e => {
            const object = getFromName(e.target.value);
            if (object) {
                onChange(object, e);
            }
        }}>
            {GROUPINGS.map(o => (
                <option key={o.name} value={o.name}>{o.name}</option>
            ))}
        </select>
    )
};

