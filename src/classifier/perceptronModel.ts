import {PerceptronModel} from "simple-statistics";
import {shuffledGroupData} from "./shuffledData";
import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import {hexToColor, randomColors} from "../color";
import {I_ColorAdapter} from "../color/types";

/**
 * DOES NOT WORK
 *
 * problems with using perceptron:
 *
 * Expects normally distributed data, but some sets are clustered towards a hard cutoff at the end (like neons and saturation)
 *
 * Expects features to be independent, but color properties are only independent if they come from the same model.
 * Will create problems if using properties from different color spaces because they are codependent.
 *
 */

/*
* use selected of a color to build the model
*
* use manually defined color groups as the training data to create a model which assigns group
*
* based on how the model is built -- by going through each color, predicting, and adjusting,
* the order might matter?
*
*/

/**
 * need the model itself, but also what group it's for and what properties are used
 */
export interface IsGroupModel {
    model: PerceptronModel;
    group: string;
    channels: ChannelAdapter[];
}

export interface BuildModelProps {
    group: string;
    channels: ChannelAdapter[];
    iterations?: number;
}

export const buildIsGroupModel = ({group, channels, iterations = 15}: BuildModelProps): IsGroupModel => {
    const model = new PerceptronModel();
    const trainingData = shuffledGroupData(hex => getFeatures(hexToColor(hex), channels));
    console.log(trainingData);
    //needs to iterate over training data multiple times - when to stop?
    for (let i = 0; i < iterations; i++) {
        trainingData.forEach(datum => model.train(datum.features, datum.group === group ? 1 : 0));
    }
    console.log(model);
    return {
        model,
        group,
        channels,
    };
};

export const getFeatures = (color: I_ColorAdapter, channels: ChannelAdapter[]): number[] => {
    return channels.map(
        //need to normalize value
        channel => channel.normalize(color.get(channel))
    );
}

//true values and then false values
export type BinaryResults = [I_ColorAdapter[], I_ColorAdapter[]]

export type PerceptronResult = {
    predicted: number; //either 0/1 or a detailed number
    expected?: number;
    features: number[];
    color: I_ColorAdapter;
}

//broken into arrays of predicted true and predicted false
export type TestResults = [PerceptronResult[], PerceptronResult[]]

//if debugging, should include more details
export const testIsGroupModel = (model: IsGroupModel, count: number, debug: boolean = false): TestResults => {
    const results: TestResults = [[], []];
    const colors = randomColors(count);
    colors.forEach(color => {
        const features = getFeatures(color, model.channels);
        const predicted = debug ?
            logPredict(features, model.model.weights, model.model.bias) :
            model.model.predict(features);
        const result = {
            predicted,
            features,
            color
        }
        if (predicted > 0) {
            results[0].push(result);
        } else {
            results[1].push(result);
        }
    });
    return results;
};

const logPredict = (features: number[], weights: number[], bias: number): number => {
    // Calculate the sum of features times weights,
    // with the bias added (implicitly times one).
    let score = 0;
    for (let i = 2; i < weights.length; i++) {
        score += weights[i] * features[i];
        console.log("adding " + weights[i] * features[i] + " for a new score of " + score);
    }
    score += bias;
    console.log("adding bias of " + bias + " for a final score of " + score);
    return score;
};

const toBinary = (score: number): number => {
    // Classify as 1 if the score is over 0, otherwise 0.
    if (score > 0) {
        return 1;
    } else {
        return 0;
    }
}
