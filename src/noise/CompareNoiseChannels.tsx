import React, {useState} from "react";
import {Swatch} from "../sharedComponents/color/Swatch";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {withChannelNoise} from "./channelNoise";
import {I_ColorAdapter} from "../packages/color-adapter";
import {accessorKey, accessorTitle, ALL_ACCESSORS} from "../spacesChannels/colorSpaces";
import {makeArray} from "../util";
import {NumberInput} from "../sharedComponents/form/NumberInput";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely change anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

export interface Props {
    color: I_ColorAdapter;
    countPer?: number;
}

export const CompareNoiseChannels = ({color, countPer = 10}: Props) => {

    const [noiseRatio, setNoiseRatio] = useState(0.1);

    return (
        <div>
            <Swatch
                color={color.hex()}
                size={200}
            />
            <NumberInput
                value={noiseRatio}
                onChange={setNoiseRatio}
                isInt={false}
                step={.05}
            />
            {ALL_ACCESSORS.map(accessor => (
                <div key={accessorKey(accessor)}>
                    <h3>{accessorTitle(accessor)}</h3>
                    <RenderSet
                        colors={makeArray(countPer, () => withChannelNoise(color, accessor, noiseRatio))}
                    />
                </div>
            ))}
        </div>
    );
};
