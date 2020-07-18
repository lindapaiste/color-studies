import React from "react";
import { Swatch } from "./Swatch";
import { ColorAdapter, I_ColorAdapter } from "../../packages/color-adapter";
import { ColorSpaceName, ChannelName } from "../../spacesChannels/types";
import { CHANNEL_NAMES } from "../../spacesChannels/channelMaxes";
import { nameToAccessor } from "../../spacesChannels/accessorConversion";
import { ValuesTable } from "../ui/ValuesTable";
import { Accordian } from "../ui/Accordian";

export interface Props {
  color: I_ColorAdapter | string;
  initialOpen?: boolean;
}

export const RenderColorInfo = (props: Props) => {
  const color =
    typeof props.color === "string"
      ? new ColorAdapter(props.color)
      : props.color;

  //can display this much more nicely
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

  return (
    <div>
      <ul>
        {spaces.map(cs => (
          <li key={cs}>{renderColorSpace(cs)}</li>
        ))}
      </ul>
      <Accordian title="Channel Values" initialOpen={true}>
        <ChannelValuesTable color={color} />
      </Accordian>
    </div>
  );
};

/**
 * just the table, not the accordian
 */
export const ChannelValuesTable = ({ color }: { color: I_ColorAdapter }) => (
  <ValuesTable
    data={CHANNEL_NAMES.map(name => [name, color.get(nameToAccessor(name))])}
  />
);
