import React, { useState } from "react";
import { withChannelNoise } from "logic/noise/channelNoise";
import { makeArray } from "lib";
import { Title, TupleTooltip, NumberInput, ColorSet } from "components";
import { allChannels } from "logic/spacesChannels/channels";
import { IColorAdapter } from "logic/color/types";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely change anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

export interface Props {
  color: IColorAdapter;
  countPer?: number;
}

// TODO: HCG noise is totally wrong -- why?

export const CompareNoiseChannels = ({ color, countPer = 10 }: Props) => {
  const [noiseRatio, setNoiseRatio] = useState(0.1);

  return (
    <div>
      <NumberInput
        label="Noise Ratio"
        value={noiseRatio}
        onChange={setNoiseRatio}
        isInt={false}
        step={0.05}
      />
      <div>
        {allChannels().map((channel) => (
          <div key={channel.key}>
            <Title importance="h3">{channel.title}</Title>
            <ColorSet
              colors={makeArray(countPer, () =>
                withChannelNoise(color, channel, noiseRatio)
              )}
              colorToTooltip={(c) =>
                TupleTooltip(c.toClassed(channel.modelObject))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareNoiseChannels;
