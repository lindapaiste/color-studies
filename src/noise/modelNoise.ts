import {getSpaceChannelNames} from "../spacesChannels/colorSpaces";
import {noisyChannelValue} from "./channelNoise";
import {I_ColorAdapter} from "../packages/ColorAdapter";
import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {I_ModelNoise, I_NoiseCreator, ModelNoiseSettings} from "./types";
import {ifDefined} from "../lib";

/**
 * uses the same setup as Formula, where it is created from settings, but also serves as an access point to those settings
 */
export class ModelNoise implements I_NoiseCreator, ModelNoiseSettings, I_ModelNoise {
    public readonly colorSpace: ColorSpaceName
    public readonly noiseRatio: number;
    public readonly weights: ColorTuple<ColorSpaceName>;

    constructor ({colorSpace, noiseRatio, weights}: ModelNoiseSettings) {
        this.colorSpace = colorSpace;
        this.noiseRatio = noiseRatio;
        this.weights = weights;
    }

    getNoisy(base: I_ColorAdapter): I_ColorAdapter {
        return withModelNoise({color: base, ...this});
    }
}


/**
 * can apply noise to multiple channels, but they should all be part of the same color model
 * otherwise new changes with either override or compound previous changes affecting the same channel
 */

export interface CalcProps<CS extends ColorSpaceName> {
    colorSpace: CS;
    noiseRatio: number;
    values: ColorTuple<CS>;
    //maximums: ColorTuple<CS>;
    weights?: ColorTuple<CS>;
}

export const calcNoisy = <CS extends ColorSpaceName>({colorSpace, values, noiseRatio, weights}: CalcProps<CS>): ColorTuple<CS> => {
    /**
     * default to 1 if no weights array is passed in
     * or if it has the wrong number of entries
     */
    const getWeight = (i: number): number => {
        if (!Array.isArray(weights)) {
            return 1;
        }
        return ifDefined( weights[i], 1);
    };

    const channels = getSpaceChannelNames(colorSpace);

    return values.map((value, i) => noisyChannelValue({
        channel: channels[i],
        value,
        noiseRatio: noiseRatio * getWeight(i),
    })) as ColorTuple<CS>;
};

export type Props<CS extends ColorSpaceName> = Omit<CalcProps<CS>, 'values'> & {
    color: I_ColorAdapter;
}

export const withModelNoise = <CS extends ColorSpaceName>({color, colorSpace, ...props}: Props<CS>): I_ColorAdapter => {
    const values = color.to(colorSpace);
    const noisy = calcNoisy({...props, values: values as ColorTuple<CS>, colorSpace});
    return color.from(noisy, colorSpace);
};

/**
 * note from previous version using chroma:
 *
 * can call the channel function directly, but how to ensure that it exists?
 * can loop though get( channel ) with colorSpace.split('') for each letter
 * only colorspace that won't work right just using the letters is gl
 */
