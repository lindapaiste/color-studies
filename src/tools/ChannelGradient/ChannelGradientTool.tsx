import React, { useState } from "react";
import { SelectColor } from "../../sharedComponents/form/SelectColor";
import { NumberInput } from "../../sharedComponents/form/NumberInput";
import { allChannels } from "../../spacesChannels/channels";
import { Title } from "../../sharedComponents/ui/Title";
import { FlexRow } from "../../sharedComponents/ui/FlexRow";
import RenderGradientSet from "../GradientCompare/RenderGradientSet";
import ChannelGradient from "../../channel/ChannelGradient";
import { randomColor } from "../../color";

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
