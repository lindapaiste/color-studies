import {RenderSet} from "../sharedComponents/color/RenderSet";
import React from "react";
import {Scale} from "chroma-js";


//lab ( followed by rgb ) has the smoothest transition, though intermediate colors can appear dingy
//hsv has good results on hue shift scales because intermediates are just as bright
//hcl not very good

export interface Props {
    scale: Scale;
    count?: number;
}

export const CompareScaleModes = ({scale, count = 4}: Props) => {
return (
    <div>
        <h3>Mode: RGB</h3>
        <RenderSet colors={scale.mode('rgb').colors(count)}/>
        <h3>Mode: HCL</h3>
        <RenderSet colors={scale.mode('hcl').colors(count)}/>
        <h3>Mode: HSV</h3>
        <RenderSet colors={scale.mode('hsv').colors(count)}/>
        <h3>Mode: LAB</h3>
        <RenderSet colors={scale.mode('lab').colors(count)}/>
    </div>
)};
