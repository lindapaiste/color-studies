import {random} from "../lib";
import {fixHue} from "../hue/hueShift";
import {ChannelAccessor, ChannelName} from "../spacesChannels/types";
import {colorWheelToNormal, normalToColorWheel} from "../rainbow/colorWheel";
import {getMax, isFixedMaxChannel} from "../spacesChannels/channelMaxes";
import {accessorToName} from "../spacesChannels/accessorConversion";
import {I_ColorAdapter} from "../color/types";

export interface ChannelProps {
    min?: number; //default to 0 if not set
    max?: number;
    clamp?: boolean;
    preTransform?(v: number): number;
    postTransform?(v: number): number;
}

export interface BasicProps {
    value: number;
    noiseRatio: number;
    channel: ChannelName;
}

export type SpecificProps = ChannelProps & Omit<BasicProps, 'channel'>

/**
 * can share this between noise generation and channel shift
 */
export const getChannelProps = (channel: ChannelName): ChannelProps => {
    let preTransform: (n: number) => number = c => c;
    let postTransform: (n: number) => number = c => c;
    if ( channel === 'hue' ) {
        preTransform = normalToColorWheel;
        postTransform = n => fixHue(colorWheelToNormal(n));
    }
    /**
     * RGB noise should not be distributed linearly because of how the channel value actually represents an x-squared
     * with linear method, changes are barely visible in a RGB channel with a low initial value
     * changes in the higher numbers are more impactful
     */
    else if ( ['red', 'green', 'blue'].includes( channel ) ) {
        preTransform = n => Math.pow(n, 2);
        postTransform = n => Math.pow(n, .5);
    }

    //for now, just avoid clamping with unknown max
    //could calculate based on other channels, but what if all channels are changing?
    let max;
    let clamp = true;
    if ( isFixedMaxChannel( channel) ) {
        max = getMax(channel);
    } else {
        clamp = false;
    }

    return {
        preTransform,
        postTransform,
        max,
        clamp,
    }
};

export const noisyChannelValue = ({channel, ...props}: BasicProps): number => {
    return specificNoisyValue({
        ...props,
        ...getChannelProps(channel),
    });
};

export const specificNoisyValue = ({value, max = 100, min = 0, noiseRatio, postTransform = n => n, preTransform = n => n, clamp = false}: SpecificProps): number => {
    const _initial = preTransform(value);
    const _min = preTransform(min);
    const _max = preTransform(max);
    //thought about passing noise amount instead of noise ratio, but want to base it on the transformed value of max
    const noiseAmount = _max * noiseRatio;
    /**
     * it is important to remove the possibility of out of range values
     * BEFORE picking the random number in order to distribute properly
     *
     * clamp property makes constraining optional, which is needed for hue only
     */
    const lower = clamp ? Math.max( _min, _initial - noiseAmount ) : _initial - noiseAmount;
    const upper = clamp ? Math.min( _max, _initial + noiseAmount ) : _initial + noiseAmount;
    const noisy = postTransform(random(lower, upper, true));
    console.log({noisy, noiseAmount, min: postTransform(lower), max: postTransform(upper)});
    return noisy;
};

/**
 * applies channel noise to an I_ColorAdapter object
 */
export const withChannelNoise = (color: I_ColorAdapter, channel: ChannelAccessor, noiseRatio: number): I_ColorAdapter => {
  const value = color.get(channel);
  const newValue = noisyChannelValue({channel: accessorToName(channel), noiseRatio, value});
  return color.set(channel, newValue);
};
