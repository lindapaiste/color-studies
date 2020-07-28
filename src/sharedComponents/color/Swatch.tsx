import React from "react";
import {ColorAdapter} from "../../color/ColorAdapter";
import { withHash } from "../../lib";
import {CHANNEL_NAMES} from "../../spacesChannels/channelMaxes";
import {nameToAccessor} from "../../spacesChannels/accessorConversion";
import {I_ColorAdapter, I_GetHex} from "../../color/types";
import {eitherToColor} from "../../color";

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

export const logProfile = (color: I_ColorAdapter | string): void => {
    //use try catch because not all strings are valid colors
    try {
        const object = eitherToColor(color);
        const profile = Object.fromEntries( CHANNEL_NAMES.map( name => [name, object.get(nameToAccessor(name))]))
        //could also use alert here - alert allows \t and \n but not html
        console.log(profile);
    } catch (e) {
        console.log(e);
    }
};
