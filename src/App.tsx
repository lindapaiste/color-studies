import React from "react";
import "./styles.css";
import {TestGroups} from "./classifier/TestResults";
import {PlotFeaturesTool} from "./classifier/PlotFeaturesTool";
import {TestBoundaries} from "./classifier/TestBoundaries";


export default function App() {
  return <TestBoundaries/>

    //return <PlotFeaturesTool/>
  //return <TestGroups/>

  //return <CompareRandom />;

  //return <RenderGroups />;

  //return <GroupsAnalysis/>

  //compareGroups();
  //return <ClassifyTool colors={hexes} colorToString={c => c} />;
  //<ClassifyTool />;
}
