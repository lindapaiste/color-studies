import {
  geometricMean,
  harmonicMean,
  mean,
  median,
  standardDeviation,
} from "simple-statistics";
import { allChannels } from "../../colorspaces";
import { ColorArg, toColorAdapter } from "../../convert";
import { GroupColorAnalysis, PropertyAnalysis } from "./types";

export const analyzeValueArray = (values: number[]): PropertyAnalysis => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const vMean = mean(values);
  const vMedian = median(values);
  const differences = values.map((v) => Math.abs(v - vMean));
  return {
    values,
    min,
    max,
    spread: max - min,
    mean: vMean,
    median: vMedian,
    differences,
    meanDifference: mean(differences),
    medianDifference: median(values.map((v) => Math.abs(v - vMedian))),
    /**
     * Geometric mean and harmonic mean require positive numbers, so must drop zeros.
     * In order to minimize changes to output, replace zeros with a tiny number.
     */
    geometricMean: geometricMean(values.map((v) => Math.max(v, 0.001))),
    harmonicMean: harmonicMean(values.map((v) => Math.max(v, 0.001))),
    standardDeviation: standardDeviation(values),
  };
};

// input should be anything that Color can use as an input to the Constructor
export const analyzeGroupProperties = (
  colors: ColorArg[],
  normalized = false
): GroupColorAnalysis => {
  const objects = colors.map(toColorAdapter);

  const pairs = allChannels().map((channel) => [
    channel.key,
    analyzeValueArray(objects.map((c) => c.get(channel, normalized))),
  ]);

  return Object.fromEntries(pairs) as GroupColorAnalysis;
};
