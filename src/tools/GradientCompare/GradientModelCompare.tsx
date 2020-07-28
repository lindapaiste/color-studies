import React from "react";
import {Props} from "./GradientCompareTool";
import {Title} from "../../sharedComponents/ui/Title";
import RenderGradientSet from "./RenderGradientSet";
import StitchedGradient from "../../channel/StitchedGradient";

export const GradientModelCompare = ({models = [], count = 10, ...props}: Props) => {
    return (
        <div>
            {models.map(model => (
                <div key={model.key}>
                    <Title importance="h3">{model.title}</Title>
                    <RenderGradientSet
                        gradient={new StitchedGradient({
                            ...props,
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
