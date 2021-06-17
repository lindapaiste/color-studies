import React from "react";
import { Tool } from "components";
import { Controls, initialSettings } from "./Controls";
import { Contents } from "./Contents";

/**
 * based on the selected group name, calculates a boundary model for every property
 *
 * sorts the models by one key determinant (right now using balancedAccuracy, but could change)
 * can expand to show detailed analysis
 *
 * Note: seems like the sample size is just the test size -- model uses all hexes.
 */
export default () => (
  <Tool
    initialSettings={initialSettings}
    RenderControls={Controls}
    RenderContents={Contents}
  />
);
