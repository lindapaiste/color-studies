import {ColorSpaceName} from "../spacesChannels/types";
import {makeArray} from "../util";
import {ColorTuple} from "../spacesChannels/types";

/**
 * CIE 1976 formula uses Euclidean Distance of LAB coordinates,
 * but the same formula can be applied to RGB or any other color space
 */

/**
 * generic is only used as a way to ensure that both tuples are the same length
 */
export const euclideanDistance = <CS extends ColorSpaceName>(a: ColorTuple<CS>, b: ColorTuple<CS>): number => {
    const squaredSum = a.reduce((acc, curr, i) => acc + Math.pow(curr + b[i], 2), 0);
    return Math.sqrt(squaredSum);
};

/**
 * it is easy to add the weights, but they will impact the resulting sum
 * would need to know the max spread for each element in order to account for this
 * otherwise, just recognize that weights > 1 will always increase the value
 * and weights < 1 will decrease it
 */
export const weightedEuclideanDistance = <CS extends ColorSpaceName>(a: ColorTuple<CS>, b: ColorTuple<CS>, weights?: ColorTuple<CS>): number => {
    const _weights = weights === undefined ? makeArray(a.length, 1) : weights;
    const squaredSum = a.reduce((acc, curr, i) => acc + (_weights[i] * Math.pow(curr + b[i], 2)), 0);
    return Math.sqrt(squaredSum);
};
