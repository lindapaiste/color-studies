import {Props} from "./CompareNoiseChannels";
import React, {useState} from "react";
import {Swatch} from "../sharedComponents/color/Swatch";
import {NumberInput} from "../sharedComponents/form/NumberInput";
import {getSpaceChannels} from "../spacesChannels/colorSpaces";
import {makeArray, replaceIndex} from "../util";
import {ColorSpaceName, ColorTuple} from "../spacesChannels/types";
import {SelectModel} from "../sharedComponents/form/SelectModel";
import {RenderSet} from "../sharedComponents/color/RenderSet";
import {withModelNoise} from "./modelNoise";

/**
 * tool to visualize the changes made by adjusting weights
 * for noise generation in a color space
 */


export const CompareModelNoise = ({color, countPer = 25}: Props) => {

    const [noiseRatio, setNoiseRatio] = useState(0.1);

    const [model, setModel] = useState<ColorSpaceName>('rgb');

    /**
     * need to ensure that the length of weights matches the given model
     * is it easier to just include a fourth value and ignore when not needed?
     * vs. useEffect to update the value when model changes to one with a different length
     * note that a 4-length tuple also fills the interface of a 3-length tuple
     */
    const [weights, setWeights] = useState<ColorTuple<typeof model> & number[]>([1, 1, 1, 1]);

    return (
        <div>
            <Swatch
                color={color.hex()}
                size={200}
            />
            <h4>Noise Ratio</h4>
            <NumberInput
                value={noiseRatio}
                onChange={setNoiseRatio}
                isInt={false}
                step={.05}
            />
            <h4>Color Space</h4>
            <SelectModel
                value={model}
                onChange={setModel}
            />
            <h4>Channel Weights</h4>
            {getSpaceChannels(model).map((channel, i) => (
                <div key={channel}>
                    <span>{channel}</span>
                    <NumberInput
                        value={weights[i]}
                        onChange={(v) => setWeights(replaceIndex(weights, i, v))}
                        isInt={false}
                        step={.25}
                    />
                </div>
            ))}
            <button onClick={() => setWeights([1, 1, 1, 1])}>Reset</button>
            <h2>Noisy Colors</h2>
            <RenderSet
                colors={makeArray(countPer, () => withModelNoise({color, colorSpace: model, weights, noiseRatio}))}
            />
        </div>
    );

};
