import {scale} from "chroma-js";
import {Title} from "../../sharedComponents/ui/Title";
import {RenderSet} from "../../sharedComponents/color/RenderSet";
import React from "react";
import {Props} from "./GradientCompareTool";

/**
 * uses chroma.js built-in scale functions
 * could build others myself using a channel shift
 */
export const CompareChromaScaleModes = ({colors, count = 4}: Props) => {
    //could use .internal rather than .hex() if using ColorAdapter class, but .internal is not present in the interface
    const colorScale = scale(colors.map(c => c.hex()));
    return (
        <div>
            <Title importance="h3">Mode: RGB</Title>
            <RenderSet colors={colorScale.mode('rgb').colors(count)}/>
            <Title importance="h3">Mode: HCL</Title>
            <RenderSet colors={colorScale.mode('hcl').colors(count)}/>
            <Title importance="h3">Mode: HSV</Title>
            <RenderSet colors={colorScale.mode('hsv').colors(count)}/>
            <Title importance="h3">Mode: LAB</Title>
            <RenderSet colors={colorScale.mode('lab').colors(count)}/>
        </div>
    )
};
