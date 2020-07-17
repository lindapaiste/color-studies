import React from "react";
import { Color, fromHex, getProfile } from "../../packages/";
import { I_GetHex } from "../../packages/color-adapter";
import { withHash } from "../../util";

export interface Props {
  color: I_GetHex | string;
  size: number | string; //size is always used for the width.  If no height is passed, it is also the height.
  height?: number | string; //provides a way to make a rectangle
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
        height: height || size
      }}
      onClick={() => logProfile(hex)}
    />
  );
};

export const logProfile = (color: Color | string): void => {
  const object = typeof color === "string" ? fromHex(color) : color;
  if (object) {
    //could also use alert here - alert allows \t and \n but not html
    console.log(getProfile(object));
  }
};
