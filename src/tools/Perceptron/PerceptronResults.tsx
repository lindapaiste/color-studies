import React from "react";
import ChannelAdapter from "../../spacesChannels/ChannelAdapter";
import {Button} from "../../sharedComponents/ui/Button";
import {round} from "../../lib";
import {DataTable} from "../../sharedComponents/ui/DataTable";
import {Accordion, Text} from "../../sharedComponents/ui";
import {RenderResultGroups} from "./RenderResultGroups";
import {ExpandableConfusionMatrix} from "../GroupBoundaries/RenderConfusionMatrix";
import {I_GroupPerceptron, I_ImpossibleCheck, PerceptronResult} from "../../classifier/types";
import {RenderProps} from "./types";
import {GroupPerceptron} from "../../classifier/GroupPerceptron";

/**
 * examine the results from applying the model to colors
 * rather than testing with random, can test with known colors and group into true positive, false positive, etc.
 *
 * previously did a sort by predicted score, but this is isn't supported by the new abstract implementation
 */

export const RenderPerceptronTest = ({model, results, onClickRefresh}: RenderProps) => {
    return (
        <div>
            <RenderImpossibleError check={model.impossibleCheck()}/>
            <Button onClick={onClickRefresh}>Refresh Results</Button>
            <PerceptronBoundary
                model={model}
            />
            <Accordion title={"Model Weights"}>
                <RenderModel
                    model={model}
                />
            </Accordion>
            <ExpandableConfusionMatrix
                results={results.accuracy}
            />
            <RenderResultGroups
                results={results}
                resultToTooltip={result => (
                    <ResultTooltip
                        result={result}
                        channels={model.channels}
                    />
                )}
                height={40}
            />
        </div>
    )
}

/**
 * if there is only one channel in model, then can easily display the value that flips true to false
 * true when value > (-bias)/weights[0]
 */
export const PerceptronBoundary = ({model}: { model: GroupPerceptron }) => {
    if (model.channels.length === 1) {

        const cutoff = -1 * model.bias / model.weights[0];
        const isGreater = model.weights[0] > 0; //check this

        return (
            <Text>True When {model.channels[0].title} is {isGreater ? "Greater" : "Less"} than {round(cutoff, 2)}</Text>
        )
    } else return null;
}

/**
 * display the score and the channel values in the tooltip
 * assumes that the features are in the same order as the channels
 */
export const ResultTooltip = ({result, channels}: { result: PerceptronResult, channels: ChannelAdapter[] }) => (
    <div>
        <div>Score: {result.score}</div>
        {channels.map((channel, i) => (
            <div key={channel.key}>{channel.title}: {round(result.features[i], 2)}</div>
        ))}
    </div>
)

/**
 * display a table with the weights and bias for a perceptron model
 * don't use the spread operator because it won't work with class get() values
 */
export const RenderModel = ({model}: { model: I_GroupPerceptron }) => {
    return (
        <DataTable
            labels={['Property', 'Weight']}
            rows={[
                ...model.channels.map((channel, i) => [channel.title, model.weights[i]]),
                ['Bias', model.bias]
            ]}
        />
    )
}

export const RenderImpossibleError = ({check}: { check: I_ImpossibleCheck }) => {
    if (check.isImpossible) {
        return (
            <div>
                <Text>BAD MODEL</Text>
                <Text>max score {check.maxScore} and min score {check.minScore} do not divide the results</Text>
            </div>
        )
    } else return null;
}


export default RenderPerceptronTest;