import React from "react";
import { createTool } from "components";
import { randomGroupName } from "data";
import { PerceptronControls } from "./PerceptronControls";
import { Settings } from "./types";
import { usePerceptron } from "./usePerceptron";
import { RenderPerceptronTest } from "./PerceptronResults";

/**
 * apply hook logic to render
 */
export const PerceptronTest = (settings: Settings) => {
  const props = usePerceptron(settings);

  return <RenderPerceptronTest {...props} />;
};

export default createTool(
  {
    testCount: 400,
    channels: [],
    group: randomGroupName(),
  },
  PerceptronControls,
  // handle the conditional here
  (settings) => (settings.channels.length > 0 ? PerceptronTest(settings) : null)
);
