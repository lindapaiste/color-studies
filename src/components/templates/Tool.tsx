import React, { ComponentType } from "react";
import { Size } from "lib";
import { StateUpdateProps, usePartialState } from "lib/util-hooks";
import useDimensions from "lib/useDimensions";
import { Padding } from "./withPadding";
import { padAmounts } from "./padAmounts";

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
