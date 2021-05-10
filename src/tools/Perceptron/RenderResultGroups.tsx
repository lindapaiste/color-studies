import {I_GetGroupedResults, I_TestOutput, ResultType} from "../../classifier/types";
import {I_ColorAdapter} from "../../color/types";
import {Title} from "../../sharedComponents/ui/Title";
import React, {ReactNode} from "react";
import {Props as RenderSetProps, RenderSet} from "../../sharedComponents/color/RenderSet";

/**
 * breaks a results object into four separate RenderSet components
 * pass in a resultToTooltip prop to handle custom tooltip
 * any other props get passed down to RenderSet
 */

export interface Props<R extends I_TestOutput<I_ColorAdapter>> {
    results: I_GetGroupedResults<R>;

    //RenderSet: ComponentType<{ results: R[] }>;
    resultToTooltip?(result: R): ReactNode;
}


export const RenderResultGroups = <R extends I_TestOutput<I_ColorAdapter>>({results, resultToTooltip, ...props}: Props<R> & Partial<RenderSetProps<R>>) => {
    const getGroupProps = (group: ResultType) => {
        return ({
            ...props,
            colors: results.getResults(group),
            colorToString: (r: R) => r.value.hex(),
            colorToTooltip: resultToTooltip,
            wrap: true,
        }) as unknown as RenderSetProps<R> & JSX.IntrinsicAttributes; //why the hell is this such a problem??
    };

    return (
        <div>
            <Title importance="h3">True Positives</Title>
            <RenderSet
                {...getGroupProps('truePositives')}
            />
            <Title importance="h3">False Positives</Title>
            <RenderSet
                {...getGroupProps('falsePositives')}
            />
            <Title importance="h3">True Negatives</Title>
            <RenderSet
                {...getGroupProps('trueNegatives')}
            />
            <Title importance="h3">False Negatives</Title>
            <RenderSet
                {...getGroupProps('falseNegatives')}
            />
        </div>
    )
}
