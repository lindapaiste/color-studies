import React from "react";
import {useSelectGroup} from "../sharedComponents/form/useSelectGroup";
import {useNumberInput} from "../sharedComponents/form/useNumberInput";
import {propertyKeys} from "../properties";
import {buildBoundaryModel} from "./boundaryModel";
import {percentString} from "../util";
import {ChromaAdapter} from "../properties/chroma-adapter-profile";

export const TestBoundaries = () => {
    const [group, SelectGroup] = useSelectGroup();
    //const [property, SelectProperty] = useSelectProperty();
    const [sampleSize, SampleSizeInput] = useNumberInput(100);

    return (
        <div>
            <SelectGroup/>
            <SampleSizeInput/>
            {propertyKeys.map(property => {
                const model = buildBoundaryModel(group.name, hex => (new ChromaAdapter(hex))[property], sampleSize);
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
