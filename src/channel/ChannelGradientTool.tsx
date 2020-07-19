import React, {useState} from "react";
import {SelectRandomizeColor} from "../sharedComponents/form/SelectColor";
import {randomColor} from "../packages/color-adapter";
import {ALL_ACCESSORS} from "../spacesChannels/colorSpaces";
import {ChannelGradient} from "./ChannelGradient";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import {accessorKey, accessorTitle} from "../spacesChannels/accessorConversion";

export const ChannelGradientTool = () => {
    const [color, setColor] = useState(randomColor());
    const [count, setCount] = useState(30);

    return (
        <div>
            <SelectRandomizeColor
                width={200}
                height={75}
                value={color}
                onChange={setColor}
                label="Initial Color"
            />

            <div>
                <NumberInput value={count} onChange={setCount} label="Intervals"/>
            </div>
            <h2>Channel Gradients</h2>
            {ALL_ACCESSORS.map(accessor => (
                <div key={accessorKey(accessor)}>
                    <h3>{accessorTitle(accessor)}</h3>
                    <ChannelGradient initial={color} channel={accessor} count={count}/>
                </div>
            ))}
        </div>
    );
};
