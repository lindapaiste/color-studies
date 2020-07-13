import Color from "color";
import {fromPairs} from "lodash";
import {PROPERTIES} from "../packages/color-js";

export interface GroupColorAnalysis {
  hue: PropertyAnalysis;
  wheelHue: PropertyAnalysis;
  luminosity: PropertyAnalysis;
  lightness: PropertyAnalysis;
  saturationl: PropertyAnalysis;
  saturationv: PropertyAnalysis;
  blackness: PropertyAnalysis;
  whiteness: PropertyAnalysis;
}

export interface PropertyAnalysis {
  values: number[];
  min: number;
  max: number;
  spread: number;
  mean: number;
  median: number;
  differences: number[];
  meanDifference: number; //won't be 0 because looking at absolute values
  medianDifference: number;
}



//input should be anything that Color can use as an input to the Constructor
export const getGroupData = (
  colors: Array<number[] | string>
): GroupColorAnalysis => {
  const objects = colors.map(c => new Color(c));

  const pairs = PROPERTIES.map(o => [
    o.key,
    analyzePropertyValues(objects.map(o.getter))
  ]);

  return fromPairs(pairs) as GroupColorAnalysis;
};

export const mean = (values: number[]): number => {
  return values.reduce((a, c) => a + c) / values.length;
};

export const median = (values: number[]): number => {
  const sorted = [...values].sort();
  const i = values.length / 2;
  if (i % 1) {
    return (sorted[i + 0.5] + sorted[i - 0.5]) / 2;
  } else {
    return sorted[i];
  }
};

const analyzePropertyValues = (values: number[]): PropertyAnalysis => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const vMean = mean(values);
  const vMedian = median(values);
  const differences = values.map(v => Math.abs(v - vMean));
  return {
    values,
    min,
    max,
    spread: max - min,
    mean: vMean,
    median: vMedian,
    differences,
    meanDifference: mean(differences),
    medianDifference: median(values.map(v => Math.abs(v - vMedian)))
  };
};
