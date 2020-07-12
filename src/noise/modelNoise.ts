import chroma, {ColorSpaces} from "chroma-js";
import {NoiseSettings} from "./types";
/**
 * can apply noise to multiple channels, but they should all be part of the same color model
 * otherwise new changes with either override or compound previous changes affecting the same channel
 */

export const withNoise = ({base, noiseRatio}: NoiseSettings) =>
    <T extends keyof ColorSpaces>(colorSpace: T, weights?: ColorSpaces[T]) => {
        /**
         * can call the channel function directly, but how to ensure that it exists?
         * can loop though get( channel ) with colorSpace.split('') for each letter
         * only colorspace that won't work right just using the letters is gl
         */
        const values = base[colorSpace]();

        /**
         * default to 1 if no weights array is passed in
         * or if it has the wrong number of entries
         */
        const getWeight = (i: number): number => {
            if ( ! Array.isArray(weights) ) {
                return 1;
            }
            const weight = weights[i];
            return typeof weight === "number" ? weight : 1;
        }


};
