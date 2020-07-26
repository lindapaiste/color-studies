import React, {PropsWithChildren, ReactNode} from "react";
import {logProfile} from "./Swatch";
import {isDefined, withHash} from "../../lib";
import {I_GetHex, isGetHex} from "../../packages/ColorAdapter";
import {Tooltip} from "../ui/Tooltip";

/**
 * takes an array of colors, which can be any format (string, tuple, object)
 * but unknown formats must also pass a colorToString function
 */

export interface BaseProps<T> {
    colors: T[];
    tooltips?: ReactNode[];

    colorToString?(color: T): string;

    colorToTooltip?(color: T): ReactNode;

    wrap?: boolean;
    //height refers to the height of each element if the set is wrapped
    height?: number | string;
}

/**
 * want to REQUIRE that colorToString is present if T is not a string,
 * but make optional if color is already a string
 * can still include a color to string function if the colors need to be reformatted
 */

export type Props<T> = T extends (string | I_GetHex)
    ? BaseProps<T>
    : BaseProps<T> & Required<Pick<BaseProps<T>, "colorToString">>;

export const RenderSet = <T extends any>({colors, tooltips, colorToString, colorToTooltip, wrap = false, height = 100}: Props<T>) => (
    <SetWrapper wrap={wrap}>
        {colors.map((color, i) => {
            const hex = isDefined(colorToString)
                ? colorToString(color)
                : isGetHex(color)
                    ? color.hex()
                    : color;
            return (
                <Tooltip
                    key={i}
                    title={isDefined(colorToTooltip) ? colorToTooltip(color) : isDefined(tooltips) ? tooltips[i] : hex}
                >
                    <div
                        style={{
                            backgroundColor: withHash(hex),
                            height,
                            flex: 1,
                            minWidth: wrap ? height : undefined
                        }}
                        onClick={() => logProfile(hex)}
                    />
                </Tooltip>
            );
        })}
    </SetWrapper>
);

export const SetWrapper = ({children, wrap}: PropsWithChildren<{ wrap: boolean }>) => (
    <div
        style={{
            width: "100%",
            display: "flex",
            marginBottom: 10,
            flexWrap: wrap ? "wrap" : "nowrap"
        }}
    >
        {children}
    </div>
);
