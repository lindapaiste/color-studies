import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";

/**
 * could include color here rather than in HOC
 */
export interface NoiseSettings {
    colorSpace: ColorSpaceName;
    noiseRatio: number;
    weights: ColorTuple<ColorSpaceName>;
}

/**
 * need to ensure that the length of weights matches the given model
 * is it easier to just include a fourth value and ignore when not needed?
 * vs. useEffect to update the value when model changes to one with a different length
 * note that a 4-length tuple also fills the interface of a 3-length tuple
 */

export const DEFAULT_SETTINGS: NoiseSettings = {
    colorSpace: "rgb",
    noiseRatio: 0.1,
    weights: [1, 1, 1, 1]
};
