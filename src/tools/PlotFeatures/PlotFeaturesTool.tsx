import React from "react";
import {PlotFeatures, Props} from "./PlotFeatures";
import {SelectGroup} from "../../sharedComponents/form/SelectGroup";
import {NumberInput} from "../../sharedComponents/form/NumberInput";
import {FlexRow} from "../../sharedComponents/ui/FlexRow";
import {StateUpdateProps} from "../../lib/util-hooks";
import {SelectChannel} from "../../sharedComponents/form/SelectChannel";
import {Tool} from "../../sharedComponents/tool/Tool";
import {isComplete, MaybeUndefined} from "../../lib";
import {randomGroup} from "../../grouping";

/**
 * tool allows dynamic creation of a PlotFeatures component
 * by allowing the user to select the group, two properties/channels (x and y)
 * and sample size (count) for the plot
 *
 * does not set initial axis values, so needs an extra check before rendering tool
 */
export const PlotFeaturesTool = () => (
    <Tool
        initialSettings={{
            colorCount: 100,
            group: randomGroup().name,
            xChannel: undefined,
            yChannel: undefined,
        }}
        RenderControls={PlotFeaturesControls}
        RenderContents={props => isComplete(props) ? <PlotFeatures {...props}/> : null}
    />
)

/**
 * using partial settings because does not set a default x and y axis
 */
export const PlotFeaturesControls = ({state, update}: StateUpdateProps<MaybeUndefined<Props>>) => {
    const style = {
        width: "25%",
        minWidth: 75,
        flex: 1,
    }
    return (
        <FlexRow>
            <SelectChannel
                label="X Axis"
                value={state.xChannel}
                onChange={v => update({xChannel: v})}
                style={style}
            />
            <SelectChannel
                label="Y Axis"
                value={state.yChannel}
                onChange={v => update({yChannel: v})}
                style={style}
            />
            <SelectGroup
                label="Grouping"
                value={state.group}
                onChange={v => update({group: v})}
                style={style}
            />
            <NumberInput
                label="Sample Size"
                value={state.colorCount}
                onChange={v => update({colorCount: v})}
                isInt={true}
                style={style}
            />
        </FlexRow>
    )
}
