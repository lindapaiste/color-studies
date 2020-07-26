import {ColorSpaceName} from "../spacesChannels/types";
import {FormulaSettings, I_DeltaECalculator} from "./types";
import {getSpaceChannelNames} from "../spacesChannels/colorSpaces";
import {getMaxObject} from "../spacesChannels/channelMaxes";
import {rawDistance} from "./euclideanDistance";
import {I_ColorAdapter} from "../packages/ColorAdapter";

/**
 * CIE 1976 formula uses Euclidean Distance of LAB coordinates,
 * but the same formula can be applied to RGB or any other color space
 *
 * no matter what the weights are, CIE distances always range from 0 to 100
 * result from Euclidean distance must be adjusted accordingly
 *
 * the primary reason that this class exists is to handle that adjustment
 * the maximum is the same as long as the colorSpace and the weights are the same
 * so it does not need to be recalculated for each a/b pairing
 */
export class EuclideanCalculator implements I_DeltaECalculator {
    private readonly weights: number[];
    private readonly model: ColorSpaceName;
    private readonly maximum: number;

    /**
     * pass weights and model in the constructor to make them readonly
     * calculate and store the maximum
     */
    constructor({weights, model}: Pick<FormulaSettings, 'weights' | 'model'>) {
        this.weights = weights;
        this.model = model;
        this.maximum = this.calcMax();
    }

    /**
     * creates one tuple with all the max values and one with all the min values and another with the maxes
     * then uses rawDistance formula to find the distance between these two extrema
     */
    private calcMax(): number {
        const channelMaxes = getSpaceChannelNames(this.model).map(getMaxObject);
        const min = channelMaxes.map(o => o.min);
        const max = channelMaxes.map(o => o.max);
        return rawDistance(min, max, this.weights);
    }

    /**
     * returns the distance between two colors, applying this colorSpace and weights,
     * in the range 0 to 100
     */
    public getDeltaE(a: I_ColorAdapter, b: I_ColorAdapter): number {
        const raw = rawDistance(a.to(this.model), b.to(this.model), this.weights);
        return 100 * raw / this.maximum;
    }
}
