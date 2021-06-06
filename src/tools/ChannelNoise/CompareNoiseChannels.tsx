import React, { useState } from "react";
import { RenderSet } from "../../sharedComponents/color/RenderSet";
import { withChannelNoise } from "../../noise/channelNoise";
import { makeArray } from "../../lib";
import { NumberInput } from "../../sharedComponents/form/NumberInput";
import { Title } from "../../sharedComponents/ui/Title";
import { TupleTooltip } from "../../sharedComponents/color/TupleTooltip";
import { I_ColorAdapter } from "../../color/types";
import { allChannels } from "../../spacesChannels/channels";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely change anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

export interface Props {
  color: I_ColorAdapter;
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
            <RenderSet
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
