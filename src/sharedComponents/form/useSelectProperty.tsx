import {ColorPropKey} from "../../properties/types";
import {UseFormTuple} from "./types";
import React, {useState} from "react";
import {propertyKeys} from "../../properties/index";
import {SelectProperty} from "./SelectProperty";

export const useSelectProperty = (initialValue?: ColorPropKey): UseFormTuple<ColorPropKey> => {
    const [property, setProperty] = useState(initialValue || propertyKeys[0]);

    return [
        property,
        () => <SelectProperty slug={property} onChange={setProperty}/>
    ]
};
