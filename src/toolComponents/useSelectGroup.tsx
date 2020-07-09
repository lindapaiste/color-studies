import {ColorClassification} from "../grouping/types";
import React, {FunctionComponent, useState} from "react";
import {getFromName, GROUPINGS} from "../grouping/group-data";
import {SelectGroup} from "./SelectGroup";
import {UseFormTuple} from "./types";

/**
 * stores the group locally
 *
 * returns a tuple with the group object and the Select component,
 * which no longer requires any props
 *
 * optional initialValue is passes through the hook constructor
 */
export const useSelectGroup = (initialValue?: string | ColorClassification): UseFormTuple<ColorClassification> => {
    let initialGroup = GROUPINGS[0];
    if (typeof initialValue === "string") {
        const found = getFromName(initialValue);
        if (found) {
            initialGroup = found;
        } else {
            console.warn("no group found with name " + initialValue);
        }
    } else if (typeof initialValue === "object") {
        initialGroup = initialValue;
    }
    const [group, setGroup] = useState(initialGroup);

    return [
        group,
        () => <SelectGroup name={group.name} onChange={setGroup}/>
    ]
};
