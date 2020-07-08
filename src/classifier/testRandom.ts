import chroma from "chroma-js";
import {PerceptronModel} from "simple-statistics";
import {BinaryResults} from "./types";
import {toData} from "./buildModel";
//specifically relies on chroma.js because it has a built-in random constructor

export const testRandom = (model: PerceptronModel, count: number): BinaryResults => {
    const results: BinaryResults = [[], []];
    for (let i = 0; i < count; i++) {
        const color = chroma.random();
        const isTrue = model.predict(toData(color));
        if (isTrue) {
            results[0].push(color);
        } else {
            results[1].push(color);
        }
    }
    return results;
};
