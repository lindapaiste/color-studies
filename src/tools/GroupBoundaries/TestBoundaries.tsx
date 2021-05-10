import React, {useMemo, useState} from "react";
import {shuffledHexes} from "../../classifier/shuffledData";
import {ChannelBoundaryModel} from "../../classifier/ChannelBoundaryModel";
import {SelectGroup} from "../../sharedComponents/form/SelectGroup";
import {round, sortBy} from "../../lib";
import {ExpandableConfusionMatrix} from "./RenderConfusionMatrix";
import {Title} from "../../sharedComponents/ui/Title";
import {hexToColor} from "../../color";
import {allChannels} from "../../spacesChannels/channels";
import {randomGroup} from "../../grouping";
import {GroupModelTest} from "../../classifier/GroupModelTest";

/**
 * based on the selected group name, calculates a boundary model for every property
 *
 * sorts the models by one key determinant (right now using balancedAccuracy, but could change)
 * can expand to show detailed analysis
 */
export const TestBoundaries = () => {
    const [group, setGroup] = useState(randomGroup().name);
    //const [property, SelectProperty] = useSelectProperty();
    //const [sampleSize, SampleSizeInput] = useNumberInput(100);

    const data = useMemo(
        () =>
            shuffledHexes().map(({hex, group}) => ({
                hex,
                group,
                color: hexToColor(hex)
            })),
        []
    );

    const models = useMemo(() => {
        const pairs = allChannels().map(channel => {
            const model = new ChannelBoundaryModel(group, data, channel);
            const tester = new GroupModelTest(model);
            tester.test(100);
            const accuracy = tester.accuracy;
            return {
                channel,
                model,
                accuracy
            }/*
            return {
                channel,
                model: channelBoundaries(group, data, channel)
            }*/
        });
        return sortBy(pairs, o => 1 - Math.max(o.accuracy.positivePredictiveValue, o.accuracy.negativePredictiveValue)); //do 1 minus to sort descending
    }, [group]);

    return (
        <div>
            <Title>Boundaries for {group}</Title>
            <SelectGroup value={group} onChange={setGroup} label="Select"/>
            {models.map(({channel, model, accuracy}) => (
                <div key={channel.key}>
                    <Title importance="h3">{channel.title}</Title>
                    <div>
                        {model.isGreater ? "Greater" : "Less"} than {round(model.cutoff, 2)}
                    </div>
                    <div>Positive Predictive Value: {accuracy.positivePredictiveValue}</div>
                    <div>Negative Predictive Value: {accuracy.negativePredictiveValue}</div>
                    <ExpandableConfusionMatrix results={accuracy}/>
                </div>
            ))}
        </div>
    );
};
