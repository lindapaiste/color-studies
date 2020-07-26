import React from "react";
import { randomMultiHueSet } from "./hsluv";
import { RenderSet } from "../sharedComponents/color/RenderSet";
import { hsluvToHex } from "hsluv";

export const HsluvTest = () => {
  const set = randomMultiHueSet(4, 200);

  console.log(set);

  return <RenderSet colors={set} colorToString={hsluvToHex} />;
};
