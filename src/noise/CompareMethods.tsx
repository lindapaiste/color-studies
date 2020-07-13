import chroma, {Color} from "chroma-js";
import React from "react";
import {random, range} from "lodash";
import {Swatch} from "../sharedComponents/color/Swatch";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {noisyChannelValue} from "./channelNoise";
import {codeToName} from "../packages/chromaSpaces";
import {ChannelName} from "../spacesChannels/types";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely change anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

export const CompareRandom = () => {
    return <CompareMethods color={chroma.random().hex()}/>;
};

export const CompareMethods = ({color}: { color: string }) => {
    const base = chroma(color);

    const noiseRatio = 0.15; //5%

    const countPer = 10;

    const makeHexArray = (
        noiseGenerator: () => Color,
        count: number = countPer
    ): string[] => {
        return range(count)
            .map(noiseGenerator)
            .map(c => c.hex());
    };

    const renderNoisyChannel = (title: string, code: string) => (
        <TitledSet
            colors={makeHexArray(() => base.set(code, noisyChannelValue({value: base.get(code), noiseRatio, channel: codeToName(code)})), countPer)}
            title={title}
        />
    );

    return (
        <div>
            <Swatch color={base.hex()} size={200}/>
            {renderNoisyChannel("Chroma", "lch.c")}
            {renderNoisyChannel("V HSV", "hsv.v")}
            {renderNoisyChannel("Hue HSL", "hsl.h")}
            {renderNoisyChannel("Lightness HSL", "hsl.l")}
            {renderNoisyChannel("Lum LAB", "lab.l")}
            {renderNoisyChannel("Red", "rgb.r")}
            {renderNoisyChannel("Blue", "rgb.b")}
            {renderNoisyChannel("Green", "rgb.g")}
        </div>
    );
};

export const TitledSet = ({
                              colors,
                              title
                          }: {
    colors: string[];
    title: string;
}) => (
    <div>
        <h3>{title}</h3>
        <RenderSet colors={colors}/>
    </div>
);
