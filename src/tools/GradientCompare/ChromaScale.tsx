import React from "react";
import { scale } from "chroma-js";
import { ColorSet, Title } from "components";
import { Settings } from "./GradientCompareControls";

/**
 * uses chroma.js built-in scale functions
 * could build others myself using a channel shift
 */
export const CompareChromaScaleModes = ({ colors, count = 4 }: Settings) => {
  // could use .internal rather than .hex() if using ColorAdapter class, but .internal is not present in the interface
  const colorScale = scale(colors.map((c) => c.hex()));
  return (
    <div>
      <Title importance="h3">Mode: RGB</Title>
      <ColorSet colors={colorScale.mode("rgb").colors(count)} />
      <Title importance="h3">Mode: HCL</Title>
      <ColorSet colors={colorScale.mode("hcl").colors(count)} />
      <Title importance="h3">Mode: HSV</Title>
      <ColorSet colors={colorScale.mode("hsv").colors(count)} />
      <Title importance="h3">Mode: LAB</Title>
      <ColorSet colors={colorScale.mode("lab").colors(count)} />
    </div>
  );
};
