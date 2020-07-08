import React from "react";
import "./styles.css";
import { compareGroups } from "./analyzeColors";
import { ColorWheelComparison, RandomComparison } from "./ColorWheelComparison";
import { Classify } from "./Classify";
import { RenderGroups } from "./grouping/RenderGroups";
import { GroupsAnalysis } from "./AnalysisTable";
import { calcBreaks } from "./VisualHistogram";
import { HistogramCreator } from "./grouping/HistogramCreator";
//const randomHue = () => 360 * Math.random();
import { RenderColor } from "./RenderColor";
import Color from "color";
import { randomRgb } from "./rgb";
import { GROUPINGS, PropertyConstraint } from "./grouping/data";
import {
  getColorProp,
  setColorProp,
  ColorPropKey
} from "./grouping/analyzeColors";
import { last, range } from "lodash";
import { fitsConditions } from "./grouping/colorToGroup";
import { LuminosityChart, pointsToVectors, getPoints } from "./LuminosityChart";
import { PolynomialRegression, ExponentialRegression } from "ml-regression";
//export default HistogramCreator;
import { CompareRandom } from "./noise/CompareMethods";

export default function App() {
  return <CompareRandom />;

  //return <RenderGroups />;

  //return <GroupsAnalysis/>

  //compareGroups();
  //return <Classify colors={hexes} colorToString={c => c} />;
  //<Classify />;
}
