import {geometricMean, harmonicMean, mean, median, standardDeviation} from "simple-statistics";
import {GroupColorAnalysis, PropertyAnalysis} from "./types";
import {allChannels} from "../spacesChannels/channels";
import {hexToColor} from "../color";

//input should be anything that Color can use as an input to the Constructor
export const analyzeGroupProperties = (hexes: string[]): GroupColorAnalysis => {
    const objects = hexes.map(hexToColor);

    const pairs = allChannels().map(channel => [
        channel.key,
        analyzeValueArray(objects.map(c => c.get(channel)))
    ]);

    return Object.fromEntries(pairs) as GroupColorAnalysis;
};

export const analyzeValueArray = (values: number[]): PropertyAnalysis => {
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
        medianDifference: median(values.map(v => Math.abs(v - vMedian))),
        geometricMean: geometricMean(values),
        harmonicMean: harmonicMean(values),
        standardDeviation: standardDeviation(values),
    };
};
