import { PropertyConstraint } from "./PropertyConstraint";
import { ChannelName } from "../../spacesChannels/types";

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
  meanDifference: number; // won't be 0 because looking at absolute values
  medianDifference: number;
  standardDeviation: number;
}

export type GroupColorAnalysis = Record<string, PropertyAnalysis>;

export interface MatchResult {
  matches: boolean;
  errors: MatchError[];
}

export interface MatchError {
  property: ChannelName;
  condition: PropertyConstraint;
  message: string;
}
