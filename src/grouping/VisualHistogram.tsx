import React from "react";
import { sortBy, range, last, findIndex, round } from "lodash";
import Color from "color";
import "./histogram.css";

export interface CalcProps {
  colors: string[];
  getProperty(c: Color): number;
  breakpoints: number | number[]; //either a count, or an array of specific percentage breaks, as fractions of 1
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

/**
 * supports breakpoints of uneven widths, but they must be passed explicitly
 * can pass just a number to automatically compute evenly-spaced buckets based on the min and max
 */
export const createBuckets = ({
  breakpoints,
  colors,
  getProperty
}: CalcProps): Bucket[] => {
  const objects = colors.map(color => ({
    color,
    value: getProperty(new Color(color))
  }));
  const sorted = sortBy(objects, o => o.value);
  const minValue = sorted[0].value;
  const maxValue = last(sorted).value;
  console.log({ objects, sorted, minValue, maxValue });
  const breaks =
    typeof breakpoints === "number"
      ? calcBreaks(minValue, maxValue, breakpoints)
      : breakpoints;
  let startWith = 0;
  let buckets: Bucket[] = [];
  for (let i = 0; i < breaks.length + 1; i++) {
    const min = i === 0 ? minValue : breaks[i - 1];
    const max = i === breaks.length ? maxValue : breaks[i];
    const endBefore = findIndex(sorted, o => o.value > max, startWith);
    buckets.push({
      min,
      max,
      entries: sorted.slice(startWith, endBefore),
      width: (max - min) / (maxValue - minValue)
    });
    //don't need to add or subtract anything because array.slice is inclusive on the start but not on the end
    startWith = endBefore;
    console.log({ min, max, startWith, endBefore });
  }
  console.log({ buckets });
  return buckets;
};

export const VisualHistogram = (
  props: CalcProps & Omit<RenderProps, "buckets">
) => {
  return <RenderHistorgram {...props} buckets={createBuckets(props)} />;
};

//should I randomize within each bucket?

export const RenderHistorgram = ({ buckets, colorSize }: RenderProps) => {
  if (buckets.length === 0) return null;
  //TODO: dynamic sizing of color elements
  return (
    <div className="chartContainer">
      {buckets.map((bucket, i) => (
        <div
          //outer div which hold the bucket contents and the label
          key={i}
          className="barContainer"
          style={{
            width: bucket.width * 100 + "%"
          }}
        >
          <div
            //column of boxes stacked at the bottom
            className="bar"
          >
            {bucket.entries.map((entry, j) => (
              <div
                //individual color box
                key={j}
                className="barElement"
                style={{
                  backgroundColor: entry.color,
                  width: colorSize,
                  height: colorSize
                }}
                title={`color: ${entry.color}, value: ${entry.value}`}
                onClick={() => console.log(entry)}
              />
            ))}
          </div>
          <div className="labelHolder">
            <div className="labelLeft">{round(bucket.min, 2)}</div>
            {i === buckets.length - 1 && (
              <div className="labelRight">{round(bucket.max, 2)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

//include maximum, or not? what about minimum?
//currently returns with neither min nor max included
export const calcBreaks = (
  min: number,
  max: number,
  buckets: number
): number[] => {
  const width = (max - min) / buckets;
  return range(min + width, max, width);
};
