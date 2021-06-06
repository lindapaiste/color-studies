import React, { ComponentType } from "react";
import { StateUpdateProps, usePartialState } from "../../lib/util-hooks";
import { Size } from "../form/types";
import useDimensions from "../../lib/useDimensions";
import { Padding, Sides } from "./withPadding";
import { mapValues } from "../../lib";

/**
 * most tools share the same general format, where there is a controls section for updating settings
 * and then a render section which gets those settings as props
 *
 * this tool component uses the render props pattern and takes both sections as separate props
 * plus manages state internally
 * and can pass through extra props ( maybe )
 *
 * want to be able to pass the available screen size to the render
 * height can be hard to find, but can take the screen and subtract the menu and the tools height
 */

export interface Props<Settings> {
  initialSettings: Settings;
  RenderControls: ComponentType<StateUpdateProps<Settings>>;
  RenderContents: ComponentType<Settings & Size>;
  toolPadding?: number | string | Padding;
}

export const Tool = <Settings extends {}>({
  initialSettings,
  RenderControls,
  RenderContents,
  toolPadding = 0,
}: Props<Settings>) => {
  const [settings, update] = usePartialState<Settings>(initialSettings);
  const [ref, dimensions] = useDimensions();
  const { width = 0, height = 0, y = 0 } = dimensions;
  const padding = padAmounts({ width, toolPadding });
  const toolHeight =
    window.innerHeight -
    (Math.max(y, 0) + height + padding.top + padding.bottom);
  const toolWidth = width - (padding.left + padding.right);

  return (
    <div>
      <div ref={ref}>
        <RenderControls state={settings} update={update} />
      </div>
      <div
        style={{
          paddingLeft: padding.left,
          paddingRight: padding.right,
          paddingTop: padding.top,
          // don't include the bottom as a failsafe to prevent unnecessary scrolling
        }}
      >
        <RenderContents {...settings} width={toolWidth} height={toolHeight} />
      </div>
    </div>
  );
};

/**
 * parses percents into numbers based on the width
 * takes single numbers or percents and applies to each direction
 */
const padAmounts = ({
  width,
  toolPadding,
}: {
  width: number;
  toolPadding: number | string | Padding;
}): Record<Sides, number> => {
  // turn string percents into numbers and undefined into 0
  // percents are always based of width even if for top/bottom
  const handleValue = (value: string | number | undefined): number => {
    return typeof value === "number"
      ? value
      : typeof value === "string"
      ? Math.round((width * parseFloat(value)) / 100)
      : 0;
  };

  const fallback = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  if (typeof toolPadding === "object") {
    // can't use map values alone because it might have missing keys
    return {
      ...fallback,
      ...mapValues(toolPadding, handleValue),
    };
  } else {
    const value = handleValue(toolPadding);
    return mapValues(fallback, () => value);
  }
};
