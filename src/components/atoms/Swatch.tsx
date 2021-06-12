import React from "react";
import { withHash } from "lib";
import { logProfile, CanGetHex } from "logic";

export interface Props {
  color: CanGetHex | string;
  size: number | string; // size is always used for the width.  If no height is passed, it is also the height.
  height?: number | string; // provides a way to make a rectangle
}

/**
 * will render properly with any CSS-supported string including hex, rgb, hsl, etc.
 * but expects a string color to be a hex in order to guarantee onClick logging
 * may work with other string types depending on the package implementation
 */
export const Swatch = ({ color, size, height }: Props) => {
  const hex = typeof color === "string" ? color : color.hex();
  return (
    <div
      style={{
        backgroundColor: withHash(hex),
        width: size,
        height: height || size,
      }}
      // eslint-disable-next-line
      onClick={() => logProfile(hex)}
    />
  );
};
