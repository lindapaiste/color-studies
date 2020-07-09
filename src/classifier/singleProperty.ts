import {ColorPropKey} from "../properties/types";
import {getSplitHexes} from "./PlotFeatures";
import {shuffle} from "lodash";
import {ChromaAdapter} from "../properties/chroma-adapter";
import {mean, standardDeviation} from "simple-statistics";
import {GroupedHex} from "./buildModel";

/**
 * use Bayesian statistics to make a simplistic classifier based on one property
 * ie. lightness => isPastel
 * calculate the cutoff point
 * advantage of trial and error method is it doesn't assume normal
 */

export const findBoundary = (group: string, property: ColorPropKey, count: number = 100): number => {
    const [inGroup, notInGroup] = getSplitHexes(group, count);

    const data = shuffle([...inGroup, ...notInGroup]).map(o => ({
        hex: o.hex,
        value: (new ChromaAdapter(o.hex))[property],
        expected: o.group === group,
    }));

    /*
    * can create an initial boundary by comparing the means of the two groups and picking the point between them
    * would be more accurate if also looking at standard deviation
     */
    const meanIn = mean(data.filter(d => d.expected).map(d => d.value));
    const meanOut = mean(data.filter(d => ! d.expected).map(d => d.value));

    let boundary = (meanIn + meanOut) / 2;
    let greater = meanIn > meanOut;

    const predict = (value: number): boolean => {
        return value > boundary ? greater : ! greater;
    };

    //will only measure the correctness at the time the value was examined,
    //but future changes to boundary may flip it
    let correct = 0;
    let incorrect = 0;

    for ( let i = 0; i < data.length; i++ ) {
        const {value, expected} = data[i];
        if ( predict( value ) === expected ) {
            correct++;
        } else {
            incorrect++;
            const offBy = value - boundary;
            boundary = (boundary * (i - 1) + value ) / i; //this is a really tiny shift

        }
    }

};


export interface BoundaryModel {
    cutoff: number;
    isGreater: boolean;
    accuracy: number;
    predict: (value: number) => boolean;
}

export interface Distribution {
    mean: number;
    stdDev: number;
}

export const getDistribution = (values: number[]) => ({
    mean: mean(values),
    stdDev: standardDeviation(values),
});

/**
 * this one is not Bayesian, it looks at everything up front
 */
export const buildBoundaryModel = (group: string, property: ColorPropKey, sampleSize: number = 100): BoundaryModel => {
    const [inGroup, notInGroup] = getSplitHexes(group, sampleSize);

    const valuesIn = inGroup.map( ({hex}) => (new ChromaAdapter(hex))[property]);
    const valuesOut = notInGroup.map( ({hex}) => (new ChromaAdapter(hex))[property]);

    const distIn = getDistribution(valuesIn);
    const distOut = getDistribution(valuesOut);

    /**
     * find the number of standard deviations where the two distributions intercept
     * ie. greater.mean - x * greater.stdDev = lesser.mean + x * lesser.stdDev
     */
    const isGreater = distIn.mean > distOut.mean;
    const greater = isGreater ? distIn : distOut;
    const lesser = isGreater ? distOut : distIn;
    const deviations = (greater.mean - lesser.mean)/(greater.stdDev + lesser.stdDev);

    const boundary = greater.mean - deviations * greater.stdDev;
    const check = lesser.mean + deviations * lesser.stdDev;

    console.log({boundary, check});

    /**
     * can compute accuracy based on the number of standard deviations
     * anything in the tail beyond that amount is on the wrong side
     * so more deviations is better ( means the distributions are widely separated )
     *
     * can also look at the actual data to see how many come out on the wrong side
     */

    const predict = predictOnBoundary(boundary, isGreater);

    let correct = 0;
    valuesIn.forEach( value => {
        if ( predict(value )) {
            correct++;
        }
    });
    valuesOut.forEach( value => {
        if ( ! predict(value )) {
            correct++;
        }
    });
    const accuracy = correct / (valuesIn.length + valuesOut.length);

    return {
        cutoff: boundary,
        isGreater,
        predict,
        accuracy,
    }
};


export const predictOnBoundary = (boundary: number, isGreater: boolean) => (value: number): boolean => {
    return value > boundary ? isGreater : ! isGreater;
};

