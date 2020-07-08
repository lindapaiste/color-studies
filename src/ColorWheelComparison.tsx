import React from "react";
import { makeHueShiftSet, replaceHue, generateSet } from "./hue-shared";
import { colorWheelToNormal } from "./colorWheel";
import { RenderSet, PropsSingle } from "./RenderSet";
import { makeColorString, hslToString, HSL } from "./util";
import { randomHsluv } from "./hsluv";
import { hsluvToHex } from "hsluv";
//import Color from "color";

export const makeRainbow = (
  count: number,
  saturation: number = 100,
  luminosity: number = 60
) => {
  return makeHueShiftSet([0, saturation, luminosity], count, 360 - 360 / count);
};

export const makeRandom = (count: number) => {
  return generateSet(count, randomHsluv);
};

export const toMappedString = (c: HSL) =>
  hslToString(replaceHue(c, colorWheelToNormal));

export const ColorWheelComparison = () => {
  const sets = [
    makeRainbow(3),
    makeRainbow(6),
    makeRainbow(12),
    makeRainbow(24),
    makeRainbow(48)
  ];

  return (
    <div>
      {sets.map((colors, i) => (
        <div key={i}>
          <CompareSet colors={colors} />
        </div>
      ))}
    </div>
  );
};

/**
 * renders a set using both methods
 */
const CompareSet = (props: Omit<PropsSingle<HSL>, "colorToString">) => (
  <>
    <RenderSet {...props} colorToString={hslToString} />
    <RenderSet {...props} colorToString={toMappedString} />
    <RenderSet {...props} colorToString={hsluvToHex} />
  </>
);

export const RandomComparison = () => {
  const set = makeRandom(16);
  //set.sort((a, b) => b[0] - a[0]);
  return <CompareSet colors={set} wrap={true} />;
};
