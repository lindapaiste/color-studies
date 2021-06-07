import React from "react";
import { withHash, Size } from "lib";
import {
  ChannelGradient,
  Props as GradientProps,
} from "logic/gradient/ChannelGradient";

/**
 * a continuous gradient of color,
 * made by adjusting an initial color along one channel
 *
 * unlike the ChannelGradient component, this doesn't use ColorSet because don't want to display detailed color info
 */

export type Props = GradientProps &
  Partial<Size> & {
    count?: number;
  };

export const GradientBar = ({ width, height, count, ...props }: Props) => {
  // will use passed-in count, or 1 per pixel if width is set, or 100
  const colorCount = count ?? width ?? 100;
  const gradient = new ChannelGradient(props);
  return (
    <div
      style={{
        display: "flex",
        width: width || "100%",
        height: height || 50,
      }}
    >
      {gradient.colors(colorCount).map((color) => (
        <div
          key={color.hex()}
          style={{
            flex: 1,
            height,
            backgroundColor: withHash(color.hex()),
          }}
        />
      ))}
    </div>
  );
};
