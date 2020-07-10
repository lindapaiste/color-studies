import {ColorPropKey} from "../properties/types";
import {getSplitHexes} from "./PlotFeatures";
import {shuffle} from "lodash";
import {ChromaAdapter} from "../properties/chroma-adapter";
import {mean} from "simple-statistics";

/**
 * UNFINISHED
 *
 * use Bayesian statistics to make a simplistic classifier based on one property
 * ie. lightness => isPastel
 * calculate the cutoff point
 * advantage of trial and error method is it doesn't assume normal
 */

export const findBoundary = (group: string, property: ColorPropKey, count: number = 100) => {
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


