import React, {useState} from "react";
import {PlotFeatures} from "./PlotFeatures";
import GROUPINGS from "../grouping/group-data";
import {SelectGroup} from "../sharedComponents/form/SelectGroup";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import {ChannelAccessor} from "../spacesChannels/types";
import {SelectAccessor} from "../sharedComponents/form/SelectAccessor";

/**
 * tool allows dynamic creation of a PlotFeatures component
 * by allowing the user to select the group, two properties/channels (x and y)
 * and sample size (count) for the plot
 */

export const PlotFeaturesTool = () => {
    const [groupName, setGroupName] = useState(GROUPINGS[0].name);
    const [x, setX] = useState<ChannelAccessor>();
    const [y, setY] = useState<ChannelAccessor>();
    const [count, setCount] = useState(100);

    return (
        <div>
            <div>
                <SelectAccessor value={x} onChange={setX}/>
                <SelectAccessor value={y} onChange={setY}/>
                <SelectGroup value={groupName} onChange={setGroupName}/>
                <NumberInput value={count} isInt={true} onChange={setCount}/>
            </div>
            <div>
                {!!x && !!y && (
                    <PlotFeatures count={count} x={x} y={y} group={groupName}/>
                )}
            </div>
        </div>
    );
};
