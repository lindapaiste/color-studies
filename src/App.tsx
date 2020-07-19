import React, { ComponentType, useState } from "react";
import "./styles.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { TestGroups } from "./classifier/PerceptronResults";
import { PlotFeaturesTool } from "./classifier/PlotFeaturesTool";
import { TestBoundaries } from "./classifier/TestBoundaries";
import { CompareNoiseChannels } from "./noise/CompareNoiseChannels";
import {
  RandomVisualizeDifference,
  VisualizeDifference
} from "./difference/VisualizeDifference";
import { ForceToAll } from "./grouping/ForceToRules";
import { RenderGroups } from "./grouping/RenderGroups";
import { HistogramTool } from "./histogram/HistogramTool";
import { Sample } from "./luminosity/LuminosityChart";
import { GradientCompareTool } from "./boxSets/GradientCompareTool";
import { ColorWheelComparison } from "./rainbow/ColorWheelComparison";
import { GroupsAnalysis } from "./grouping/AnalysisTable";
import { NoisyBoxTool } from "./boxSets/NoisyBoxes";
import { ChannelGradientTool } from "./channel/ChannelGradientTool";
import { withSelectableColor } from "./sharedComponents/form/withSelectableColor";
import { withSelectMultipleColors } from "./sharedComponents/form/withSelectMultipleColors";
import { ColorInfo } from "./sharedComponents/color/ColorInfo";
import { CompareModelNoise } from "./noise/CompareModelNoise";
import { Sandbox } from "./Sandbox";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

interface AppPage {
  title: string;
  description?: string;
  path: string; //do not include the slash at start
  Component: ComponentType<{}>;
}

export const Home = () => <HomeMenu />;

/**
 * should appear in the order that I want in the menu
 * could allow subpage support to do nesting
 *
 * cannot include home here, unless putting it last
 * because if not using Route exact, the empty path will match everything
 */

const PAGES: AppPage[] = [
  {
    title: "Plot Group Properties",
    path: "plot-features",
    Component: PlotFeaturesTool
  },
  {
    title: "Group Property Histograms",
    path: "histogram",
    Component: HistogramTool
  },
  {
    title: "Color Difference",
    path: "difference",
    Component: withSelectableColor(VisualizeDifference)
  },
  {
    title: "Channel Change Gradients",
    path: "channels",
    Component: ChannelGradientTool
  },
  {
    title: "Noise to Channels",
    path: "channel-noise",
    Component: withSelectableColor(CompareNoiseChannels)
  },
  {
    title: "Noise to ColorSpaces",
    path: "model-noise",
    Component: withSelectMultipleColors(CompareModelNoise)
  },
  {
    title: "Generate Box Balls",
    path: "boxes",
    Component: NoisyBoxTool
  },
  {
    title: "Gradient Mode Comparison",
    path: "gradient",
    Component: GradientCompareTool
  },
  {
    title: "Hue Rainbow Comparison",
    path: "rainbow",
    Component: ColorWheelComparison
  },
  {
    title: "Force Color To Group",
    path: "force",
    Component: withSelectableColor(ForceToAll)
  },
  {
    title: "Color Info",
    path: "info",
    Component: withSelectableColor(ColorInfo)
  },
  {
    title: "View Groups",
    path: "groups",
    Component: RenderGroups
  },
  {
    title: "Group Boundaries",
    path: "boundaries",
    Component: TestBoundaries
  },
  {
    title: "Lightness v. Luminosity",
    path: "luminosity",
    Component: Sample
  },
  {
    title: "Group Property Data",
    path: "analysis",
    Component: GroupsAnalysis
  },
  {
    title: "Perceptron Results [unfinished]",
    path: "perceptron",
    Component: TestGroups
  },
  {
    title: "Sandbox",
    path: "sandbox",
    Component: Sandbox
  }
  //classify tool?  needs data input
];

export const HomeMenu = () => {
  return (
    <List>
      {PAGES.map((
        { title, path } //don't want to include home in list
      ) => (
        <ListItemText
          key={path}
          primary={<Link to={"/" + path}>{title}</Link>}
        />
      ))}
    </List>
  );
};

/**
 * props title and path refer to the current page
 */
export const TopMenu = ({
  currentTitle,
  currentPath
}: {
  currentTitle: string;
  currentPath: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton
          edge="start"
          aria-label="menu"
          onClick={() => setOpen(!open)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">{currentTitle}</Typography>
        <Menu open={open} onClose={() => setOpen(false)}>
          <MenuItem>
            <Link to={"/"}>Home</Link>
          </MenuItem>
          {PAGES.map(({ title, path }) => (
            <MenuItem key={path}>
              <Link to={"/" + path}>{title}</Link>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export const Body = () => {
  return (
    <Switch>
      {PAGES.map(({ title, path, Component }) => (
        <Route key={path} path={"/" + path}>
          <TopMenu currentTitle={title} currentPath={path} />
          <div className="content">
            <Component />
          </div>
        </Route>
      ))}
      <Route exact path="/">
        <TopMenu currentTitle="Home" currentPath="/" />
        <div className="content">
          <Home />
        </div>
      </Route>
    </Switch>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Body />
    </BrowserRouter>
  );
}
