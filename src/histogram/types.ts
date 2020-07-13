import {Color} from "../packages";

export interface CalcProps {
    hexes: string[];
    breakpoints: number | number[]; //either a count, or an array of specific percentage breaks, as fractions of 1
    getProperty(c: Color): number;
}

/**
 * note: min and max refer to the cutoff range for the bucket,
 * NOT the min and max of the actual values contained in the bucket
 */
export interface Bucket {
    min: number;
    max: number;
    entries: Array<{
        color: string;
        value: number;
    }>;
    width: number; //expressed as a fraction of 1 relative to the whole histogram
}

/**
 * note: prop buckets requires that the buckets be in order
 */
export interface RenderProps {
    colorSize: number;
    buckets: Bucket[];
}
