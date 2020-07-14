import React, {useMemo, useState} from "react";
import {percentString} from "../util";
import {shuffledHexes} from "./buildModel";
import {ColorAdapter} from "../packages/color-adapter";
import {channelBoundaries} from "./channelBoundaries";
import {accessorKey, accessorTitle, ALL_ACCESSORS} from "../spacesChannels/colorSpaces";
import {SelectGroup} from "../sharedComponents/form/SelectGroup";
import GROUPINGS from "../grouping/group-data";
import {sortBy} from "lodash";
import {TestAccuracy} from "./boundaryModel";

export const TestBoundaries = () => {
    const [group, setGroup] = useState(GROUPINGS[0].name);
    //const [property, SelectProperty] = useSelectProperty();
    //const [sampleSize, SampleSizeInput] = useNumberInput(100);

    const data = useMemo(() => shuffledHexes().map(
        ({hex, group}) => ({hex, group, color: new ColorAdapter(hex)})
    ), []);

    const models = useMemo(() => {
        const pairs = ALL_ACCESSORS.map((accessor) => ({
            accessor,
            model: channelBoundaries(group, data, accessor)
        }));
        return sortBy(pairs, o => 1 - o.model.accuracy.accuracy); //do 1 minus to sort descending
    }, [group]);

    return (
        <div>
            <SelectGroup name={group} onChange={g => setGroup(g.name)}/>
            {models.map(({accessor, model}) => (
                <div key={accessorKey(accessor)}>
                    <h3>{accessorTitle(accessor)}</h3>
                    <div>{model.isGreater ? "Greater" : "Less"} than {model.cutoff}</div>
                    <RenderAccuracy {...model.accuracy}/>
                </div>
            ))}
        </div>
    )
};

export const RenderAccuracy = ({accuracy, falsePositives, truePositives, trueNegatives, falseNegatives}: TestAccuracy) => {
    const total = falsePositives + truePositives + falseNegatives + trueNegatives;

    const numberAndPercent = (n: number): string => `${n} - ${percentString(n / total, 2)}`;

    return (
        <div>
            <div>Accuracy: {percentString(accuracy, 2)}</div>
            <div>True Positives: {numberAndPercent(truePositives)}</div>
            <div>False Positives: {numberAndPercent(falsePositives)}</div>
            <div>True Negatives: {numberAndPercent(trueNegatives)}</div>
            <div>False Negatives: {numberAndPercent(falseNegatives)}</div>
        </div>
    );
};
