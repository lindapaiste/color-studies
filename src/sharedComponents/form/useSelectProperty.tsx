import {ColorPropKey} from "../../packages/types";
import {UseFormTuple} from "./types";
import React, {useState} from "react";
import {propertyKeys} from "../../packages";
import {SelectProperty} from "./SelectProperty";

export const useSelectProperty = (initialValue?: ColorPropKey): UseFormTuple<ColorPropKey> => {
    const [property, setProperty] = useState(initialValue || propertyKeys[0]);

    return [
        property,
        () => <SelectProperty slug={property} onChange={setProperty}/>
    ]
};
