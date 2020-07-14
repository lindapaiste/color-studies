import React, {ChangeEvent} from "react";
import {ColorAdapter, I_ColorAdapter} from "../../packages/color-adapter";

/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 */

export interface Props<T> {
    color: T | undefined;
    width?: number;
    height?: number;
    onChange(hex: T, e: ChangeEvent<HTMLInputElement>): void;
}

export const SelectHex = ({color, onChange, width = 100, height = 40}: Props<string>) => (
    <input
        type={"color"}
        value={color}
        onChange={e => onChange(e.target.value, e)}
        style={{
            width,
            height,
        }}
    />
);

/**
 * SelectColor passes through to SelectHex since the base HTML element uses hex
 */

export const SelectColor = ({color, onChange, ...props}: Props<I_ColorAdapter>) => (
    <SelectHex
        {...props}
        color={color ? color.hex() : undefined}
        onChange={(hex, e) => onChange(new ColorAdapter(hex), e)}
    />
);


