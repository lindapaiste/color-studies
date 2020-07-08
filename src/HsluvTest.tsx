import { randomMultiHueSet } from "./hsluv";
import { RenderSets } from "./RenderSet";
import { hsluvToHex } from "hsluv";

export const HsluvTest = () => {
  const sets = [...new Array(10)].map(() => randomMultiHueSet(4, 200));

  console.log(sets);

  return <RenderSets sets={sets} colorToString={hsluvToHex} />;
};
