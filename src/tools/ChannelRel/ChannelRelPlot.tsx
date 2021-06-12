import React, { useMemo } from "react";
import {
  CartesianGrid,
  ScatterChart,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { intervals, Size } from "lib";
import { colorToPoint } from "../PlotFeatures/PlotFeatures";
import { Settings } from "./settings";
import { randomColors } from "../../logic/convert/random";

export const ChannelRelPlot = ({
  xChannel,
  yChannel,
  colorCount,
  stepCount,
  width,
  height,
}: Settings & Partial<Size>) => {
  const colors = useMemo(() => randomColors(colorCount), [colorCount]);

  /**
   * each initial color becomes one line
   * the points on that line are made from transforming the x-axis property
   */
  const lines = useMemo(
    () =>
      colors.map((initial) => {
        // x values are evenly spaces increments
        const xs = intervals(xChannel.min, xChannel.max, stepCount);
        // y values are calculated by setting the x
        const points = xs
          .map((x) => initial.set(xChannel, x))
          .map(colorToPoint(xChannel, yChannel));
        return {
          name: initial.hex(),
          color: initial.hex(),
          points,
        };
      }),
    [xChannel, yChannel, colors, stepCount]
  );

  return (
    <ScatterChart width={width} height={height} data={lines}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="x"
        name={xChannel.name}
        label={xChannel.name}
        type="number"
      />
      <YAxis
        dataKey="y"
        name={yChannel.name}
        label={yChannel.name}
        type="number"
      />
      <Tooltip />
      {lines.map(({ points, color, name }) => (
        <Scatter
          key={name}
          name={name}
          fill={color}
          line
          data={points}
          legendType="none"
        />
      ))}
    </ScatterChart>
  );
};
