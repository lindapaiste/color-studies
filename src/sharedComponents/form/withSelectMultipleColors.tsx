import React, { ComponentType, FunctionComponent, useState } from "react";
import { I_ColorAdapter, randomColor } from "../../packages/ColorAdapter";
import { makeArray } from "../../lib";
import {SelectMultipleColors, Props} from "./SelectMultipleColors";

/**
 * works the same way as withSelectableColor, but for an array of colors instead of just one
 */
export const withSelectMultipleColors = <
  P extends { colors: I_ColorAdapter[] }
>(
  Component: ComponentType<P>,
  selectProps: Partial<Props> & {initialCount?: number} = {},
): FunctionComponent<Omit<P, "colors">> => props => {
    /**
     * can initialize with an array of colors through prop value
     * or an array of random colors with prop initialCount
     */
    const getInitial = () => {
        const {value, initialCount = 3} = selectProps;
        return value || makeArray(initialCount, randomColor);
    }

  const [colors, setColors] = useState( getInitial() );

  return (
    <div>
        <SelectMultipleColors
            label="Select Colors"
            {...selectProps}
            value={colors}
            onChange={setColors}
        />
      <Component {...{ ...props, colors } as P} />
    </div>
  );
};
