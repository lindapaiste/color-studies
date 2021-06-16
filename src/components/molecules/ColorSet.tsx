import React, { ReactNode } from "react";
import { CanGetHex, isGetHex } from "logic";
import { FlexRow, Swatch, Tooltip } from "../atoms";

/**
 * takes an array of colors, which can be any format (string, tuple, object)
 * but unknown formats must also pass a colorToHex function
 */

interface BaseProps<T> {
  colors: T[];
  tooltips?: NonNullable<ReactNode>[];

  colorToHex?(color: T): string;

  colorToTooltip?(color: T): NonNullable<ReactNode>;

  onClickColor?(color: T): void;

  wrap?: boolean;
  // height refers to the height of each element if the set is wrapped
  height?: number | string;
}

/**
 * want to REQUIRE that colorToHex is present if T is not a string,
 * but make optional if color is already a string
 * can still include a color to string function if the colors need to be reformatted
 */
export type ColorSetProps<T> = BaseProps<T> &
  ({ colors: (string | CanGetHex)[] } | { colorToHex(color: T): string });

export const ColorSet = <T extends any>({
  colors,
  tooltips,
  colorToHex,
  colorToTooltip,
  wrap = false,
  height = 100,
  onClickColor,
}: ColorSetProps<T>) => {
  const findHex = (color: T): string => {
    if (colorToHex) return colorToHex(color);
    if (isGetHex(color)) return color.hex();
    if (typeof color === "string") return color;
    throw new Error(
      "Cannot convert color to string. Must provide prop `colorToHex`"
    );
  };

  return (
    <FlexRow
      wrap={wrap}
      style={{
        width: "100%",
        marginBottom: 10,
        flexWrap: wrap ? "wrap" : "nowrap",
      }}
    >
      {colors.map((color, i) => {
        const hex = findHex(color);
        return (
          <Tooltip
            // using hex as key caused visual bugs and error
            // "Children cannot be added or removed during a reorder operation"
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            title={colorToTooltip?.(color) ?? tooltips?.[i] ?? hex}
          >
            <Swatch
              color={hex}
              size={height}
              style={{
                flex: 1,
                minWidth: wrap ? height : undefined,
              }}
              onMouseDown={() => onClickColor?.(color)}
            />
          </Tooltip>
        );
      })}
    </FlexRow>
  );
};
