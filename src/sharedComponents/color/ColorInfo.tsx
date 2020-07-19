import React from "react";
import {ColorAdapter, I_ColorAdapter} from "../../packages/color-adapter";
import {ColorSpaceName} from "../../spacesChannels/types";
import {CHANNEL_NAMES, normalize} from "../../spacesChannels/channelMaxes";
import {nameToAccessor} from "../../spacesChannels/accessorConversion";
import {ValuesTable} from "../ui/ValuesTable";
import {DataTable} from "../ui/DataTable";
import {Accordion} from "../ui/Accordion";
import startCase from "lodash/startCase";
import round from "lodash/round";

export interface Props {
    color: I_ColorAdapter | string;
    initialOpen?: boolean;
}

export const ColorInfo = (props: Props) => {
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
            <Accordion title="Channel Values" initialOpen={true}>
                <ChannelValuesTable color={color}/>
            </Accordion>
        </div>
    );
};

/**
 * just the table, not the accordion
 */
export const _ChannelValuesTable = ({color}: { color: I_ColorAdapter }) => (
    <ValuesTable
        data={CHANNEL_NAMES.map(name => [name, color.get(nameToAccessor(name))])}
    />
);

export const ChannelValuesTable = ({color}: { color: I_ColorAdapter }) => (
    <DataTable
        labels={["Channel", "Value", "Normalized"]}
        rows={CHANNEL_NAMES.map(name => {
            const value = color.get(nameToAccessor(name));
            return [
                startCase(name),
                round(value, 2),
                round(normalize(value, name), 3)
            ];
        })}
    />
);
