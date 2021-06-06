import React from "react";
import { DataTable } from "../ui/DataTable";
import { Accordion } from "../ui/Accordion";
import { I_ColorAdapter } from "../../color/types";
import { eitherToColor } from "../../color";
import { allChannels } from "../../spacesChannels/channels";

export interface Props {
  color: I_ColorAdapter | string;
  initialOpen?: boolean;
}

/* took off color space values in favor of channel values

    // can display this much more nicely
    const renderColorSpace = (cs: ColorSpaceName) => {
        const values = color.to(cs, true);
        const letters = cs.split("");
        return (
            <>
                <span>{cs.toUpperCase}</span>
                {letters.map((letter, i) => (
                    <span key={letter}>
            {letter.toUpperCase()}: {values[i]}
          </span>
                ))}
            </>
        );
    };


    const spaces: ColorSpaceName[] = ["rgb", "hsl", "cmyk", "hsv", "lab", "lch"];
 */

/**
 * at some point might add back grouping by colorspace, but I do like sorting by normalized across all channels
 */
export const ColorInfo = ({ color, initialOpen = true }: Props) => (
  <Accordion title="Channel Values" initialOpen={initialOpen}>
    <ChannelValuesTable color={eitherToColor(color)} />
  </Accordion>
);

/**
 * displays both the number (out of 255, 100, etc.) and the normalized decimal value
 * just the table, not the accordion
 */
export const ChannelValuesTable = ({ color }: { color: I_ColorAdapter }) => (
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
