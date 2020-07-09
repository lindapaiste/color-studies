import {SelectProperty} from "../toolComponents/SelectProperty";
import React, {useState} from "react";
import {PlotFeatures} from "./PlotFeatures";
import {ColorPropKey} from "../properties/types";
import GROUPINGS from "../grouping/group-data";
import {SelectGroup} from "../toolComponents/SelectGroup";
import {NumberInput} from "../toolComponents/NumberInput";

export const PlotFeaturesTool = () => {
    const [groupName, setGroupName] = useState(GROUPINGS[0].name);
    const [x, setX] = useState<ColorPropKey>();
    const [y, setY] = useState<ColorPropKey>();
    const [count, setCount] = useState(100);

    return (
        <div>
            <div>
                <SelectProperty slug={x} onChange={setX}/>
                <SelectProperty slug={y} onChange={setY}/>
                <SelectGroup name={groupName} onChange={g => setGroupName(g.name)}/>
                <NumberInput value={count} onChange={setCount}/>
            </div>
            <div>
                {!!x && !!y &&
                <PlotFeatures count={count} x={x} y={y} group={groupName}/>
                }
            </div>
        </div>
    )
};
