import React, { ComponentType, FunctionComponent, useState } from "react";
import { debounce } from "lodash";
import { ColorAdapter, randomColor } from "logic";
import { Props as SelectProps, SelectColor } from "../atoms/SelectColor";
/**
 * for tools which are initialized with a random color,
 * but now can allow that color to be changed
 */

/**
 * need to debounce/throttle the color being being passed down
 * because it can change rapidly when dragging
 * and wrapped component may have expensive operations dependent on color
 */

type ExtraProps = Omit<SelectProps, "value" | "onChange">;

export const withSelectableColor =
  <P extends { color: ColorAdapter }>(
    Component: ComponentType<P>,
    selectColorProps: ExtraProps = {}
  ): FunctionComponent<Omit<P, "color">> =>
  (props) => {
    const [color, setColor] = useState(randomColor());
    // const [cachedColor, setCachedColor] = useState(randomColor());

    const onChange = debounce(setColor, 250, { trailing: true });

    return (
      <div>
        <SelectColor
          label="Select Color"
          randomize
          {...selectColorProps}
          value={color}
          onChange={onChange}
        />
        <Component {...({ ...props, color } as P)} />
      </div>
    );
  };
