import React from "react";
import { Tool } from "components";
import { randomGroupName } from "data";
import PerceptronControls from "./PerceptronControls";
import { Settings } from "./types";
import usePerceptron from "./usePerceptron";
import RenderPerceptronTest from "./PerceptronResults";

/**
 * apply hook logic to render
 */
export const PerceptronTest = (settings: Settings) => {
  const props = usePerceptron(settings);

  return <RenderPerceptronTest {...props} />;
};

const PerceptronTool = () => (
  <Tool
    initialSettings={{
      testCount: 400,
      channels: [],
      group: randomGroupName(),
    }}
    RenderControls={PerceptronControls}
    // handle the conditional here
    RenderContents={(settings) =>
      settings.channels.length > 0 ? PerceptronTest(settings) : null
    }
  />
);

export default PerceptronTool;
