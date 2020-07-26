import React, {useState} from "react";
import {Button} from "../sharedComponents/ui/Button";
import {SelectMultipleColors} from "../sharedComponents/form/SelectMultipleColors";
import {makeArray, shuffle} from "../lib";
import {I_ColorAdapter, randomColor} from "../packages/ColorAdapter";
import {getGradientColors} from "../channel/ChannelGradient";
import {SelectColor} from "../sharedComponents/form/SelectColor";
import {SelectAccessor} from "../sharedComponents/form/SelectAccessor";
import {usePartialState} from "../lib/util-hooks";
import {PaletteIcon, RandomIcon, ReverseIcon, ShuffleIcon} from "../sharedComponents/ui/Icons";
import {ChannelSliderInput} from "../sharedComponents/form/ChannelSlider";
import {ShiftSettings} from "./types";
import {getChannel} from "../spacesChannels/channels";

/**
 * want to be able to generate colors from a channel shift OR from select color
 */

export interface Props {
    colors: I_ColorAdapter[];

    setColors(c: I_ColorAdapter[]): void;
}

export const BoxColorControls = ({colors, setColors}: Props) => {
    const [startColor, setStartColor] = useState(randomColor());
    const [settings, update] = usePartialState<ShiftSettings>({
        start: .2,
        end: .8,
        channel: getChannel(['lch', 1])
    })

    const generateColors = () => {
        try {
            return getGradientColors({
                count: colors.length,
                channel: settings.channel,
                initial: startColor,
                start: settings.channel.deNormalize(settings.start),
                end: settings.channel.deNormalize(settings.end),
            });
        } catch (e) {
            return [];
        }
    };

    const randomColors = () => {
        return makeArray(colors.length, randomColor);
    }

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    //justifyContent: "space-between"
                }}>
                <SelectColor
                    label="Start Color"
                    value={startColor}
                    onChange={setStartColor}
                    randomize={true}
                    height={46}
                />

                <SelectAccessor
                    label="Channel"
                    value={settings.channel.accessor}
                    onChange={v => update({channel: getChannel(v)})}
                />
                <ChannelSliderInput
                    label={"Output Range"}
                    channel={settings.channel}
                    color={startColor}
                    value={[settings.start, settings.end]}
                    normalized={true}
                    onChange={([start, end]) => update({start, end})}
                    height={40}
                    width={300}
                />
                <Button onClick={() => setColors(generateColors())} endIcon={<PaletteIcon/>}>Generate</Button>
            </div>
            <div>
                <SelectMultipleColors label="Box Colors" value={colors} onChange={setColors}/>
                <Button onClick={() => setColors(randomColors())} endIcon={<RandomIcon/>}>Random</Button>
                <Button onClick={() => setColors(shuffle(colors))} endIcon={<ShuffleIcon/>}>Shuffle</Button>
                <Button onClick={() => setColors([...colors].reverse())} endIcon={<ReverseIcon/>}>Reverse</Button>
            </div>
        </div>
    );
};

