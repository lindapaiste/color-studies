import React from "react";
import { randomColor } from "packages/color-adapter";
import { transformChannel } from "channel/channelShift";
import { RenderSet } from "sharedComponents/color/RenderSet";
import { rgbDist, deltaE76, deltaE00, deltaE94 } from "difference/distance";

export const Sandbox = () => {
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

    return <RenderSet colors={colors} />;
};
