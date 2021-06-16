import React, { ComponentType, useCallback } from "react";
import { Size } from "lib";
import { StateUpdateProps, usePartialState } from "lib/usePartialState";
import useDimensions from "lib/useDimensions";
import { Padding } from "./withPadding";
import { padAmounts } from "./padAmounts";

/**
 * Most tools share the same general format, where there is a
 * controls section for updating settings and then a
 * render section which gets those settings as props.
 *
 * This <Tool> component uses the render props pattern and takes both
 * sections as separate props.
 * It manages the settings state internally.
 */

export interface ToolControlProps<T> extends StateUpdateProps<T> {
  /**
   * Controls receives the complete settings state
   */
  state: T;
  /**
   * Update callback can take a partial object
   * onChange={(newValue) => update({width: newValue})}
   */
  update: (partial: Partial<T>) => void;
  /**
   * Can use a property name to create an onChange handler.
   * onChange={handle('width')}
   */
  handle: <K extends keyof T>(key: K) => (value: T[K]) => void;
}

export interface Props<Settings> {
  /**
   * Sets the initial state for the tool and the controls.
   * Any properties which are required in the Settings type must be provided.
   */
  initialSettings: Settings;
  /**
   * Component to render the controls.
   * Receives the `state` as well as `update` and `handle` functions.
   */
  RenderControls: ComponentType<ToolControlProps<Settings>>;
  /**
   * Component to render the chart/graph/table/etc.
   * Receives the settings as individual props as well as the size of the contents area.
   * Note: height can be hard to find, but could take the screen and subtract the menu and the tools height.
   */
  RenderContents: ComponentType<Settings & Size>;
  /**
   * Can optionally effect the width and height by setting padding on the tool.
   */
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

  const handle = useCallback(
    <K extends keyof Settings>(key: K) =>
      (value: Settings[K]) =>
        update({
          ...{}, // hack to fix TS issues
          [key]: value,
        }),
    [update]
  );

  return (
    <div>
      <div ref={ref}>
        <RenderControls state={settings} update={update} handle={handle} />
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
 * Toying with a higher-order component pattern instead.
 */
export const createTool =
  <Settings,>(
    initialSettings: Settings,
    RenderControls: ComponentType<ToolControlProps<Settings>>,
    RenderContents: ComponentType<Settings & Size>,
    toolPadding?: number | string | Padding
  ) =>
  () =>
    (
      <Tool
        initialSettings={initialSettings}
        RenderControls={RenderControls}
        RenderContents={RenderContents}
        toolPadding={toolPadding}
      />
    );
