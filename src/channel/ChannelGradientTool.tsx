import React, {useState} from "react";
import {SelectColor} from "../sharedComponents/form/SelectColor";
import {Swatch} from "../sharedComponents/color/Swatch";
import {randomColor} from "../packages/color-adapter";
import {accessorKey, accessorTitle, accessorToName, ALL_ACCESSORS} from "../spacesChannels/colorSpaces";
import {ChannelGradient} from "./ChannelGradient";
import {NumberInput} from "../sharedComponents/form/NumberInput";

export const ChannelGradientTool = () => {
    const [color, setColor] = useState(randomColor());
    const [count, setCount] = useState(30);

    return (
        <div>
            <h2>Initial Color</h2>
            <Swatch color={color} size={300} height={100}/>
            <SelectColor color={color} onChange={setColor}/>

            <h4>Intervals</h4>
            <NumberInput value={count} onChange={setCount}/>
            <h2>Channel Gradients</h2>
            {
                ALL_ACCESSORS.map(accessor => (
                    <div key={accessorKey(accessor)}>
                        <h3>{accessorTitle(accessor)}</h3>
                        <ChannelGradient initial={color} channel={accessor} count={count}/>
                    </div>
                ))
            }
        </div>
    )
};
