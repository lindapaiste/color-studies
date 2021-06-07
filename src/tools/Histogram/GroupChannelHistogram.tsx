import React from "react";
import { getGroupHexes } from "data";
import { Size } from "lib";
import { hexToColor } from "logic/color";
import { ToolSettings } from "./types";
import { createBuckets } from "./createBuckets";
import { RenderAutoSizeHistogram } from "./AutosizeHistogram";

/**
 * combines the computation and the render
 */
export const GroupChannelHistogram = (
  props: ToolSettings & Partial<Size> & { padPercent?: number }
) => {
  const { channel, breakpoints, group } = props;
  const buckets = createBuckets({
    hexToValue: (hex) => hexToColor(hex).get(channel),
    hexes: getGroupHexes(group),
    breakpoints,
  });
  return <RenderAutoSizeHistogram {...props} buckets={buckets} />;
};

export default GroupChannelHistogram;
