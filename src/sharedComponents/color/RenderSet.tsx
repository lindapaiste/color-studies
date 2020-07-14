import React from "react";
import {logProfile} from "./Swatch";
import {isDefined, withHash} from "../../util";
import {I_GetHex, isGetHex} from "../../packages/color-adapter";

/**
 * takes an array of colors, which can be any format (string, tuple, object)
 * but unknown formats must also pass a colorToString function
 */

export interface BaseProps<T> {
  colors: T[];
  colorToString?(color: T): string;
  wrap?: boolean;
}

/**
 * want to REQUIRE that colorToString is present if T is not a string,
 * but make optional if color is already a string
 * can still include a color to string function if the colors need to be reformatted
 */

export type PropsSingle<T> = T extends (string | I_GetHex)
  ? BaseProps<T>
  : BaseProps<T> & Required<Pick<BaseProps<T>, "colorToString">>;

export type PropsMulti<T> = Omit<PropsSingle<T>, "colors"> & {
  sets: T[][];
};

export const RenderSet = <T extends any>({
  colors,
  colorToString,
  wrap = false
}: PropsSingle<T>) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      marginBottom: "10%",
      flexWrap: wrap ? "wrap" : "nowrap"
    }}
  >
    {colors.map((color, i) => {
        console.log({
            colorToString,
            isDefined: isDefined(colorToString),
            isGetHex: isGetHex(color),
        });
      const hex = isDefined(colorToString) ? colorToString(color) : isGetHex( color ) ? color.hex() : color;
      return (
        <div
          key={i}
          style={{
            backgroundColor: withHash(hex),
            height: "100px",
            flex: 1,
            minWidth: wrap ? "100px" : undefined
          }}
          onClick={() => logProfile(hex)}
        />
      );
    })}
  </div>
);

export const RenderSets = <T extends any>({
  sets,
  ...props
}: PropsMulti<T>) => (
  <div>
    {sets.map((colors, i) => (
      <RenderSet {...props} colors={colors} key={i} />
    ))}
  </div>
);
