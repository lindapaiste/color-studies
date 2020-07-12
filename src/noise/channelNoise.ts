import {Color} from "chroma-js";
import {NoiseSettings} from "./types";
import {random} from "lodash";

/**
 * noise should not be distributed linearly because of how the channel value actually represents an x-squared
 * with linear method, changes are barely visible in a RGB channel with a low initial value
 * changes in the higher numbers are more impactful
 */
export const withRGBChannelNoise = ({base, noiseRatio}: NoiseSettings) => (channel: string): Color => {
    const max = Math.pow(255, 2);
    const current = Math.pow(base.get(channel), 2);
    const noiseAmount = noiseRatio * max;
    //it is important to remove the possibility of out of range values
    //BEFORE picking the random number in order to distribute properly
    const noisy = random(
        Math.max(0, current - noiseAmount),
        Math.min(max, current + noiseAmount),
        true
    );
    console.log({
        noisy: Math.pow(noisy, 0.5),
        noiseAmount,
        min: Math.max(0, current - noiseAmount),
        max: Math.min(max, current + noiseAmount)
    });
    return base.set(channel, Math.pow(noisy, 0.5));
};

export const withChannelNoise = ({base, noiseRatio}: NoiseSettings) => (channel: string, max: number): Color => {
    return base.set(channel, calcChannelNoise({base, noiseRatio})(channel, max));
};

export const calcChannelNoise = ({base, noiseRatio}: NoiseSettings) => (channel: string, max: number): number => {
    //TODO: lookup the max rather than passing in
    const current = base.get(channel);
    const noiseAmount = noiseRatio * max;
    //it is important to remove the possibility of out of range values
    //BEFORE picking the random number in order to distribute properly
    const noisy = random(
        Math.max(0, current - noiseAmount),
        Math.min(max, current + noiseAmount),
        true
    );
    console.log({
        noisy,
        noiseAmount,
        min: Math.max(0, current - noiseAmount),
        max: Math.min(max, current + noiseAmount)
    });
    return noisy;
};
