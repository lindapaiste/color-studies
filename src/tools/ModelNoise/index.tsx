import React from "react";
import { Tool, withSelectMultipleColors } from "components";
import { DEFAULT_NOISE_SETTINGS } from "logic/noise/types";
import { ModelNoiseControls } from "./ModelNoiseControls";
import { CompareProps, Results } from "./CompareModelNoise";

/**
 * select colors comes from HOC
 */
const CompareModelNoise = (props: CompareProps) => (
  <Tool
    initialSettings={DEFAULT_NOISE_SETTINGS}
    RenderControls={ModelNoiseControls}
    RenderContents={(settings) => Results({ settings, ...props })}
  />
);

export default withSelectMultipleColors(CompareModelNoise);
