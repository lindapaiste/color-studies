import React from "react";
import "./styles.css";
import {TestGroups} from "./classifier/TestResults";
import {PlotFeaturesTool} from "./classifier/PlotFeaturesTool";


export default function App() {
  return <PlotFeaturesTool/>
  //return <TestGroups/>

  //return <CompareRandom />;

  //return <RenderGroups />;

  //return <GroupsAnalysis/>

  //compareGroups();
  //return <ClassifyTool colors={hexes} colorToString={c => c} />;
  //<ClassifyTool />;
}
