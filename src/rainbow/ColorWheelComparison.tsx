import React from "react";
import {generateSet, makeHueShiftSet, replaceHue} from "../hue/hue-shared";
import {colorWheelToNormal} from "./colorWheel";
import {Props, RenderSet} from "../sharedComponents/color/RenderSet";
import {HSL, hslToString} from "../lib";
import {randomHsluv} from "../hue/hsluv";
import {hsluvToHex} from "hsluv";

export const makeRainbow = (
    count: number,
    saturation: number = 100,
    luminosity: number = 60
) => {
    return makeHueShiftSet([0, saturation, luminosity], count, 360 - 360 / count);
};

export const makeRandom = (count: number): HSL[] => {
    return generateSet(count, randomHsluv);
};

export const toMappedString = (c: HSL): string =>
    hslToString(replaceHue(c, colorWheelToNormal));

export const ColorWheelComparison = () => {
    const sets = [
        makeRainbow(3),
        makeRainbow(6),
        makeRainbow(12),
        makeRainbow(24),
        makeRainbow(48)
    ];

    return (
        <div>
            {sets.map((colors, i) => (
                <div key={i}>
                    <CompareSet colors={colors}/>
                </div>
            ))}
        </div>
    );
};

/**
 * renders a set using both methods
 */
const CompareSet = (props: Omit<Props<HSL>, "colorToString">) => (
    <>
        <h3>HSL</h3>
        <RenderSet {...props} colorToString={hslToString}/>
        <h3>Custom-Adjusted HSL</h3>
        <RenderSet {...props} colorToString={toMappedString}/>
        <h3>HSLuv</h3>
        <RenderSet {...props} colorToString={hsluvToHex}/>
    </>
);

export const RandomComparison = () => {
    const set = makeRandom(16);
    //set.sort((a, b) => b[0] - a[0]);
    return <CompareSet colors={set} wrap={true}/>;
};
