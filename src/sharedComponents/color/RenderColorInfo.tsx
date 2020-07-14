import React from "react";
import {Swatch} from "./Swatch";
import {ColorAdapter, I_ColorAdapter} from "../../packages/color-adapter";
import {ColorSpaceName} from "../../spacesChannels/types";
import {CHANNEL_NAMES} from "../../spacesChannels/channelMaxes";
import {nameToAccessor} from "../../spacesChannels/colorSpaces";

export interface Props {
    color: I_ColorAdapter | string;
}

export const RenderColorInfo = (props: Props) => {
    const color = typeof props.color === "string" ? new ColorAdapter(props.color) : props.color;

    //can display this much more nicely
    const renderColorSpace = (cs: ColorSpaceName) => {
        const values = color.to(cs, true);
        const letters = cs.split('');
        return (
            <>
                <span>{cs.toUpperCase}\t</span>
                {letters.map((letter, i) => (
                    <span key={letter}>{letter.toUpperCase()}: {values[i]}</span>
                ))}
            </>
        )
    };

    const spaces: ColorSpaceName[] = ['rgb', 'hsl', 'cmyk', 'hsv', 'lab', 'lch'];

    return (
        <div>
            <Swatch color={color} size={100}/>
            <ul>
                {spaces.map(cs => (
                    <li key={cs}>
                        {renderColorSpace(cs)}
                    </li>
                ))
                }
            </ul>
            <ul>
                {CHANNEL_NAMES.map(name => (
                    <li key={name}>
                        {name}: {color.get(nameToAccessor(name))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

