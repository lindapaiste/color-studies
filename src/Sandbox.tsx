import React from "react";
import { ModelPalette } from "./tools/PaletteCompare/ModelPalette";
import { ModelAdapter } from "./spacesChannels/ModelAdapter";
import { ColorAdapter } from "./color/ColorAdapter";
import { rgbToRyb } from "./color/ryb";
import { makeIterativePerceptron } from "./classifier/IterativeChannelPerceptron";
import { TestedModel } from "./classifier/TestedModel";

export const Sandbox = () => {
  const perceptron = makeIterativePerceptron("Neons", 1000, 10);

  /*
    ChannelAdapter {modelName: "lab", modelObject: ModelAdapter, offset: 0, name: "luminance", max: 100, …}
1: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 1, name: "white", max: 100, …}
2: ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 2, name: "z", max: 109, …}
3: ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 1, name: "luminosity", max: 100, …}
4: ChannelAdapter {modelName: "hsl", modelObject: ModelAdapter, offset: 2, name: "lightness", max: 100, …}
5: ChannelAdapter {modelName: "hcg", modelObject: ModelAdapter, offset: 0, name: "hue", max: 360, …}
6: ChannelAdapter {modelName: "rgb", modelObject: ModelAdapter, offset: 0, name: "red", max: 255,


0: ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 1, name: "luminosity", max: 100, …}
1: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 1, name: "white", max: 100, …}
2: ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 0, name: "x", max: 95.05, …}
3: ChannelAdapter {modelName: "hsl", modelObject: ModelAdapter, offset: 2, name: "lightness", max: 100, …}
4: ChannelAdapter {modelName: "hsluv", modelObject: ModelAdapter, offset: 1, name: "saturation", max: 100, …}
5: ChannelAdapter {modelName: "lch", modelObject: ModelAdapter, offset: 0, name: "luminance", max: 100, …}

0: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 1, name: "white", max: 100, …}
1: ChannelAdapter {modelName: "rgb", modelObject: ModelAdapter, offset: 2, name: "blue", max: 255, …}
2: ChannelAdapter {modelName: "ryb", modelObject: ModelAdapter, offset: 0, name: "red", max: 255, …}
3: ChannelAdapter {modelName: "cmyk", modelObject: ModelAdapter, offset: 1, name: "magenta", max


good one
0: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 1, name: "white", max: 100, …}
1: ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 2, name: "z", max: 109, …}
2: ChannelAdapter {modelName: "lab", modelObject: ModelAdapter, offset: 0, name: "luminance", max: 100, …}
3: ChannelAdapter {modelName: "hsi", modelObject: ModelAdapter, offset: 2, name: "intensity", max: 100, …}
4: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 2, name: "black", max: 10

no false negatives but a lot of false positives
0: ChannelAdapter {modelName: "hsl", modelObject: ModelAdapter, offset: 2, name: "lightness", max: 100, …}
1: ChannelAdapter {modelName: "hsluv", modelObject: ModelAdapter, offset: 2, name: "luminosity", max: 100, …}
2: ChannelAdapter {modelName: "hsluv", modelObject: ModelAdapter, offset: 1, name: "saturation", max: 100, …}
3: ChannelAdapter {modelName: "hsv", modelObject: ModelAdapter, offset: 1, name: "saturation", max: 100, …}
4: ChannelAdapter {modelName: "ryb", modelObject: ModelAdapter, offset: 1, name: "yellowRyb",

97.8%
 ChannelAdapter {modelName: "xyz", modelObject: ModelAdapter, offset: 2, name: "z", max: 109, …}
1: ChannelAdapter {modelName: "lch", modelObject: ModelAdapter, offset: 0, name: "luminance", max: 100, …}
2: ChannelAdapter {modelName: "hcg", modelObject: ModelAdapter, offset: 1, name: "chromaHcg", max: 100, …}
3: ChannelAdapter {modelName: "hsl", modelObject: ModelAdapter, offset: 0, name: "hue", max: 360, …}
4: ChannelAdapter {modelName: "cmyk", modelObject: ModelAdapter, offset: 0, name: "cyan", max: 10

91%
0: ChannelAdapter {modelName: "hsi", modelObject: ModelAdapter, offset: 2, name: "intensity", max: 100, …}
1: ChannelAdapter {modelName: "hwb", modelObject: ModelAdapter, offset: 1, name: "white", max: 100, …}
2: ChannelAdapter {modelName: "lch", modelObject: ModelAdapter, offset: 0, name: "luminance", ma
length: 6
     */
  const tested = new TestedModel(perceptron, 500);

  console.log(tested.accuracy);

  console.log(tested.model);

  console.log(rgbToRyb([127.5, 0, 255], 255));
  console.log(rgbToRyb([0.5, 0, 1], 1));

  const model = new ModelAdapter("xyz");

  const color = ColorAdapter.staticFrom([81, 0, 37], "rgb");

  console.log(color.to("xyz"));

  return <ModelPalette model={model} totalCount={100} perRow={10} />;
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
