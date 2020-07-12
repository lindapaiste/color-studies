import chroma, {Color} from "chroma-js";
import React from "react";
import {random, range} from "lodash";
import {Swatch} from "../sharedComponents/color/Swatch";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {withChannelNoise, withRGBChannelNoise} from "./channelNoise";

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

    const renderNoisyChannel = (title: string, channel: string, max: number) => (
        <TitledSet
            colors={makeHexArray(() => withChannelNoise({base, noiseRatio})(channel, max), countPer)}
            title={title}
        />
    );

    const renderNoisyRGBChannel = (title: string, channel: string) => (
        <TitledSet
            colors={makeHexArray(() => withRGBChannelNoise({base, noiseRatio})(channel), countPer)}
            title={title}
        />
    );

    return (
        <div>
            <Swatch color={base.hex()} size={200}/>
            {renderNoisyChannel("Chroma", "lch.c", 100)}
            {renderNoisyChannel("V HSV", "hsv.v", 100)}
            {renderNoisyChannel("Hue HSL", "hsl.h", 360)}
            {renderNoisyChannel("Lightness HSL", "hsl.l", 1)}
            {renderNoisyChannel("Lum LAB", "lab.l", 1)}
            {renderNoisyRGBChannel("Red - squared", "rgb.r")}
            {renderNoisyRGBChannel("Blue - squared", "rgb.b")}
            {renderNoisyRGBChannel("Green - squared", "rgb.g")}
            {renderNoisyChannel("Red - linear", "rgb.r", 255)}
            {renderNoisyChannel("Blue - linear", "rgb.b", 255)}
            {renderNoisyChannel("Green - linear", "rgb.g", 255)}
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
