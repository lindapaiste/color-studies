import { findIndex, last, range, sortBy } from "lib";
import { Bucket, CalcProps } from "./types";

/**
 * include maximum, or not? what about minimum?
 * currently returns with neither min nor max included
 */
export const calcBreaks = (
  min: number,
  max: number,
  buckets: number
): number[] => {
  const width = (max - min) / buckets;
  return range(min + width, max, width);
};

/**
 * supports breakpoints of uneven widths, but they must be passed explicitly
 * can pass just a number to automatically compute evenly-spaced buckets based on the min and max
 */
export const createBuckets = ({
  breakpoints,
  hexes,
  hexToValue,
}: CalcProps): Bucket[] => {
  const objects = hexes.map((color) => ({
    color,
    value: hexToValue(color),
  }));
  const sorted = sortBy(objects, (o) => o.value);
  // using ternary avoids ts or runtime errors caused by an empty array
  const lowest = sorted[0];
  const highest = last(sorted);
  const minValue = lowest ? lowest.value : 0;
  const maxValue = highest ? highest.value : 0;
  console.log({ objects, sorted, minValue, maxValue });
  const breaks =
    typeof breakpoints === "number"
      ? calcBreaks(minValue, maxValue, breakpoints)
      : breakpoints;
  let startWith = 0;
  const buckets: Bucket[] = [];
  for (let i = 0; i < breaks.length + 1; i++) {
    const min = i === 0 ? minValue : breaks[i - 1];
    const max = i === breaks.length ? maxValue : breaks[i];
    const endBefore = findIndex(sorted, (o) => o.value > max, startWith);
    buckets.push({
      min,
      max,
      entries: sorted.slice(startWith, endBefore),
      width: (max - min) / (maxValue - minValue),
    });
    // don't need to add or subtract anything because array.slice is inclusive on the start but not on the end
    startWith = endBefore;
    console.log({ min, max, startWith, endBefore });
  }
  console.log({ buckets });
  return buckets;
};
