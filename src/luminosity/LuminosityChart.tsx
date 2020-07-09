import React from "react";
import Color from "color";
import { range } from "lodash";
import Plot from "react-plotly.js";
import {Data} from "plotly.js";
import { randomRgb } from "../rgb";

/**
 * plotting brightness against luminosity to find how they relate
 */
export const LuminosityChart = ({ colors }: { colors: Color[] }) => {
  const traces: Data[] = colors.map(color => {
    const { x, y } = pointsToVectors(getPoints(color));
    return {
      x,
      y,
      mode: "lines",
      type: "scatter",
      line: {
        color: color.hex()
      }
    };
  });
  return (
    <Plot
      data={traces}
      layout={{ showlegend: false, width: 1400, height: 1000 }}
    />
  );
};

/**
 * separate the points calculation from the chart render component
 * so that the points can be used for regression analysis
 * allow for customization of the brightness range because of the break in the line at 50
 * but default to range(0, 100, 5)
 */
export const getPoints = (
  color: Color,
  min: number = 0,
  max: number = 100,
  step: number = 5
): PointTuple[] => {
  return range(min, max, step).map(lightness => [
    lightness,
    color.lightness(lightness).luminosity()
  ]);
};

export type PointTuple = [number, number];

/**
 * convert an array of [x,y] vectors to an array of x values and another of y values
 */
export const pointsToVectors = (
  points: PointTuple[]
): { x: number[]; y: number[] } => {
  return {
    x: points.map(([x]) => x),
    y: points.map(([_, y]) => y)
  };
};

/**
 * lines for 100 random colors
 */
export const Sample = () => {
  const colors = range(0, 100)
    .map(randomRgb)
    .map(rgb => Color.rgb(rgb));
  return <LuminosityChart colors={colors} />;
};
