import React from "react";
import {Props} from "./GradientCompareTool";
import {Title} from "../../sharedComponents/ui/Title";
import RenderGradientSet from "./RenderGradientSet";
import {ModelGradient} from "../../channel/ModelGradient";

//TODO: more than 2 colors in gradient -- stitched gradient class

export const GradientModelCompare = ({models = [], count = 10, colors, ...props}: Props) => {
    //need start and end
    if (colors.length < 2) return null;

    return (
        <div>
            {models.map(model => (
                <div key={model.key}>
                    <Title importance="h3">{model.title}</Title>
                    <RenderGradientSet
                        gradient={new ModelGradient({
                            ...props,
                            start: colors[0],
                            end: colors[1],
                            model,
                        })}
                        count={count}
                    />
                </div>
            ))}
        </div>

    )
}

export default GradientModelCompare;
