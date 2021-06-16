import React, { CSSProperties, forwardRef } from "react";
import { withHash } from "lib";
import { CanGetHex, logProfile } from "logic";

export interface SwatchProps {
  /**
   * The color to display -- either a hex or a ColorAdapter
   */
  color: CanGetHex | string;
  /**
   * Size is always used for the width.  If no height is passed, it is also the height.
   */
  size: number | string;
  /**
   * Can make a rectangle of any aspect ratio by providing the height.
   */
  height?: number | string;
  /**
   * Can optionally provide additional styles to merge with the created styles.
   */
  style?: CSSProperties;
}
/**
 * Allow for arbitrary additional properties in over to override the onClick behavior.
 * Must remove potential conflicts for `color` prop.
 */
type Props = SwatchProps &
  Omit<JSX.IntrinsicElements["div"], keyof SwatchProps>;

/**
 * A Swatch component is a square div of a particular color.
 * When clicking on the div, logs detailed information to the console.
 * Must forwardRef in order to be used inside of a <Tooltip>.
 */
export const Swatch = forwardRef<HTMLDivElement, Props>(
  ({ color, size, height, style, ...rest }, ref) => {
    const hex = typeof color === "string" ? color : color.hex();
    return (
      <div
        ref={ref}
        style={{
          backgroundColor: withHash(hex),
          width: size,
          height: height || size,
          ...style,
        }}
        // eslint-disable-next-line
        onClick={() => logProfile(hex)}
        {...rest}
      />
    );
  }
);
