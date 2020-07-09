import { PerceptronModel } from "simple-statistics";
import GROUPINGS from "../grouping/group-data";
import chroma, { Color } from "chroma-js";
import { util } from "../properties/chroma-js";
import { shuffle } from "lodash";
/**
 * use all properties of a color to build the model
 *
 * use manually defined color groups as the training data to create a model which assigns group
 *
 * based on how the model is built -- by going through each color, predicting, and adjusting,
 * the order might matter?
 *
 */
export const buildIsGroupModel = (groupIndex: number): PerceptronModel => {
  const model = new PerceptronModel();
  const trainingData: Array<{ features: number[]; expected: 1 | 0 }> = [];

  for (let i = 0; i < GROUPINGS.length; i++) {
    const hexes = GROUPINGS[i].hexes;
    const expected = i === groupIndex ? 1 : 0;
    hexes.forEach(hex => {
      trainingData.push({
        features: toData(chroma(hex)),
        expected
      });
      //model.train(toData(chroma(hex)), expected);
    });
  }
  console.log(trainingData);
  const data = shuffle(trainingData);
  data.forEach(({ features, expected }) => model.train(features, expected));
  console.log(model);
  return model;
};

export const toData = (color: Color) => Object.values(util.getProfile(color));
