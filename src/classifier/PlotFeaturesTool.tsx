import {NumberInput, SelectGroup, SelectProperty} from "../histogram/HistogramTool";
import React, {useState} from "react";
import {PlotFeatures} from "./PlotFeatures";
import {ColorPropKey} from "../properties/types";
import GROUPINGS from "../grouping/group-data";

export const PlotFeaturesTool = () => {
    const [groupName, setGroupName] = useState(GROUPINGS[0].name);
    const [x, setX] = useState<ColorPropKey>();
    const [y, setY] = useState<ColorPropKey>();
    const [count, setCount] = useState(100);

    return (
        <div>
            <div>
                <SelectProperty key={x} onChange={setX}/>
                <SelectProperty key={y} onChange={setY}/>
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
