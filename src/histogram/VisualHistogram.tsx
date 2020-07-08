import React from "react";
import "./histogram.css";
import {CalcProps, RenderProps} from "./types";
import {createBuckets} from "./createBuckets";
import {RenderHistogram} from "./RenderHistogram";

/**
 * merely combines the computation with the renderer
 */
export const VisualHistogram = (
  props: CalcProps & Pick<RenderProps, 'colorSize'> //from some unknown reason omit led to upstream errors Omit<RenderProps, 'buckets'>
) => {
  return <RenderHistogram {...props} buckets={createBuckets(props)} />;
};

