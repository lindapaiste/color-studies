import { ColorAdapter } from "../convert";
import { ColorSpaceName, ColorTuple } from "../colorspaces";

/**
 * could include color here rather than in HOC
 */
export interface ModelNoiseSettings {
  colorSpace: ColorSpaceName;
  noiseRatio: number;
  weights: ColorTuple;
}

/**
 * need to ensure that the length of weights matches the given model
 * is it easier to just include a fourth value and ignore when not needed?
 * vs. useEffect to update the value when model changes to one with a different length
 * note that a 4-length tuple also fills the interface of a 3-length tuple
 */

export const DEFAULT_NOISE_SETTINGS: ModelNoiseSettings = {
  colorSpace: "rgb",
  noiseRatio: 0.1,
  weights: [1, 1, 1, 1],
};

export interface INoiseCreator {
  getNoisy(base: ColorAdapter): ColorAdapter;
}

export type IModelNoise = INoiseCreator & ModelNoiseSettings;
