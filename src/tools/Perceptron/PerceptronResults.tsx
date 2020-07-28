import React, {useMemo, useState} from "react";
import {
    buildIsGroupModel,
    IsGroupModel,
    PerceptronResult,
    testIsGroupModel,
    TestResults
} from "../../classifier/perceptronModel";
import {RenderSet} from "../../sharedComponents/color/RenderSet";
import {Tool} from "../../sharedComponents/tool/Tool";
import {PerceptronControls, Settings} from "./PerceptronControls";
import ChannelAdapter from "../../spacesChannels/ChannelAdapter";
import {Button} from "../../sharedComponents/ui/Button";
import {Title} from "../../sharedComponents/ui/Title";
import {round, sortBy} from "../../lib";
import {DataTable} from "../../sharedComponents/ui/DataTable";
import {Accordion} from "../../sharedComponents/ui";
import {randomGroup} from "../../grouping";

/**
 * examine the results from applying the model to random colors
 */

export interface Props {
    results: TestResults;
    labels?: [string, string];
}

/**
 * assumes that the features are in the same order as the channels
 * internally sorts by score -- won't do anything if not in debug mode
 */
export const RenderResultSet = ({results, channels}: { results: PerceptronResult[], channels: ChannelAdapter[] }) => (
    <RenderSet<PerceptronResult>
        colors={sortBy(results, r => r.predicted).reverse()}
        colorToString={r => r.color.hex()}
        colorToTooltip={r => (
            <div>
                <div>Prediction: {r.predicted}</div>
                {channels.map((channel, i) => (
                    <div key={channel.key}>{channel.title}: {round(r.features[i], 2)}</div>
                ))}
            </div>
        )}
        wrap={true}
    />
);

export const RenderModel = ({model, channels}: Pick<IsGroupModel, 'model' | 'channels'>) => {
    return (
        <DataTable
            labels={['Property', 'Weight']}
            rows={[
                ...channels.map((channel, i) => [channel.title, model.weights[i]]),
                ['Bias', model.bias]
            ]}
        />
    )
}

export const PerceptronTest = ({group, channels, testCount, iterations}: Settings) => {
    const [replay, setReplay] = useState(0); //the stored value doesn't really mean anything, it's just a way to trigger useEffect or useMemo

    const model = useMemo(
        () => buildIsGroupModel({group, channels, iterations}),
        [group, channels, iterations]
    );

    const results = useMemo(
        () => testIsGroupModel(model, testCount, false),
        [model, testCount, replay]
    );

    //don't display results on a dummy model
    if (channels.length < 1) {
        return null;
    }

    return (
        <div>
            <Button onClick={() => setReplay(r => r + 1)}>Refresh Results</Button>
            <Accordion title={"Model Weights"}>
                <RenderModel {...model} />
            </Accordion>
            <div>
                <Title>Is {group}</Title>
                <RenderResultSet
                    results={results[0]}
                    channels={channels}
                />
                <Title>Is Not {group}</Title>
                <RenderResultSet
                    results={results[1]}
                    channels={channels}
                />
            </div>
        </div>
    )
}

export const PerceptronTool = () => (
    <Tool
        initialSettings={{
            testCount: 30,
            channels: [],
            group: randomGroup().name,
        }}
        RenderControls={PerceptronControls}
        RenderTool={PerceptronTest}
    />
)
