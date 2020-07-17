import React, { useState } from "react";
import { SelectColor } from "../sharedComponents/form/SelectColor";
import { Swatch } from "../sharedComponents/color/Swatch";
import { randomColor } from "../packages/color-adapter";
import {
  accessorKey,
  accessorTitle,
  accessorToName,
  ALL_ACCESSORS
} from "../spacesChannels/colorSpaces";
import { ChannelGradient } from "./ChannelGradient";
import { NumberInput } from "../sharedComponents/form/NumberInput";

export const ChannelGradientTool = () => {
  const [color, setColor] = useState(randomColor());
  const [count, setCount] = useState(30);

  return (
    <div>
      <SelectColor
        width={200}
        height={75}
        color={color}
        onChange={setColor}
        label="Initial Color"
      />

      <div>
        <NumberInput value={count} onChange={setCount} label="Intervals" />
      </div>
      <h2>Channel Gradients</h2>
      {ALL_ACCESSORS.map(accessor => (
        <div key={accessorKey(accessor)}>
          <h3>{accessorTitle(accessor)}</h3>
          <ChannelGradient initial={color} channel={accessor} count={count} />
        </div>
      ))}
    </div>
  );
};
