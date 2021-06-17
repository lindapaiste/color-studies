import React from "react";
import { withChannelNoise } from "logic/noise/channelNoise";
import { makeArray } from "lib";
import {
  ColorSet,
  ControlRow,
  NumberInput,
  SelectColor,
  Title,
  tupleTooltipFactory,
} from "components";
import { allChannels, randomColor } from "logic";
import { createTool } from "components/templates/Tool";

/**
 * notes: hsv.v is just completely wrong
 * chroma seems to barely change anything -- is that a mistake?
 * hue changes are the most obvious
 * I have not accounted for the cap which is unique to each color
 * for neon colors, LAB luminance changes more
 */

// TODO: HCG noise is totally wrong -- why?

export default createTool(
  {
    noiseRatio: 0.1,
    countPer: 10,
    color: randomColor(),
  },
  ({ state, handle }) => (
    <ControlRow>
      <SelectColor
        height={50}
        label="Color"
        value={state.color}
        onChange={handle("color")}
        randomize
      />
      <NumberInput
        value={state.noiseRatio}
        onChange={handle("noiseRatio")}
        label="Noise Ratio"
        step={0.05}
      />
      <NumberInput
        value={state.countPer}
        onChange={handle("countPer")}
        label="Example Count"
        isInt
      />
    </ControlRow>
  ),
  ({ color, noiseRatio, countPer }) => (
    <div>
      {allChannels().map((channel) => (
        <div key={channel.key}>
          <Title importance="h3">{channel.title}</Title>
          <ColorSet
            colors={makeArray(countPer, () =>
              withChannelNoise(color, channel, noiseRatio)
            )}
            colorToTooltip={tupleTooltipFactory(channel.modelObject)}
          />
        </div>
      ))}
    </div>
  )
);
