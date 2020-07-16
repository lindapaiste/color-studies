import {PerceptronModel} from "simple-statistics";
import chroma, {Color} from "chroma-js";
import {util} from "../packages/chroma-js";
import {shuffledGroupData} from "./shuffledData";

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
 * use all properties of a color to build the model
 *
 * use manually defined color groups as the training data to create a model which assigns group
 *
 * based on how the model is built -- by going through each color, predicting, and adjusting,
 * the order might matter?
 *
 */
export const buildIsGroupModel = (groupName: string): PerceptronModel => {
    const model = new PerceptronModel();
    const trainingData = shuffledGroupData(hex => toData(chroma(hex)));
    console.log(trainingData);
    trainingData.forEach(({features, group}) => model.train(features, group === groupName ? 1 : 0));
    console.log(model);
    return model;
};

export const toData = (color: Color) => Object.values(util.getProfile(color));

//true values and then false values
export type BinaryResults = [Color[], Color[]]

export const testRandom = (
    model: PerceptronModel,
    count: number
): BinaryResults => {
    const results: BinaryResults = [[], []];
    for (let i = 0; i < count; i++) {
        const color = chroma.random();
        const isTrue = debug(toData(color), model.weights, model.bias);
        //const isTrue = model.predict(toData(color));
        if (isTrue) {
            results[0].push(color);
        } else {
            results[1].push(color);
        }
    }
    return results;
};
const debug = (features: number[], weights: number[], bias: number): number => {
    // Calculate the sum of features times weights,
    // with the bias added (implicitly times one).
    let score = 0;
    for (let i = 2; i < weights.length; i++) {
        score += weights[i] * features[i];
        console.log("adding " + weights[i] * features[i] + " for a new score of " + score);
    }
    score += bias;
    console.log("adding bias of " + bias + " for a final score of " + score);

    // Classify as 1 if the score is over 0, otherwise 0.
    if (score > 0) {
        return 1;
    } else {
        return 0;
    }
};
