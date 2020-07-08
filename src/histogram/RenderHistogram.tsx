import {RenderProps} from "./types";
import React from "react";
import {round} from "lodash";

//should I randomize within each bucket?
export const RenderHistogram = ({buckets, colorSize}: RenderProps) => {
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
