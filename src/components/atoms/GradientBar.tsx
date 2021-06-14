import React from "react";
import { Size, uniq, withHash } from "lib";
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

export const GradientBar = ({
  width,
  height,
  count,
  initial,
  channel,
  transform,
  start,
  end,
}: Props) => {
  // will use passed-in count, or 1 per pixel if width is set, or 100
  const colorCount = count ?? width ?? 100;
  const gradient = new ChannelGradient({
    initial,
    channel,
    transform,
    start,
    end,
  });
  // drop non-unique hexes (repetition at the ends of unreachable ranges);
  const hexes = uniq(gradient.colors(colorCount).map((c) => c.hex()));
  const iHex = initial.hex();
  return (
    <div
      style={{
        display: "flex",
        width: width || "100%",
        height: height || 50,
      }}
    >
      {hexes.map((hex) => (
        <div
          // hex alone does not work as key when changing the channel
          key={`${hex}${channel.key}${iHex}`}
          style={{
            flex: 1,
            height,
            backgroundColor: withHash(hex),
          }}
        />
      ))}
    </div>
  );
};
