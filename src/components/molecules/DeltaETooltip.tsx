import React from "react";
import { DebugDeltaE } from "logic/difference/Calculation";
import { round } from "lib";

/**
 * for each channel, show the channel name, value, and how much it differs from the target
 *
 * since all channels are in the same colorspace, don't include the colorspace in the title
 *
 * originally had this in the Calculation class, but I prefer the classes to not use React
 */
export const DeltaETooltip = ({ channelDiffs }: DebugDeltaE) => (
  <>
    {channelDiffs.map(({ value, diff, channel }) => (
      <div key={channel.key}>
        {channel.properName}: {round(value)} ({diff > 0 ? "+" : "-"}
        {round(diff)})
      </div>
    ))}
  </>
);
