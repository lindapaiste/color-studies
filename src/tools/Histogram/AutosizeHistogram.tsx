import {Bucket, RenderProps} from "./types";
import useDimensions from "../../lib/useDimensions";
import {ifDefined} from "../../lib";
import React from "react";
import {Size} from "../../sharedComponents/form/types";
import {RenderHistogram} from "./RenderHistogram";

const COLUMNS_PER_BAR = 3;
/**
 * autosize depends on the buckets having equal widths
 *
 * previously had a bar and its label in the same div, but might want to separate to make autosize easier
 * alternatively, make the label a fixed height so that it can be subtracted
 *
 * size calculation is more complicated if colors are square because changes to height can effect the number of columns
 * make life easier and use rectangles
 */
export const calcSizes = (chartSize: Size, buckets: Bucket[]): Pick<RenderProps, 'colorWidth' | 'colorHeight'> => {
    const barHeight = (chartSize.height - 35); //fixed size label + margin
    const barWidth = .9 * (chartSize.width / buckets.length);
    const colorWidth = barWidth / COLUMNS_PER_BAR;
    //find the max height for each column, and use the minimum of the maxes
    const maxes = buckets.map(bucket => barHeight / Math.ceil(bucket.entries.length / COLUMNS_PER_BAR));
    const colorHeight = Math.min(...maxes);
    return {
        colorWidth,
        colorHeight
    }
}

/**
 * can add a margin via padPercent prop
 */
export const RenderAutoSizeHistogram = ({buckets, width = 500, height = 375, padPercent = 0}: Pick<RenderProps, 'buckets'> & Partial<Size> & {padPercent?: number}) => {
    const margin = (2 * padPercent)/100 * width;
    const chartSize = {
        width: width - margin,
        height: height - margin,
    }
    const sizes = calcSizes(chartSize, buckets);

    return (
        <div style={{margin: padPercent + "%"}}>
            <RenderHistogram {...sizes} buckets={buckets} height={chartSize.height}/>
        </div>
    )
}
