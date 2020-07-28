import React from "react";
import {RenderSet} from "sharedComponents/color/RenderSet";
import {ModelPalette} from "./tools/PaletteCompare/ModelPalette";
import {ModelAdapter} from "./spacesChannels/ModelAdapter";
import {ColorAdapter} from "./color/ColorAdapter";
import {rgbToRyb, rybToRgb} from "./color/ryb";

export const Sandbox = () => {

    const purple = [127,0,255];

    console.log(rgbToRyb([127.5,0,255], 255));
    console.log(rgbToRyb([.5,0,1], 1));

    const model = new ModelAdapter('xyz');

    const color = ColorAdapter.staticFrom([81, 0, 37], 'rgb');

    console.log(color.to('xyz'));

    return (
        <ModelPalette model={model} totalCount={100} perRow={10}/>
    );
};

/*
const initial = randomColor();

    const colors = [
        initial,
        transformChannel(initial, "hue", v => v + 90),
        transformChannel(initial, "hue", v => v + 180),
        transformChannel(initial, "hue", v => v + 270)
    ];

    const pairs = [
        [colors[0], colors[1]],
        [colors[1], colors[2]],
        [colors[2], colors[3]]
    ];

    pairs.forEach(([a, b]) => {
        console.log(
            "rgb",
            rgbDist(a, b),
            "lab 76",
            deltaE76(a, b),
            "94 no weight",
            deltaE94(a, b),
            "2000",
            deltaE00(a, b)
        );
    });

const sampleEval: Evaluation = {
    color: colors[0],
    match: colors[1],
    distance: 10,
    distinctness: 35,
    distances: [10, 35],
}
*/
