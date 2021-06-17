import React, { useState } from "react";
import { FlexRow, NumberInput, SelectColor, Title } from "components";
import { allChannels, randomColor } from "logic";
import { ChannelGradient } from "logic/gradient/ChannelGradient";
import { RenderGradientSet } from "../GradientCompare/RenderGradientSet";

export const ChannelGradientTool = () => {
  const [color, setColor] = useState(randomColor());
  const [count, setCount] = useState(30);

  return (
    <div>
      <Title>Channel Gradients</Title>
      <FlexRow>
        <SelectColor
          width={300}
          height={46}
          value={color}
          onChange={setColor}
          label="Initial Color"
          randomize
        />
        <NumberInput value={count} onChange={setCount} label="Intervals" />
      </FlexRow>
      {allChannels().map((channel) => (
        <div key={channel.key}>
          <Title importance="h3">{channel.title}</Title>
          <RenderGradientSet
            gradient={
              new ChannelGradient({
                initial: color,
                channel,
              })
            }
            count={count}
          />
        </div>
      ))}
    </div>
  );
};

export default ChannelGradientTool;
