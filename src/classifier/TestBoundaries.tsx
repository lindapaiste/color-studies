import React from "react";
import {useSelectGroup} from "../toolComponents/useSelectGroup";
import {useNumberInput} from "../toolComponents/useNumberInput";
import {propertyKeys} from "../properties";
import {buildBoundaryModel} from "./singleProperty";
import {percentString} from "../util";

export const TestBoundaries = () => {
    const [group, SelectGroup] = useSelectGroup();
    //const [property, SelectProperty] = useSelectProperty();
    const [sampleSize, SampleSizeInput] = useNumberInput(100);

    return (
        <div>
            <SelectGroup/>
            <SampleSizeInput/>
            {propertyKeys.map(property => {
                const model = buildBoundaryModel(group.name, property, sampleSize);
                return (
                    <div key={property}>
                        <h3>{property}</h3>
                        <div>{model.isGreater ? "Greater" : "Less"} than {model.cutoff}</div>
                        <div>Accuracy: {percentString(model.accuracy, 2)}</div>
                    </div>
                )
            })
            }
        </div>
    )
};
