import React from "react";
import { percentString, round } from "lib";
import { Tooltip } from "components";
import { logProfile } from "logic/color/logProfile";
import { RenderProps } from "./types";
import "./histogram.css";
/**
 * base render function depends on the sizing being passing into it
 * will not make any changes to avoid overflows
 * does not need the width because it uses a percentage instead of a number for bucket width
 */
export const RenderHistogram = ({
  buckets,
  colorWidth,
  colorHeight,
  height,
}: RenderProps) => (
  <div className="chartContainer" style={{ height }}>
    {buckets.map((bucket, i) => (
      <div
        // outer div which hold the bucket contents and the label
        key={bucket.min}
        className="barContainer"
        style={{
          width: percentString(bucket.width),
        }}
      >
        <div
          // column of boxes stacked at the bottom
          className="bar"
        >
          {bucket.entries.map((entry) => (
            <Tooltip
              key={entry.color}
              title={
                <div>
                  <div>{entry.color}</div>
                  <div>value: {round(entry.value)}</div>
                </div>
              }
            >
              <div
                // individual color box
                className="barElement"
                style={{
                  backgroundColor: entry.color,
                  width: colorWidth,
                  height: colorHeight,
                }}
                onClick={() => logProfile(entry.color)}
              />
            </Tooltip>
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
