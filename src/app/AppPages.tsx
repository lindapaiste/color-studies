import { ComponentType, lazy } from "react";
import { IconType } from "react-icons";
import {
  AiOutlineBarChart,
  AiOutlineDotChart,
  AiOutlineLineChart,
  AiOutlinePartition,
  AiOutlineSwap,
  AiOutlineTable,
  BiDetail,
  BiNetworkChart,
  BiPalette,
  BsBoxArrowInLeft,
  GiZigzagHieroglyph,
  HiOutlineColorSwatch,
  IoColorFilterOutline,
  MdGradient,
  RiGamepadLine,
  RiRainbowLine,
  RiScissorsCutLine,
  VscColorMode,
} from "react-icons/all";

export interface AppPage {
  title: string;
  description?: string;
  path: string; // do not include the slash at start
  Component: ComponentType; // takes no arguments
  icon: IconType;
}

export interface Section {
  title: string;
  pages: AppPage[];
}

/**
 * should appear in the order that I want in the menu
 * could allow subpage support to do nesting
 *
 * cannot include home here, unless putting it last
 * because if not using Route exact, the empty path will match everything
 *
 * Note: can maybe use sliders or filters icon for something.
 */

export const SECTIONS: Section[] = [
  {
    title: "Group Classification",
    pages: [
      {
        title: "Neural Network",
        path: "neural",
        Component: lazy(() => import("../tools/NeuralNetwork")),
        icon: BiNetworkChart,
        description:
          "Train and analyze a neural network which assigns colors to their group. Generally creates good predictions where the false positives seem like they reasonably could fit into the group which was assigned by the model.",
      },
      {
        title: "Perceptron",
        path: "perceptron",
        Component: lazy(() => import("../tools/Perceptron")),
        icon: AiOutlinePartition,
        description:
          "Interactively train and analyze a model for classifying colors based on the selected channel values. This simplistic model is rarely accurate, but occasionally creates a decent predictor if given the right set of features. Perceptron classifiers expect linearly-separable data, which this training set is not.",
      },
      {
        title: "Boundaries",
        path: "boundaries",
        Component: lazy(() => import("../tools/GroupBoundaries")),
        icon: RiScissorsCutLine,
        description:
          "Can the value of a single channel be used to predict whether a color is a particular group? This tool determines the best cutoff value to use as the model and provides detailed analysis of how good -- or bad -- this boundary is at predicting whether a color belong in the selected group.",
      },
      {
        title: "Histogram",
        path: "histogram",
        Component: lazy(() => import("../tools/Histogram")),
        icon: AiOutlineBarChart,
        description:
          "Colorful visualization of channel values. Select a group and a channel and see where the colors lie.",
      },
      {
        title: "Scatter Plot",
        path: "plot-features",
        Component: lazy(() => import("../tools/PlotFeatures")),
        icon: AiOutlineDotChart,
        description:
          "Try to find a pairing of channels on the X and Y axes which separate the colors in a particular group from those outside the group. A pairing which creates separation is a good candidate for a classifier model. Look to the Group Boundaries tool for good candidate channels.",
      },
      {
        title: "Averages",
        path: "analysis",
        Component: lazy(() => import("../tools/GroupProperties/AnalysisTable")),
        icon: AiOutlineTable,
        description:
          "View and compare the average values across different channels and groups.",
      },
      {
        title: "Modification",
        path: "force",
        Component: lazy(() => import("../tools/ForceToRules")),
        icon: BsBoxArrowInLeft,
        description:
          "Can an arbitrary color be modified into a neon or pastel by modifying its channel values?",
      },
      {
        title: "Training Data",
        path: "groups",
        Component: lazy(() => import("../tools/RenderGroups")),
        icon: HiOutlineColorSwatch,
        description:
          "Examine the colors used as the data set for classification models.",
      },
      // classify tool?  needs data input
    ],
  },
  {
    title: "Color Difference",
    pages: [
      {
        title: "Color Difference",
        path: "difference",
        Component: lazy(
          () => import("../tools/VisualizeDifference/VisualizeDifference")
        ),
        icon: VscColorMode,
      },
      {
        title: "Color Difference Grid",
        path: "difference-grid",
        Component: lazy(() => import("../tools/DistanceGrid")),
        icon: IoColorFilterOutline,
      },
      {
        title: "Noise to Channels",
        path: "channel-noise",
        Component: lazy(() => import("../tools/ChannelNoise")),
        icon: GiZigzagHieroglyph,
      },
      {
        title: "Noise to ColorSpaces",
        path: "model-noise",
        Component: lazy(() => import("../tools/ModelNoise")),
        icon: GiZigzagHieroglyph,
      },
    ],
  },
  {
    title: "Color Models",
    pages: [
      {
        title: "Color Info",
        path: "info",
        Component: lazy(() => import("../tools/ColorInfo")),
        icon: BiDetail,
        description:
          "Get the values of every channel in every colorspace for a particular color.",
      },
      {
        title: "Channel Relationships",
        path: "relationships",
        Component: lazy(() => import("../tools/ChannelRel")),
        icon: AiOutlineLineChart,
        description:
          "Are two channel value independent of each other? How are they related? Plot two channels and see how modifications to one channel impact the other. Purely horizontal lines means independence.",
      },
      {
        title: "Channel Change Gradients",
        path: "channels",
        Component: lazy(() => import("../tools/ChannelGradient")),
        icon: MdGradient,
        description:
          "Create gradients by modifying the values of only one channel.",
      },
      {
        title: "Gradient Mode Comparison",
        path: "gradient",
        Component: lazy(() => import("../tools/GradientCompare")),
        icon: AiOutlineSwap,
        description:
          "See how the gradient between two or more colors differs depending on the color space model which is used for finding the intermediate values.",
      },
      {
        title: "Hue Rainbow Comparison",
        path: "rainbow",
        Component: lazy(() => import("../tools/ColorWheel")),
        icon: RiRainbowLine,
        description:
          "The HSL color space contains more green and blue than a typical rainbow. Can the distribution of colors be improved by shifting the hue values?",
      },
      {
        title: "Color Space Palettes",
        path: "palette",
        Component: lazy(() => import("../tools/PaletteCompare")),
        icon: BiPalette,
        description:
          "Which color space has the best distribution of colors for random sampling?",
      },
    ],
  },
  {
    title: "Game Tools",
    pages: [
      {
        title: "Level Creator Tool",
        path: "level",
        Component: lazy(() => import("../tools/LevelCreator")),
        icon: RiGamepadLine,
      },
    ],
  },
];
