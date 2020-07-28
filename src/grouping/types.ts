import {ChannelAccessor, ChannelName} from "../spacesChannels/types";

export interface ColorClassification {
    name: string;
    hexes: string[];
    definitions?: PropertyConstraint[];
    correlatedChannels?: (ChannelAccessor | string)[];
}

export interface PropertyConstraint {
    property: ChannelName;
    min: number;
    max: number;
}

export interface PropertyAnalysis {
    values: number[];
    min: number;
    max: number;
    spread: number;
    mean: number;
    median: number;
    geometricMean: number;
    harmonicMean: number;
    differences: number[];
    meanDifference: number; //won't be 0 because looking at absolute values
    medianDifference: number;
    standardDeviation: number;
}

export type GroupColorAnalysis = Record<string, PropertyAnalysis>
