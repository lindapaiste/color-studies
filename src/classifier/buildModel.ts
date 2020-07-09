import {PerceptronModel} from "simple-statistics";
import GROUPINGS from "../grouping/group-data";
import chroma, {Color} from "chroma-js";
import {util} from "../properties/chroma-js";
import {flatMap, shuffle} from "lodash";

export interface GroupedHex {
    hex: string,
    group: string
}

export const shuffledHexes = (): GroupedHex[] => {
    return shuffle(flatMap(GROUPINGS, ({hexes, name}) => hexes.map(hex => ({
        hex,
        group: name,
    }))));
};

export const shuffledGroupData = (hexToFeatures: (hex: string) => number[]): { hex: string, features: number[], group: string }[] => {
    return shuffledHexes().map(({hex, group}) => ({
        hex,
        features: hexToFeatures(hex),
        group,
    }));
};

/**
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
