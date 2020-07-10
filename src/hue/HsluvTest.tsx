import React from "react";
import { randomMultiHueSet } from "./hsluv";
import { RenderSets } from "../sharedComponents/color/RenderSet";
import { hsluvToHex } from "hsluv";

export const HsluvTest = () => {
  const sets = [...new Array(10)].map(() => randomMultiHueSet(4, 200));

  console.log(sets);

  return <RenderSets sets={sets} colorToString={hsluvToHex} />;
};
