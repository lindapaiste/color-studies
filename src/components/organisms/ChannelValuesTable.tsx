import React from "react";
import { IColorAdapter } from "logic/color/types";
import { allChannels } from "logic/spacesChannels/channels";
import { DataTable } from "../molecules";

/**
 * displays both the number (out of 255, 100, etc.) and the normalized decimal value
 * just the table, not the accordion
 */
export const ChannelValuesTable = ({ color }: { color: IColorAdapter }) => (
  <DataTable
    labels={["Channel", "Value", "Normalized"]}
    rows={allChannels().map((channel) => [
      channel.title,
      // whole number rounded channel value
      color.get(channel, false, 0),
      // normalized decimal value with 3 places
      color.get(channel, true, 3),
    ])}
  />
);
