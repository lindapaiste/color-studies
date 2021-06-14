import React from "react";
import { Accordion } from "components";
import { ColorAdapter, toColorAdapter } from "logic";
import { ChannelValuesTable } from "./ChannelValuesTable";

export interface Props {
  color: ColorAdapter | string;
  initialOpen?: boolean;
}

/**
 * took off color space values in favor of channel values
 * at some point might add back grouping by colorspace, but I do like sorting by normalized across all channels
 */
export const ExpandableColorInfo = ({ color, initialOpen = true }: Props) => (
  <Accordion title="Channel Values" initialOpen={initialOpen}>
    <ChannelValuesTable color={toColorAdapter(color)} />
  </Accordion>
);
