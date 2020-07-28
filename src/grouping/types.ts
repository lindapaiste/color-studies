import ChannelAdapter from "../spacesChannels/ChannelAdapter";
import PropertyConstraint from "./PropertyConstraint";
import {ChannelName} from "../spacesChannels/types";

/**
 * this is the format of the raw data
 * it will get mapped into another interface to be used / interacted with
 */
export interface StoredGroup {
    name: string;
    hexes: string[];
    //definitions and correlations both use the key of the channel
    definitions?: PropertyDef[];
    correlatedChannels?: string[];
}

export interface PropertyDef<T = string> {
    channel: T;
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

export interface MatchResult {
    matches: boolean;
    errors: MatchError[];
}

export interface MatchError {
    property: ChannelName;
    condition: PropertyConstraint;
    message: string;
}
