import React from "react";
import { Size } from "lib";
import { ColorAdapter, hexToColor } from "logic";
import { Field } from "./Field";
import { GenericProps, WithoutE } from "./types";
import { RandomizeColor } from "./RandomizeColor";

export type Props = Partial<Size> &
  /**
   * need to remove the second parameter e: ChangeEvent from the callback
   * so that it can be called by randomize button
   */
  WithoutE<GenericProps<ColorAdapter>> & {
    /**
     * If true, show a randomize icon.
     */
    randomize?: boolean;
    /**
     * className gets passed to the wrapper div. Is used by <ControlRow>
     */
    className?: string;
  };

/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 *
 * previously had separate implementations for value formats hex and ColorAdapter
 * now just using ColorAdapter as the core
 */
export const SelectColor = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      value,
      onChange,
      // Note: width: 113 makes it the same size as standard text, but looks a little odd
      width = 100,
      // same height as MUI text inputs
      height = 46,
      randomize = false,
      className,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={className} style={{ display: "flex" }}>
      <Field
        {...props}
        style={{ flex: 1, ...props.style }}
        value={value ? value.hex() : undefined}
        onChange={(hex) => onChange(hexToColor(hex))}
        inputProps={{
          type: "color",
          style: {
            width: "100%",
            minWidth: width,
            height,
            padding: 5,
          },
        }}
      />
      {randomize && <RandomizeColor onChange={onChange} />}
    </div>
  )
);
