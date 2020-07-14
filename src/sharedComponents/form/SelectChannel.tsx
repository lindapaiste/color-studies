import React, {ChangeEvent} from "react";
import {ChannelAccessor, ChannelName, ChannelObjectAll} from "../../spacesChannels/types";
import {GROUPED_ACCESSORS, KEYED_ACCESSORS} from "../../spacesChannels/colorSpaces";

/**
 * should color space matter for channels which appear in multiple color spaces?
 * meaning - are they the same? or different?
 *
 * what format should the prop be - name? accessor?
 */

export interface Props {
    name: ChannelName | undefined | null;

    onChange(name: ChannelName, accessors: ChannelAccessor[], e: ChangeEvent<HTMLSelectElement>): void;
}

export const SelectChannel = ({name, onChange}: Props) => (
    <select
        value={name || ''}
        onChange={e => {
            const name = e.target.value as ChannelName;
            onChange(name, KEYED_ACCESSORS[name], e)
        }}
    >
        {GROUPED_ACCESSORS.map(({name, accessors}) => (
            <option key={name} value={name}>{optionTitle({name, accessors})}</option>
        ))}
    </select>
);

/**
 * name of the channel with the color spaces it appear in in parentheses
 * ie. "red (rgb)", "hue (hsl, hsv, hsi, lch)"
 */
const optionTitle = ({name, accessors}: ChannelObjectAll): string => {
    return `${name} (${accessors.map(([cs]) => cs).join(', ')})`
};
