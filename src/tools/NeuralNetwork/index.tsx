import React from "react";
import { Tool } from "components";
import { initialSettings } from "./settings";
import { Contents } from "./Results";
import { Controls } from "./Controls";

export const NeuralNetworkTool = () => (
  <Tool
    initialSettings={initialSettings}
    RenderControls={Controls}
    RenderContents={Contents}
  />
);
