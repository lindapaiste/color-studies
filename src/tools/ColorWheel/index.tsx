import React from "react";
import { hsluvToHex } from "hsluv";
import { generateSet, makeHueShiftSet, replaceHue } from "logic/hue/hue-shared";
import { colorWheelToNormal } from "logic/adjustment/colorWheel";
import { ColorSet, ColorSetProps } from "components";
import { HSL } from "lib";
import { randomHsluv } from "logic/hue/hsluv";
import { ColorAdapter } from "logic";

export const makeRainbow = (
  count: number,
  saturation: number = 100,
  luminosity: number = 60
) => makeHueShiftSet([0, saturation, luminosity], count, 360 - 360 / count);

export const makeRandom = (count: number): HSL[] =>
  generateSet(count, randomHsluv);

const hslToHex = (c: HSL): string => ColorAdapter.staticFrom(c, "hsl").hex();

export const toMappedString = (c: HSL): string =>
  hslToHex(replaceHue(c, colorWheelToNormal));

/**
 * renders a set using both methods
 */
const CompareSet = (props: Omit<ColorSetProps<HSL>, "colorToHex">) => (
  <>
    <h3>HSL</h3>
    <ColorSet {...props} colorToHex={hslToHex} />
    <h3>Custom-Adjusted HSL</h3>
    <ColorSet {...props} colorToHex={toMappedString} />
    <h3>HSLuv</h3>
    <ColorSet {...props} colorToHex={hsluvToHex} />
  </>
);

export const RandomComparison = () => {
  const set = makeRandom(16);
  // set.sort((a, b) => b[0] - a[0]);
  return <CompareSet colors={set} wrap />;
};

export const ColorWheelComparison = () => {
  const sets = [3, 6, 12, 24, 48].map((n) => ({
    n,
    colors: makeRainbow(n),
  }));

  return (
    <div>
      {sets.map(({ colors, n }) => (
        <div key={n}>
          <CompareSet colors={colors} />
        </div>
      ))}
    </div>
  );
};

export default ColorWheelComparison;
