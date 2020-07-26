import React from "react";
import {Size} from "../form/types";
import {ifDefined, withHash} from "../../lib";
import ChannelGradient, {Props as GradientProps} from "../../channel/ChannelGradient";

/**
 * a continuous gradient of color,
 * made by adjusting an initial color along one channel
 *
 * unlike the ChannelGradient component, this doesn't use RenderSet because don't want to display detailed color info
 */

export type Props = GradientProps & Partial<Size> & {
    count?: number;
}

export const GradientBar = ({width, height, count, ...props}: Props) => {
    //will use passed-in count, or 1 per pixel if width is set, or 100
    const _count = ifDefined(count, ifDefined(width, 100));
    const gradient = new ChannelGradient(props);
    return (
        <div style={{
            display: "flex",
            width: width || "100%",
            height: height || 50
        }}>
            {gradient.colors(_count).map((color, i) => (
                <div
                    key={i}
                    style={{
                        flex: 1,
                        height,
                        backgroundColor: withHash(color.hex()),
                    }}
                />
            ))}
        </div>
    );
}

