import React from "react";
import { Size } from "lib";
import { IColorAdapter } from "logic/color/types";
import { hexToColor } from "logic/color";
import { Field } from "./Field";
import { GenericProps, WithoutE } from "./types";
import { RandomizeColor } from "./RandomizeColor";

/**
 * need to remove the second parameter e: ChangeEvent from the callback
 * so that it can be called by randomize button
 */
export type Props = Partial<Size> &
  WithoutE<GenericProps<IColorAdapter>> & {
    randomize?: boolean;
  };

/**
 * uses HTML 5 color-picker input
 * can apply any CSS style properties to it
 * right now just passing width and height but leaving the borders
 *
 * previously had separate implementations for value formats hex and IColorAdapter
 * now just using IColorAdapter as the core
 */
export const SelectColor = React.forwardRef<HTMLDivElement, Props>(
  (
    { value, onChange, width = 100, height = 40, randomize = false, ...props },
    ref
  ) => (
    <div ref={ref}>
      <Field
        {...props}
        value={value ? value.hex() : undefined}
        onChange={(hex) => onChange(hexToColor(hex))}
        inputProps={{
          type: "color",
          style: {
            width,
            height,
            padding: 5,
          },
        }}
      />
      {randomize && <RandomizeColor onChange={onChange} />}
    </div>
  )
);
