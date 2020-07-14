import React, {useMemo, useState} from "react";
import {useNumberInput} from "../sharedComponents/form/useNumberInput";
import {percentString} from "../util";
import {shuffledHexes} from "./buildModel";
import {ColorAdapter} from "../packages/color-adapter";
import {channelBoundaries} from "./channelBoundaries";
import {accessorKey, accessorTitle, ALL_ACCESSORS} from "../spacesChannels/colorSpaces";
import {SelectGroup} from "../sharedComponents/form/SelectGroup";
import GROUPINGS from "../grouping/group-data";

export const TestBoundaries = () => {
    const [group, setGroup] = useState(GROUPINGS[0].name);
    //const [property, SelectProperty] = useSelectProperty();
    //const [sampleSize, SampleSizeInput] = useNumberInput(100);

    const data = useMemo(() => shuffledHexes().map(
        ({hex, group}) => ({hex, group, color: new ColorAdapter(hex)})
    ), []);

    return (
        <div>
            <SelectGroup name={group} onChange={g => setGroup(g.name)}/>
            {ALL_ACCESSORS.map((accessor) => {
                const model = channelBoundaries(group, data, accessor);
                return (
                    <div key={accessorKey(accessor)}>
                        <h3>{accessorTitle(accessor)}</h3>
                        <div>{model.isGreater ? "Greater" : "Less"} than {model.cutoff}</div>
                        <div>Accuracy: {percentString(model.accuracy, 2)}</div>
                    </div>
                )
            })
            }
        </div>
    )
};
