import chroma, { Color } from "chroma-js";
import React, { useState } from "react";
import { ChannelShiftControls, useControls } from "./GradientCompareTool";
/**
 * right now just looks at a bunch of random colors and filters
 * rather than computing a noisy color that is expected to match
 */

export interface Props {
  colors: Color[];
}

export const RenderNoisyBoxes = ({ colors }: Props) => {};

export const NoisyBoxTool = () => {
  const initial = {};
  const [controls, setControls] = useControls(initial);

  return (
    <div>
      <ChannelShiftControls initialValue={initial} onChange={setControls} />
    </div>
  );
};
