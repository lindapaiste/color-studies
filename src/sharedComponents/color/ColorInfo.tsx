import React from "react";
import {ColorAdapter, I_ColorAdapter} from "../../packages/ColorAdapter";
import {ChannelName, ColorSpaceName} from "../../spacesChannels/types";
import {CHANNEL_NAMES, normalize} from "../../spacesChannels/channelMaxes";
import {nameToAccessor} from "../../spacesChannels/accessorConversion";
import {ValuesTable} from "../ui/ValuesTable";
import {DataTable} from "../ui/DataTable";
import {Accordion} from "../ui/Accordion";
import {proper, round} from "../../lib";

export interface Props {
    color: I_ColorAdapter | string;
    initialOpen?: boolean;
}

/* took off color space values in favor of channel values

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
 */

export const ColorInfo = ({color, initialOpen = true}: Props) => {
    const _color =
        typeof color === "string"
            ? new ColorAdapter(color)
            : color;

    return (
            <Accordion title="Channel Values" initialOpen={initialOpen}>
                <ChannelValuesTable color={_color}/>
            </Accordion>
    );
};

/**
 * displays both the number (out of 255, 100, etc.) and the normalized decimal value
 * just the table, not the accordion
 */
export const ChannelValuesTable = ({color}: { color: I_ColorAdapter }) => (
    <DataTable
        labels={["Channel", "Value", "Normalized"]}
        rows={CHANNEL_NAMES.map(name => {
            const value = color.get(nameToAccessor(name));
            return [
                proper(name),
                round(value, 0),
                round(normalize(value, name), 3)
            ];
        })}
    />
);
