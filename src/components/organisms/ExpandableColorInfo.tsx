import React from "react";
import { Accordion } from "components";
import { IColorAdapter } from "logic/color/types";
import { eitherToColor } from "logic/color";
import { ChannelValuesTable } from "./ChannelValuesTable";

export interface Props {
  color: IColorAdapter | string;
  initialOpen?: boolean;
}

/**
 * took off color space values in favor of channel values
 * at some point might add back grouping by colorspace, but I do like sorting by normalized across all channels
 */
export const ExpandableColorInfo = ({ color, initialOpen = true }: Props) => (
  <Accordion title="Channel Values" initialOpen={initialOpen}>
    <ChannelValuesTable color={eitherToColor(color)} />
  </Accordion>
);
