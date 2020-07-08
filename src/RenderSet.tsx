import React from "react";

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

export type PropsSingle<T> = T extends string
  ? BaseProps<T>
  : BaseProps<T> & Required<Pick<BaseProps<T>, "colorToString">>;

export type PropsMulti<T> = Omit<PropsSingle<T>, "colors"> & {
  sets: T[][];
};

export const RenderSet = <T extends any>({
  colors,
  colorToString = c => c,
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
      console.log("color", color, "string", colorToString(color));
      return (
        <div
          key={i}
          style={{
            backgroundColor: colorToString(color),
            height: "100px",
            flex: 1,
            minWidth: wrap ? "100px" : undefined
          }}
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
