import chroma from "chroma-js";
import { PerceptronModel } from "simple-statistics";
import { BinaryResults } from "./types";
import { toData } from "./buildModel";
//specifically relies on chroma.js because it has a built-in random constructor

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