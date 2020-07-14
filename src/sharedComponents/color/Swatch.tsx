import React from "react";
import {Color, fromHex, getProfile} from "../../packages/";
import {I_GetHex} from "../../packages/color-adapter";

export interface Props {
    color: I_GetHex | string;
    size: number;
}

/**
 * will render properly with any CSS-supported string including hex, rgb, hsl, etc.
 * but expects a string color to be a hex in order to guarantee onClick logging
 * may work with other string types depending on the package implementation
 */
export const Swatch = ({color, size}: Props) => {
    const hex = typeof color === "string" ? color : color.hex();
    return (
        <div
            style={{
                backgroundColor: hex,
                width: size + "px",
                height: size + "px"
            }}
            onClick={() => logProfile(hex)}
        />
    )
};

export const logProfile = (color: Color | string): void => {
    const object = typeof color === "string" ? fromHex(color) : color;
    if ( object ) {
        //could also use alert here - alert allows \t and \n but not html
        console.log(getProfile(object));
    }
};
