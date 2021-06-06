import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { logProfile } from "./Swatch";
import { isDefined, withHash } from "../../lib";
import { Tooltip } from "../ui/Tooltip";
import { I_GetHex } from "../../color/types";
import { isGetHex } from "../../color";

/**
 * takes an array of colors, which can be any format (string, tuple, object)
 * but unknown formats must also pass a colorToString function
 */

export interface BaseProps<T> {
  colors: T[];
  tooltips?: NonNullable<ReactNode>[];

  colorToString?(color: T): string;

  colorToTooltip?(color: T): NonNullable<ReactNode>;

  wrap?: boolean;
  // height refers to the height of each element if the set is wrapped
  height?: number | string;
}

/**
 * want to REQUIRE that colorToString is present if T is not a string,
 * but make optional if color is already a string
 * can still include a color to string function if the colors need to be reformatted
 */
export type Props<T> = BaseProps<T> &
  ({ colors: (string | I_GetHex)[] } | { colorToString(color: T): string });

export const RenderSet = <T extends any>({
  colors,
  tooltips,
  colorToString,
  colorToTooltip,
  wrap = false,
  height = 100,
}: Props<T>) => {
  const findHex = (color: T): string => {
    if (colorToString) return colorToString(color);
    if (isGetHex(color)) return color.hex();
    if (typeof color === "string") return color;
    throw new Error(
      "Cannot convert color to string. Must provide prop `colorToString`"
    );
  };

  return (
    <SetWrapper wrap={wrap}>
      {colors.map((color, i) => {
        const hex = findHex(color);
        return (
          <Tooltip
            key={i}
            title={colorToTooltip?.(color) ?? tooltips?.[i] ?? hex}
          >
            <div
              style={{
                backgroundColor: withHash(hex),
                height,
                flex: 1,
                minWidth: wrap ? height : undefined,
              }}
              onClick={() => logProfile(hex)}
            />
          </Tooltip>
        );
      })}
    </SetWrapper>
  );
};

export const SetWrapper = ({
  children,
  wrap,
}: PropsWithChildren<{ wrap: boolean }>) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      marginBottom: 10,
      flexWrap: wrap ? "wrap" : "nowrap",
    }}
  >
    {children}
  </div>
);
