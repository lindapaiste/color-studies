import {I_Gradient} from "../../channel/types";
import {RenderSet} from "../../sharedComponents/color/RenderSet";
import {TupleTooltip} from "../../sharedComponents/color/TupleTooltip";
import React from "react";

export interface Props {
    count?: number;
    gradient: I_Gradient;
}

/**
 * gets the colors from the gradient object
 * uses the model values as the tooltip
 */
export const RenderGradientSet = ({count = 10, gradient}: Props) => (
    <RenderSet
        colors={gradient.colors(count)}
        colorToTooltip={color => TupleTooltip(color.toClassed(gradient.model))}
    />
);

export default RenderGradientSet;
