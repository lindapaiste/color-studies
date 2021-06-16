import React, { ComponentType, PropsWithChildren } from "react";

/**
 * can wrap the controls render in a "withPadding" HOC
 * adds a padded div around the whole thing rather than passing a style prop
 */

/**
 * right now it does work, but type is not being properly inferred and it getting cast down to something more basic,
 * ie. [number, number] to number[]
 * so have to specify the generic
 * ie. RenderControls={withPadding<ToolControlProps<ToolSettings>>(HistogramControls, {bottom: 20})}
 */
export type Sides = "top" | "left" | "right" | "bottom";
export type Padding = Partial<Record<Sides, string | number>>;

export const withPadding =
  <Props extends {}>(
    Component: ComponentType<Props>,
    padding: number | string | Padding
  ) =>
  (props: PropsWithChildren<Props>) => {
    const style =
      typeof padding === "object"
        ? {
            paddingLeft: padding.left,
            paddingRight: padding.right,
            paddingTop: padding.top,
            paddingBottom: padding.bottom,
          }
        : { padding };
    return (
      <div style={style}>
        <Component {...props} />
      </div>
    );
  };
