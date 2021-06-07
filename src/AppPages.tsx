import { ComponentType } from "react";
import {
  ExpandableColorInfo,
  withSelectableColor,
  withSelectMultipleColors,
} from "components";
import { PlotFeaturesTool } from "./tools/PlotFeatures/PlotFeaturesTool";
import { HistogramTool } from "./tools/Histogram/HistogramTool";
import { VisualizeDifference } from "./tools/VisualizeDifference/VisualizeDifference";
import { DistanceGridTool } from "./tools/DistanceGrid/DistanceGridTool";
import { ChannelGradientTool } from "./tools/ChannelGradient/ChannelGradientTool";
import { CompareNoiseChannels } from "./tools/ChannelNoise/CompareNoiseChannels";
import { CompareModelNoise } from "./tools/ModelNoise/CompareModelNoise";
import { NoisyBoxTool } from "./tools/NoisyBoxes/NoisyBoxes";
import { GradientCompareTool } from "./tools/GradientCompare/GradientCompareTool";
import { ColorWheelComparison } from "./tools/ColorWheel/ColorWheelComparison";
import { PaletteCompareTool } from "./tools/PaletteCompare/PaletteCompare";
import { ForceToAll } from "./tools/ForceToRules/ForceToRules";
import { RenderGroups } from "./tools/RenderGroups/RenderGroups";
import { TestBoundaries } from "./tools/GroupBoundaries/TestBoundaries";
import { ChannelRelTool } from "./tools/ChannelRel/ChannelRelTool";
import { GroupsAnalysis } from "./tools/AnalysisTable";
import { Sandbox } from "./Sandbox";
import { LevelCreatorTool } from "./tools/LevelCreator/LevelCreatorTool";
import PerceptronTool from "./tools/Perceptron";

interface AppPage {
  title: string;
  description?: string;
  path: string; // do not include the slash at start
  Component: ComponentType; // takes no arguments
}

/**
 * should appear in the order that I want in the menu
 * could allow subpage support to do nesting
 *
 * cannot include home here, unless putting it last
 * because if not using Route exact, the empty path will match everything
 */

export const PAGES: AppPage[] = [
  {
    title: "Plot Group Properties",
    path: "plot-features",
    Component: PlotFeaturesTool,
  },
  {
    title: "Group Property Histograms",
    path: "histogram",
    Component: HistogramTool,
  },
  {
    title: "Color Difference",
    path: "difference",
    Component: VisualizeDifference,
  },
  {
    title: "Color Difference Grid",
    path: "difference-grid",
    Component: DistanceGridTool,
  },
  {
    title: "Channel Change Gradients",
    path: "channels",
    Component: ChannelGradientTool,
  },
  {
    title: "Noise to Channels",
    path: "channel-noise",
    Component: withSelectableColor(CompareNoiseChannels),
  },
  {
    title: "Noise to ColorSpaces",
    path: "model-noise",
    Component: withSelectMultipleColors(CompareModelNoise),
  },
  {
    title: "Generate Box Balls",
    path: "boxes",
    Component: NoisyBoxTool,
  },
  {
    title: "Gradient Mode Comparison",
    path: "gradient",
    Component: GradientCompareTool,
  },
  {
    title: "Hue Rainbow Comparison",
    path: "rainbow",
    Component: ColorWheelComparison,
  },
  {
    title: "Color Space Palettes",
    path: "palette",
    Component: PaletteCompareTool,
  },
  {
    title: "Force Color To Group",
    path: "force",
    Component: withSelectableColor(ForceToAll),
  },
  {
    title: "Color Info",
    path: "info",
    Component: withSelectableColor(ExpandableColorInfo, {
      width: 200,
      height: 200,
    }),
  },
  {
    title: "View Groups",
    path: "groups",
    Component: RenderGroups,
  },
  {
    title: "Group Boundaries",
    path: "boundaries",
    Component: TestBoundaries,
  },
  {
    title: "Channel Relationships",
    path: "relationships",
    Component: ChannelRelTool,
  },
  {
    title: "Group Property Data",
    path: "analysis",
    Component: GroupsAnalysis,
  },
  {
    title: "Perceptron Classifier",
    path: "perceptron",
    Component: PerceptronTool,
  },
  {
    title: "Sandbox",
    path: "sandbox",
    Component: Sandbox,
  },
  {
    title: "Level Creator Tool",
    path: "level",
    Component: LevelCreatorTool,
  },
  // classify tool?  needs data input
];
