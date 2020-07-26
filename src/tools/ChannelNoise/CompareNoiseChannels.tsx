import React, {useState} from "react";
import {RenderSet} from "../../sharedComponents/color/RenderSet";
import {withChannelNoise} from "../../noise/channelNoise";
import {I_ColorAdapter} from "../../packages/ColorAdapter";
import {ALL_ACCESSORS} from "../../spacesChannels/colorSpaces";
import {makeArray} from "../../lib";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import {accessorKey, accessorTitle} from "../../spacesChannels/accessorConversion";
import {Title} from "../../sharedComponents/ui/Title";
import {TupleTooltip} from "../../sharedComponents/color/TupleTooltip";

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

//TODO: HCG noise is totally wrong -- why?

export const CompareNoiseChannels = ({color, countPer = 10}: Props) => {
    const [noiseRatio, setNoiseRatio] = useState(0.1);

    return (
        <div>
            <NumberInput
                label="Noise Ratio"
                value={noiseRatio}
                onChange={setNoiseRatio}
                isInt={false}
                step={0.05}
            />
            <div>
                {ALL_ACCESSORS.map(accessor => (
                    <div key={accessorKey(accessor)}>
                        <Title importance="h3">{accessorTitle(accessor)}</Title>
                        <RenderSet
                            colors={makeArray(countPer, () =>
                                withChannelNoise(color, accessor, noiseRatio)
                            )}
                            colorToTooltip={c => TupleTooltip(c.toClassed(accessor[0]))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompareNoiseChannels;
