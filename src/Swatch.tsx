import React from "react";
import {Color, fromHex, getProfile} from "./properties";

export interface Props {
    color: Color | string;
    size: number;
}

/**
 * will render properly with any CSS-supported string including hex, rgb, hsl, etc.
 * but expects a string color to be a hex in order to guarantee onClick logging
 * may work with other string types depending on the package implementation
 */
export const Swatch = ({color, size}: Props) => {
    return (
        <div
            style={{
                backgroundColor: typeof color === "string" ? color : color.string(),
                width: size + "px",
                height: size + "px"
            }}
            onClick={() => logProfile(color)}
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
